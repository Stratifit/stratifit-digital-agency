import { z } from "zod";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

const englishRequired = (message: string) =>
  translations().refine((t) => t.en.trim().length > 0, message);

const portfolioGalleryItem = z.object({
  /** Uploaded media asset id (empty when a direct URL is used). */
  media_id: z.string().optional(),
  image_url: z.string(),
});

const translationsArrays = () =>
  z.object({
    en: z.array(z.string()),
    de: z.array(z.string()),
    fr: z.array(z.string()),
    es: z.array(z.string()),
  });

const portfolioMetricItem = z.object({
  value: z.string(),
  label_translations: translations(),
});

/**
 * Editable brand-guidelines document for brand-design case studies. Stored as
 * one JSONB column (portfolio_projects.brand_guidelines) and edited from the
 * admin "Brand guidelines" tab: logo, variants, clearspace rules, colour
 * palette, typography weights, and UI components (icon + title + image).
 */
const brandGuidelineTranslations = () =>
  z.object({
    en: z.string().optional(),
    de: z.string().optional(),
    fr: z.string().optional(),
    es: z.string().optional(),
  });

const brandGuidelineVariant = z.object({
  /** Uploaded media asset id (empty when a direct URL is used). */
  media_id: z.string().optional(),
  image_url: z.string().optional(),
  label_translations: brandGuidelineTranslations().optional(),
});

const brandGuidelineColor = z.object({
  name: z.string().optional(),
  hex: z.string().optional(),
  usage_translations: brandGuidelineTranslations().optional(),
});

const brandGuidelineWeight = z.object({
  name: z.string().optional(),
  weight: z.string().optional(),
  sample: z.string().optional(),
});

const brandGuidelineComponent = z.object({
  /** Icon key — must match a registered guideline icon (see process-icon.tsx). */
  icon_name: z.string().optional(),
  title_translations: brandGuidelineTranslations().optional(),
  description_translations: brandGuidelineTranslations().optional(),
  media_id: z.string().optional(),
  image_url: z.string().optional(),
});

export const brandGuidelinesSchema = z.object({
  /** Primary logo lockup — shown as the document cover block. */
  logo_media_id: z.string().optional(),
  logo_url: z.string().optional(),
  logo_caption_translations: brandGuidelineTranslations().optional(),
  /** Logo variant tiles (2×2 grid on the public page). */
  variants: z.array(brandGuidelineVariant).max(8).optional(),
  /** Clearspace / minimum-size rules. */
  clearspace_translations: brandGuidelineTranslations().optional(),
  clearspace_min_size_translations: brandGuidelineTranslations().optional(),
  clearspace_media_id: z.string().optional(),
  clearspace_url: z.string().optional(),
  /** Primary colour palette swatches. */
  colors: z.array(brandGuidelineColor).max(12).optional(),
  /** Typography — display font name + weight samples. */
  primary_font: z.string().optional(),
  typography_translations: brandGuidelineTranslations().optional(),
  weights: z.array(brandGuidelineWeight).max(6).optional(),
  /** Cards & UI components — each with an icon, copy, and optional image. */
  components: z.array(brandGuidelineComponent).max(8).optional(),
});

/* ------------------------------------------------------------------ */
/* Brand case-study phase documents                                    */
/* ------------------------------------------------------------------ */

/** Supporting sub-font entries (font family + usage note). */
const phaseSubFont = z.object({
  name: z.string().optional(),
  usage: z.string().optional(),
});

/**
 * Multilingual Discovery & Strategy phase document
 * (portfolio_projects.strategy_translations JSONB). Each locale holds the
 * phase subtitle/tagline/headline and the strategy detail blocks.
 */
const strategyLocales = () =>
  z.object({
    en: strategyLocale(),
    de: strategyLocale(),
    fr: strategyLocale(),
    es: strategyLocale(),
  });

function strategyLocale() {
  return z.object({
    subtitle: z.string().optional(),
    tagline: z.string().optional(),
    headline: z.string().optional(),
    audience: z.string().optional(),
    challenges: z.string().optional(),
    positioning: z.string().optional(),
    messaging: z.string().optional(),
    identity: z.string().optional(),
  });
}

/**
 * Multilingual Identity & Assets phase document
 * (portfolio_projects.brand_system_translations JSONB). Each locale holds the
 * build intro, primary typeface, supporting sub-fonts, identity assets intro,
 * and visual applications intro.
 */
function brandSystemLocale() {
  return z.object({
    build_description: z.string().optional(),
    typeface: z.string().optional(),
    typeface_description: z.string().optional(),
    palette_description: z.string().optional(),
    sub_fonts: z.array(phaseSubFont).max(8).optional(),
    identity_assets: z.string().optional(),
    visual_applications: z.string().optional(),
  });
}

