/**
 * Single-field amber-highlight editing for section headers.
 *
 * Admins type the whole heading in one field and wrap the part that should
 * render in the amber brand accent in angle brackets, e.g.:
 *
 *   Our Core <Services>
 *
 * The database keeps storing `title_translations` (clean text) and
 * `highlight_translations` (the extracted amber span) separately, so the
 * public renderer is untouched.
 */

const MARKER_PATTERN = /<([^<>]*)>/;

/** Merges a stored highlight back into the title as a trailing marker. */
export function mergeHighlightIntoTitle(
  title: string | null | undefined,
  highlight: string | null | undefined
): string {
  const cleanTitle = (title ?? "").trim();
  const cleanHighlight = (highlight ?? "").trim();
  if (!cleanHighlight) return cleanTitle;
  return `${cleanTitle} <${cleanHighlight}>`;
}

/**
 * Extracts the first `<…>` marker from a raw title. Returns the cleaned title
 * and the highlighted span (empty string when no marker is present).
 */
export function splitTitleHighlight(raw: string | null | undefined): {
  title: string;
  highlight: string;
} {
  const value = raw ?? "";
  const match = MARKER_PATTERN.exec(value);
  if (!match) {
    return { title: value.trim(), highlight: "" };
  }
  return {
    title: value.replace(MARKER_PATTERN, "").replace(/\s+/g, " ").trim(),
    highlight: match[1].trim(),
  };
}
