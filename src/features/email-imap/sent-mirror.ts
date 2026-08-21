import "server-only";
import { Readable } from "node:stream";
import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";
import { resolveImapConfig } from "./config";

export interface MirrorSentToZohoInput {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  /** RFC 5322 Message-ID of the sent message (kept on the copy). */
  messageId?: string;
  inReplyTo?: string;
  references?: string;
}

export interface MirrorSentResult {
  mirrored: boolean;
  folder?: string;
  /** Design-level skip reason (config off, message-id missing, …). */
  skipped?: string;
  /** Operational failure (render or APPEND). */
  error?: string;
}

/** imapflow errors carry the server's tagged response text; surface it. */
function imapErrorDetail(error: unknown): string {
  if (error instanceof Error) {
    const err = error as Error & { responseText?: string };
    const parts = [error.message];
    if (err.responseText) parts.push(err.responseText);
    return parts.join(" — ");
  }
  return String(error);
}

/** streamTransport yields `info.message` as Buffer or Readable — normalize. */
async function messageToBuffer(
  message: Buffer | Readable
): Promise<Buffer> {
  if (Buffer.isBuffer(message)) return message;
  const chunks: Buffer[] = [];
  for await (const chunk of message) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

const SENT_FOLDER_NAMES = [
  "sent",
  "sent mail",
  "sent messages",
  "sent items",
  "gesendet",
  "gesendete elemente",
  "envoyés",
  "envoyes",
  "éléments envoyés",
  "elements envoyes",
  "enviados",
  "elementos enviados",
  "inviati",
  "elementi inviati",
  "verzonden",
  "utgående",
  "skickade",
  "wysłane",
];

/**
 * Find the real Sent folder on the server. The configured
 * `IMAP_SENT_FOLDER` wins when it exists; otherwise the RFC 6154
 * `\Sent` special-use flag is used; finally common localized names.
 * Falls back to the configured value so callers never throw.
 */
async function resolveSentFolder(
  client: ImapFlow,
  fallback: string
): Promise<string> {
  try {
    const mailboxes = await client.list();
    const configured = fallback.trim().toLowerCase();
    // 1. The configured folder wins when it exists on the server.
    for (const mailbox of mailboxes) {
      const name = (mailbox.name ?? mailbox.path).toLowerCase();
      if (name === configured || mailbox.path.toLowerCase() === configured) {
        return mailbox.path;
      }
    }
    // 2. RFC 6154 special-use flag (\Sent) — locale-independent.
    for (const mailbox of mailboxes) {
      if ((mailbox.specialUse ?? "").toUpperCase() === "\\SENT") {
        return mailbox.path;
      }
    }
    // 3. Common localized sent-folder names.
    for (const mailbox of mailboxes) {
      const name = (mailbox.name ?? mailbox.path).toLowerCase();
      if (SENT_FOLDER_NAMES.includes(name)) return mailbox.path;
    }
  } catch {
    // Fall through to the configured value.
  }
  return fallback;
}

/**
 * Mirror one successful dashboard send into the Zoho Mail Sent folder
 * (dashboard → Zoho Sent). Best-effort: every failure returns a result with
 * `error` instead of throwing, and the calling send path only logs it.
 *
 * Gate (skips without error):
 * - IMAP not configured (or placeholder values)
 * - `IMAP_SENT_MIRROR` not enabled
 * - no RFC message-id to attach to the copy
 *
 * Every dashboard conversation send is mirrored regardless of the `from`
 * address: the copy is appended to this mailbox's Sent folder, and the
 * Sent-folder sweep only imports mailbox-owned sends, so foreign-address
 * copies cannot ever create dashboard duplicates.
 */
export async function mirrorSentToZoho(
  input: MirrorSentToZohoInput
): Promise<MirrorSentResult> {
  const { config } = resolveImapConfig(process.env);
  if (!config) {
    return { mirrored: false, skipped: "IMAP not configured." };
  }
  if (!config.mirrorSent) {
    return {
      mirrored: false,
      skipped: "IMAP_SENT_MIRROR is not enabled.",
    };
  }
  if (!input.messageId) {
    return {
      mirrored: false,
      skipped: "No RFC message-id available for the mirror copy.",
    };
  }

  // Render the RFC 5322 source locally (streamTransport never sends). The
  // message-id, threading headers and content match the SES-sent message, so
  // a later Sent-folder sweep recognizes this copy as a duplicate.
  let raw: Buffer;
  try {
    const transport = nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
    });
    const info = await transport.sendMail({
      from: input.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      messageId: input.messageId,
      headers: {
        ...(input.inReplyTo ? { "In-Reply-To": input.inReplyTo } : {}),
        ...(input.references ? { References: input.references } : {}),
      },
    });
    raw = await messageToBuffer(info.message);
  } catch (error) {
    return {
      mirrored: false,
      error: `Mirror render failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }

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
    const folder = await resolveSentFolder(client, config.sentFolder);
    await client.append(folder, raw, [], undefined);
    return { mirrored: true, folder };
  } catch (error) {
    return {
      mirrored: false,
      error: `Zoho Sent append failed: ${imapErrorDetail(error)}`,
    };
  } finally {
    try {
      await client.logout();
    } catch {
      // Already disconnected.
    }
  }
}