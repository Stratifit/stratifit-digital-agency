/**
 * Light, non-invasive validation for a visitor-provided display name.
 * International characters are supported via Unicode letter matching.
 * Rejects greetings, punctuation-only, digit-only and other inputs that do
 * not look like a usable person's name. Never blocks the conversation — the
 * caller falls back to "Visitor" when invalid.
 */

const GREETINGS = [
  "hi",
  "hello",
  "hey",
  "heya",
  "hiya",
  "yo",
  "howdy",
  "hi there",
  "hello there",
  "hey there",
  "good morning",
  "good afternoon",
  "good evening",
  "good day",
];

const MAX_NAME_LENGTH = 60;

export function isValidDisplayName(value: string): boolean {
  const name = value.trim();

  if (name.length < 2 || name.length > MAX_NAME_LENGTH) {
    return false;
  }

  // Must contain at least two alphabetic characters (unicode-aware).
  const letters = Array.from(name).filter((ch) => /\p{L}/u.test(ch));
  if (letters.length < 2) {
    return false;
  }

  // Reject known greetings typed in place of a name.
  const cleaned = name.toLowerCase().replace(/[!.,?]+$/g, "").trim();
  if (GREETINGS.includes(cleaned)) {
    return false;
  }

  // Light sanity check: at least half of the characters must be letters or
  // name punctuation (spaces, hyphens, apostrophes, periods).
  const allowed = Array.from(name).filter(
    (ch) => /\p{L}/u.test(ch) || /[\s\-'’.]/.test(ch)
  );
  return allowed.length / name.length >= 0.5;
}

/** The approved fallback label shown when no usable name is provided. */
export const ANONYMOUS_DISPLAY_NAME = "Visitor";
