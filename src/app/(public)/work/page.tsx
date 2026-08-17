import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/get-locale";
import { pageMetadata, resolveSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const setting = await getPublicSectionSettingIncludingHidden("portfolio");
  const { title, description } = resolveSeoMetadata({
    seoTitleTranslations: setting?.seo_title_translations,
    seoDescriptionTranslations: setting?.seo_description_translations,
    locale,
    fallbackTitle: "Our Work — Stratifit",
    fallbackDescription:
      "Selected case studies and projects by Stratifit across web, brand, and growth.",
  });
  return pageMetadata({ title, description, path: "/work" });
}

import { getPublicPortfolioProjects } from "@/features/portfolio/queries";
import { getPublicServices } from "@/features/services/queries";
import {
  getPublicSectionSetting,
  getPublicSectionSettingIncludingHidden,
} from "@/features/section-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t } from "@/lib/i18n/ui-strings";
import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { WorkGrid } from "@/components/work/work-grid";

interface WorkStat {
  value: string;
  label: string;
}

function WorkStatsBand({ stats }: { stats: WorkStat[] }) {
  if (stats.length === 0) {
    return null;
  }

  return (
    <section>
      <Container className="py-6 md:py-8">
        <Reveal className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className={`flex flex-col items-center px-2 text-center ${
                index > 0 ? "border-white/10 sm:border-l" : ""
              }`}
            >
              <div className="mb-1 font-display text-2xl font-extrabold tracking-tight text-primary sm:mb-2 sm:text-3xl">
                <CountUp value={stat.value} className="tabular-nums" />
              </div>
              <div className="text-[9px] font-semibold uppercase leading-snug tracking-[0.1em] text-text-secondary sm:text-[11px]">
                {stat.label}
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

export default async function WorkPage() {
  const locale = await getLocale();
  const [projects, services, settings] = await Promise.all([
    getPublicPortfolioProjects(100),
    getPublicServices(),
    getPublicSectionSetting("portfolio"),
  ]);

  const eyebrow =
    resolveTranslation(settings?.eyebrow_translations ?? null, locale) ||
    t(locale, "workEyebrowFallback");
  const title =
    resolveTranslation(settings?.title_translations ?? null, locale) ||
    t(locale, "workTitleFallback");
  const highlight =
    resolveTranslation(settings?.highlight_translations ?? null, locale) ||
    t(locale, "workHighlightFallback");
  const description =
    resolveTranslation(settings?.description_translations ?? null, locale) ||
    t(locale, "workDescriptionFallback");

  // Editable stats band from section settings (portfolio section).
  const stats =
    settings?.stats
      ?.map((stat) => ({
        value: stat.value,
        label:
          resolveTranslation(stat.label_translations, locale) || stat.value,
      }))
      .filter((stat) => stat.value.trim().length > 0) ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-background pt-16 pb-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal immediate variant="revealUp">
            {eyebrow ? (
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mb-4 font-display text-4xl font-black leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-none lg:text-7xl">
              <span>{title}</span>
              {highlight ? <span className="text-primary"> {highlight}</span> : null}
            </h1>
            {description ? (
              <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-base leading-relaxed text-text-muted sm:pl-6 sm:text-lg md:text-xl">
                {description}
              </p>
            ) : null}
          </Reveal>
        </div>
      </section>

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      <WorkStatsBand stats={stats} />

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      <section className="pt-0 pb-10">
        <Container>
          {projects.length === 0 ? (
            <p className="py-20 text-center text-sm text-text-muted">
              {t(locale, "workEmptyProjects")}
            </p>
          ) : (
            <WorkGrid
              projects={projects}
              services={services}
              locale={locale}
            />
          )}
        </Container>
      </section>
    </>
  );
}
