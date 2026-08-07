import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicAcquisitionSection } from "@/features/acquisition/queries";
import {
  ACQUISITION_NICHES,
  getNicheBusinesses,
  getNicheMeta,
  getNicheSummary,
} from "@/features/acquisition/niches";
import { pageMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { t, tWithNumber, tWithValue } from "@/lib/i18n/ui-strings";
import { hexToRgba } from "@/lib/color";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { Reveal } from "@/components/ui/reveal";
import { BusinessCard } from "@/components/sections/business-card";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const meta = getNicheMeta(slug);
  return pageMetadata({
    title: `${meta ? `${meta.label} ${t(locale, "businesses")}` : t(locale, "businesses")} — Stratifit`,
    description:
      meta?.description ??
      "Browse curated, turnkey businesses for acquisition across high-demand niches.",
    path: `/buy-business/niches/${slug}`,
  });
}

export default async function NicheDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const niche = getNicheMeta(slug);

  if (!niche) {
    notFound();
  }

  const section = await getPublicAcquisitionSection();
  const businesses = getNicheBusinesses(section?.businesses ?? [], slug);
  const summary = getNicheSummary(section?.businesses ?? [], slug);
  const otherNiches = ACQUISITION_NICHES.filter((n) => n.slug !== slug);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ background: hexToRgba(niche.accent, 0.09) }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal immediate variant="revealUp">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <span aria-hidden="true" className="h-px w-6 bg-primary/40" />
              {t(locale, "acquisition")} — {niche.label}
            </p>
            <h1 className="mb-4 font-display text-4xl font-black leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-none lg:text-7xl">
              {niche.label}{" "}
              <span className="text-primary">{t(locale, "businesses")}</span>
            </h1>
            <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-base leading-relaxed text-text-muted sm:pl-6 sm:text-lg md:text-xl">
              {niche.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-text-secondary">
                <span className="size-1.5 rounded-full bg-primary" />
                {tWithNumber(locale, "businessesCount", summary.count)}
              </span>
              {summary.avg ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-text-secondary">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {tWithValue(locale, "avgAskingPrice", summary.avg)}
                </span>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why this niche */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-10">
            <div className="lg:col-span-2">
              <h2 className="mb-4 font-display text-2xl font-black tracking-tight text-text-primary sm:text-3xl">
                {niche.why_title}
              </h2>
              <p className="border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-text-muted sm:pl-5 sm:text-base">
                {niche.why_description}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
              {niche.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-card border border-white/5 bg-card-dark p-5 transition-colors duration-300 hover:border-primary/20"
                >
                  <p className="font-display text-3xl font-black tracking-tight text-primary sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.18em] text-text-secondary">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-text-subtle">
                    {stat.hint}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Listings */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="mb-2 font-display text-xl font-bold text-text-primary sm:text-2xl">
                {t(locale, "available")} {niche.label}{" "}
                <span className="text-primary">{t(locale, "businesses")}</span>
              </h2>
              <p className="text-sm text-text-muted">
                {t(locale, "vettedListingsDescription")}
              </p>
            </div>
            <ContactAwareLink
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-button border border-primary/25 bg-primary/10 px-5 py-2.5 text-xs font-bold text-primary transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary/20"
            >
              {t(locale, "notFindingWhatYouNeed")}
              <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </ContactAwareLink>
          </Reveal>

          {businesses.length > 0 ? (
            <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.slug}
                  business={business}
                  locale={locale}
                />
              ))}
            </Reveal>
          ) : (
            <Reveal className="rounded-card border border-white/5 bg-card-dark p-10 text-center sm:p-16">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-card border border-primary/20 bg-primary/10">
                <span className="text-3xl">{niche.emoji}</span>
              </div>
              <h3 className="mb-3 font-display text-xl font-bold text-text-primary sm:text-2xl">
                {tWithValue(locale, "newListingsComingSoon", niche.label)}
              </h3>
              <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-text-muted">
                {t(locale, "activelyVettingDescription")}
              </p>
              <ContactAwareLink
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-button bg-primary px-7 py-3.5 text-sm font-bold text-text-inverse shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary-hover active:scale-95"
              >
                {t(locale, "getNotified")}
                <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </ContactAwareLink>
            </Reveal>
          )}
        </div>
      </section>

      {/* Other niches */}
      {otherNiches.length > 0 ? (
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="mb-8">
              <h2 className="mb-2 font-display text-xl font-bold text-text-primary sm:text-2xl">
                {t(locale, "exploreOther")} <span className="text-primary">{t(locale, "niches")}</span>
              </h2>
              <p className="text-sm text-text-muted">
                {t(locale, "browseMoreOpportunities")}
              </p>
            </Reveal>
            <Reveal className="flex flex-wrap gap-3">
              {otherNiches.map((other) => (
                <Link
                  key={other.slug}
                  href={`/buy-business/niches/${other.slug}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-text-secondary transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/30 hover:bg-primary/10 hover:text-text-primary"
                >
                  <span className="text-base">{other.emoji}</span>
                  {other.label}
                  <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1">
                    <ArrowRightIcon />
                  </span>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Final CTA */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="relative overflow-hidden rounded-card border border-white/5 bg-card-dark px-6 py-12 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-[480px] -translate-x-1/2 rounded-full blur-[120px]"
              style={{ background: hexToRgba(niche.accent, 0.12) }}
            />
            <div className="relative z-10">
              <h2 className="mb-4 font-display text-2xl font-black tracking-tight text-text-primary sm:text-3xl">
                {t(locale, "readyToOwnBusinessA")} <span className="text-primary">{t(locale, "readyToOwnBusinessQ")}</span>
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
                {t(locale, "acquisitionGuideDescription")}
              </p>
              <ContactAwareLink
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-button bg-primary px-8 py-4 text-sm font-bold text-text-inverse shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary-hover hover:shadow-[0_0_45px_rgba(245,158,11,0.3)] active:scale-95"
              >
                {t(locale, "scheduleConsultation")}
                <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </ContactAwareLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
