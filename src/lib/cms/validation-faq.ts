// ============================================================================
// Stratifit — FAQ Section Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a multilingual translation set for all 4 languages */
export const faqTranslationsSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type FaqTranslationsInput = z.infer<typeof faqTranslationsSchema>;

/** Validates a single FAQ item */
export const faqItemSchema = z.object({
  id: z.string().optional(),
  questionTranslations: faqTranslationsSchema,
  answerTranslations: faqTranslationsSchema,
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  active: z.boolean().default(true),
});

export type FaqItemInput = z.infer<typeof faqItemSchema>;

/** Validates the complete FAQ section including items */
export const faqSectionSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  subtitleTranslations: faqTranslationsSchema,
  titleTranslations: faqTranslationsSchema,
  descriptionTranslations: faqTranslationsSchema,
  items: z.array(faqItemSchema).min(1, "At least one FAQ item is required"),
});

export type FaqSectionInput = z.infer<typeof faqSectionSchema>;

/** Validates the generic section payload that points to a FAQ section */
export const faqSectionPayloadSchema = z.object({
  faqSectionId: z.string().uuid("FAQ section id is required").optional(),
  heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type FaqSectionPayload = z.infer<typeof faqSectionPayloadSchema>;
