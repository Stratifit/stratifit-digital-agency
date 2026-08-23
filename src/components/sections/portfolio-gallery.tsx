"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { PublicPortfolioProject } from "@/features/portfolio/queries";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";
import { FilterPills } from "@/components/ui/filter-pills";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Brand-design cards render a 2x2 thumbnail grid; every other card keeps its
 * full cover image. Brand-design projects are linked to the `brand-design`
 * service (migration 00030: Maison Lumière, Aura Cosmetics).
 */
function isBrandDesignCard(project: PublicPortfolioProject): boolean {
  return project.service_slugs.includes("brand-design");
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

export function PortfolioGallery({
  projects,
  services,
  locale,
  hideFilters = false,
}: {
  projects: PublicPortfolioProject[];
  services: PublicServiceDetail[];
  locale: string;
  hideFilters?: boolean;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = React.useState("all");
  const [activeCard, setActiveCard] = React.useState(0);

  const categories = hideFilters
    ? []
    : services.filter((service) =>
        projects.some((project) => project.service_slugs.includes(service.slug))
      );

  const filtered =
    hideFilters || activeFilter === "all"
      ? projects
      : projects.filter((project) =>
          project.service_slugs.includes(activeFilter)
        );

  function categoryLabel(slug: string): string {
    const service = services.find((s) => s.slug === slug);
    return service ? resolveTranslation(service.title_translations, locale) : slug;
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-project-card]"));
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
    setActiveCard(best);
  }

  function scrollByCard(direction: number) {
    scrollRef.current?.scrollBy({
      left: direction * 360,
      behavior: "smooth",
    });
  }

  function selectFilter(slug: string) {
    setActiveFilter(slug);
    setActiveCard(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }

  return (
    <div>
      {!hideFilters ? (
        <FilterPills
          className="-mx-6 mt-10 mb-10 px-6 pb-0 lg:-mx-8 lg:px-8"
          pills={[
            { slug: "all", label: t(locale, "filterAll") },
            ...categories.map((service) => ({
              slug: service.slug,
              label:
                resolveTranslation(service.title_translations, locale) ||
                service.slug,
            })),
          ]}
          active={activeFilter}
          onSelect={selectFilter}
        />
      ) : null}

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="-mx-6 flex touch-pan-x touch-pan-y overscroll-x-contain snap-x snap-proximity gap-8 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-8 lg:px-8"
        >
          {filtered.map((project) => (
            <article
              key={project.slug}
              data-project-card
              className="group w-[300px] shrink-0 snap-center overflow-hidden rounded-card border border-card-border bg-card-dark transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/20 sm:w-[340px] md:w-[380px]"
            >
              {isBrandDesignCard(project) ? (
                <div className="relative p-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    {Array.from({ length: 4 }).map((_, index) => {
                      const src = project.card_images[index];
                      const title =
                        resolveTranslation(
                          project.title_translations,
                          locale
                        ) || project.client_name;
                      return src ? (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-sm bg-surface-soft"
                        >
                          <Image
                            src={src}
                            alt={`${title} — image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 180px"
                            className="object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="flex aspect-square items-center justify-center overflow-hidden rounded-sm bg-surface-soft"
                        >
                          <span className="font-display text-lg font-black text-primary/25">
                            {(project.client_name || "S")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {project.service_slugs[0] ? (
                    <span className="absolute left-3 top-3 rounded bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                      {categoryLabel(project.service_slugs[0])}
                    </span>
                  ) : null}
                </div>
              ) : (
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-soft">
                  {project.featured_media_url ? (
                    <Image
                      src={project.featured_media_url}
                      alt={
                        resolveTranslation(
                          project.title_translations,
                          locale
                        ) || project.client_name
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-card-dark to-card-dark">
                      <span className="font-display text-5xl font-black text-primary/40">
                        {(project.client_name || "S").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {project.service_slugs[0] ? (
                    <span className="absolute left-4 top-4 rounded bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                      {categoryLabel(project.service_slugs[0])}
                    </span>
                  ) : null}
                </div>
              )}

              <div className="space-y-3 p-6">
                <h3 className="font-display text-xl font-bold text-text-primary">
                  {resolveTranslation(project.title_translations, locale)}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
                  {resolveTranslation(project.summary_translations, locale)}
                </p>
                <Link
                  href={`/work/${project.slug}`}
                  className="group/link inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:brightness-110"
                >
                  {t(locale, "viewCaseStudy")}
                  <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover/link:translate-x-1">
                    <ArrowIcon />
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          aria-label="Scroll portfolio left"
          onClick={() => scrollByCard(-1)}
          className="absolute -left-20 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary hover:text-black md:flex disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-black/70 disabled:hover:text-white"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          aria-label="Scroll portfolio right"
          onClick={() => scrollByCard(1)}
          className="absolute -right-20 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary hover:text-black md:flex"
        >
          <ArrowIcon />
        </button>
      </div>

      <div className="relative mt-6 flex items-center justify-center gap-1.5 md:hidden">
        {filtered.map((project, index) => (
          <span
            key={project.slug}
            className={cn(
              "size-1.5 rounded-full transition-colors duration-200 ease-out",
              index === activeCard ? "bg-primary" : "bg-white/20"
            )}
          />
        ))}
        <Link
          href="/work"
          className="absolute right-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:brightness-110"
        >
          View All
          <span className="text-[10px]">
            <ArrowIcon />
          </span>
        </Link>
      </div>

      <div className="mt-8 hidden justify-end md:flex">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:brightness-110"
        >
          View All Projects
          <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </div>
  );
}
