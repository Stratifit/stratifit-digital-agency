export const SUPPORTED_LOCALES = ["en", "de", "fr", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function resolveTranslation(
  translations: Record<string, unknown> | null | undefined,
  locale: string
): string {
  if (!translations || typeof translations !== "object") {
    return "";
  }

  const value = translations[locale];
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  const fallback = translations[DEFAULT_LOCALE];
  if (typeof fallback === "string" && fallback.trim().length > 0) {
    return fallback;
  }

  return "";
}
