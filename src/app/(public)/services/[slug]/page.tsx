import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Fragment } from "react";
import { getPublicServicePage } from "@/features/service-pages/queries";
import { getPublicServices } from "@/features/services/queries";
import { getPublicPortfolioProjects } from "@/features/portfolio/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t, type UiStringKey } from "@/lib/i18n/ui-strings";
import { pageMetadata, canonical } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { PortfolioGallery } from "@/components/sections/portfolio-gallery";
import { ServicePageIcon } from "@/components/ui/service-page-icon";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/cn";

const TOOLKIT_ICONS = [
  "chart",
  "globe",
  "rocket",
  "workshop",
  "chat",
  "search",
  "key",
  "type",
  "positioning",
  "audit",
];

const TRUST_ITEMS: ReadonlyArray<{
  icon: string;
  title: UiStringKey;
  description: UiStringKey;
}> = [
  { icon: "final", title: "trustNoSpam", description: "trustNoSpamDesc" },
  { icon: "lock", title: "trustPrivate", description: "trustPrivateDesc" },
  {
    icon: "bolt",
    title: "trustQuickResponse",
    description: "trustQuickResponseDesc",
  },
];

function highlightLastWord(text: string) {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= 1) return <>{text}</>;
  const last = parts.pop();
  return (
    <>
      {parts.join(" ")} {" "}
      <span className="text-primary">{last}</span>
    </>
  );
}

