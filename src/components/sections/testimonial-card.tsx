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
      {/* Decorative quote mark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 left-4 select-none font-display text-7xl font-black leading-none text-primary/25"
      >
        &ldquo;
      </span>

      <div className="relative flex flex-1 flex-col">
        <div
          className="mb-4 flex gap-1"
          role="img"
          aria-label={tWithNumber(locale, "starsOutOfFive", 5)}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>

        <blockquote className="font-display text-lg font-bold leading-snug tracking-tight text-text-primary sm:text-xl">
          &ldquo;
          {resolveTranslation(testimonial.quote_translations, locale)}
          &rdquo;
        </blockquote>

        <div className="mt-auto flex items-center gap-3 pt-7">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-surface-hover to-surface-active text-sm font-bold text-white">
            {initials(name)}
          </div>
          <div className="min-w-0">
            <div className="truncate font-display font-bold text-text-primary">
              {name}
            </div>
            <div className="mt-0.5 truncate text-xs text-text-subtle">
              {role ? (
                <>
                  {role}
                  <span className="mx-1.5 text-primary/40">·</span>
                </>
              ) : null}
              {t(locale, "verifiedClient")}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
