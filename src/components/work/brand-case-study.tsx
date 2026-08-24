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
import { RelatedProjects } from "@/components/work/related-projects";
import { BrandBoard, type BrandBoardVariant } from "@/components/work/brand-board";
import { ProcessCards, type ProcessStep } from "@/components/work/process-cards";
import { BrandGuidelinesDocument } from "@/components/work/brand-guidelines-document";
import { ProcessIcon } from "@/components/ui/process-icon";

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

/** Icons for the cover meta cards — Client, Industry, Year (in order). */
const META_ICONS = ["user", "briefcase", "calendar"];

/** Icons rotated across the results metric cards. */
const METRIC_ICONS = ["chart", "target", "trendingup", "sparkles"];

/**
 * Numbered section label — e.g. "01 • Project Problem" — the amber eyebrow
 * that anchors every storytelling block of the case study. Each section
 * carries its own icon chip so the story blocks read like the sections of
 * the guidelines document above them.
 */
function SectionEyebrow({
  index,
  icon,
  children,
}: {
  index: number;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10"
        aria-hidden="true"
      >
        <ProcessIcon name={icon} className="size-4" />
      </span>
      {String(index).padStart(2, "0")} • {children}
    </p>
  );
}

/** Amber check mark badge used in the case-study header. */
function CheckBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary",
        className
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0A0A0A"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="m5 13 4 4L19 7" />
      </svg>
    </span>
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

/**
 * Visual + caption pair — the design's storytelling cards: a generated brand
 * board in a rounded frame with a caption on the left and a status pill on
 * the right ("Before", "New Identity", "Concept").
 */
