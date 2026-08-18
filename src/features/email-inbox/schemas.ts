import { z } from "zod";

export const SUPPORTED_LOCALES = ["en", "de", "fr", "es"] as const;

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const THREAD_STATUSES = [
  "needs_reply",
  "waiting_on_customer",
  "resolved",
  "archived",
] as const;
export type ThreadStatus = (typeof THREAD_STATUSES)[number];

export const THREAD_SOURCES = [
  "inbound_email",
  "contact_form",
  "acquisition_form",
  "manual",
] as const;
export type ThreadSource = (typeof THREAD_SOURCES)[number];

/** Resend `email.received` webhook payload (metadata only). */
export const inboundWebhookSchema = z.object({
  type: z.string().optional(),
  data: z
    .object({
      email_id: z.string().optional(),
      id: z.string().optional(),
      message_id: z.string().optional(),
      from: z.string().optional(),
      to: z.array(z.string()).optional(),
      subject: z.string().optional(),
      received_for: z.array(z.string()).optional(),
      created_at: z.string().optional(),
    })
    .optional(),
});

export type InboundWebhookPayload = z.infer<typeof inboundWebhookSchema>;

/** Full received email fetched from the Received emails API. */
export const receivedEmailSchema = z.object({
  id: z.string(),
  message_id: z.string().optional().nullable(),
  from: z.string(),
  to: z.array(z.string()),
  received_for: z.array(z.string()).optional(),
  subject: z.string().optional().default(""),
  text: z.string().optional().nullable(),
  html: z.string().optional().nullable(),
  created_at: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional().nullable(),
  attachments: z
    .array(
      z.object({
        filename: z.string().optional(),
        content_type: z.string().optional(),
        size: z.number().optional(),
        content_id: z.string().optional().nullable(),
      })
    )
    .optional()
    .default([]),
});

export type ReceivedEmail = z.infer<typeof receivedEmailSchema>;

/** Admin reply editor input. */
export const emailReplySchema = z.object({
  thread_id: z.string().uuid(),
  body: z
    .string()
    .trim()
    .min(1, "Reply cannot be empty.")
    .max(10_000, "Reply is too long."),
});

export type EmailReplyInput = z.infer<typeof emailReplySchema>;

/** Admin section CRUD input (multilingual, matching CMS conventions). */
export const emailSectionSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens."),
  name_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English name is required"
  ),
  enabled: z.boolean(),
  routing_addresses: z.array(z.string().trim().min(1)),
  /** Optional routing language; null/empty means the section matches any language. */
  language: z
    .enum(SUPPORTED_LOCALES)
    .or(z.literal(""))
    .optional()
    .nullable()
    .transform((v) => (v === "" || v == null ? null : v)),
  form_source_key: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((v) => (v && v.length > 0 ? v : null)),
  from_address: z.string().trim().optional().nullable(),
  auto_reply_enabled: z.boolean(),
  auto_reply_subject_translations: translations(),
  auto_reply_body_translations: translations(),
  /** Template-library auto-reply (takes precedence over the inline fields). */
  auto_reply_template_id: z.string().uuid().optional().nullable(),
  /** Optional automatic follow-up when a conversation is resolved. */
  resolved_template_id: z.string().uuid().optional().nullable(),
  resolved_email_enabled: z.boolean(),
  display_order: z.number().int().min(0),
});

export type EmailSectionInput = z.infer<typeof emailSectionSchema>;
