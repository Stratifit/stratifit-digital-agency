// ============================================================================
// Stratifit — CTA Section Component
// Renders a conversion-focused call-to-action strip.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";

interface CtaSectionProps {
  payload: {
    heading: string;
    description?: string;
    ctaText: string;
    ctaHref: string;
  };
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export function CtaSection({ payload }: CtaSectionProps) {
  const { heading, description, ctaText, ctaHref } = payload;

  return (
    <section className="py-24 px-6 bg-surface-dark">
      <div className="max-w-3xl mx-auto text-center">
        {/* Gold glow backdrop */}
        <div className="relative rounded-3xl bg-surface-darkCard border border-brand-gold/20 p-12 md:p-16 shadow-gold-glow-lg">
          {/* Inner gradient overlay */}
          <div className="absolute inset-0 rounded-3xl bg-gold-fade opacity-5 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="font-display text-display-sm md:text-display-md text-white mb-4">
              {heading}
            </h2>

            {description && (
              <p className="font-body text-body-lg text-neutral-400 mb-10 max-w-xl mx-auto">
                {description}
              </p>
            )}

            <a
              href={ctaHref}
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-brand-gold text-surface-dark font-body font-semibold text-heading-sm hover:bg-brand-gold-600 transition-colors duration-fast shadow-gold-glow"
            >
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
