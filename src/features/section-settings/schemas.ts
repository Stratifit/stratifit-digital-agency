import { z } from "zod";

export const SUPPORTED_LOCALES = ["en", "de", "fr", "es"] as const;

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

const statsItem = z.object({
  value: z.string().min(1, "Value is required"),
  label_translations: translations(),
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
  /** Optional stats band (used by the /work page via the portfolio section). */
  stats: z.array(statsItem).optional(),
  is_visible: z.boolean(),
});

export type SectionSettingsFormValues = z.infer<
  typeof sectionSettingsSchema
>;
