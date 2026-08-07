import { z } from "zod";

export const SUPPORTED_LOCALES = ["en", "de", "fr", "es"] as const;

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const sectionSettingsSchema = z.object({
  eyebrow_translations: translations(),
  title_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English title is required"
  ),
  highlight_translations: translations(),
  description_translations: translations(),
  /** Optional closing call-to-action (CTA-capable sections only). */
  cta_label_translations: translations().optional(),
  cta_url: z.string().optional(),
  is_visible: z.boolean(),
});

export type SectionSettingsFormValues = z.infer<
  typeof sectionSettingsSchema
>;
