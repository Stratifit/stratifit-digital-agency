// ============================================================================
// Stratifit — Services Section Component
// CMS-driven, multilingual services grid. Fetches content from the
// services_section and service_cards tables.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import { getServicesSection, getDefaultServicesSection } from "@/lib/cms/services";
import { getServiceTranslation } from "@/lib/types/services";
import {
  SERVICES_SECTION_ICONS,
  CheckCircleIcon,
  ArrowForwardIcon,
  CodeIcon,
} from "@/components/ui/icons";
import type { SVGProps } from "react";

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;

interface ServicesSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

const ICON_MAP: Record<string, string> = {
  code: "⚡",
  palette: "🎨",
  strategy: "📈",
};

export async function ServicesSection({ payload, blocks, locale }: ServicesSectionProps) {
  const servicesSectionId =
    typeof payload.servicesSectionId === "string" ? payload.servicesSectionId : undefined;

  const section = servicesSectionId
    ? await getServicesSection(servicesSectionId)
    : await getDefaultServicesSection();

  // If no dedicated services section is configured yet, fall back to the
  // legacy generic services grid so existing pages keep rendering.
  if (!section) {
    return <LegacyServicesSection payload={payload} blocks={blocks} locale={locale} />;
  }

  const subtitle = getServiceTranslation(section.subtitleTranslations, locale);
  const title = getServiceTranslation(section.titleTranslations, locale);
  const description = getServiceTranslation(section.descriptionTranslations, locale);
  const cards = section.services
    .filter((card) => card.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="bg-black px-6 py-16 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <header className="shrink-0 text-left space-y-2 mb-8 md:mb-12">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-[0.18em] block font-body">
            {subtitle}
          </span>

          <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight font-display">
            <span className="text-white">{title.split(" ")[0]} </span>
            <span className="text-transparent bg-clip-text bg-gold-text">
              {title.split(" ").slice(1).join(" ")}
            </span>
          </h2>

          <p className="ml-[6px] mt-2 text-neutral-400 text-sm leading-relaxed max-w-[90%] border-l-2 border-brand-gold/50 pl-3 font-body">
            {description}
          </p>
        </header>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const ServiceIcon =
              (SERVICES_SECTION_ICONS[card.icon as keyof typeof SERVICES_SECTION_ICONS] as
                | IconComponent
                | undefined) ?? CodeIcon;
            const cardTitle = getServiceTranslation(card.titleTranslations, locale);
            const cardDescription = getServiceTranslation(
              card.descriptionTranslations,
              locale
            );

            return (
              <article
                key={card.id}
                className="group bg-card-gradient rounded-4xl p-6 md:p-8 border border-white/5 shadow-elevated flex flex-col relative overflow-hidden hover:border-brand-gold/20 transition-all duration-500"
              >
                {/* Glow accent */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-gold/10 transition-all duration-500" />

                <div className="flex flex-col gap-6 relative z-10 flex-1">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex items-center justify-center shadow-gold-glow">
                    <ServiceIcon className="text-brand-gold text-3xl drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] w-7 h-7" />
                  </div>

                  {/* Title & description */}
                  <div>
                    <h3 className="font-display font-bold text-2xl text-white mb-2 tracking-tight">
                      {cardTitle}
                    </h3>
                    <p className="font-body text-sm text-neutral-400 leading-relaxed font-medium">
                      {cardDescription}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent" />

                  {/* Deliverables */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold mb-4 opacity-90 font-body">
                      Key Deliverables
                    </p>
                    <ul className="space-y-3">
                      {card.deliverables.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircleIcon className="text-brand-gold text-lg leading-none w-5 h-5 shrink-0 mt-0.5" />
                          <span className="font-body text-sm text-neutral-300 font-medium">
                            {getServiceTranslation(item, locale)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <a
                    href={card.url}
                    className="mt-auto w-full py-4 rounded-xl bg-surface-darkHover border border-white/10 flex items-center justify-center gap-2 text-sm font-bold text-brand-gold hover:bg-brand-gold/5 hover:border-brand-gold/30 transition-all group/link font-body"
                  >
                    Learn More
                    <ArrowForwardIcon className="text-lg w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Legacy generic services grid — kept for backwards compatibility. */
function LegacyServicesSection({ payload, blocks }: ServicesSectionProps) {
  return (
    <section className="py-24 px-6 bg-surface-darkAlt">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-display-md md:text-display-lg text-white mb-4">
            {(payload.heading as string) ?? "Services"}
          </h2>
          {typeof payload.description === "string" && payload.description.length > 0 && (
            <p className="font-body text-body-lg text-neutral-400 max-w-2xl mx-auto">
              {payload.description}
            </p>
          )}
        </div>

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
