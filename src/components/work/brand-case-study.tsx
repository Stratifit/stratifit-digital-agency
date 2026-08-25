import Image from "next/image";
import Link from "next/link";
import type {
  PublicPortfolioBrandSystem,
  PublicPortfolioDetail,
  PublicPortfolioLaunch,
  PublicPortfolioProject,
  PublicPortfolioStrategy,
} from "@/features/portfolio/queries";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t, tWithValue } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";
import { RelatedProjects } from "@/components/work/related-projects";
import { BrandBoard } from "@/components/work/brand-board";
import { ProcessCards, type ProcessStep } from "@/components/work/process-cards";
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
 * Vertical amber phase rail — the "DISCOVERY → LAUNCH" timeline from the
 * Figma mock. Rendered beside the rollout cards on desktop; the breadcrumb
 * row inside ProcessCards covers the same phases on small screens.
 */
function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol aria-label="Process timeline" className="relative hidden lg:block">
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-[4px] top-2 w-px bg-primary/30"
      />
      {steps.map((step, index) => (
        <li
          key={step.step_key}
          className="relative flex items-center gap-4 pb-10 last:pb-0"
        >
          <span
            aria-hidden="true"
            className="relative z-10 size-2.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_4px_rgba(245,158,11,0.15)]"
          />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
            {String(index + 1).padStart(2, "0")} — {step.title}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Brand lockup + section headings (Figma rollout mock)                */
/* ------------------------------------------------------------------ */

/** Client brand green used in the CLENQO case-study artwork. */
const BRAND_GREEN = "#22C55E";

/**
 * Circular monogram — the client's mark from the rollout mock: a green ring
 * holding the brand letter, closed by a gold check.
 */
function HeroMonogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <circle
        cx="60"
        cy="60"
        r="52"
        fill="none"
        stroke={BRAND_GREEN}
        strokeWidth="5"
      />
      <circle
        cx="60"
        cy="60"
        r="38"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1.5"
      />
      <text
        x="60"
        y="62"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Satoshi, Inter, system-ui, sans-serif"
        fontWeight={700}
        fontSize={54}
        fill={BRAND_GREEN}
      >
        Q
      </text>
      <path
        d="M 72 76 l 7.5 7.5 l 17 -19"
        stroke="#F59E0B"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Wordmark lockup — the brand name in the client green with a small gold
 * check drawn inside the Q (the check that closes the mark).
 */
function BrandWordmark({ name }: { name: string }) {
  return (
    <span className="inline-flex items-baseline">
      {name.split("").map((ch, index) =>
        ch.toLowerCase() === "q" ? (
          <span key={index} className="relative inline-block">
            {ch}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F59E0B"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="absolute left-1/2 top-[42%] size-[0.34em] -translate-x-1/2 -translate-y-1/2"
            >
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
        ) : (
          <span key={index}>{ch}</span>
        )
      )}
    </span>
  );
}

/**
 * Section heading — the small-caps kicker from the rollout mock with the
 * second word accented amber (e.g. "PROJECT OVERVIEW", "OUR PROCESS").
 */
function SectionHeading({ a, b }: { a: string; b: string }) {
  return (
    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-text-primary sm:text-base">
      {a} <span className="text-primary">{b}</span>
    </h2>
  );
}

/**
 * Two-tone label — first word in white, the rest accented amber (or inverted
 * for the Messaging Direction heading), matching the phase document headings.
 */
function TwoTone({ label, invert }: { label: string; invert?: boolean }) {
  const parts = label.split(" ");
  const first = parts[0];
  const rest = parts.slice(1).join(" ");
  if (!rest) return <>{first}</>;
  if (invert) {
    return (
      <>
        <span className="text-primary">{first}</span> {rest}
      </>
    );
  }
  return (
    <>
      {first} <span className="text-primary">{rest}</span>
    </>
  );
}

/**
 * Physical-touchpoint preview — the dark card with an uppercase label bar and
 * the generated business-card mockup inside (used for the touchpoint slots of
 * the rollout document).
 */
function TouchpointCard({
  label,
  wordmark,
}: {
  label: string;
  wordmark: string;
}) {
  return (
    <figure>
      <div className="overflow-hidden rounded-card-lg border border-white/10 bg-card-dark">
        <div className="border-b border-white/10 px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
            {label}
          </p>
        </div>
        <div className="relative aspect-[4/3] sm:aspect-[16/9]">
          <BrandBoard
            variant="businesscard"
            wordmark={wordmark}
            className="absolute inset-0"
          />
        </div>
      </div>
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

  // Project overview — the context paragraph above the "before" visual.
  const overviewBody = challenge || brandStory || projectSummary;

  // Discovery & Strategy phase document (per-project, per-locale).
  const strategy = project.strategy_translations ?? null;
  const strategyValue = (field: keyof PublicPortfolioStrategy): string => {
    const entry = strategy?.[locale] ?? strategy?.en;
    const value = entry?.[field];
    return typeof value === "string" ? value : "";
  };
  const strategySubtitle = strategyValue("subtitle");
  const strategyTagline = strategyValue("tagline");
  const strategyHeadline = strategyValue("headline");
  const strategyAudience = strategyValue("audience");
  const strategyChallenges = strategyValue("challenges");
  const strategyPositioning = strategyValue("positioning");
  const strategyMessaging = strategyValue("messaging");
  const strategyIdentity = strategyValue("identity");
  const hasStrategySection = Boolean(
    strategySubtitle ||
      strategyHeadline ||
      strategyAudience ||
      strategyChallenges ||
      strategyPositioning ||
      strategyMessaging ||
      strategyIdentity
  );

  // Brand tagline — the rollout mock shows it under the wordmark and on the
  // green banner; falls back to the project summary when not authored.
  const heroTagline = strategyTagline || projectSummary;

  // Identity & Assets phase document (per-project, per-locale).
  const brandSystem = project.brand_system_translations ?? null;
  const brandSystemValue = (
    field: keyof PublicPortfolioBrandSystem
  ): string => {
    const entry = brandSystem?.[locale] ?? brandSystem?.en;
    const value = entry?.[field];
    return typeof value === "string" ? value : "";
  };
  const typeface = brandSystemValue("typeface");
  const typefaceDescription = brandSystemValue("typeface_description");
  const identityAssets = brandSystemValue("identity_assets");
  const visualApplications = brandSystemValue("visual_applications");
  const subFonts =
    brandSystem?.[locale]?.sub_fonts ?? brandSystem?.en?.sub_fonts ?? [];
  const hasBrandSystemSection = Boolean(
    typeface ||
      typefaceDescription ||
      subFonts.length > 0 ||
      identityAssets ||
      visualApplications
  );

  // Launch & Activation phase document (per-project, per-locale).
  const launch = project.launch_translations ?? null;
  const launchValue = (field: keyof PublicPortfolioLaunch): string => {
    const entry = launch?.[locale] ?? launch?.en;
    const value = entry?.[field];
    return typeof value === "string" ? value : "";
  };
  const launchHeadline = launchValue("headline");
  const launchIntro = launchValue("intro");
  const launchPhysical = launchValue("physical");
  const launchGuidelines = launchValue("guidelines");
  const hasLaunchSection = Boolean(
    launchHeadline || launchIntro || launchPhysical || launchGuidelines
  );

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
      {/* Cover — brand lockup (monogram + wordmark) + metadata         */}
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
            <div className="flex flex-col items-center pb-12 pt-14 text-center md:pb-16 md:pt-20">
              <HeroMonogram className="size-28 md:size-40" />
              <h1
                className="mt-6 font-display text-5xl font-black leading-none tracking-tight sm:text-6xl md:text-7xl"
                style={{ color: BRAND_GREEN }}
              >
                <BrandWordmark name={wordmark} />
              </h1>
              {heroTagline ? (
                <p className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
                  {heroTagline}
                </p>
              ) : null}
              <span className="mt-7 inline-flex shrink-0 items-center rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-inverse">
                {categoryLabel}
              </span>
            </div>
          </Reveal>

          {metaItems.length > 0 ? (
            <Reveal className="pb-12 md:pb-16">
              <dl className="grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-card-lg border border-white/10 bg-card-dark">
                {metaItems.map((item) => (
                  <div key={item.label} className="px-4 py-5 sm:px-6 sm:py-6">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[10px]">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 truncate text-xs font-semibold leading-snug text-text-primary sm:text-sm">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Project overview — context + the previous identity            */}
      {/* ============================================================ */}
      {overviewBody || projectSummary ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                a={t(locale, "workOverviewA")}
                b={t(locale, "workOverviewB")}
              />
              {overviewBody ? (
                <p className="mt-5 max-w-2xl border-l-2 border-primary pl-4 text-base leading-relaxed text-text-primary sm:pl-6 md:text-lg">
                  {overviewBody}
                </p>
              ) : null}
            </Reveal>
            <Reveal className="mt-10">
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-card-lg border border-white/10 bg-card-dark">
                  <BrandBoard
                    variant="before"
                    wordmark={wordmark}
                    tagline={heroTagline || undefined}
                    className="absolute inset-0"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full border border-primary/50 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
                    {t(locale, "workBefore")}
                  </span>
                </div>
              </figure>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* Our process — timeline rail + rollout card grid              */}
      {/* ============================================================ */}
      {processSteps.length > 0 ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                a={t(locale, "workProcessA")}
                b={t(locale, "workProcessB")}
              />
              <p className="mt-5 max-w-2xl border-l-2 border-primary pl-4 text-base leading-relaxed text-text-primary sm:pl-6 md:text-lg">
                {t(locale, "workProcessIntro")}
              </p>
            </Reveal>
            <Reveal className="mt-10 grid gap-10 lg:grid-cols-[190px_1fr] lg:gap-14">
              <ProcessTimeline steps={processSteps} />
              <ProcessCards steps={processSteps} />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* Discovery & Strategy — phase document                       */}
      {/* ============================================================ */}
      {hasStrategySection ? (
        <section className="border-t border-white/5 py-14 md:py-20">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="relative pl-8 sm:pl-12">
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-primary/50 via-primary/25 to-transparent"
              />

              {/* Phase 01 — Discovery */}
              <Reveal>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                  {t(locale, "workPhaseDiscovery")}
                </p>
                <h2 className="mt-3 font-display text-4xl font-black leading-none tracking-tight text-text-primary sm:text-5xl">
                  {clientName}
                </h2>
                {strategySubtitle ? (
                  <p className="mt-5 max-w-2xl border-l-2 border-primary pl-4 text-base leading-relaxed text-text-secondary sm:pl-6">
                    {strategySubtitle}
                  </p>
                ) : null}
              </Reveal>

              {strategySubtitle || strategyTagline ? (
                <Reveal className="mt-10">
                  <figure>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-card-lg border border-white/10 bg-card-dark sm:aspect-[16/7]">
                      <BrandBoard
                        variant="before"
                        wordmark={clientName}
                        tagline={strategyTagline || undefined}
                        className="absolute inset-0"
                      />
                    </div>
                  </figure>
                </Reveal>
              ) : null}

              {strategyAudience ? (
                <Reveal className="mt-12">
                  <h3 className="font-display text-xl font-black tracking-tight text-text-primary sm:text-2xl">
                    <TwoTone label={t(locale, "workAudienceInsights")} />
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
                    {strategyAudience}
                  </p>
                </Reveal>
              ) : null}

              {strategyChallenges ? (
                <Reveal className="mt-10">
                  <h3 className="font-display text-xl font-black tracking-tight text-text-primary sm:text-2xl">
                    <TwoTone label={t(locale, "workBrandChallenges")} />
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
                    {strategyChallenges}
                  </p>
                </Reveal>
              ) : null}

              {/* Phase 02 — Strategy */}
              <Reveal className="mt-14">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                  {t(locale, "workPhaseStrategy")}
                </p>
                {strategyHeadline ? (
                  <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl">
                    {strategyHeadline}
                  </h2>
                ) : null}
              </Reveal>

              {strategyPositioning ? (
                <Reveal className="mt-12">
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-text-primary sm:text-2xl">
                    <TwoTone label={t(locale, "workBrandPositioning")} />
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
                    {strategyPositioning}
                  </p>
                </Reveal>
              ) : null}

              {strategyMessaging ? (
                <Reveal className="mt-10">
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-text-primary sm:text-2xl">
                    <TwoTone
                      label={t(locale, "workMessagingDirection")}
                      invert
                    />
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
                    {strategyMessaging}
                  </p>
                </Reveal>
              ) : null}

              {strategyIdentity ? (
                <Reveal className="mt-10">
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-text-primary sm:text-2xl">
                    {t(locale, "workIdentityDirection")}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
                    {strategyIdentity}
                  </p>
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* Identity & Assets — typography, touchpoint, applications     */}
      {/* ============================================================ */}
      {hasBrandSystemSection ? (
        <section className="border-t border-white/5 py-14 md:py-20">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Typography */}
            {typeface || typefaceDescription || subFonts.length > 0 ? (
              <Reveal>
                <div className="rounded-card-lg border border-white/10 bg-card-dark p-6 sm:p-8">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-text-primary">
                    {t(locale, "workTypography")}
                  </p>
                  <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end">
                    <span
                      className="font-display text-7xl font-black leading-none text-primary sm:text-8xl"
                      aria-hidden="true"
                    >
                      Aa
                    </span>
                    <div>
                      {typeface ? (
                        <h3 className="font-display text-xl font-black tracking-tight text-text-primary sm:text-2xl">
                          {typeface}
                        </h3>
                      ) : null}
                      {typefaceDescription ? (
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
                          {typefaceDescription}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {subFonts.length > 0 ? (
                    <ul className="mt-8 space-y-5 border-t border-white/10 pt-6">
                      {subFonts.map((font, index) => (
                        <li key={index} className="flex items-start gap-4">
                          <span
                            className="font-display text-2xl font-black leading-none text-text-primary"
                            aria-hidden="true"
                          >
                            Aa
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-text-primary">
                              {font.name}
                            </div>
                            {font.usage ? (
                              <div className="mt-1 whitespace-pre-line text-xs leading-relaxed text-text-muted">
                                {font.usage}
                              </div>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Reveal>
            ) : null}

            {/* Identity assets */}
            {identityAssets ? (
              <>
                <Reveal className="mt-14">
                  <h3 className="font-display text-xl font-black tracking-tight text-text-primary sm:text-2xl">
                    {t(locale, "workIdentityAssets")}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
                    {identityAssets}
                  </p>
                </Reveal>
                <Reveal className="mt-8">
                  <TouchpointCard
                    label={t(locale, "workPhysicalTouchpoint")}
                    wordmark={clientName}
                  />
                </Reveal>
              </>
            ) : null}

            {/* Visual applications */}
            {visualApplications ? (
              <>
                <Reveal className="mt-14">
                  <h3 className="font-display text-xl font-black tracking-tight text-text-primary sm:text-2xl">
                    {t(locale, "workVisualApplications")}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
                    {visualApplications}
                  </p>
                </Reveal>
                <Reveal className="mt-8">
                  <figure>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-card-lg border border-white/10 bg-card-dark sm:aspect-[16/9]">
                      <BrandBoard
                        variant="applications"
                        wordmark={clientName}
                        className="absolute inset-0"
                      />
                    </div>
                  </figure>
                </Reveal>
              </>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* Launch & Activation — rollout, touchpoints, guidelines      */}
      {/* ============================================================ */}
      {hasLaunchSection ? (
        <section className="border-t border-white/5 py-14 md:py-20">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                {t(locale, "workPhaseLaunch")}
              </p>
              {launchHeadline ? (
                <h2 className="mt-3 whitespace-pre-line font-display text-3xl font-black uppercase leading-[1.05] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
                  {launchHeadline}
                </h2>
              ) : null}
              {launchIntro ? (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted">
                  {launchIntro}
                </p>
              ) : null}
            </Reveal>

            {launchIntro ? (
              <Reveal className="mt-8">
                <TouchpointCard
                  label={t(locale, "workPhysicalTouchpoint")}
                  wordmark={clientName}
                />
              </Reveal>
            ) : null}

            {launchPhysical ? (
              <>
                <Reveal className="mt-14">
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-text-primary sm:text-2xl">
                    {t(locale, "workPhysicalTouchpoints")}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
                    {launchPhysical}
                  </p>
                </Reveal>
                <Reveal className="mt-8">
                  <TouchpointCard
                    label={t(locale, "workPhysicalTouchpoint")}
                    wordmark={clientName}
                  />
                </Reveal>
              </>
            ) : null}

            {launchGuidelines ? (
              <>
                <Reveal className="mt-14">
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-text-primary sm:text-2xl">
                    {t(locale, "workBrandGuidelines")}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
                    {launchGuidelines}
                  </p>
                </Reveal>
                <Reveal className="mt-8">
                  <TouchpointCard
                    label={t(locale, "workPhysicalTouchpoint")}
                    wordmark={clientName}
                  />
                </Reveal>
              </>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* Impact & Results — 2x2 metric grid                          */}
      {/* ============================================================ */}
      {project.metrics.length > 0 || resultsText ? (
        <section className="border-t border-white/5 py-14 md:py-20">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                {t(locale, "workImpactResults")}
              </h2>
              {resultsText ? (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
                  {resultsText}
                </p>
              ) : null}
            </Reveal>
            {resolvedMetrics.length > 0 ? (
              <Reveal className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {resolvedMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-card-lg border border-white/10 bg-card-dark px-6 py-10 text-center sm:py-12"
                  >
                    <div className="font-display text-4xl font-black tracking-tight text-primary md:text-5xl">
                      {metric.value}
                    </div>
                    <div className="mx-auto mt-3 max-w-[220px] text-[10px] font-bold uppercase leading-relaxed tracking-[0.2em] text-text-secondary">
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

    </>
  );
}
