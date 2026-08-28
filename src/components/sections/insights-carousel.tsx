"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { PublicInsight } from "@/features/insights/queries";
import type { PublicInsightCategory } from "@/features/insights/queries";
import { getInsightImage } from "@/features/insights/display";
import { resolvePublicTranslation as resolveTranslation } from "@/lib/i18n/public-translation";
import { t } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";
import { FilterPills } from "@/components/ui/filter-pills";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4", className)}
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function InsightCard({
  insight,
  categories,
  locale,
}: {
  insight: PublicInsight;
  categories: PublicInsightCategory[];
  locale: string;
}) {
  const categoryLabel = (slug: string) => {
    const category = categories.find((c) => c.slug === slug);
    return category
      ? resolveTranslation(category.name_translations, locale)
      : slug;
  };

  const imageSrc = getInsightImage(
    insight.featured_media_url,
    insight.slug,
    insight.category_slugs
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-card-border bg-card-dark transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/20">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-soft">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={resolveTranslation(insight.title_translations, locale) || "Insight"}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-card-dark to-card-dark">
            <span className="font-display text-4xl font-black text-primary/40">
              {(resolveTranslation(insight.title_translations, locale) || "I").charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {insight.category_slugs[0] ? (
          <span className="absolute left-4 top-4 rounded border border-white/10 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
            {categoryLabel(insight.category_slugs[0])}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col space-y-3 p-6">
        <h3 className="font-display text-base font-bold leading-snug text-text-primary sm:text-lg">
          {resolveTranslation(insight.title_translations, locale)}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
          {resolveTranslation(insight.excerpt_translations, locale)}
        </p>
        <Link
          href={`/insights/${insight.slug}`}
          className="group/link mt-auto inline-flex items-center gap-2 pt-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:brightness-110"
        >
          {t(locale, "readInsight")}
          <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover/link:translate-x-1">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </article>
  );
}

/**
 * One snap-scroll carousel for every breakpoint (same pattern as the
 * testimonials carousel): touch/drag swipes on mobile, round arrow buttons on
 * md+ desktop, and a shared active-dot row.
 */
export function InsightsCarousel({
  insights,
  categories,
  locale,
}: {
  insights: PublicInsight[];
  categories: PublicInsightCategory[];
  locale: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const [activeFilter, setActiveFilter] = React.useState("all");

  const visibleCategories = categories.slice(0, 7);
  const pills = [
    { slug: "all", label: t(locale, "filterAll") },
    ...visibleCategories.map((category) => ({
      slug: category.slug,
      label:
        resolveTranslation(category.name_translations, locale) ||
        category.slug,
    })),
  ];

  const filtered =
    activeFilter === "all"
      ? insights        : insights.filter((insight) =>
            insight.category_slugs.includes(activeFilter)
          );

  function selectFilter(slug: string) {
    setActiveFilter(slug);
    setActive(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-insight-card]"));
    let best = 0;
    let bestDistance = Infinity;
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const mid = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(mid - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    setActive(best);
  }

  function scrollByCard(direction: number) {
    scrollRef.current?.scrollBy({
      left: direction * 380,
      behavior: "smooth",
    });
  }

  return (
    <div>
      <FilterPills
        className="-mx-6 mt-10 mb-10 px-6 pb-0 lg:-mx-8 lg:px-8"
        pills={pills}
        active={activeFilter}
        onSelect={selectFilter}
      />

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-text-muted">
          {t(locale, "noInsightsInCategory")}
        </p>
      ) : (
        <>
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="-mx-6 flex touch-pan-x touch-pan-y overscroll-x-contain snap-x snap-proximity gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-8 lg:-mx-8 lg:px-8"
            >
              {filtered.map((insight) => (
                <div
                  key={insight.slug}
                  data-insight-card
                  className="w-[80vw] min-w-[280px] max-w-[340px] shrink-0 snap-center sm:w-[360px] sm:min-w-[360px] sm:max-w-none lg:w-[calc((100%-4.5rem)/4)] lg:min-w-0 lg:max-w-none"
                >
                  <InsightCard
                    insight={insight}
                    categories={categories}
                    locale={locale}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              aria-label={t(locale, "scrollLeft")}
              onClick={() => scrollByCard(-1)}
              className="absolute -left-20 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary hover:text-black md:flex"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              aria-label={t(locale, "scrollRight")}
              onClick={() => scrollByCard(1)}
              className="absolute -right-20 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary hover:text-black md:flex"
            >
              <ArrowIcon className="size-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5" aria-label="Insight carousel pagination">
              {filtered.length > 1
                ? filtered.map((insight, index) => (
                    <span
                      key={insight.slug}
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 rounded-full transition-colors duration-200 ease-out",
                        index === active ? "bg-primary" : "bg-white/20"
                      )}
                    />
                  ))
                : null}
            </div>
            <Link
              href="/insights"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:brightness-110 md:text-sm"
            >
              {t(locale, "viewAll")}
              <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </>
      )}

    </div>
  );
}
