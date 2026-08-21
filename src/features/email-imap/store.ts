import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Json } from "@/types/database.types";
import {
  extractMessageIds,
  resolveThreadId,
  sanitizeFilename,
  type ThreadCandidate,
} from "./parse";

type ServiceRoleClient = ReturnType<typeof createSupabaseServiceRoleClient>;

const THREAD_MATCH_WINDOW_DAYS = 30;
const ATTACHMENT_BUCKET = "email-attachments";

export interface StoredAttachment {
  content: Uint8Array;
  name: string;
  mimeType: string | null;
  size: number;
  contentId: string | null;
}

export interface StoreImapMessageInput {
  /** RFC 5322 message-id; the worker falls back to a synthetic id. */
  rfcMessageId: string;
  fromName: string | null;
  fromEmail: string;
  toEmail: string;
  subject: string;
  text: string;
  html: string | null;
  inReplyTo: string | null;
  references: string | null;
  date: Date;
  attachments: StoredAttachment[];
}

export interface StoreImapMessageResult {
  status: "inserted" | "duplicate";
  threadId: string;
  messageId: string | null;
  createdThread: boolean;
}

async function getOtherSectionId(
  supabase: ServiceRoleClient
): Promise<string | null> {
  const { data } = await supabase
    .from("email_inbox_sections")
    .select("id")
    .eq("slug", "other")
    .eq("enabled", true)
    .maybeSingle();
  return data?.id ?? null;
}

/**
 * Persist one parsed IMAP message into the conversation tables (idempotent by
 * RFC message-id). Reuses the existing threading rules from the webhook
 * inbound pipeline: threading headers first, then customer email + normalized
 * subject on open threads within 30 days, otherwise a new `imap` thread in the
 * "other" section. Attachments are uploaded to Supabase Storage and recorded
 * in `email_attachments` (plus a compact summary on the message row).
 */
export async function storeImapMessage(
  supabase: ServiceRoleClient,
  input: StoreImapMessageInput
): Promise<StoreImapMessageResult> {
  // Idempotency: the RFC message-id is stable across fetches.
  const { data: existing } = await supabase
    .from("email_messages")
    .select("id, thread_id")
    .eq("provider_message_id", input.rfcMessageId)
    .maybeSingle();
  if (existing) {
    return {
      status: "duplicate",
      threadId: existing.thread_id,
      messageId: existing.id,
      createdThread: false,
    };
  }

  // Threading index: referenced message-ids → stored thread ids.
  const referenceIds = [
    ...(input.inReplyTo ? extractMessageIds(input.inReplyTo) : []),
    ...(input.references ? extractMessageIds(input.references) : []),
  ];
  const messageIdThreads = new Map<string, string>();
  for (const messageId of referenceIds) {
    const { data: message } = await supabase
      .from("email_messages")
      .select("thread_id")
      .eq("headers->>message_id", messageId)
      .maybeSingle();
    if (message) {
      messageIdThreads.set(messageId, message.thread_id);
    }
  }

  // Subject-match candidates: open threads from the same customer.
  const cutoff = new Date(
    Date.now() - THREAD_MATCH_WINDOW_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();
  const { data: candidates } = await supabase
    .from("email_threads")
    .select("id, customer_email, subject, status, last_message_at")
    .eq("customer_email", input.fromEmail.toLowerCase())
    .neq("status", "archived")
    .gte("last_message_at", cutoff)
    .limit(50);

  const resolved = resolveThreadId({
    inReplyTo: input.inReplyTo,
    references: referenceIds,
    messageIdThreads,
    customerEmail: input.fromEmail,
    subject: input.subject,
    candidateThreads: (candidates ?? []) as unknown as ThreadCandidate[],
  });

  let threadId: string;
  let createdThread = false;
  if (resolved) {
    threadId = resolved;
  } else {
    const sectionId = await getOtherSectionId(supabase);
    if (!sectionId) {
      throw new Error("No enabled 'other' inbox section; cannot store IMAP message.");
    }
    const { data: thread, error } = await supabase
      .from("email_threads")
      .insert({
        section_id: sectionId,
        customer_email: input.fromEmail.toLowerCase(),
        customer_name: input.fromName,
        subject: input.subject,
        status: "needs_reply",
        source: "imap",
        language: "en",
        last_inbound_at: input.date.toISOString(),
        last_message_at: input.date.toISOString(),
      })
      .select("id")
      .single();
    if (error || !thread) {
      throw new Error(`Thread insert failed: ${error?.message ?? "unknown"}`);
    }
    threadId = thread.id;
    createdThread = true;
  }

  const messageInsert = await supabase
    .from("email_messages")
    .insert({
      thread_id: threadId,
      direction: "inbound",
      from_email: input.fromEmail,
      to_email: input.toEmail,
      subject: input.subject,
      text_content: input.text,
      html_content: input.html,
      provider_message_id: input.rfcMessageId,
      in_reply_to: input.inReplyTo,
      references: input.references,
      headers: { message_id: input.rfcMessageId },
      attachments: [],
      status: "received",
      sent_at: input.date.toISOString(),
    })
    .select("id")
    .single();

  if (messageInsert.error || !messageInsert.data) {
    throw new Error(
      `Message insert failed: ${messageInsert.error?.message ?? "unknown"}`
    );
  }
  const messageId = messageInsert.data.id;

  // Attachments → storage + table + jsonb summary on the message row.
  if (input.attachments.length > 0) {
    const summaries: Json[] = [];
    for (const attachment of input.attachments) {
      const name = sanitizeFilename(attachment.name);
      const path = `${messageId}/${name}`;
      const { error: uploadError } = await supabase.storage
        .from(ATTACHMENT_BUCKET)
        .upload(path, attachment.content, {
          contentType: attachment.mimeType ?? "application/octet-stream",
          upsert: true,
        });
      if (uploadError) {
        console.error(
          "IMAP attachment upload failed:",
          uploadError.message,
          attachment.name
        );
        continue;
      }
      await supabase.from("email_attachments").insert({
        message_id: messageId,
        name: attachment.name,
        mime_type: attachment.mimeType,
        size_bytes: attachment.size,
        storage_bucket: ATTACHMENT_BUCKET,
        storage_path: path,
        content_id: attachment.contentId,
      });
      summaries.push({
        name: attachment.name,
        mimeType: attachment.mimeType,
        size: attachment.size,
      });
    }
    await supabase
      .from("email_messages")
      .update({ attachments: summaries })
      .eq("id", messageId);
  }

  await supabase
    .from("email_threads")
    .update({
      status: "needs_reply",
      last_inbound_at: input.date.toISOString(),
      last_message_at: input.date.toISOString(),
      customer_name: input.fromName ?? undefined,
      language: "en",
    })
    .eq("id", threadId);

  return { status: "inserted", threadId, messageId, createdThread };
}
