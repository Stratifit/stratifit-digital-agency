import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicAcquisitionSection } from "@/features/acquisition/queries";
import { getPublicAcquisitionNiches } from "@/features/acquisition/niche-queries";
import { nicheLabel } from "@/features/acquisition/niches";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import {
  getPublicSectionSetting,
  getPublicSectionSettingIncludingHidden,
} from "@/features/section-settings/queries";
import { t } from "@/lib/i18n/ui-strings";
import { pageMetadata } from "@/lib/seo";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { Reveal } from "@/components/ui/reveal";
import { BuyBusinessNiches } from "@/components/acquisition/buy-business-niches";

export const metadata = pageMetadata({
  title: "Buy a Business — Stratifit",
  description:
    "Skip the startup grind. Browse our curated marketplace of profitable, turnkey businesses across seven high-demand niches.",
  path: "/buy-business",
});

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default async function BuyBusinessPage() {
  const locale = await getLocale();
  const [section, settings, nichesSettings, ctaSettings, niches] =
    await Promise.all([
      getPublicAcquisitionSection(),
      getPublicSectionSetting("acquisition"),
      getPublicSectionSettingIncludingHidden("acquisition-niches"),
      getPublicSectionSettingIncludingHidden("acquisition-cta"),
      getPublicAcquisitionNiches(),
    ]);

  // The new sections are hidden when an admin pauses them (row exists,
  // is_visible = false). A missing row falls back to the default copy.
  const nichesVisible = nichesSettings === null || nichesSettings.is_visible;
  const ctaVisible = ctaSettings === null || ctaSettings.is_visible;

  const businesses = section?.businesses ?? [];

  // Niche catalog comes from the DB (editable in the CMS) — resolve labels
  // and descriptions for the current locale before passing to the client.
  const nicheCards = niches.map((niche) => ({
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
    : (sectionTitle ?? t(locale, "buyABusiness"));
  const highlight = hasSplit ? settingsHighlight : null;
  const description =
    resolveTranslation(settings?.description_translations ?? null, locale) ||
    resolveTranslation(section?.description_translations ?? null, locale) ||
    t(locale, "buyBusinessFallback");

  // Explore by Niche heading — editable via section_settings "acquisition-niches".
  const nichesTitle =
    resolveTranslation(nichesSettings?.title_translations ?? null, locale) ||
    t(locale, "exploreBy");
  const nichesHighlight =
    resolveTranslation(nichesSettings?.highlight_translations ?? null, locale) ||
    t(locale, "niche");
  const nichesDescription =
    resolveTranslation(nichesSettings?.description_translations ?? null, locale) ||
    t(locale, "exploreByNicheDescription");

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
      <section className="relative overflow-hidden py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal immediate variant="revealUp">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {resolveTranslation(settings?.eyebrow_translations ?? null, locale) ??
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

      {/* Explore by Niche */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {nichesVisible ? (
            <Reveal className="mb-6">
              <h2 className="mb-2 font-display text-xl font-bold text-text-primary sm:text-2xl">
                {nichesTitle}
                {nichesHighlight ? (
                  <span className="text-primary"> {nichesHighlight}</span>
                ) : null}
              </h2>
              <p className="text-sm text-text-muted">{nichesDescription}</p>
            </Reveal>
          ) : null}

          <BuyBusinessNiches
            niches={nicheCards}
            businesses={businesses}
            locale={locale}
          />

          {/* Final CTA */}
          {ctaVisible ? (
            <Reveal className="mt-16 rounded-card border border-white/5 bg-card-dark py-12 text-center">
              <h2 className="mb-4 font-display text-2xl font-bold text-text-primary sm:text-3xl">
                {ctaTitle}
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-sm text-text-muted sm:text-base">
                {ctaDescription}
              </p>
              <ContactAwareLink
                href={ctaHref}
                className="group inline-flex items-center justify-center gap-2 rounded-button bg-primary px-8 py-4 text-sm font-bold text-text-inverse shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary-hover active:scale-95"
              >
                {ctaLabel}
                <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </ContactAwareLink>
            </Reveal>
          ) : null}
        </div>
      </section>
    </>
  );
}
