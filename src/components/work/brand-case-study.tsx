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

/** Droplet with a check — the brand identity mark used in the hero label. */
function DropletCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("text-primary", className)}
    >
      <path d="M12 3c3.4 4.1 6 7.1 6 10a6 6 0 1 1-12 0c0-2.9 2.6-5.9 6-10Z" />
      <path d="m9 12.4 2 2 4-4" />
    </svg>
  );
}

/**
 * Brand-style numbered section label — "01 — Challenge".
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
 * used as the "plain logo" wherever a dedicated image is absent.
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

/**
 * A storying card: a "logo" image (or wordmark) shown plain and centered with a
 * labelled corner badge (Before / New Identity / Concept). Images are always
 * object-contain so the logo is never cropped.
 */
function StoryLogoCard({
  imageUrl,
  badge,
  imageAlt,
  wordmark,
  className,
  light,
}: {
  imageUrl: string | null;
  badge: string;
  imageAlt: string;
  wordmark: string;
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card-lg border p-6 sm:p-8",
        light
          ? "border-white/10 bg-white/[0.04]"
          : "border-white/10 bg-card-dark",
        className
      )}
    >
      <span className="absolute right-4 top-4 z-10 rounded bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-text-inverse">
        {badge}
      </span>
      {imageUrl ? (
        <div className="flex h-64 items-center justify-center overflow-hidden rounded-card bg-surface-soft sm:h-72">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={1200}
            height={900}
            loading="lazy"
            className="h-full w-full object-contain p-6"
          />
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-card bg-surface-soft sm:h-72">
          <Wordmark name={wordmark} className="text-4xl sm:text-5xl" />
        </div>
      )}
    </div>
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
  const conceptText = brandStory || solution;

  const launchYear = project.year
    ? String(project.year)
    : project.published_at
      ? new Date(project.published_at).getFullYear().toString()
      : "";

  const wordmark = project.client_name || projectTitle || "Brand";

  const facts: FactStripItem[] = [
    { label: t(locale, "workClient"), value: project.client_name || wordmark },
    {
      label: t(locale, "workIndustry"),
      value: serviceTitle || t(locale, "workBrandIdentity"),
    },
    ...(launchYear
      ? [{ label: t(locale, "workYear"), value: launchYear }]
      : []),
  ];

  const gallery = project.gallery_urls;
  const challengeImage = gallery[0] ?? null;
  const solutionImage = gallery[1] ?? null;
  const conceptImage = gallery[2] ?? null;
  // The Brand in Use box shows 4 sub-cards — use the remaining gallery images
  // and cycle so every card always has a real brand image.
  const brandImages = gallery.length
    ? Array.from({ length: 4 }, (_, i) => gallery[(3 + i) % gallery.length])
    : [null, null, null, null];
  const brandCaptions = Array.from(
    { length: 4 },
    (_, i) =>
      deliverables[i] ??
      `${t(locale, "workApplications")} ${String(i + 1).padStart(2, "0")}`
  );

  return (
    <>
      {/* 01 — Hero: brand label + icon */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[320px] overflow-hidden"
        >
          <div className="absolute left-1/2 top-0 h-[320px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[130px]" />
        </div>

        {/* Brand label + icon, plain — icon on top, label beneath */}
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6">
          <Reveal immediate>
            <div className="inline-flex flex-col items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-6">
              <DropletCheckIcon className="size-7" />
              <span className="text-sm font-semibold tracking-tight text-text-primary">
                {wordmark}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
                {serviceTitle || t(locale, "workBrandIdentity")}
              </span>
            </div>
          </Reveal>
        </div>

        {/* Divider — Brand Design left, Case Study · 2026 right */}
        <Reveal immediate className="relative mt-8">
          <div className="border-y border-white/10">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
              <span className="font-display text-base font-bold tracking-tight text-primary sm:text-lg">
                {serviceTitle || t(locale, "workBrandIdentity")}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-text-secondary">
                {t(locale, "workCaseStudy")}
                {launchYear ? ` · ${launchYear}` : ""}
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Title + description */}
      <section className="py-10 md:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h1 className="max-w-4xl font-display text-5xl font-black leading-[0.98] tracking-tight text-text-primary sm:text-6xl md:text-7xl">
              {projectTitle || wordmark}
            </h1>
            {projectSummary ? (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
                {projectSummary}
              </p>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* Meta row — Client · Industry · Year */}
      <section className="pb-10 md:pb-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <Reveal className="grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-card border border-white/10 bg-card-dark">
            {facts.map((fact) => (
              <div key={fact.label} className="px-4 py-5 text-center sm:px-6">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
                  {fact.label}
                </div>
                <div className="mt-1.5 text-sm font-semibold text-text-primary sm:text-base">
                  {fact.value}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* 01 — Challenge (old logo + description) */}
      {challenge || challengeImage ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <Reveal>
                <NumberedLabel index={1}>{t(locale, "workChallenge")}</NumberedLabel>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl">
                  {t(locale, "workTheProblem")}
                </h2>
                {challenge ? (
                  <p className="mt-6 text-base leading-relaxed text-text-secondary md:text-lg">
                    {challenge}
                  </p>
                ) : null}
              </Reveal>
              <Reveal>
                <StoryLogoCard
                  imageUrl={challengeImage}
                  badge={t(locale, "workBefore")}
                  imageAlt={`${wordmark} ${t(locale, "workBefore")}`}
                  wordmark={wordmark}
                  light
                />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* 02 — Our Solution (new identity) */}
      {solution || solutionImage ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <Reveal>
                <NumberedLabel index={2}>{t(locale, "workSolution")}</NumberedLabel>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl">
                  {t(locale, "workWhatWeDid")}
                </h2>
                {solution ? (
                  <p className="mt-6 text-base leading-relaxed text-text-secondary md:text-lg">
                    {solution}
                  </p>
                ) : null}
              </Reveal>
              <Reveal>
                <StoryLogoCard
                  imageUrl={solutionImage}
                  badge={t(locale, "workNewIdentity")}
                  imageAlt={`${wordmark} ${t(locale, "workNewIdentity")}`}
                  wordmark={wordmark}
                />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* 03 — The Concept (why this mark) */}
      {conceptText || conceptImage ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <Reveal>
                <NumberedLabel index={3}>{t(locale, "workConcept")}</NumberedLabel>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl">
                  {t(locale, "workWhyThisMark")}
                </h2>
                {conceptText ? (
                  <p className="mt-6 text-base leading-relaxed text-text-secondary md:text-lg">
                    {conceptText}
                  </p>
                ) : null}
              </Reveal>
              <Reveal>
                <StoryLogoCard
                  imageUrl={conceptImage}
                  badge={t(locale, "workConcept")}
                  imageAlt={`${wordmark} ${t(locale, "workMark")}`}
                  wordmark={wordmark}
                />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* 04 — Our Process (Discovery → Strategy → Build → Launch & Grow) */}
      {steps.length > 0 ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <Reveal>
              <NumberedLabel index={4}>{t(locale, "workOurProcess")}</NumberedLabel>
              <h2 className="max-w-4xl font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl">
                {steps.map((step, index) => (
                  <span key={step.step_key}>
                    {index > 0 ? (
                      <span className="text-primary/50"> → </span>
                    ) : null}
                    <span>{resolveTranslation(step.title_translations, locale)}</span>
                  </span>
                ))}
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <Reveal key={step.step_key} className="h-full">
                  <div className="flex h-full flex-col rounded-card border border-white/10 bg-card-dark p-6 transition-colors duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/30">
                    {/* Small plain logo */}
                    <div className="flex h-14 items-center justify-center rounded-card border border-white/5 bg-surface-soft">
                      <Wordmark name={wordmark} className="text-lg" />
                    </div>
                    <div className="mt-5 flex items-center gap-2.5">
                      <span className="font-display text-xs font-black leading-none text-primary/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <ProcessIcon
                        name={step.icon_name}
                        className="size-5 shrink-0 text-primary"
                      />
                      <h3 className="font-display text-lg font-bold text-text-primary">
                        {resolveTranslation(step.title_translations, locale)}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {resolveTranslation(step.description_translations, locale)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* 05 — Results (Numbers That Moved) */}
      {project.metrics.length > 0 || resultsText ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <Reveal>
              <NumberedLabel index={5}>{t(locale, "workResults")}</NumberedLabel>
              <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl">
                {t(locale, "workNumbersThat")}{" "}
                <span className="text-primary">{t(locale, "workMoved")}</span>
              </h2>
            </Reveal>
            {project.metrics.length > 0 ? (
              <Reveal className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {project.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="rounded-card border border-white/10 bg-card-dark p-6 text-center"
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
      ) : null}

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* 06 — The Brand in Use (one unified box, 4 sub-sections) */}
      {gallery.length > 0 || deliverables.length > 0 ? (
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

            <Reveal className="overflow-hidden rounded-card-lg border border-white/10 bg-card-dark">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                {brandImages.map((url, index) => (
                  <div
                    key={index}
                    className={cn(
                      "group flex flex-col border-white/5",
                      index > 0 && "border-t sm:border-t-0",
                      index % 2 === 1 && "sm:border-l",
                      index > 1 && "lg:border-l-0",
                      index === 2 && "lg:border-l",
                      index > 2 && "lg:border-t"
                    )}
                  >
                    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-surface-soft">
                      {url ? (
                        <Image
                          src={url}
                          alt={`${wordmark} ${t(locale, "workBrandInUse")} ${index + 1}`}
                          width={1200}
                          height={900}
                          loading="lazy"
                          className="h-full w-full object-contain p-4 transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-105"
                        />
                      ) : (
                        <Wordmark name={wordmark} className="text-xl" />
                      )}
                    </div>
                    <div className="flex items-start gap-3 border-t border-white/5 px-5 py-4">
                      <span className="font-display text-xs font-black leading-none text-primary/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-text-primary">
                          {t(locale, "workBrandInUse")}{" "}
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        {brandCaptions[index] ? (
                          <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                            {brandCaptions[index]}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
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