function VisualBlock({
  board,
  wordmark,
  caption,
  badge,
}: {
  board: BrandBoardVariant;
  wordmark: string;
  caption: string;
  badge: string;
}) {
  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-card-lg border border-white/10 bg-card-dark">
        <BrandBoard variant={board} wordmark={wordmark} className="absolute inset-0" />
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-text-muted">{caption}</span>
        <span className="shrink-0 rounded-full border border-primary/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          {badge}
        </span>
      </figcaption>
    </figure>
  );
}

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
  const clientName = project.client_name || wordmark;
  const categoryLabel =
    serviceTitle || deliverables[0] || t(locale, "workBrandIdentity");

  // Story blocks — derived from the project's own content.
  const problemHeading = challenge || brandStory || projectSummary;
  const problemBody = brandStory || projectSummary;
  const solutionBody = solution || approach || projectSummary;
  const conceptBody = approach || brandStory || projectSummary;

  const metaItems: { label: string; value: string }[] = [
    { label: t(locale, "workClient"), value: clientName },
  ];
  if (categoryLabel) {
    metaItems.push({ label: t(locale, "workIndustry"), value: categoryLabel });
  }
  if (launchYear) {
    metaItems.push({ label: t(locale, "workYear"), value: launchYear });
  }

  const gallery = project.gallery_urls;
  const galleryCaption = (index: number) =>
    deliverables[index % deliverables.length] ??
    `${t(locale, "workBrandInAction")} ${String(index + 1).padStart(2, "0")}`;

  const resolvedMetrics = project.metrics.map((metric) => ({
    value: metric.value,
    label: resolveTranslation(metric.label_translations, locale),
  }));

  const processSteps: ProcessStep[] = steps.map((step) => ({
    step_key: step.step_key,
    icon_name: step.icon_name,
    title: resolveTranslation(step.title_translations, locale),
    description: resolveTranslation(step.description_translations, locale),
  }));

  const ctaLabel = serviceTitle
    ? tWithValue(locale, "ctaStartService", serviceTitle)
    : t(locale, "workStartCta");
  const servicesJoined = deliverables.join(" · ");

  // Numbered sections — the counter advances only for rendered sections so
  // numbering stays sequential when a section is missing content.
  let sectionIndex = 0;
  const nextIndex = () => ++sectionIndex;

  return (
    <>
      {/* ============================================================ */}
      {/* Cover — header bar, category tag, title, metadata            */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] overflow-hidden"
        >
          <div className="absolute left-1/2 top-0 h-[360px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal immediate>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 py-5">
              <Link
                href="/work"
                aria-label={t(locale, "workSelectedWork")}
                className="group inline-flex items-center gap-3 rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <CheckBadge />
                <span className="font-display text-base font-black tracking-tight text-text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:text-primary">
                  {wordmark}
                </span>
              </Link>
              <span className="inline-flex shrink-0 items-center rounded-full border border-primary/40 bg-card-dark px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                {categoryLabel}
              </span>
            </div>
          </Reveal>

          <Reveal className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-card-lg border border-primary/30 bg-card-dark px-4 py-3 sm:px-5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {categoryLabel}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-muted">
                {t(locale, "workCaseStudy")}
                {launchYear ? ` / ${launchYear}` : ""}
              </span>
            </div>
          </Reveal>

          <div className="pb-12 pt-10 md:pb-16 md:pt-14">
            <Reveal>
              <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight text-text-primary sm:text-6xl md:text-7xl lg:text-8xl">
                {projectTitle || wordmark}
              </h1>
              {projectSummary ? (
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
                  {projectSummary}
                </p>
              ) : null}
            </Reveal>

            {metaItems.length > 0 ? (
              <Reveal className="mt-10">
                <dl className="grid divide-y divide-white/10 overflow-hidden rounded-card-lg border border-white/10 bg-card-dark sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {metaItems.map((item, index) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 p-5 sm:p-6"
                    >
                      <span
                        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary"
                        aria-hidden="true"
                      >
                        <ProcessIcon
                          name={META_ICONS[index] ?? "user"}
                          className="size-5"
                        />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                          {item.label}
                        </dt>
                        <dd className="mt-1 truncate text-sm font-semibold leading-snug text-text-primary">
                          {item.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 01 — Brand guidelines — the identity document                 */}
      {/* ============================================================ */}
      <section className="py-14 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionEyebrow index={nextIndex()} icon="layers">
              {t(locale, "workBrandGuidelines")}
            </SectionEyebrow>
            <h2 className="mt-5 max-w-3xl font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl">
              {t(locale, "workIdentitySystem")}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
              {t(locale, "workGuidelinesIntro")}
            </p>
          </Reveal>
          <Reveal className="mt-10">
            <BrandGuidelinesDocument
              guidelines={project.brand_guidelines}
              wordmark={wordmark}
              summary={projectSummary}
              locale={locale}
            />
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 02 — Project problem                                          */}
      {/* ============================================================ */}
      <section className="py-14 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionEyebrow index={nextIndex()} icon="search">
              {t(locale, "workProjectProblem")}
            </SectionEyebrow>
            {problemHeading ? (
              <h2 className="mt-5 max-w-2xl font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl">
                {problemHeading}
              </h2>
            ) : null}
            {problemBody && problemBody !== problemHeading ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
                {problemBody}
              </p>
            ) : null}
          </Reveal>
          <Reveal className="mt-10">
            <VisualBlock
              board="before"
              wordmark={wordmark}
              caption={t(locale, "workProblemCaption")}
              badge={t(locale, "workBefore")}
            />
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 02 — Our solution                                             */}
      {/* ============================================================ */}
      <section className="py-14 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionEyebrow index={nextIndex()} icon="lightbulb">
              {t(locale, "workOurSolution")}
            </SectionEyebrow>
            {solutionBody ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
                {solutionBody}
              </p>
            ) : null}
          </Reveal>
          <Reveal className="mt-10">
            <VisualBlock
              board="solution"
              wordmark={wordmark}
              caption={t(locale, "workSolutionCaption")}
              badge={t(locale, "workNewIdentity")}
            />
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 03 — The concept                                              */}
      {/* ============================================================ */}
      <section className="py-14 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionEyebrow index={nextIndex()} icon="rocket">
              {t(locale, "workConcept")}
            </SectionEyebrow>
            {conceptBody ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
                {conceptBody}
              </p>
            ) : null}
          </Reveal>
          <Reveal className="mt-10">
            <VisualBlock
              board="concept"
              wordmark={wordmark}
              caption={t(locale, "workConceptCaption")}
              badge={t(locale, "workConcept")}
            />
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 04 — Our process — tabs + card grid                          */}
      {/* ============================================================ */}
      {processSteps.length > 0 ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionEyebrow index={nextIndex()} icon="map">
                {t(locale, "workOurProcess")}
              </SectionEyebrow>
            </Reveal>
            <Reveal className="mt-10">
              <ProcessCards steps={processSteps} />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* 05 — Results                                                 */}
      {/* ============================================================ */}
      {project.metrics.length > 0 || resultsText ? (
        <section className="border-t border-white/5 py-14 md:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionEyebrow index={nextIndex()} icon="trendingup">
                {t(locale, "workResults")}
              </SectionEyebrow>
              <h2 className="mt-5 max-w-3xl font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl">
                {t(locale, "workNumbersThat")}{" "}
                <em className="text-primary">{t(locale, "workMoved")}</em>
              </h2>
              {resultsText ? (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
                  {resultsText}
                </p>
              ) : null}
            </Reveal>
            {resolvedMetrics.length > 0 ? (
              <Reveal className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {resolvedMetrics.map((metric, index) => (
                  <div
                    key={metric.label}
                    className="relative overflow-hidden rounded-card-lg border border-white/10 bg-card-dark p-6 sm:p-7"
                  >
                    <span
                      className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary"
                      aria-hidden="true"
                    >
                      <ProcessIcon
                        name={METRIC_ICONS[index % METRIC_ICONS.length]}
                        className="size-4"
                      />
                    </span>
                    <div className="pr-10 font-display text-3xl font-black tracking-tight text-primary md:text-4xl">
                      {metric.value}
                    </div>
                    <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* 06 — Brand in action — gallery grid                          */}
      {/* ============================================================ */}
      {gallery.length > 0 || deliverables.length > 0 ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionEyebrow index={nextIndex()} icon="image">
                {t(locale, "workBrandInAction")}
              </SectionEyebrow>
              <h2 className="mt-5 max-w-3xl font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl">
                {t(locale, "workBrandInUse")}
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {gallery.map((url, index) => (
                <Reveal key={url} className={cn(gallery.length % 2 === 1 && index === 0 && "md:col-span-2")}>
                  <figure className="group relative overflow-hidden rounded-card-lg border border-white/10 bg-card-dark">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={url}
                        alt={`${wordmark} — ${galleryCaption(index)}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-[1.02]"
                      />
                    </div>
                    <figcaption className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-primary">
                        {galleryCaption(index)}
                      </span>
                      <span className="font-display text-xs font-black text-primary/50">
                        {String(index + 1).padStart(2, "0")}
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
      {/* 07 — Client perspective                                      */}
      {/* ============================================================ */}
      {project.testimonial ? (
        <section className="border-t border-white/5 py-14 md:py-20">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionEyebrow index={nextIndex()} icon="quote">
                {t(locale, "workClientPerspective")}
              </SectionEyebrow>
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
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10"
                  aria-hidden="true"
                >
                  <ProcessIcon name="sparkles" className="size-4" />
                </span>
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
                  <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10"
                      aria-hidden="true"
                    >
                      <ProcessIcon name="rocket" className="size-4" />
                    </span>
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
                      className="inline-flex h-[52px] select-none items-center justify-center gap-2 whitespace-nowrap rounded-button border border-transparent bg-primary px-6 text-base font-medium text-text-inverse shadow-amber transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-hover focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 active:translate-y-0 active:border-primary/60 active:bg-primary-active"
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
                    label={categoryLabel}
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
