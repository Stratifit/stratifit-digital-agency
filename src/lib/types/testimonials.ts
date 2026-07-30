// ============================================================================
// Stratifit — Testimonials Section Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Multilingual text map for a single field */
export interface TestimonialsTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single testimonial card row as stored in Supabase */
export interface CmsTestimonialCard {
  id: string;
  parentSection: string;
  initials: string;
  nameTranslations: TestimonialsTranslations;
  roleTranslations: TestimonialsTranslations;
  quoteTranslations: TestimonialsTranslations;
  rating: number;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A testimonials section row as stored in Supabase */
export interface CmsTestimonialsSection {
  id: string;
  displayOrder: number;
  subtitleTranslations: TestimonialsTranslations;
  titleTranslations: TestimonialsTranslations;
  descriptionTranslations: TestimonialsTranslations;
  viewAllUrl: string;
  viewAllLabelTranslations: TestimonialsTranslations;
  cards: CmsTestimonialCard[];
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) for testimonials_section */
export interface TestimonialsSectionRow {
  id: string;
  display_order: number;
  subtitle_translations: TestimonialsTranslations;
  title_translations: TestimonialsTranslations;
  description_translations: TestimonialsTranslations;
  view_all_url: string;
  view_all_label_translations: TestimonialsTranslations;
  created_at: string;
  updated_at: string;
}

/** Supabase row shape (snake_case) for testimonial_cards */
export interface TestimonialCardRow {
  id: string;
  parent_section: string;
  initials: string;
  name_translations: TestimonialsTranslations;
  role_translations: TestimonialsTranslations;
  quote_translations: TestimonialsTranslations;
  rating: number;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Mapper from snake_case testimonials_section row to camelCase domain type */
export function mapTestimonialsSection(row: TestimonialsSectionRow): CmsTestimonialsSection {
  return {
    id: row.id,
    displayOrder: row.display_order,
    subtitleTranslations: row.subtitle_translations,
    titleTranslations: row.title_translations,
    descriptionTranslations: row.description_translations,
    viewAllUrl: row.view_all_url,
    viewAllLabelTranslations: row.view_all_label_translations,
    cards: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Mapper from snake_case testimonial_cards row to camelCase domain type */
export function mapTestimonialCard(row: TestimonialCardRow): CmsTestimonialCard {
  return {
    id: row.id,
    parentSection: row.parent_section,
    initials: row.initials,
    nameTranslations: row.name_translations,
    roleTranslations: row.role_translations,
    quoteTranslations: row.quote_translations,
    rating: row.rating,
    displayOrder: row.display_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Get a localized string from a translations map */
export function getTestimonialsTranslation(
  translations: TestimonialsTranslations,
  locale: CmsLanguage
): string {
  return translations[locale] ?? translations.en ?? "";
}
