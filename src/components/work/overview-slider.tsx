"use client";

import * as React from "react";

/**
 * Lightweight slide showcase used in the case-study Project Overview panel.
 * Renders the framed media area with optional thumbnail strip underneath.
 * Clicking a thumbnail navigates to that slide. The dot indicators remain
 * for accessibility. A single-slide panel reads as a static image.
 */
export function OverviewSlider({
  slides,
  counterLabel,
  thumbnails,
}: {
  slides: React.ReactNode[];
  /** aria-label for the carousel region. */
  counterLabel: string;
  /** Optional thumbnail elements to display below the main image. */
  thumbnails?: React.ReactNode[];
}) {
  const [selectedIndex, setIndex] = React.useState(0);
  const count = slides.length;

  // Clamp to a valid slide if the list shrinks (e.g. data changes).
  const index = count > 0 ? selectedIndex % count : 0;

  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={counterLabel}
      className="w-full"
    >
      {/* Framed media area — one fully-visible slide at a time. */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-white/10 bg-card-dark">
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
      </div>

      {/* Dot row below the panel — matches the process section indicator. */}
      {count > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`size-1.5 rounded-full transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 ${
                i === index ? "bg-primary" : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      ) : null}

      {/* Thumbnail strip — small clickable images below the main image. */}
      {thumbnails && thumbnails.length > 0 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {thumbnails.map((thumbnail, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`relative size-16 overflow-hidden rounded-card border-2 transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 sm:size-20 ${
                i === index
                  ? "border-primary shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                  : "border-white/20 opacity-60 hover:border-white/40 hover:opacity-100"
              }`}
            >
              {thumbnail}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}