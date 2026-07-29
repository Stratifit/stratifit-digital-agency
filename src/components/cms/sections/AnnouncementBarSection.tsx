// ============================================================================
// Stratifit — Announcement Bar Section
// Server component: fetches slides and renders the interactive carousel.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import { mapAnnouncementSlide, getLocalizedMessage } from "@/lib/types/announcement";
import { AnnouncementBarCarousel } from "./AnnouncementBarCarousel";
import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";

interface AnnouncementBarSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export async function AnnouncementBarSection({
  payload,
  locale,
}: AnnouncementBarSectionProps) {
  const autoSlideInterval =
    typeof payload.autoSlideInterval === "number" && payload.autoSlideInterval > 0
      ? payload.autoSlideInterval
      : 5000;

  const supabase = createSupabaseClient();
  const { data: slides } = await supabase
    .from("announcement_slides")
    .select("*")
    .order("display_order", { ascending: true });

  const mappedSlides = (slides ?? []).map(mapAnnouncementSlide);

  if (mappedSlides.length === 0) return null;

  // Resolve localized messages
  const localizedSlides = mappedSlides.map((slide) => ({
    id: slide.id,
    message: getLocalizedMessage(slide.messageTranslations, locale),
    sticky: slide.sticky,
    url: slide.url,
  }));

  return (
    <AnnouncementBarCarousel
      slides={localizedSlides}
      autoSlideInterval={autoSlideInterval}
    />
  );
}
