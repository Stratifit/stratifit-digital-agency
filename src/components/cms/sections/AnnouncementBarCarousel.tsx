// ============================================================================
// Stratifit — Announcement Bar Carousel
// Client component: fetches slides from API, auto-slides, swipe, close, CTA.
// ============================================================================

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CmsLanguage } from "@/lib/types/cms";
import type { CmsAnnouncementSlide } from "@/lib/types/announcement";

export interface LocalizedSlide {
  id: string;
  message: string;
  sticky: boolean;
  url: string;
}

interface AnnouncementBarCarouselProps {
  autoSlideInterval?: number;
  locale?: CmsLanguage;
  initialSlides?: CmsAnnouncementSlide[];
}

function localizeSlide(
  slide: CmsAnnouncementSlide,
  locale: CmsLanguage
): LocalizedSlide {
  let message = slide.messageTranslations.en;
  if (locale === "fr") message = slide.messageTranslations.fr;
  if (locale === "de") message = slide.messageTranslations.de;
  if (locale === "es") message = slide.messageTranslations.es;

  return {
    id: slide.id,
    message,
    sticky: slide.sticky,
    url: slide.url,
  };
}

export function AnnouncementBarCarousel({
  autoSlideInterval = 5000,
  locale = "en",
  initialSlides,
}: AnnouncementBarCarouselProps) {
  const [slides, setSlides] = useState<LocalizedSlide[]>(() =>
    initialSlides ? initialSlides.map((s) => localizeSlide(s, locale)) : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(!initialSlides);
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Fetch slides from the API on mount if no server-provided slides
  useEffect(() => {
    if (initialSlides) {
      setLoading(false);
      return;
    }

    async function fetchSlides() {
      try {
        const res = await fetch("/api/cms/announcement-slides");
        if (res.ok) {
          const data = (await res.json()) as CmsAnnouncementSlide[];
          const mapped = data.map((slide) => localizeSlide(slide, locale));
          setSlides(mapped);
        } else {
          console.error(
            "[AnnouncementBarCarousel] API error:",
            res.status,
            await res.text()
          );
        }
      } catch (err) {
        console.error("[AnnouncementBarCarousel] Failed to fetch slides:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSlides();
  }, [initialSlides, locale]);

  // Auto-slide logic
  const goToNext = useCallback(() => {
    setSlideDir("left");
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setSlideDir("right");
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goToNext, autoSlideInterval);
    return () => clearInterval(timer);
  }, [goToNext, autoSlideInterval, slides.length]);

  // Swipe handling on mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.changedTouches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = Math.abs(touch.clientX - touchStartRef.current.x);
      const dy = Math.abs(touch.clientY - touchStartRef.current.y);
      // If horizontal movement clearly dominates, claim the gesture so the
      // browser doesn't scroll vertically while the user is swiping slides.
      if (dx > dy * 1.5 && dx > 20) {
        e.preventDefault();
      }
    },
    []
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const start = touchStartRef.current;
      const dx = start.x - touch.clientX;
      const dy = start.y - touch.clientY;
      const threshold = 25;
      // Only change slide on a mostly horizontal swipe.
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        if (dx > 0) goToNext();
        else goToPrev();
      }
      touchStartRef.current = null;
    },
    [goToNext, goToPrev]
  );

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  // Loading / empty / dismissed states
  if (loading) return null;
  if (dismissed || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];
  const isSticky = currentSlide?.sticky ?? false;

  const Dot = ({ index }: { index: number }) => (
    <button
      onClick={() => setCurrentIndex(index)}
      className="inline-flex items-center justify-center w-3 h-3 rounded-full"
      aria-label={`Go to slide ${index + 1}`}
    >
      <span
        className={`rounded-full transition-colors duration-fast ${
          index === currentIndex
            ? "bg-surface-dark w-1 h-1"
            : "bg-surface-dark/30 hover:bg-surface-dark/60 w-1 h-1"
        }`}
      />
    </button>
  );

  return (
    <div
      data-testid="announcement-bar"
      className={`w-full touch-pan-y bg-brand-gold border-b border-brand-gold-600 ${
        isSticky ? "fixed top-0 left-0 right-0 z-50" : ""
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-center h-7 sm:h-8 px-6 sm:px-10">
        {/* Left spacer — keeps content centered in the available space */}
        <div />

        {/* Slide message + CTA + dots, centered in the middle column */}
        <div className="flex items-center justify-center gap-2 min-w-0 max-w-full overflow-hidden">
          <div
            key={currentIndex}
            className={`flex items-center justify-center gap-2 min-w-0 ${
              slideDir === "left" ? "animate-slide-left" : "animate-slide-right"
            }`}
          >
            <span className="font-body text-caption sm:text-body-sm text-surface-dark text-center truncate">
              {currentSlide?.message ?? ""}
            </span>

            {/* CTA arrow */}
            {currentSlide?.url && (
              <a
                href={currentSlide.url}
                className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full text-surface-dark/80 hover:text-surface-dark hover:bg-surface-dark/10 transition-colors duration-fast"
                aria-label="Learn more"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current"
                >
                  <path
                    d="M2 1L6 5L2 9"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </div>

          {/* Dots indicator */}
          {slides.length > 1 && (
            <div className="hidden sm:flex items-center gap-0 ml-2">
              {slides.map((_, idx) => (
                <Dot key={idx} index={idx} />
              ))}
            </div>
          )}
        </div>

        {/* Close button */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-surface-dark/70 hover:text-surface-dark hover:bg-surface-dark/10 transition-colors duration-fast cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
            >
              <path
                d="M1 1L11 11M11 1L1 11"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile-only centered dots below the message */}
      {slides.length > 1 && (
        <div className="flex sm:hidden items-center justify-center gap-0 pb-0.5">
          {slides.map((_, idx) => (
            <Dot key={idx} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
