import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { getEmailFrom, getResendClient } from "@/features/email/client";
import { sendEmail } from "@/features/email/send";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import {
  renderEmailTemplate,
  type RenderableTemplate,
  type TemplateRenderContext,
} from "./language";

export interface SectionTemplateInfo {
  sectionId: string;
  sectionName: string;
  fromAddress: string | null;
  autoReplyTemplate: RenderableTemplate | null;
}

/**
 * Resolve the inbox section mapped to a form source key plus its auto-reply
 * template (service-role: the lead flow runs with the anon session client).
 */
export async function getSectionTemplateForSource(
  source: string
): Promise<SectionTemplateInfo | null> {
  const supabase = createSupabaseServiceRoleClient();
  const { data: section } = await supabase
    .from("email_inbox_sections")
    .select(
      "id, name_translations, from_address, auto_reply_template_id, email_templates(subject_translations, body_translations)"
    )
    .eq("form_source_key", source)
    .maybeSingle();

  if (!section) return null;

  const related = section.email_templates as unknown as
    | { subject_translations: Record<string, string> | null; body_translations: Record<string, string> | null }
    | null;

  return {
    sectionId: section.id,
    sectionName: resolveTranslation(
      section.name_translations as Record<string, string> | null,
      "en"
    ),
    fromAddress: section.from_address,
    autoReplyTemplate: related
      ? {
          subject_translations: related.subject_translations,
          body_translations: related.body_translations,
        }
      : null,
  };
}

/** Record an outbound auto-reply / admin reply / template message in the thread. */
export async function recordOutboundMessage(input: {
  threadId: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  textContent: string;
  htmlContent?: string;
  providerMessageId?: string;
  rfcMessageId?: string;
  inReplyTo?: string;
  references?: string;
  status: "sent" | "failed";
  errorMessage?: string;
  /** Set false to keep the thread status (e.g. a resolved-thread follow-up). */
  updateThreadStatus?: boolean;
}): Promise<void> {
  const supabase = createSupabaseServiceRoleClient();
  await supabase.from("email_messages").insert({
    thread_id: input.threadId,
    direction: "outbound",
    from_email: input.fromEmail,
    to_email: input.toEmail,
    subject: input.subject,
    text_content: input.textContent,
    html_content: input.htmlContent ?? null,
    provider_message_id: input.providerMessageId ?? null,
    in_reply_to: input.inReplyTo ?? null,
    references: input.references ?? null,
    headers: input.rfcMessageId
      ? { message_id: input.rfcMessageId }
      : {},
    status: input.status,
    error_message: input.errorMessage ?? null,
    sent_at: input.status === "sent" ? new Date().toISOString() : null,
  });

  if (input.updateThreadStatus === false) return;

  await supabase
    .from("email_threads")
    .update({
      status: "waiting_on_customer",
      last_outbound_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
    })
    .eq("id", input.threadId);
}

/**
 * Render and send a template-library email. Records the outbound message in
 * the thread when `threadId` is provided. Never throws; returns whether the
 * email was actually sent (template missing/empty → not sent).
 */
export async function sendTemplateEmail(input: {
  template: RenderableTemplate | null;
  language: string;
  toEmail: string;
  customerName?: string | null;
  sectionName?: string | null;
  fromAddress?: string | null;
  threadId?: string;
  inReplyTo?: string;
  references?: string;
  idempotencyKey: string;
  updateThreadStatus?: boolean;
  extraVars?: TemplateRenderContext;
}): Promise<{ sent: boolean }> {
  if (!input.template) return { sent: false };

  const { subject, body } = renderEmailTemplate(input.template, input.language, {
    name: input.customerName,
    section_name: input.sectionName,
    ...input.extraVars,
  });

  if (!subject || !body) return { sent: false };

  const from = input.fromAddress || getEmailFrom();
  if (!from) return { sent: false };

  const result = await sendEmail({
    templateKey: "email_inbox_template",
    to: input.toEmail,
    from,
    data: { subject, body },
    headers: {
      ...(input.inReplyTo ? { "In-Reply-To": input.inReplyTo } : {}),
      ...(input.references ? { References: input.references } : {}),
    },
    relatedType: input.threadId ? "email_thread" : "lead",
    relatedId: input.threadId ?? undefined,
    idempotencyKey: input.idempotencyKey,
  });

  if (input.threadId) {
    await recordOutboundMessage({
      threadId: input.threadId,
      fromEmail: from,
      toEmail: input.toEmail,
      subject,
      textContent: body,
      providerMessageId: result.messageId,
      inReplyTo: input.inReplyTo,
      references: input.references,
      status: result.ok ? "sent" : "failed",
      errorMessage: result.error,
      updateThreadStatus: input.updateThreadStatus,
    });
  }

  return { sent: result.ok };
}

/**
 * Best-effort lookup of the RFC message-id for a sent email, so customer
 * replies can thread back. Used after template sends with threading.
 */
export async function fetchRfcMessageId(
  providerMessageId: string
): Promise<string | undefined> {
  const client = getResendClient();
  if (!client) return undefined;
  try {
    const { data, error } = await client.emails.get(providerMessageId);
    if (!error && data?.message_id) return data.message_id;
  } catch {
    // Best-effort only.
  }
  return undefined;
}
