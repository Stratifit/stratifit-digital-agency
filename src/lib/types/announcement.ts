// ============================================================================
// Stratifit — Announcement Slide Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Per-language message translations — all 4 languages required */
export interface CmsAnnouncementTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single announcement slide */
export interface CmsAnnouncementSlide {
  id: string;
  displayOrder: number;
  sticky: boolean;
  url: string;
  messageTranslations: CmsAnnouncementTranslations;
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) before mapping */
export interface AnnouncementSlideRow {
  id: string;
  display_order: number;
  sticky: boolean;
  url: string;
  message_translations: CmsAnnouncementTranslations;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case row to camelCase domain type */
export function mapAnnouncementSlide(
  row: AnnouncementSlideRow
): CmsAnnouncementSlide {
  return {
    id: row.id,
    displayOrder: row.display_order,
    sticky: row.sticky,
    url: row.url,
    messageTranslations: row.message_translations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Get the message for a specific language, falling back to English */
export function getLocalizedMessage(
  translations: CmsAnnouncementTranslations,
  language: CmsLanguage
): string {
  switch (language) {
    case "en": return translations.en;
    case "fr": return translations.fr;
    case "de": return translations.de;
    case "es": return translations.es;
    default:   return translations.en;
  }
}
