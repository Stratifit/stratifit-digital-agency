// ============================================================================
// Stratifit — Pricing Section Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a multilingual translation set for all 4 languages */
export const pricingTranslationsSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type PricingTranslationsInput = z.infer<typeof pricingTranslationsSchema>;

/** Validates a single pricing feature (multilingual) */
export const pricingFeatureSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type PricingFeatureInput = z.infer<typeof pricingFeatureSchema>;

/** Validates a single pricing package */
export const pricingPackageSchema = z.object({
  id: z.string().optional(),
  nameTranslations: pricingTranslationsSchema,
  descriptionTranslations: pricingTranslationsSchema,
  price: z.string().min(1, "Price is required"),
  priceLabelTranslations: pricingTranslationsSchema,
  isPopular: z.boolean().default(false),
  buttonLabelTranslations: pricingTranslationsSchema,
  buttonAction: z.string().min(1, "Button action is required"),
  features: z.array(pricingFeatureSchema).min(1, "At least one feature is required"),
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  active: z.boolean().default(true),
});

export type PricingPackageInput = z.infer<typeof pricingPackageSchema>;

/** Validates the complete pricing section including packages */
export const pricingSectionSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  subtitleTranslations: pricingTranslationsSchema,
  titleTranslations: pricingTranslationsSchema,
  descriptionTranslations: pricingTranslationsSchema,
  packages: z.array(pricingPackageSchema).min(1, "At least one pricing package is required"),
});

export type PricingSectionInput = z.infer<typeof pricingSectionSchema>;

/** Validates the generic section payload that points to a pricing section */
export const pricingSectionPayloadSchema = z.object({
  pricingSectionId: z.string().uuid("Pricing section id is required").optional(),
  heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type PricingSectionPayload = z.infer<typeof pricingSectionPayloadSchema>;
