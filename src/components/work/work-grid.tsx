"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type {
  PublicPortfolioProject,
  PublicPortfolioMetric,
} from "@/features/portfolio/queries";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t } from "@/lib/i18n/ui-strings";
import { FilterPills } from "@/components/ui/filter-pills";

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

function MetricHighlight({
  metric,
  locale,
}: {
  metric: PublicPortfolioMetric;
  locale: string;
}) {
  const label = metric.label_translations
    ? resolveTranslation(metric.label_translations, locale)
    : "";
  return (
    <div className="mb-1 flex items-baseline gap-2 sm:gap-3">
      <span className="shrink-0 font-display text-2xl font-black tabular-nums tracking-tight text-primary">
        {metric.value}
      </span>
      {label ? (
        <span className="min-w-0 flex-1 truncate text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
          {label}
        </span>
      ) : null}
    </div>
  );
}

function WorkProjectCard({
  project,
  services,
  locale,
}: {
  project: PublicPortfolioProject;
  services: PublicServiceDetail[];
  locale: string;
}) {
  const title =
    resolveTranslation(project.title_translations, locale) || project.client_name;
  const summary = resolveTranslation(project.summary_translations, locale);
  const metric = project.metrics[0] ?? null;

  const categorySlug = project.service_slugs[0];
  const categoryService = categorySlug
    ? services.find((s) => s.slug === categorySlug)
    : undefined;
  const categoryLabel = categoryService
    ? resolveTranslation(categoryService.title_translations, locale)
    : categorySlug;

  const tags =
    project.deliverables_translations?.[locale] ??
    project.deliverables_translations?.en ??
    [];

  return (
    <article className="group flex flex-col overflow-hidden rounded-card-lg border border-white/5 bg-card-dark transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/20">
      <Link
        href={`/work/${project.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
        aria-label={title}
      >
        {project.featured_media_url ? (
          <Image
            src={project.featured_media_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-card-dark to-card-dark">
            <span className="font-display text-5xl font-black text-primary/40">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {categoryLabel ? (
          <span className="absolute left-4 top-4 rounded bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-inverse">
            {categoryLabel}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col space-y-3 p-6">
        {metric ? <MetricHighlight metric={metric} locale={locale} /> : null}

        <h3 className="font-display text-xl font-bold leading-snug text-text-primary">
          {title}
        </h3>

        {summary ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
            {summary}
          </p>
        ) : null}

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <Link
          href={`/work/${project.slug}`}
          className="group/link mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary-light"
        >
          {t(locale, "viewCaseStudy")}
          <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover/link:translate-x-1">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </article>
  );
}

export function WorkGrid({
  projects,
  services,
  locale,
}: {
  projects: PublicPortfolioProject[];
  services: PublicServiceDetail[];
  locale: string;
}) {
  const [active, setActive] = React.useState<string>("all");

  const categories = services.filter((service) =>
    projects.some((project) => project.service_slugs.includes(service.slug))
  );

  const pills = [
    { slug: "all", label: t(locale, "filterAll") },
    ...categories.map((service) => ({
      slug: service.slug,
      label: resolveTranslation(service.title_translations, locale) || service.slug,
    })),
  ];

  const visible =
    active === "all"
      ? projects
      : projects.filter((project) => project.service_slugs.includes(active));

  return (
    <div>
      <FilterPills
        className="-mx-6 mt-10 mb-10 px-6 pb-0 lg:-mx-8 lg:px-8"
        pills={pills}
        active={active}
        onSelect={setActive}
      />

      {visible.length === 0 ? (
        <p className="py-20 text-center text-sm text-text-muted">
          No projects in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {visible.map((project) => (
            <WorkProjectCard
              key={project.slug}
              project={project}
              services={services}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
