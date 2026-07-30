"use client";

import { useRef } from "react";
import type { CmsLanguage } from "@/lib/types/cms";
import type { CmsTestimonialsSection, CmsTestimonialCard } from "@/lib/types/testimonials";
import { getTestimonialsTranslation } from "@/lib/types/testimonials";
import { ArrowForwardIcon, StarIcon } from "@/components/ui/icons";

interface TestimonialsSectionClientProps {
  section: CmsTestimonialsSection;
  locale: CmsLanguage;
}

export function TestimonialsSectionClient({ section, locale }: TestimonialsSectionClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const subtitle = getTestimonialsTranslation(section.subtitleTranslations, locale);
  const title = getTestimonialsTranslation(section.titleTranslations, locale);
  const description = getTestimonialsTranslation(section.descriptionTranslations, locale);
  const viewAllLabel = getTestimonialsTranslation(section.viewAllLabelTranslations, locale);
  const cards = section.cards
    .filter((card) => card.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const titleParts = title.split(" ");
  const lastWord = titleParts.pop() ?? "";
  const precedingWords = titleParts.join(" ");

  const handleScroll = (direction: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 420, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-black py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4 font-body">
            {subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight md:leading-none tracking-tight mb-3">
            {precedingWords.length > 0 && (
              <span className="text-white">{precedingWords} </span>
            )}
            <span className="text-brand-gold">{lastWord}</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-body-md leading-relaxed max-w-2xl border-l-2 border-brand-gold/50 pl-4 sm:pl-6 mt-3 font-body">
            {description}
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 snap-x snap-mandatory"
          >
            {cards.map((card) => (
              <TestimonialCard key={card.id} card={card} locale={locale} />
            ))}
          </div>

          {/* Desktop Navigation Arrows */}
          <button
            type="button"
            aria-label="Scroll testimonials left"
            onClick={() => handleScroll(-1)}
            className="hidden md:flex absolute -left-20 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/70 hover:bg-brand-gold hover:text-surface-dark text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg z-10"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Scroll testimonials right"
            onClick={() => handleScroll(1)}
            className="hidden md:flex absolute -right-20 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/70 hover:bg-brand-gold hover:text-surface-dark text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg z-10"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Dots & View All */}
        <div className="flex items-center justify-center gap-1.5 mt-3 relative">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ease-out ${
                i === 0 ? "bg-brand-gold w-3" : "bg-white/20 w-1.5"
              }`}
            />
          ))}
          <a
            href={section.viewAllUrl}
            className="md:hidden absolute right-0 inline-flex items-center gap-1 text-brand-gold text-[10px] font-bold uppercase tracking-wider hover:text-brand-gold-600 transition-colors font-body"
          >
            {viewAllLabel}
            <ArrowForwardIcon className="text-[10px] w-3 h-3" />
          </a>
        </div>

        {/* Desktop View All Link */}
        <div className="hidden md:flex justify-end mt-8">
          <a
            href={section.viewAllUrl}
            className="inline-flex items-center gap-2 text-brand-gold text-sm font-bold uppercase tracking-wider hover:text-brand-gold-600 transition-colors group font-body"
          >
            {viewAllLabel}
            <ArrowForwardIcon className="text-sm w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  card,
  locale,
}: {
  card: CmsTestimonialCard;
  locale: CmsLanguage;
}) {
  const name = getTestimonialsTranslation(card.nameTranslations, locale);
  const role = getTestimonialsTranslation(card.roleTranslations, locale);
  const quote = getTestimonialsTranslation(card.quoteTranslations, locale);

  return (
    <article className="min-w-[300px] w-[300px] sm:w-[360px] md:w-[400px] bg-surface-darkAlt p-6 md:p-8 rounded-2xl border border-white/5 hover:border-brand-gold/20 transition-all shrink-0 snap-center flex flex-col">
      {/* Author */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0 font-body">
          {card.initials}
        </div>
        <div>
          <div className="font-display font-bold text-white">{name}</div>
          <div className="text-xs text-neutral-500 uppercase tracking-wide mt-0.5 font-body">
            {role}
          </div>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`w-5 h-5 ${
              i < card.rating ? "text-brand-gold" : "text-neutral-600"
            }`}
            filled={i < card.rating}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-neutral-300 leading-relaxed text-sm font-body">&ldquo;{quote}&rdquo;</p>
    </article>
  );
}
