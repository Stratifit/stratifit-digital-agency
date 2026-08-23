import Image from "next/image";
import Link from "next/link";
import type {
  PublicPortfolioDetail,
  PublicPortfolioProject,
} from "@/features/portfolio/queries";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t, tWithValue } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";
import { ProcessIcon } from "@/components/ui/process-icon";
import { RelatedProjects } from "@/components/work/related-projects";
import {
  BrandBoard,
  type BrandBoardVariant,
} from "@/components/work/brand-board";

interface BrandStep {
  step_key: string;
  icon_name: string | null;
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
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
 * Editorial section label — "01 · Project Overview" — matching the numbered
 * storytelling layout of the case study.
 */
function SectionEyebrow({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
      {String(index).padStart(2, "0")} · {children}
    </p>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0 text-primary", className)}
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  );
}

/** Board variant used for each numbered process step (cycles after step 5). */
const STEP_BOARDS: BrandBoardVariant[] = [
  "overview",
  "palette",
  "mark",
  "type",
  "applications",
  "pattern",
];

/* ------------------------------------------------------------------ */
/* Brand case study                                                    */
/* ------------------------------------------------------------------ */

export function BrandCaseStudy({
  project,
  steps,
  relatedVisible,
  relatedServices,
  locale,
}: {
  project: PublicPortfolioDetail;
  steps: BrandStep[];
  relatedVisible: PublicPortfolioProject[];
  relatedServices: PublicServiceDetail[];
  locale: string;
}) {
  const projectTitle = resolveTranslation(project.title_translations, locale);
  const projectSummary = resolveTranslation(project.summary_translations, locale);
  const brandStory = resolveTranslation(
    project.brand_story_translations,
    locale
  );
  const challenge = resolveTranslation(project.challenge_translations, locale);
  const approach = resolveTranslation(project.approach_translations, locale);
  const solution = resolveTranslation(project.solution_translations, locale);
  const resultsText = resolveTranslation(project.results_translations, locale);
  const serviceTitle = resolveTranslation(project.service_titles, locale);
  const deliverablesRaw =
    (project.deliverables_translations as Record<string, unknown> | null)?.[
      locale
    ] ??
    (project.deliverables_translations as Record<string, unknown> | null)?.[
      "en"
    ] ??
    [];
  const deliverables = deliverablesRaw as string[];

  const launchYear = project.year
    ? String(project.year)
    : project.published_at
      ? new Date(project.published_at).getFullYear().toString()
      : "";

  const wordmark = project.client_name || projectTitle || "Brand";
  const kickerParts = [
    serviceTitle || t(locale, "workBrandIdentity"),
    deliverables[0],
    launchYear,
  ].filter(Boolean);

  const gallery = project.gallery_urls;
  const captionFor = (index: number) =>
    deliverables[index % deliverables.length] ??
    `${t(locale, "workApplications")} ${String(index + 1).padStart(2, "0")}`;

  const galleryTileDefs: { wide: boolean; board: BrandBoardVariant }[] = [
    { wide: true, board: "applications" },
    { wide: false, board: "palette" },
    { wide: false, board: "type" },
    { wide: true, board: "pattern" },
    { wide: false, board: "mark" },
    { wide: false, board: "overview" },
  ];
  const galleryTiles: {
    wide: boolean;
    board: BrandBoardVariant;
    caption: string;
    url: string | null;
  }[] = galleryTileDefs.map((tile, index) => ({
    ...tile,
    caption: captionFor(index),
    url: gallery.length ? gallery[index % gallery.length] : null,
  }));

  // Strategy card items — derived from the project's own content.
  const strategyItems: { label: string; value: string }[] = [
    {
      label: t(locale, "workPositioning"),
      value: `${wordmark} · ${serviceTitle || t(locale, "workBrandIdentity")}`,
    },
    { label: t(locale, "workAudience"), value: projectSummary },
    {
      label: t(locale, "workCoreMessage"),
      value: brandStory || challenge || projectSummary,
    },
    {
      label: t(locale, "workValueProposition"),
      value: solution || resultsText || projectSummary,
    },
    ...(deliverables.length
      ? [
          {
            label: t(locale, "servicesDeliverables"),
            value: deliverables.join(" · "),
          },
        ]
      : []),
  ];

  const resolvedMetrics = project.metrics.map((metric) => ({
    value: metric.value,
    label: resolveTranslation(metric.label_translations, locale),
  }));

  const clientName = project.client_name || wordmark;
  const ctaLabel = serviceTitle
    ? tWithValue(locale, "ctaStartService", serviceTitle)
    : t(locale, "workStartCta");
  const servicesJoined = deliverables.join(" · ");

  return (
    <>
      {/* ============================================================ */}
      {/* Hero — topline, editorial copy, generated hero board         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden"
        >
          <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal immediate>
            <nav
              aria-label="Case study navigation"
              className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 py-5"
            >
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-4 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:-translate-x-0.5"
                >
                  <path d="M19 12H5m5 5-5-5 5-5" />
                </svg>
                {t(locale, "workSelectedWork")}
              </Link>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
                {wordmark.toUpperCase()} · {t(locale, "workCaseStudy")} 01
                {launchYear ? ` · ${launchYear}` : ""}
              </span>
            </nav>
          </Reveal>

          <div className="pb-10 pt-12 md:pb-14 md:pt-16 lg:pt-20">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                {kickerParts.join(" · ")}
              </p>
              <h1 className="mt-5 max-w-4xl font-display text-5xl font-black leading-[0.98] tracking-tight text-text-primary sm:text-6xl md:text-7xl">
                {projectTitle || wordmark}
              </h1>
              {projectSummary ? (
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
                  {projectSummary}
                </p>
              ) : null}
            </Reveal>
            {deliverables.length > 0 ? (
              <Reveal className="mt-8">
                <ul
                  className="flex flex-wrap gap-2"
                  aria-label="Project services and timeline"
                >
                  {deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary"
                    >
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          <Reveal className="pb-12 md:pb-16">
            <figure className="relative aspect-[16/7] overflow-hidden rounded-card-lg border border-white/10 md:aspect-[21/8]">
              <BrandBoard
                variant="hero"
                wordmark={wordmark}
                label={serviceTitle || t(locale, "workBrandIdentity")}
                tagline={projectSummary}
                className="absolute inset-0"
              />
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 01 — Project overview                                         */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <Reveal>
                <SectionEyebrow index={1}>{t(locale, "workOverview")}</SectionEyebrow>
              </Reveal>
              <Reveal>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
                  {challenge || projectSummary || wordmark}
                </h2>
              </Reveal>
            </div>
            {approach ? (
              <Reveal>
                <p className="text-base leading-relaxed text-text-muted md:text-lg">
                  {approach}
                </p>
              </Reveal>
            ) : null}
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Reveal className="h-full">
              <article className="flex h-full flex-col rounded-card-lg border border-white/10 bg-card-dark p-6 sm:p-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
                  {t(locale, "workClient")}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-text-primary">
                  {t(locale, "workWhoTheyAre")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {clientName}
                  {serviceTitle ? ` · ${serviceTitle}` : ""}
                </p>
              </article>
            </Reveal>
            <Reveal className="h-full">
              <article className="flex h-full flex-col rounded-card-lg border border-white/10 bg-card-dark p-6 sm:p-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
                  {t(locale, "workChallenge")}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-text-primary">
                  {t(locale, "workWhatWasBroken")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {challenge || projectSummary}
                </p>
              </article>
            </Reveal>
            <Reveal className="h-full">
              <article className="flex h-full flex-col rounded-card-lg border border-white/10 bg-card-dark p-6 sm:p-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
                  {t(locale, "workObjective")}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-text-primary">
                  {t(locale, "workWhatNeededToChange")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {solution || resultsText || projectSummary}
                </p>
              </article>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <figure className="relative overflow-hidden rounded-card-lg border border-white/10">
              <div className="aspect-[16/7]">
                <BrandBoard
                  variant="overview"
                  wordmark={wordmark}
                  className="absolute inset-0"
                />
              </div>
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-muted">
                  {t(locale, "workOverview")}
                </span>
                <span className="text-xs font-semibold text-text-primary">
                  {wordmark} — {t(locale, "workBrandIdentity")}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 02 — Strategy foundation (dark band)                          */}
      {/* ============================================================ */}
      <section className="border-t border-white/5 bg-background-deep py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <Reveal>
                <SectionEyebrow index={2}>{t(locale, "workStrategy")}</SectionEyebrow>
              </Reveal>
              <Reveal>
                <h2 className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
                  {t(locale, "workStrategyFoundation")}
                </h2>
              </Reveal>
              {approach ? (
                <Reveal>
                  <p className="mt-5 text-base leading-relaxed text-text-secondary md:text-lg">
                    {approach}
                  </p>
                </Reveal>
              ) : null}
              {brandStory ? (
                <Reveal>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-text-muted">
                    {brandStory}
                  </p>
                </Reveal>
              ) : null}
            </div>

            <Reveal>
              <div className="overflow-hidden rounded-card-lg border border-white/10 bg-card-dark">
                <div className="grid sm:grid-cols-[220px_1fr]">
                  <div className="relative aspect-square sm:aspect-auto sm:min-h-[320px]">
                    <BrandBoard
                      variant="mark"
                      wordmark={wordmark}
                      className="absolute inset-0"
                    />
                  </div>
                  <div className="divide-y divide-white/5 border-t border-white/5 sm:border-l sm:border-t-0">
                    {strategyItems.map((item, index) => (
                      <div key={item.label} className="flex gap-4 p-5 sm:p-6">
                        <span className="shrink-0 font-display text-xs font-black leading-none text-primary/50">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
                            {item.label}
                          </div>
                          <p className="mt-1.5 text-sm font-medium leading-relaxed text-text-primary">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Method bar — Our method: step → step → step                  */}
      {/* ============================================================ */}
      {steps.length > 0 ? (
        <aside
          aria-label={t(locale, "workOurMethod")}
          className="border-b border-white/5 bg-card-dark/60"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-5 sm:px-6 lg:px-8">
            <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
              {t(locale, "workOurMethod")}
            </span>
            {steps.map((step, index) => (
              <span
                key={step.step_key}
                className="flex items-center gap-x-3 gap-y-2"
              >
                {index > 0 ? (
                  <span className="text-primary" aria-hidden="true">
                    →
                  </span>
                ) : null}
                <strong className="text-xs font-bold uppercase tracking-[0.15em] text-text-primary">
                  {resolveTranslation(step.title_translations, locale)}
                </strong>
              </span>
            ))}
          </div>
        </aside>
      ) : null}

      {/* ============================================================ */}
      {/* 03 — Process — numbered timeline with a board per step       */}
      {/* ============================================================ */}
      {steps.length > 0 ? (
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionEyebrow index={3}>{t(locale, "workOurProcess")}</SectionEyebrow>
              <h2 className="mt-4 max-w-3xl font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
                {t(locale, "workHowWeBuilt")}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
                {t(locale, "workProcessIntro")}
              </p>
            </Reveal>

            <div className="mt-14 space-y-16 md:space-y-20">
              {steps.map((step, index) => {
                const stepTitle = resolveTranslation(
                  step.title_translations,
                  locale
                );
                const stepDescription = resolveTranslation(
                  step.description_translations,
                  locale
                );
                const flipped = index % 2 === 1;
                return (
                  <article
                    key={step.step_key}
                    className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14"
                  >
                    <div className={cn(flipped && "lg:order-2")}>
                      <Reveal>
                        <div className="flex items-baseline gap-4">
                          <span className="font-display text-5xl font-black leading-none text-primary/20 md:text-6xl">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-display text-2xl font-black tracking-tight text-text-primary md:text-3xl">
                            {stepTitle}
                          </h3>
                        </div>
                        <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary">
                          {stepDescription}
                        </p>
                        <div className="mt-6 flex items-center gap-2">
                          <ProcessIcon
                            name={step.icon_name}
                            className="size-4 text-primary"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
                            {stepTitle}
                          </span>
                        </div>
                      </Reveal>
                    </div>
                    <Reveal className={cn(flipped && "lg:order-1")}>
                      <figure className="relative aspect-[4/3] overflow-hidden rounded-card-lg border border-white/10">
                        <BrandBoard
                          variant={STEP_BOARDS[index % STEP_BOARDS.length]}
                          wordmark={wordmark}
                          label={stepTitle}
                          className="absolute inset-0"
                        />
                      </figure>
                    </Reveal>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* 04 — Results (dark band)                                      */}
      {/* ============================================================ */}
      {project.metrics.length > 0 || resultsText ? (
        <section className="border-y border-white/5 bg-background-deep py-16 md:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
              <div>
                <Reveal>
                  <SectionEyebrow index={4}>{t(locale, "workResults")}</SectionEyebrow>
                </Reveal>
                <Reveal>
                  <h2 className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
                    {t(locale, "workNumbersThat")}{" "}
                    <em className="text-primary">{t(locale, "workMoved")}</em>
                  </h2>
                </Reveal>
                {resultsText ? (
                  <Reveal>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
                      {resultsText}
                    </p>
                  </Reveal>
                ) : null}
                {deliverables.length > 0 ? (
                  <Reveal>
                    <ul className="mt-8 space-y-3">
                      {deliverables.map((deliverable) => (
                        <li
                          key={deliverable}
                          className="flex items-center gap-3 text-sm font-medium text-text-primary"
                        >
                          <CheckIcon className="size-4" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ) : null}
              </div>
              <Reveal>
                <figure className="relative overflow-hidden rounded-card-lg border border-white/10">
                  <div className="aspect-[16/11]">
                    <BrandBoard
                      variant="results"
                      wordmark={wordmark}
                      metrics={resolvedMetrics}
                      className="absolute inset-0"
                    />
                  </div>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* 05 — Brand in Action — gallery grid                           */}
      {/* ============================================================ */}
      {gallery.length > 0 || deliverables.length > 0 ? (
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionEyebrow index={5}>{t(locale, "workBrandInAction")}</SectionEyebrow>
              <h2 className="mt-4 max-w-3xl font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
                {t(locale, "workBrandInUse")}
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {galleryTiles.map((tile, index) => (
                <Reveal
                  key={index}
                  className={cn(tile.wide && "md:col-span-2")}
                >
                  <figure className="group relative overflow-hidden rounded-card-lg border border-white/10 bg-card-dark">
                    <div
                      className={cn(
                        "relative w-full",
                        tile.wide ? "aspect-[21/9]" : "aspect-[4/3]"
                      )}
                    >
                      {tile.url ? (
                        <Image
                          src={tile.url}
                          alt={`${wordmark} — ${tile.caption}`}
                          fill
                          sizes={
                            tile.wide
                              ? "100vw"
                              : "(max-width: 768px) 100vw, 50vw"
                          }
                          className="object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-[1.02]"
                        />
                      ) : (
                        <BrandBoard
                          variant={tile.board}
                          wordmark={wordmark}
                          label={tile.caption}
                          className="absolute inset-0"
                        />
                      )}
                    </div>
                    <figcaption className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4">
                      <span className="font-display text-xs font-black leading-none text-primary/50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-primary">
                        {tile.caption}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
                        {t(locale, "workBrandInAction")}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* 06 — Client perspective                                       */}
      {/* ============================================================ */}
      {project.testimonial ? (
        <section className="border-t border-white/5 py-16 md:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
              <div>
                <Reveal>
                  <SectionEyebrow index={6}>
                    {t(locale, "workClientPerspective")}
                  </SectionEyebrow>
                </Reveal>
                <Reveal>
                  <blockquote className="mt-6 font-display text-2xl font-bold leading-snug tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                    &ldquo;
                    {resolveTranslation(
                      project.testimonial.quote_translations,
                      locale
                    )}
                    &rdquo;
                  </blockquote>
                </Reveal>
                <Reveal>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-display text-sm font-bold text-primary">
                      {initials(project.testimonial.person_name)}
                    </div>
                    <div>
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
              <Reveal>
                <figure className="relative aspect-[4/3] overflow-hidden rounded-card-lg border border-white/10">
                  <BrandBoard
                    variant="pattern"
                    wordmark={wordmark}
                    label={t(locale, "workBrandInAction")}
                    className="absolute inset-0"
                  />
                </figure>
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* More work                                                     */}
      {/* ============================================================ */}
      {relatedVisible.length > 0 ? (
        <section className="pt-16 md:pt-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
                <span className="text-primary">
                  {t(locale, "workCaseStudies")}
                </span>
              </h2>
            </Reveal>
            <RelatedProjects
              projects={relatedVisible}
              services={relatedServices}
              locale={locale}
            />
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* Final CTA                                                     */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-card-lg border border-white/10 bg-card-dark">
              <div className="grid items-stretch lg:grid-cols-2">
                <div className="relative flex flex-col justify-center p-8 sm:p-12 md:p-14">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  />
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                    {t(locale, "workYourProjectNext")}
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl">
                    {t(locale, "workWantOutcome")}
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">
                    {t(locale, "workSameRigor")}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href="/contact"
                      className="inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-button font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 border border-transparent bg-primary text-text-inverse hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-hover active:translate-y-0 active:border-primary/60 active:bg-primary-active shadow-amber h-[52px] px-6 text-base"
                    >
                      {ctaLabel}
                      <ArrowIcon className="size-4" />
                    </Link>
                    <Link
                      href="/work"
                      className="inline-flex h-[52px] items-center justify-center gap-2 rounded-button border border-card-border bg-card-dark px-6 text-base font-medium text-text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/30 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
                    >
                      {t(locale, "workViewCaseStudies")}
                      <ArrowIcon className="size-4" />
                    </Link>
                  </div>
                </div>
                <div className="relative min-h-[320px] border-t border-white/10 lg:border-l lg:border-t-0">
                  <BrandBoard
                    variant="cta"
                    wordmark={wordmark}
                    label={serviceTitle || t(locale, "workBrandIdentity")}
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>
          </Reveal>
          {servicesJoined ? (
            <Reveal>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-1 text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
                <span>STRATIFIT</span>
                <span>{servicesJoined}</span>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>
    </>
  );
}
