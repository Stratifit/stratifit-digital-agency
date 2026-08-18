// Language detection/selection now lives in the Communication Engine
// (src/features/communication). This module keeps the inbox's public API
// stable: re-exports for detect, labels, and template rendering.
import { autoFill } from "@/features/communication/auto-fill";
import { detectLanguage } from "@/features/communication/language";
import { pickTranslation } from "@/features/communication/language";
import type { AutoFillContext } from "@/features/communication/auto-fill";
import type { SupportedLanguage } from "@/features/communication/types";

export const SUPPORTED_EMAIL_LANGUAGES = ["en", "de", "fr", "es"] as const;
export type EmailLanguage = (typeof SUPPORTED_EMAIL_LANGUAGES)[number];

export const EMAIL_LANGUAGE_LABELS: Record<EmailLanguage, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

/** @deprecated Use detectLanguage from the communication engine. */
export function detectEmailLanguage(input: {
  headers?: Record<string, string> | null;
  subject?: string | null;
  text?: string | null;
}): EmailLanguage {
  return detectLanguage(input);
}

export type TemplateRenderContext = AutoFillContext;

export interface RenderableTemplate {
  subject_translations: Record<string, string> | null;
  body_translations: Record<string, string> | null;
}

/** Replace {{key}} placeholders; unknown keys become an empty string. */
export function renderTemplateText(
  template: string,
  context: TemplateRenderContext
): string {
  return autoFill(template, context);
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
  const subject = pickTranslation(template.subject_translations, language);
  const body = pickTranslation(template.body_translations, language);
  return {
    subject: autoFill(subject, context),
    body: autoFill(body, context),
  };
}

export type { SupportedLanguage };
