/**
 * Pure parsing utilities for the IMAP inbox (no server-only import, no I/O)
 * so the logic is unit-testable. Runtime MIME parsing is done by `mailparser`
 * in `fetch.ts`; these helpers normalize and reason about its output.
 */

/** Extract RFC 5322 message-ids from a raw In-Reply-To / References header. */
export function extractMessageIds(
  rawHeader: string | null | undefined
): string[] {
  if (!rawHeader) return [];
  return (
    rawHeader
      .match(/<[^<>]+>/g)
      ?.map((id) => id.replace(/^<|>$/g, "").trim())
      .filter(Boolean) ?? []
  );
}

/**
 * Normalize a subject for thread matching: lowercase, strip Re/Fw/Aw/Antw
 * prefixes and collapse whitespace.
 */
export function normalizeSubject(subject: string): string {
  return subject
    .toLowerCase()
    .replace(/^(re|fw|fwd|aw|antw|wg)\s*:\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalize an In-Reply-To value that may be a string, array, or absent. */
export function normalizeInReplyTo(
  value: string | string[] | undefined | null
): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return null;
}

/**
 * Whether a message was sent by the synced Zoho mailbox (the IMAP user) or
 * one of its aliases / sender addresses. Used by the Sent-folder sweep to
 * distinguish self-sent mail (→ outbound) from anything else (→ skip).
 */
export function isFromSelf(
  fromEmail: string,
  imapUser: string,
  aliases: string[]
): boolean {
  const normalized = fromEmail.trim().toLowerCase();
  if (!normalized) return false;
  const candidates = [imapUser, ...aliases]
    .map((address) => address.trim().toLowerCase())
    .filter(Boolean);
  return candidates.includes(normalized);
}

/** Normalize References (string, array, or absent) into an array of ids. */
export function normalizeReferences(
  value: string | string[] | undefined | null
): string[] {
  if (Array.isArray(value)) return value.map((id) => id.trim()).filter(Boolean);
  if (typeof value === "string") return extractMessageIds(value);
  return [];
}

export interface ThreadCandidate {
  id: string;
  customer_email: string;
  subject: string;
  status: string;
  last_message_at: string | null;
}

/**
 * Resolve which existing thread an inbound message belongs to:
 *
 * 1. By threading headers — the first reference id (in-reply-to first, then
 *    references) found in the `messageIdThreads` index (stored RFC message-ids
 *    → thread ids) wins.
 * 2. By customer email + normalized subject on open threads (30-day window).
 *
 * Returns null when a new thread should be created. Pure — callers build the
 * index and candidate list from the database.
 */
export function resolveThreadId(input: {
  inReplyTo: string | null;
  references: string[];
  /** messageId → threadId for messages already stored. */
  messageIdThreads: Map<string, string>;
  customerEmail: string;
  subject: string;
  /** Open threads for the customer within the match window. */
  candidateThreads: ThreadCandidate[];
}): string | null {
  const { inReplyTo, references, messageIdThreads, customerEmail, subject } =
    input;

  const referenceIds = [
    ...(inReplyTo ? [extractMessageIds(inReplyTo)[0] ?? inReplyTo] : []),
    ...references,
  ];
  for (const id of referenceIds) {
    const threadId = messageIdThreads.get(id.trim());
    if (threadId) return threadId;
  }

  const normalized = normalizeSubject(subject);
  if (!normalized) return null;

  for (const thread of input.candidateThreads) {
    if (
      thread.customer_email.toLowerCase() === customerEmail.toLowerCase() &&
      normalizeSubject(thread.subject) === normalized
    ) {
      return thread.id;
    }
  }

  return null;
}

/** Fallback HTML → plain text (mailparser normally provides `text`). */
export function plainTextFromHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|tr|h[1-6]|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export interface ParsedAttachment {
  name: string;
  mimeType: string | null;
  size: number;
  contentId: string | null;
}

/** Map mailparser attachment objects to a normalized summary. */
export function summarizeAttachment(input: {
  filename?: string;
  contentType?: string;
  size?: number;
  contentId?: string;
}): ParsedAttachment | null {
  const name = input.filename?.trim();
  if (!name) return null;
  return {
    name,
    mimeType: input.contentType?.trim() || null,
    size: Number(input.size) || 0,
    contentId: input.contentId?.trim() || null,
  };
}

/** Sanitize a filename into a storage-safe object key segment. */
export function sanitizeFilename(name: string): string {
  const cleaned = name
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^[._]+|[._]+$/g, "")
    .slice(0, 180);
  return cleaned || "attachment";
}
