import { getPublicFinalCta } from "@/features/final-cta/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function FinalCtaSection() {
  const locale = await getLocale();
  const data = await getPublicFinalCta();

  if (!data) {
    return null;
  }

  const primaryLabel = resolveTranslation(
    data.primary_cta_label_translations,
    locale
  );
  const secondaryLabel = resolveTranslation(
    data.secondary_cta_label_translations,
    locale
  );

  return (
    <Section>
      <Container>
        <Card variant="featured" className="text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            {resolveTranslation(data.title_translations, locale)}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-text-secondary">
            {resolveTranslation(data.description_translations, locale)}
          </p>
          {(primaryLabel || secondaryLabel) ? (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {primaryLabel && data.primary_cta_url ? (
                <Button size="large">
                  <a href={data.primary_cta_url}>{primaryLabel}</a>
                </Button>
              ) : null}
              {secondaryLabel && data.secondary_cta_url ? (
                <Button variant="secondary" size="large">
                  <a href={data.secondary_cta_url}>{secondaryLabel}</a>
                </Button>
              ) : null}
            </div>
          ) : null}
        </Card>
      </Container>
    </Section>
  );
}


