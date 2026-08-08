import Link from "next/link";
import Image from "next/image";
import type {
  PublicPortfolioProject,
  PublicPortfolioMetric,
} from "@/features/portfolio/queries";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";

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

export function RelatedProjects({
  projects,
  services,
  locale,
}: {
  projects: PublicPortfolioProject[];
  services: PublicServiceDetail[];
  locale: string;
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const title =
          resolveTranslation(project.title_translations, locale) || project.client_name;
        const metric: PublicPortfolioMetric | null = project.metrics[0] ?? null;
        const categorySlug = project.service_slugs[0];
        const categoryService = categorySlug
          ? services.find((s) => s.slug === categorySlug)
          : undefined;
        const categoryLabel = categoryService
          ? resolveTranslation(categoryService.title_translations, locale)
          : categorySlug;

        return (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="group block overflow-hidden rounded-card-lg border border-white/5 bg-card-dark transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/20 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-soft">
              {project.featured_media_url ? (
                <Image
                  src={project.featured_media_url}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-card-dark to-card-dark">
                  <span className="font-display text-5xl font-black text-primary/40">
                    {(project.client_name || "S").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {categoryLabel ? (
                <span className="absolute left-4 top-4 rounded bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-inverse">
                  {categoryLabel}
                </span>
              ) : null}
            </div>
            <div className="p-6">
              {metric ? (
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-black tabular-nums tracking-tight text-primary">
                    {metric.value}
                  </span>
                  {metric.label_translations ? (
                    <span className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                      {resolveTranslation(metric.label_translations, locale)}
                    </span>
                  ) : null}
                </div>
              ) : null}
              <h3 className="font-display text-lg font-bold leading-snug text-text-primary">
                {title}
              </h3>
              <span className="group/link mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary-light">
                View Case Study
                <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover/link:translate-x-1">
                  <ArrowIcon />
                </span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
