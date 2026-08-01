import { getPublicHero } from "@/features/hero/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export async function HeroSection() {
  const locale = await getLocale();
  const hero = await getPublicHero();

  if (!hero) {
    return null;
  }

  const title = resolveTranslation(hero.title_translations, locale);
  const eyebrow = resolveTranslation(hero.eyebrow_translations, locale);
  const description = resolveTranslation(hero.description_translations, locale);
  const primaryLabel = resolveTranslation(
    hero.primary_cta_label_translations,
    locale
  );
  const secondaryLabel = resolveTranslation(
    hero.secondary_cta_label_translations,
    locale
  );

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 20%, rgba(245,158,11,0.14) 0%, rgba(245,158,11,0.04) 35%, transparent 70%)",
        }}
      />
      <Container className="relative py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              {description}
            </p>
          ) : null}
          {(primaryLabel || secondaryLabel) ? (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryLabel && hero.primary_cta_url ? (
                <Button size="large">
                  <a href={hero.primary_cta_url} className="flex items-center gap-2">
                    {primaryLabel}
                  </a>
                </Button>
              ) : null}
              {secondaryLabel && hero.secondary_cta_url ? (
                <Button variant="secondary" size="large">
                  <a href={hero.secondary_cta_url} className="flex items-center gap-2">
                    {secondaryLabel}
                  </a>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}


