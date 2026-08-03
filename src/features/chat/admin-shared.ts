import { isValidDisplayName, ANONYMOUS_DISPLAY_NAME } from "@/lib/validate-display-name";

/** Formats the sequential visitor number for admin display (1 → 001). */
export function paddedVisitorNumber(n: number | null | undefined): string {
  return n != null ? String(n).padStart(3, "0") : "—";
}

export interface AdminVisitorSummary {
  visitor_number: number | null;
  /** Display name or the "Visitor" fallback. */
  name: string;
  /** Raw stored name (may be empty) — used for admin search. */
  raw_name: string;
  email: string;
  preferred_locale: string;
  first_seen_at: string;
  last_seen_at: string;
}

export function visitorDisplayName(metadata: Record<string, unknown>): string {
  const raw =
    typeof metadata?.name === "string" && metadata.name.trim()
      ? metadata.name.trim()
      : "";
  return isValidDisplayName(raw) ? raw : ANONYMOUS_DISPLAY_NAME;
}
