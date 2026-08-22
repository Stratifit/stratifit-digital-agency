import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicInsights, getPublicInsightCategories } from "@/features/insights/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { InsightsCarousel } from "./insights-carousel";

export async function InsightsSection() {
  const locale = await getLocale();
  const [insights, categories, settings] = await Promise.all([
    getPublicInsights(100),
    getPublicInsightCategories(),
    getPublicSectionSetting("insights"),
  ]);

  if (insights.length === 0) {
    return null;
  }

  return (
    <>
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <Reveal variant="card" className="mt-12" cardSelector="[data-insight-card]">
          <InsightsCarousel
            insights={insights}
            categories={categories}
            locale={locale}
          />
        </Reveal>
      </Container>
    </Section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
