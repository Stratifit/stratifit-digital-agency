"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

const SLIDE_MS = 4000;

interface AnnouncementViewProps {
  slides: string[];
  linkUrl?: string;
  linkLabel?: string;
}

export function AnnouncementBarView({ slides, linkUrl, linkLabel }: AnnouncementViewProps) {
  const [index, setIndex] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (dismissed) return null;

  const message = slides[index] ?? slides[0];
  const showDots = slides.length > 1;

  function go(delta: number) {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 40) return;
    go(deltaX < 0 ? 1 : -1);
  }

  return (
    <div className="border-b border-border bg-primary">
      {/* Slimmer horizontal padding than the shared Container (px-5 instead
          of px-6) so the announcement strip feels less bulky. */}
      <div className="mx-auto flex h-10 w-full max-w-[var(--container-lg)] items-center gap-3 px-5 lg:px-8">
        <div
          className="flex min-w-0 flex-1 touch-pan-y items-center gap-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <span key={index} className="truncate text-sm font-medium text-text-inverse">
            {message}
          </span>
          {linkUrl ? (
            <a
              href={linkUrl}
              aria-label={linkLabel ?? "Learn more"}
              className="flex shrink-0 items-center gap-1 text-sm font-bold text-text-inverse transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-text-inverse/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse"
            >
              <span className="hidden sm:inline">{linkLabel}</span>
              <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ) : null}

          {showDots ? (
            <div className="flex shrink-0 items-center gap-1.5" aria-label="Slides">
              {slides.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  aria-label={`Go to slide ${dotIndex + 1}`}
                  aria-current={dotIndex === index ? "true" : undefined}
                  onClick={() => setIndex(dotIndex)}
                  className={cn(
                    "size-1.5 rounded-full transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse",
                    dotIndex === index
                      ? "bg-text-inverse"
                      : "bg-text-inverse/30 hover:bg-text-inverse/50"
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-xs p-1 text-text-inverse transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-text-inverse/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse"
        >
          <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
