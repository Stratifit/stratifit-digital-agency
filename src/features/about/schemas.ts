import { z } from "zod";
import { ABOUT_ICON_OPTIONS } from "@/components/ui/about-icon";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

const icon = () =>
  z.string().refine(
    (v) => ABOUT_ICON_OPTIONS.some((o) => o.value === v),
    "Choose an icon"
  );

const englishRequired = (message: string) =>
  translations().refine((t) => t.en.trim().length > 0, message);

export const aboutStatSchema = z.object({
  icon: icon(),
  value: z.string().min(1, "Value is required"),
  label_translations: englishRequired("English label is required"),
});

export const aboutValueSchema = z.object({
  icon: icon(),
  title_translations: englishRequired("English title is required"),
  description_translations: englishRequired("English description is required"),
});

export const aboutPageSchema = z.object({
  eyebrow_translations: translations(),
  title_translations: translations(),
  highlight_translations: translations(),
  intro_translations: translations(),
  stats: z.array(aboutStatSchema),
  mission_translations: englishRequired("English mission is required"),
  story_translations: englishRequired("English story is required"),
  values: z.array(aboutValueSchema),
  team_translations: englishRequired("English team copy is required"),
  cta_title_translations: translations(),
  cta_highlight_translations: translations(),
  cta_description_translations: translations(),
  cta_label_translations: englishRequired("English CTA label is required"),
  cta_url: z.string(),
  seo_title_translations: translations().optional(),
  seo_description_translations: translations().optional(),
  is_visible: z.boolean(),
});

export type AboutPageFormValues = z.infer<typeof aboutPageSchema>;
