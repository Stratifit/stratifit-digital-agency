// ============================================================================
// Stratifit — Global Announcement Bar
// Synchronous server component: renders the carousel which fetches
// slides client-side from the API (consistent with how the admin works).
// ============================================================================

import { AnnouncementBarCarousel } from "@/components/cms/sections/AnnouncementBarCarousel";
import type { CmsLanguage } from "@/lib/types/cms";

interface AnnouncementBarProps {
  locale?: CmsLanguage;
}

export function AnnouncementBar({ locale = "en" }: AnnouncementBarProps) {
  return (
    <AnnouncementBarCarousel
      autoSlideInterval={5000}
      locale={locale}
    />
  );
}
