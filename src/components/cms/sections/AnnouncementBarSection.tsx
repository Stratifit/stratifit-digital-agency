// ============================================================================
// Stratifit — Announcement Bar Section
// Synchronous server component: renders the client carousel.
// The carousel fetches slides client-side via the API.
// ============================================================================

import { AnnouncementBarCarousel } from "./AnnouncementBarCarousel";
import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";

interface AnnouncementBarSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export function AnnouncementBarSection({
  payload,
  locale,
}: AnnouncementBarSectionProps) {
  const autoSlideInterval =
    typeof payload.autoSlideInterval === "number" && payload.autoSlideInterval > 0
      ? payload.autoSlideInterval
      : 5000;

  return (
    <AnnouncementBarCarousel
      autoSlideInterval={autoSlideInterval}
      locale={locale}
    />
  );
}
