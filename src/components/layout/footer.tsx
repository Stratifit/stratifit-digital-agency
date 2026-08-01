import { getPublicFooterGroups } from "@/features/footer/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { FooterContent } from "./footer-content";

export async function Footer() {
  const locale = await getLocale();
  const [groups, settings] = await Promise.all([
    getPublicFooterGroups(),
    getPublicSiteSettings(),
  ]);

  const siteName = settings?.site_name ?? "Stratifit";
  const siteDescription =
    resolveTranslation(settings?.site_description_translations, locale) ?? null;
  const socialLinks = settings?.social_links ?? null;

  return (
    <footer className="border-t border-border bg-black">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16">
        <FooterContent
          groups={groups}
          locale={locale}
          siteName={siteName}
          siteDescription={siteDescription}
          socialLinks={socialLinks}
          currentYear={new Date().getFullYear()}
          className="space-y-10"
        />
      </div>
    </footer>
  );
}
