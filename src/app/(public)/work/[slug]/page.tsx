import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  getPublicPortfolioDetail,
  getPublicPortfolioProjects,
} from "@/features/portfolio/queries";
import { getPublicServices } from "@/features/services/queries";
import { getPublicProcessSteps } from "@/features/process/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t, tWithValue } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";
import { articleJsonLd, canonical, pageMetadata, resolveSeoMetadata } from "@/lib/seo";
import { CtaCard } from "@/components/sections/cta-card";
import { Reveal } from "@/components/ui/reveal";
import { ProcessIcon } from "@/components/ui/process-icon";
import { RelatedProjects } from "@/components/work/related-projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const project = await getPublicPortfolioDetail(slug);
  if (!project) return {};
  const { title, description } = resolveSeoMetadata({
    seoTitleTranslations: project.seo_title_translations,
    seoDescriptionTranslations: project.seo_description_translations,
    locale,
    fallbackTitle: `${resolveTranslation(project.title_translations, locale)} Stratifit`,
    fallbackDescription: resolveTranslation(
      project.summary_translations,
      locale
    ),
  });
  return {
    ...pageMetadata({ title, description, path: `/work/${slug}` }),
    openGraph: {
      title,
      description,
      url: canonical(`/work/${slug}`),
      type: "article",
      siteName: "Stratifit",
    },
  };
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4 text-primary"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function initials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Numbered section label — e.g. "01 — Challenge" — matching the editorial
 * case-study layout (numbered story blocks from start to finish).
 */
function NumberedLabel({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="font-display text-sm font-black leading-none text-primary">
        {String(index).padStart(2, "0")}
      </span>
      <span className="h-px w-10 bg-primary/40" />
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
        {children}
      </span>
    </div>
  );
}

interface FactStripItem {
  label: string;
  value: string;
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const [project, steps, relatedProjects, relatedServices] = await Promise.all([
    getPublicPortfolioDetail(slug),
    getPublicProcessSteps(),
    getPublicPortfolioProjects(6),
    getPublicServices(),
  ]);

  if (!project) {
    notFound();
  }

  const related = relatedProjects
    .filter((p) => p.slug !== slug)
    .filter(
      (p) =>
        !project.service_slugs.length ||
        p.service_slugs.some((s) => project.service_slugs.includes(s))
    )
    .slice(0, 3);
  const relatedVisible = related.length > 0 ? related : relatedProjects.filter((p) => p.slug !== slug).slice(0, 3);

  const deliverablesRaw =
    (project.deliverables_translations as Record<string, unknown> | null)?.[
      locale
    ] ??
    (project.deliverables_translations as Record<string, unknown> | null)?.[
      "en"
    ] ??
    [];
  const deliverables = deliverablesRaw as string[];

  const projectTitle = resolveTranslation(project.title_translations, locale);
  const projectSummary = resolveTranslation(project.summary_translations, locale);
  const challenge = resolveTranslation(project.challenge_translations, locale);
  const solution = resolveTranslation(project.solution_translations, locale);
  const resultsText = resolveTranslation(project.results_translations, locale);
  const serviceTitle = resolveTranslation(project.service_titles, locale);
  const categoryBadge =
    serviceTitle || deliverables[0] || t(locale, "workCaseStudy");
  const servicesJoined = deliverables.join(" · ");
  const launchYear = project.year
    ? String(project.year)
    : project.published_at
      ? new Date(project.published_at).getFullYear().toString()
      : "";

  const facts: FactStripItem[] = [];
  facts.push({
    label: t(locale, "workClient"),
    value: project.client_name,
  });
  if (serviceTitle) {
    facts.push({
      label: t(locale, "workIndustry"),
      value: serviceTitle,
    });
  }
  if (launchYear) {
    facts.push({
      label: t(locale, "workYear"),
      value: launchYear,
    });
  }
  if (servicesJoined) {
    facts.push({
      label: t(locale, "workServices"),
      value: servicesJoined,
    });
  }

