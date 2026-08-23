import Image from "next/image";
import type {
  PublicPortfolioDetail,
  PublicPortfolioProject,
} from "@/features/portfolio/queries";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t, tWithValue } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";
import { CtaCard } from "@/components/sections/cta-card";
import { Reveal } from "@/components/ui/reveal";
import { ProcessIcon } from "@/components/ui/process-icon";
import { RelatedProjects } from "@/components/work/related-projects";

interface BrandStep {
  step_key: string;
  icon_name: string | null;
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
}

/* ------------------------------------------------------------------ */
/* Small shared bits                                                   */
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

function initials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Brand-style numbered section label — "01 — The Concept" — used to tell the
 * logo story from concept to completion, step by step.
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

/**
 * The client wordmark set in display type with the first letter tinted amber —
 * a typographic stand-in for the logo lockup wherever a brand image is missing.
 */
function Wordmark({
  name,
  className,
  textClassName,
}: {
  name: string;
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("font-display font-black tracking-tight", className)}>
      <span className="text-primary">{name.charAt(0)}</span>
      <span className={cn("text-text-primary", textClassName)}>
        {name.slice(1)}
      </span>
    </span>
  );
}

interface FactStripItem {
  label: string;
  value: string;
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
  const concept = brandStory || solution;

  const launchYear = project.year
    ? String(project.year)
    : project.published_at
      ? new Date(project.published_at).getFullYear().toString()
      : "";

  const facts: FactStripItem[] = [
    { label: t(locale, "workClient"), value: project.client_name },
    ...(serviceTitle
      ? [{ label: t(locale, "workIndustry"), value: serviceTitle }]
      : []),
    ...(launchYear
      ? [{ label: t(locale, "workYear"), value: launchYear }]
      : []),
    ...(deliverables.length
      ? [
          {
            label: t(locale, "workServices"),
            value: deliverables.join(" · "),
          },
        ]
      : []),
  ];

  const galleryCount = project.gallery_urls.length;
  const heroImage = project.gallery_urls[0] ?? null;
  const markImage = project.gallery_urls[1] ?? null;

