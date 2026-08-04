import Link from "next/link";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicAcquisitionSection } from "@/features/acquisition/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import {
  ACQUISITION_NICHES,
  getNicheSummary,
} from "@/features/acquisition/niches";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { pageMetadata } from "@/lib/seo";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { Reveal } from "@/components/ui/reveal";

export const metadata = pageMetadata({
  title: "Buy a Business — Stratifit",
  description:
    "Skip the startup grind. Browse our curated marketplace of profitable, turnkey businesses across seven high-demand niches.",
  path: "/buy-business",
});

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-3 shrink-0 text-text-subtle"
    >
      <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
    </svg>
  );
}

export default async function BuyBusinessPage() {
  const locale = await getLocale();
  const [section, settings] = await Promise.all([
    getPublicAcquisitionSection(),
    getPublicSectionSetting("acquisition"),
  ]);

  const businesses = section?.businesses ?? [];
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
    : (sectionTitle ?? "Buy a Business");
  const highlight = hasSplit ? settingsHighlight : null;
  const description =
    resolveTranslation(settings?.description_translations ?? null, locale) ||
    resolveTranslation(section?.description_translations ?? null, locale) ||
    "Skip the startup grind. Browse our curated marketplace of profitable, turnkey businesses across high-demand niches.";

  return (
    <>
      {/* Back button */}
      <Link
        href="/"
        aria-label="Go back"
        className="fixed left-1 top-16 z-50 rounded-full bg-white/5 p-2 text-text-primary backdrop-blur-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-white/10 lg:top-20"
      >
        <span className="transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary">
          <ArrowLeftIcon />
        </span>
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-32 md:pb-20 md:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal immediate variant="revealUp">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {resolveTranslation(settings?.eyebrow_translations ?? null, locale) ??
                "Acquisition"}
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
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-10">
            <h2 className="mb-2 font-display text-xl font-bold text-text-primary sm:text-2xl">
              Explore by <span className="text-primary">Niche</span>
            </h2>
            <p className="text-sm text-text-muted">
              Select a niche to see available businesses for acquisition.
            </p>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ACQUISITION_NICHES.map((niche) => {
              const summary = getNicheSummary(businesses, niche.slug);
              return (
                <Link
                  key={niche.slug}
                  href={`/buy-business/niches/${niche.slug}`}
                  className="group flex flex-col overflow-hidden rounded-card border border-white/5 bg-card-dark transition-all duration-300 hover:border-primary/20"
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 border-b border-white/5 bg-[#1a1a1a] px-3 py-2">
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-red-500/60" />
                      <span className="size-2 rounded-full bg-yellow-500/60" />
                      <span className="size-2 rounded-full bg-green-500/60" />
                    </div>
                    <div className="mx-2 flex min-w-0 flex-1 items-center gap-1 rounded border border-white/5 bg-[#0d0d0d] px-2 py-1">
                      <GlobeIcon />
                      <span className="truncate text-[8px] text-text-subtle">
                        stratifit.com/buy/{niche.slug}
                      </span>
                    </div>
                  </div>

                  <div
                    className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-10 text-center md:py-14"
                    style={{
                      background:
                        "linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #0d0d0d 100%)",
                    }}
                  >
                    <div
                      className="mb-4 flex size-16 items-center justify-center rounded-card border bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-shadow duration-500 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]"
                      style={{ borderColor: `${niche.accent}55` }}
                    >
                      <span className="text-3xl">{niche.emoji}</span>
                    </div>
                    <h3 className="mb-2 font-display text-2xl font-black tracking-tight text-text-primary md:text-3xl">
                      {niche.label}
                    </h3>
                    <p className="mb-5 max-w-xs flex-1 text-sm leading-relaxed text-text-muted">
                      {niche.description}
                    </p>
                    <div className="mb-5 flex items-center gap-4 text-xs font-medium text-text-subtle">
                      <span className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-primary/50" />
                        {summary.count} businesses
                      </span>
                      <span className="size-1 rounded-full bg-text-subtle/40" />
                      {summary.avg ? (
                        <span className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-primary/50" />
                          {summary.avg} avg.
                        </span>
                      ) : null}
                    </div>
                    <span className="rounded-lg border border-primary/20 bg-primary/10 px-5 py-2 text-xs font-bold text-primary transition-colors group-hover:bg-primary/20">
                      View Listings →
                    </span>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-2xl"
                    />
                  </div>

                  <div className="border-t border-white/5 p-4">
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/10 py-3 text-xs font-bold text-primary transition-all group-hover:bg-primary/20">
                      View {niche.label} Businesses
                      <ArrowRightIcon />
                    </span>
                  </div>
                </Link>
              );
            })}
          </Reveal>

          {/* Final CTA */}
          <Reveal className="mt-16 rounded-card border border-white/5 bg-card-dark py-12 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-text-primary sm:text-3xl">
              Ready to Own a Business?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-sm text-text-muted sm:text-base">
              Our team will guide you through every step of the acquisition
              process — from due diligence to transition.
            </p>
            <ContactAwareLink
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-button bg-primary px-8 py-4 text-sm font-bold text-text-inverse shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary-hover active:scale-95"
            >
              Schedule a Consultation
              <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </ContactAwareLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
