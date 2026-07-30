// ============================================================================
// Stratifit — How We Work Section Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a multilingual translation set for all 4 languages */
export const howWeWorkTranslationsSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type HowWeWorkTranslationsInput = z.infer<typeof howWeWorkTranslationsSchema>;

/** Validates a single process step */
export const howWeWorkStepSchema = z.object({
  id: z.string().optional(),
  stepNumber: z.number().int().min(1, "Step number must be at least 1"),
  icon: z.string().min(1, "Icon is required"),
  titleTranslations: howWeWorkTranslationsSchema,
  descriptionTranslations: howWeWorkTranslationsSchema,
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
});

export type HowWeWorkStepInput = z.infer<typeof howWeWorkStepSchema>;

/** Validates the complete how we work section including steps */
export const howWeWorkSectionSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  subtitleTranslations: howWeWorkTranslationsSchema,
  titleTranslations: howWeWorkTranslationsSchema,
  descriptionTranslations: howWeWorkTranslationsSchema,
  steps: z.array(howWeWorkStepSchema).min(1, "At least one step is required"),
});

export type HowWeWorkSectionInput = z.infer<typeof howWeWorkSectionSchema>;

/** Validates the generic section payload that points to a how we work section */
export const howWeWorkSectionPayloadSchema = z.object({
  howWeWorkSectionId: z.string().uuid("How We Work section id is required").optional(),
  heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type HowWeWorkSectionPayload = z.infer<typeof howWeWorkSectionPayloadSchema>;
