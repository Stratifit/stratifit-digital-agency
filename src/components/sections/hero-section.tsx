import { getPublicHero } from "@/features/hero/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { CountUp } from "@/components/ui/count-up";
import { HeroEntrance } from "./hero-entrance";

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

/**
 * Canonical hero copy in all four languages, mirroring the seed. Used only
 * when the `hero` row's translations are empty so the homepage never renders
 * a blank headline/description (the database remains the source of truth).
 */
const FALLBACK_HERO = {
  eyebrow: {
    en: "Premium Digital Agency",
    de: "Premium-Digitalagentur",
    fr: "Agence Digitale Premium",
    es: "Agencia Digital Premium",
  },
  title: {
    en: "We Build Websites, Brands & Systems",
    de: "Wir bauen Websites, Marken & Systeme",
    fr: "Nous créons des sites web, des marques & des systèmes",
    es: "Creamos sitios web, marcas y sistemas",
  },
  highlight: {
    en: "That Grow Businesses.",
    de: "Die Unternehmen wachsen lassen.",
    fr: "Qui font grandir les entreprises.",
    es: "Que hacen crecer los negocios.",
  },
  description: {
    en: "We help startups and growing businesses build websites, brands, and AI-powered systems that turn visitors into customers.",
    de: "Wir helfen Startups und wachsenden Unternehmen, Websites, Marken und KI-gestützte Systeme aufzubauen, die Besucher in Kunden verwandeln.",
    fr: "Nous aidons les startups et les entreprises en croissance à créer des sites web, des marques et des systèmes alimentés par l'IA qui transforment les visiteurs en clients.",
    es: "Ayudamos a startups y empresas en crecimiento a construir sitios web, marcas y sistemas impulsados por IA que convierten visitantes en clientes.",
  },
  primaryCta: {
    en: "Start Your Project",
    de: "Projekt starten",
    fr: "Démarrer votre projet",
    es: "Iniciar tu proyecto",
  },
  secondaryCta: {
    en: "View Our Work",
    de: "Unsere Arbeiten ansehen",
    fr: "Voir nos réalisations",
    es: "Ver nuestro trabajo",
  },
} as const;

/** Client logos strip shown at the bottom of the hero. */
const TRUSTED_BY_LOGOS: { name: string; icon: React.ReactNode }[] = [
  {
    name: "LUMEN",
    icon: (
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
    ),
  },
  {
    name: "NOVUS",
    icon: (
      <path
        fillRule="evenodd"
        d="M11.622 1.602a.75.75 0 0 1 .756 0l2.25 1.313a.75.75 0 0 1-.756 1.295L12 3.118 10.128 4.21a.75.75 0 1 1-.756-1.295l2.25-1.313ZM5.898 5.81a.75.75 0 0 1-.27 1.025l-1.14.665 1.14.665a.75.75 0 1 1-.756 1.295L3.75 8.806v.944a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .372-.648l2.25-1.312a.75.75 0 0 1 1.026.27Zm12.204 0a.75.75 0 0 1 1.026-.27l2.25 1.312a.75.75 0 0 1 .372.648v2.25a.75.75 0 0 1-1.5 0v-.944l-1.122.654a.75.75 0 1 1-.756-1.295l1.14-.665-1.14-.665a.75.75 0 0 1-.27-1.025Zm-9 5.25a.75.75 0 0 1 1.026-.27L12 11.882l1.872-1.092a.75.75 0 1 1 .756 1.295l-1.878 1.096V15a.75.75 0 0 1-1.5 0v-1.82l-1.878-1.095a.75.75 0 0 1-.27-1.025ZM3 13.5a.75.75 0 0 1 .75.75v1.82l1.878 1.095a.75.75 0 1 1-.756 1.295l-2.25-1.312a.75.75 0 0 1-.372-.648v-2.25A.75.75 0 0 1 3 13.5Zm18 0a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.372.648l-2.25 1.312a.75.75 0 1 1-.756-1.295l1.878-1.096V14.25a.75.75 0 0 1 .75-.75Zm-9 5.25a.75.75 0 0 1 .75.75v.944l1.122-.654a.75.75 0 1 1 .756 1.295l-2.25 1.313a.75.75 0 0 1-.756 0l-2.25-1.313a.75.75 0 1 1 .756-1.295l1.122.654V19.5a.75.75 0 0 1 .75-.75Z"
        clipRule="evenodd"
      />
    ),
  },
  {
    name: "PULSE",
    icon: (
      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    ),
  },
  {
    name: "VERTEX",
    icon: (
      <path
        fillRule="evenodd"
        d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
        clipRule="evenodd"
      />
    ),
  },
  {
    name: "ORBIT",
    icon: (
      <path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    ),
  },
  {
    name: "NEXUS",
    icon: (
      <path
        fillRule="evenodd"
        d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 0 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
        clipRule="evenodd"
      />
    ),
  },
];

