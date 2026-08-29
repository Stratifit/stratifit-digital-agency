import type { PublicServicePage } from "./types";
import type { ServicePageFormValues } from "./schemas";

export function toServicePageFormValues(
  page: PublicServicePage
): ServicePageFormValues {
  return {
    is_visible: page.is_visible,
    hero_eyebrow_translations: page.hero_eyebrow_translations ?? {},
    hero_title_translations: page.hero_title_translations ?? {},
    hero_highlight_translations: page.hero_highlight_translations ?? {},
    hero_description_translations: page.hero_description_translations ?? {},
    hero_stats: page.hero_stats ?? [],
    why_title_translations: page.why_title_translations ?? {},
    why_description_translations: page.why_description_translations ?? {},
    why_badges: page.why_badges ?? [],
    capabilities_title_translations: page.capabilities_title_translations ?? {},
    capabilities_description_translations:
      page.capabilities_description_translations ?? {},
    capabilities: page.capabilities ?? [],
    deliverables_title_translations: page.deliverables_title_translations ?? {},
    deliverables: page.deliverables ?? [],
    process_title_translations: page.process_title_translations ?? {},
    process: page.process ?? [],
    toolkit_title_translations: page.toolkit_title_translations ?? {},
    toolkit: page.toolkit ?? [],
    cta_title_translations: page.cta_title_translations ?? {},
    cta_subtitle_translations: page.cta_subtitle_translations ?? {},
    cta_button_label_translations: page.cta_button_label_translations ?? {},
  };
}
