// ============================================================================
// Stratifit — Hero Section Type Definitions
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Multilingual text map for a single field */
export interface HeroTranslations {
  en: string;
  fr: string;
  de: string;
  es: string;
}

/** A single call-to-action in the hero */
export interface HeroCTA {
  id: string;
  labelTranslations: HeroTranslations;
  href: string;
  variant: "primary" | "secondary";
}

/** A single trust badge / stat */
export interface HeroTrustBadge {
  id: string;
  value: string;
  labelTranslations: HeroTranslations;
}

/** A single tech stack item */
export interface HeroTechStackItem {
  name: string;
  iconId: string;
}

/** Tech stack block */
export interface HeroTechStack {
  titleTranslations: HeroTranslations;
  descriptionTranslations: HeroTranslations;
  items: HeroTechStackItem[];
}

/** A hero section row as stored in Supabase */
export interface CmsHeroSection {
  id: string;
  displayOrder: number;
  sticky: boolean;
  subtitleTranslations: HeroTranslations;
  titleTranslations: HeroTranslations;
  titleHighlightTranslations: HeroTranslations;
  descriptionTranslations: HeroTranslations;
  ctas: HeroCTA[];
  trustBadges: HeroTrustBadge[];
  techStack: HeroTechStack;
  url: string;
  createdAt: string;
  updatedAt: string;
}

/** Supabase row shape (snake_case) before mapping */
export interface HeroSectionRow {
  id: string;
  display_order: number;
  sticky: boolean;
  subtitle_translations: HeroTranslations;
  title_translations: HeroTranslations;
  title_highlight_translations: HeroTranslations;
  description_translations: HeroTranslations;
  ctas: HeroCTA[];
  trust_badges: HeroTrustBadge[];
  tech_stack: HeroTechStack;
  url: string;
  created_at: string;
  updated_at: string;
}/** Mapper from snake_case row to camelCase domain type */
export function mapHeroSection(row: HeroSectionRow): CmsHeroSection {
  return {
    id: row.id,
    displayOrder: row.display_order,
    sticky: row.sticky,
    subtitleTranslations: row.subtitle_translations,
    titleTranslations: row.title_translations,
    titleHighlightTranslations: row.title_highlight_translations,
    descriptionTranslations: row.description_translations,
    ctas: row.ctas,
    trustBadges: row.trust_badges,
    techStack: row.tech_stack,
    url: row.url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Get a localized string from a translations map */
export function getHeroTranslation(
  translations: HeroTranslations,
  locale: CmsLanguage
): string {
  return translations[locale] ?? translations.en ?? "";
}
