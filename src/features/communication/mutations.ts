"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";
import { sendTemplateEmail } from "./send-template";
import {
  automationTriggerToggleSchema,
  emailScheduleSchema,
  emailTemplateSchema,
  sendManualEmailSchema,
  type EmailScheduleInput,
  type EmailTemplateInput,
  type SendManualEmailInput,
} from "./schemas";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  const { data: admin } = await supabase
    .from("admin_users")
    .select("role, status")
    .eq("user_id", user.id)
    .single();
  if (!admin || admin.status !== "active") {
    redirect("/admin/login");
  }
  return supabase;
}

// ---------------------------------------------------------------------------
// Template CRUD
// ---------------------------------------------------------------------------

function templateRow(parsed: EmailTemplateInput) {
  return {
    key: parsed.key,
    template_type: parsed.template_type,
    category: parsed.category,
    name_translations: parsed.name_translations,
    subject_translations: parsed.subject_translations,
    body_translations: parsed.body_translations,
    description: parsed.description || null,
    trigger_event: parsed.trigger_event,
    is_enabled: parsed.is_enabled,
    display_order: parsed.display_order,
  };
}

export async function createEmailTemplate(
  input: EmailTemplateInput
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = emailTemplateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("email_templates").insert(
    templateRow(parsed.data)
  );

  if (error) {
    return {
      success: false,
      error:
        error.code === "23505"
          ? "A template with this key already exists."
          : "Failed to create the template.",
    };
  }

  await recordAuditLog({
    action: "create",
    target_table: "email_templates",
    target_id: parsed.data.key,
  });
  revalidatePath("/admin/communication/templates");
  revalidatePath("/admin/communication/send");
  revalidatePath("/admin/communication/triggers");
  return { success: true };
}

export async function updateEmailTemplate(
  input: EmailTemplateInput
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = emailTemplateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!parsed.data.id) {
    return { success: false, error: "Template id is required." };
  }

  const { data: existing } = await supabase
    .from("email_templates")
    .select("id")
    .eq("id", parsed.data.id)
    .single();
  if (!existing) {
    return { success: false, error: "Template not found." };
  }

  const { error } = await supabase
    .from("email_templates")
    .update(templateRow(parsed.data))
    .eq("id", parsed.data.id);

  if (error) {
    return {
      success: false,
      error:
        error.code === "23505"
          ? "A template with this key already exists."
          : "Failed to save the template.",
    };
  }

  await recordAuditLog({
    action: "update",
    target_table: "email_templates",
    target_id: parsed.data.key,
  });
  revalidatePath("/admin/communication/templates");
  revalidatePath("/admin/communication/send");
  revalidatePath("/admin/communication/triggers");
  return { success: true };
}

