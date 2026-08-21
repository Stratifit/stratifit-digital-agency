/**
 * SMTP host classification for the Communication Engine.
 *
 * Pure helpers (no server-only import) so they are unit-testable. The app must
 * send through the AWS SES SMTP endpoint (`email-smtp.<region>.amazonaws.com`).
 *
 * A common misconfiguration is pointing SMTP_HOST at an AWS Mail Manager
 * ingress endpoint (hostnames like `*.mail-manager-smtp.amazonaws.com`,
 * credentials prefixed `inp-`). Those are inbound-only gateways: they accept
 * outbound mail with `250 OK` and then silently drop it, so email logs stay
 * "Sent" forever and nothing is ever delivered.
 */

export type SmtpHostKind = "ses" | "mail-manager" | "other";

/**
 * Resolved SMTP configuration from environment variables.
 *
 * Canonical names are `SES_SMTP_*` (AWS SES SMTP); the legacy `SMTP_*` names
 * are still accepted as a fallback so existing deployments keep working.
 */
export interface ResolvedSmtpEnv {
  host: string | null;
  port: number;
  user: string | null;
  pass: string | null;
  /** Canonical names that are missing and need to be configured. */
  missing: string[];
}

/**
 * Pure resolver (testable): reads SES_* names first, falls back to the legacy
 * SMTP_* names, and reports which canonical keys are missing.
 */
export function resolveSmtpEnv(
  env: Record<string, string | undefined>
): ResolvedSmtpEnv {
  const host = env.SES_SMTP_HOST || env.SMTP_HOST || null;
  const user = env.SES_SMTP_USER || env.SMTP_USER || null;
  const pass = env.SES_SMTP_PASS || env.SMTP_PASS || null;
  const port = Number(env.SES_SMTP_PORT || env.SMTP_PORT || "587");
  const missing: string[] = [];
  if (!host) missing.push("SES_SMTP_HOST");
  if (!user) missing.push("SES_SMTP_USER");
  if (!pass) missing.push("SES_SMTP_PASS");
  return { host, port, user, pass, missing };
}

export function classifySmtpHost(host: string): SmtpHostKind {
  const h = host.trim().toLowerCase();
  if (!h) return "other";
  if (h.includes("mail-manager-smtp") || h.includes("mail-manager.")) {
    return "mail-manager";
  }
  if (h.includes("email-smtp")) {
    return "ses";
  }
  return "other";
}

/** Warning text for the admin dashboard, or null when the host looks correct. */
export function getSmtpHostWarning(host: string, user: string): string | null {
  const kind = classifySmtpHost(host);
  const isMailManager =
    kind === "mail-manager" || user.trim().toLowerCase().startsWith("inp-");
  if (isMailManager) {
    return (
      "SMTP_HOST points to an AWS Mail Manager ingress endpoint, which only " +
      "receives inbound mail. Outbound messages are accepted with 250 OK and " +
      "then silently dropped, so logs stay \"Sent\" and nothing is delivered. " +
      "Replace it with the SES SMTP endpoint (email-smtp.<region>.amazonaws.com) " +
      "and real SES SMTP credentials."
    );
  }
  if (kind === "other") {
    return (
      "SMTP_HOST is not a standard AWS SES SMTP endpoint " +
      "(email-smtp.<region>.amazonaws.com). Messages may be accepted without " +
      "being delivered; verify this is the correct sending relay."
    );
  }
  return null;
}

/**
 * Refuse to send through a Mail Manager ingress relay. Those endpoints only
 * receive inbound mail: they accept outbound messages with `250 OK` and then
 * silently drop them, so logs would say "Sent" forever while nothing is ever
 * delivered. Failing loudly here turns that silent loss into a visible,
 * actionable error. Returns null when the relay is allowed.
 */
export function getSendBlockError(host: string, user: string): string | null {
  const kind = classifySmtpHost(host);
  const isMailManager =
    kind === "mail-manager" || user.trim().toLowerCase().startsWith("inp-");
  if (isMailManager) {
    return (
      "SMTP relay is an AWS Mail Manager ingress endpoint, which only receives " +
      "inbound mail and silently drops outbound messages. Update SMTP_HOST to " +
      "email-smtp.<region>.amazonaws.com and use real SES SMTP credentials " +
      "(AWS SES console > SMTP settings > Create SMTP credentials)."
    );
  }
  return null;
}
