import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { getEmailFrom, getResendClient } from "@/features/email/client";
import { sendEmail } from "@/features/email/send";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import {
  inboundWebhookSchema,
  receivedEmailSchema,
  type InboundWebhookPayload,
  type ReceivedEmail,
} from "./schemas";

type ServiceRoleClient = ReturnType<
  typeof createSupabaseServiceRoleClient
>;

const THREAD_MATCH_WINDOW_DAYS = 30;

/**
 * Resolve the inbox section for a received email by matching the envelope
 * recipients (to / received_for) against section routing addresses. Falls
 * back to the `other` section when nothing matches.
 */
async function resolveSection(
  supabase: ServiceRoleClient,
  recipients: string[]
): Promise<{ id: string; slug: string } | null> {
  const { data: sections, error } = await supabase
    .from("email_inbox_sections")
    .select("id, slug, routing_addresses, enabled")
    .eq("enabled", true);

  if (error || !sections || sections.length === 0) {
    return null;
  }

  const normalizedRecipients = recipients.map((r) =>
    r.trim().toLowerCase()
  );

  for (const section of sections) {
    const routing = (section.routing_addresses ?? []).map((r) =>
      r.trim().toLowerCase()
    );
    if (
      routing.some((address) => normalizedRecipients.includes(address))
    ) {
      return { id: section.id, slug: section.slug };
    }
  }

  const fallback = sections.find((s) => s.slug === "other");
  return fallback ? { id: fallback.id, slug: fallback.slug } : null;
}

/** Extract RFC 5322 message-ids from a raw In-Reply-To / References header. */
function extractMessageIds(rawHeader: string | null | undefined): string[] {
  if (!rawHeader) return [];
  return rawHeader
    .match(/<[^<>]+>/g)
    ?.map((id) => id.trim())
    .filter(Boolean) ?? [];
}

