// ============================================================================
// Stratifit — Services Section Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a multilingual translation set for all 4 languages */
export const serviceTranslationsSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type ServiceTranslationsInput = z.infer<typeof serviceTranslationsSchema>;

/** Validates a single deliverable (translated phrase) */
export const serviceDeliverableSchema = serviceTranslationsSchema;

export type ServiceDeliverableInput = z.infer<typeof serviceDeliverableSchema>;

/** Validates a single service card */
export const serviceCardSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1, "Icon is required"),
  titleTranslations: serviceTranslationsSchema,
  descriptionTranslations: serviceTranslationsSchema,
  deliverables: z
    .array(serviceDeliverableSchema)
    .min(1, "At least one deliverable is required"),
  url: z.string().min(1, "URL is required"),
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  active: z.boolean().default(true),
});

export type ServiceCardInput = z.infer<typeof serviceCardSchema>;

/** Validates the complete services section including cards */
export const servicesSectionSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  subtitleTranslations: serviceTranslationsSchema,
  titleTranslations: serviceTranslationsSchema,
  descriptionTranslations: serviceTranslationsSchema,
  services: z.array(serviceCardSchema).min(1, "At least one service card is required"),
});

export type ServicesSectionInput = z.infer<typeof servicesSectionSchema>;

/** Validates the generic section payload that points to a services section */
export const servicesSectionPayloadSchema = z.object({
  servicesSectionId: z.string().uuid("Services section id is required").optional(),
  heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type ServicesSectionPayload = z.infer<typeof servicesSectionPayloadSchema>;
