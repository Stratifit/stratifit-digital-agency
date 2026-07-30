// ============================================================================
// Stratifit — Why Us Section Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a multilingual translation set for all 4 languages */
export const whyUsTranslationsSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type WhyUsTranslationsInput = z.infer<typeof whyUsTranslationsSchema>;

/** Validates a single Why Us feature card */
export const whyUsFeatureSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1, "Icon is required"),
  titleTranslations: whyUsTranslationsSchema,
  descriptionTranslations: whyUsTranslationsSchema,
  stat: z.string().min(1, "Stat is required"),
  statLabelTranslations: whyUsTranslationsSchema,
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  active: z.boolean().default(true),
});

export type WhyUsFeatureInput = z.infer<typeof whyUsFeatureSchema>;

/** Validates the complete Why Us section including feature cards */
export const whyUsSectionSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  subtitleTranslations: whyUsTranslationsSchema,
  titleTranslations: whyUsTranslationsSchema,
  descriptionTranslations: whyUsTranslationsSchema,
  features: z.array(whyUsFeatureSchema).min(1, "At least one feature card is required"),
});

export type WhyUsSectionInput = z.infer<typeof whyUsSectionSchema>;

/** Validates the generic section payload that points to a Why Us section */
export const whyUsSectionPayloadSchema = z.object({
  whyUsSectionId: z.string().uuid("Why Us section id is required").optional(),
  heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type WhyUsSectionPayload = z.infer<typeof whyUsSectionPayloadSchema>;
