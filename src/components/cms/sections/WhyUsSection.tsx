// ============================================================================
// Stratifit — Why Us Section Component
// CMS-driven, multilingual Why Us feature grid. Fetches content from the
// why_us_section and why_us_features tables.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import { getWhyUsSection, getDefaultWhyUsSection } from "@/lib/cms/why-us";
import { getWhyUsTranslation } from "@/lib/types/why-us";
import { WHY_US_ICONS, ShieldIcon } from "@/components/ui/icons";
import type { SVGProps } from "react";

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;

interface WhyUsSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export async function WhyUsSection({ payload, locale }: WhyUsSectionProps) {
  const whyUsSectionId =
    typeof payload.whyUsSectionId === "string" ? payload.whyUsSectionId : undefined;

  const section = whyUsSectionId
    ? await getWhyUsSection(whyUsSectionId)
    : await getDefaultWhyUsSection();

  if (!section) {
    return null;
  }

  const subtitle = getWhyUsTranslation(section.subtitleTranslations, locale);
  const title = getWhyUsTranslation(section.titleTranslations, locale);
  const description = getWhyUsTranslation(section.descriptionTranslations, locale);
  const features = section.features
    .filter((feature) => feature.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const titleParts = title.split(" ");
  const lastWord = titleParts.pop() ?? "";
  const precedingWords = titleParts.join(" ");

  return (
    <section className="bg-black py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse shrink-0" />
            <span className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] font-body">
              {subtitle}
            </span>
          </div>
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

        {/* Mobile Horizontal Scroll */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {features.map((feature) => {
              const FeatureIcon =
                (WHY_US_ICONS[feature.icon as keyof typeof WHY_US_ICONS] as
                  | IconComponent
                  | undefined) ?? ShieldIcon;
              const featureTitle = getWhyUsTranslation(feature.titleTranslations, locale);
              const featureDescription = getWhyUsTranslation(
                feature.descriptionTranslations,
                locale
              );
              const statLabel = getWhyUsTranslation(feature.statLabelTranslations, locale);

              return (
                <article
                  key={feature.id}
                  className="snap-center shrink-0 w-[300px] bg-surface-darkAlt rounded-4xl p-6 border border-white/5 relative overflow-hidden shadow-elevated flex flex-col"
                >
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex items-center justify-center shadow-gold-glow">
                      <FeatureIcon className="text-brand-gold text-2xl w-6 h-6 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg text-white mb-1.5 tracking-tight">
                        {featureTitle}
                      </h3>
                      <p className="text-sm text-neutral-400 leading-relaxed font-medium font-body">
                        {featureDescription}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-white/5">
                      <div className="text-xl font-display font-black text-brand-gold">
                        {feature.stat}
                      </div>
                      <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-body">
                        {statLabel}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Mobile Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {features.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ease-out ${
                  i === 0 ? "bg-brand-gold w-1.5" : "bg-white/20 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const FeatureIcon =
              (WHY_US_ICONS[feature.icon as keyof typeof WHY_US_ICONS] as
                | IconComponent
                | undefined) ?? ShieldIcon;
            const featureTitle = getWhyUsTranslation(feature.titleTranslations, locale);
            const featureDescription = getWhyUsTranslation(
              feature.descriptionTranslations,
              locale
            );
            const statLabel = getWhyUsTranslation(feature.statLabelTranslations, locale);

            return (
              <article
                key={feature.id}
                className="group bg-surface-darkAlt rounded-4xl p-6 md:p-8 border border-white/5 relative overflow-hidden hover:border-brand-gold/20 transition-all duration-500 shadow-elevated flex flex-col"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-gold/10 transition-all duration-500" />
                <div className="relative z-10 flex flex-col gap-5 flex-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex items-center justify-center shadow-gold-glow group-hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-shadow">
                    <FeatureIcon className="text-brand-gold text-3xl w-7 h-7 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-xl text-white mb-2 tracking-tight">
                      {featureTitle}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-medium font-body">
                      {featureDescription}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <div className="text-2xl font-display font-black text-brand-gold">
                      {feature.stat}
                    </div>
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-body">
                      {statLabel}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
