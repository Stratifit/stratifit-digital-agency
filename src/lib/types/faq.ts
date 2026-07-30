// ============================================================================
// Stratifit — FAQ Section Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Multilingual text map for a single field */
export interface FaqTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single FAQ item row as stored in Supabase */
export interface CmsFaqItem {
  id: string;
  parentSection: string;
  questionTranslations: FaqTranslations;
  answerTranslations: FaqTranslations;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A FAQ section row as stored in Supabase */
export interface CmsFaqSection {
  id: string;
  displayOrder: number;
  subtitleTranslations: FaqTranslations;
  titleTranslations: FaqTranslations;
  descriptionTranslations: FaqTranslations;
  items: CmsFaqItem[];
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) for faq_section */
export interface FaqSectionRow {
  id: string;
  display_order: number;
  subtitle_translations: FaqTranslations;
  title_translations: FaqTranslations;
  description_translations: FaqTranslations;
  created_at: string;
  updated_at: string;
}

/** Supabase row shape (snake_case) for faq_items */
export interface FaqItemRow {
  id: string;
  parent_section: string;
  question_translations: FaqTranslations;
  answer_translations: FaqTranslations;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case faq_section row to camelCase domain type */
export function mapFaqSection(row: FaqSectionRow): CmsFaqSection {
  return {
    id: row.id,
    displayOrder: row.display_order,
    subtitleTranslations: row.subtitle_translations,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    items: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Mapper from snake_case faq_items row to camelCase domain type */
export function mapFaqItem(row: FaqItemRow): CmsFaqItem {
  return {
    id: row.id,
    parentSection: row.parent_section,
    questionTranslations: row.question_translations,
    answerTranslations: row.answer_translations,
    displayOrder: row.display_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Get a localized string from a translations map */
export function getFaqTranslation(
  translations: FaqTranslations,
  locale: CmsLanguage
): string {
  return translations[locale] ?? translations.en ?? "";
}
