"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getEmailFrom, getResendClient } from "@/features/email/client";
import { sendEmail } from "@/features/email/send";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";
import { recordOutboundMessage } from "./inbound";
import { emailReplySchema, emailSectionSchema, type EmailReplyInput, type EmailSectionInput } from "./schemas";

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

function extractMessageIds(rawHeader: string | null | undefined): string[] {
  if (!rawHeader) return [];
  return (
    rawHeader.match(/<[^<>]+>/g)?.map((id) => id.trim()).filter(Boolean) ?? []
  );
}

/** RFC message-id of the last inbound message (threading anchor). */
async function getThreadingContext(threadId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: lastInbound } = await supabase
    .from("email_messages")
    .select("headers, references")
    .eq("thread_id", threadId)
    .eq("direction", "inbound")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const headers = (lastInbound?.headers ?? {}) as Record<string, unknown>;
  const rfcMessageId =
    typeof headers["message_id"] === "string"
      ? headers["message_id"]
      : undefined;

  const references = [
    ...extractMessageIds(
      typeof lastInbound?.references === "string"
        ? lastInbound.references
        : undefined
    ),
    ...(rfcMessageId ? [rfcMessageId] : []),
  ]
    .map((id) => `<${id}>`)
    .join(" ");

  return {
    inReplyTo: rfcMessageId ? `<${rfcMessageId}>` : undefined,
    references: references || undefined,
  };
}

/**
 * Send an admin reply to the thread's customer via Resend and record the
 * outbound message. Reply recipient is always the stored customer email
 * (open-relay prevention). Returns `{ success, data: { messageId } }`.
 */
export async function sendEmailReply(
  input: EmailReplyInput
): Promise<ActionResult<{ messageId?: string }>> {
  const supabase = await requireAdmin();

  const parsed = emailReplySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the reply for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { data: thread } = await supabase
    .from("email_threads")
    .select("id, section_id, customer_email, subject, status")
    .eq("id", parsed.data.thread_id)
    .single();

  if (!thread) {
    return { success: false, error: "Thread not found." };
  }
  if (thread.status === "archived") {
    return { success: false, error: "Archived threads cannot receive replies." };
  }

  const { data: section } = await supabase
    .from("email_inbox_sections")
    .select("from_address")
    .eq("id", thread.section_id)
    .single();

  const from = section?.from_address || getEmailFrom();
  if (!from) {
    return { success: false, error: "Sending is not configured." };
  }

  const threading = await getThreadingContext(thread.id);
  const outboundKey = crypto.randomUUID();
  const subject = /^re\s*:/i.test(thread.subject)
    ? thread.subject
    : `Re: ${thread.subject}`;

  const result = await sendEmail({
    templateKey: "email_inbox_reply",
    to: thread.customer_email,
    from,
    data: { subject, body: parsed.data.body },
    headers: {
      ...(threading.inReplyTo ? { "In-Reply-To": threading.inReplyTo } : {}),
      ...(threading.references ? { References: threading.references } : {}),
    },
    relatedType: "email_thread",
    relatedId: thread.id,
    idempotencyKey: `email_inbox_reply:${thread.id}:${outboundKey}`,
  });

  // Fetch the RFC message-id so the customer's reply threads back reliably.
  let rfcMessageId: string | undefined;
  if (result.messageId) {
    const client = getResendClient();
    try {
      const { data, error } = await client!.emails.get(result.messageId);
      if (!error && data?.message_id) {
        rfcMessageId = data.message_id;
      }
    } catch {
      // Best-effort; subject fallback matching still applies.
    }
  }

  await recordOutboundMessage({
    threadId: thread.id,
    fromEmail: from,
    toEmail: thread.customer_email,
    subject,
    textContent: parsed.data.body,
    providerMessageId: result.messageId,
    rfcMessageId,
    inReplyTo: threading.inReplyTo,
    references: threading.references,
    status: result.ok ? "sent" : "failed",
    errorMessage: result.error,
  });

  if (!result.ok) {
    return { success: false, error: "Reply could not be sent." };
  }

  await recordAuditLog({
    action: "email_reply",
    target_table: "email_threads",
    target_id: thread.id,
  });
  revalidatePath("/admin/email/inbox");
  revalidatePath(`/admin/email/inbox/${thread.id}`);

  return { success: true, data: { messageId: result.messageId } };
}

async function updateThreadStatus(
  threadId: string,
  status: "resolved" | "archived"
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("email_threads")
    .update({ status })
    .eq("id", threadId);

  if (error) {
    return { success: false, error: "Could not update the thread." };
  }

  await recordAuditLog({
    action: status === "resolved" ? "resolve_thread" : "archive_thread",
    target_table: "email_threads",
    target_id: threadId,
  });
  revalidatePath("/admin/email/inbox");
  revalidatePath(`/admin/email/inbox/${threadId}`);
  return { success: true };
}

