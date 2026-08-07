import type { ReactNode } from "react";
import type { PublicServiceDetail } from "@/features/services/queries";
import { ServiceIcon } from "@/components/ui/service-icon";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t } from "@/lib/i18n/ui-strings";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="mt-[-1px] size-[18px] shrink-0 text-primary"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * The homepage service card — full-width card with icon badge, localized
 * title/description, key deliverables and a caller-provided CTA slot.
 * Shared by the homepage ServicesSection and the chat ServicesPanel so both
 * render the exact same design.
 */
export function ServiceCard({
  service,
  locale,
  cta,
}: {
  service: PublicServiceDetail;
  locale: string;
  cta: ReactNode;
}) {
  const deliverables = (
    (service.deliverables_translations as Record<string, unknown> | null)?.[
      locale
    ] ??
    (service.deliverables_translations as Record<string, unknown> | null)?.[
      "en"
    ] ??
    []
  ) as string[];

  const title =
    resolveTranslation(service.title_translations, locale) ?? service.slug;
  const description = resolveTranslation(
    service.short_description_translations,
    locale
  );

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-card border border-card-border bg-card-dark p-6 shadow-shadow-lg transition-[border-color,transform,background-color] duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-card-border-hover active:translate-y-0 active:border-card-border-active active:bg-card-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2 md:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] group-hover:bg-primary/10"
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <ServiceIcon name={service.icon_name} />
        </div>

        <div>
          <h3 className="mb-2 font-display text-2xl font-bold tracking-tight text-text-primary">
            {title}
          </h3>
          {description ? (
            <p className="text-sm font-medium leading-relaxed text-text-muted">
              {description}
            </p>
          ) : null}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

        {deliverables.length > 0 ? (
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-primary opacity-90">
              {t(locale, "keyDeliverables")}
            </p>
            <ul className="space-y-3">
              {deliverables.slice(0, 4).map((item, index) => (
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

        <div className="flex-1" />

        <div>{cta}</div>
      </div>
    </div>
  );
}
