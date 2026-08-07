import { getLocale } from "@/lib/i18n/get-locale";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Work — Stratifit",
  description:
    "Selected case studies and projects by Stratifit across web, brand, and growth.",
  path: "/work",
});

import { getPublicPortfolioProjects } from "@/features/portfolio/queries";
import { getPublicServices } from "@/features/services/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { WorkGrid } from "@/components/work/work-grid";

function WorkStatsBand() {
  const stats = [
    { value: "50+", label: "Projects delivered" },
    { value: "340%", label: "Average client ROAS" },
    { value: "4.9/5", label: "Average client rating" },
    { value: "92%", label: "Clients who renew" },
  ];

  return (
    <section className="border-y border-border bg-surface-soft/40">
      <Container className="py-10 md:py-12">
        <Reveal className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-black tracking-tight text-primary md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-text-subtle md:text-xs">
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

  const eyebrow = settings
    ? resolveTranslation(settings.eyebrow_translations, locale)
    : "Portfolio";
  const title = settings
    ? resolveTranslation(settings.title_translations, locale)
    : "Our";
  const highlight = settings
    ? resolveTranslation(settings.highlight_translations, locale)
    : "Work";
  const description =
    (settings && resolveTranslation(settings.description_translations, locale)) ||
    "We craft digital experiences that define industries and elevate brands through precision and creativity.";

  return (
    <>
      <section className="relative overflow-hidden py-16">
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

      <WorkStatsBand />


      <section className="pt-20 pb-24 md:pt-24 md:pb-32">
        <Container>
          {projects.length === 0 ? (
            <p className="py-20 text-center text-sm text-text-muted">
              Projects will appear here soon.
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
