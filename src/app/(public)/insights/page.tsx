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
import { InsightsHero } from "@/components/insights/insights-hero";

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
      <InsightsHero
        eyebrow={eyebrow}
        title={title}
        highlight={highlight}
        description={description}
      />

      <section className="pb-24 md:pb-32">
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
