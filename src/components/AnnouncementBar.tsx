// ============================================================================
// Stratifit — Global Announcement Bar
// Server component: fetches slides from Supabase and renders the carousel.
// Appears at the top of every public page.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import { AnnouncementBarCarousel } from "@/components/cms/sections/AnnouncementBarCarousel";
import { mapAnnouncementSlide } from "@/lib/types/announcement";
import type { CmsLanguage } from "@/lib/types/cms";
import type { AnnouncementSlideRow } from "@/lib/types/announcement";

interface AnnouncementBarProps {
  locale?: CmsLanguage;
}

export async function AnnouncementBar({ locale = "en" }: AnnouncementBarProps) {
  try {
    const supabase = createSupabaseClient();

    const { data: rows, error } = await supabase
      .from("announcement_slides")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[AnnouncementBar] Failed to fetch slides:", error.message);
      return null;
    }

    if (!rows || rows.length === 0) {
      return null;
    }

    const slides = (rows as unknown as AnnouncementSlideRow[]).map(
      mapAnnouncementSlide
    );

    return (
      <AnnouncementBarCarousel
        autoSlideInterval={5000}
        locale={locale}
        initialSlides={slides}
      />
    );
  } catch (err) {
    console.error("[AnnouncementBar] Unexpected error:", err);
    return null;
  }
}
