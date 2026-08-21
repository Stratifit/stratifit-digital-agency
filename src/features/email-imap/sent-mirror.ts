import "server-only";
import { Readable } from "node:stream";
import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";
import { getSenderAddresses } from "@/features/communication/sender-addresses";
import { resolveImapConfig } from "./config";
import { isFromSelf } from "./parse";

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
  /** Design-level skip reason (config off, not from this mailbox, …). */
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

/**
 * Mirror one successful dashboard send into the Zoho Mail Sent folder
 * (dashboard → Zoho Sent). Best-effort: every failure returns a result with
 * `error` instead of throwing, and the calling send path only logs it.
 *
 * Gate (skips without error):
 * - IMAP not configured (or placeholder values)
 * - `IMAP_SENT_MIRROR` not enabled
 * - no RFC message-id to attach to the copy
 * - `from` is not the synced Zoho mailbox (`IMAP_USER`) or an alias /
 *   configured sender address — a copy cannot belong to that mailbox's Sent.
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

  const senderAddresses = await getSenderAddresses();
  if (!isFromSelf(input.from, config.user, senderAddresses)) {
    return {
      mirrored: false,
      skipped: `${input.from} is not the synced Zoho mailbox or one of its aliases.`,
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
    await client.append(config.sentFolder, raw, [], undefined);
    return { mirrored: true, folder: config.sentFolder };
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