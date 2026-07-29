// ============================================================================
// Stratifit — Hero Section Component
// Renders a full-width hero with heading, subheading, and dual CTAs.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";

interface HeroSectionProps {
  payload: {
    heading: string;
    subheading?: string;
    ctaPrimary?: { text: string; href: string };
    ctaSecondary?: { text: string; href: string };
    backgroundImage?: string | null;
  };
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export function HeroSection({ payload, locale }: HeroSectionProps) {
  const { heading, subheading, ctaPrimary, ctaSecondary } = payload;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-surface-dark">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-dark-glow opacity-60" />

      {/* Optional background image */}
      {payload.backgroundImage && (
        <img
          src={payload.backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="font-display text-display-lg md:text-display-xl mb-6 bg-gold-text bg-clip-text text-transparent">
          {heading}
        </h1>

        {subheading && (
          <p className="font-body text-body-lg text-neutral-400 max-w-2xl mx-auto mb-10">
            {subheading}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {ctaPrimary && (
            <a
              href={ctaPrimary.href}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-brand-gold text-surface-dark font-body font-semibold text-body-md hover:bg-brand-gold-600 transition-colors duration-fast shadow-gold-glow"
            >
              {ctaPrimary.text}
            </a>
          )}

          {ctaSecondary && (
            <a
              href={ctaSecondary.href}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-surface-darkBorder text-neutral-200 font-body font-medium text-body-md hover:bg-surface-darkHover hover:text-white transition-colors duration-fast"
            >
              {ctaSecondary.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
