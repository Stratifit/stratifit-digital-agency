import { z } from "zod";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const finalCtaSchema = z.object({
  title_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English title is required"
  ),
  description_translations: translations(),
  primary_cta_label_translations: translations(),
  primary_cta_url: z.string(),
  secondary_cta_label_translations: translations(),
  secondary_cta_url: z.string(),
  is_visible: z.boolean(),
});

export type FinalCtaFormValues = z.infer<typeof finalCtaSchema>;
