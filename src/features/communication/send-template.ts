import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { AutoFillContext } from "./auto-fill";
import { renderEmailHtml, renderEmailText, renderTemplateContent } from "./renderer";
import { getDefaultFrom, sendEmail } from "./sender";
import { SUPPORTED_LANGUAGES, type RenderableTemplate, type SupportedLanguage } from "./types";

/**
 * Orchestration: load a template (by key or passed in), render it for the
 * requested language with auto-filled variables, send it through the SMTP
 * sender, log it to `email_logs`, and optionally record it as an outbound
 * message on a conversation thread. Never throws — returns the outcome.
 */

function normalizeLanguage(language: string): SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(language)
    ? (language as SupportedLanguage)
    : "en";
}

/** Record a send in email_logs (idempotent by idempotency_key when given). */
export async function recordEmailLog(input: {
  templateKey: string | null;
  toEmail: string;
  fromEmail: string;
  subject: string;
  language: string;
  status: "sent" | "failed";
  providerMessageId?: string;
  errorMessage?: string;
  relatedType?: string;
  relatedId?: string;
  idempotencyKey?: string;
}): Promise<void> {
  const supabase = createSupabaseServiceRoleClient();
  const row = {
    template_key: input.templateKey,
    recipient_email: input.toEmail,
    sender_email: input.fromEmail,
    subject: input.subject,
    language: normalizeLanguage(input.language),
    status: input.status,
    provider_message_id: input.providerMessageId ?? null,
    error_message: input.errorMessage ?? null,
    related_type: input.relatedType ?? null,
    related_id: input.relatedId ?? null,
    idempotency_key: input.idempotencyKey ?? null,
    sent_at: input.status === "sent" ? new Date().toISOString() : null,
  };
  if (input.idempotencyKey) {
    await supabase
      .from("email_logs")
      .upsert(row, { onConflict: "idempotency_key", ignoreDuplicates: true });
  } else {
    await supabase.from("email_logs").insert(row);
  }
}

/** Record an outbound message on a conversation thread. */
export async function recordOutboundMessage(input: {
  threadId: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  textContent: string;
  providerMessageId?: string;
  inReplyTo?: string;
  references?: string;
  status: "sent" | "failed";
  errorMessage?: string;
  /** Set false to keep the thread status (e.g. a resolved-thread follow-up). */
  updateThreadStatus?: boolean;
}): Promise<void> {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from("email_messages").insert({
    thread_id: input.threadId,
    direction: "outbound",
    from_email: input.fromEmail,
    to_email: input.toEmail,
    subject: input.subject,
    text_content: input.textContent,
    provider_message_id: input.providerMessageId ?? null,
    in_reply_to: input.inReplyTo ?? null,
    references: input.references ?? null,
    headers: {},
    status: input.status,
    error_message: input.errorMessage ?? null,
    sent_at: input.status === "sent" ? new Date().toISOString() : null,
  });
  if (error) {
    console.error("Outbound message record error:", error.message);
  }

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

export interface SendTemplateInput {
  /** Template key to load from the DB (mutually exclusive with `template`). */
  templateKey?: string;
  /** Already-loaded template content (mutually exclusive with `templateKey`). */
  template?: RenderableTemplate;
  language: string;
  toEmail: string;
  fromAddress?: string;
  context?: AutoFillContext;
  /** Admin overrides from the composer. */
  subjectOverride?: string;
  bodyOverride?: string;
  headers?: Record<string, string>;
  threadId?: string;
  inReplyTo?: string;
  references?: string;
  idempotencyKey?: string;
  updateThreadStatus?: boolean;
  relatedType?: string;
  relatedId?: string;
}

export interface SendTemplateResult {
  sent: boolean;
  messageId?: string;
  error?: string;
}

export async function sendTemplateEmail(
  input: SendTemplateInput
): Promise<SendTemplateResult> {
  const supabase = createSupabaseServiceRoleClient();

  // Idempotency: an existing log entry for this key means it was already
  // processed (webhook retry, duplicate trigger, double-click).
  if (input.idempotencyKey) {
    const { data: existing } = await supabase
      .from("email_logs")
      .select("id")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing) {
      return { sent: true };
    }
  }

  let template = input.template;
  if (!template && input.templateKey) {
    const { data } = await supabase
      .from("email_templates")
      .select("subject_translations, body_translations")
      .eq("key", input.templateKey)
      .maybeSingle();
    template = (data as RenderableTemplate | null) ?? undefined;
  }
  if (!template) {
    return { sent: false, error: "Template not found." };
  }

  const rendered = renderTemplateContent(
    template,
    input.language,
    input.context ?? {}
  );
  const subject = input.subjectOverride?.trim() || rendered.subject;
  const body = input.bodyOverride?.trim() || rendered.body;
  if (!subject || !body) {
    return { sent: false, error: "Template content is empty." };
  }

  const from = input.fromAddress || getDefaultFrom();
  if (!from) {
    return { sent: false, error: "No from-address configured." };
  }

  const language = normalizeLanguage(input.language);
  const result = await sendEmail({
    to: input.toEmail,
    from,
    subject,
    html: await renderEmailHtml({ subject, body, language }),
    text: renderEmailText(subject, body),
    headers: input.headers,
  });

  await recordEmailLog({
    templateKey: input.templateKey ?? null,
    toEmail: input.toEmail,
    fromEmail: from,
    subject,
    language,
    status: result.ok ? "sent" : "failed",
    providerMessageId: result.messageId,
    errorMessage: result.error,
    relatedType: input.relatedType,
    relatedId: input.relatedId,
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

  if (!result.ok) {
    return { sent: false, messageId: undefined, error: result.error };
  }
  return { sent: true, messageId: result.messageId };
}
