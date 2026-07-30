// ============================================================================
// Stratifit — Pricing Section Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Multilingual text map for a single field */
export interface PricingTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single pricing package feature (multilingual) */
export interface PricingFeature {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single pricing package row as stored in Supabase */
export interface CmsPricingPackage {
  id: string;
  parentSection: string;
  nameTranslations: PricingTranslations;
  descriptionTranslations: PricingTranslations;
  price: string;
  priceLabelTranslations: PricingTranslations;
  isPopular: boolean;
  buttonLabelTranslations: PricingTranslations;
  buttonAction: string;
  features: PricingFeature[];
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A pricing section row as stored in Supabase */
export interface CmsPricingSection {
  id: string;
  displayOrder: number;
  subtitleTranslations: PricingTranslations;
  titleTranslations: PricingTranslations;
  descriptionTranslations: PricingTranslations;
  packages: CmsPricingPackage[];
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) for pricing_section */
export interface PricingSectionRow {
  id: string;
  display_order: number;
  subtitle_translations: PricingTranslations;
  title_translations: PricingTranslations;
  description_translations: PricingTranslations;
  created_at: string;
  updated_at: string;
}

/** Supabase row shape (snake_case) for pricing_packages */
export interface PricingPackageRow {
  id: string;
  parent_section: string;
  name_translations: PricingTranslations;
  description_translations: PricingTranslations;
  price: string;
  price_label_translations: PricingTranslations;
  is_popular: boolean;
  button_label_translations: PricingTranslations;
  button_action: string;
  features: PricingFeature[];
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case pricing_section row to camelCase domain type */
export function mapPricingSection(row: PricingSectionRow): CmsPricingSection {
  return {
    id: row.id,
    displayOrder: row.display_order,
    subtitleTranslations: row.subtitle_translations,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    packages: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Mapper from snake_case pricing_packages row to camelCase domain type */
export function mapPricingPackage(row: PricingPackageRow): CmsPricingPackage {
  return {
    id: row.id,
    parentSection: row.parent_section,
    nameTranslations: row.name_translations,
    descriptionTranslations: row.description_translations,
    price: row.price,
    priceLabelTranslations: row.price_label_translations,
    isPopular: row.is_popular,
    buttonLabelTranslations: row.button_label_translations,
    buttonAction: row.button_action,
    features: Array.isArray(row.features) ? row.features : [],
    displayOrder: row.display_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Get a localized string from a translations map */
export function getPricingTranslation(
  translations: PricingTranslations,
  locale: CmsLanguage
): string {
  return translations[locale] ?? translations.en ?? "";
}
