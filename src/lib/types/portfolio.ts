// ============================================================================
// Stratifit — Portfolio Section Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Multilingual text map for a single field */
export interface PortfolioTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single portfolio item row as stored in Supabase */
export interface CmsPortfolioItem {
  id: string;
  parentSection: string;
  imageUrl: string;
  category: string;
  titleTranslations: PortfolioTranslations;
  descriptionTranslations: PortfolioTranslations;
  linkUrl: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A portfolio section row as stored in Supabase */
export interface CmsPortfolioSection {
  id: string;
  displayOrder: number;
  subtitleTranslations: PortfolioTranslations;
  titleTranslations: PortfolioTranslations;
  descriptionTranslations: PortfolioTranslations;
  viewAllUrl: string;
  viewAllLabelTranslations: PortfolioTranslations;
  viewCaseStudyLabelTranslations: PortfolioTranslations;
  filters: string[];
  items: CmsPortfolioItem[];
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) for portfolio_section */
export interface PortfolioSectionRow {
  id: string;
  display_order: number;
  subtitle_translations: PortfolioTranslations;
  title_translations: PortfolioTranslations;
  description_translations: PortfolioTranslations;
  view_all_url: string;
  view_all_label_translations: PortfolioTranslations;
  view_case_study_label_translations: PortfolioTranslations;
  filters: string[];
  created_at: string;
  updated_at: string;
}

/** Supabase row shape (snake_case) for portfolio_items */
export interface PortfolioItemRow {
  id: string;
  parent_section: string;
  image_url: string;
  category: string;
  title_translations: PortfolioTranslations;
  description_translations: PortfolioTranslations;
  link_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case portfolio_section row to camelCase domain type */
export function mapPortfolioSection(row: PortfolioSectionRow): CmsPortfolioSection {
  return {
    id: row.id,
    displayOrder: row.display_order,
    subtitleTranslations: row.subtitle_translations,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    viewAllUrl: row.view_all_url,
    viewAllLabelTranslations: row.view_all_label_translations,
    viewCaseStudyLabelTranslations: row.view_case_study_label_translations,
    filters: Array.isArray(row.filters) ? row.filters : [],
    items: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Mapper from snake_case portfolio_items row to camelCase domain type */
export function mapPortfolioItem(row: PortfolioItemRow): CmsPortfolioItem {
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
export function getPortfolioTranslation(
  translations: PortfolioTranslations,
  locale: CmsLanguage
): string {
  return translations[locale] ?? translations.en ?? "";
}
