import { notFound } from "next/navigation";
import { getLocale } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";
import {
  getPublicInsightCategories,
  getPublicInsightDetail,
} from "@/features/insights/queries";
import {
  formatInsightDate,
  getCategoryLabel,
  getInsightImage,
} from "@/features/insights/display";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t, tWithNumber } from "@/lib/i18n/ui-strings";
import { articleJsonLd, canonical, pageMetadata, resolveSeoMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import Image from "next/image";
import Link from "next/link";

/** Render `**bold**` inline markers as <strong>. */
function renderInline(text: string) {
  const parts = text.split(/(\*\*.+?\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-text-primary">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

/** Render the article body: `##`–`####` headings as section headings, other
 *  blocks as paragraphs with inline bold support. */
function renderContentBlocks(content: string) {
  const blocks = content.split(/\n{2,}/).filter(Boolean);
  return blocks.map((block, index) => {
    const heading = block.match(/^#{2,4}\s+(.+)$/);
    if (heading) {
      return (
        <h2
          key={index}
          className="font-display text-2xl font-bold tracking-tight text-text-primary md:text-3xl"
        >
          {heading[1]}
        </h2>
      );
    }
    return (
      <p
        key={index}
        className="text-base leading-relaxed text-text-secondary md:text-lg"
      >
        {renderInline(block)}
      </p>
    );
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const insight = await getPublicInsightDetail(slug);
  if (!insight) return {};
  const { title, description } = resolveSeoMetadata({
    seoTitleTranslations: insight.seo_title_translations,
    seoDescriptionTranslations: insight.seo_description_translations,
    locale,
    fallbackTitle: `${resolveTranslation(insight.title_translations, locale)} Stratifit`,
    fallbackDescription: resolveTranslation(insight.excerpt_translations, locale),
  });
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

  const categories = await getPublicInsightCategories();

  const content = resolveTranslation(insight.content_translations, locale) || "";
  const insightTitle = resolveTranslation(insight.title_translations, locale);
  const insightExcerpt = resolveTranslation(insight.excerpt_translations, locale);
  const date = formatInsightDate(insight.published_at, locale);
  const categorySlug = insight.category_slugs[0];
  const imageSrc = getInsightImage(
    insight.featured_media_url,
    insight.slug,
    insight.category_slugs
  );

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

      {/* Full-bleed hero image with bottom gradient overlay */}
      <section className="relative h-[40vh] overflow-hidden md:h-[50vh]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={insightTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-card-dark to-card-dark">
            <span className="font-display text-6xl font-black text-primary/40">
              {insightTitle.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
          <Container className="max-w-3xl">
            {categorySlug ? (
              <span className="mb-3 inline-block rounded bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-inverse">
                {getCategoryLabel(categorySlug, categories, locale)}
              </span>
            ) : null}
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-text-muted">
              {date ? <span>{date}</span> : null}
              {date && insight.reading_time_minutes ? (
                <span aria-hidden="true" className="size-1 rounded-full bg-text-subtle/60" />
              ) : null}
              {insight.reading_time_minutes ? (
                <span>
                  {tWithNumber(locale, "minRead", insight.reading_time_minutes)}
                </span>
              ) : null}
            </div>
          </Container>
        </div>
      </section>

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

      {/* Title + article body */}
      <section className="relative z-10 py-16 md:py-24">
        <Container className="max-w-3xl">
          <Reveal variant="fade">
            <Link
              href="/insights"
              className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:brightness-110"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M11.03 3.97a.75.75 0 0 1 0 1.06L4.81 11.25H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
              {t(locale, "backToInsights")}
            </Link>
            <h1 className="mb-8 font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-none">
              {insightTitle}
            </h1>
            {content ? (
              <div className="space-y-6">
                {renderContentBlocks(content)}
              </div>
            ) : (
              <p className="text-base leading-relaxed text-text-secondary md:text-lg">
                {insightExcerpt}
              </p>
            )}
          </Reveal>
        </Container>
      </section>
    </>
  );
}
