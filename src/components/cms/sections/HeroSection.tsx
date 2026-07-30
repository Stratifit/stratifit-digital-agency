// ============================================================================
// Stratifit — Hero Section Component
// CMS-driven, multilingual hero with badge, title, CTAs, stats, and a
// scrolling tech-stack marquee. Fetches content from the hero_section table.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import { getHeroSection, getDefaultHeroSection } from "@/lib/cms/hero";
import { getHeroTranslation } from "@/lib/types/hero";
import {
  ArrowUpRight,
  BrushIcon,
  ZapIcon,
  CodeIcon,
  AtomIcon,
} from "@/components/ui/icons";
import type { SVGProps } from "react";

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;

const TECH_ICONS: Record<string, IconComponent> = {
  brush: BrushIcon,
  zap: ZapIcon,
  code: CodeIcon,
  atom: AtomIcon,
};

interface HeroSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export async function HeroSection({ payload, locale }: HeroSectionProps) {
  const heroSectionId =
    typeof payload.heroSectionId === "string" ? payload.heroSectionId : undefined;
  const hero = heroSectionId
    ? await getHeroSection(heroSectionId)
    : await getDefaultHeroSection();

  if (!hero) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-dark">
        <div className="text-center text-neutral-500 font-body">
          <p>No hero section configured.</p>
        </div>
      </section>
    );
  }

  const subtitle = getHeroTranslation(hero.subtitleTranslations, locale);
  const title = getHeroTranslation(hero.titleTranslations, locale);
  const titleHighlight = getHeroTranslation(hero.titleHighlightTranslations, locale);
  const description = getHeroTranslation(hero.descriptionTranslations, locale);
  const techStackTitle = getHeroTranslation(hero.techStack.titleTranslations, locale);
  const techStackDescription = getHeroTranslation(hero.techStack.descriptionTranslations, locale);

  const primaryCta = hero.ctas.find((cta) => cta.variant === "primary");
  const secondaryCta = hero.ctas.find((cta) => cta.variant === "secondary");

  // Duplicate items for the infinite marquee effect
  const marqueeItems = [...hero.techStack.items, ...hero.techStack.items];

  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-16 pb-12 bg-surface-dark">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-full max-w-2xl rounded-full bg-brand-gold/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-xs font-medium tracking-wide mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          {subtitle}
        </div>

        {/* Title */}
        <h1 className="font-display font-black tracking-tight text-display-sm sm:text-display-md md:text-display-lg lg:text-display-md text-white leading-tight flex flex-col items-center justify-center">
          <span className="block whitespace-nowrap">{title}</span>
          <span className="block whitespace-nowrap text-brand-gold mt-1 lg:mt-2">
            {titleHighlight}
          </span>
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-2xl mx-auto text-neutral-400 text-sm sm:text-body-md leading-snug font-medium">
          <span className="block">{description}</span>
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 lg:justify-center w-full max-w-xl mx-auto">
          {primaryCta && (
            <a
              href={primaryCta.href}
              className="group flex-1 px-6 sm:px-8 py-3.5 sm:py-4 bg-brand-gold text-surface-dark font-bold rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:brightness-110 transition-all shadow-gold-glow active:scale-95 text-sm sm:text-base whitespace-nowrap"
            >
              {getHeroTranslation(primaryCta.labelTranslations, locale)}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}

          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className="flex-1 px-6 sm:px-8 py-3.5 sm:py-4 border border-white/15 text-white font-semibold rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:border-brand-gold/50 hover:text-brand-gold transition-all active:scale-95 text-sm sm:text-base whitespace-nowrap"
            >
              <ZapIcon className="w-4 h-4 shrink-0" />
              {getHeroTranslation(secondaryCta.labelTranslations, locale)}
            </a>
          )}
        </div>

        {/* Trust badges / stats */}
        <div className="mt-8 w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            {hero.trustBadges.map((badge, index) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center text-center px-2 ${
                  index !== 0 ? "sm:border-l border-white/10" : ""
                }`}
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-gold tracking-tight mb-1 sm:mb-2">
                  {badge.value}
                </div>
                <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.1em] text-neutral-400 font-semibold">
                  {getHeroTranslation(badge.labelTranslations, locale)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-8 w-full max-w-4xl mx-auto">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-white tracking-tight mb-1.5 font-display">
            Our <span className="text-brand-gold">Tech</span>{" "}
            <span className="text-neutral-400">Stack</span>
          </h2>
          <p className="text-center text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto mb-0 leading-snug px-4 whitespace-nowrap">
            {techStackDescription}
          </p>

          <div className="relative overflow-hidden group marquee-container py-4">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-surface-dark to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-surface-dark to-transparent z-10 pointer-events-none" />

            <div className="flex gap-10 sm:gap-12 animate-marquee whitespace-nowrap w-max">
              {marqueeItems.map((tech, index) => {
                const TechIcon = TECH_ICONS[tech.iconId] ?? CodeIcon;
                return (
                  <div
                    key={`${tech.name}-${index}`}
                    className="group/item flex flex-row items-center justify-center gap-2.5 text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="text-brand-gold transition-transform group-hover/item:scale-110">
                      <TechIcon className="w-5 h-5" />
                    </span>
                    <span className="text-base sm:text-lg font-semibold tracking-wide">
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
