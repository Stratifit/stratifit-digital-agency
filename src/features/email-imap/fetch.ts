import "server-only";
import { ImapFlow } from "imapflow";
import { simpleParser, type ParsedMail } from "mailparser";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { resolveImapConfig } from "./config";
import { normalizeInReplyTo, normalizeReferences } from "./parse";
import {
  storeImapMessage,
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

/**
 * Run one IMAP inbox sweep: connect to the configured mailbox, fetch every
 * message received since the sync window, parse it with mailparser, store it
 * into the conversation tables (idempotent by RFC message-id), and mark it
 * \Seen once stored. Never throws — returns a summary so callers (cron route,
 * admin sync button) can report what happened.
 */
export async function runImapFetch(): Promise<ImapFetchSummary> {
  const { config, missing } = resolveImapConfig(process.env);
  if (!config) {
    return {
      ok: false,
      error: `IMAP not configured. Missing: ${missing.join(", ")}.`,
      scanned: 0,
      inserted: 0,
      duplicates: 0,
      failed: 0,
      newThreads: 0,
    };
  }

  const supabase = createSupabaseServiceRoleClient();
  const since = new Date(Date.now() - config.sinceDays * 24 * 60 * 60 * 1000);

  const summary: ImapFetchSummary = {
    ok: false,
    mailbox: config.mailbox,
    scanned: 0,
    inserted: 0,
    duplicates: 0,
    failed: 0,
    newThreads: 0,
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
    summary.error = `IMAP connection failed: ${
      error instanceof Error ? error.message : "unknown error"
    }`;
    return summary;
  }

  try {
    const lock = await client.getMailboxLock(config.mailbox);
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
            parsed.messageId?.trim() || `imap:${config.user}:${uid}`;

          const attachments: StoredAttachment[] = (
            parsed.attachments ?? []
          )
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

          const stored = await storeImapMessage(supabase, {
            rfcMessageId,
            fromName: envelopeName(from?.value) ?? from?.value?.[0]?.name ?? null,
            fromEmail: envelopeAddress(from?.value) || from?.text || "",
            toEmail: envelopeAddress(to?.value) || "",
            subject: parsed.subject ?? "(no subject)",
            text: parsed.text || "",
            html: typeof parsed.html === "string" ? parsed.html : null,
            inReplyTo: normalizeInReplyTo(parsed.inReplyTo),
            references: (normalizeReferences(parsed.references).length > 0
              ? normalizeReferences(parsed.references).join(" ")
              : null) as string | null,
            date,
            attachments,
          });

          if (stored.status === "inserted") {
            summary.inserted += 1;
            if (stored.createdThread) summary.newThreads += 1;
            // Only mark seen after it is safely stored (retries re-fetch it).
            await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true });
          } else {
            summary.duplicates += 1;
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
  } catch (error) {
    summary.error = `IMAP fetch failed: ${
      error instanceof Error ? error.message : "unknown error"
    }`;
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
