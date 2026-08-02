import { getPublicFinalCta } from "@/features/final-cta/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

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
                <LinkButton href={data.primary_cta_url} size="large">
                  {primaryLabel}
                </LinkButton>
              ) : null}
              {secondaryLabel && data.secondary_cta_url ? (
                <LinkButton href={data.secondary_cta_url} variant="secondary" size="large">
                  {secondaryLabel}
                </LinkButton>
              ) : null}
            </div>
          ) : null}
        </Card>
      </Container>
    </Section>
  );
}


