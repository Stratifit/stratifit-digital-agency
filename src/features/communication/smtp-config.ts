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
