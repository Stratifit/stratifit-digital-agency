// ============================================================================
// Stratifit — Services Section Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Multilingual text map for a single field */
export interface ServiceTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single deliverable, translated into all four languages */
export type CmsServiceDeliverable = ServiceTranslations;

/** A service card row as stored in Supabase */
export interface CmsServiceCard {
  id: string;
  parentSection: string;
  icon: string;
  titleTranslations: ServiceTranslations;
  descriptionTranslations: ServiceTranslations;
  deliverables: CmsServiceDeliverable[];
  url: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A services section row as stored in Supabase */
export interface CmsServicesSection {
  id: string;
  displayOrder: number;
  subtitleTranslations: ServiceTranslations;
  titleTranslations: ServiceTranslations;
  descriptionTranslations: ServiceTranslations;
  services: CmsServiceCard[];
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) for services_section */
export interface ServicesSectionRow {
  id: string;
  display_order: number;
  subtitle_translations: ServiceTranslations;
  title_translations: ServiceTranslations;
  description_translations: ServiceTranslations;
  services: CmsServiceCard[];
  created_at: string;
  updated_at: string;
}

/** Supabase row shape (snake_case) for service_cards */
export interface ServiceCardRow {
  id: string;
  parent_section: string;
  icon: string;
  title_translations: ServiceTranslations;
  description_translations: ServiceTranslations;
  deliverables: CmsServiceDeliverable[];
  url: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case services_section row to camelCase domain type */
export function mapServicesSection(row: ServicesSectionRow): CmsServicesSection {
  return {
    id: row.id,
    displayOrder: row.display_order,
    subtitleTranslations: row.subtitle_translations,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    services: row.services ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Mapper from snake_case service_cards row to camelCase domain type */
export function mapServiceCard(row: ServiceCardRow): CmsServiceCard {
  return {
    id: row.id,
    parentSection: row.parent_section,
    icon: row.icon,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    deliverables: row.deliverables ?? [],
    url: row.url,
    displayOrder: row.display_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Get a localized string from a translations map */
export function getServiceTranslation(
  translations: ServiceTranslations,
  locale: CmsLanguage
): string {
  return translations[locale] ?? translations.en ?? "";
}
