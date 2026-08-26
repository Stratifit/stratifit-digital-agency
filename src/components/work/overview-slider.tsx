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
  thumbnailSlideOffset = 0,
  badge,
}: {
  slides: React.ReactNode[];
  /** aria-label for the carousel region. */
  counterLabel: string;
  /** Optional thumbnail elements to display below the main image. */
  thumbnails?: React.ReactNode[];
  /** Slide index offset when thumbnails omit a leading slide. */
  thumbnailSlideOffset?: number;
  /** Optional badge label (e.g. "Before") shown on the main image. */
  badge?: string;
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
      {/* Main image and thumbnails container — feels like one unit. */}
      <div className="rounded-card border border-white/10 bg-card-dark overflow-hidden">
        {/* Framed media area — one fully-visible slide at a time. */}
        <div className="relative aspect-[4/3] overflow-hidden">
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
          {/* Badge label — always visible on main image. */}
          {badge ? (
            <span className="absolute bottom-3 right-3 rounded-full border border-primary/50 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
              {badge}
            </span>
          ) : null}
        </div>

        {/* Thumbnail strip — small clickable images directly below main image. */}
        {thumbnails && thumbnails.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 border-t border-white/10 p-3 sm:flex sm:items-center sm:justify-center sm:gap-3">
            {thumbnails.map((thumbnail, i) => {
              const slideIndex = i + thumbnailSlideOffset;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(slideIndex)}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                  aria-current={slideIndex === index ? "true" : undefined}
                  className={`relative aspect-square w-full min-w-0 overflow-hidden rounded border-2 transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 sm:size-20 sm:w-auto ${
                    slideIndex === index
                      ? "border-primary shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                      : "border-white/20 opacity-60 hover:border-white/40 hover:opacity-100"
                  }`}
                >
                  {thumbnail}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Dot row below the thumbnails — matches the process section indicator. */}
      {count > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-1.5">
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
    </div>
  );
}