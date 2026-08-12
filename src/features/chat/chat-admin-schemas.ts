import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/features/section-settings/schemas";

export { SUPPORTED_LOCALES };

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const KNOWLEDGE_CATEGORIES = [
  "general",
  "services",
  "pricing",
  "process",
  "support",
  "about",
] as const;

export const KNOWLEDGE_SOURCE_TYPES = [
  "manual",
  "service",
  "faq",
  "portfolio",
  "page",
  "policy",
] as const;

export const RESPONSE_STYLES = ["professional", "friendly", "concise"] as const;

export const LEAD_CAPTURE_MODES = [
  "after_resolution",
  "immediately",
  "never",
] as const;

export const FAQ_CATEGORIES = ["general", "services", "pricing", "process"] as const;

export const knowledgeEntrySchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and dashes (e.g. delivery-timeline)"
    ),
  title_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English title is required"
  ),
  content_translations: translations(),
  category: z.enum(KNOWLEDGE_CATEGORIES),
  source_type: z.enum(KNOWLEDGE_SOURCE_TYPES),
  priority: z.number().int().min(0).max(1000),
  is_enabled: z.boolean(),
  is_ai_eligible: z.boolean(),
});
export type KnowledgeEntryFormValues = z.infer<typeof knowledgeEntrySchema>;

export const chatbotSettingsSchema = z.object({
  is_enabled: z.boolean(),
  response_style: z.enum(RESPONSE_STYLES),
  lead_capture_mode: z.enum(LEAD_CAPTURE_MODES),
  human_support_enabled: z.boolean(),
  allowed_categories: z.array(z.string()),
  welcome_message_translations: translations(),
  offline_message_translations: translations(),
  escalation_message_translations: translations(),
  fallback_message_translations: translations(),
});
export type ChatbotSettingsFormValues = z.infer<typeof chatbotSettingsSchema>;

export const aiFaqSettingsSchema = z.object({
  is_enabled: z.boolean(),
  intro_translations: translations(),
  fallback_translations: translations(),
  cta_label_translations: translations(),
  cta_url: z.string(),
  suggested_questions: z.array(z.string()),
  allowed_categories: z.array(z.string()),
});
export type AiFaqSettingsFormValues = z.infer<typeof aiFaqSettingsSchema>;

export const faqBotSettingsSchema = z.object({
  faq_bot_enabled: z.boolean(),
  welcome_message_translations: translations(),
  faq_bot_fallback_translations: translations(),
  suggested_question_translations: z.array(translations()),
  faq_bot_allowed_categories: z.array(z.string()),
});
export type FaqBotSettingsFormValues = z.infer<typeof faqBotSettingsSchema>;
