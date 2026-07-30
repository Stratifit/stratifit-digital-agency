// ============================================================================
// Stratifit — Pricing / Service Packages Section Component
// CMS-driven, multilingual pricing section. Fetches content from the
// pricing_section and pricing_packages tables.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import { getPricingSection, getDefaultPricingSection } from "@/lib/cms/pricing";
import { PricingSectionClient } from "./PricingSectionClient";

interface PricingSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export async function PricingSection({ payload, locale }: PricingSectionProps) {
  const pricingSectionId =
    typeof payload.pricingSectionId === "string" ? payload.pricingSectionId : undefined;

  const section = pricingSectionId
    ? await getPricingSection(pricingSectionId)
    : await getDefaultPricingSection();

  if (!section) {
    return null;
  }

  return <PricingSectionClient section={section} locale={locale} />;
}
