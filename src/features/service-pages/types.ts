export type TranslationMap = Record<string, string>;

export interface ServicePageStat {
  value: string;
  label_translations: TranslationMap;
}

export interface ServicePageBadge {
  value: string;
  label_translations: TranslationMap;
  hint_translations?: TranslationMap | null;
}

export interface ServicePageStep {
  label_translations: TranslationMap;
  icon?: string | null;
}

export interface ServicePageCapability {
  title_translations: TranslationMap;
  description_translations: TranslationMap;
  steps?: ServicePageStep[] | null;
}

export interface ServicePageDeliverable {
  title_translations: TranslationMap;
  description_translations: TranslationMap;
  icon?: string | null;
}

export interface ServicePageProcessStep {
  number: number;
  title_translations: TranslationMap;
  description_translations: TranslationMap;
  icon?: string | null;
}

export interface PublicServicePage {
  id: string;
  slug: string;
  is_visible: boolean;
  hero_eyebrow_translations: TranslationMap | null;
  hero_title_translations: TranslationMap | null;
  hero_highlight_translations: TranslationMap | null;
  hero_description_translations: TranslationMap | null;
  hero_stats: ServicePageStat[] | null;
  why_title_translations: TranslationMap | null;
  why_description_translations: TranslationMap | null;
  why_badges: ServicePageBadge[] | null;
  capabilities_title_translations: TranslationMap | null;
  capabilities: ServicePageCapability[] | null;
  deliverables_title_translations: TranslationMap | null;
  deliverables: ServicePageDeliverable[] | null;
  process_title_translations: TranslationMap | null;
  process: ServicePageProcessStep[] | null;
  toolkit_title_translations: TranslationMap | null;
  toolkit: string[] | null;
  cta_title_translations: TranslationMap | null;
  cta_subtitle_translations: TranslationMap | null;
  cta_button_label_translations: TranslationMap | null;
  updated_at: string;
}
