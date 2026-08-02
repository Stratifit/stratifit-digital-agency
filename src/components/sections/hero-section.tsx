import { getPublicHero } from "@/features/hero/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Button } from "@/components/ui/button";

interface HeroMetric {
  value: string;
  label_translations: Record<string, string> | null;
}

const FALLBACK_STATS: HeroMetric[] = [
  {
    value: "59+",
    label_translations: {
      en: "Projects Delivered",
      de: "Gelieferte Projekte",
      fr: "Projets livrés",
      es: "Proyectos entregados",
    },
  },
  {
    value: "7+",
    label_translations: {
      en: "Years Experience",
      de: "Jahre Erfahrung",
      fr: "Années d'expérience",
      es: "Años de experiencia",
    },
  },
  {
    value: "98%",
    label_translations: {
      en: "Client Satisfaction",
      de: "Kundenzufriedenheit",
      fr: "Satisfaction client",
      es: "Satisfacción del cliente",
    },
  },
];

function TechIcon({ name }: { name: string }) {
  const svgProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-5",
    "aria-hidden": true,
  };

  switch (name) {
    case "brush":
      return (
        <svg {...svgProps}>
          <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
          <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
        </svg>
      );
    case "zap":
      return (
        <svg {...svgProps}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "code":
      return (
        <svg {...svgProps}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "atom":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="1" />
          <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
          <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
        </svg>
      );
    default:
      return null;
  }
}

export async function HeroSection() {
  const locale = await getLocale();
  const hero = await getPublicHero();

  if (!hero) {
    return null;
  }

  const eyebrow = resolveTranslation(hero.eyebrow_translations, locale);
  const title = resolveTranslation(hero.title_translations, locale);
  const highlight = resolveTranslation(hero.highlight_translations, locale);
  const description = resolveTranslation(hero.description_translations, locale);
  const primaryLabel = resolveTranslation(
    hero.primary_cta_label_translations,
    locale
  );
  const secondaryLabel = resolveTranslation(
    hero.secondary_cta_label_translations,
    locale
  );

  const dbMetrics = (hero.metrics as HeroMetric[] | null) ?? [];
  const stats = dbMetrics.length > 0 ? dbMetrics : FALLBACK_STATS;

  const techStack = hero.tech_stack ?? [];
  const techStackHeading = resolveTranslation(
    hero.tech_stack_heading_translations,
    locale
  );
  const techStackDescription = resolveTranslation(
    hero.tech_stack_description_translations,
    locale
  );

  return (
    <section
      className="relative flex min-h-[calc(100svh-4rem)] items-start justify-center overflow-hidden pb-12 pt-16 sm:min-h-[calc(100svh-5rem)]"
      style={{ background: "linear-gradient(to right, #0B0F17, #0A0A0A)" }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center lg:px-8">
        {eyebrow ? (
          <div className="mb-[31px] inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium tracking-wide text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {eyebrow}
          </div>
        ) : null}

        <h1 className="flex flex-col items-center justify-center font-display text-[1.75rem] font-black leading-[1.15] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-5xl">
          <span className="block">{title}</span>
          {highlight ? (
            <span className="mt-1 block text-[#ffb300] lg:mt-2">
              {highlight}
            </span>
          ) : null}
        </h1>

        {description ? (
          <p className="mx-auto mt-[18px] max-w-2xl text-[0.8rem] font-medium leading-snug text-text-secondary [text-shadow:0_0_1px_currentColor] sm:text-base">
            {description}
          </p>
        ) : null}

        {primaryLabel || secondaryLabel ? (
          <div className="mx-auto mt-[26px] flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            {primaryLabel && hero.primary_cta_url ? (
              <Button size="medium" className="!h-12 w-full !font-semibold sm:w-[370px] sm:flex-none">
                <a
                  href={hero.primary_cta_url}
                  className="flex items-center justify-center gap-2 sm:gap-3"
                >
                  {primaryLabel}
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="size-4 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </Button>
            ) : null}
            {secondaryLabel && hero.secondary_cta_url ? (
              <Button variant="tertiary" size="medium" className="!h-12 w-full !rounded-[6px] sm:w-[370px] sm:flex-none">
                <a
                  href={hero.secondary_cta_url}
                  className="flex items-center justify-center gap-2 sm:gap-3"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="size-4 shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {secondaryLabel}
                </a>
              </Button>
            ) : null}
          </div>
        ) : null}

        {stats.length > 0 ? (
          <div className="mx-auto mt-[34px] w-full max-w-2xl">
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label_translations?.en ?? stat.value}
                  className={`flex flex-col items-center px-2 text-center ${index !== 0 ? "border-white/10 sm:border-l" : ""}`}
                >
                  <div className="mb-1 text-2xl font-extrabold tracking-tight text-primary sm:mb-2 sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-text-secondary sm:text-[11px]">
                    {resolveTranslation(stat.label_translations, locale)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {techStack.length > 0 ? (
          <div className="mx-auto mt-[30px] w-full max-w-4xl">
            {techStackHeading ? (
              <h2 className="mb-1.5 text-center text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                {techStackHeading}
              </h2>
            ) : null}
            {techStackDescription ? (
              <p className="mx-auto mb-0 max-w-2xl px-4 text-center text-xs font-medium leading-snug text-text-secondary sm:text-sm">
                {techStackDescription}
              </p>
            ) : null}

            <div className="marquee-pause relative overflow-hidden py-4">
              <div className="marquee-scroll flex w-max gap-10 whitespace-nowrap sm:gap-12">
                {[...techStack, ...techStack].map((tech, index) => (
                  <div
                    key={`${tech.name}-${index}`}
                    className="group flex cursor-pointer flex-row items-center justify-center gap-2.5 text-white/70 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-white"
                  >
                    <span className="text-primary transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:scale-110">
                      <TechIcon name={tech.icon} />
                    </span>
                    <span className="text-base font-semibold tracking-wide sm:text-lg">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
