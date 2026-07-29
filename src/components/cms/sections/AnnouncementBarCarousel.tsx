// ============================================================================
// Stratifit — Announcement Bar Carousel
// Client component: fetches slides from API, auto-slides, close, CTA arrow.
// ============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";

interface LocalizedSlide {
  id: string;
  message: string;
  sticky: boolean;
  url: string;
}

interface AnnouncementBarCarouselProps {
  autoSlideInterval: number;
}

export function AnnouncementBarCarousel({
  autoSlideInterval,
}: AnnouncementBarCarouselProps) {
  const [slides, setSlides] = useState<LocalizedSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch slides from the API on mount
  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch("/api/cms/announcement-slides");
        if (res.ok) {
          const data = await res.json();
          // Map API response (camelCase from API) to localized slides
          // The API returns messageTranslations as { en, fr, de, es }
          // For now, we just use the English messages. Language selection
          // can be added when we pass locale context.
          const mapped: LocalizedSlide[] = data.map(
            (slide: {
              id: string;
              displayOrder: number;
              sticky: boolean;
              url: string;
              messageTranslations: { en: string };
            }) => ({
              id: slide.id,
              message: slide.messageTranslations?.en ?? "",
              sticky: slide.sticky,
              url: slide.url,
            })
          );
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
  }, []);

  // Auto-slide logic
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goToNext, autoSlideInterval);
    return () => clearInterval(timer);
  }, [goToNext, autoSlideInterval, slides.length]);

  // Loading / empty / dismissed states
  if (loading) return null;
  if (dismissed || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];
  const isSticky = currentSlide?.sticky ?? false;

  return (
    <div
      className={`w-full bg-surface-darkAlt border-b border-surface-darkBorder ${
        isSticky ? "fixed top-0 left-0 right-0 z-50" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-10 sm:h-12">
        {/* Slide message */}
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span className="font-body text-body-sm text-neutral-300 truncate">
            {currentSlide?.message ?? ""}
          </span>

          {/* CTA arrow */}
          {currentSlide?.url && (
            <a
              href={currentSlide.url}
              className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-neutral-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors duration-fast"
              aria-label="Learn more"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current"
              >
                <path
                  d="M1 7H13M13 7L7 1M13 7L7 13"
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
          <div className="flex items-center gap-1.5 mx-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-fast ${
                  idx === currentIndex
                    ? "bg-brand-gold"
                    : "bg-surface-darkBorder hover:bg-neutral-500"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-neutral-500 hover:text-white hover:bg-surface-darkHover transition-colors duration-fast"
          aria-label="Dismiss announcement"
        >
          <svg
            width="12"
            height="12"
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
  );
}