/** Duplicate a template: unique key, "(Copy)" names, starts disabled. */
export async function duplicateEmailTemplate(
  templateId: string
): Promise<ActionResult<{ id: string }>> {
  const supabase = await requireAdmin();

  const { data: template } = await supabase
    .from("email_templates")
    .select(
      "key, template_type, category, name_translations, subject_translations, body_translations, description, trigger_event, display_order"
    )
    .eq("id", templateId)
    .single();

  if (!template) {
    return { success: false, error: "Template not found." };
  }

  let key = `${template.key}-copy`;
  for (let attempt = 2; ; attempt++) {
    const { data: existing } = await supabase
      .from("email_templates")
      .select("id")
      .eq("key", key)
      .maybeSingle();
    if (!existing) break;
    key = `${template.key}-copy-${attempt}`;
  }

  const appendCopy = (translations: Record<string, string> | null) => {
    if (!translations || typeof translations !== "object") return {};
    return Object.fromEntries(
      Object.entries(translations).map(([locale, value]) => [
        locale,
        typeof value === "string" ? `${value} (Copy)` : value,
      ])
    );
  };

  const { data: inserted, error } = await supabase
    .from("email_templates")
    .insert({
      key,
      template_type: template.template_type,
      category: template.category,
      name_translations: appendCopy(
        template.name_translations as Record<string, string> | null
      ),
      subject_translations: template.subject_translations,
      body_translations: template.body_translations,
      description: template.description,
      trigger_event: template.trigger_event,
      is_enabled: false,
      display_order: (template.display_order ?? 0) + 1,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return {
      success: false,
      error:
        error?.code === "23505"
          ? "A template with this key already exists."
          : "Failed to duplicate the template.",
    };
  }

  await recordAuditLog({
    action: "duplicate",
    target_table: "email_templates",
    target_id: key,
  });
  revalidatePath("/admin/communication/templates");
  return { success: true, data: { id: inserted.id } };
}

export async function toggleEmailTemplate(
  templateId: string,
  isEnabled: boolean
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("email_templates")
    .update({ is_enabled: isEnabled })
    .eq("id", templateId);

  if (error) {
    return { success: false, error: "Could not update the template." };
  }
  revalidatePath("/admin/communication/templates");
  revalidatePath("/admin/communication/send");
  return { success: true };
}

export async function deleteEmailTemplate(
  templateId: string
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const { data: template } = await supabase
    .from("email_templates")
    .select("key")
    .eq("id", templateId)
    .single();

  if (!template) {
    return { success: false, error: "Template not found." };
  }

  const { error } = await supabase
    .from("email_templates")
    .delete()
    .eq("id", templateId);

  if (error) {
    return { success: false, error: "Failed to delete the template." };
  }

  await recordAuditLog({
    action: "delete",
    target_table: "email_templates",
    target_id: template.key,
  });
  revalidatePath("/admin/communication/templates");
  revalidatePath("/admin/communication/send");
  revalidatePath("/admin/communication/triggers");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Manual send (composer)
// ---------------------------------------------------------------------------

/**
 * Send a template email manually from the composer: choose template,
 * language, reply-as address, recipient, and any variable overrides. Logged
 * to email_logs. Idempotency key prevents double-sends on retry.
 */
export async function sendManualEmail(
  input: SendManualEmailInput
): Promise<ActionResult<{ messageId?: string; mirrorNote?: string }>> {
  await requireAdmin();
  const parsed = sendManualEmailSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const variables: Record<string, string> = {};
  for (const [key, value] of Object.entries(parsed.data.variables ?? {})) {
    if (value && value.trim().length > 0) variables[key] = value;
  }
  if (parsed.data.to_name) {
    variables.name = parsed.data.to_name;
    variables.customer_email = parsed.data.to_email;
  }

  const result = await sendTemplateEmail({
    templateKey: parsed.data.template_key,
    language: parsed.data.language,
    toEmail: parsed.data.to_email,
    fromAddress: parsed.data.from_address,
    subjectOverride: parsed.data.subject_override || undefined,
    bodyOverride: parsed.data.body_override || undefined,
    context: variables,
    relatedType: "manual_send",
    idempotencyKey: `manual:${parsed.data.template_key}:${parsed.data.to_email}:${Date.now()}`,
  });

  if (!result.sent) {
    return { success: false, error: result.error ?? "Email could not be sent." };
  }
  await recordAuditLog({
    action: "send_email",
    target_table: "email_templates",
    target_id: parsed.data.template_key,
  });
  revalidatePath("/admin/communication/logs");
  return {
    success: true,
    data: { messageId: result.messageId, mirrorNote: result.mirrorNote },
  };
}

// ---------------------------------------------------------------------------
// Schedules
// ---------------------------------------------------------------------------

export async function createEmailSchedule(
  input: EmailScheduleInput
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = emailScheduleSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("email_schedules").insert({
    template_key: parsed.data.template_key,
    language: parsed.data.language,
    recipient_email: parsed.data.recipient_email,
    recipient_name: parsed.data.recipient_name || null,
    send_at: parsed.data.send_at,
    status: "pending",
    data: parsed.data.variables ?? {},
  });

  if (error) {
    return { success: false, error: "Could not schedule the email." };
  }
  revalidatePath("/admin/communication/schedules");
  return { success: true };
}

export async function cancelEmailSchedule(
  scheduleId: string
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("email_schedules")
    .update({ status: "cancelled" })
    .eq("id", scheduleId)
    .eq("status", "pending");

  if (error) {
    return { success: false, error: "Could not cancel the schedule." };
  }
  revalidatePath("/admin/communication/schedules");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Automation triggers
// ---------------------------------------------------------------------------

export async function toggleAutomationTrigger(input: {
  id: string;
  enabled: boolean;
}): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = automationTriggerToggleSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid trigger." };
  }

  const { error } = await supabase
    .from("automation_triggers")
    .update({ enabled: parsed.data.enabled })
    .eq("id", parsed.data.id);

  if (error) {
    return { success: false, error: "Could not update the trigger." };
  }
  revalidatePath("/admin/communication/triggers");
  return { success: true };
}
