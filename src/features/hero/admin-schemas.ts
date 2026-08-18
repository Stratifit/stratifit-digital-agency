import { z } from "zod";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const heroMetricSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label_translations: translations(),
});

export const heroSchema = z.object({
  eyebrow_translations: translations(),
  title_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English title is required"
  ),
  highlight_translations: translations(),
  description_translations: translations(),
  primary_cta_label_translations: translations(),
  primary_cta_url: z.string(),
  secondary_cta_label_translations: translations(),
  secondary_cta_url: z.string(),
  metrics: z.array(heroMetricSchema),
  is_visible: z.boolean(),
});

export type HeroFormValues = z.infer<typeof heroSchema>;
