// ============================================================================
// Stratifit — Insights Section Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a multilingual translation set for all 4 languages */
export const insightsTranslationsSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type InsightsTranslationsInput = z.infer<typeof insightsTranslationsSchema>;

/** Validates a single insight card */
export const insightCardSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  category: z.string().min(1, "Category is required"),
  titleTranslations: insightsTranslationsSchema,
  descriptionTranslations: insightsTranslationsSchema,
  linkUrl: z.string().min(1, "Link URL is required"),
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  active: z.boolean().default(true),
});

export type InsightCardInput = z.infer<typeof insightCardSchema>;

/** Validates the complete insights section including cards */
export const insightsSectionSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  subtitleTranslations: insightsTranslationsSchema,
  titleTranslations: insightsTranslationsSchema,
  descriptionTranslations: insightsTranslationsSchema,
  viewAllUrl: z.string().min(1, "View All URL is required"),
  viewAllLabelTranslations: insightsTranslationsSchema,
  readMoreLabelTranslations: insightsTranslationsSchema,
  cards: z.array(insightCardSchema).min(1, "At least one insight card is required"),
});

export type InsightsSectionInput = z.infer<typeof insightsSectionSchema>;

/** Validates the generic section payload that points to an insights section */
export const insightsSectionPayloadSchema = z.object({
  insightsSectionId: z.string().uuid("Insights section id is required").optional(),
  heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type InsightsSectionPayload = z.infer<typeof insightsSectionPayloadSchema>;
