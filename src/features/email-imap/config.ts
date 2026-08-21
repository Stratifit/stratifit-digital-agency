/**
 * IMAP configuration resolution (pure, unit-testable).
 *
 * Canonical names:
 *   IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS
 *   IMAP_MAILBOXES       — comma-separated folders to sweep (default
 *                          INBOX, Junk so spam-filtered replies still arrive)
 *   IMAP_SYNC_SINCE_DAYS — how far back each fetch scans (default 7)
 *   IMAP_SYNC_SECRET     — bearer secret for POST /api/inbox/fetch
 *   IMAP_SENT_FOLDER     — folder that holds sent mail (default Sent)
 *   IMAP_SYNC_SENT       — import Zoho-sent mail into the dashboard
 *   IMAP_SENT_MIRROR     — mirror dashboard sends into the Zoho Sent folder
 */
export interface ImapConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  mailbox: string;
  /** Every folder swept per-run (INBOX plus any extras like Junk). */
  mailboxes: string[];
  sinceDays: number;
  secure: boolean;
  /** IMAP folder that holds sent mail (default "Sent"). */
  sentFolder: string;
  /** Sweep `sentFolder` and import Zoho-sent mail as outbound messages. */
  syncSent: boolean;
  /** APPEND a copy of dashboard sends into `sentFolder`. */
  mirrorSent: boolean;
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
    : (env.IMAP_MAILBOX?.trim() || "INBOX,Junk")
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
  if (mailboxList.length === 0) mailboxList.push("INBOX");

  // Resolve a boolean flag with an explicit default. `1/true/yes/on` → true,
  // `0/false/no/off` → false, unset → the default.
  const resolveFlag = (
    value: string | undefined,
    defaultValue: boolean
  ): boolean => {
    const v = value?.trim().toLowerCase();
    if (!v) return defaultValue;
    if (v === "1" || v === "true" || v === "yes" || v === "on") return true;
    if (v === "0" || v === "false" || v === "no" || v === "off") return false;
    return defaultValue;
  };

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
      sentFolder: env.IMAP_SENT_FOLDER?.trim() || "Sent",
      // Both directions of the Sent-folder sync are ON by default once IMAP
      // is configured (the owner requires dashboard sends visible in Zoho
      // Sent and Zoho-sent mail visible in the dashboard). Set the env flag
      // to 0/false to disable either direction.
      syncSent: resolveFlag(env.IMAP_SYNC_SENT, true),
      mirrorSent: resolveFlag(env.IMAP_SENT_MIRROR, true),
    },
    missing,
    placeholders,
  };
}
