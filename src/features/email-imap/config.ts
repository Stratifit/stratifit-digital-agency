/**
 * IMAP configuration resolution (pure, unit-testable).
 *
 * Canonical names:
 *   IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS
 *   IMAP_MAILBOXES       — comma-separated folders to sweep (default INBOX;
 *                          add Junk so spam-filtered replies still arrive)
 *   IMAP_SYNC_SINCE_DAYS — how far back each fetch scans (default 7)
 *   IMAP_SYNC_SECRET     — bearer secret for POST /api/inbox/fetch
 */
export interface ImapConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  mailbox: string;
  /** Every folder swept per run (INBOX plus any extras like Junk). */
  mailboxes: string[];
  sinceDays: number;
  secure: boolean;
}

export interface ImapConfigResult {
  config: ImapConfig | null;
  missing: string[];
  placeholders: string[];
}

/**
 * Detect placeholder values (from .env.example or pasted without editing) so
 * the sync path reports "not configured" instead of failing authentication
 * with a confusing error.
 */
export function isPlaceholderValue(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    lower.startsWith("your-") ||
    lower.includes("placeholder") ||
    lower === "changeme" ||
    lower === "xxx" ||
    lower.endsWith("@example.com") ||
    lower.endsWith("@yourdomain.com")
  );
}

export function resolveImapConfig(
  env: Record<string, string | undefined>
): ImapConfigResult {
  const host = env.IMAP_HOST?.trim() || null;
  const user = env.IMAP_USER?.trim() || null;
  const pass = env.IMAP_PASS?.trim() || null;

  const missing: string[] = [];
  const placeholders: string[] = [];

  for (const [key, value] of [
    ["IMAP_HOST", host],
    ["IMAP_USER", user],
    ["IMAP_PASS", pass],
  ] as const) {
    if (!value) {
      missing.push(key);
    } else if (isPlaceholderValue(value)) {
      placeholders.push(key);
    }
  }

  if (!host || !user || !pass || placeholders.length > 0) {
    return { config: null, missing, placeholders };
  }

  const rawPort = Number(env.IMAP_PORT ?? "993");
  const port = Number.isFinite(rawPort) && rawPort > 0 ? rawPort : 993;
  const sinceDays = Math.max(
    1,
    Math.min(90, Number(env.IMAP_SYNC_SINCE_DAYS ?? "7") || 7)
  );

  // IMAP_MAILBOXES (comma-separated) wins; IMAP_MAILBOX remains the
  // single-folder fallback for backwards compatibility.
  const rawMailboxes = env.IMAP_MAILBOXES?.trim();
  const mailboxList = rawMailboxes
    ? rawMailboxes
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
    : [env.IMAP_MAILBOX?.trim() || "INBOX"];
  if (mailboxList.length === 0) mailboxList.push("INBOX");

  return {
    config: {
      host,
      port,
      user,
      pass,
      mailbox: mailboxList[0],
      mailboxes: mailboxList,
      sinceDays,
      // Zoho IMAP is TLS on 993; never fall back to plaintext.
      secure: true,
    },
    missing,
    placeholders,
  };
}
