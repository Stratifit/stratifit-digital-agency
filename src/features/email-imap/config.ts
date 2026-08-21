/**
 * IMAP configuration resolution (pure, unit-testable).
 *
 * Canonical names:
 *   IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS, IMAP_MAILBOX
 *   IMAP_SYNC_SINCE_DAYS — how far back each fetch scans (default 7)
 *   IMAP_SYNC_SECRET     — bearer secret for POST /api/inbox/fetch
 */
export interface ImapConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  mailbox: string;
  sinceDays: number;
  secure: boolean;
}

export interface ImapConfigResult {
  config: ImapConfig | null;
  missing: string[];
}

export function resolveImapConfig(
  env: Record<string, string | undefined>
): ImapConfigResult {
  const host = env.IMAP_HOST?.trim() || null;
  const user = env.IMAP_USER?.trim() || null;
  const pass = env.IMAP_PASS?.trim() || null;

  const missing: string[] = [];
  if (!host) missing.push("IMAP_HOST");
  if (!user) missing.push("IMAP_USER");
  if (!pass) missing.push("IMAP_PASS");

  if (!host || !user || !pass) {
    return { config: null, missing };
  }

  const rawPort = Number(env.IMAP_PORT ?? "993");
  const port = Number.isFinite(rawPort) && rawPort > 0 ? rawPort : 993;
  const sinceDays = Math.max(
    1,
    Math.min(90, Number(env.IMAP_SYNC_SINCE_DAYS ?? "7") || 7)
  );

  return {
    config: {
      host,
      port,
      user,
      pass,
      mailbox: env.IMAP_MAILBOX?.trim() || "INBOX",
      sinceDays,
      // Zoho IMAP is TLS on 993; never fall back to plaintext.
      secure: true,
    },
    missing,
  };
}
