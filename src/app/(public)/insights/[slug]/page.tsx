import { notFound } from "next/navigation";
import { getLocale } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";
import { getPublicInsightDetail } from "@/features/insights/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t, tWithNumber } from "@/lib/i18n/ui-strings";
import { articleJsonLd, canonical, pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const insight = await getPublicInsightDetail(slug);
  if (!insight) return {};
  const title = `${resolveTranslation(insight.title_translations, locale)} — Stratifit`;
  const description = resolveTranslation(insight.excerpt_translations, locale);
  return {
    ...pageMetadata({ title, description, path: `/insights/${slug}` }),
    openGraph: {
      title,
      description,
      url: canonical(`/insights/${slug}`),
      type: "article",
      siteName: "Stratifit",
      ...(insight.published_at ? { publishedTime: insight.published_at } : {}),
    },
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const insight = await getPublicInsightDetail(slug);

  if (!insight) {
    notFound();
  }

  const content = resolveTranslation(insight.content_translations, locale);
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  const insightTitle = resolveTranslation(insight.title_translations, locale);
  const insightExcerpt = resolveTranslation(insight.excerpt_translations, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: insightTitle,
              description: insightExcerpt,
              url: canonical(`/insights/${slug}`),
              publishedAt: insight.published_at,
            })
          ),
        }}
      />
      <section className="border-b border-border bg-background-deep">
        <Container className="py-20 md:py-24">
          <p className="text-sm text-text-muted">
            {insight.reading_time_minutes
              ? tWithNumber(locale, "minRead", insight.reading_time_minutes)
              : t(locale, "insightFallback")}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            {insightTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            {insightExcerpt}
          </p>
        </Container>
      </section>

      {insight.featured_media_url ? (
        <Container className="max-w-3xl -mt-8 pb-4">
          <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-card-lg border border-card-border">
            <Image
              src={insight.featured_media_url}
              alt={insightTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        </Container>
      ) : null}

      <Section>
        <Container className="max-w-3xl">
          <Reveal variant="fade">
          <div className="space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base leading-7 text-text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

