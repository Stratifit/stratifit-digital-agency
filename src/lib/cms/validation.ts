// ============================================================================
// Stratifit — Zod Validation Schemas for CMS Payloads
// Enforces multilingual rules and runtime type safety.
// ============================================================================

import { z } from "zod";
import { announcementBarSectionPayloadSchema } from "./validation-announcement";
import {
  howWeWorkSectionPayloadSchema,
  type HowWeWorkSectionPayload as HowWeWorkSectionPayloadImported,
} from "./validation-how-we-work";
import {
  whyUsSectionPayloadSchema,
  type WhyUsSectionPayload as WhyUsSectionPayloadImported,
} from "./validation-why-us";

// ============================================================================
// Shared Primitives
// ============================================================================

const languageSchema = z.enum(["en", "fr", "de", "es"]);

const jsonPayloadSchema: z.ZodType<Record<string, unknown>> = z.record(
  z.string(),
  z.unknown()
);

const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(200, "Slug must be at most 200 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be kebab-case (e.g. 'about-us')"
  );

const displayOrderSchema = z.number().int().min(0);

// ============================================================================
// CtaLink — reusable shape for call-to-action objects in payloads
// ============================================================================
const ctaLinkSchema = z.object({
  text: z.string().min(1, "CTA text is required"),
  href: z.string().min(1, "CTA href is required"),
});

// ============================================================================
// Page Validation
// ============================================================================

export const pageSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1, "Page title is required").max(300),
  language: languageSchema,
  metaTitle: z.string().max(200).nullable().optional(),
  metaDescription: z.string().max(500).nullable().optional(),
  published: z.boolean().default(false),
});

export type PageInput = z.infer<typeof pageSchema>;

// ============================================================================
// Section Validation
// ============================================================================

const sectionComponentTypes = [
  "HeroSection",
  "services",
  "how_we_work",
  "why_us",
  "ServicesSection",
  "StatsSection",
  "TestimonialsSection",
  "CtaSection",
  "AnnouncementBarSection",
] as const;

export const sectionSchema = z.object({
  pageId: z.string().uuid("pageId must be a valid UUID"),
  componentType: z.enum(sectionComponentTypes, {
    errorMap: () => ({
      message: `componentType must be one of: ${sectionComponentTypes.join(", ")}`,
    }),
  }),
  displayOrder: displayOrderSchema,
  payload: jsonPayloadSchema,
});

export type SectionInput = z.infer<typeof sectionSchema>;

// --------------------------------------------------------------------------
// Section payload sub-schemas (validated at render time)
// --------------------------------------------------------------------------

export const heroSectionPayloadSchema = z.object({
  heroSectionId: z.string().uuid("Hero section id is required").optional(),
});

export type HeroSectionPayload = z.infer<typeof heroSectionPayloadSchema>;

export const servicesSectionPayloadSchema = z.object({
  servicesSectionId: z.string().uuid("Services section id is required").optional(),
  heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type ServicesSectionPayload = z.infer<
  typeof servicesSectionPayloadSchema
>;

export type HowWeWorkSectionPayload = HowWeWorkSectionPayloadImported;

export type WhyUsSectionPayload = WhyUsSectionPayloadImported;

export const statsSectionPayloadSchema = z.object({
  heading: z.string().min(1, "Stats heading is required"),
});

export type StatsSectionPayload = z.infer<typeof statsSectionPayloadSchema>;

export const testimonialsSectionPayloadSchema = z.object({
  heading: z.string().min(1, "Testimonials heading is required"),
  description: z.string().optional().default(""),
});

export type TestimonialsSectionPayload = z.infer<
  typeof testimonialsSectionPayloadSchema
>;

export const ctaSectionPayloadSchema = z.object({
  heading: z.string().min(1, "CTA heading is required"),
  description: z.string().optional().default(""),
  ctaText: z.string().min(1, "CTA text is required"),
  ctaHref: z.string().min(1, "CTA href is required"),
});

export type CtaSectionPayload = z.infer<typeof ctaSectionPayloadSchema>;

/** Map of component_type → Zod schema for payload validation */
export const sectionPayloadSchemas: Record<string, z.ZodSchema> = {
  HeroSection: heroSectionPayloadSchema,
  services: servicesSectionPayloadSchema,
  how_we_work: howWeWorkSectionPayloadSchema,
  why_us: whyUsSectionPayloadSchema,
  ServicesSection: servicesSectionPayloadSchema,
  StatsSection: statsSectionPayloadSchema,
  TestimonialsSection: testimonialsSectionPayloadSchema,
  CtaSection: ctaSectionPayloadSchema,
  AnnouncementBarSection: announcementBarSectionPayloadSchema,
};

// ============================================================================
// Content Block Validation
// ============================================================================

const blockTypeSchema = z.enum(["service", "stat", "testimonial"]);

export const contentBlockSchema = z.object({
  sectionId: z.string().uuid("sectionId must be a valid UUID"),
  blockType: blockTypeSchema,
  displayOrder: displayOrderSchema,
  payload: jsonPayloadSchema,
});

export type ContentBlockInput = z.infer<typeof contentBlockSchema>;

// --------------------------------------------------------------------------
// Block payload sub-schemas
// --------------------------------------------------------------------------

export const serviceBlockPayloadSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().min(1, "Service description is required"),
  icon: z.string().optional().default("code"),
});

