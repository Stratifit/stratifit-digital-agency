import type { ReactNode } from "react";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { cn } from "@/lib/cn";

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
}

/**
 * Compact closing CTA used at the bottom of public pages.
 * Title + description sit on the left and the action button on the right in a
 * single line on desktop (stacked on mobile), styled like the FAQ help card:
 * dark card, subtle border, amber glow on hover. The button label is provided
 * per page so it can reflect the page's service.
 */
export function CtaCard({
  title,
  description,
  label,
  href = "/contact",
  className,
}: CtaCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col gap-5 rounded-card border border-white/10 bg-card-dark p-6 transition-all duration-300 ease-[var(--ease-standard)] hover:border-primary/30 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)] sm:p-8 md:flex-row md:items-center md:justify-between md:gap-10",
        className
      )}
    >
      <div className="max-w-2xl">
        <h2 className="font-display text-xl font-black leading-tight tracking-tight text-text-primary sm:text-2xl md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
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
  );
}
