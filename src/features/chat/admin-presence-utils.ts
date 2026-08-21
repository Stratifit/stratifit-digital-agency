/** How fresh `last_seen_at` must be for an admin to count as online. */
export const ADMIN_ONLINE_WINDOW_MS = 3 * 60_000;

/**
 * Pure helper: a presence timestamp is "online" when it falls inside the
 * freshness window and is not in the future.
 */
export function isWithinOnlineWindow(
  lastSeenIso: string | null,
  now = Date.now(),
  windowMs = ADMIN_ONLINE_WINDOW_MS
): boolean {
  if (!lastSeenIso) return false;
  const lastSeen = new Date(lastSeenIso).getTime();
  if (Number.isNaN(lastSeen)) return false;
  const age = now - lastSeen;
  return age >= 0 && age <= windowMs;
}
