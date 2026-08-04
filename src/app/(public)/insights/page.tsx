import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights — Stratifit",
  description:
    "Insights and expertise from the Stratifit team on design, development, AI, and growth.",
  path: "/insights",
});

import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicInsights, getPublicInsightCategories } from "@/features/insights/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t } from "@/lib/i18n/ui-strings";
import { Container } from "@/components/ui/container";
import { InsightsGrid } from "@/components/insights/insights-grid";

export default async function InsightsPage() {
  const locale = await getLocale();
  const [insights, categories, settings] = await Promise.all([
    getPublicInsights(100),
    getPublicInsightCategories(),
    getPublicSectionSetting("insights"),
  ]);

  const eyebrow = settings
    ? resolveTranslation(settings.eyebrow_translations, locale)
    : "Knowledge";
  const title = settings
    ? resolveTranslation(settings.title_translations, locale)
    : "Insights &";
  const highlight = settings
    ? resolveTranslation(settings.highlight_translations, locale)
    : "Expertise";
  const description =
    (settings && resolveTranslation(settings.description_translations, locale)) ||
    "Thought leadership, industry perspectives, and actionable strategies from our team of strategists, designers, and engineers.";

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-background-deep pt-32 pb-16 md:pt-40 md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        />
        <Container className="relative z-10">
          {eyebrow ? (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-none lg:text-7xl">
            <span>{title}</span>
            {highlight ? <span className="text-primary"> {highlight}</span> : null}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-base leading-relaxed text-text-muted sm:pl-6 sm:text-lg md:text-xl">
              {description}
            </p>
          ) : null}
        </Container>
      </section>

      <section className="pt-12 pb-24 md:pb-32">
        <Container>
          {insights.length === 0 ? (
            <p className="py-20 text-center text-sm text-text-muted">
              {t(locale, "noInsightsYet")}
            </p>
          ) : (
            <InsightsGrid
              insights={insights}
              categories={categories}
              locale={locale}
            />
          )}
        </Container>
      </section>
    </>
  );
}
