// ============================================================================
// Stratifit — Insights & Expertise Section Component
// CMS-driven, multilingual insights card grid. Fetches content from the
// insights_section and insight_cards tables.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import { getInsightsSection, getDefaultInsightsSection } from "@/lib/cms/insights";
import { getInsightsTranslation } from "@/lib/types/insights";
import { ArrowForwardIcon } from "@/components/ui/icons";
import Image from "next/image";

interface InsightsSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export async function InsightsSection({ payload, locale }: InsightsSectionProps) {
  const insightsSectionId =
    typeof payload.insightsSectionId === "string" ? payload.insightsSectionId : undefined;

  const section = insightsSectionId
    ? await getInsightsSection(insightsSectionId)
    : await getDefaultInsightsSection();

  if (!section) {
    return null;
  }

  const subtitle = getInsightsTranslation(section.subtitleTranslations, locale);
  const title = getInsightsTranslation(section.titleTranslations, locale);
  const description = getInsightsTranslation(section.descriptionTranslations, locale);
  const viewAllLabel = getInsightsTranslation(section.viewAllLabelTranslations, locale);
  const readMoreLabel = getInsightsTranslation(section.readMoreLabelTranslations, locale);
  const cards = section.cards
    .filter((card) => card.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const titleParts = title.split(" ");
  const lastWord = titleParts.pop() ?? "";
  const precedingWords = titleParts.join(" ");

  return (
    <section className="bg-black py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
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

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const cardTitle = getInsightsTranslation(card.titleTranslations, locale);
            const cardDescription = getInsightsTranslation(
              card.descriptionTranslations,
              locale
            );

            return (
              <article
                key={card.id}
                className="group bg-surface-darkAlt rounded-2xl overflow-hidden border border-white/5 hover:border-brand-gold/20 transition-all"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={card.imageUrl}
                    alt={cardTitle}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 80vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 text-brand-gold text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider font-body">
                    {card.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display font-bold text-lg text-white leading-snug">
                    {cardTitle}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 font-body">
                    {cardDescription}
                  </p>
                  <a
                    href={card.linkUrl}
                    className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider hover:text-brand-gold-600 transition-colors group/link font-body"
                  >
                    {readMoreLabel}
                    <ArrowForwardIcon className="text-sm w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            );
          })}
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

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {cards.map((card) => {
              const cardTitle = getInsightsTranslation(card.titleTranslations, locale);
              const cardDescription = getInsightsTranslation(
                card.descriptionTranslations,
                locale
              );

              return (
                <article
                  key={card.id}
                  className="min-w-[280px] w-[80vw] max-w-[340px] bg-surface-darkAlt rounded-2xl overflow-hidden border border-white/5 snap-center shrink-0 flex flex-col"
                >
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image
                      src={card.imageUrl}
                      alt={cardTitle}
                      fill
                      className="object-cover"
                      sizes="80vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 text-brand-gold text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider font-body">
                      {card.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col">
                    <h3 className="font-display font-bold text-base text-white leading-snug">
                      {cardTitle}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 font-body">
                      {cardDescription}
                    </p>
                    <a
                      href={card.linkUrl}
                      className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider hover:text-brand-gold-600 transition-colors group/link mt-auto font-body"
                    >
                      {readMoreLabel}
                      <ArrowForwardIcon className="text-sm w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Mobile Dots & Link */}
          <div className="flex items-center justify-center gap-1.5 mt-3 relative">
            {cards.map((_, i) => (
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
              {viewAllLabel}
              <ArrowForwardIcon className="text-[10px] w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
