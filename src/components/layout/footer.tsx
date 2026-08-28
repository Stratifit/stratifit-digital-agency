import { getPublicFooterGroups } from "@/features/footer/queries";
import { mergeFooterGroups } from "@/features/footer/fallbacks";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { resolvePublicTranslation as resolveTranslation } from "@/lib/i18n/public-translation";
import { FooterContent } from "./footer-content";

export async function Footer() {
  const locale = await getLocale();
  const [groups, settings] = await Promise.all([
    getPublicFooterGroups(),
    getPublicSiteSettings(),
  ]);

  // Merge canonical links (Hiring under Company, Imprint under Legal) into
  // whatever the DB returns, so the footer always shows the full structure.
  const mergedGroups = mergeFooterGroups(groups);

  const siteName = settings?.site_name ?? "Stratifit";
  const siteDescription =
    resolveTranslation(settings?.site_description_translations, locale) ?? null;
  const socialLinks = settings?.social_links ?? null;

  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16">
        <FooterContent
          groups={mergedGroups}
          locale={locale}
          siteName={siteName}
          siteDescription={siteDescription}
          socialLinks={socialLinks}
          currentYear={new Date().getFullYear()}
          className="space-y-8"
        />
      </div>
    </footer>
  );
}
