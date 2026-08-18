import { z } from "zod";
import {
  SUPPORTED_LANGUAGES,
  TEMPLATE_CATEGORIES,
  TEMPLATE_TRIGGERS,
  TEMPLATE_TYPES,
} from "./types";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const languageSchema = z.enum(SUPPORTED_LANGUAGES);

/** Admin CRUD for a multilingual email template. */
export const emailTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  key: z
    .string()
    .trim()
    .min(1, "Key is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens."),
  template_type: z.enum(TEMPLATE_TYPES),
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

/** Manual send from the composer. */
export const sendManualEmailSchema = z.object({
  template_key: z.string().trim().min(1),
  language: languageSchema,
  to_email: z.string().email("Enter a valid email address."),
  to_name: z.string().trim().max(120).optional().default(""),
  from_address: z.string().trim().min(1, "Choose a reply-as address."),
  subject_override: z.string().trim().max(200).optional().default(""),
  body_override: z.string().trim().max(50_000).optional().default(""),
  variables: z.record(z.string(), z.string()).optional().default({}),
});
export type SendManualEmailInput = z.infer<typeof sendManualEmailSchema>;

/** Schedule a template send for later. */
export const emailScheduleSchema = z.object({
  template_key: z.string().trim().min(1),
  language: languageSchema,
  recipient_email: z.string().email("Enter a valid email address."),
  recipient_name: z.string().trim().max(120).optional().default(""),
  send_at: z.string().datetime({ offset: true }),
  variables: z.record(z.string(), z.string()).optional().default({}),
});
export type EmailScheduleInput = z.infer<typeof emailScheduleSchema>;

/** Toggle an automation trigger. */
export const automationTriggerToggleSchema = z.object({
  id: z.string().uuid(),
  enabled: z.boolean(),
});
