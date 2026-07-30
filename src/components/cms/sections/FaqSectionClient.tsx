"use client";

import { useState } from "react";
import type { CmsLanguage } from "@/lib/types/cms";
import type { CmsFaqSection, CmsFaqItem } from "@/lib/types/faq";
import { getFaqTranslation } from "@/lib/types/faq";

interface FaqSectionClientProps {
  section: CmsFaqSection;
  locale: CmsLanguage;
}

export function FaqSectionClient({ section, locale }: FaqSectionClientProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const activeItems = section.items.filter((item) => item.active);
    return activeItems.length > 0 ? new Set([activeItems[0].id]) : new Set();
  });

  const subtitle = getFaqTranslation(section.subtitleTranslations, locale);
  const title = getFaqTranslation(section.titleTranslations, locale);
  const description = getFaqTranslation(section.descriptionTranslations, locale);

  const items = section.items
    .filter((item) => item.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const titleParts = title.split(" ");
  const lastWord = titleParts.pop() ?? "";
  const precedingWords = titleParts.join(" ");

  return (
    <section className="bg-black py-20 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="mb-10 md:mb-16 text-center">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4 font-body">
            {subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight md:leading-none tracking-tight mb-3">
            {precedingWords.length > 0 && (
              <span className="text-white">{precedingWords} </span>
            )}
            <span className="text-brand-gold">{lastWord}</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-body-md leading-relaxed max-w-xl mx-auto mt-3 font-body">
            {description}
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {items.map((item) => (
            <FaqAccordionItem
              key={item.id}
              item={item}
              locale={locale}
              isOpen={openIds.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqAccordionItem({
  item,
  locale,
  isOpen,
  onToggle,
}: {
  item: CmsFaqItem;
  locale: CmsLanguage;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const question = getFaqTranslation(item.questionTranslations, locale);
  const answer = getFaqTranslation(item.answerTranslations, locale);

  return (
    <div
      className={`bg-surface-darkAlt rounded-2xl border transition-all duration-300 h-full ${
        isOpen
          ? "border-brand-gold/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
          : "border-white/5 hover:border-white/10"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
      >
        <span
          className={`font-display font-bold text-sm sm:text-base text-left transition-colors duration-300 ${
            isOpen ? "text-brand-gold" : "text-white group-hover:text-brand-gold/80"
          }`}
        >
          {question}
        </span>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`text-xl shrink-0 transition-all duration-300 ${
            isOpen ? "text-brand-gold rotate-180" : "text-neutral-500 group-hover:text-brand-gold/70"
          }`}
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 pb-5 text-neutral-400 text-sm leading-relaxed font-body">
          {answer}
        </p>
      </div>
    </div>
  );
}
