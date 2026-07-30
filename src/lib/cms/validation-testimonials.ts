// ============================================================================
// Stratifit — Testimonials Section Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a multilingual translation set for all 4 languages */
export const testimonialsTranslationsSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type TestimonialsTranslationsInput = z.infer<typeof testimonialsTranslationsSchema>;

/** Validates a single testimonial card */
export const testimonialCardSchema = z.object({
  id: z.string().optional(),
  initials: z.string().min(1, "Initials are required").max(3, "Initials must be at most 3 characters"),
  nameTranslations: testimonialsTranslationsSchema,
  roleTranslations: testimonialsTranslationsSchema,
  quoteTranslations: testimonialsTranslationsSchema,
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  active: z.boolean().default(true),
});

export type TestimonialCardInput = z.infer<typeof testimonialCardSchema>;

/** Validates the complete testimonials section including cards */
export const testimonialsSectionSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  subtitleTranslations: testimonialsTranslationsSchema,
  titleTranslations: testimonialsTranslationsSchema,
  descriptionTranslations: testimonialsTranslationsSchema,
  viewAllUrl: z.string().min(1, "View All URL is required"),
  viewAllLabelTranslations: testimonialsTranslationsSchema,
  cards: z.array(testimonialCardSchema).min(1, "At least one testimonial card is required"),
});

export type TestimonialsSectionInput = z.infer<typeof testimonialsSectionSchema>;

/** Validates the generic section payload that points to a testimonials section */
export const testimonialsSectionPayloadSchema = z.object({
  testimonialsSectionId: z.string().uuid("Testimonials section id is required").optional(),
  heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type TestimonialsSectionPayload = z.infer<typeof testimonialsSectionPayloadSchema>;
