import { Fragment } from "react";
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
import { Reveal } from "@/components/ui/reveal";
import { RelatedProjects } from "@/components/work/related-projects";
import { BrandBoard } from "@/components/work/brand-board";
import { OverviewSlider } from "@/components/work/overview-slider";
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
 * Strategy block card — the phase-document detail blocks (Audience Insights,
 * Brand Challenges, Positioning, Messaging, Identity) styled as professional
 * cards matching the service-card anatomy: top hairline, circular icon chip,
 * display title, and description.
 */
function StrategyCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-card border border-card-border bg-card-dark p-6 shadow-xl sm:p-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <ProcessIcon name={icon} className="size-6 text-primary" />
        </div>
        <h3 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          {title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
        {children}
      </p>
    </div>
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

/** Normalize legacy all-caps editorial headings without changing normal casing. */
function normalizeHeading(text: string): string {
  const value = text.trim();
  if (!value || value === value.toLowerCase() || value !== value.toUpperCase()) {
    return value;
  }

  const sentence = value.toLocaleLowerCase();
  return `${sentence.charAt(0).toLocaleUpperCase()}${sentence.slice(1)}`;
}

/** Render a heading with its main phrase highlighted in the brand amber. */
function HeadingTone({ text }: { text: string }) {
  const lines = normalizeHeading(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      {lines.map((line, lineIndex) => {
        const words = line.split(/\s+/);
        const splitAt = words.length > 1 ? 1 : 0;
        return (
          <Fragment key={`${line}-${lineIndex}`}>
            {lineIndex > 0 ? <br /> : null}
            {splitAt > 0 ? `${words[0]} ` : null}
            <span className="text-primary">{words.slice(splitAt).join(" ")}</span>
          </Fragment>
        );
      })}
    </>
  );
}

/**
 * Section header — the homepage header anatomy: amber kicker, big two-tone
 * display title, and a description with the left amber accent bar.
 */
function SectionHeader({
  kicker,
  titleA,
  titleB,
  description,
  titleVariant = "accent",
  className,
}: {
  kicker?: string;
  titleA?: string;
  titleB?: string;
  description?: string;
  /** Title treatment: "accent" ambers the trailing phrase, "plain" renders
   * solid white as authored, "plainUppercase" is white capitals — for
   * headings that are client names rather than editorial copy. */
  titleVariant?: "accent" | "plain" | "plainUppercase";
  // Margin override — matches the homepage SectionHeader wrapper so the
  // case-study sections keep the same vertical rhythm as CMS sections.
  className?: string;
}) {
  return (
    <div className={className ? className : "mb-10 md:mb-16"}>
      {kicker ? (
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {kicker}
        </p>
      ) : null}
      {titleA ? (
        <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
          {titleB ? (
            <>
              {normalizeHeading(titleA)}{" "}
              <span className="text-primary">{normalizeHeading(titleB)}</span>
            </>
          ) : titleVariant === "plain" ? (
            <span>{titleA.trim()}</span>
          ) : titleVariant === "plainUppercase" ? (
            <span className="uppercase">{titleA.trim()}</span>
          ) : (
            <HeadingTone text={titleA} />
          )}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Two-tone label — first word in white, the rest accented amber (or inverted
 * for the Messaging Direction heading), matching the phase document headings.
 */
function TwoTone({ label, invert }: { label: string; invert?: boolean }) {
  const parts = normalizeHeading(label).split(" ");
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

/** Render a title or description with one keyword in brand amber while
 * everything else stays white, per the approved case-study styling. */
function HighlightWord({
  text,
  word,
}: {
  text: string;
  /** Keyword to highlight (whole-word, case-insensitive). When omitted the
   * full text renders plain white. */
  word?: string;
}) {
  const value = text.trim();
  if (!word) return <>{value}</>;
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = value.split(new RegExp(`(${escaped})`, "i"));
  return parts.map((part, i) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <span key={i} className="text-primary">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
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
  const paletteDescription =
    brandSystemValue("palette_description") ||
    "Introduce a refined palette built around clean neutrals and eco‑driven accents. The colors reinforce trust, clarity, and sustainability while improving contrast and accessibility across all touchpoints.";
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

  // Build phase document — the construction and palette content shown before
  // the typography section in the reference brand-guidelines layout.
  const buildSectionTitle = "Visual Identity System";
  const buildIntro = brandSystemValue("build_description");
  const buildHeadline = "Logo System";
  const buildDescription = brandStory || strategyIdentity || projectSummary;
  const hasBuildSection = Boolean(
    buildDescription || paletteDescription || buildHeadline
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

  // Keep the brand case-study presentation focused on four selected visuals.
  // The CMS may retain additional gallery assets for future use, but this
  // public section should never render more than the approved four.
  const gallery = project.gallery_urls.slice(0, 4);
  const galleryCaption = (index: number) =>
    deliverables[index % deliverables.length] ??
    `${t(locale, "workBrandInAction")} ${String(index + 1).padStart(2, "0")}`;

  // Project Overview slides — the previous identity first, then any gallery
  // images, so the panel acts as a slider when more than one is present.
  const overviewSlides = [
    <div key="overview-before" className="absolute inset-0">
      <BrandBoard
        variant="before"
        wordmark={wordmark}
        tagline={heroTagline || undefined}
        className="absolute inset-0"
      />
    </div>,
    ...gallery.map((url, index) => (
      <Image
        key={url}
        src={url}
        alt={`${wordmark} — ${galleryCaption(index)}`}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
    )),
  ];

  // Thumbnails for the overview slider — only gallery images (not the "before" slide).
  const overviewThumbnails = gallery.map((url, index) => (
    <Image
      key={`thumb-${url}`}
      src={url}
      alt={`${wordmark} — ${galleryCaption(index)}`}
      fill
      sizes="80px"
      className="object-cover"
    />
  ));

  const paletteSlides = [
    <BrandBoard
      key="palette-main"
      variant="palette"
      wordmark={clientName}
      className="absolute inset-0"
    />,
  ];

  const conceptSlides = [
    <BrandBoard
      key="concept-main"
      variant="concept"
      wordmark={clientName}
      className="absolute inset-0"
    />,
    ...gallery.map((url, index) => (
      <Image
        key={`concept-${url}`}
        src={url}
        alt={`${wordmark} — ${galleryCaption(index)}`}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
    )),
  ];

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

  return (
    <>
      {/* ============================================================ */}
      {/* Cover — brand lockup (monogram + wordmark) + metadata         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden border-b border-white/5 bg-black">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal immediate>
            <div className="flex flex-col items-center pb-12 pt-14 text-center md:pb-16 md:pt-20">
              <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-inverse">
                {categoryLabel}
              </span>
              <HeroMonogram className="mt-8 size-28 md:size-40" />
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
            </div>
          </Reveal>

          {metaItems.length > 0 ? (
            <Reveal className="pb-12 md:pb-16">
              <dl className="grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-card border border-white/10 bg-card-dark">
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
              <SectionHeader
                kicker={t(locale, "workCaseStudy")}
                titleA={t(locale, "workOverviewA")}
                titleB={t(locale, "workOverviewB")}
                description={overviewBody || undefined}
              />
            </Reveal>
            <Reveal>
              <figure>
                <OverviewSlider
                  slides={overviewSlides}
                  counterLabel={`${wordmark} — ${t(locale, "workOverviewA")} ${t(locale, "workOverviewB")}`}
                  thumbnails={overviewThumbnails}
                  thumbnailSlideOffset={1}
                  badge={t(locale, "workBefore")}
                />
              </figure>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* Our process — timeline rail + rollout card grid              */}
      {/* ============================================================ */}
      {processSteps.length > 0 ? (
        <section className="border-t border-white/5 py-14 md:py-20">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeader
                kicker={t(locale, "workProcessKicker")}
                titleA={t(locale, "workProcessA")}
                titleB={t(locale, "workProcessB")}
                description={t(locale, "workProcessIntro")}
              />
            </Reveal>
            <Reveal className="grid gap-10 lg:grid-cols-[190px_1fr] lg:gap-14">
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
            <div>

              {/* Phase 01 — Discovery */}
              <Reveal>
                <SectionHeader
                  kicker={t(locale, "workPhaseDiscovery")}
                  titleA={clientName}
                  titleVariant="plainUppercase"
                  description={strategySubtitle || undefined}
                />
              </Reveal>

              {strategySubtitle || strategyTagline ? (
                <Reveal className="mt-10">
                  <OverviewSlider
                    slides={[
                      <div key="discovery-before" className="absolute inset-0">
                        <BrandBoard
                          variant="before"
                          wordmark={clientName}
                          tagline={strategyTagline || undefined}
                          className="absolute inset-0"
                        />
                      </div>,
                      ...gallery.map((url, index) => (
                        <Image
                          key={`discovery-${url}`}
                          src={url}
                          alt={`${clientName} — ${galleryCaption(index)}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      )),
                    ]}
                    counterLabel={`${clientName} — ${t(locale, "workPhaseDiscovery")}`}
                    thumbnails={gallery.map((url, index) => (
                      <Image
                        key={`discovery-thumb-${url}`}
                        src={url}
                        alt={`${clientName} — ${galleryCaption(index)}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ))}
                    thumbnailSlideOffset={1}
                  />
                </Reveal>
              ) : null}

              {strategyAudience || strategyChallenges ? (
                <Reveal className="mt-12 grid gap-6 md:grid-cols-2">
                  {strategyAudience ? (
                    <StrategyCard
                      icon="user"
                      title={
                        <TwoTone label={t(locale, "workAudienceInsights")} />
                      }
                    >
                      {strategyAudience}
                    </StrategyCard>
                  ) : null}
                  {strategyChallenges ? (
                    <StrategyCard
                      icon="target"
                      title={
                        <TwoTone label={t(locale, "workBrandChallenges")} />
                      }
                    >
                      {strategyChallenges}
                    </StrategyCard>
                  ) : null}
                </Reveal>
              ) : null}

              {/* Divider marking the transition from Discovery to Strategy. */}
              <div aria-hidden="true" className="mt-14 border-t border-white/5" />

              {/* Phase 02 — Strategy */}
              <Reveal className="mt-14">
                <SectionHeader
                  kicker={t(locale, "workPhaseStrategy")}
                  titleA={strategyHeadline || undefined}
                  titleVariant="plain"
                  description={strategySubtitle || undefined}
                />
              </Reveal>

              {strategyPositioning || strategyMessaging ? (
                <Reveal className="mt-12 grid gap-6 md:grid-cols-2">
                  {strategyPositioning ? (
                    <StrategyCard
                      icon="chart"
                      title={
                        <TwoTone label={t(locale, "workBrandPositioning")} />
                      }
                    >
                      {strategyPositioning}
                    </StrategyCard>
                  ) : null}
                  {strategyMessaging ? (
                    <StrategyCard
                      icon="quote"
                      title={
                        <TwoTone
                          label={t(locale, "workMessagingDirection")}
                          invert
                        />
                      }
                    >
                      {strategyMessaging}
                    </StrategyCard>
                  ) : null}
                </Reveal>
              ) : null}

              {strategyIdentity ? (
                <Reveal className="mt-6">
                  <StrategyCard
                    icon="sparkles"
                    title={t(locale, "workIdentityDirection")}
                  >
                    {strategyIdentity}
                  </StrategyCard>
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* Build — logo system and colour palette                      */}
      {/* ============================================================ */}
      {hasBuildSection ? (
        <section className="border-t border-white/5 py-14 md:py-20">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeader
                kicker="BUILD"
                titleA={buildSectionTitle}
                titleVariant="plain"
                description={buildIntro || undefined}
              />
            </Reveal>
            <Reveal className="mt-8">
              <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                <HighlightWord text={buildHeadline} />
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6">
                {buildDescription}
              </p>
            </Reveal>
            <Reveal className="mt-10">
              <figure>
                <OverviewSlider
                  slides={conceptSlides}
                  counterLabel={`${wordmark} — ${t(locale, "workConcept")}`}
                  thumbnails={overviewThumbnails}
                  thumbnailSlideOffset={1}
                />
                <figcaption className="mt-3 flex items-center justify-between gap-4 px-1 text-xs text-text-muted">
                  <span>{t(locale, "workConceptCaption")}</span>
                  <span className="rounded-full border border-primary/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                    {t(locale, "workConcept")}
                  </span>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                <TwoTone label={t(locale, "workColourPalette")} />
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6">
                {paletteDescription}
              </p>
            </Reveal>
            <Reveal className="mt-8">
              <figure>
                <OverviewSlider
                  slides={paletteSlides}
                  counterLabel={`${wordmark} — ${t(locale, "workColourPalette")}`}
                />
              </figure>
            </Reveal>
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
              <>
                <Reveal>
                  <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                    <HighlightWord text={t(locale, "workTypography")} />
                  </h2>
                  {typefaceDescription ? (
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6">
                      {typefaceDescription}
                    </p>
                  ) : null}
                </Reveal>
                <Reveal className="mt-8">
                <div className="rounded-card border border-white/10 bg-card-dark p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
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
              </>
            ) : null}

            {/* Identity assets */}
            {identityAssets ? (
              <>
                <Reveal className="mt-14">
                  <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                    <HighlightWord text={t(locale, "workIdentityAssets")} />
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6">
                    {identityAssets}
                  </p>
                </Reveal>
                <Reveal className="mt-8">
                  <OverviewSlider
                    slides={[
                      <div key="touchpoint-main" className="absolute inset-0">
                        <BrandBoard
                          variant="businesscard"
                          wordmark={clientName}
                          className="absolute inset-0"
                        />
                      </div>,
                      ...gallery.map((url, index) => (
                        <Image
                          key={`touchpoint-${url}`}
                          src={url}
                          alt={`${clientName} — ${galleryCaption(index)}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      )),
                    ]}
                    counterLabel={`${clientName} — ${t(locale, "workPhysicalTouchpoint")}`}
                    thumbnails={gallery.map((url, index) => (
                      <Image
                        key={`touchpoint-thumb-${url}`}
                        src={url}
                        alt={`${clientName} — ${galleryCaption(index)}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ))}
                    thumbnailSlideOffset={1}
                  />
                </Reveal>
              </>
            ) : null}

            {/* Visual applications */}
            {visualApplications ? (
              <>
                <Reveal className="mt-14">
                  <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                    <HighlightWord text={t(locale, "workVisualApplications")} />
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6">
                    {visualApplications}
                  </p>
                </Reveal>
                <Reveal className="mt-8">
                  <OverviewSlider
                    slides={[
                      <div key="applications-main" className="absolute inset-0">
                        <BrandBoard
                          variant="applications"
                          wordmark={clientName}
                          className="absolute inset-0"
                        />
                      </div>,
                      ...gallery.map((url, index) => (
                        <Image
                          key={`applications-${url}`}
                          src={url}
                          alt={`${clientName} — ${galleryCaption(index)}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      )),
                    ]}
                    counterLabel={`${clientName} — ${t(locale, "workVisualApplications")}`}
                    thumbnails={gallery.map((url, index) => (
                      <Image
                        key={`applications-thumb-${url}`}
                        src={url}
                        alt={`${clientName} — ${galleryCaption(index)}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ))}
                    thumbnailSlideOffset={1}
                  />
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
              <SectionHeader
                kicker={t(locale, "workPhaseLaunch")}
                titleA={launchHeadline || undefined}
                titleVariant="plain"
              />
            </Reveal>

            {launchIntro ? (
              <>
                <Reveal className="mt-14">
                  <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                    <HighlightWord
                      text={t(locale, "workDigitalPresence")}
                      word={t(locale, "workDigitalPresence").split(/\s+/)[0]}
                    />
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6">
                    {launchIntro}
                  </p>
                </Reveal>
                <Reveal className="mt-8">
                <OverviewSlider
                  slides={[
                    <div key="launch-intro-main" className="absolute inset-0">
                      <BrandBoard
                        variant="businesscard"
                        wordmark={clientName}
                        className="absolute inset-0"
                      />
                    </div>,
                    ...gallery.map((url, index) => (
                      <Image
                        key={`launch-intro-${url}`}
                        src={url}
                        alt={`${clientName} — ${galleryCaption(index)}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    )),
                  ]}
                  counterLabel={`${clientName} — ${t(locale, "workPhysicalTouchpoint")}`}
                  thumbnails={gallery.map((url, index) => (
                    <Image
                      key={`launch-intro-thumb-${url}`}
                      src={url}
                      alt={`${clientName} — ${galleryCaption(index)}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ))}
                  thumbnailSlideOffset={1}
                />
              </Reveal>
              </>
            ) : null}

            {launchPhysical ? (
              <>
                <Reveal className="mt-14">
                  <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                    <HighlightWord text={t(locale, "workPhysicalTouchpoints")} />
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6">
                    <HighlightWord
                      text={launchPhysical}
                      word={t(locale, "workPhysicalHighlight")}
                    />
                  </p>
                </Reveal>
                <Reveal className="mt-8">
                  <OverviewSlider
                    slides={[
                      <div key="launch-physical-main" className="absolute inset-0">
                        <BrandBoard
                          variant="businesscard"
                          wordmark={clientName}
                          className="absolute inset-0"
                        />
                      </div>,
                      ...gallery.map((url, index) => (
                        <Image
                          key={`launch-physical-${url}`}
                          src={url}
                          alt={`${clientName} — ${galleryCaption(index)}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      )),
                    ]}
                    counterLabel={`${clientName} — ${t(locale, "workPhysicalTouchpoints")}`}
                    thumbnails={gallery.map((url, index) => (
                      <Image
                        key={`launch-physical-thumb-${url}`}
                        src={url}
                        alt={`${clientName} — ${galleryCaption(index)}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ))}
                    thumbnailSlideOffset={1}
                  />
                </Reveal>
              </>
            ) : null}

            {launchGuidelines ? (
              <>
                <Reveal className="mt-14">
                  <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                    <HighlightWord
                      text={t(locale, "workBrandGuidelines")}
                      word={t(locale, "workBrandGuidelines").split(/\s+/)[1]}
                    />
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6">
                    {launchGuidelines}
                  </p>
                </Reveal>
                <Reveal className="mt-8">
                  <OverviewSlider
                    slides={[
                      <div key="launch-guidelines-main" className="absolute inset-0">
                        <BrandBoard
                          variant="businesscard"
                          wordmark={clientName}
                          className="absolute inset-0"
                        />
                      </div>,
                      ...gallery.map((url, index) => (
                        <Image
                          key={`launch-guidelines-${url}`}
                          src={url}
                          alt={`${clientName} — ${galleryCaption(index)}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      )),
                    ]}
                    counterLabel={`${clientName} — ${t(locale, "workBrandGuidelines")}`}
                    thumbnails={gallery.map((url, index) => (
                      <Image
                        key={`launch-guidelines-thumb-${url}`}
                        src={url}
                        alt={`${clientName} — ${galleryCaption(index)}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ))}
                    thumbnailSlideOffset={1}
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
              {/* Impact highlights its first word only; everything else white. */}
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {t(locale, "workResultsKicker")}
                </p>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                  <HighlightWord
                    text={`${t(locale, "workImpactA")} ${t(locale, "workImpactB")}`}
                    word={t(locale, "workImpactA").split(/\s+/)[0]}
                  />
                </h2>
                {resultsText ? (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6">
                    {resultsText}
                  </p>
                ) : null}
              </div>
            </Reveal>
            {resolvedMetrics.length > 0 ? (
              <Reveal className="grid grid-cols-2 gap-3 sm:gap-4">
                {resolvedMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-card border border-white/10 bg-card-dark px-4 py-8 text-center sm:px-6 sm:py-12"
                  >
                    <div className="font-display text-3xl font-black tracking-tight text-primary md:text-4xl">
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
      {/* 06 — Brand in action — image carousel                       */}
      {/* ============================================================ */}
      {gallery.length > 0 || deliverables.length > 0 ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {t(locale, "workBrandInAction")}
              </p>
              <h2 className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                <HighlightWord
                  text={t(locale, "workBrandInUse")}
                  word={t(locale, "workBrandInUse").split(/\s+/)[1]}
                />
              </h2>
            </Reveal>

            <div className="mt-10">
              <OverviewSlider
                slides={gallery.map((url, index) => (
                  <Image
                    key={`brand-action-${index}-${url}`}
                    src={url}
                    alt={`${wordmark} — ${galleryCaption(index)}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ))}
                counterLabel={`${wordmark} — ${t(locale, "workBrandInUse")}`}
                thumbnails={gallery.map((url, index) => (
                  <Image
                    key={`brand-action-thumb-${index}-${url}`}
                    src={url}
                    alt={`${wordmark} — ${galleryCaption(index)}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ))}
                showDots={false}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* Final CTA                                                     */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-card border border-primary/20 bg-card-dark px-5 py-6 text-center shadow-xl sm:px-8 sm:py-8">
              <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {t(locale, "servicesStartProject")}
              </p>
              <h2 className="mt-2 font-display text-xl font-black tracking-tight text-text-primary sm:text-2xl">
                {t(locale, "workCtaTitle")}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-muted">
                {t(locale, "workCtaSubtitle")}
              </p>
              <div className="relative mt-6 flex justify-center">
                <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
                <Link
                  href="/contact"
                  className="group relative inline-flex min-h-14 max-w-full items-center gap-3 rounded-full border border-primary/60 bg-primary px-5 py-2.5 text-center text-sm font-bold text-text-inverse shadow-amber transition-[background-color,border-color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:border-primary-light hover:bg-primary-light hover:shadow-[0_0_48px_rgba(245,158,11,0.32)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-4 active:translate-y-0 active:border-primary-active active:bg-primary-active sm:px-6 sm:text-base"
                >
                  <span>{ctaLabel}</span>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/15 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5">
                    <ArrowIcon className="size-4" />
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 07 — Client perspective                                      */}
      {/* ============================================================ */}
      {project.testimonial ? (
        <section className="border-t border-white/5 py-14 md:py-20">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {t(locale, "workClientPerspective")}
              </p>
              <blockquote className="font-display text-2xl font-bold leading-snug tracking-tight text-text-primary sm:text-3xl md:text-4xl">
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
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {t(locale, "workMoreWork")}
              </p>
              <h2 className="mb-10 font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
                {normalizeHeading(t(locale, "workSimilar"))}{" "}
                <span className="text-primary">
                  {normalizeHeading(t(locale, "workCaseStudies"))}
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
