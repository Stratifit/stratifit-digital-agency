import { getPublicHero } from "@/features/hero/queries";
import { DEFAULT_TRUSTED_BY } from "@/features/hero/defaults";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { CountUp } from "@/components/ui/count-up";
import { HeroEntrance } from "./hero-entrance";
import { TrustedByStrip } from "./trusted-by-strip";

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

interface TrustedByItem {
  name: string;
  icon: string;
  image_url?: string | null;
}

export async function HeroSection() {
  const locale = await getLocale();
  const hero = await getPublicHero();

  if (!hero) {
    return null;
  }

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

  // Trusted-by logos: missing column (pending migration) → canonical logos;
  // present but empty → admin cleared the strip, so hide it.
  const dbTrustedBy = (hero.trusted_by as TrustedByItem[] | null) ?? null;
  const trustedByItems =
    dbTrustedBy === null ? DEFAULT_TRUSTED_BY : dbTrustedBy;

  return (
    <>
    <section
      className="relative flex min-h-[calc(100svh-4rem)] items-start justify-center overflow-hidden bg-background pb-16 pt-16 sm:min-h-[calc(100svh-5rem)] md:pb-24 md:pt-24 lg:pb-24 lg:pt-24"
    >
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center lg:px-8">
        <HeroEntrance>
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

        {trustedByItems.length > 0 ? (
          <div data-hero className="mt-[30px] w-full">
            <TrustedByStrip items={trustedByItems} />
          </div>
        ) : null}
        </HeroEntrance>
      </div>
    </section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
