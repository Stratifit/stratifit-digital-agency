// ============================================================================
// Stratifit — How We Work Section Component
// CMS-driven, multilingual process steps. Fetches content from the
// how_we_work_section and how_we_work_steps tables.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import {
  getHowWeWorkSection,
  getDefaultHowWeWorkSection,
} from "@/lib/cms/how-we-work";
import { getHowWeWorkTranslation } from "@/lib/types/how-we-work";
import {
  HOW_WE_WORK_ICONS,
  ChevronRightIcon,
} from "@/components/ui/icons";
import type { SVGProps } from "react";

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;

interface HowWeWorkSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export async function HowWeWorkSection({
  payload,
  locale,
}: HowWeWorkSectionProps) {
  const howWeWorkSectionId =
    typeof payload.howWeWorkSectionId === "string"
      ? payload.howWeWorkSectionId
      : undefined;

  const section = howWeWorkSectionId
    ? await getHowWeWorkSection(howWeWorkSectionId)
    : await getDefaultHowWeWorkSection();

  if (!section) {
    return <HowWeWorkFallback locale={locale} />;
  }

  const subtitle = getHowWeWorkTranslation(section.subtitleTranslations, locale);
  const title = getHowWeWorkTranslation(section.titleTranslations, locale);
  const description = getHowWeWorkTranslation(
    section.descriptionTranslations,
    locale
  );
  const steps = [...section.steps].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

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
          {steps.map((step, index) => {
            const StepIcon =
              (HOW_WE_WORK_ICONS[step.icon as keyof typeof HOW_WE_WORK_ICONS] as
                | IconComponent
                | undefined) ?? null;
            const stepTitle = getHowWeWorkTranslation(step.titleTranslations, locale);
            const stepDescription = getHowWeWorkTranslation(
              step.descriptionTranslations,
              locale
            );

            return (
              <article key={step.id} className="group relative">
                <div className="bg-surface-darkAlt rounded-2xl p-6 md:p-8 border border-white/5 hover:border-brand-gold/20 transition-all duration-300 h-full relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-brand-gold rounded-bl-xl">
                    <span className="text-[10px] font-black text-black uppercase tracking-widest font-body">
                      STEP {String(step.stepNumber).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex items-center justify-center mb-5 shadow-gold-glow">
                    {StepIcon && (
                      <StepIcon className="text-brand-gold text-3xl w-7 h-7" />
                    )}
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    {stepTitle}
                  </h3>
                  <p className="font-body text-sm text-neutral-400 leading-relaxed">
                    {stepDescription}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 text-brand-gold/30">
                    <ChevronRightIcon className="w-6 h-6" />
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {steps.map((step) => {
              const StepIcon =
                (HOW_WE_WORK_ICONS[step.icon as keyof typeof HOW_WE_WORK_ICONS] as
                  | IconComponent
                  | undefined) ?? null;
              const stepTitle = getHowWeWorkTranslation(
                step.titleTranslations,
                locale
              );
              const stepDescription = getHowWeWorkTranslation(
                step.descriptionTranslations,
                locale
              );

              return (
                <article
                  key={step.id}
                  className="min-w-[280px] w-[80vw] max-w-[320px] bg-surface-darkAlt rounded-2xl p-6 border border-white/5 snap-center shrink-0 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 px-3 py-1 bg-brand-gold rounded-bl-xl">
                    <span className="text-[10px] font-black text-black uppercase tracking-widest font-body">
                      STEP {String(step.stepNumber).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex items-center justify-center mb-4 shadow-gold-glow">
                    {StepIcon && (
                      <StepIcon className="text-brand-gold text-2xl w-6 h-6" />
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    {stepTitle}
                  </h3>
                  <p className="font-body text-sm text-neutral-400 leading-relaxed">
                    {stepDescription}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Mobile Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ease-out ${
                  i === 0 ? "bg-brand-gold w-1.5" : "bg-white/20 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Default process steps used when no CMS row exists yet. */
const DEFAULT_HOW_WE_WORK = {
  subtitle: "Process",
  title: "How We Work",
  description:
    "A proven framework that takes you from idea to scale — predictably and efficiently.",
  steps: [
    {
      id: "discovery",
      icon: "discovery" as const,
      stepNumber: 1,
      titleTranslations: {
        en: "Discovery",
        fr: "Découverte",
        de: "Entdeckung",
        es: "Descubrimiento",
      },
      descriptionTranslations: {
        en: "We dive deep into your business goals, audience, and challenges to build a rock-solid foundation for every decision.",
        fr: "Nous explorons en profondeur vos objectifs commerciaux, votre audience et vos défis pour bâtir une base solide pour chaque décision.",
        de: "Wir tauchen tief in Ihre Geschäftsziele, Zielgruppe und Herausforderungen ein, um ein solides Fundament für jede Entscheidung zu schaffen.",
        es: "Nos sumergimos en sus objetivos comerciales, audiencia y desafíos para construir una base sólida para cada decisión.",
      },
    },
    {
      id: "strategy",
      icon: "strategy" as const,
      stepNumber: 2,
      titleTranslations: {
        en: "Strategy",
        fr: "Stratégie",
        de: "Strategie",
        es: "Estrategia",
      },
      descriptionTranslations: {
        en: "We design a comprehensive plan covering brand, web, AI, and growth — aligned with your revenue targets.",
        fr: "Nous concevons un plan complet couvrant la marque, le web, l'IA et la croissance — aligné sur vos objectifs de revenus.",
        de: "Wir entwickeln einen umfassenden Plan für Marke, Web, KI und Wachstum — abgestimmt auf Ihre Umsatzziele.",
        es: "Diseñamos un plan integral que cubre marca, web, IA y crecimiento — alineado con sus objetivos de ingresos.",
      },
    },
    {
      id: "build",
      icon: "build" as const,
      stepNumber: 3,
      titleTranslations: {
        en: "Build",
        fr: "Construction",
        de: "Aufbau",
        es: "Construcción",
      },
      descriptionTranslations: {
        en: "Our team implements systems, websites, automations, and campaigns with precision engineering.",
        fr: "Notre équipe implémente des systèmes, des sites web, des automatisations et des campagnes avec une ingénierie de précision.",
        de: "Unser Team implementiert Systeme, Websites, Automatisierungen und Kampagnen mit präziser Engineering-Qualität.",
        es: "Nuestro equipo implementa sistemas, sitios web, automatizaciones y campañas con ingeniería de precisión.",
      },
    },
    {
      id: "launch",
      icon: "launch" as const,
      stepNumber: 4,
      titleTranslations: {
        en: "Launch & Grow",
        fr: "Lancer & Croître",
        de: "Starten & Wachsen",
        es: "Lanzar & Crecer",
      },
      descriptionTranslations: {
        en: "We optimize, scale, and measure everything. Continuous improvement is built into our DNA.",
        fr: "Nous optimisons, mettons à l'échelle et mesurons tout. L'amélioration continue est inscrite dans notre ADN.",
        de: "Wir optimieren, skalieren und messen alles. Kontinuierliche Verbesserung ist in unserer DNA verankert.",
        es: "Optimizamos, escalamos y medimos todo. La mejora continua está en nuestro ADN.",
      },
    },
  ],
};

function HowWeWorkFallback({ locale }: { locale: CmsLanguage }) {
  const titleParts = DEFAULT_HOW_WE_WORK.title.split(" ");
  const lastWord = titleParts.pop() ?? "";
  const precedingWords = titleParts.join(" ");
  const steps = DEFAULT_HOW_WE_WORK.steps;

  return (
    <section className="bg-black py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4 font-body">
            {DEFAULT_HOW_WE_WORK.subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight md:leading-none tracking-tight mb-3">
            {precedingWords.length > 0 && (
              <span className="text-white">{precedingWords} </span>
            )}
            <span className="text-brand-gold">{lastWord}</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-body-md leading-relaxed max-w-2xl border-l-2 border-brand-gold/50 pl-4 sm:pl-6 mt-3 font-body">
            {DEFAULT_HOW_WE_WORK.description}
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const StepIcon =
              (HOW_WE_WORK_ICONS[step.icon as keyof typeof HOW_WE_WORK_ICONS] as
                | IconComponent
                | undefined) ?? null;

            return (
              <article key={step.id} className="group relative">
                <div className="bg-surface-darkAlt rounded-2xl p-6 md:p-8 border border-white/5 hover:border-brand-gold/20 transition-all duration-300 h-full relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-brand-gold rounded-bl-xl">
                    <span className="text-[10px] font-black text-black uppercase tracking-widest font-body">
                      STEP {String(step.stepNumber).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex items-center justify-center mb-5 shadow-gold-glow">
                    {StepIcon && (
                      <StepIcon className="text-brand-gold text-3xl w-7 h-7" />
                    )}
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    {step.titleTranslations[locale]}
                  </h3>
                  <p className="font-body text-sm text-neutral-400 leading-relaxed">
                    {step.descriptionTranslations[locale]}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 text-brand-gold/30">
                    <ChevronRightIcon className="w-6 h-6" />
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {steps.map((step) => {
              const StepIcon =
                (HOW_WE_WORK_ICONS[step.icon as keyof typeof HOW_WE_WORK_ICONS] as
                  | IconComponent
                  | undefined) ?? null;

              return (
                <article
                  key={step.id}
                  className="min-w-[280px] w-[80vw] max-w-[320px] bg-surface-darkAlt rounded-2xl p-6 border border-white/5 snap-center shrink-0 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 px-3 py-1 bg-brand-gold rounded-bl-xl">
                    <span className="text-[10px] font-black text-black uppercase tracking-widest font-body">
                      STEP {String(step.stepNumber).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex items-center justify-center mb-4 shadow-gold-glow">
                    {StepIcon && (
                      <StepIcon className="text-brand-gold text-2xl w-6 h-6" />
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    {step.titleTranslations[locale]}
                  </h3>
                  <p className="font-body text-sm text-neutral-400 leading-relaxed">
                    {step.descriptionTranslations[locale]}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Mobile Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ease-out ${
                  i === 0 ? "bg-brand-gold w-1.5" : "bg-white/20 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
