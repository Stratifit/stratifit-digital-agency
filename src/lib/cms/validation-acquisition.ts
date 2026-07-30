// ============================================================================
// Stratifit — Acquisition / Buy a Business Section Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a multilingual translation set for all 4 languages */
export const acquisitionTranslationsSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type AcquisitionTranslationsInput = z.infer<typeof acquisitionTranslationsSchema>;

/** Validates a single acquisition / business card */
export const acquisitionCardSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1, "Business URL is required"),
  category: z.string().min(1, "Category is required"),
  categoryColor: z.string().min(1, "Category color is required"),
  categoryBorderRadius: z.string().min(1, "Category border radius is required"),
  navEmoji: z.string().min(1, "Nav emoji is required"),
  navTitle: z.string().min(1, "Nav title is required"),
  bgImageUrl: z.string().min(1, "Background image URL is required"),
  overlayColor: z.string().min(1, "Overlay color is required"),
  iconRadius: z.string().min(1, "Icon radius is required"),
  iconBorder: z.string().min(1, "Icon border is required"),
  iconShadow: z.string().min(1, "Icon shadow is required"),
  mainEmoji: z.string().min(1, "Main emoji is required"),
  titleTranslations: acquisitionTranslationsSchema,
  descriptionTranslations: acquisitionTranslationsSchema,
  tags: z.array(z.string().min(1, "Tag cannot be empty")).min(1, "At least one tag is required"),
  gridEmojis: z.array(z.string().min(1, "Grid emoji cannot be empty")).min(3, "Exactly 3 grid emojis are required").max(3, "Exactly 3 grid emojis are required"),
  buttonTextTranslations: acquisitionTranslationsSchema,
  trustBadges: z.array(z.string().min(1, "Trust badge cannot be empty")),
  price: z.string().min(1, "Price is required"),
  linkUrl: z.string().min(1, "Detail link URL is required"),
  visitLinkUrl: z.string().min(1, "Visit link URL is required"),
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  active: z.boolean().default(true),
});

export type AcquisitionCardInput = z.infer<typeof acquisitionCardSchema>;

/** Validates the complete acquisition section including cards and filters */
export const acquisitionSectionSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  subtitleTranslations: acquisitionTranslationsSchema,
  titleTranslations: acquisitionTranslationsSchema,
  descriptionTranslations: acquisitionTranslationsSchema,
  viewAllUrl: z.string().min(1, "View All URL is required"),
  viewAllLabelTranslations: acquisitionTranslationsSchema,
  viewDetailLabelTranslations: acquisitionTranslationsSchema,
  visitSiteLabelTranslations: acquisitionTranslationsSchema,
  buyBusinessLabelTranslations: acquisitionTranslationsSchema,
  filters: z.array(z.string().min(1, "Filter cannot be empty")).min(1, "At least one filter is required"),
  items: z.array(acquisitionCardSchema).min(1, "At least one business card is required"),
});

export type AcquisitionSectionInput = z.infer<typeof acquisitionSectionSchema>;

/** Validates the generic section payload that points to an acquisition section */
export const acquisitionSectionPayloadSchema = z.object({
  acquisitionSectionId: z.string().uuid("Acquisition section id is required").optional(),
  heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type AcquisitionSectionPayload = z.infer<typeof acquisitionSectionPayloadSchema>;
