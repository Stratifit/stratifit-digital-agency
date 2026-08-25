"use client";

import * as React from "react";

/**
 * Lightweight slide showcase used in the case-study artwork panels. Fills its
 * parent (caller sets the aspect/size) and renders one slide at a time with
 * prev/next controls, a "1 / N" counter and dot indicators. The controls only
 * appear when there are two or more slides, so a single-slide panel reads as a
 * single image while still being ready to carry a full set.
 */
export function OverviewSlider({
  slides,
  counterLabel,
}: {
  slides: React.ReactNode[];
  /** aria-label for the carousel region. */
  counterLabel: string;
}) {
  const [selectedIndex, setIndex] = React.useState(0);
  const count = slides.length;

  // Clamp to a valid slide if the list shrinks (e.g. data changes).
  const index = count > 0 ? selectedIndex % count : 0;

  if (count === 0) return null;

  const previous = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <div
      className="group relative h-full w-full overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label={counterLabel}
    >
      {/* Slide track — one fully-visible frame at a time. */}
      <div
        aria-live="polite"
        className="flex h-full w-full transition-transform duration-500 ease-[var(--ease-standard)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className="relative h-full w-full shrink-0"
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Controls — shown only when there is more than one slide. */}
      {count > 1 ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-3 top-3 flex items-center justify-between px-3">
            <button
              type="button"
              onClick={previous}
              aria-label={`Previous slide (${index + 1} of ${count})`}
              className="pointer-events-auto flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-4 -translate-x-px"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={`Next slide (${index + 1} of ${count})`}
              className="pointer-events-auto flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-4 translate-x-px"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={
                    i === index
                      ? "h-1.5 w-5 rounded-full bg-primary"
                      : "h-1.5 w-1.5 rounded-full bg-white/40 transition-colors hover:bg-white/70"
                  }
                />
              ))}
            </div>
            <span className="ml-2 font-display text-xs font-black tabular-nums text-white">
              {String(index + 1).padStart(2, "0")}
              <span className="text-white/50">
                {" "}
                / {String(count).padStart(2, "0")}
              </span>
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}