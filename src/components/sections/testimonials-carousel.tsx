"use client";

import * as React from "react";
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

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
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

export function TestimonialsCarousel({
  testimonials,
  locale,
}: {
  testimonials: PublicTestimonial[];
  locale: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = Array.from(
      el.querySelectorAll<HTMLElement>("[data-testimonial-card]")
    );
    let best = 0;
    let bestDistance = Infinity;
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const mid = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(mid - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    setActive(best);
  }

  function scrollByCard(direction: number) {
    scrollRef.current?.scrollBy({
      left: direction * 380,
      behavior: "smooth",
    });
  }

  return (
    <div>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-8 lg:px-8"
        >
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              data-testimonial-card
              className="min-w-[300px] w-[300px] shrink-0 snap-center rounded-2xl border border-card-border bg-card-dark p-6 transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/20 md:p-8 sm:w-[360px] md:w-[400px]"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-surface-hover to-surface-active text-sm font-bold text-white">
                  {initials(testimonial.person_name)}
                </div>
                <div>
                  <div className="font-display font-bold text-text-primary">
                    {testimonial.person_name}
                  </div>
                  <div className="mt-0.5 text-xs uppercase tracking-wide text-text-subtle">
                    {resolveTranslation(
                      testimonial.person_role_translations,
                      locale
                    ) || testimonial.company_name}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-text-secondary">
                &ldquo;
                {resolveTranslation(testimonial.quote_translations, locale)}
                &rdquo;
              </p>
            </article>
          ))}
        </div>

        <button
          type="button"
          aria-label="Scroll testimonials left"
          onClick={() => scrollByCard(-1)}
          className="absolute -left-20 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary hover:text-black md:flex"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          aria-label="Scroll testimonials right"
          onClick={() => scrollByCard(1)}
          className="absolute -right-20 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary hover:text-black md:flex"
        >
          <ArrowIcon />
        </button>
      </div>

      {testimonials.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {testimonials.map((testimonial, index) => (
            <span
              key={index}
              className={cn(
                "size-1.5 rounded-full transition-colors duration-200 ease-out",
                index === active ? "bg-primary" : "bg-white/20"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
