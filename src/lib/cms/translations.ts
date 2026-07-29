// ============================================================================
// Stratifit — Translation Resolution Utilities
// Applies multilingual overrides to CMS payloads.
// ============================================================================

import type { CmsLanguage, CmsTranslation } from "@/lib/types/cms";

/**
 * Deeply sets a value in an object using a dot-path.
 * Mutates and returns the target object.
 */
function deepSet<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown
): T {
  const keys = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

/**
 * Resolves a single entity's payload against translations for the given language.
 * Returns a **new** object — does not mutate the input.
 *
 * @param payload      The base payload from the database (typically English).
 * @param translations All translations for this entity (any language).
 * @param language     The target language to resolve into.
 * @returns A new payload object with translation overrides applied.
 */
export function resolveEntityTranslations(
  payload: Record<string, unknown>,
  translations: CmsTranslation[],
  language: CmsLanguage
): Record<string, unknown> {
  const resolved: Record<string, unknown> = JSON.parse(JSON.stringify(payload));

  const relevant = translations.filter((t) => t.language === language);

  for (const translation of relevant) {
    // fieldPath is stored as "payload.heading" — strip the leading "payload."
    const path = translation.fieldPath.startsWith("payload.")
      ? translation.fieldPath.slice("payload.".length)
      : translation.fieldPath;

    deepSet(resolved, path, translation.translatedText);
  }

  return resolved;
}
