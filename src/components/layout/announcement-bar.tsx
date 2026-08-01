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

  const message = resolveTranslation(announcement.message_translations, locale);
  const linkLabel = resolveTranslation(announcement.link_label_translations, locale);

  if (!message) {
    return null;
  }

  return (
    <AnnouncementBarView
      message={message}
      linkUrl={announcement.link_url ?? undefined}
      linkLabel={linkLabel || undefined}
    />
  );
}
