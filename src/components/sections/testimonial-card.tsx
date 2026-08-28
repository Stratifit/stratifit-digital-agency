import type { PublicTestimonial } from "@/features/testimonials/queries";
import { resolvePublicTranslation as resolveTranslation } from "@/lib/i18n/public-translation";
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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
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
        "relative flex h-full flex-col rounded-card border border-card-border bg-card-dark p-6 transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-card-border-hover md:p-8",
        className
      )}
    >
      {/* Top row: stars left, Google icon right for Google-sourced reviews */}
      <div className="flex items-center justify-between gap-4">
        <div
          className="flex gap-1"
          role="img"
          aria-label={tWithNumber(locale, "starsOutOfFive", 5)}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
        {testimonial.source === "google" ? (
          <GoogleIcon className="size-5 shrink-0" />
        ) : null}
      </div>

      {/* Quote */}
      <blockquote className="mt-5 font-display text-lg font-bold leading-snug tracking-tight text-text-primary sm:text-xl">
        {resolveTranslation(testimonial.quote_translations, locale)}
      </blockquote>

      {/* Divider + author footer pinned to the bottom */}
      <div className="mt-auto">
        <div className="mt-6 border-t border-card-border" aria-hidden="true" />

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
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-card-border bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              <CheckIcon />
              {t(locale, "verified")}
            </span>
          ) : null}
        </footer>
      </div>
    </article>
  );
}