export async function resolveEmailThread(
  threadId: string
): Promise<ActionResult> {
  return updateThreadStatus(threadId, "resolved");
}

export async function archiveEmailThread(
  threadId: string
): Promise<ActionResult> {
  return updateThreadStatus(threadId, "archived");
}

/** Reopen an archived or resolved thread (e.g. after a status change). */
export async function reopenEmailThread(
  threadId: string
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("email_threads")
    .update({ status: "needs_reply" })
    .eq("id", threadId);

  if (error) {
    return { success: false, error: "Could not reopen the thread." };
  }

  await recordAuditLog({
    action: "reopen_thread",
    target_table: "email_threads",
    target_id: threadId,
  });
  revalidatePath("/admin/email/inbox");
  revalidatePath(`/admin/email/inbox/${threadId}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Section CRUD
// ---------------------------------------------------------------------------

export async function createEmailSection(
  input: EmailSectionInput
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = emailSectionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("email_inbox_sections").insert({
    slug: parsed.data.slug,
    name_translations: parsed.data.name_translations,
    enabled: parsed.data.enabled,
    routing_addresses: parsed.data.routing_addresses,
    form_source_key: parsed.data.form_source_key,
    from_address: parsed.data.from_address || null,
    auto_reply_enabled: parsed.data.auto_reply_enabled,
    auto_reply_subject_translations:
      parsed.data.auto_reply_subject_translations,
    auto_reply_body_translations: parsed.data.auto_reply_body_translations,
    display_order: parsed.data.display_order,
  });

  if (error) {
    return {
      success: false,
      error:
        error.code === "23505"
          ? "A section with this slug already exists."
          : "Failed to create the section.",
    };
  }

  await recordAuditLog({
    action: "create",
    target_table: "email_inbox_sections",
    target_id: parsed.data.slug,
  });
  revalidatePath("/admin/email/sections");
  return { success: true };
}

export async function updateEmailSection(
  input: EmailSectionInput
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = emailSectionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!parsed.data.id) {
    return { success: false, error: "Section id is required." };
  }

  const { data: existing } = await supabase
    .from("email_inbox_sections")
    .select("id")
    .eq("id", parsed.data.id)
    .single();
  if (!existing) {
    return { success: false, error: "Section not found." };
  }

  const { error } = await supabase
    .from("email_inbox_sections")
    .update({
      slug: parsed.data.slug,
      name_translations: parsed.data.name_translations,
      enabled: parsed.data.enabled,
      routing_addresses: parsed.data.routing_addresses,
      form_source_key: parsed.data.form_source_key,
      from_address: parsed.data.from_address || null,
      auto_reply_enabled: parsed.data.auto_reply_enabled,
      auto_reply_subject_translations:
        parsed.data.auto_reply_subject_translations,
      auto_reply_body_translations: parsed.data.auto_reply_body_translations,
      display_order: parsed.data.display_order,
    })
    .eq("id", parsed.data.id);

  if (error) {
    return {
      success: false,
      error:
        error.code === "23505"
          ? "A section with this slug already exists."
          : "Failed to save the section.",
    };
  }

  await recordAuditLog({
    action: "update",
    target_table: "email_inbox_sections",
    target_id: parsed.data.slug,
  });
  revalidatePath("/admin/email/sections");
  revalidatePath("/admin/email/inbox");
  return { success: true };
}

export async function deleteEmailSection(
  sectionId: string
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const { data: section } = await supabase
    .from("email_inbox_sections")
    .select("slug")
    .eq("id", sectionId)
    .single();

  if (!section) {
    return { success: false, error: "Section not found." };
  }
  if (section.slug === "other") {
    return { success: false, error: "The fallback section cannot be deleted." };
  }

  const { data: threads, error: threadsError } = await supabase
    .from("email_threads")
    .select("id")
    .eq("section_id", sectionId)
    .limit(1);

  if (!threadsError && (threads?.length ?? 0) > 0) {
    return {
      success: false,
      error: "Move or archive this section's threads before deleting it.",
    };
  }

  const { error } = await supabase
    .from("email_inbox_sections")
    .delete()
    .eq("id", sectionId);

  if (error) {
    return { success: false, error: "Failed to delete the section." };
  }

  await recordAuditLog({
    action: "delete",
    target_table: "email_inbox_sections",
    target_id: section.slug,
  });
  revalidatePath("/admin/email/sections");
  return { success: true };
}
