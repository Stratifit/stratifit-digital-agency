"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";
import { emailTemplateSchema, type EmailTemplateInput } from "./template-schemas";

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

  const { error } = await supabase.from("email_templates").insert({
    key: parsed.data.key,
    category: parsed.data.category,
    name_translations: parsed.data.name_translations,
    subject_translations: parsed.data.subject_translations,
    body_translations: parsed.data.body_translations,
    description: parsed.data.description || null,
    trigger_event: parsed.data.trigger_event,
    is_enabled: parsed.data.is_enabled,
    display_order: parsed.data.display_order,
  });

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
  revalidatePath("/admin/email/templates");
  revalidatePath("/admin/email/sections");
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
    .update({
      key: parsed.data.key,
      category: parsed.data.category,
      name_translations: parsed.data.name_translations,
      subject_translations: parsed.data.subject_translations,
      body_translations: parsed.data.body_translations,
      description: parsed.data.description || null,
      trigger_event: parsed.data.trigger_event,
      is_enabled: parsed.data.is_enabled,
      display_order: parsed.data.display_order,
    })
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
  revalidatePath("/admin/email/templates");
  revalidatePath("/admin/email/sections");
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
  revalidatePath("/admin/email/templates");
  revalidatePath("/admin/email/sections");
  return { success: true };
}
