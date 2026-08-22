import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicServicePage } from "@/features/service-pages/queries";
import { getPublicServices, getPublicServiceBySlug } from "@/features/services/queries";
import { getPublicPortfolioProjects } from "@/features/portfolio/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t } from "@/lib/i18n/ui-strings";
import { pageMetadata, canonical, resolveSeoMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { PortfolioGallery } from "@/components/sections/portfolio-gallery";
import { CtaCard } from "@/components/sections/cta-card";
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

function highlightLastWord(text: string) {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= 1) return <>{text}</>;
  const last = parts.pop();
  return (
    <>
      {parts.join(" ")}{" "}
      <span className="text-primary">{last}</span>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const [page, service] = await Promise.all([
    getPublicServicePage(slug),
    getPublicServiceBySlug(slug),
  ]);
  if (!page) return {};
  const heroHighlightFallback = resolveTranslation(
    page.hero_highlight_translations,
    locale
  );
  const fallbackTitle = `${resolveTranslation(page.hero_title_translations, locale)}${
    heroHighlightFallback ? ` ${heroHighlightFallback}` : ""
  } Stratifit`;
  const fallbackDescription = resolveTranslation(
    page.hero_description_translations,
    locale
  );
  const { title, description } = resolveSeoMetadata({
    seoTitleTranslations: service?.seo_title_translations,
    seoDescriptionTranslations: service?.seo_description_translations,
    locale,
    fallbackTitle,
    fallbackDescription,
  });
  return {
    ...pageMetadata({ title, description, path: `/services/${slug}` }),
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
    getPublicPortfolioProjects(8, slug),
  ]);

  if (!page) {
    notFound();
  }

  const service = services.find((s) => s.slug === slug);
  const serviceName =
    (service
      ? resolveTranslation(service.title_translations, locale)
      : resolveTranslation(page.hero_title_translations, locale)) ||
    t(locale, "servicesTitle");
  const pageTitle =
    resolveTranslation(page.hero_title_translations, locale) || serviceName;
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
  const capabilitiesDescription =
    resolveTranslation(page.capabilities_description_translations, locale) ||
    (service
      ? resolveTranslation(service.short_description_translations, locale)
      : null);
  const deliverablesTitle = resolveTranslation(
    page.deliverables_title_translations,
    locale
  );
  const processTitle = resolveTranslation(page.process_title_translations, locale);
  const toolkitTitle = resolveTranslation(page.toolkit_title_translations, locale);
  const ctaTitle = resolveTranslation(page.cta_title_translations, locale);
  const ctaSubtitle = resolveTranslation(
    page.cta_subtitle_translations,
    locale
  );
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
      <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-background pt-16 pb-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px] md:h-[600px] md:w-[600px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/3 blur-[100px] md:h-[400px] md:w-[400px]" />
          <div className="absolute top-1/2 left-1/4 h-[200px] w-[200px] rounded-full bg-primary/4 blur-[80px]" />
        </div>
        <Container className="relative z-10">
          <div className="grid items-center gap-8 md:gap-16">
            <div className="space-y-4 text-center md:space-y-8 lg:mx-auto lg:max-w-4xl">
              <Reveal>
                <h1 className="flex flex-col items-center justify-center font-display text-[1.75rem] font-black leading-[1.15] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-5xl">
                  <span className="block">{pageTitle}</span>
                  {highlight ? (
                    <span className="mt-1 block lg:mt-2">
                      {highlightLastWord(highlight)}
                    </span>
                  ) : null}
                </h1>
              </Reveal>
              {heroDescription ? (
                <Reveal>
                  <p className="mx-auto mt-[18px] max-w-xl text-center text-[0.8rem] font-medium leading-snug text-text-secondary [text-shadow:0_0_1px_currentColor] sm:text-base">
                    {heroDescription}
                  </p>
                </Reveal>
              ) : null}
              <Reveal>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                  <ContactAwareLink href="/contact" size="large" className="w-full sm:w-auto">
                    {ctaButton || t(locale, "servicesStartProject")}
                  </ContactAwareLink>
                  {process.length > 0 ? (
                    <LinkButton
                      href="#how-it-works"
                      variant="tertiary"
                      size="large"
                      className="w-full sm:w-auto"
                    >
                      {t(locale, "howWeWork")}
                    </LinkButton>
                  ) : null}
                </div>
              </Reveal>
            </div>

            {stats.length > 0 ? (
              <Reveal variant="card">
                <div className="grid grid-cols-3 gap-3 pt-3 pb-3 sm:gap-6 md:gap-6 md:pt-3 md:pb-0 lg:pt-3">
                  {stats.map((stat, index) => {
                    const statTitle = resolveTranslation(
                      stat.label_translations,
                      locale
                    );
                    const statDescription = stat.description_translations
                      ? resolveTranslation(stat.description_translations, locale)
                      : null;
                    const numeric = Boolean(stat.value.trim());
                    return (
                      <div
                        key={index}
                        className={
                          numeric
                            ? "flex flex-col items-center px-2 text-center sm:px-4 lg:flex-row lg:justify-center lg:gap-1 lg:whitespace-nowrap"
                            : "flex flex-col items-center px-2 text-center sm:px-4"
                        }
                      >
                        {numeric ? (
                          <>
                            <div className="mb-0.5 font-display text-2xl font-black leading-none text-primary sm:text-3xl lg:mb-0">
                              <CountUp value={stat.value} />
                            </div>
                            <div className="text-[9px] font-bold uppercase tracking-wider text-text-subtle leading-tight sm:text-[10px] lg:text-sm">
                              {statTitle}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-display text-base font-bold leading-tight text-text-primary sm:text-lg">
                              {statTitle}
                            </div>
                            {statDescription ? (
                              <div className="mt-1 text-[10px] leading-tight text-text-muted sm:text-xs">
                                {statDescription}
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </section>

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* ================= WHY IT MATTERS ================= */}
      {(whyTitle || badges.length > 0) ? (
        <>
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
                    {whyTitle || t(locale, "servicesWhyTitle")}
                  </h2>
                </div>
                {whyDescription ? (
                  <p className="relative z-10 mt-6 mb-6 text-sm font-medium leading-relaxed text-text-primary sm:text-base">
                    {whyDescription}
                  </p>
                ) : null}
                {badges.length > 0 ? (
                  <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4">
                    {badges.map((badge, index) => {
                      const badgeTitle = resolveTranslation(
                        badge.label_translations,
                        locale
                      );
                      const badgeDescription = badge.description_translations
                        ? resolveTranslation(badge.description_translations, locale)
                        : badge.hint_translations
                          ? resolveTranslation(badge.hint_translations, locale)
                          : null;
                      const numeric = Boolean(badge.value.trim());
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-1.5 rounded-card border border-card-border bg-[#1E1E1E] p-3 text-center transition-all duration-300 hover:border-primary/30 sm:p-4"
                        >
                          {numeric ? (
                            <>
                              <span className="font-display text-lg font-black leading-none text-primary sm:text-xl">
                                {badge.value}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-tight sm:text-xs">
                                {badgeTitle}
                              </span>
                              {badge.hint_translations ? (
                                <span className="hidden text-[9px] leading-tight text-text-subtle sm:block">
                                  {resolveTranslation(
                                    badge.hint_translations,
                                    locale
                                  )}
                                </span>
                              ) : null}
                            </>
                          ) : (
                            <>
                              <span className="font-display text-sm font-bold leading-tight text-text-primary sm:text-base">
                                {badgeTitle}
                              </span>
                              {badgeDescription ? (
                                <span className="text-[10px] leading-tight text-text-muted sm:text-xs">
                                  {badgeDescription}
                                </span>
                              ) : null}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </Reveal>
          </Container>
        </Section>
        <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* ================= CAPABILITIES ================= */}
      {capabilities.length > 0 ? (
        <>
        <Section>
          <Container>
            <Reveal>
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {t(locale, "servicesEyebrow")}
                </p>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-none">
                  {highlightLastWord(
                    capabilitiesTitle || t(locale, "servicesCapabilities")
                  )}
                </h2>
                {capabilitiesDescription ? (
                  <p className="mt-3 ml-1.5 max-w-2xl border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-text-muted sm:ml-2 sm:pl-6 sm:text-base md:text-lg">
                    {capabilitiesDescription}
                  </p>
                ) : null}
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                          {t(locale, "servicesHowWeDoIt")}
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
        <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* ================= DELIVERABLES ================= */}
      {deliverables.length > 0 ? (
        <>
        <Section>
          <Container>
            <Reveal>
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {t(locale, "servicesDeliverables")}
                </p>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-none">
                  {highlightLastWord(
                    deliverablesTitle || t(locale, "servicesWhatsIncluded")
                  )}
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {deliverables.map((item, index) => (
                <Reveal key={index} variant="card" className="h-full">
                  <div className="group/card flex h-full flex-col rounded-card border border-card-border bg-[#1E1E1E] p-6 shadow-lg transition-all duration-300 hover:border-primary/30 sm:p-8">
                    <div className="mb-2 flex items-center gap-2">
                      <ServicePageIcon
                        name={item.icon ?? "folder"}
                        className="size-5 shrink-0 text-primary"
                      />
                      <h4 className="text-sm font-bold text-text-primary sm:text-base">
                        {resolveTranslation(item.title_translations, locale)}
                      </h4>
                    </div>
                    <p className="text-xs leading-relaxed text-text-muted sm:text-[13px]">
                      {resolveTranslation(item.description_translations, locale)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
        <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* ================= PROCESS ================= */}
      {process.length > 0 ? (
        <>
        <Section id="how-it-works">
          <Container>
            <Reveal>
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {t(locale, "workOurProcess")}
                </p>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-none">
                  {highlightLastWord(
                    processTitle || t(locale, "servicesHowItWorks")
                  )}
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
        <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* ================= TOOLKIT ================= */}
      {toolkit.length > 0 ? (
        <>
        <Section>
          <Container>
            <Reveal>
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {t(locale, "servicesToolkit")}
                </p>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-none">
                  {highlightLastWord(
                    toolkitTitle || t(locale, "servicesToolsTech")
                  )}
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
        <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* ================= SELECTED WORK ================= */}
      {portfolio.length > 0 ? (
        <>
        <Section>
          <Container>
            <Reveal>
              <div className="mb-10 md:mb-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {t(locale, "servicesCaseStudies")}
                </p>
                <h2 className="font-display text-3xl font-black tracking-tight leading-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl">
                  {t(locale, "workSelected")}{" "}
                  <span className="text-primary">{t(locale, "workWord")}</span>
                </h2>
                <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-text-muted sm:pl-6 sm:text-base md:text-lg">
                  {t(locale, "servicesSelectedWorkDesc")}
                </p>
              </div>
            </Reveal>
            <Reveal variant="card" cardSelector="[data-project-card]">
              <PortfolioGallery
                projects={portfolio}
                services={services}
                locale={locale}
                hideFilters
              />
            </Reveal>
          </Container>
        </Section>
        <div aria-hidden="true" className="h-px w-full bg-white/5" />
        </>
      ) : null}

      {/* ================= FINAL CTA ================= */}
      {ctaTitle ? (
        <Section>
          <Container>
            <Reveal>
              <CtaCard
                title={highlightLastWord(ctaTitle)}
                description={ctaSubtitle || undefined}
                label={ctaButton || t(locale, "servicesStartProject")}
                href="/contact"
                locale={locale}
              />
            </Reveal>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