export type ServiceBlockPayload = z.infer<typeof serviceBlockPayloadSchema>;

export const statBlockPayloadSchema = z.object({
  label: z.string().min(1, "Stat label is required"),
  value: z.string().min(1, "Stat value is required"),
});

export type StatBlockPayload = z.infer<typeof statBlockPayloadSchema>;

export const testimonialBlockPayloadSchema = z.object({
  quote: z.string().min(1, "Testimonial quote is required"),
  attribution: z.string().min(1, "Attribution is required"),
  role: z.string().optional().default(""),
  avatarUrl: z.string().nullable().optional(),
});

export type TestimonialBlockPayload = z.infer<
  typeof testimonialBlockPayloadSchema
>;

/** Map of block_type → Zod schema for payload validation */
export const blockPayloadSchemas: Record<string, z.ZodSchema> = {
  service: serviceBlockPayloadSchema,
  stat: statBlockPayloadSchema,
  testimonial: testimonialBlockPayloadSchema,
};

// ============================================================================
// Translation Validation
// ============================================================================

export const translationSchema = z.object({
  entityType: z.enum(["page", "section", "content_block"]),
  entityId: z.string().uuid("entityId must be a valid UUID"),
  language: languageSchema,
  fieldPath: z
    .string()
    .min(1, "fieldPath is required")
    .regex(
      /^[a-zA-Z]+(?:\.[a-zA-Z]+)*$/,
      "fieldPath must be a dot-path (e.g. 'payload.heading')"
    ),
  translatedText: z
    .string()
    .min(1, "translatedText is required")
    .max(1000, "translatedText must be at most 1000 characters"),
});

export type TranslationInput = z.infer<typeof translationSchema>;

// ============================================================================
// Media Validation
// ============================================================================

export const mediaSchema = z.object({
  filename: z.string().min(1, "Filename is required").max(500),
  altText: z.string().max(500).nullable().optional(),
  url: z.string().url("url must be a valid URL"),
  mimeType: z.string().max(100).nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
});

export type MediaInput = z.infer<typeof mediaSchema>;

// ============================================================================
// Settings Validation
// ============================================================================

export const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(200),
  logoMediaId: z.string().uuid().nullable().optional(),
  primaryLanguage: languageSchema.default("en"),
  availableLanguages: z
    .array(languageSchema)
    .min(1, "At least one language is required")
    .default(["en", "fr", "de", "es"]),
  socialLinks: z.record(z.string(), z.string()).default({}),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

// ============================================================================
// Multilingual Rule Enforcement Helpers
// ============================================================================

/**
 * Asserts that a translation set contains at least one entry for every
 * language in the provided list.  If `baseLanguage` is excluded, it's
 * skipped (base values come from the payload directly).
 */
export function assertAllLanguagesPresent(
  translations: { language: string }[],
  languages: string[],
  baseLanguage = "en"
): void {
  const present = new Set(translations.map((t) => t.language));
  const required = languages.filter((l) => l !== baseLanguage);
  const missing = required.filter((l) => !present.has(l));
  if (missing.length > 0) {
    throw new Error(
      `Missing translations for languages: ${missing.join(", ")}`
    );
  }
}