function normalizeSubject(subject: string): string {
  return subject
    .toLowerCase()
    .replace(/^(re|fw|fwd|aw|antw)\s*:\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse `"Name" <name@example.com>` / `Name <name@example.com>` / bare. */
function parseFromHeader(from: string): {
  name: string | null;
  email: string;
} {
  const match = from.match(/^(?:"?([^"<]*)"?\s*<([^>]+)>|([^@\s]+@[^@\s]+))$/);
  if (!match) {
    return { name: null, email: from.trim() };
  }
  if (match[3]) {
    return { name: null, email: match[3] };
  }
  const name = (match[1] ?? "").trim();
  return { name: name.length > 0 ? name : null, email: match[2].trim() };
}

/**
 * Find an existing thread for this inbound email:
 * 1. By threading headers (in-reply-to / references → a stored message's
 *    RFC message-id).
 * 2. By customer email + normalized subject (open threads, 30-day window).
 * Returns null when a new thread should be created.
 */
async function resolveThread(
  supabase: ServiceRoleClient,
  email: ReceivedEmail,
  customerEmail: string,
  subject: string
): Promise<{ id: string; section_id: string } | null> {
  const headers = email.headers ?? {};
  const threadIds = [
    ...extractMessageIds(headers["in-reply-to"]),
    ...extractMessageIds(headers["references"]),
  ];

  if (threadIds.length > 0) {
    for (const messageId of threadIds) {
      const { data: message } = await supabase
        .from("email_messages")
        .select("thread_id")
        .eq("headers->>message_id", messageId)
        .maybeSingle();
      if (message) {
        const { data: thread } = await supabase
          .from("email_threads")
          .select("id, section_id")
          .eq("id", message.thread_id)
          .single();
        if (thread) {
          return { id: thread.id, section_id: thread.section_id };
        }
      }
    }
  }

  const cutoff = new Date(
    Date.now() - THREAD_MATCH_WINDOW_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();
  const normalized = normalizeSubject(subject);

  const { data: threads, error } = await supabase
    .from("email_threads")
    .select("id, section_id, subject")
    .eq("customer_email", customerEmail.toLowerCase())
    .neq("status", "archived")
    .gte("last_message_at", cutoff)
    .limit(50);

  if (error || !threads) return null;

  for (const thread of threads) {
    if (normalizeSubject(thread.subject) === normalized) {
      return { id: thread.id, section_id: thread.section_id };
    }
  }

  return null;
}

/** Reopen a resolved thread when the customer writes back. */
async function reopenThreadIfNeeded(
  supabase: ServiceRoleClient,
  threadId: string
): Promise<void> {
  const { data: thread } = await supabase
    .from("email_threads")
    .select("status")
    .eq("id", threadId)
    .single();
  if (thread && thread.status === "resolved") {
    await supabase
      .from("email_threads")
      .update({ status: "needs_reply" })
      .eq("id", threadId);
  }
}

/** Record an outbound auto-reply / admin reply message in the thread. */
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
 * After a successful Resend send, fetch the RFC message-id so future
 * customer replies can thread back reliably. Best-effort: on failure the
 * fallback (customer email + subject) matching still applies.
 */
async function fetchRfcMessageId(
  providerMessageId: string
): Promise<string | undefined> {
  const client = getResendClient();
  if (!client) return undefined;
  try {
    const { data, error } = await client.emails.get(providerMessageId);
    if (!error && data?.message_id) {
      return data.message_id;
    }
  } catch {
    // Best-effort only.
  }
  return undefined;
}

/** Send the section's auto-reply (threading headers + idempotency). */
async function sendAutoReply(input: {
  section: {
    id: string;
    slug: string;
    name_translations: Record<string, string> | null;
    from_address: string | null;
    auto_reply_subject_translations: Record<string, string> | null;
    auto_reply_body_translations: Record<string, string> | null;
  };
  thread: { id: string; customer_email: string; customer_name: string | null };
  inboundMessage: {
    id: string;
    rfcMessageId?: string;
    subject: string;
    references?: string;
  };
}): Promise<void> {
  const subject = resolveTranslation(
    input.section.auto_reply_subject_translations,
    "en"
  );
  const body = resolveTranslation(
    input.section.auto_reply_body_translations,
    "en"
  );

  if (!subject || !body) return;

  const from = input.section.from_address || getEmailFrom();
  if (!from) return;

  const sectionName = resolveTranslation(
    input.section.name_translations,
    "en"
  );

  const inReplyTo = input.inboundMessage.rfcMessageId
    ? `<${input.inboundMessage.rfcMessageId}>`
    : undefined;
  const references = [
    ...extractMessageIds(input.inboundMessage.references),
    ...(input.inboundMessage.rfcMessageId
      ? [input.inboundMessage.rfcMessageId]
      : []),
  ]
    .map((id) => `<${id}>`)
    .join(" ");

  const result = await sendEmail({
    templateKey: "email_inbox_auto_reply",
    to: input.thread.customer_email,
    from,
    data: {
      customer_name: input.thread.customer_name,
      section_name: sectionName,
      subject,
      body,
    },
    headers: {
      ...(inReplyTo ? { "In-Reply-To": inReplyTo } : {}),
      ...(references ? { References: references } : {}),
    },
    relatedType: "email_thread",
    relatedId: input.thread.id,
    idempotencyKey: `email_inbox_auto_reply:${input.thread.id}:${input.inboundMessage.id}`,
  });

  const rfcMessageId = result.messageId
    ? await fetchRfcMessageId(result.messageId)
    : undefined;

  await recordOutboundMessage({
    threadId: input.thread.id,
    fromEmail: from,
    toEmail: input.thread.customer_email,
    subject,
    textContent: body,
    providerMessageId: result.messageId,
    rfcMessageId,
    inReplyTo: inReplyTo
      ? inReplyTo.replace(/^<|>$/g, "")
      : undefined,
    references: references || undefined,
    status: result.ok ? "sent" : "failed",
    errorMessage: result.error,
  });
}

/**
 * Process an `email.received` webhook: verify → fetch full email → resolve
 * section + thread → persist → auto-reply. Idempotent by the Resend email id.
 */
export async function processInboundEmail(
  payload: InboundWebhookPayload
): Promise<{ ok: boolean; duplicate?: boolean }> {
  const parsed = inboundWebhookSchema.safeParse(payload);
  if (!parsed.success) {
    console.error("Invalid inbound webhook payload:", parsed.error.message);
    return { ok: false };
  }

  const emailId = parsed.data.data?.email_id ?? parsed.data.data?.id;
  if (!emailId) {
    return { ok: true };
  }

  const client = getResendClient();
  if (!client) {
    console.warn("Resend not configured; skipping inbound email.");
    return { ok: true };
  }

  let rawEmail: ReceivedEmail;
  try {
    const { data, error } = await client.emails.receiving.get(emailId);
    if (error) {
      console.error("Resend received-email fetch error:", error.message);
      return { ok: true };
    }
    const parsedEmail = receivedEmailSchema.safeParse(data);
    if (!parsedEmail.success) {
      console.error("Invalid received email shape:", parsedEmail.error.message);
      return { ok: true };
    }
    rawEmail = parsedEmail.data;
  } catch (error) {
    console.error("Resend received-email fetch threw:", error);
    return { ok: true };
  }

  const supabase = createSupabaseServiceRoleClient();

  // Idempotency: this email was already processed (webhook retry).
  const { data: existing } = await supabase
    .from("email_messages")
    .select("id")
    .eq("provider_message_id", emailId)
    .maybeSingle();
  if (existing) {
    return { ok: true, duplicate: true };
  }

  const section = await resolveSection(supabase, [
    ...rawEmail.to,
    ...(rawEmail.received_for ?? []),
  ]);
  if (!section) {
    console.warn("No email inbox section found; skipping inbound email.");
    return { ok: true };
  }

  const { name, email: customerEmail } = parseFromHeader(rawEmail.from);
  const rfcMessageId = rawEmail.message_id || undefined;
  const existingThread = await resolveThread(
    supabase,
    rawEmail,
    customerEmail,
    rawEmail.subject
  );

  let threadId: string;
  if (existingThread) {
    threadId = existingThread.id;
    // Keep the thread in its original section (replies stay grouped).
  } else {
    const threadInsert = await supabase
      .from("email_threads")
      .insert({
        section_id: section.id,
        customer_email: customerEmail.toLowerCase(),
        customer_name: name,
        subject: rawEmail.subject,
        status: "needs_reply",
        source: "inbound_email",
        last_inbound_at: rawEmail.created_at ?? new Date().toISOString(),
      })
      .select("id")
      .single();

    if (threadInsert.error || !threadInsert.data) {
      console.error("Thread insert error:", threadInsert.error?.message);
      return { ok: false };
    }
    threadId = threadInsert.data.id;
  }

  const headers = rawEmail.headers ?? {};
  const messageInsert = await supabase.from("email_messages").insert({
    thread_id: threadId,
    direction: "inbound",
    from_email: customerEmail,
    to_email: rawEmail.to[0] ?? "",
    subject: rawEmail.subject,
    text_content: rawEmail.text ?? "",
    html_content: rawEmail.html ?? null,
    provider_message_id: emailId,
    in_reply_to: headers["in-reply-to"] ?? null,
    references: headers["references"] ?? null,
    headers: {
      ...(rfcMessageId ? { message_id: rfcMessageId } : {}),
      received_at: rawEmail.created_at ?? null,
    },
    status: "received",
    sent_at: rawEmail.created_at ?? null,
  });

  if (messageInsert.error) {
    console.error("Message insert error:", messageInsert.error.message);
    return { ok: false };
  }

  await supabase
    .from("email_threads")
    .update({
      status: "needs_reply",
      last_inbound_at: rawEmail.created_at ?? new Date().toISOString(),
      last_message_at: rawEmail.created_at ?? new Date().toISOString(),
      customer_name: name ?? undefined,
    })
    .eq("id", threadId);
  await reopenThreadIfNeeded(supabase, threadId);

  // Auto-reply (only for inbound-email threads; form threads ack differently).
  if (section.slug !== "other") {
    const { data: sectionFull } = await supabase
      .from("email_inbox_sections")
      .select(
        "name_translations, from_address, auto_reply_enabled, auto_reply_subject_translations, auto_reply_body_translations"
      )
      .eq("id", section.id)
      .single();
    if (sectionFull?.auto_reply_enabled) {
      const { data: thread } = await supabase
        .from("email_threads")
        .select("id, customer_email, customer_name, source")
        .eq("id", threadId)
        .single();
      if (thread && thread.source === "inbound_email") {
        await sendAutoReply({
          section: {
            id: section.id,
            slug: section.slug,
            name_translations: sectionFull.name_translations as Record<
              string,
              string
            > | null,
            from_address: sectionFull.from_address,
            auto_reply_subject_translations:
              sectionFull.auto_reply_subject_translations as Record<
                string,
                string
              > | null,
            auto_reply_body_translations:
              sectionFull.auto_reply_body_translations as Record<
                string,
                string
              > | null,
          },
          thread: {
            id: thread.id,
            customer_email: thread.customer_email,
            customer_name: thread.customer_name,
          },
          inboundMessage: {
            id: emailId,
            rfcMessageId,
            subject: rawEmail.subject,
            references: headers["references"] ?? undefined,
          },
        });
      }
    }
  }

  return { ok: true };
}