  const galleryCount = project.gallery_urls.length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: projectTitle,
              description: projectSummary,
              url: canonical(`/work/${slug}`),
              publishedAt: project.published_at,
            })
          ),
        }}
      />

      {/* Hero — editorial: kicker, statement, then a mosaic of the project's visuals */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden"
        >
          <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[140px]" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-14 pb-12 sm:px-6 md:pt-20 md:pb-16">
          <Reveal immediate>
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-block rounded bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-inverse">
                {categoryBadge}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">
                {t(locale, "workCaseStudy")}
                {launchYear ? ` · ${launchYear}` : ""}
              </span>
            </div>
            <h1 className="max-w-5xl font-display text-4xl font-black leading-[1.02] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              {projectTitle}
            </h1>
            {projectSummary ? (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
                {projectSummary}
              </p>
            ) : null}
          </Reveal>

          {galleryCount > 0 ? (
            <Reveal className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:mt-12 lg:grid-cols-4">
              {project.gallery_urls.map((url, index) => {
                const isFirst = index === 0;
                const isLast = index === galleryCount - 1;
                return (
                  <div
                    key={index}
                    className={cn(
                      "group overflow-hidden rounded-card border border-white/5 bg-surface-soft transition-colors duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/30",
                      isFirst && galleryCount > 1 && "col-span-2 aspect-[16/10]",
                      isFirst && galleryCount === 1 && "col-span-2 aspect-[21/9] lg:col-span-4",
                      !isFirst && !isLast && "aspect-square",
                      isLast && galleryCount > 1 && "col-span-2 aspect-[16/9]"
                    )}
                  >
                    <Image
                      src={url}
                      alt={`${projectTitle} ${t(locale, "workVisual")} ${index + 1}`}
                      width={1600}
                      height={1000}
                      loading={index < 2 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-105"
                    />
                  </div>
                );
              })}
            </Reveal>
          ) : null}
        </div>
      </section>

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* Project facts */}
      <section className="py-12 md:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <Reveal className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/5">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={cn("md:px-8", index === 0 && "md:pl-0")}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
                  {fact.label}
                </div>
                <div className="mt-1.5 text-sm font-medium leading-snug text-text-primary md:text-base">
                  {fact.value}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* Challenge */}
      {challenge ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <Reveal className="grid items-start gap-8 md:grid-cols-2 md:gap-14">
                <div>
                  <NumberedLabel index={1}>{t(locale, "workChallenge")}</NumberedLabel>
                  <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl">
                    {t(locale, "workTheProblem")}
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-text-secondary md:text-lg">
                  {challenge}
                </p>
              </Reveal>
            </div>
          </section>
          <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* Solution */}
      {solution ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <Reveal className="grid items-start gap-8 md:grid-cols-2 md:gap-14">
                <div>
                  <NumberedLabel index={2}>{t(locale, "workSolution")}</NumberedLabel>
                  <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl">
                    {t(locale, "workWhatWeDid")}
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-text-secondary md:text-lg">
                  {solution}
                </p>
              </Reveal>
            </div>
          </section>
          <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* Process — start to finish */}
      {steps.length > 0 ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <Reveal>
                <NumberedLabel index={3}>{t(locale, "workOurProcess")}</NumberedLabel>
                <h2 className="mb-10 max-w-4xl font-display text-2xl font-black leading-tight tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                  {steps.map((step, index) => (
                    <span key={step.step_key}>
                      {index > 0 ? (
                        <span className="text-primary/60"> → </span>
                      ) : null}
                      <span>{resolveTranslation(step.title_translations, locale)}</span>
                    </span>
                  ))}
                </h2>
              </Reveal>
              <Reveal className="divide-y divide-white/5 border-y border-white/5">
                {steps.map((step, index) => (
                  <div
                    key={step.step_key}
                    className="flex flex-col gap-3 py-6 sm:flex-row sm:items-start sm:gap-10"
                  >
                    <span className="w-12 shrink-0 font-display text-3xl font-black leading-none text-primary/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="mb-1.5 flex items-center gap-2.5">
                        <ProcessIcon
                          name={step.icon_name}
                          className="size-5 shrink-0 text-primary"
                        />
                        <h3 className="font-display text-lg font-bold text-text-primary">
                          {resolveTranslation(step.title_translations, locale)}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-text-muted md:text-base">
                        {resolveTranslation(step.description_translations, locale)}
                      </p>
                    </div>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>
          <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* Results */}
      {project.metrics.length > 0 || resultsText ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <Reveal>
                <NumberedLabel index={4}>{t(locale, "workResults")}</NumberedLabel>
                <h2 className="mb-10 font-display text-2xl font-black leading-tight tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                  {t(locale, "workNumbersThat")}{" "}
                  <span className="text-primary">{t(locale, "workMoved")}</span>
                </h2>
              </Reveal>
              {project.metrics.length > 0 ? (
                <Reveal className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {project.metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="rounded-card border border-white/5 bg-card-dark p-6"
                    >
                      <div className="font-display text-3xl font-black tracking-tight text-primary md:text-4xl">
                        {metric.value}
                      </div>
                      <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
                        {resolveTranslation(metric.label_translations, locale)}
                      </div>
                    </div>
                  ))}
                </Reveal>
              ) : null}
              {resultsText ? (
                <Reveal>
                  <p className="mt-8 max-w-3xl border-l-2 border-primary/30 pl-4 text-base leading-relaxed text-text-secondary sm:pl-6 md:text-lg">
                    {resultsText}
                  </p>
                </Reveal>
              ) : null}
            </div>
          </section>
          <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* Testimonial */}
      {project.testimonial ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
              <Reveal className="relative overflow-hidden rounded-card-lg border border-white/5 bg-card-dark p-8 text-center md:p-12">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                />
                <div className="mb-6 flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className="mb-8 text-base font-medium italic leading-relaxed text-text-primary md:text-xl">
                  &ldquo;
                  {resolveTranslation(
                    project.testimonial.quote_translations,
                    locale
                  )}
                  &rdquo;
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-display text-sm font-bold text-primary">
                    {initials(project.testimonial.person_name)}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-text-primary">
                      {project.testimonial.person_name}
                    </div>
                    <div className="text-xs text-text-subtle">
                      {resolveTranslation(
                        project.testimonial.person_role_translations,
                        locale
                      ) || project.testimonial.company_name}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
          <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* Gallery — mosaic */}
      {galleryCount > 0 ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <Reveal>
                <NumberedLabel index={5}>{t(locale, "workGallery")}</NumberedLabel>
                <h2 className="mb-10 font-display text-2xl font-black leading-tight tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                  {t(locale, "workSelected")}{" "}
                  <span className="text-primary">{t(locale, "workVisuals")}</span>
                </h2>
              </Reveal>
              <Reveal className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
                {project.gallery_urls.map((url, index) => {
                  const isFirst = index === 0;
                  const isLast = index === galleryCount - 1;
                  return (
                    <div
                      key={index}
                      className={cn(
                        "group overflow-hidden rounded-card border border-white/5 bg-surface-soft transition-colors duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/30",
                        isFirst && galleryCount > 1 && "col-span-2 aspect-[16/10]",
                        isFirst && galleryCount === 1 && "col-span-2 aspect-[21/9] lg:col-span-4",
                        !isFirst && !isLast && "aspect-square",
                        isLast && galleryCount > 1 && "col-span-2 aspect-[16/9]"
                      )}
                    >
                      <Image
                        src={url}
                        alt={`${projectTitle} ${t(locale, "workVisual")} ${index + 1}`}
                        width={1600}
                        height={1000}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-105"
                      />
                    </div>
                  );
                })}
              </Reveal>
            </div>
          </section>
          <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* More work */}
      {relatedVisible.length > 0 ? (
        <>
          <section className="pt-16 md:pt-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <Reveal>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                    {t(locale, "workMoreWork")}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
                </div>
                <h2 className="mb-10 font-display text-2xl font-black leading-tight tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                  {t(locale, "workSimilar")}{" "}
                  <span className="text-primary">{t(locale, "workCaseStudies")}</span>
                </h2>
              </Reveal>
              <RelatedProjects
                projects={relatedVisible}
                services={relatedServices}
                locale={locale}
              />
            </div>
          </section>
          <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <Reveal>
            <CtaCard
              title={t(locale, "workWantOutcome")}
              description={t(locale, "workSameRigor")}
              label={
                serviceTitle
                  ? tWithValue(locale, "ctaStartService", serviceTitle)
                  : t(locale, "workStartCta")
              }
              href="/contact"
              locale={locale}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
