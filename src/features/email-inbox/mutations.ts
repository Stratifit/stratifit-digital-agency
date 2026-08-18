"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDefaultFrom } from "@/features/communication/sender";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";
import { sendTemplateEmail } from "./template-sends";
import {
  emailReplySchema,
  emailSectionSchema,
  type EmailReplyInput,
  type EmailSectionInput,
  type ThreadStatus,
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

/**
 * Extract RFC 5322 message-ids from a raw In-Reply-To / References header,
 * stripped of angle brackets (the stored `headers->>message_id` and the
 * `references`/`in_reply_to` columns are unbracketed ids).
 */
function extractMessageIds(rawHeader: string | null | undefined): string[] {
  if (!rawHeader) return [];
  return (
    rawHeader
      .match(/<[^<>]+>/g)
      ?.map((id) => id.replace(/^<|>$/g, "").trim())
      .filter(Boolean) ?? []
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
 * Send an admin reply to the thread's customer via the Communication
 * Engine and record the outbound message. Reply recipient is always the
 * stored customer email (open-relay prevention). Returns
 * `{ success, data: { messageId } }`.
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

  const from = parsed.data.from_address?.trim() || section?.from_address || getDefaultFrom();
  if (!from) {
    return { success: false, error: "Sending is not configured." };
  }

  const threading = await getThreadingContext(thread.id);
  const outboundKey = crypto.randomUUID();
  const customSubject = parsed.data.subject?.trim();
  const subject = customSubject
    ? customSubject
    : /^re\s*:/i.test(thread.subject)
      ? thread.subject
      : `Re: ${thread.subject}`;

  // The reply is a free-form admin message — rendered as an on-the-fly
  // template so the whole pipeline (render → SMTP send → log → thread) stays
  // identical for every send.
  const result = await sendTemplateEmail({
    template: {
      subject_translations: { en: subject },
      body_translations: { en: parsed.data.body },
    },
    language: "en",
    toEmail: thread.customer_email,
    fromAddress: from,
    headers: {
      ...(threading.inReplyTo ? { "In-Reply-To": threading.inReplyTo } : {}),
      ...(threading.references ? { References: threading.references } : {}),
    },
    threadId: thread.id,
    inReplyTo: threading.inReplyTo
      ? threading.inReplyTo.replace(/^<|>$/g, "")
      : undefined,
    references: threading.references,
    idempotencyKey: `email_inbox_reply:${thread.id}:${outboundKey}`,
    relatedType: "email_thread",
    relatedId: thread.id,
  });

  if (!result.sent) {
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

/**
 * When a conversation is resolved, optionally send the section's
 * `on_thread_resolved` template in the thread's language (opt-in per
 * section). Never fails the resolve action.
 */
async function maybeSendResolvedEmail(threadId: string): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: thread } = await supabase
      .from("email_threads")
      .select(
        "id, customer_email, customer_name, language, section_id, email_inbox_sections(from_address, resolved_email_enabled, resolved_template_id, name_translations)"
      )
      .eq("id", threadId)
      .single();

    if (!thread) return;

    const section = thread.email_inbox_sections as unknown as {
      from_address: string | null;
      resolved_email_enabled: boolean;
      resolved_template_id: string | null;
      name_translations: Record<string, string> | null;
    } | null;

    if (!section?.resolved_email_enabled || !section.resolved_template_id) {
      return;
    }

    const { data: template } = await supabase
      .from("email_templates")
      .select("subject_translations, body_translations")
      .eq("id", section.resolved_template_id)
      .single();
    if (!template) return;

    await sendTemplateEmail({
      template: {
        subject_translations:
          template.subject_translations as Record<string, string> | null,
        body_translations:
          template.body_translations as Record<string, string> | null,
      },
      language: thread.language ?? "en",
      toEmail: thread.customer_email,
      context: {
        name: thread.customer_name,
        section_name: resolveTranslation(section.name_translations, "en"),
      },
      fromAddress: section.from_address ?? undefined,
      threadId: thread.id,
      idempotencyKey: `email_inbox_template:resolved:${thread.id}`,
      updateThreadStatus: false,
    });
  } catch (error) {
    console.error(
      "Resolved-template send error:",
      error instanceof Error ? error.message : error
    );
  }
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

  if (status === "resolved") {
    // Automatic send when a section is finished (opt-in per section).
    await maybeSendResolvedEmail(threadId);
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
// Bulk delete
// ---------------------------------------------------------------------------

const MAX_BULK_DELETE = 1000;

/**
 * Delete selected threads (admin only). Messages cascade, and archived/
 * resolved threads are deleted just like any other. Returns the count of
 * rows actually deleted.
 */
export async function deleteEmailThreads(
  ids: string[]
): Promise<ActionResult<{ deleted: number }>> {
  await requireAdmin();

  const uniqueIds = [
    ...new Set(ids.filter((id) => typeof id === "string" && id.length > 0)),
  ];
  if (uniqueIds.length === 0) {
    return { success: true, data: { deleted: 0 } };
  }
  if (uniqueIds.length > MAX_BULK_DELETE) {
    return { success: false, error: "Too many threads selected." };
  }

  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("email_threads")
    .delete({ count: "exact" })
    .in("id", uniqueIds);

  if (error) {
    return { success: false, error: "Could not delete the threads." };
  }

  await recordAuditLog({
    action: "bulk_delete_threads",
    target_table: "email_threads",
    target_id: uniqueIds.join(","),
  });
  revalidatePath("/admin/email/inbox");
  return { success: true, data: { deleted: count ?? uniqueIds.length } };
}

/**
 * Delete every thread matching the current inbox filter (admin only).
 * `status` omitted → all non-archived threads in the section.
 */
export async function deleteAllEmailThreads(input: {
  sectionId?: string;
  status?: ThreadStatus;
}): Promise<ActionResult<{ deleted: number }>> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  let query = supabase.from("email_threads").delete({ count: "exact" });

  if (input.sectionId) {
    query = query.eq("section_id", input.sectionId);
  }
  if (input.status) {
    query = query.eq("status", input.status);
  } else {
    query = query.neq("status", "archived");
  }

  const { count, error } = await query;

  if (error) {
    return { success: false, error: "Could not delete the conversations." };
  }

  await recordAuditLog({
    action: "delete_all_threads",
    target_table: "email_threads",
    target_id: input.sectionId ?? "all",
  });
  revalidatePath("/admin/email/inbox");
  return { success: true, data: { deleted: count ?? 0 } };
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
    language: parsed.data.language || null,
    auto_reply_enabled: parsed.data.auto_reply_enabled,
    auto_reply_subject_translations:
      parsed.data.auto_reply_subject_translations,
    auto_reply_body_translations: parsed.data.auto_reply_body_translations,
    auto_reply_template_id: parsed.data.auto_reply_template_id || null,
    resolved_template_id: parsed.data.resolved_template_id || null,
    resolved_email_enabled: parsed.data.resolved_email_enabled,
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
      language: parsed.data.language || null,
      auto_reply_enabled: parsed.data.auto_reply_enabled,
      auto_reply_subject_translations:
        parsed.data.auto_reply_subject_translations,
      auto_reply_body_translations: parsed.data.auto_reply_body_translations,
      auto_reply_template_id: parsed.data.auto_reply_template_id || null,
      resolved_template_id: parsed.data.resolved_template_id || null,
      resolved_email_enabled: parsed.data.resolved_email_enabled,
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
