import type { EmailLanguage } from "./language";

export interface SectionRoutingCandidate {
  id: string;
  slug: string;
  /** `null` means language-agnostic (matches any language). */
  language: string | null;
  routing_addresses: string[];
}

/**
 * Pick the section an inbound email should land in, given the envelope
 * recipients and the detected language.
 *
 * Resolution order:
 * 1. Exact routing-address match with the matching language.
 * 2. Exact routing-address match on a language-agnostic section (null).
 * 3. Any exact routing-address match.
 * 4. The `other` fallback section, preferring the matching language, then a
 *    language-agnostic one.
 *
 * Pure and dependency-free so it can be unit tested directly.
 */
export function selectSectionForLanguage(
  sections: SectionRoutingCandidate[],
  recipients: string[],
  language: EmailLanguage
): { id: string; slug: string } | null {
  const normalizedRecipients = new Set(
    recipients.map((r) => r.trim().toLowerCase())
  );

  const matches = sections.filter((section) =>
    (section.routing_addresses ?? []).some((address) =>
      normalizedRecipients.has(address.trim().toLowerCase())
    )
  );

  const languageMatch = matches.find((s) => s.language === language);
  if (languageMatch) {
    return { id: languageMatch.id, slug: languageMatch.slug };
  }

  const agnosticMatch = matches.find((s) => s.language === null);
  if (agnosticMatch) {
    return { id: agnosticMatch.id, slug: agnosticMatch.slug };
  }

  if (matches.length > 0) {
    return { id: matches[0].id, slug: matches[0].slug };
  }

  const fallbacks = sections.filter((s) => s.slug === "other");
  const otherLanguageMatch = fallbacks.find((s) => s.language === language);
  if (otherLanguageMatch) {
    return { id: otherLanguageMatch.id, slug: otherLanguageMatch.slug };
  }
  const otherAgnostic =
    fallbacks.find((s) => s.language === null) ?? fallbacks[0];
  return otherAgnostic ? { id: otherAgnostic.id, slug: otherAgnostic.slug } : null;
}

export interface LanguageTaggedSection {
  language: string | null;
}

/**
 * From a list already scoped to a single form source (or other shared key),
 * pick the section whose language matches the visitor's language, falling back
 * to the language-agnostic (null) section and then the first entry. Pure and
 * dependency-free so it can be unit tested directly.
 */
export function pickSectionByLanguage<T extends LanguageTaggedSection>(
  sections: readonly T[],
  language?: string | null
): T | undefined {
  if (language) {
    const match = sections.find((section) => section.language === language);
    if (match) return match;
  }
  return (
    sections.find((section) => section.language === null) ?? sections[0]
  );
}