const brandSystemLocales = () =>
  z.object({
    en: brandSystemLocale(),
    de: brandSystemLocale(),
    fr: brandSystemLocale(),
    es: brandSystemLocale(),
  });

/**
 * Multilingual Launch & Activation phase document
 * (portfolio_projects.launch_translations JSONB). Each locale holds the
 * headline, section description, digital presence intro, physical touchpoints
 * intro, and brand guidelines intro.
 */
function launchLocale() {
  return z.object({
    headline: z.string().optional(),
    description: z.string().optional(),
    intro: z.string().optional(),
    physical: z.string().optional(),
    guidelines: z.string().optional(),
  });
}

const launchLocales = () =>
  z.object({
    en: launchLocale(),
    de: launchLocale(),
    fr: launchLocale(),
    es: launchLocale(),
  });

export const portfolioSchema = z.object({
  slug: z
    .string()
    .optional()
    .default("")
    .refine((slug) => slug === "" || /^[a-z0-9-]+$/.test(slug), "Lowercase letters, numbers, hyphens only"),
  client_name: z.string().min(1, "Client name is required"),
  /** Primary category = linked service slug (empty means no category). */
  service_slug: z.string().optional(),
  /** Gallery images in display order (up to 6, matching the card grid). */
  gallery: z.array(portfolioGalleryItem).max(6).optional(),
  /** Case study fields shown on the public /work/[slug] page. */
  deliverables_translations: translationsArrays().optional(),
  /** Logo concept / monogram rationale for brand case studies ("Why This Mark"). */
  brand_story_translations: translations().optional(),
  /** Editable brand-guidelines document (logo, variants, colours, type, UI). */
  brand_guidelines: brandGuidelinesSchema.optional(),
  /** Multilingual Discovery & Strategy phase document. */
  strategy_translations: strategyLocales().optional(),
  /** Multilingual Identity & Assets phase document. */
  brand_system_translations: brandSystemLocales().optional(),
  /** Multilingual Launch & Activation phase document. */
  launch_translations: launchLocales().optional(),
  challenge_translations: translations().optional(),
  solution_translations: translations().optional(),
  results_translations: translations().optional(),
  metrics: z.array(portfolioMetricItem).max(8).optional(),
  year: z
    .union([z.string().regex(/^\d{4}$/, "Enter a 4-digit year"), z.literal("")])
    .optional(),
  testimonial_id: z.string().optional(),
  title_translations: englishRequired("English title is required"),
  summary_translations: englishRequired("English summary is required"),
  image_url: z.string(),
  seo_title_translations: translations().optional(),
  seo_description_translations: translations().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

export const insightSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  title_translations: englishRequired("English title is required"),
  excerpt_translations: englishRequired("English excerpt is required"),
  reading_time_minutes: z.number().int().min(1),
  seo_title_translations: translations().optional(),
  seo_description_translations: translations().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

export const testimonialSchema = z.object({
  person_name: z.string().min(1, "Person name is required"),
  quote_translations: englishRequired("English quote is required"),
  person_role_translations: translations().optional(),
  company_name: z.string(),
  source: z.enum(["website", "google"]).default("website"),
  is_visible: z.boolean(),
  is_verified: z.boolean(),
});

const featuresTranslations = () =>
  z.object({
    en: z.array(z.string()),
    de: z.array(z.string()),
    fr: z.array(z.string()),
    es: z.array(z.string()),
  });

export const pricingSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  name_translations: englishRequired("English name is required"),
  description_translations: translations().optional(),
  price_label_translations: englishRequired("English price label is required"),
  billing_label_translations: translations().optional(),
  features_translations: featuresTranslations().optional(),
  cta_label_translations: translations().optional(),
  cta_url: z.string().optional(),
  display_order: z.number().int().min(0),
  is_visible: z.boolean(),
  is_featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
});

export const faqSchema = z.object({
  question_translations: englishRequired("English question is required"),
  answer_translations: englishRequired("English answer is required"),
  category: z.string().min(1, "Category is required"),
  display_order: z.number().int().min(0),
  is_visible: z.boolean(),
  is_ai_eligible: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
});

export type BrandGuidelinesFormValues = z.infer<typeof brandGuidelinesSchema>;
export type PortfolioFormValues = z.infer<typeof portfolioSchema>;
export type InsightFormValues = z.infer<typeof insightSchema>;
export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
export type PricingFormValues = z.infer<typeof pricingSchema>;
export type FaqFormValues = z.infer<typeof faqSchema>;
