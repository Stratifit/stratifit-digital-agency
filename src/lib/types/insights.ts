// ============================================================================
// Stratifit — Insights Section Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Multilingual text map for a single field */
export interface InsightsTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single insight card row as stored in Supabase */
export interface CmsInsightCard {
  id: string;
  parentSection: string;
  imageUrl: string;
  category: string;
  titleTranslations: InsightsTranslations;
  descriptionTranslations: InsightsTranslations;
  linkUrl: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** An insights section row as stored in Supabase */
export interface CmsInsightsSection {
  id: string;
  displayOrder: number;
  subtitleTranslations: InsightsTranslations;
  titleTranslations: InsightsTranslations;
  descriptionTranslations: InsightsTranslations;
  viewAllUrl: string;
  viewAllLabelTranslations: InsightsTranslations;
  readMoreLabelTranslations: InsightsTranslations;
  cards: CmsInsightCard[];
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) for insights_section */
export interface InsightsSectionRow {
  id: string;
  display_order: number;
  subtitle_translations: InsightsTranslations;
  title_translations: InsightsTranslations;
  description_translations: InsightsTranslations;
  view_all_url: string;
  view_all_label_translations: InsightsTranslations;
  read_more_label_translations: InsightsTranslations;
  created_at: string;
  updated_at: string;
}

/** Supabase row shape (snake_case) for insight_cards */
export interface InsightCardRow {
  id: string;
  parent_section: string;
  image_url: string;
  category: string;
  title_translations: InsightsTranslations;
  description_translations: InsightsTranslations;
  link_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case insights_section row to camelCase domain type */
export function mapInsightsSection(row: InsightsSectionRow): CmsInsightsSection {
  return {
    id: row.id,
    displayOrder: row.display_order,
    subtitleTranslations: row.subtitle_translations,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    viewAllUrl: row.view_all_url,
    viewAllLabelTranslations: row.view_all_label_translations,
    readMoreLabelTranslations: row.read_more_label_translations,
    cards: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Mapper from snake_case insight_cards row to camelCase domain type */
export function mapInsightCard(row: InsightCardRow): CmsInsightCard {
  return {
    id: row.id,
    parentSection: row.parent_section,
    imageUrl: row.image_url,
    category: row.category,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    linkUrl: row.link_url,
    displayOrder: row.display_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Get a localized string from a translations map */
export function getInsightsTranslation(
  translations: InsightsTranslations,
  locale: CmsLanguage
): string {
  return translations[locale] ?? translations.en ?? "";
}
