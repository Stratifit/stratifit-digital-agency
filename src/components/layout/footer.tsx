import { getPublicFooterGroups } from "@/features/footer/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";

export async function Footer() {
  const locale = await getLocale();
  const [groups, settings] = await Promise.all([
    getPublicFooterGroups(),
    getPublicSiteSettings(),
  ]);

  const description = resolveTranslation(
    settings?.site_description_translations,
    locale
  );

  return (
    <footer className="border-t border-border bg-background-deep">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-display text-lg font-bold tracking-tight text-text-primary">
              {settings?.site_name ?? "Stratifit"}
            </p>
            {description ? (
              <p className="mt-3 text-sm text-text-secondary">{description}</p>
            ) : null}
          </div>

          {groups.map((group) => (
            <div key={group.id}>
              <p className="text-sm font-semibold text-text-primary">
                {resolveTranslation(group.title_translations, locale)}
              </p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target={link.is_external ? "_blank" : undefined}
                      rel={link.is_external ? "noopener noreferrer" : undefined}
                      className="text-sm text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {resolveTranslation(link.label_translations, locale)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {settings?.contact_email ? (
          <div className="mt-10 border-t border-border pt-6 text-sm text-text-muted">
            <a
              href={`mailto:${settings.contact_email}`}
              className="hover:text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {settings.contact_email}
            </a>
          </div>
        ) : null}
      </Container>
    </footer>
  );
}



