import type { ReactNode } from "react";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n/ui-strings";

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export interface CtaCardProps {
  title: ReactNode;
  description?: string;
  label: string;
  href?: string;
  className?: string;
  locale?: string;
}

/**
 * Premium closing CTA used at the bottom of public pages.
 * Title + description sit on the left and the action button on the right in a
 * single line on desktop (stacked on mobile). The card carries a shimmer
 * top line, ambient amber glows, and a sparkle eyebrow for a refined finish.
 * The button label is provided per page so it can reflect the page's service.
 */
export function CtaCard({
  title,
  description,
  label,
  href = "/contact",
  className,
  locale = "en",
}: CtaCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-card-lg border border-white/10 bg-card-dark p-6 transition-all duration-300 ease-[var(--ease-standard)] hover:border-primary/30 hover:shadow-[0_0_40px_-8px_rgba(245,158,11,0.3)] sm:p-8 md:p-10",
        className
      )}
    >
      {/* Shimmer top line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />

      {/* Ambient amber glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[260px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] transition-opacity duration-500 group-hover:opacity-150" />
        <div className="absolute -bottom-20 left-1/4 h-[160px] w-[320px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <SparkleIcon className="size-4 shrink-0 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              {t(locale, "servicesReadyWhenYouAre")}
            </span>
          </div>
          <h2 className="font-display text-sm font-black leading-[1.1] tracking-tight text-text-primary sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-xl text-[10px] leading-relaxed text-text-muted sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <ContactAwareLink
          href={href}
          size="large"
          className="w-full justify-center md:w-auto md:shrink-0"
        >
          {label}
          <ArrowRightIcon className="size-4 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1" />
        </ContactAwareLink>
      </div>
    </div>
  );
}
