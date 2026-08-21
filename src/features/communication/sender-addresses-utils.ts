export const DEFAULT_SENDER_ADDRESSES = [
  "contact@stratifit.com",
  "hello@stratifit.com",
  "info@stratifit.com",
  "sales@stratifit.com",
  "support@stratifit.com",
];

/** Normalize a raw address list: trim, lowercase, drop empties, dedupe. */
export function normalizeAddressList(
  values: (string | null | undefined)[]
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const normalized = value?.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

/**
 * Resolve the final address list: database rows win, then the
 * COMMUNICATION_REPLY_AS env var, then the built-in defaults.
 */
export function resolveSenderAddresses(
  dbEmails: (string | null | undefined)[],
  envEmails: (string | null | undefined)[]
): string[] {
  const db = normalizeAddressList(dbEmails);
  if (db.length > 0) return db;
  const env = normalizeAddressList(envEmails);
  if (env.length > 0) return env;
  return [...DEFAULT_SENDER_ADDRESSES];
}
