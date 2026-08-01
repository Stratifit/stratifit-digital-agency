import Link from "next/link";
import { getPublicInsights } from "@/features/insights/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function InsightsSection({ locale = "en" }: { locale?: string }) {
  const insights = await getPublicInsights(3);

  if (insights.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Insights & Expertise
          </h2>
          <Button variant="tertiary" size="small">
            <Link href="/insights">View all</Link>
          </Button>
        </div>
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
      </Container>
    </Section>
  );
}
