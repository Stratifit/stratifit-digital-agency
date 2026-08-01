import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicInsightDetail } from "@/features/insights/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getPublicInsightDetail(slug);
  if (!insight) return {};
  return {
    title: `${resolveTranslation(insight.title_translations, "en")} — Stratifit`,
    description: resolveTranslation(insight.excerpt_translations, "en"),
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await getPublicInsightDetail(slug);

  if (!insight) {
    notFound();
  }

  const content = resolveTranslation(insight.content_translations, "en");
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-20 md:py-24">
          <p className="text-sm text-text-muted">
            {insight.reading_time_minutes
              ? `${insight.reading_time_minutes} min read`
              : "Insight"}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            {resolveTranslation(insight.title_translations, "en")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            {resolveTranslation(insight.excerpt_translations, "en")}
          </p>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl">
          <div className="space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base leading-7 text-text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
