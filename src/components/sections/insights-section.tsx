import Link from "next/link";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicInsights } from "@/features/insights/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

export async function InsightsSection() {
  const locale = await getLocale();
  const [insights, settings] = await Promise.all([
    getPublicInsights(3),
    getPublicSectionSetting("insights"),
  ]);

  if (insights.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {insights.map((insight) => (
            <Card key={insight.slug} className="flex flex-col">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {resolveTranslation(insight.title_translations, locale)}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">
                {resolveTranslation(insight.excerpt_translations, locale)}
              </p>
              <Button variant="tertiary" size="small" className="mt-4 self-start">
                <Link href={`/insights/${insight.slug}`}>Read more</Link>
              </Button>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button variant="tertiary" size="small">
            <Link href="/insights">View all</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}


