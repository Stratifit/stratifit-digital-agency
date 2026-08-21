import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import {
  formatFromAddress,
  getSendBlockError,
  getSmtpHostWarning,
  resolveSmtpEnv,
} from "./smtp-config";

export { formatFromAddress, getSendBlockError };

/**
 * Sender: Nodemailer over AWS SES SMTP. All email leaves the app through
 * this module. SMTP credentials come from environment variables:
 *
 *   SES_SMTP_HOST, SES_SMTP_PORT, SES_SMTP_USER, SES_SMTP_PASS
 *     (canonical names; legacy SMTP_* names are still accepted as a fallback)
 *   COMMUNICATION_FROM_EMAIL   — default "from" address
 *   COMMUNICATION_REPLY_AS     — comma-separated reply-as addresses
 *
 * When SMTP is not configured, sends fail loudly (never silently succeed).
 */

let cachedTransporter: Transporter | null = null;

export function getSmtpConfig(): {
  host: string;
  port: number;
  user: string;
  pass: string;
} | null {
  const resolved = resolveSmtpEnv(process.env);
  if (!resolved.host || !resolved.user || !resolved.pass) {
    return null;
  }
  return {
    host: resolved.host,
    port: resolved.port,
    user: resolved.user,
    pass: resolved.pass,
  };
}

function getTransporter(): Transporter | null {
  const config = getSmtpConfig();
  if (!config) return null;
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
      // Fail fast instead of hanging on a slow or unreachable SMTP server.
      // Nodemailer defaults can wait minutes; these cap the wait so a bad
      // host surfaces as a clear failure in seconds.
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    });
  }
  return cachedTransporter;
}

/** Default "from" address when a send does not specify one. */
export function getDefaultFrom(): string {
  return process.env.COMMUNICATION_FROM_EMAIL ?? "";
}

/**
 * Reply-as addresses an admin can choose in the dashboard. Configured via
 * COMMUNICATION_REPLY_AS (comma-separated); defaults to the Stratifit
 * addresses when unset. All values are normalized to lowercase.
 */
export function getReplyAsAddresses(): string[] {
  const raw = process.env.COMMUNICATION_REPLY_AS;
  const list = raw
    ? raw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : [
        "contact@stratifit.com",
        "sales@stratifit.com",
        "info@stratifit.com",
        "support@stratifit.com",
      ];
  return [...new Set(list)];
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  headers?: Record<string, string>;
}

export interface SendEmailResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

/**
 * SES SMTP replies "250 OK <ses-message-id>" after DATA. Nodemailer only
 * captures a Message-ID header (or generates one), so the real SES message
 * id — which SES delivery notifications report — would be lost. Parse it
 * from the SMTP response so `email_logs.provider_message_id` matches SNS
 * delivery/bounce events. Falls back to nodemailer's messageId.
 */
function extractProviderMessageId(info: {
  messageId?: string;
  response?: string;
}): string | undefined {
  const match = (info.response ?? "").match(/^250\s+OK\s+(\S+)/im);
  if (match?.[1]) {
    return match[1].replace(/^<|>$/g, "");
  }
  return info.messageId;
}

/**
 * Send one email via AWS SES SMTP. Never throws — returns the outcome so
 * callers can log it without try/catch.
 */
export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  const config = getSmtpConfig();
  const transporter = getTransporter();
  const from = input.from || getDefaultFrom();

  if (!transporter || !from) {
    console.warn(
      "Communication sender: SMTP or from-address not configured; not sending."
    );
    return { ok: false, error: "Email sending is not configured." };
  }

  // Refuse to send into an inbound-only relay: Mail Manager ingress accepts
  // mail with 250 OK then drops it, which previously logged "Sent" for mail
  // that never left the gateway.
  const blockError = getSendBlockError(
    config?.host ?? "",
    config?.user ?? ""
  );
  if (blockError) {
    console.error("Communication sender blocked:", blockError);
    return { ok: false, error: blockError };
  }

  try {
    const info = await transporter.sendMail({
      from: formatFromAddress(from),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(input.headers ? { headers: input.headers } : {}),
    });
    return { ok: true, messageId: extractProviderMessageId(info) };
  } catch (error) {
    console.error("SMTP send error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Email could not be sent.",
    };
  }
}

/**
 * Structured status of the email configuration for the admin dashboard.
 * Reports exactly which server-side SMTP variables are set and which are
 * missing, so the UI can show an actionable setup checklist instead of a
 * bare "not configured" error.
 */
export function getEmailConfigStatus(): {
  configured: boolean;
  smtp: { host: boolean; port: boolean; user: boolean; pass: boolean };
  fromEmail: boolean;
  replyAs: string[];
  missing: string[];
  /** Non-null when the SMTP host looks wrong (e.g. a Mail Manager ingress endpoint). */
  warning: string | null;
} {
  const resolved = resolveSmtpEnv(process.env);
  const host = Boolean(resolved.host);
  const port = Boolean(resolved.port);
  const user = Boolean(resolved.user);
  const pass = Boolean(resolved.pass);
  const fromEmail = Boolean(process.env.COMMUNICATION_FROM_EMAIL);

  const missing = [...resolved.missing];
  if (!fromEmail) missing.push("COMMUNICATION_FROM_EMAIL");

  return {
    configured: missing.length === 0,
    smtp: { host, port, user, pass },
    fromEmail,
    replyAs: getReplyAsAddresses(),
    missing,
    warning: getSmtpHostWarning(resolved.host ?? "", resolved.user ?? ""),
  };
}
