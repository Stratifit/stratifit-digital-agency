import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicAcquisitionSection } from "@/features/acquisition/queries";
import { getPublicAcquisitionNiches } from "@/features/acquisition/niche-queries";
import { FALLBACK_ACQUISITION_NICHES } from "@/features/acquisition/niche-fallbacks";
import { nicheLabel } from "@/features/acquisition/niches";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import {
  getPublicSectionSetting,
  getPublicSectionSettingIncludingHidden,
} from "@/features/section-settings/queries";
import { t } from "@/lib/i18n/ui-strings";
import { pageMetadata, resolveSeoMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/reveal";
import { CtaCard } from "@/components/sections/cta-card";
import { BuyBusinessNiches } from "@/components/acquisition/buy-business-niches";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const setting = await getPublicSectionSettingIncludingHidden("acquisition");
  const { title, description } = resolveSeoMetadata({
    seoTitleTranslations: setting?.seo_title_translations,
    seoDescriptionTranslations: setting?.seo_description_translations,
    locale,
    fallbackTitle: "Buy a Business — Stratifit",
    fallbackDescription:
      "Skip the startup grind. Browse our curated marketplace of profitable, turnkey businesses across seven high-demand niches.",
  });
  return pageMetadata({ title, description, path: "/buy-business" });
}

export default async function BuyBusinessPage() {
  const locale = await getLocale();
  const [section, settings, ctaSettings, niches] =
    await Promise.all([
      getPublicAcquisitionSection(),
      getPublicSectionSetting("acquisition"),
      getPublicSectionSettingIncludingHidden("acquisition-cta"),
      getPublicAcquisitionNiches(),
    ]);

  // The closing CTA is hidden when an admin pauses it (row exists,
  // is_visible = false). A missing row falls back to the default copy.
  const ctaVisible = ctaSettings === null || ctaSettings.is_visible;

  const businesses = section?.businesses ?? [];

  // Niche catalog comes from the DB (editable in the CMS). When the table has
  // no rows (e.g. before migration 00043 is applied) fall back to the canonical
  // 4-language catalog so the grid never renders empty.
  const effectiveNiches =
    niches.length > 0 ? niches : FALLBACK_ACQUISITION_NICHES;
  const nicheCards = effectiveNiches.map((niche) => ({
    slug: niche.slug,
    label: nicheLabel(niche, locale),
    emoji: niche.emoji,
    accent: niche.accent,
    description: resolveTranslation(niche.description_translations, locale),
  }));
  const settingsTitle = resolveTranslation(
    settings?.title_translations ?? null,
    locale
  );
  const settingsHighlight = resolveTranslation(
    settings?.highlight_translations ?? null,
    locale
  );
  const sectionTitle = resolveTranslation(
    section?.title_translations ?? null,
    locale
  );
  const hasSplit = Boolean(settingsTitle && settingsHighlight);
  const title = hasSplit
    ? settingsTitle
    : (sectionTitle ||
      settingsTitle ||
      t(locale, "buyABusiness"));
  const highlight = hasSplit ? settingsHighlight : null;
  const description =
    resolveTranslation(settings?.description_translations ?? null, locale) ||
    resolveTranslation(section?.description_translations ?? null, locale) ||
    t(locale, "buyBusinessFallback");

  // Closing CTA — editable via section_settings "acquisition-cta".
  const ctaTitle =
    resolveTranslation(ctaSettings?.title_translations ?? null, locale) ||
    t(locale, "readyToOwnBusiness");
  const ctaDescription =
    resolveTranslation(ctaSettings?.description_translations ?? null, locale) ||
    t(locale, "acquisitionGuideDescription");
  const ctaLabel =
    resolveTranslation(ctaSettings?.cta_label_translations ?? null, locale) ||
    t(locale, "scheduleConsultation");
  const ctaHref = ctaSettings?.cta_url || "/contact";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background pt-16 pb-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal immediate variant="revealUp">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {resolveTranslation(settings?.eyebrow_translations ?? null, locale) ||
                t(locale, "acquisition")}
            </p>
            <h1 className="mb-4 font-display text-4xl font-black leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-none lg:text-7xl">
              {title}
              {highlight ? (
                <span className="text-primary"> {highlight}</span>
              ) : null}
            </h1>
            <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-base leading-relaxed text-text-muted sm:pl-6 sm:text-lg md:text-xl">
              {description}
            </p>
          </Reveal>
        </div>
      </section>

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* Niche catalog */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <BuyBusinessNiches
            niches={nicheCards}
            businesses={businesses}
            locale={locale}
          />

          {/* Final CTA */}
          {ctaVisible ? (
            <Reveal className="mt-16">
              <CtaCard
                title={ctaTitle}
                description={ctaDescription}
                label={ctaLabel}
                href={ctaHref}
                locale={locale}
              />
            </Reveal>
          ) : null}
        </div>
      </section>
    </>
  );
}
