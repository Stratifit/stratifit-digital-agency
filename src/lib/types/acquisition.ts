// ============================================================================
// Stratifit — Acquisition / Buy a Business Section Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Multilingual text map for a single field */
export interface AcquisitionTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single acquisition / business card */
export interface CmsAcquisitionCard {
  id: string;
  parentSection: string;
  url: string;
  category: string;
  categoryColor: string;
  categoryBorderRadius: string;
  navEmoji: string;
  navTitle: string;
  bgImageUrl: string;
  overlayColor: string;
  iconRadius: string;
  iconBorder: string;
  iconShadow: string;
  mainEmoji: string;
  titleTranslations: AcquisitionTranslations;
  descriptionTranslations: AcquisitionTranslations;
  tags: string[];
  gridEmojis: string[];
  buttonTextTranslations: AcquisitionTranslations;
  trustBadges: string[];
  price: string;
  linkUrl: string;
  visitLinkUrl: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** An acquisition section */
export interface CmsAcquisitionSection {
  id: string;
  displayOrder: number;
  subtitleTranslations: AcquisitionTranslations;
  titleTranslations: AcquisitionTranslations;
  descriptionTranslations: AcquisitionTranslations;
  viewAllUrl: string;
  viewAllLabelTranslations: AcquisitionTranslations;
  viewDetailLabelTranslations: AcquisitionTranslations;
  visitSiteLabelTranslations: AcquisitionTranslations;
  buyBusinessLabelTranslations: AcquisitionTranslations;
  filters: string[];
  items: CmsAcquisitionCard[];
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) for acquisition_section */
export interface AcquisitionSectionRow {
  id: string;
  display_order: number;
  subtitle_translations: AcquisitionTranslations;
  title_translations: AcquisitionTranslations;
  description_translations: AcquisitionTranslations;
  view_all_url: string;
  view_all_label_translations: AcquisitionTranslations;
  view_detail_label_translations: AcquisitionTranslations;
  visit_site_label_translations: AcquisitionTranslations;
  buy_business_label_translations: AcquisitionTranslations;
  filters: string[];
  created_at: string;
  updated_at: string;
}

/** Supabase row shape (snake_case) for acquisition_cards */
export interface AcquisitionCardRow {
  id: string;
  parent_section: string;
  url: string;
  category: string;
  category_color: string;
  category_border_radius: string;
  nav_emoji: string;
  nav_title: string;
  bg_image_url: string;
  overlay_color: string;
  icon_radius: string;
  icon_border: string;
  icon_shadow: string;
  main_emoji: string;
  title_translations: AcquisitionTranslations;
  description_translations: AcquisitionTranslations;
  tags: string[];
  grid_emojis: string[];
  button_text_translations: AcquisitionTranslations;
  trust_badges: string[];
  price: string;
  link_url: string;
  visit_link_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case acquisition_section row to camelCase domain type */
export function mapAcquisitionSection(row: AcquisitionSectionRow): CmsAcquisitionSection {
  return {
    id: row.id,
    displayOrder: row.display_order,
    subtitleTranslations: row.subtitle_translations,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    viewAllUrl: row.view_all_url,
    viewAllLabelTranslations: row.view_all_label_translations,
    viewDetailLabelTranslations: row.view_detail_label_translations,
    visitSiteLabelTranslations: row.visit_site_label_translations,
    buyBusinessLabelTranslations: row.buy_business_label_translations,
    filters: Array.isArray(row.filters) ? row.filters : [],
    items: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Mapper from snake_case acquisition_cards row to camelCase domain type */
export function mapAcquisitionCard(row: AcquisitionCardRow): CmsAcquisitionCard {
  return {
    id: row.id,
    parentSection: row.parent_section,
    url: row.url,
    category: row.category,
    categoryColor: row.category_color,
    categoryBorderRadius: row.category_border_radius,
    navEmoji: row.nav_emoji,
    navTitle: row.nav_title,
    bgImageUrl: row.bg_image_url,
    overlayColor: row.overlay_color,
    iconRadius: row.icon_radius,
    iconBorder: row.icon_border,
    iconShadow: row.icon_shadow,
    mainEmoji: row.main_emoji,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    tags: Array.isArray(row.tags) ? row.tags : [],
    gridEmojis: Array.isArray(row.grid_emojis) ? row.grid_emojis : [],
    buttonTextTranslations: row.button_text_translations,
    trustBadges: Array.isArray(row.trust_badges) ? row.trust_badges : [],
    price: row.price,
    linkUrl: row.link_url,
    visitLinkUrl: row.visit_link_url,
    displayOrder: row.display_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Get a localized string from a translations map */
export function getAcquisitionTranslation(
  translations: AcquisitionTranslations,
  locale: CmsLanguage
): string {
  return translations[locale] ?? translations.en ?? "";
}
