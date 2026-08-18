import { z } from "zod";

export const COOKIE_LOCALES = ["en", "de", "fr", "es"] as const;
export type CookieLocale = (typeof COOKIE_LOCALES)[number];

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const cookieCategorySchema = z.object({
  key: z.string().min(1, "Key is required"),
  essential: z.boolean().default(false),
  enabled: z.boolean().default(true),
  name_translations: translations(),
  description_translations: translations(),
});

export type CookieCategory = z.infer<typeof cookieCategorySchema>;

export const cookieSettingsSchema = z.object({
  banner_enabled: z.boolean(),
  policy_url: z.string().min(1, "Policy URL is required"),
  banner_title_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English title is required"
  ),
  banner_text_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English text is required"
  ),
  accept_all_label_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English label is required"
  ),
  essential_only_label_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English label is required"
  ),
  settings_label_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English label is required"
  ),
  save_preferences_label_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English label is required"
  ),
  categories: z.array(cookieCategorySchema),
});

export type CookieSettingsFormValues = z.infer<typeof cookieSettingsSchema>;
