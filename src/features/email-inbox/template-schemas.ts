import { z } from "zod";

export const TEMPLATE_CATEGORIES = [
  "auto_reply",
  "lifecycle",
  "follow_up",
  "billing",
  "custom",
] as const;
export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export const TEMPLATE_TRIGGERS = [
  "manual",
  "on_lead",
  "on_inbound_email",
  "on_thread_resolved",
] as const;
export type TemplateTrigger = (typeof TEMPLATE_TRIGGERS)[number];

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const emailTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  key: z
    .string()
    .trim()
    .min(1, "Key is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens."),
  category: z.enum(TEMPLATE_CATEGORIES),
  name_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English name is required"
  ),
  subject_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English subject is required"
  ),
  body_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English body is required"
  ),
  description: z.string().optional().nullable(),
  trigger_event: z
    .enum(TEMPLATE_TRIGGERS)
    .optional()
    .nullable()
    .transform((v) => (v && v !== "manual" ? v : null)),
  is_enabled: z.boolean(),
  display_order: z.number().int().min(0),
});

export type EmailTemplateInput = z.infer<typeof emailTemplateSchema>;
