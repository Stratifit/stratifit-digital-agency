// ============================================================================
// Stratifit — How We Work Section Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Multilingual text map for a single field */
export interface HowWeWorkTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single process step row as stored in Supabase */
export interface CmsHowWeWorkStep {
  id: string;
  parentSection: string;
  stepNumber: number;
  icon: string;
  titleTranslations: HowWeWorkTranslations;
  descriptionTranslations: HowWeWorkTranslations;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** A how we work section row as stored in Supabase */
export interface CmsHowWeWorkSection {
  id: string;
  displayOrder: number;
  subtitleTranslations: HowWeWorkTranslations;
  titleTranslations: HowWeWorkTranslations;
  descriptionTranslations: HowWeWorkTranslations;
  steps: CmsHowWeWorkStep[];
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) for how_we_work_section */
export interface HowWeWorkSectionRow {
  id: string;
  display_order: number;
  subtitle_translations: HowWeWorkTranslations;
  title_translations: HowWeWorkTranslations;
  description_translations: HowWeWorkTranslations;
  created_at: string;
  updated_at: string;
}

/** Supabase row shape (snake_case) for how_we_work_steps */
export interface HowWeWorkStepRow {
  id: string;
  parent_section: string;
  step_number: number;
  icon: string;
  title_translations: HowWeWorkTranslations;
  description_translations: HowWeWorkTranslations;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case how_we_work_section row to camelCase domain type */
export function mapHowWeWorkSection(row: HowWeWorkSectionRow): CmsHowWeWorkSection {
  return {
    id: row.id,
    displayOrder: row.display_order,
    subtitleTranslations: row.subtitle_translations,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    steps: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Mapper from snake_case how_we_work_steps row to camelCase domain type */
export function mapHowWeWorkStep(row: HowWeWorkStepRow): CmsHowWeWorkStep {
  return {
    id: row.id,
    parentSection: row.parent_section,
    stepNumber: row.step_number,
    icon: row.icon,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Get a localized string from a translations map */
export function getHowWeWorkTranslation(
  translations: HowWeWorkTranslations,
  locale: CmsLanguage
): string {
  return translations[locale] ?? translations.en ?? "";
}
