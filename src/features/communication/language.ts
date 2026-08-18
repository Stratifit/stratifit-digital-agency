import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./types";

export { SUPPORTED_LANGUAGES };
export type Language = SupportedLanguage;

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

/**
 * Lightweight stop-word sets for detecting the language of an inbound
 * message. Deterministic and dependency-free; best-effort with an English
 * fallback.
 */
const STOP_WORDS: Record<Exclude<SupportedLanguage, "en">, string[]> = {
  de: [
    "hallo",
    "hallo,",
    "sehr geehrte",
    "liebe",
    "vielen dank",
    "danke",
    "bitte",
    "mit freundlichen",
    "grüße",
    "anfrage",
    "angebot",
    "projekt",
    "wir",
    "sie",
    "ihr",
    "ich",
    "und",
    "oder",
    "nicht",
  ],
  fr: [
    "bonjour",
    "bonsoir",
    "merci",
    "veuillez",
    "cher",
    "chère",
    "cordialement",
    "demande",
    "devis",
    "projet",
    "nous",
    "vous",
    "votre",
    "je",
    "et",
    "ou",
    "pas",
    "s'il",
    "svp",
  ],
  es: [
    "hola",
    "buenos días",
    "gracias",
    "por favor",
    "estimado",
    "estimada",
    "saludos",
    "consulta",
    "presupuesto",
    "proyecto",
    "nosotros",
    "ustedes",
    "su",
    "yo",
    "y",
    "o",
    "no",
  ],
};

/**
 * Detect the language of an inbound message from headers and text.
 * 1. `Content-Language` header when in the supported set.
 * 2. Stop-word scoring over subject + text (most hits wins, ties → en).
 * 3. Default: en.
 */
export function detectLanguage(input: {
  headers?: Record<string, string> | null;
  subject?: string | null;
  text?: string | null;
}): SupportedLanguage {
  const headerLanguage = input.headers?.["content-language"];
  if (
    headerLanguage &&
    (SUPPORTED_LANGUAGES as readonly string[]).includes(headerLanguage)
  ) {
    return headerLanguage as SupportedLanguage;
  }

  const haystack = `${input.subject ?? ""} ${input.text ?? ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  // Exact-word matching so short stop words ("je", "o", "y") can't
  // false-positive on substrings inside English words.
  const tokens = new Set(haystack.split(/[^a-z0-9']+/).filter(Boolean));

  let best: SupportedLanguage = "en";
  let bestScore = 0;
  for (const lang of ["de", "fr", "es"] as const) {
    let score = 0;
    for (const word of STOP_WORDS[lang]) {
      const normalized = word
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(" ")) {
        // Multi-word phrases ("sehr geehrte", "por favor") match as-is.
        if (haystack.includes(normalized)) score += 1;
      } else if (tokens.has(normalized)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      best = lang;
      bestScore = score;
    }
  }
  return best;
}

/**
 * Pick the best available translation for a language, falling back to
 * English, then to the first available key. Kept as a thin alias of the
 * shared i18n resolver so behavior stays centralized.
 */
export function pickTranslation(
  translations: Record<string, string> | null | undefined,
  language: string
): string {
  return resolveTranslation(translations, language);
}
