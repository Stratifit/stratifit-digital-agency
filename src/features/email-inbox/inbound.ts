import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { getDefaultFrom } from "@/features/communication/sender";
import { parseSenderHeader } from "@/features/communication/auto-fill";
import { sendTemplateEmail } from "./template-sends";
import { detectEmailLanguage } from "./language";
import { receivedEmailSchema, type ReceivedEmail } from "./schemas";
import { selectSectionForLanguage } from "./routing";

type ServiceRoleClient = ReturnType<typeof createSupabaseServiceRoleClient>;

const THREAD_MATCH_WINDOW_DAYS = 30;

/**
 * Resolve the inbox section for a received email by matching the envelope
 * recipients (to / received_for) against section routing addresses, preferring
 * a section whose `language` matches the detected language. Falls back to the
 * `other` section when nothing matches.
 */
async function resolveSection(
  supabase: ServiceRoleClient,
  recipients: string[],
  language: ReturnType<typeof detectEmailLanguage>
): Promise<{ id: string; slug: string } | null> {
  const { data: sections, error } = await supabase
    .from("email_inbox_sections")
    .select("id, slug, language, routing_addresses, enabled")
    .eq("enabled", true);

  if (error || !sections || sections.length === 0) {
    return null;
  }

  return selectSectionForLanguage(
    sections.map((section) => ({
      id: section.id,
      slug: section.slug,
      language: section.language ?? null,
      routing_addresses: section.routing_addresses ?? [],
    })),
    recipients,
    language
  );
}

/** Extract RFC 5322 message-ids from a raw In-Reply-To / References header. */
function extractMessageIds(rawHeader: string | null | undefined): string[] {
  if (!rawHeader) return [];
  return (
    rawHeader
      .match(/<[^<>]+>/g)
      ?.map((id) => id.replace(/^<|>$/g, "").trim())
      .filter(Boolean) ?? []
  );
}

