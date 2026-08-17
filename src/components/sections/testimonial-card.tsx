import type { PublicTestimonial } from "@/features/testimonials/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { cn } from "@/lib/cn";
import { t, tWithNumber } from "@/lib/i18n/ui-strings";

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4 text-primary"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-3 shrink-0"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialCard({
  testimonial,
  locale,
  className,
}: {
  testimonial: PublicTestimonial;
  locale: string;
  className?: string;
}) {
  const name = testimonial.person_name;
  const role =
    resolveTranslation(testimonial.person_role_translations, locale) ||
    testimonial.company_name;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-card border border-primary/25 bg-card-dark p-6 transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/40 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.25)] md:p-8",
        className
      )}
    >
      {/* Top row: decorative quote + stars */}
      <div className="flex items-center justify-between gap-4">
        <span
          aria-hidden="true"
          className="select-none font-display text-4xl font-black leading-none text-primary md:text-5xl"
        >
          &ldquo;
        </span>
        <div
          className="flex gap-1"
          role="img"
          aria-label={tWithNumber(locale, "starsOutOfFive", 5)}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
      </div>

      {/* Quote */}
      <blockquote className="mt-5 font-display text-lg font-bold leading-snug tracking-tight text-text-primary sm:text-xl">
        {resolveTranslation(testimonial.quote_translations, locale)}
      </blockquote>

      {/* Divider + author footer pinned to the bottom */}
      <div className="mt-auto">
        <div className="mt-6 border-t border-primary/10" aria-hidden="true" />

        <footer className="mt-5 flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-surface-hover to-surface-active text-xs font-bold text-white">
            {initials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display font-bold text-text-primary">
              {name}
            </div>
            {role ? (
              <div className="mt-0.5 truncate text-xs text-text-subtle">
                {role}
              </div>
            ) : null}
          </div>
          {testimonial.is_verified ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <CheckIcon />
              {t(locale, "verified")}
            </span>
          ) : null}
        </footer>
      </div>
    </article>
  );
}
