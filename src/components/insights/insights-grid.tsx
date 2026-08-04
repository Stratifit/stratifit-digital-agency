"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type {
  PublicInsight,
  PublicInsightCategory,
} from "@/features/insights/queries";
import {
  formatInsightDate,
  getCategoryLabel,
  getInsightImage,
} from "@/features/insights/display";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t, tWithNumber } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InsightArticleCard({
  insight,
  categories,
  locale,
}: {
  insight: PublicInsight;
  categories: PublicInsightCategory[];
  locale: string;
}) {
  const title = resolveTranslation(insight.title_translations, locale) || "Insight";
  const excerpt = resolveTranslation(insight.excerpt_translations, locale);
  const date = formatInsightDate(insight.published_at, locale);
  const imageSrc = getInsightImage(
    insight.featured_media_url,
    insight.slug,
    insight.category_slugs
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-card-lg border border-white/5 bg-card-dark transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/20">
      <Link
        href={`/insights/${insight.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
        aria-label={title}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-card-dark to-card-dark">
            <span className="font-display text-4xl font-black text-primary/40">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {insight.category_slugs[0] ? (
          <span className="absolute left-4 top-4 rounded border border-white/10 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
            {getCategoryLabel(insight.category_slugs[0], categories, locale)}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col space-y-3 p-6">
        <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-wider text-text-subtle">
          {date ? <span>{date}</span> : null}
          {date && insight.reading_time_minutes ? (
            <span aria-hidden="true" className="size-1 rounded-full bg-text-subtle/60" />
          ) : null}
          {insight.reading_time_minutes ? (
            <span>{tWithNumber(locale, "minRead", insight.reading_time_minutes)}</span>
          ) : null}
        </div>

        <h3 className="flex-1 font-display text-lg font-bold leading-snug text-text-primary">
          {title}
        </h3>

        {excerpt ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
            {excerpt}
          </p>
        ) : null}

        <Link
          href={`/insights/${insight.slug}`}
          className="group/link mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary-light"
        >
          {t(locale, "readArticle")}
          <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover/link:translate-x-1">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </article>
  );
}

export function InsightsGrid({
  insights,
  categories,
  locale,
}: {
  insights: PublicInsight[];
  categories: PublicInsightCategory[];
  locale: string;
}) {
  const [active, setActive] = React.useState<string>("all");

  const pills = [
    { slug: "all", label: t(locale, "filterAll") },
    ...categories.map((category) => ({
      slug: category.slug,
      label: resolveTranslation(category.name_translations, locale) || category.slug,
    })),
  ];

  const visible =
    active === "all"
      ? insights
      : insights.filter((insight) => insight.category_slugs.includes(active));

  return (
    <div>
      <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-8 lg:px-8">
        {pills.map((pill) => (
          <button
            key={pill.slug}
            type="button"
            aria-pressed={active === pill.slug}
            onClick={() => setActive(pill.slug)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
              active === pill.slug
                ? "bg-primary text-text-inverse shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : "border border-white/10 bg-white/5 text-text-primary hover:border-primary/30"
            )}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-sm text-text-muted">
          {t(locale, "noInsightsInCategory")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((insight) => (
            <InsightArticleCard
              key={insight.slug}
              insight={insight}
              categories={categories}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
