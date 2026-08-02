import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights — Stratifit",
  description:
    "Insights and expertise from the Stratifit team on design, development, AI, and growth.",
  path: "/insights",
});

import { getPublicInsights } from "@/features/insights/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export default async function InsightsPage() {
  const insights = await getPublicInsights(100);

  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-20 md:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Insights
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Ideas and expertise
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            Practical thinking on web, AI, and digital growth.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          {insights.length === 0 ? (
            <p className="text-text-secondary">Articles will appear here soon.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {insights.map((insight) => (
                <Card key={insight.slug} className="flex flex-col">
                  <h2 className="font-display text-lg font-semibold text-text-primary">
                    {resolveTranslation(insight.title_translations, "en")}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">
                    {resolveTranslation(insight.excerpt_translations, "en")}
                  </p>
                  <LinkButton
                    href={`/insights/${insight.slug}`}
                    variant="tertiary"
                    size="small"
                    className="mt-4 self-start"
                  >
                    Read more
                  </LinkButton>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

