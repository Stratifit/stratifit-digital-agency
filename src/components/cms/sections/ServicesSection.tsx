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
  // default design so the section always renders.
  if (!section) {
    return <ServicesFallback locale={locale} />;
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

/** Default services data used when no CMS row exists yet. */
const DEFAULT_SERVICES = {
  subtitle: "Services",
  title: "Our Services",
  description: "Websites, branding, and AI systems designed to help your business grow.",
  cards: [
    {
      id: "brand-design",
      icon: "diamond" as const,
      titleTranslations: {
        en: "Brand Design",
        fr: "Design de Marque",
        de: "Markendesign",
        es: "Diseño de Marca",
      },
      descriptionTranslations: {
        en: "Crafting unique identities that resonate and leave a lasting impression on your market.",
        fr: "Création d'identités uniques qui résonnent et laissent une impression durable sur votre marché.",
        de: "Entwicklung einzigartiger Identitäten, die resonieren und einen bleibenden Eindruck auf Ihrem Markt hinterlassen.",
        es: "Creación de identidades únicas que resuenen y dejen una impresión duradera en su mercado.",
      },
      url: "/brand-design",
      deliverables: [
        { en: "Brand Strategy", fr: "Stratégie de Marque", de: "Markenstrategie", es: "Estrategia de Marca" },
        { en: "Logo Design", fr: "Conception de Logo", de: "Logo-Design", es: "Diseño de Logo" },
        { en: "Visual Identity", fr: "Identité Visuelle", de: "Visuelle Identität", es: "Identidad Visual" },
        { en: "Brand Guidelines", fr: "Guide de Marque", de: "Markenrichtlinien", es: "Guías de Marca" },
      ],
    },
    {
      id: "website-development",
      icon: "code" as const,
      titleTranslations: {
        en: "Website Development",
        fr: "Développement Web",
        de: "Webentwicklung",
        es: "Desarrollo Web",
      },
      descriptionTranslations: {
        en: "High-performance websites and web apps engineered for speed, scale, and conversion.",
        fr: "Des sites web et applications web performants conçus pour la vitesse, l'échelle et la conversion.",
        de: "Hochleistungsfähige Websites und Web-Apps, die für Geschwindigkeit, Skalierung und Konversion entwickelt wurden.",
        es: "Sitios web y aplicaciones web de alto rendimiento diseñados para la velocidad, la escala y la conversión.",
      },
      url: "/website-development",
      deliverables: [
        { en: "Custom Websites", fr: "Sites Web Sur Mesure", de: "Individuelle Websites", es: "Sitios Web Personalizados" },
        { en: "E-commerce", fr: "E-commerce", de: "E-Commerce", es: "Comercio Electrónico" },
        { en: "Web Applications", fr: "Applications Web", de: "Webanwendungen", es: "Aplicaciones Web" },
        { en: "CMS Integration", fr: "Intégration CMS", de: "CMS-Integration", es: "Integración CMS" },
      ],
    },
    {
      id: "ai-automation",
      icon: "smart_toy" as const,
      titleTranslations: {
        en: "AI & Automation",
        fr: "IA & Automatisation",
        de: "KI & Automatisierung",
        es: "IA y Automatización",
      },
      descriptionTranslations: {
        en: "Intelligent automation that streamlines operations, qualifies leads, and scales support 24/7.",
        fr: "Une automatisation intelligente qui rationalise les opérations, qualifie les leads et met à l'échelle le support 24/7.",
        de: "Intelligente Automatisierung, die Abläufe optimiert, Leads qualifiziert und den Support 24/7 skaliert.",
        es: "Automatización inteligente que optimiza operaciones, califica leads y escala el soporte 24/7.",
      },
      url: "/ai-automation",
      deliverables: [
        { en: "AI Lead Qualification", fr: "Qualification de Leads IA", de: "KI-Lead-Qualifizierung", es: "Calificación de Leads con IA" },
        { en: "AI Chatbots", fr: "Chatbots IA", de: "KI-Chatbots", es: "Chatbots de IA" },
        { en: "Workflow Automation", fr: "Automatisation des Flux", de: "Workflow-Automatisierung", es: "Automatización de Flujos" },
        { en: "Custom APIs", fr: "APIs Sur Mesure", de: "Individuelle APIs", es: "APIs Personalizadas" },
      ],
    },
    {
      id: "growth-marketing",
      icon: "rocket_launch" as const,
      titleTranslations: {
        en: "Growth & Marketing",
        fr: "Croissance & Marketing",
        de: "Wachstum & Marketing",
        es: "Crecimiento y Marketing",
      },
      descriptionTranslations: {
        en: "Data-driven campaigns that amplify your brand and drive measurable revenue growth.",
        fr: "Des campagnes basées sur les données qui amplifient votre marque et génèrent une croissance des revenus mesurable.",
        de: "Datengesteuerte Kampagnen, die Ihre Marke verstärken und messbares Umsatzwachstum vorantreiben.",
        es: "Campañas basadas en datos que amplifican su marca e impulsan un crecimiento de ingresos medible.",
      },
      url: "/growth-marketing",
      deliverables: [
        { en: "Performance Marketing", fr: "Marketing de Performance", de: "Performance-Marketing", es: "Marketing de Rendimiento" },
        { en: "SEO & SEM", fr: "SEO & SEM", de: "SEO & SEM", es: "SEO y SEM" },
        { en: "Content Strategy", fr: "Stratégie de Contenu", de: "Content-Strategie", es: "Estrategia de Contenido" },
        { en: "Social Media", fr: "Réseaux Sociaux", de: "Social Media", es: "Redes Sociales" },
      ],
    },
  ],
};

function ServicesFallback({ locale }: { locale: CmsLanguage }) {
  const title = DEFAULT_SERVICES.title;
  const titleParts = title.split(" ");
  const firstWord = titleParts[0];
  const restWords = titleParts.slice(1).join(" ");

  return (
    <section className="bg-black px-6 py-16 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <header className="shrink-0 text-left space-y-2 mb-8 md:mb-12">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-[0.18em] block font-body">
            {DEFAULT_SERVICES.subtitle}
          </span>

          <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight font-display">
            <span className="text-white">{firstWord} </span>
            <span className="text-transparent bg-clip-text bg-gold-text">
              {restWords}
            </span>
          </h2>

          <p className="ml-[6px] mt-2 text-neutral-400 text-sm leading-relaxed max-w-[90%] border-l-2 border-brand-gold/50 pl-3 font-body">
            {DEFAULT_SERVICES.description}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEFAULT_SERVICES.cards.map((card) => {
            const ServiceIcon =
              (SERVICES_SECTION_ICONS[card.icon as keyof typeof SERVICES_SECTION_ICONS] as
                | IconComponent
                | undefined) ?? CodeIcon;

            return (
              <article
                key={card.id}
                className="group bg-card-gradient rounded-4xl p-6 md:p-8 border border-white/5 shadow-elevated flex flex-col relative overflow-hidden hover:border-brand-gold/20 transition-all duration-500"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-gold/10 transition-all duration-500" />

                <div className="flex flex-col gap-6 relative z-10 flex-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex items-center justify-center shadow-gold-glow">
                    <ServiceIcon className="text-brand-gold text-3xl drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-2xl text-white mb-2 tracking-tight">
                      {card.titleTranslations[locale]}
                    </h3>
                    <p className="font-body text-sm text-neutral-400 leading-relaxed font-medium">
                      {card.descriptionTranslations[locale]}
                    </p>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent" />

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold mb-4 opacity-90 font-body">
                      Key Deliverables
                    </p>
                    <ul className="space-y-3">
                      {card.deliverables.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircleIcon className="text-brand-gold text-lg leading-none w-5 h-5 shrink-0 mt-0.5" />
                          <span className="font-body text-sm text-neutral-300 font-medium">
                            {item[locale]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

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
