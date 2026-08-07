import { z } from "zod";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

const englishRequired = (message: string) =>
  translations().refine((t) => t.en.trim().length > 0, message);

export const serviceSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or hyphens"),
  title_translations: englishRequired("English title is required"),
  short_description_translations: englishRequired(
    "English short description is required"
  ),
  icon_name: z.string(),
  cta_label_translations: translations(),
  cta_url: z.string(),
  cta_style: z.enum(["full", "compact"]),
  display_order: z.number().int().min(0),
  is_featured: z.boolean(),
  is_visible: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

const EMPTY_TRANSLATIONS = { en: "", de: "", fr: "", es: "" };

export function emptyServiceForm(): ServiceFormValues {
  return {
    slug: "",
    title_translations: { ...EMPTY_TRANSLATIONS },
    short_description_translations: { ...EMPTY_TRANSLATIONS },
    icon_name: "",
    cta_label_translations: { ...EMPTY_TRANSLATIONS },
    cta_url: "",
    cta_style: "full",
    display_order: 0,
    is_featured: false,
    is_visible: true,
    status: "draft",
  };
}