function TrustedByStrip() {
  return (
    <div className="w-full pb-6 lg:mx-auto lg:max-w-3xl">
      {/* Mobile-only centered label with side rules */}
      <div className="flex items-center gap-3 opacity-90 sm:hidden">
        <span className="h-px flex-1 bg-white/10" />
        <span className="shrink-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-white">
          Trusted by Growing Companies
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      {/* Mobile: 3 logos per row, 2 rows (6 total) */}
      <div className="grid grid-cols-3 items-center justify-items-center gap-x-4 gap-y-4 px-4 opacity-90 sm:hidden">
        {TRUSTED_BY_LOGOS.map((logo) => (
          <span
            key={logo.name}
            className="flex items-center gap-1.5 whitespace-nowrap font-display text-sm font-black tracking-[0.15em]"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="shrink-0 text-xl text-gray-300"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              {logo.icon}
            </svg>
            <span className="text-gray-100">{logo.name}</span>
          </span>
        ))}
      </div>

      {/* Desktop / tablet: label + all 6 logos on one row */}
      <div className="hidden shrink-0 items-center justify-between gap-8 whitespace-nowrap opacity-90 sm:flex lg:justify-start">
        <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-white md:text-sm">
          Trusted by Growing Companies
        </span>
        {TRUSTED_BY_LOGOS.map((logo) => (
          <span
            key={logo.name}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-base font-black tracking-[0.3em]"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="shrink-0 text-xl text-gray-300"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              {logo.icon}
            </svg>
            <span className="text-gray-100">{logo.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export async function HeroSection() {
  const locale = await getLocale();
  const hero = await getPublicHero();

  if (!hero) {
    return null;
  }

  const eyebrow =
    resolveTranslation(hero.eyebrow_translations, locale) ||
    resolveTranslation(FALLBACK_HERO.eyebrow, locale);
  const title =
    resolveTranslation(hero.title_translations, locale) ||
    resolveTranslation(FALLBACK_HERO.title, locale);
  const highlight =
    resolveTranslation(hero.highlight_translations, locale) ||
    resolveTranslation(FALLBACK_HERO.highlight, locale);
  const description =
    resolveTranslation(hero.description_translations, locale) ||
    resolveTranslation(FALLBACK_HERO.description, locale);
  const primaryLabel =
    resolveTranslation(hero.primary_cta_label_translations, locale) ||
    resolveTranslation(FALLBACK_HERO.primaryCta, locale);
  const secondaryLabel =
    resolveTranslation(hero.secondary_cta_label_translations, locale) ||
    resolveTranslation(FALLBACK_HERO.secondaryCta, locale);

  const dbMetrics = (hero.metrics as HeroMetric[] | null) ?? [];
  const stats = dbMetrics.length > 0 ? dbMetrics : FALLBACK_STATS;

  return (
    <>
    <section
      className="relative flex min-h-[calc(100svh-4rem)] items-start justify-center overflow-hidden bg-background pb-16 pt-16 sm:min-h-[calc(100svh-5rem)] md:pb-24 lg:pb-24 lg:pt-24"
    >
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center lg:px-8">
        <HeroEntrance>
        {eyebrow ? (
          <div
            data-hero
            className="mb-[31px] inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium tracking-wide text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {eyebrow}
          </div>
        ) : null}

        <h1
          data-hero
          className="flex flex-col items-center justify-center font-display text-[1.75rem] font-black leading-[1.15] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-5xl"
        >
          <span className="block">{title}</span>
          {highlight ? (
            <span className="mt-1 block text-[#ffb300] lg:mt-2">
              {highlight}
            </span>
          ) : null}
        </h1>

        {description ? (
          <p
            data-hero
            className="mx-auto mt-[18px] max-w-2xl text-[0.8rem] font-medium leading-snug text-text-secondary [text-shadow:0_0_1px_currentColor] sm:text-base"
          >
            {description}
          </p>
        ) : null}

        {primaryLabel || secondaryLabel ? (
          <div
            data-hero
            className="mx-auto mt-[26px] flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4"
          >
            {primaryLabel && hero.primary_cta_url ? (
              <ContactAwareLink
                href={hero.primary_cta_url}
                size="medium"
                className="group !h-12 w-full !font-semibold sm:w-[370px] sm:flex-none"
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
              </ContactAwareLink>
            ) : null}
            {secondaryLabel && hero.secondary_cta_url ? (
              <ContactAwareLink
                href={hero.secondary_cta_url}
                variant="tertiary"
                size="medium"
                className="group !h-12 w-full !rounded-[6px] sm:w-[370px] sm:flex-none"
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
              </ContactAwareLink>
            ) : null}
          </div>
        ) : null}

        {stats.length > 0 ? (
          <div data-hero className="mx-auto mt-[34px] w-full max-w-2xl">
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label_translations?.en ?? stat.value}
                  className={`flex flex-col items-center px-2 text-center ${index !== 0 ? "border-white/10 sm:border-l" : ""}`}
                >
                  <div className="mb-1 text-2xl font-extrabold tracking-tight text-primary sm:mb-2 sm:text-3xl">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-text-secondary sm:text-[11px]">
                    {resolveTranslation(stat.label_translations, locale)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div data-hero className="mt-[30px] w-full">
          <TrustedByStrip />
        </div>
        </HeroEntrance>
      </div>
    </section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
