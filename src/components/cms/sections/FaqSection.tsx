// ============================================================================
// Stratifit — FAQ / Frequently Asked Questions Section Component
// CMS-driven, multilingual FAQ accordion. Fetches content from the
// faq_section and faq_items tables.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import { getFaqSection, getDefaultFaqSection } from "@/lib/cms/faq";
import { FaqSectionClient } from "./FaqSectionClient";

interface FaqSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export async function FaqSection({ payload, locale }: FaqSectionProps) {
  const faqSectionId =
    typeof payload.faqSectionId === "string" ? payload.faqSectionId : undefined;

  const section = faqSectionId
    ? await getFaqSection(faqSectionId)
    : await getDefaultFaqSection();

  if (!section) {
    return null;
  }

  return <FaqSectionClient section={section} locale={locale} />;
}
