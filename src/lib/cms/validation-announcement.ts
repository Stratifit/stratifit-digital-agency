// ============================================================================
// Stratifit — Announcement Slide Zod Validation
// ============================================================================

import { z } from "zod";

/** Validates a message_translations object requires all 4 languages */
export const messageTranslationsSchema = z.object({
  en: z.string().min(1, "English message is required"),
  fr: z.string().min(1, "French message is required"),
  de: z.string().min(1, "German message is required"),
  es: z.string().min(1, "Spanish message is required"),
});

export type MessageTranslationsInput = z.infer<
  typeof messageTranslationsSchema
>;

/** Validates a complete announcement slide payload */
export const announcementSlideSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  sticky: z.boolean().default(false),
  url: z.string().default(""),
  messageTranslations: messageTranslationsSchema,
});

export type AnnouncementSlideInput = z.infer<typeof announcementSlideSchema>;

/** Validates the section payload for announcement_bar sections */
export const announcementBarSectionPayloadSchema = z.object({
  autoSlideInterval: z
    .number()
    .int()
    .positive()
    .default(5000),
});

export type AnnouncementBarSectionPayload = z.infer<
  typeof announcementBarSectionPayloadSchema
>;
