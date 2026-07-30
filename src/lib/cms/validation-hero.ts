// ============================================================================
// Stratifit — Hero Section Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a multilingual translation set for all 4 languages */
export const heroTranslationsSchema = z.object({
  en: z.string().min(1, "English text is required"),
  fr: z.string().min(1, "French text is required"),
  de: z.string().min(1, "German text is required"),
  es: z.string().min(1, "Spanish text is required"),
});

export type HeroTranslationsInput = z.infer<typeof heroTranslationsSchema>;

/** Validates a single CTA */
export const heroCtaSchema = z.object({
  id: z.string().min(1, "CTA id is required"),
  labelTranslations: heroTranslationsSchema,
  href: z.string().min(1, "CTA href is required"),
  variant: z.enum(["primary", "secondary"], {
    errorMap: () => ({ message: "CTA variant must be primary or secondary" }),
  }),
});

export type HeroCtaInput = z.infer<typeof heroCtaSchema>;

/** Validates a single trust badge / stat */
export const heroTrustBadgeSchema = z.object({
  id: z.string().min(1, "Trust badge id is required"),
  value: z.string().min(1, "Trust badge value is required"),
  labelTranslations: heroTranslationsSchema,
});

export type HeroTrustBadgeInput = z.infer<typeof heroTrustBadgeSchema>;

/** Validates a single tech stack item */
export const heroTechStackItemSchema = z.object({
  name: z.string().min(1, "Tech stack item name is required"),
  iconId: z.string().min(1, "Tech stack item icon id is required"),
});

export type HeroTechStackItemInput = z.infer<typeof heroTechStackItemSchema>;

/** Validates the tech stack block */
export const heroTechStackSchema = z.object({
  titleTranslations: heroTranslationsSchema,
  descriptionTranslations: heroTranslationsSchema,
  items: z
    .array(heroTechStackItemSchema)
    .min(1, "At least one tech stack item is required"),
});

export type HeroTechStackInput = z.infer<typeof heroTechStackSchema>;

/** Validates the complete hero section payload */
export const heroSectionSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  sticky: z.boolean().default(false),
  subtitleTranslations: heroTranslationsSchema,
  titleTranslations: heroTranslationsSchema,
  titleHighlightTranslations: heroTranslationsSchema,
  descriptionTranslations: heroTranslationsSchema,
  ctas: z.array(heroCtaSchema).min(1, "At least one CTA is required"),
  trustBadges: z
    .array(heroTrustBadgeSchema)
    .min(1, "At least one trust badge is required"),
  techStack: heroTechStackSchema,
  url: z.string().default(""),
});

export type HeroSectionInput = z.infer<typeof heroSectionSchema>;

/** Validates the section payload for hero sections (legacy generic sections table) */
export const heroSectionPayloadSchema = z.object({
  heroSectionId: z.string().uuid().optional(),
});

export type HeroSectionPayload = z.infer<typeof heroSectionPayloadSchema>;
