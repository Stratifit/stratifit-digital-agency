"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { CmsLanguage } from "@/lib/types/cms";
import type { CmsPortfolioSection, CmsPortfolioItem } from "@/lib/types/portfolio";
import { getPortfolioTranslation } from "@/lib/types/portfolio";
import { ArrowForwardIcon } from "@/components/ui/icons";

interface PortfolioSectionClientProps {
  section: CmsPortfolioSection;
  locale: CmsLanguage;
}

export function PortfolioSectionClient({ section, locale }: PortfolioSectionClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>(() =>
    section.filters.length > 0 ? section.filters[0] : "All"
  );

  const allFilterLabel = section.filters[0] ?? "All";
  const filteredItems =
    activeFilter === allFilterLabel
      ? section.items
      : section.items.filter((item) => item.category === activeFilter);

  const handleScroll = (direction: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 400, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-black py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4 font-body">
            {getPortfolioTranslation(section.subtitleTranslations, locale)}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight md:leading-none tracking-tight mb-3">
            {(() => {
              const title = getPortfolioTranslation(section.titleTranslations, locale);
              const titleParts = title.split(" ");
              const lastWord = titleParts.pop() ?? "";
              const precedingWords = titleParts.join(" ");
              return (
                <>
                  {precedingWords.length > 0 && (
                    <span className="text-white">{precedingWords} </span>
                  )}
                  <span className="text-brand-gold">{lastWord}</span>
                </>
              );
            })()}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-body-md leading-relaxed max-w-2xl border-l-2 border-brand-gold/50 pl-4 sm:pl-6 mt-3 font-body">
            {getPortfolioTranslation(section.descriptionTranslations, locale)}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-6 mb-10">
          {section.filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm shrink-0 transition-all font-body ${
                activeFilter === filter
                  ? "bg-brand-gold text-surface-dark shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "bg-white/5 border border-white/10 text-white hover:border-brand-gold/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Slider */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 snap-x snap-mandatory"
          >
            {filteredItems.map((item) => (
              <PortfolioCard key={item.id} item={item} locale={locale} section={section} />
            ))}
          </div>

          {/* Desktop Navigation Arrows */}
          <button
            type="button"
            aria-label="Scroll portfolio left"
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
              ></path>
            </svg>
          </button>
          <button
            type="button"
            aria-label="Scroll portfolio right"
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
              ></path>
            </svg>
          </button>
        </div>

        {/* Desktop View All Link */}
        <div className="hidden md:flex justify-end mt-8">
          <a
            href={section.viewAllUrl}
            className="inline-flex items-center gap-2 text-brand-gold text-sm font-bold uppercase tracking-wider hover:text-brand-gold-600 transition-colors group font-body"
          >
            {getPortfolioTranslation(section.viewAllLabelTranslations, locale)}
            <ArrowForwardIcon className="text-sm w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile Dots & View All Link */}
        <div className="flex items-center justify-center gap-1.5 mt-3 relative">
          {filteredItems.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ease-out ${
                i === 0 ? "bg-brand-gold" : "bg-white/20"
              }`}
            />
          ))}
          <a
            href={section.viewAllUrl}
            className="md:hidden absolute right-0 inline-flex items-center gap-1 text-brand-gold text-[10px] font-bold uppercase tracking-wider hover:text-brand-gold-600 transition-colors font-body"
          >
            {getPortfolioTranslation(section.viewAllLabelTranslations, locale)}
            <ArrowForwardIcon className="text-[10px] w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
}

function PortfolioCard({
  item,
  locale,
  section,
}: {
  item: CmsPortfolioItem;
  locale: CmsLanguage;
  section: CmsPortfolioSection;
}) {
  const title = getPortfolioTranslation(item.titleTranslations, locale);
  const description = getPortfolioTranslation(item.descriptionTranslations, locale);
  const viewCaseStudyLabel = getPortfolioTranslation(
    section.viewCaseStudyLabelTranslations,
    locale
  );

  return (
    <div className="group bg-surface-darkAlt rounded-2xl overflow-hidden border border-white/5 hover:border-brand-gold/20 transition-all shrink-0 w-[300px] sm:w-[340px] md:w-[380px] snap-center">
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(min-width: 768px) 380px, 80vw"
        />
        <span className="absolute top-4 left-4 bg-brand-gold/90 text-surface-dark text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider font-body">
          {item.category}
        </span>
      </div>
      <div className="p-6 space-y-3">
        <h3 className="font-display font-bold text-xl text-white">{title}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 font-body">
          {description}
        </p>
        <a
          href={item.linkUrl}
          className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider hover:text-brand-gold-600 transition-colors group/link font-body"
        >
          {viewCaseStudyLabel}
          <ArrowForwardIcon className="text-sm w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}
