// ============================================================================
// Stratifit — Why Us Section Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Multilingual text map for a single field */
export interface WhyUsTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single Why Us feature card row as stored in Supabase */
export interface CmsWhyUsFeature {
  id: string;
  parentSection: string;
  icon: string;
  titleTranslations: WhyUsTranslations;
  descriptionTranslations: WhyUsTranslations;
  stat: string;
  statLabelTranslations: WhyUsTranslations;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A Why Us section row as stored in Supabase */
export interface CmsWhyUsSection {
  id: string;
  displayOrder: number;
  subtitleTranslations: WhyUsTranslations;
  titleTranslations: WhyUsTranslations;
  descriptionTranslations: WhyUsTranslations;
  features: CmsWhyUsFeature[];
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) for why_us_section */
export interface WhyUsSectionRow {
  id: string;
  display_order: number;
  subtitle_translations: WhyUsTranslations;
  title_translations: WhyUsTranslations;
  description_translations: WhyUsTranslations;
  created_at: string;
  updated_at: string;
}

/** Supabase row shape (snake_case) for why_us_features */
export interface WhyUsFeatureRow {
  id: string;
  parent_section: string;
  icon: string;
  title_translations: WhyUsTranslations;
  description_translations: WhyUsTranslations;
  stat: string;
  stat_label_translations: WhyUsTranslations;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case why_us_section row to camelCase domain type */
export function mapWhyUsSection(row: WhyUsSectionRow): CmsWhyUsSection {
  return {
    id: row.id,
    displayOrder: row.display_order,
    subtitleTranslations: row.subtitle_translations,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    features: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Mapper from snake_case why_us_features row to camelCase domain type */
export function mapWhyUsFeature(row: WhyUsFeatureRow): CmsWhyUsFeature {
  return {
    id: row.id,
    parentSection: row.parent_section,
    icon: row.icon,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    stat: row.stat,
    statLabelTranslations: row.stat_label_translations,
    displayOrder: row.display_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Get a localized string from a translations map */
export function getWhyUsTranslation(
  translations: WhyUsTranslations,
  locale: CmsLanguage
): string {
  return translations[locale] ?? translations.en ?? "";
}
