import { getPublicAnnouncement } from "@/features/announcement/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getLocale } from "@/lib/i18n/get-locale";
import { AnnouncementBarView } from "./announcement-bar-view";

export async function AnnouncementBar() {
  const [announcement, locale] = await Promise.all([
    getPublicAnnouncement(),
    getLocale(),
  ]);

  if (!announcement) {
    return null;
  }

  const slides = Array.isArray(announcement.slides)
    ? announcement.slides
        .map((slide) => resolveTranslation(slide, locale))
        .filter(Boolean)
    : [];

  if (slides.length === 0) {
    const fallback = resolveTranslation(announcement.message_translations, locale);
    if (fallback) slides.push(fallback);
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <AnnouncementBarView slides={slides} linkUrl={announcement.link_url ?? undefined} />
  );
}
