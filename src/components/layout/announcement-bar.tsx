import { getPublicAnnouncement } from "@/features/announcement/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";

export async function AnnouncementBar({ locale = "en" }: { locale?: string }) {
  const announcement = await getPublicAnnouncement();

  if (!announcement) {
    return null;
  }

  const message = resolveTranslation(announcement.message_translations, locale);
  const linkLabel = resolveTranslation(
    announcement.link_label_translations,
    locale
  );

  if (!message) {
    return null;
  }

  return (
    <div className="border-b border-border bg-surface">
      <Container className="flex items-center justify-center gap-2 py-2 text-sm">
        <span className="text-text-secondary">{message}</span>
        {announcement.link_url && linkLabel ? (
          <a
            href={announcement.link_url}
            className="font-medium text-primary hover:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {linkLabel}
          </a>
        ) : null}
      </Container>
    </div>
  );
}