  return (
    <>
      {/* Hero — brand lockup presentation: statement left, primary lockup right */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden"
        >
          <div className="absolute left-1/2 top-0 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[140px]" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-14 pb-12 sm:px-6 md:pt-20 md:pb-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <Reveal immediate>
              <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="inline-block rounded bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-inverse">
                  {serviceTitle || t(locale, "workBrandIdentity")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">
                  {t(locale, "workCaseStudy")}
                  {launchYear ? ` · ${launchYear}` : ""}
                </span>
              </div>
              <h1 className="max-w-2xl font-display text-4xl font-black leading-[1.02] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                {projectTitle}
              </h1>
              {projectSummary ? (
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
                  {projectSummary}
                </p>
              ) : null}

              {/* Meta chips — client, year, deliverables count */}
              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-text-primary">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    {t(locale, "workClient")}
                  </span>
                  {project.client_name}
                </span>
                {launchYear ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-text-primary">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                      {t(locale, "workYear")}
                    </span>
                    {launchYear}
                  </span>
                ) : null}
                {deliverables.length ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-text-primary">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                      {t(locale, "workBrandIdentity")}
                    </span>
                    {deliverables.length}{" "}
                    {t(locale, "workApplications").toLowerCase()}
                  </span>
                ) : null}
              </div>
            </Reveal>

            {/* Primary lockup panel — the logo, never cropped */}
            <Reveal immediate>
              <div className="relative overflow-hidden rounded-card-lg border border-white/10 bg-card-dark p-6 sm:p-8">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 right-0 h-56 w-56 rounded-full bg-primary/10 blur-[100px]"
                />
                <div className="relative flex flex-col gap-5">
                  {heroImage ? (
                    <div className="flex h-64 items-center justify-center overflow-hidden rounded-card border border-white/5 bg-surface-soft sm:h-80">
                      <Image
                        src={heroImage}
                        alt={`${projectTitle} ${t(locale, "workMark")}`}
                        width={1200}
                        height={900}
                        priority
                        className="h-full w-full object-contain p-4"
                      />
                    </div>
                  ) : (
                    <div className="flex h-64 items-center justify-center rounded-card border border-white/5 bg-surface-soft sm:h-80">
                      <Wordmark
                        name={project.client_name || projectTitle}
                        className="text-6xl sm:text-7xl md:text-8xl"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
                        {t(locale, "workBrandIdentity")}
                      </div>
                      <Wordmark
                        name={project.client_name || projectTitle}
                        className="mt-1 text-2xl sm:text-3xl"
                      />
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl font-black text-primary/25">
                        {initials(project.client_name || projectTitle)}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
                        {t(locale, "workMark")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* Facts strip */}
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

      {/* 01 — The Concept: why this mark */}
      {concept ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
                <Reveal>
                  <NumberedLabel index={1}>{t(locale, "workConcept")}</NumberedLabel>
                  <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl">
                    {t(locale, "workWhyThisMark")}
                  </h2>
                  <p className="mt-6 text-base leading-relaxed text-text-secondary md:text-lg">
                    {concept}
                  </p>
                </Reveal>
                <Reveal>
                  <div className="relative overflow-hidden rounded-card-lg border border-white/10 bg-card-dark p-8 sm:p-10">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-primary/10 blur-[110px]"
                    />
                    <div className="relative text-center">
                      <Wordmark
                        name={project.client_name || projectTitle}
                        className="text-5xl tracking-tight sm:text-6xl md:text-7xl"
                      />
                      <div
                        aria-hidden="true"
                        className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                      />
                      {markImage ? (
                        <div className="mt-5 flex h-44 items-center justify-center overflow-hidden rounded-card border border-white/5 bg-surface-soft sm:h-52">
                          <Image
                            src={markImage}
                            alt={`${projectTitle} ${t(locale, "workMark")}`}
                            width={900}
                            height={700}
                            loading="lazy"
                            className="h-full w-full object-contain p-3"
                          />
                        </div>
                      ) : (
                        <div className="mt-5 flex h-32 items-center justify-center rounded-full border border-primary/20 bg-primary/5 sm:h-40 sm:w-40 sm:mx-auto">
                          <span className="font-display text-5xl font-black text-primary sm:text-6xl">
                            {initials(project.client_name || projectTitle)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
          <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* 02 — The Challenge */}
      {challenge ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <Reveal className="grid items-start gap-8 md:grid-cols-2 md:gap-14">
                <div>
                  <NumberedLabel index={2}>{t(locale, "workChallenge")}</NumberedLabel>
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

      {/* 03 — What We Did */}
      {solution ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <Reveal className="grid items-start gap-8 md:grid-cols-2 md:gap-14">
                <div>
                  <NumberedLabel index={3}>{t(locale, "workSolution")}</NumberedLabel>
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

      {/* 04 — Our Process: from sketch to symbol, start to finish */}
      {steps.length > 0 ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <Reveal>
                <NumberedLabel index={4}>{t(locale, "workOurProcess")}</NumberedLabel>
                <h2 className="mb-10 max-w-4xl font-display text-2xl font-black leading-tight tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                  {steps.map((step, index) => (
                    <span key={step.step_key}>
                      {index > 0 ? (
                        <span className="text-primary/60"> → </span>
                      ) : null}
                      <span>
                        {resolveTranslation(step.title_translations, locale)}
                      </span>
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
                        {resolveTranslation(
                          step.description_translations,
                          locale
                        )}
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

      {/* 05 — Results */}
      {project.metrics.length > 0 || resultsText ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <Reveal>
                <NumberedLabel index={5}>{t(locale, "workResults")}</NumberedLabel>
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

      {/* 06 — The Brand in Use: every upload, captioned with its application */}
      {galleryCount > 0 || deliverables.length > 0 ? (
        <>
          <section className="py-14 md:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <Reveal>
                <NumberedLabel index={6}>
                  {t(locale, "workBrandInUse")}
                </NumberedLabel>
                <h2 className="mb-10 font-display text-2xl font-black leading-tight tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                  {t(locale, "workBrandInUse")}
                </h2>
              </Reveal>
              {galleryCount > 0 ? (
                <Reveal className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  {project.gallery_urls.map((url, index) => {
                    const caption =
                      deliverables[index % Math.max(deliverables.length, 1)] ??
                      `${t(locale, "workApplications")} ${String(
                        index + 1
                      ).padStart(2, "0")}`;
                    return (
                      <div
                        key={index}
                        className={cn(
                          "group overflow-hidden rounded-card border border-white/5 bg-card-dark transition-colors duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/30",
                          index === 0 && "col-span-2"
                        )}
                      >
                        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-surface-soft">
                          <Image
                            src={url}
                            alt={`${projectTitle} ${t(
                              locale,
                              "workBrandInUse"
                            )} ${index + 1}`}
                            width={1200}
                            height={900}
                            loading="lazy"
                            className="h-full w-full object-contain p-3 transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-105"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-white/5 px-4 py-3">
                          <span className="font-display text-sm font-black leading-none text-primary/30">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                            {caption}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </Reveal>
              ) : (
                <Reveal className="flex flex-wrap gap-2.5">
                  {deliverables.map((deliverable, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-text-secondary"
                    >
                      <span className="font-display text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {deliverable}
                    </span>
                  ))}
                </Reveal>
              )}
            </div>
          </section>
          <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* Testimonial */}
      {project.testimonial ? (
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
      ) : null}

      {/* More work */}
      {relatedVisible.length > 0 ? (
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
