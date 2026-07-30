"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { CmsLanguage } from "@/lib/types/cms";
import type { CmsAcquisitionSection, CmsAcquisitionCard } from "@/lib/types/acquisition";
import { getAcquisitionTranslation } from "@/lib/types/acquisition";
import { ArrowForwardIcon } from "@/components/ui/icons";

interface AcquisitionSectionClientProps {
  section: CmsAcquisitionSection;
  locale: CmsLanguage;
}

export function AcquisitionSectionClient({ section, locale }: AcquisitionSectionClientProps) {
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
            {getAcquisitionTranslation(section.subtitleTranslations, locale)}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight md:leading-none tracking-tight mb-3">
            {(() => {
              const title = getAcquisitionTranslation(section.titleTranslations, locale);
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
            {getAcquisitionTranslation(section.descriptionTranslations, locale)}
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
                  ? "bg-brand-gold text-surface-dark shadow-gold-glow"
                  : "bg-white/5 border border-white/10 text-white hover:border-brand-gold/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Businesses Slider */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 snap-x snap-mandatory"
          >
            {filteredItems.map((item) => (
              <BusinessCard key={item.id} item={item} locale={locale} section={section} />
            ))}
          </div>

          {/* Desktop Navigation Arrows */}
          <button
            type="button"
            aria-label="Scroll businesses left"
            onClick={() => handleScroll(-1)}
            className="hidden md:flex absolute -left-20 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/70 hover:bg-brand-gold hover:text-surface-dark text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg z-10"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Scroll businesses right"
            onClick={() => handleScroll(1)}
            className="hidden md:flex absolute -right-20 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/70 hover:bg-brand-gold hover:text-surface-dark text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg z-10"
          >
            <ChevronRightIcon />
          </button>
        </div>

        {/* Desktop View All Link */}
        <div className="hidden md:flex justify-end mt-8">
          <a
            href={section.viewAllUrl}
            className="inline-flex items-center gap-2 text-brand-gold text-sm font-bold uppercase tracking-wider hover:text-brand-gold-600 transition-colors group font-body"
          >
            {getAcquisitionTranslation(section.viewAllLabelTranslations, locale)}
            <ArrowForwardIcon className="text-sm w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile Dots & View All */}
        <div className="flex items-center justify-center gap-1.5 mt-3 relative md:hidden">
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
            className="absolute right-0 inline-flex items-center gap-1 text-brand-gold text-[10px] font-bold uppercase tracking-wider hover:text-brand-gold-600 transition-colors font-body"
          >
            {getAcquisitionTranslation(section.viewAllLabelTranslations, locale)}
            <ArrowForwardIcon className="text-[10px] w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
}

function BusinessCard({
  item,
  locale,
  section,
}: {
  item: CmsAcquisitionCard;
  locale: CmsLanguage;
  section: CmsAcquisitionSection;
}) {
  const title = getAcquisitionTranslation(item.titleTranslations, locale);
  const description = getAcquisitionTranslation(item.descriptionTranslations, locale);
  const buttonText = getAcquisitionTranslation(item.buttonTextTranslations, locale);
  const viewDetailLabel = getAcquisitionTranslation(section.viewDetailLabelTranslations, locale);
  const visitSiteLabel = getAcquisitionTranslation(section.visitSiteLabelTranslations, locale);
  const buyBusinessLabel = getAcquisitionTranslation(section.buyBusinessLabelTranslations, locale);

  return (
    <div className="group shrink-0 w-[300px] sm:w-[340px] md:w-[380px] snap-center bg-surface-darkAlt rounded-2xl overflow-hidden border border-white/5 hover:border-brand-gold/20 transition-all flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="font-body text-body-sm text-neutral-400 truncate">{item.url}</span>
        <span
          className="text-[10px] font-bold px-3 py-1 uppercase tracking-wider text-black"
          style={{
            backgroundColor: item.categoryColor,
            borderRadius: item.categoryBorderRadius,
          }}
        >
          {item.category}
        </span>
      </div>

      {/* Hero image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={item.bgImageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(min-width: 768px) 380px, 80vw"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: item.overlayColor }}
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div
            className="w-10 h-10 flex items-center justify-center text-2xl border"
            style={{
              borderRadius: item.iconRadius,
              borderColor: item.iconBorder,
              boxShadow: item.iconShadow,
              backgroundColor: item.categoryColor,
            }}
          >
            {item.navEmoji}
          </div>
          <span className="font-body text-body-sm text-white font-semibold drop-shadow-md">
            {item.navTitle}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="text-center flex flex-col items-center flex-1">
          <div
            className="w-16 h-16 flex items-center justify-center text-4xl mb-3 border"
            style={{
              borderRadius: item.iconRadius,
              borderColor: item.iconBorder,
              boxShadow: item.iconShadow,
              backgroundColor: item.categoryColor,
            }}
          >
            {item.mainEmoji}
          </div>

          <h3 className="relative z-10 font-display font-black text-white tracking-tight text-lg sm:text-xl mb-2 group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="relative z-10 text-neutral-400 leading-relaxed text-xs sm:text-sm max-w-[260px] line-clamp-2 mt-1 opacity-70 font-body">
            {description}
          </p>

          {/* Tags */}
          <div className="relative z-10 flex flex-wrap justify-center gap-1 mt-3 mb-4">
            {item.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-neutral-500 bg-white/[0.03] border border-white/[0.06] rounded-full px-2 py-0.5 font-body"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 3x3 Grid */}
          <div className="relative z-10 w-full max-w-[250px] mb-4">
            <div className="grid grid-cols-3 gap-1.5">
              {item.gridEmojis.map((emoji, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:border-brand-gold/10 transition-colors"
                >
                  <span className="text-sm sm:text-base opacity-40 group-hover:opacity-60 transition-opacity">
                    {emoji}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Button */}
          <div className="relative z-10 w-full max-w-[220px] mb-3">
            <span className="block w-full py-1.5 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] sm:text-xs font-bold text-center group-hover:bg-brand-gold/15 transition-colors font-body">
              {buttonText}
            </span>
          </div>

          {/* Trust Badges */}
          <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap w-full max-w-[250px]">
            {item.trustBadges.map((badge, i) => (
              <span
                key={i}
                className="flex items-center gap-0.5 text-[10px] text-neutral-500 font-medium font-body"
              >
                <ShieldCheckIcon />
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 mt-6 pt-3">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-black text-brand-gold text-sm sm:text-base tracking-tight">
              {item.price}
            </span>
            <a
              href={item.linkUrl}
              className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold hover:text-brand-gold transition-colors group/link font-body"
            >
              {viewDetailLabel}
              <ArrowForwardIcon className="text-xs w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={item.visitLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-gold text-surface-dark font-bold rounded-lg hover:bg-brand-gold-600 transition-all active:scale-95 text-xs sm:text-sm font-body"
            >
              <GlobeIcon />
              {visitSiteLabel}
            </a>
            <a
              href={item.linkUrl}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-brand-gold/30 text-brand-gold font-bold rounded-lg hover:bg-brand-gold/10 transition-all active:scale-95 text-xs sm:text-sm font-body"
            >
              {buyBusinessLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
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
  );
}

function ChevronRightIcon() {
  return (
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
  );
}

function GlobeIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="text-sm sm:text-base"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="text-[10px] sm:text-xs text-brand-gold/30"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
