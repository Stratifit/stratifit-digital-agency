// ============================================================================
// Stratifit — Services Section Component
// Renders a grid of service cards from content blocks.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";

interface ServicesSectionProps {
  payload: {
    heading: string;
    description?: string;
  };
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

/** Simple icon mapping — extend as needed */
const ICON_MAP: Record<string, string> = {
  code:     "⚡",
  palette:  "🎨",
  strategy: "📈",
};

export function ServicesSection({ payload, blocks }: ServicesSectionProps) {
  return (
    <section className="py-24 px-6 bg-surface-darkAlt">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-display-md md:text-display-lg text-white mb-4">
            {payload.heading}
          </h2>
          {payload.description && (
            <p className="font-body text-body-lg text-neutral-400 max-w-2xl mx-auto">
              {payload.description}
            </p>
          )}
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blocks.map((block) => {
            const title = block.resolvedPayload.title as string;
            const description = block.resolvedPayload.description as string;
            const icon = (block.resolvedPayload.icon as string) ?? "code";

            return (
              <article
                key={block.block.id}
                className="group rounded-2xl bg-surface-darkCard border border-surface-darkBorder p-8 hover:border-brand-gold/30 hover:shadow-card-hover transition-all duration-normal"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold text-heading-lg mb-5 group-hover:bg-brand-gold/20 transition-colors">
                  {ICON_MAP[icon] ?? "✨"}
                </span>

                <h3 className="font-display text-heading-lg text-white mb-3">
                  {title}
                </h3>

                <p className="font-body text-body-md text-neutral-400 leading-relaxed">
                  {description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
