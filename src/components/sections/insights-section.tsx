import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicInsights, getPublicInsightCategories } from "@/features/insights/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { InsightsCarousel } from "./insights-carousel";

export async function InsightsSection() {
  const locale = await getLocale();
  const [insights, categories, settings] = await Promise.all([
    getPublicInsights(4),
    getPublicInsightCategories(),
    getPublicSectionSetting("insights"),
  ]);

  if (insights.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <div className="mt-12">
          <InsightsCarousel
            insights={insights}
            categories={categories}
            locale={locale}
          />
        </div>
      </Container>
    </Section>
  );
}
