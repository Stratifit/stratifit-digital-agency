import { Quote } from "lucide-react";
import type { PublicTestimonial } from "@/features/testimonials/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { cn } from "@/lib/cn";

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

/**
 * Renders a quote, highlighting segments wrapped in `*asterisks*` in the
 * brand amber color. Non-matching text renders as plain strings — no HTML.
 */
function renderQuote(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, index) => {
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={index} className="font-semibold text-primary">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
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
  const quote = resolveTranslation(testimonial.quote_translations, locale);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-card border border-card-border bg-card-dark p-6 transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/20 md:p-8",
        className
      )}
    >
      {/* Gold quote icon */}
      <Quote
        aria-hidden="true"
        className="size-8 shrink-0 text-primary md:size-9"
        strokeWidth={1.5}
      />

      {/* Quote text */}
      <p className="mt-5 flex-1 text-base leading-relaxed text-text-secondary">
        {quote ? renderQuote(quote) : null}
      </p>

      {/* Footer: avatar, name, role, stars */}
      <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
        <div
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-gradient-to-br from-surface-hover to-surface-active text-sm font-bold text-white"
        >
          {initials(testimonial.person_name)}
        </div>
        <div className="min-w-0">
          <div className="truncate font-display font-bold text-text-primary">
            {testimonial.person_name}
          </div>
          <div className="mt-0.5 truncate text-sm text-text-muted">
            {resolveTranslation(testimonial.person_role_translations, locale) ||
              testimonial.company_name}
          </div>
          <div
            className="mt-1.5 flex gap-1"
            role="img"
            aria-label="5 out of 5 stars"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
