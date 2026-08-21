import "server-only";
import { ImapFlow, type FetchMessageObject } from "imapflow";
import { simpleParser, type ParsedMail } from "mailparser";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { getSenderAddresses } from "@/features/communication/sender-addresses";
import { resolveImapConfig } from "./config";
import {
  isFromSelf,
  normalizeInReplyTo,
  normalizeReferences,
} from "./parse";
import {
  storeImapMessage,
  storeImapSentMessage,
  type StoredAttachment,
} from "./store";

export interface ImapFetchSummary {
  ok: boolean;
  error?: string;
  mailbox?: string;
  scanned: number;
  inserted: number;
  duplicates: number;
  failed: number;
  newThreads: number;
  /** Sent-folder messages skipped because they were not sent by the mailbox. */
  skipped: number;
}

/** imapflow errors carry the server's tagged response text (e.g. NO
 * [AUTHENTICATIONFAILED] ...); surface it so auth failures are actionable. */
function imapErrorDetail(error: unknown): string {
  if (error instanceof Error) {
    const err = error as Error & {
      responseStatus?: string;
      responseText?: string;
    };
    const parts = [error.message];
    if (err.responseStatus) parts.push(err.responseStatus);
    if (err.responseText) parts.push(err.responseText);
    return parts.join(" — ");
  }
  return String(error);
}

function envelopeName(value: unknown): string | null {
  if (Array.isArray(value)) {
    return value[0]?.name ?? null;
  }
  return null;
}

function envelopeAddress(value: unknown): string {
  if (Array.isArray(value)) {
    return value[0]?.address ?? "";
  }
  return "";
}

interface ParsedImapMessage {
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

/** Parse one raw IMAP message with mailparser into normalized fields. */
async function parseFetchedMessage(
  message: FetchMessageObject,
  user: string,
  uid: number
): Promise<ParsedImapMessage | null> {
  try {
    const sourceBuffer = Buffer.isBuffer(message.source)
      ? message.source
      : message.source
        ? Buffer.from(message.source)
        : Buffer.alloc(0);
    const parsed = await simpleParser(sourceBuffer);
    const imapDate = message.internalDate
      ? new Date(message.internalDate)
      : null;
    const date =
      parsed.date instanceof Date && !Number.isNaN(parsed.date.getTime())
        ? parsed.date
        : imapDate && !Number.isNaN(imapDate.getTime())
          ? imapDate
          : new Date();

    const rfcMessageId =
      parsed.messageId?.trim() || `imap:${user}:${uid}`;

    const attachments: StoredAttachment[] = (parsed.attachments ?? [])
      .filter((attachment) => attachment.filename)
      .map((attachment) => ({
        content: attachment.content,
        name: attachment.filename as string,
        mimeType: attachment.contentType ?? null,
        size: attachment.size ?? attachment.content.length,
        contentId: attachment.contentId ?? null,
      }));

    const from = Array.isArray(parsed.from) ? parsed.from[0] : parsed.from;
    const to = Array.isArray(parsed.to) ? parsed.to[0] : parsed.to;

    return {
      rfcMessageId,
      fromName:
        envelopeName(from?.value) ?? from?.value?.[0]?.name ?? null,
      fromEmail: envelopeAddress(from?.value) || from?.text || "",
      toEmail: envelopeAddress(to?.value) || "",
      subject: parsed.subject ?? "(no subject)",
      text: parsed.text || "",
      html: typeof parsed.html === "string" ? parsed.html : null,
      inReplyTo: normalizeInReplyTo(parsed.inReplyTo),
      references:
        normalizeReferences(parsed.references).length > 0
          ? normalizeReferences(parsed.references).join(" ")
          : null,
      date,
      attachments,
    };
  } catch {
    return null;
  }
}

/**
 * Sweep one IMAP folder: fetch every message received since the sync window,
 * store it through the given handler, and mark it \Seen once stored. Never
 * throws — per-message failures are counted and logged.
 */
async function sweepFolder(
  client: ImapFlow,
  mailboxName: string,
  since: Date,
  store: (
    parsed: ParsedImapMessage
  ) => Promise<"inserted" | "duplicate" | "skipped">,
  summary: ImapFetchSummary,
  imapUser: string
): Promise<void> {
  let lock;
  try {
    lock = await client.getMailboxLock(mailboxName);
  } catch (error) {
    console.error(
      `IMAP mailbox "${mailboxName}" unavailable:`,
      error instanceof Error ? error.message : error
    );
    return;
  }
  try {
    const messages = client.fetch(
      { since },
      {
        source: true,
        envelope: true,
        internalDate: true,
        flags: true,
        uid: true,
      }
    );

    for await (const message of messages) {
      summary.scanned += 1;
      const uid = message.uid;
      const parsed = await parseFetchedMessage(message, imapUser, uid);
      if (!parsed) {
        summary.failed += 1;
        console.error("IMAP message parsing failed.");
        continue;
      }
      try {
        const outcome = await store(parsed);
        if (outcome === "inserted") {
          summary.inserted += 1;
          // Only mark seen after it is safely stored (retries re-fetch it).
          await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true });
        } else if (outcome === "duplicate") {
          summary.duplicates += 1;
        } else {
          summary.skipped += 1;
        }
      } catch (error) {
        summary.failed += 1;
        console.error(
          "IMAP message processing failed:",
          error instanceof Error ? error.message : error
        );
      }
    }
    summary.ok = true;
  } finally {
    lock.release();
  }
}

