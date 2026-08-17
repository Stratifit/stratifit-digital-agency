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

export const portfolioSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  client_name: z.string().min(1, "Client name is required"),
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
  company_name: z.string(),
  is_visible: z.boolean(),
  is_verified: z.boolean(),
});

export const pricingSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  name_translations: englishRequired("English name is required"),
  description_translations: translations().optional(),
  price_label_translations: englishRequired("English price label is required"),
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

export type PortfolioFormValues = z.infer<typeof portfolioSchema>;
export type InsightFormValues = z.infer<typeof insightSchema>;
export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
export type PricingFormValues = z.infer<typeof pricingSchema>;
export type FaqFormValues = z.infer<typeof faqSchema>;