function normalizeSubject(subject: string): string {
  return subject
    .toLowerCase()
    .replace(/^(re|fw|fwd|aw|antw)\s*:\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
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

/** Send the section's inline auto-reply (fallback when no template is set). */
async function sendInlineAutoReply(input: {
  section: {
    id: string;
    slug: string;
    auto_reply_subject_translations: Record<string, string> | null;
    auto_reply_body_translations: Record<string, string> | null;
  };
  thread: { id: string; customer_email: string; customer_name: string | null };
  inboundMessage: {
    id: string;
    rfcMessageId?: string;
    references?: string;
  };
}): Promise<void> {
  const subject = input.section.auto_reply_subject_translations?.en ?? "";
  const body = input.section.auto_reply_body_translations?.en ?? "";

  if (!subject || !body) return;

  const from = getDefaultFrom();
  if (!from) return;

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

  await sendTemplateEmail({
    // Inline auto-reply fields are single-language (English), rendered as an
    // on-the-fly template so the pipeline (render → send → log → thread) stays
    // identical for every send.
    template: {
      subject_translations: { en: subject },
      body_translations: { en: body },
    },
    language: "en",
    toEmail: input.thread.customer_email,
    fromAddress: from,
    context: { name: input.thread.customer_name },
    headers: {
      ...(inReplyTo ? { "In-Reply-To": inReplyTo } : {}),
      ...(references ? { References: references } : {}),
    },
    threadId: input.thread.id,
    inReplyTo: inReplyTo ? inReplyTo.replace(/^<|>$/g, "") : undefined,
    references: references || undefined,
    idempotencyKey: `inline_auto_reply:${input.thread.id}:${input.inboundMessage.id}`,
  });
}

/**
 * Process an inbound email delivered to the app (JSON envelope from the
 * `/api/email/inbound` webhook adapter): resolve section + thread, persist
 * the message, and send the language-matched auto-reply through the
 * Communication Engine. Idempotent by the provider message id.
 */
export async function processInboundEmail(
  rawEmail: ReceivedEmail
): Promise<{ ok: boolean; duplicate?: boolean }> {
  const parsedEmail = receivedEmailSchema.safeParse(rawEmail);
  if (!parsedEmail.success) {
    console.error("Invalid received email shape:", parsedEmail.error.message);
    return { ok: false };
  }

  const email = parsedEmail.data;
  const emailId = email.id;
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

  // Detect the customer's language first so it can steer both the section
  // routing and the language of the automatic reply.
  const language = detectEmailLanguage({
    headers: email.headers,
    subject: email.subject,
    text: email.text,
  });

  const section = await resolveSection(
    supabase,
    [...email.to, ...(email.received_for ?? [])],
    language
  );
  if (!section) {
    console.warn("No email inbox section found; skipping inbound email.");
    return { ok: true };
  }

  const { name, email: customerEmail } = parseSenderHeader(email.from);
  const rfcMessageId = email.message_id || undefined;
  const existingThread = await resolveThread(
    supabase,
    email,
    customerEmail,
    email.subject
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
        subject: email.subject,
        status: "needs_reply",
        source: "inbound_email",
        language,
        last_inbound_at: email.created_at ?? new Date().toISOString(),
      })
      .select("id")
      .single();

    if (threadInsert.error || !threadInsert.data) {
      console.error("Thread insert error:", threadInsert.error?.message);
      return { ok: false };
    }
    threadId = threadInsert.data.id;
  }

  const headers = email.headers ?? {};
  const messageInsert = await supabase.from("email_messages").insert({
    thread_id: threadId,
    direction: "inbound",
    from_email: customerEmail,
    to_email: email.to[0] ?? "",
    subject: email.subject,
    text_content: email.text ?? "",
    html_content: email.html ?? null,
    provider_message_id: emailId,
    in_reply_to: headers["in-reply-to"] ?? null,
    references: headers["references"] ?? null,
    headers: {
      ...(rfcMessageId ? { message_id: rfcMessageId } : {}),
      received_at: email.created_at ?? null,
    },
    status: "received",
    sent_at: email.created_at ?? null,
  });

  if (messageInsert.error) {
    console.error("Message insert error:", messageInsert.error.message);
    return { ok: false };
  }

  await supabase
    .from("email_threads")
    .update({
      status: "needs_reply",
      last_inbound_at: email.created_at ?? new Date().toISOString(),
      last_message_at: email.created_at ?? new Date().toISOString(),
      customer_name: name ?? undefined,
      language,
    })
    .eq("id", threadId);
  await reopenThreadIfNeeded(supabase, threadId);

  // Auto-reply (only for inbound-email threads; form threads ack differently).
  if (section.slug !== "other") {
    const { data: sectionFull } = await supabase
      .from("email_inbox_sections")
      .select(
        "name_translations, from_address, auto_reply_enabled, auto_reply_template_id, auto_reply_subject_translations, auto_reply_body_translations, email_templates(subject_translations, body_translations)"
      )
      .eq("id", section.id)
      .single();
    if (sectionFull?.auto_reply_enabled) {
      const { data: thread } = await supabase
        .from("email_threads")
        .select("id, customer_email, customer_name, source, language")
        .eq("id", threadId)
        .single();
      if (thread && thread.source === "inbound_email") {
        const sectionName = (sectionFull.name_translations as Record<string, string> | null)?.en ?? "";
        const template = sectionFull.email_templates as unknown as {
          subject_translations: Record<string, string> | null;
          body_translations: Record<string, string> | null;
        } | null;

        const inReplyTo = rfcMessageId ? `<${rfcMessageId}>` : undefined;
        const references = [
          ...extractMessageIds(headers["references"]),
          ...(rfcMessageId ? [rfcMessageId] : []),
        ]
          .map((id) => `<${id}>`)
          .join(" ");

        if (template) {
          // Template-driven auto-reply in the customer's language.
          await sendTemplateEmail({
            template: {
              subject_translations: template.subject_translations,
              body_translations: template.body_translations,
            },
            language: thread.language ?? language,
            toEmail: thread.customer_email,
            fromAddress: sectionFull.from_address ?? undefined,
            context: {
              name: thread.customer_name,
              section_name: sectionName,
            },
            threadId: thread.id,
            inReplyTo: inReplyTo ? inReplyTo.replace(/^<|>$/g, "") : undefined,
            references: references || undefined,
            idempotencyKey: `email_inbox_template:${thread.id}:${emailId}`,
          });
        } else {
          // Fallback: inline auto-reply fields (English, as before).
          await sendInlineAutoReply({
            section: {
              id: section.id,
              slug: section.slug,
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
              references: headers["references"] ?? undefined,
            },
          });
        }
      }
    }
  }

  return { ok: true };
}
