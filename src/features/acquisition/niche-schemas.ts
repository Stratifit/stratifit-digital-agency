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

const statSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label_translations: englishRequired("English label is required"),
  hint_translations: translations(),
});

export const acquisitionNicheSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or hyphens"),
  emoji: z.string().min(1, "Emoji is required"),
  accent: z.string().min(1, "Accent color is required"),
  label_translations: englishRequired("English label is required"),
  description_translations: englishRequired("English description is required"),
  why_title_translations: englishRequired("English why-title is required"),
  why_description_translations: englishRequired(
    "English why-description is required"
  ),
  stats: z.array(statSchema).max(3, "Up to 3 stats allowed"),
  is_visible: z.boolean(),
  display_order: z.number().int().min(0),
});

export type AcquisitionNicheFormValues = z.infer<
  typeof acquisitionNicheSchema
>;

const EMPTY_TRANSLATIONS = { en: "", de: "", fr: "", es: "" };

export function emptyAcquisitionNicheForm(): AcquisitionNicheFormValues {
  return {
    slug: "",
    emoji: "📦",
    accent: "#F59E0B",
    label_translations: { ...EMPTY_TRANSLATIONS },
    description_translations: { ...EMPTY_TRANSLATIONS },
    why_title_translations: { ...EMPTY_TRANSLATIONS },
    why_description_translations: { ...EMPTY_TRANSLATIONS },
    stats: [],
    is_visible: true,
    display_order: 0,
  };
}
