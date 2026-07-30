// ============================================================================
// Stratifit — Acquisition / Buy a Business Section Component
// CMS-driven, multilingual acquisition slider. Fetches content from the
// acquisition_section and acquisition_cards tables.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import { getAcquisitionSection, getDefaultAcquisitionSection } from "@/lib/cms/acquisition";
import { AcquisitionSectionClient } from "./AcquisitionSectionClient";

interface AcquisitionSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export async function AcquisitionSection({ payload, locale }: AcquisitionSectionProps) {
  const acquisitionSectionId =
    typeof payload.acquisitionSectionId === "string" ? payload.acquisitionSectionId : undefined;

  const section = acquisitionSectionId
    ? await getAcquisitionSection(acquisitionSectionId)
    : await getDefaultAcquisitionSection();

  if (!section) {
    return null;
  }

  return <AcquisitionSectionClient section={section} locale={locale} />;
}
