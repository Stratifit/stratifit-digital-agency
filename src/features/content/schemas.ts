import { z } from "zod";

const enTranslation = (message: string) => z.string().min(1, message);

export const portfolioSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  client_name: z.string().min(1, "Client name is required"),
  title: enTranslation("English title is required"),
  summary: enTranslation("English summary is required"),
  status: z.enum(["draft", "published", "archived"]),
});

export const insightSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  title: enTranslation("English title is required"),
  excerpt: enTranslation("English excerpt is required"),
  reading_time_minutes: z.number().int().min(1),
  status: z.enum(["draft", "published", "archived"]),
});

export const testimonialSchema = z.object({
  person_name: z.string().min(1, "Person name is required"),
  quote: enTranslation("English quote is required"),
  company_name: z.string(),
  is_visible: z.boolean(),
  is_verified: z.boolean(),
});

export const pricingSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  name: enTranslation("English name is required"),
  price_label: enTranslation("English price label is required"),
  display_order: z.number().int().min(0),
  is_visible: z.boolean(),
  is_featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
});

export const faqSchema = z.object({
  question: enTranslation("English question is required"),
  answer: enTranslation("English answer is required"),
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
