import { getPublicAcquisitionSection } from "@/features/acquisition/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Benefit {
  icon?: string;
  text?: Record<string, string>;
}

export async function AcquisitionSection() {
  const locale = await getLocale();
  const data = await getPublicAcquisitionSection();

  if (!data) {
    return null;
  }

  const benefits = Array.isArray(data.benefits)
    ? (data.benefits as Benefit[])
    : [];

  return (
    <Section>
      <Container>
        <Card variant="featured">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                {resolveTranslation(data.title_translations, locale)}
              </h2>
              <p className="mt-4 text-lg leading-8 text-text-secondary">
                {resolveTranslation(data.description_translations, locale)}
              </p>
              {data.cta_label_translations && data.cta_url ? (
                <div className="mt-8">
                  <Button size="large">
                    <a href={data.cta_url}>
                      {resolveTranslation(data.cta_label_translations, locale)}
                    </a>
                  </Button>
                </div>
              ) : null}
            </div>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-text-primary"
                >
                  {benefit.icon ? (
                    <span className="font-medium text-primary">
                      {benefit.icon}
                    </span>
                  ) : null}
                  <span>{resolveTranslation(benefit.text, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </Container>
    </Section>
  );
}