/**
 * Run one IMAP inbox sweep: connect to the configured mailbox, fetch every
 * message received since the sync window, parse it with mailparser, store it
 * into the conversation tables (idempotent by RFC message-id), and mark it
 * \Seen once stored. Never throws — returns a summary so callers (cron route,
 * admin sync button) can report what happened.
 */
export async function runImapFetch(): Promise<ImapFetchSummary> {
  const { config, missing, placeholders } = resolveImapConfig(process.env);
  if (!config) {
    const problems: string[] = [];
    if (missing.length > 0) {
      problems.push(`missing ${missing.join(", ")}`);
    }
    if (placeholders.length > 0) {
      problems.push(
        `${placeholders.join(", ")} still set to placeholder values (create a Zoho app password and set the real values)`
      );
    }
    return {
      ok: false,
      error: `IMAP not configured — ${problems.join("; ")}.`,
      scanned: 0,
      inserted: 0,
      duplicates: 0,
      failed: 0,
      newThreads: 0,
      skipped: 0,
    };
  }

  const supabase = createSupabaseServiceRoleClient();
  const since = new Date(Date.now() - config.sinceDays * 24 * 60 * 60 * 1000);

  const summary: ImapFetchSummary = {
    ok: false,
    mailbox: config.mailboxes.join(", "),
    scanned: 0,
    inserted: 0,
    duplicates: 0,
    failed: 0,
    newThreads: 0,
    skipped: 0,
  };

  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    logger: false,
    connectionTimeout: 20_000,
    socketTimeout: 60_000,
  });

  try {
    await client.connect();
  } catch (error) {
    summary.error = `IMAP connection failed: ${imapErrorDetail(error)}`;
    return summary;
  }

  try {
    // Sweep every configured folder (INBOX plus e.g. Junk) on the same
    // account, so replies that get spam-filtered still reach the dashboard.
    for (const mailboxName of config.mailboxes) {
      const storeInbound = async (
        parsed: ParsedImapMessage
      ): Promise<"inserted" | "duplicate" | "skipped"> => {
        const stored = await storeImapMessage(supabase, {
          ...parsed,
          fromName: parsed.fromName,
        });
        if (stored.status === "inserted") {
          if (stored.createdThread) summary.newThreads += 1;
          return "inserted";
        }
        return "duplicate";
      };
      await sweepFolder(client, mailboxName, since, storeInbound, summary, config.user);
    }

    // Sent-folder sweep (Zoho → dashboard): messages the mailbox sent from
    // Zoho webmail/mobile are imported as outbound messages on threads.
    if (config.syncSent) {
      summary.mailbox = [summary.mailbox, config.sentFolder]
        .filter(Boolean)
        .join(", ");
      const senderAddresses = await getSenderAddresses();
      const storeSent = async (
        parsed: ParsedImapMessage
      ): Promise<"inserted" | "duplicate" | "skipped"> => {
        if (!isFromSelf(parsed.fromEmail, config.user, senderAddresses)) {
          return "skipped";
        }
        const stored = await storeImapSentMessage(supabase, parsed);
        if (stored.status === "inserted") {
          if (stored.createdThread) summary.newThreads += 1;
          return "inserted";
        }
        return "duplicate";
      };
      await sweepFolder(client, config.sentFolder, since, storeSent, summary, config.user);
    }
  } catch (error) {
    summary.error = `IMAP fetch failed: ${imapErrorDetail(error)}`;
  } finally {
    try {
      await client.logout();
    } catch {
      // Already disconnected.
    }
  }

  return summary;
}

export type { ParsedMail };
