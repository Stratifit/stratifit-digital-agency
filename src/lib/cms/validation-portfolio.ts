// ============================================================================
// Stratifit — Portfolio Section Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a multilingual translation set for all 4 languages */
export const portfolioTranslationsSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type PortfolioTranslationsInput = z.infer<typeof portfolioTranslationsSchema>;

/** Validates a single portfolio item */
export const portfolioItemSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  category: z.string().min(1, "Category is required"),
  titleTranslations: portfolioTranslationsSchema,
  descriptionTranslations: portfolioTranslationsSchema,
  linkUrl: z.string().min(1, "Link URL is required"),
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  active: z.boolean().default(true),
});

export type PortfolioItemInput = z.infer<typeof portfolioItemSchema>;

/** Validates the complete portfolio section including items and filters */
export const portfolioSectionSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  subtitleTranslations: portfolioTranslationsSchema,
  titleTranslations: portfolioTranslationsSchema,
  descriptionTranslations: portfolioTranslationsSchema,
  viewAllUrl: z.string().min(1, "View All URL is required"),
  viewAllLabelTranslations: portfolioTranslationsSchema,
  viewCaseStudyLabelTranslations: portfolioTranslationsSchema,
  filters: z.array(z.string().min(1, "Filter cannot be empty")).min(1, "At least one filter is required"),
  items: z.array(portfolioItemSchema).min(1, "At least one portfolio item is required"),
});

export type PortfolioSectionInput = z.infer<typeof portfolioSectionSchema>;

/** Validates the generic section payload that points to a portfolio section */
export const portfolioSectionPayloadSchema = z.object({
  portfolioSectionId: z.string().uuid("Portfolio section id is required").optional(),
  heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type PortfolioSectionPayload = z.infer<typeof portfolioSectionPayloadSchema>;
