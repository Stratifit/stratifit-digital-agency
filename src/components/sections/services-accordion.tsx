"use client";

import * as React from "react";
import type { PublicServiceDetail } from "@/features/services/queries";
import { ServiceIcon } from "@/components/ui/service-icon";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";
import { CheckIcon, ServiceCardCta } from "./service-card";

/**
 * Modern dropdown-style services list — one expandable row per service.
 * Rows stay compact; expanding reveals the description, key deliverables
 * checklist, and CTA. Content is always rendered in the DOM (visually
 * collapsed via grid-rows), so it remains crawlable and accessible.
 */
export function ServicesAccordion({
  services,
  locale,
  detailSlugs,
  className,
}: {
  services: PublicServiceDetail[];
  locale: string;
  /** Slugs that have a dedicated service detail page. */
  detailSlugs: string[];
  className?: string;
}) {
  const [openSlug, setOpenSlug] = React.useState<string | null>(
    services[0]?.slug ?? null
  );
  const pageSlugs = React.useMemo(() => new Set(detailSlugs), [detailSlugs]);

  return (
    <div className={cn("space-y-3", className)}>
      {services.map((service) => {
        const open = openSlug === service.slug;
        const title =
          resolveTranslation(service.title_translations, locale) ??
          service.slug;
        const short = resolveTranslation(
          service.short_description_translations,
          locale
        );
        const full = resolveTranslation(
          service.full_description_translations,
          locale
        );
        const deliverables = (
          (service.deliverables_translations as Record<string, unknown> | null)?.[
            locale
          ] ??
          (service.deliverables_translations as Record<string, unknown> | null)?.[
            "en"
          ] ??
          []
        ) as string[];

        return (
          <div
            key={service.slug}
            className={cn(
              "overflow-hidden rounded-card border bg-card-dark shadow-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
              open ? "border-primary/30" : "border-card-border hover:border-card-border-hover"
            )}
          >
            <h3>
              <button
                type="button"
                onClick={() => setOpenSlug(open ? null : service.slug)}
                aria-expanded={open}
                aria-controls={`service-panel-${service.slug}`}
                id={`service-trigger-${service.slug}`}
                className={cn(
                  "flex w-full items-center gap-4 px-5 py-5 text-left transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 sm:px-6",
                  open && "bg-surface-soft"
                )}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5">
                  <ServiceIcon name={service.icon_name} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg font-bold tracking-tight text-text-primary sm:text-xl">
                    {title}
                  </span>
                  {short ? (
                    <span className="mt-0.5 block truncate text-sm text-text-muted">
                      {short}
                    </span>
                  ) : null}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={cn(
                    "size-5 shrink-0 text-text-muted transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
                    open && "rotate-180 text-primary"
                  )}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>

            <div
              id={`service-panel-${service.slug}`}
              role="region"
              aria-labelledby={`service-trigger-${service.slug}`}
              className={cn(
                "grid transition-[grid-template-rows] duration-[var(--motion-medium)] ease-[var(--ease-standard)]",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-white/5 px-5 py-6 sm:px-6">
                  {full ? (
                    <p className="max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
                      {full}
                    </p>
                  ) : null}

                  {deliverables.length > 0 ? (
                    <div className="mt-6">
                      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-primary opacity-90">
                        {t(locale, "keyDeliverables")}
                      </p>
                      <ul className="grid max-w-3xl gap-x-8 gap-y-3 sm:grid-cols-2">
                        {deliverables.slice(0, 6).map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckIcon />
                            <span className="text-sm font-medium text-text-tertiary">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-6 flex">
                    <ServiceCardCta
                      service={service}
                      locale={locale}
                      hasDetailPage={pageSlugs.has(service.slug)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
