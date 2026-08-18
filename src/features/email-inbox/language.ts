import { resolveTranslation } from "@/lib/i18n/resolve-translation";

export const SUPPORTED_EMAIL_LANGUAGES = ["en", "de", "fr", "es"] as const;
export type EmailLanguage = (typeof SUPPORTED_EMAIL_LANGUAGES)[number];

export const EMAIL_LANGUAGE_LABELS: Record<EmailLanguage, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

/**
 * Lightweight stop-word sets for detecting the language of an inbound email.
 * Deterministic and dependency-free; best-effort with an English fallback.
 */
const STOP_WORDS: Record<Exclude<EmailLanguage, "en">, string[]> = {
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
 * Detect the language of an inbound email from its headers and text.
 * 1. `Content-Language` header when in the supported set.
 * 2. Stop-word scoring over subject + text (most hits wins, ties → en).
 * 3. Default: en.
 */
export function detectEmailLanguage(input: {
  headers?: Record<string, string> | null;
  subject?: string | null;
  text?: string | null;
}): EmailLanguage {
  const headerLanguage = input.headers?.["content-language"];
  if (
    headerLanguage &&
    (SUPPORTED_EMAIL_LANGUAGES as readonly string[]).includes(
      headerLanguage
    )
  ) {
    return headerLanguage as EmailLanguage;
  }

  const haystack = `${input.subject ?? ""} ${input.text ?? ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  // Exact-word matching so short stop words ("je", "o", "y") can't
  // false-positive on substrings inside English words.
  const tokens = new Set(haystack.split(/[^a-z0-9']+/).filter(Boolean));

  let best: EmailLanguage = "en";
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

export interface TemplateRenderContext {
  name?: string | null;
  section_name?: string | null;
  company?: string | null;
  amount?: string | null;
  due_date?: string | null;
  invoice_number?: string | null;
}

const KNOWN_KEYS = new Set([
  "name",
  "section_name",
  "company",
  "amount",
  "due_date",
  "invoice_number",
]);

/** Replace {{key}} placeholders; unknown keys become an empty string. */
export function renderTemplateText(
  template: string,
  context: TemplateRenderContext
): string {
  return template.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (match, key: string) => {
    const normalized = key.toLowerCase();
    if (!KNOWN_KEYS.has(normalized)) return "";
    const value = context[normalized as keyof TemplateRenderContext];
    return value ?? "";
  });
}

export interface RenderableTemplate {
  subject_translations: Record<string, string> | null;
  body_translations: Record<string, string> | null;
}

/**
 * Render a template's subject and body for a language (English fallback),
 * with placeholders replaced.
 */
export function renderEmailTemplate(
  template: RenderableTemplate,
  language: string,
  context: TemplateRenderContext
): { subject: string; body: string } {
  const subject = resolveTranslation(
    template.subject_translations,
    language
  );
  const body = resolveTranslation(template.body_translations, language);
  return {
    subject: renderTemplateText(subject, context),
    body: renderTemplateText(body, context),
  };
}