function highlightCtaTitle(text: string) {
  const words = text.trim().split(/\s+/);

  return words.map((word, index) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "");
    const highlightedWords = new Set([
      "next",
      "product",
      "project",
      "brand",
      "story",
      "workflows",
      "automation",
      "impact",
      "launch",
    ]);
    const highlighted = highlightedWords.has(cleanWord);

    return (
      <Fragment key={`${word}-${index}`}>
        {index > 0 ? " " : null}
        {highlighted ? <span className="text-primary">{word}</span> : word}
      </Fragment>
    );
  });
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const page = await getPublicServicePage(slug);
  if (!page) return {};
  const title = `${resolveTranslation(page.hero_title_translations, locale)}${
    page.hero_highlight_translations
      ? ` ${resolveTranslation(page.hero_highlight_translations, locale)}`
      : ""
  } — Stratifit`;
  return {
    ...pageMetadata({
      title,
      description: resolveTranslation(page.hero_description_translations, locale),
      path: `/services/${slug}`,
    }),
    openGraph: {
      title,
      description: resolveTranslation(page.hero_description_translations, locale),
      url: canonical(`/services/${slug}`),
      type: "website",
      siteName: "Stratifit",
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const [page, services, portfolio] = await Promise.all([
    getPublicServicePage(slug),
    getPublicServices(),
    getPublicPortfolioProjects(8),
  ]);

  if (!page) {
    notFound();
  }

  const service = services.find((s) => s.slug === slug);
  const serviceName = service
    ? resolveTranslation(service.title_translations, locale)
    : resolveTranslation(page.hero_title_translations, locale);
  const pageTitle = resolveTranslation(page.hero_title_translations, locale);
  const highlight = resolveTranslation(page.hero_highlight_translations, locale);
  const heroDescription = resolveTranslation(
    page.hero_description_translations,
    locale
  );
  const whyTitle = resolveTranslation(page.why_title_translations, locale);
  const whyDescription = resolveTranslation(
    page.why_description_translations,
    locale
  );
  const capabilitiesTitle = resolveTranslation(
    page.capabilities_title_translations,
    locale
  );
  const deliverablesTitle = resolveTranslation(
    page.deliverables_title_translations,
    locale
  );
  const processTitle = resolveTranslation(page.process_title_translations, locale);
  const toolkitTitle = resolveTranslation(page.toolkit_title_translations, locale);
  const ctaTitle = resolveTranslation(page.cta_title_translations, locale);
  const ctaSubtitle = resolveTranslation(page.cta_subtitle_translations, locale);
  const ctaButton = resolveTranslation(
    page.cta_button_label_translations,
    locale
  );
  const stats = page.hero_stats ?? [];
  const badges = page.why_badges ?? [];
  const capabilities = page.capabilities ?? [];
  const deliverables = page.deliverables ?? [];
  const process = page.process ?? [];
  const toolkit = page.toolkit ?? [];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden border-b border-border bg-background-deep pt-24 pb-0 md:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px] md:h-[600px] md:w-[600px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/3 blur-[100px] md:h-[400px] md:w-[400px]" />
          <div className="absolute top-1/2 left-1/4 h-[200px] w-[200px] rounded-full bg-primary/4 blur-[80px]" />
        </div>
        <Container className="relative z-10">
          <div className="grid items-center gap-8 md:gap-16">
            <div className="space-y-4 md:space-y-8 lg:mx-auto lg:max-w-4xl lg:text-center">
              <Reveal>
                <div className="flex items-center justify-center gap-2">
                  <span className="size-2 shrink-0 animate-pulse rounded-full bg-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-xs">
                    {resolveTranslation(page.hero_eyebrow_translations, locale) || serviceName}
                  </span>
                </div>
              </Reveal>
              <Reveal>
                <h1 className="text-center font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-[0.95]">
                  {pageTitle}
                  {highlight ? (
                    <>
                      <br />
                      <span className="text-primary">{highlight}</span>
                    </>
                  ) : null}
                </h1>
              </Reveal>
              {heroDescription ? (
                <Reveal>
                  <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-text-secondary sm:text-base md:text-lg">
                    {heroDescription}
                  </p>
                </Reveal>
              ) : null}
              <Reveal>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 lg:justify-center">
                  <ContactAwareLink href="/contact" size="large" className="w-full sm:w-auto">
                    {ctaButton || "Start Your Project"}
                  </ContactAwareLink>
                  {process.length > 0 ? (
                    <LinkButton
                      href="#how-it-works"
                      variant="tertiary"
                      size="large"
                      className="w-full sm:w-auto"
                    >
                      How We Work
                    </LinkButton>
                  ) : null}
                </div>
              </Reveal>
            </div>

            {stats.length > 0 ? (
              <Reveal variant="card">
                <div className="grid grid-cols-3 gap-3 pt-3 pb-3 sm:gap-6 md:gap-6 md:pt-3 md:pb-0 lg:pt-3">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center px-2 text-center sm:px-4 lg:flex-row lg:justify-center lg:gap-1 lg:whitespace-nowrap"
                    >
                      <div className="mb-0.5 font-display text-2xl font-black leading-none text-primary sm:text-3xl lg:mb-0">
                        <CountUp value={stat.value} />
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-text-subtle leading-tight sm:text-[10px] lg:text-sm">
                        {resolveTranslation(stat.label_translations, locale)}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </section>

      {/* ================= WHY IT MATTERS ================= */}
      {(whyTitle || badges.length > 0) ? (
        <Section>
          <Container>
            <Reveal variant="card">
              <div className="relative overflow-hidden rounded-card-lg border border-card-border bg-card-dark p-6 shadow-lg sm:p-8">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <div className="relative z-10 flex items-center gap-2">
                  <span className="text-xl text-primary">
                    <ServicePageIcon name="spark" className="size-6" />
                  </span>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-primary">
                    {whyTitle}
                  </h2>
                </div>
                {whyDescription ? (
                  <p className="relative z-10 mt-6 mb-6 text-sm font-medium leading-relaxed text-text-primary sm:text-base">
                    {whyDescription}
                  </p>
                ) : null}
                {badges.length > 0 ? (
                  <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-1.5 rounded-card border border-card-border bg-[#1E1E1E] p-3 text-center transition-all duration-300 hover:border-primary/30 sm:p-4"
                      >
                        <span className="font-display text-lg font-black leading-none text-text-primary sm:text-xl">
                          {badge.value}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-tight sm:text-xs">
                          {resolveTranslation(badge.label_translations, locale)}
                        </span>
                        {badge.hint_translations ? (
                          <span className="hidden text-[9px] leading-tight text-text-subtle sm:block">
                            {resolveTranslation(badge.hint_translations, locale)}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* ================= CAPABILITIES ================= */}
      {capabilities.length > 0 ? (
        <Section>
          <Container>
            <Reveal>
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {serviceName}
                </p>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-none">
                  {highlightLastWord(capabilitiesTitle || "Capabilities")}
                </h2>
                {service?.short_description_translations ? (
                  <p className="mt-3 ml-1.5 max-w-2xl border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-text-muted sm:ml-2 sm:pl-6 sm:text-base md:text-lg">
                    {resolveTranslation(service.short_description_translations, locale)}
                  </p>
                ) : null}
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {capabilities.map((capability, index) => (
                <Reveal key={index} variant="card" className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-card border border-card-border bg-card-dark p-6 shadow-xl sm:p-8">
                    <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        <ServicePageIcon
                          name={capability.steps?.[0]?.icon ?? "spark"}
                          className="size-6 text-primary"
                        />
                      </div>
                      <h3 className="font-display text-2xl font-bold tracking-tight text-text-primary">
                        {resolveTranslation(capability.title_translations, locale)}
                      </h3>
                    </div>
                    <p className="mb-8 text-sm leading-relaxed text-text-secondary">
                      {resolveTranslation(capability.description_translations, locale)}
                    </p>
                    {capability.steps && capability.steps.length > 0 ? (
                      <>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
                          How We Do It
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {capability.steps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex flex-col items-center justify-center gap-2 rounded-card border border-card-border bg-[#1E1E1E] p-4 text-center transition-colors hover:bg-surface-hover"
                            >
                              <ServicePageIcon
                                name={step.icon ?? "spark"}
                                className="mb-1 size-6 text-primary md:size-7"
                              />
                              <span className="text-xs font-semibold text-text-primary">
                                {resolveTranslation(step.label_translations, locale)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ================= DELIVERABLES ================= */}
      {deliverables.length > 0 ? (
        <Section>
          <Container>
            <Reveal>
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Deliverables
                </p>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-none">
                  {highlightLastWord(deliverablesTitle || "What's Included")}
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {deliverables.map((item, index) => (
                <Reveal key={index} variant="card" className="h-full">
                  <div className="group/card flex h-full flex-col items-center gap-3 rounded-card border border-card-border bg-[#1E1E1E] p-6 text-center shadow-lg transition-all duration-300 hover:border-primary/30 sm:p-8">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-shadow group-hover/card:shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                      <ServicePageIcon
                        name={item.icon ?? "folder"}
                        className="size-6 text-primary transition-transform duration-300 group-hover/card:scale-110"
                      />
                    </div>
                    <div>
                      <h4 className="mb-1.5 text-sm font-bold text-text-primary">
                        {resolveTranslation(item.title_translations, locale)}
                      </h4>
                      <p className="text-[11px] leading-tight text-text-muted">
                        {resolveTranslation(item.description_translations, locale)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ================= PROCESS ================= */}
      {process.length > 0 ? (
        <Section id="how-it-works">
          <Container>
            <Reveal>
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Our Process
                </p>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-none">
                  {highlightLastWord(processTitle || "How It Works")}
                </h2>
              </div>
            </Reveal>
            <div className="space-y-4 md:grid md:grid-cols-4 md:gap-4 md:space-y-0">
              {process.map((step, index) => (
                <Reveal key={index} variant="card" className="h-full">
                  <div className="relative h-full">
                    {index < process.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-lg text-primary/30 md:block"
                      >
                        <ServicePageIcon name="arrow" className="size-5" />
                      </span>
                    ) : null}
                    <div className="flex h-full flex-col rounded-card border border-card-border bg-[#1E1E1E] p-6 shadow-lg transition-all duration-300 hover:border-primary/30 sm:p-8">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 shrink-0 font-display text-2xl font-black leading-none text-primary opacity-30 sm:text-3xl">
                          {String(step.number).padStart(2, "0")}
                        </div>
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <ServicePageIcon
                              name={step.icon ?? "spark"}
                              className="size-5 shrink-0 text-primary"
                            />
                            <h4 className="text-sm font-bold text-text-primary sm:text-base">
                              {resolveTranslation(step.title_translations, locale)}
                            </h4>
                          </div>
                          <p className="text-xs leading-relaxed text-text-muted sm:text-[13px]">
                            {resolveTranslation(step.description_translations, locale)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ================= TOOLKIT ================= */}
      {toolkit.length > 0 ? (
        <Section>
          <Container>
            <Reveal>
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Toolkit
                </p>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-none">
                  {highlightLastWord(toolkitTitle || "Tools & Technologies")}
                </h2>
              </div>
            </Reveal>
            <div>
              {[toolkit.slice(0, Math.ceil(toolkit.length / 2)), toolkit.slice(Math.ceil(toolkit.length / 2))].map(
                (row, rowIndex) => (
                  <div key={rowIndex} className="overflow-hidden py-4 md:py-6">
                    <div
                      className={cn(
                        "flex w-max gap-10 whitespace-nowrap",
                        rowIndex === 0 ? "marquee-scroll" : "marquee-scroll-reverse"
                      )}
                    >
                      {[...row, ...row].map((tool, index) => (
                        <span
                          key={`${rowIndex}-${tool}-${index}`}
                          className="flex items-center gap-2 text-lg font-medium text-text-secondary sm:text-xl"
                        >
                          <ServicePageIcon
                            name={TOOLKIT_ICONS[index % TOOLKIT_ICONS.length]}
                            className="size-6 shrink-0 text-text-subtle"
                          />
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ================= SELECTED WORK ================= */}
      {portfolio.length > 0 ? (
        <Section>
          <Container>
            <Reveal>
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Case Studies
                </p>
                <h2 className="font-display text-3xl font-black tracking-tight leading-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl">
                  Selected <span className="text-primary">Work</span>
                </h2>
                <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-text-muted sm:pl-6 sm:text-base md:text-lg">
                  Real outcomes from real projects — measured by the metrics that
                  matter to your business.
                </p>
              </div>
            </Reveal>
            <Reveal variant="card" cardSelector="[data-project-card]">
              <PortfolioGallery projects={portfolio} services={services} locale={locale} />
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* ================= FINAL CTA ================= */}
      {ctaTitle ? (
        <Section>
          <Container>
            <Reveal variant="cta">
              <div className="relative flex min-h-[760px] flex-col overflow-hidden rounded-[32px] border border-card-border bg-background p-6 text-center shadow-shadow-lg sm:min-h-[880px] sm:p-10 lg:min-h-[980px] lg:p-14">
                <div className="shimmer-line absolute inset-x-0 top-0 h-px" />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute -top-24 left-1/2 h-[300px] w-[560px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
                  <div className="absolute -bottom-24 left-1/4 h-[220px] w-[420px] rounded-full bg-primary/5 blur-[110px]" />
                  <div className="absolute right-1/4 top-1/2 h-[240px] w-[240px] rounded-full bg-primary/4 blur-[110px]" />
                </div>

                {/* Subtle technical linework keeps the lower panel visually active. */}
                <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-[-5rem] h-72 w-[34rem] opacity-60">
                  <span className="absolute bottom-8 right-0 h-px w-full rotate-[-42deg] bg-primary/20" />
                  <span className="absolute bottom-20 right-[-2rem] h-px w-full rotate-[-42deg] bg-primary/15" />
                  <span className="absolute bottom-32 right-[-4rem] h-px w-full rotate-[-42deg] bg-primary/10" />
                  <span className="absolute bottom-44 right-[-6rem] h-px w-full rotate-[-42deg] bg-primary/10" />
                </div>

                <div className="relative z-10 flex flex-1 flex-col items-center">
                  <div className="mb-8 flex items-center justify-center gap-3 rounded-full border border-primary/20 bg-background/70 px-6 py-3 shadow-[0_0_30px_rgba(245,158,11,0.08)] sm:mb-12 sm:px-9 sm:py-4">
                    <ServicePageIcon name="spark" className="size-5 text-primary" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary sm:text-xs">
                      {t(locale, "readyWhenYouAre")}
                    </p>
                  </div>

                  <h2 className="mx-auto max-w-5xl font-display text-4xl font-black leading-[0.95] tracking-[-0.04em] text-text-primary sm:text-6xl lg:text-8xl">
                    {highlightCtaTitle(ctaTitle)}
                  </h2>

                  {ctaSubtitle ? (
                    <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-text-secondary sm:mt-10 sm:text-xl sm:leading-relaxed">
                      {ctaSubtitle}
                    </p>
                  ) : null}

                  <div className="mt-10 w-full max-w-4xl sm:mt-14">
                    <ContactAwareLink
                      href="/contact"
                      size="large"
                      className="group !h-20 !w-full !max-w-none !gap-0 !overflow-hidden !rounded-[18px] !border-primary/70 !bg-primary !p-0 !shadow-[0_0_34px_rgba(245,158,11,0.36)] sm:!h-24"
                    >
                      <span className="relative flex h-full w-20 shrink-0 items-center justify-center border-r border-primary/60 bg-background text-primary sm:w-28">
                        <span aria-hidden="true" className="absolute -right-3 top-0 h-full w-6 skew-x-[-14deg] border-r border-primary/60 bg-background" />
                        <ServicePageIcon name="rocket" className="relative z-10 size-8 sm:size-10" />
                      </span>
                      <span className="flex flex-1 items-center justify-center px-4 text-sm font-black uppercase tracking-[0.16em] text-text-inverse sm:text-xl sm:tracking-[0.2em]">
                        {ctaButton || "Start Your Project"}
                      </span>
                      <span className="flex w-16 shrink-0 items-center justify-center text-text-inverse sm:w-24">
                        <ServicePageIcon
                          name="arrow"
                          className="size-7 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1 sm:size-9"
                        />
                      </span>
                    </ContactAwareLink>
                  </div>

                  <p className="mt-6 text-xs text-text-subtle sm:mt-8 sm:text-sm">
                    {t(locale, "noSpamNote")}
                  </p>
                </div>

                <div className="relative z-10 mt-10 grid w-full grid-cols-1 gap-6 border-t border-card-border/80 pt-8 text-left sm:mt-14 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-card-border/80 sm:pt-10">
                  {TRUST_ITEMS.map((item) => (
                    <div key={item.title} className="flex items-center gap-4 sm:justify-center sm:px-6">
                      <ServicePageIcon name={item.icon} className="size-9 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-text-primary">
                          {t(locale, item.title)}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-text-muted sm:text-sm">
                          {t(locale, item.description)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
