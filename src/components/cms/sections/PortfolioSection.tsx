// ============================================================================
// Stratifit — Portfolio / Our Work Section Component
// CMS-driven, multilingual portfolio slider. Fetches content from the
// portfolio_section and portfolio_items tables.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import { getPortfolioSection, getDefaultPortfolioSection } from "@/lib/cms/portfolio";
import { PortfolioSectionClient } from "./PortfolioSectionClient";

interface PortfolioSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export async function PortfolioSection({ payload, locale }: PortfolioSectionProps) {
  const portfolioSectionId =
    typeof payload.portfolioSectionId === "string" ? payload.portfolioSectionId : undefined;

  const section = portfolioSectionId
    ? await getPortfolioSection(portfolioSectionId)
    : await getDefaultPortfolioSection();

  if (!section) {
    return null;
  }

  return <PortfolioSectionClient section={section} locale={locale} />;
}
