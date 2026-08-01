import { getPublicPricingPlans } from "@/features/pricing/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

interface FeaturesTranslations {
  en?: string[];
  de?: string[];
  fr?: string[];
  es?: string[];
  [key: string]: unknown;
}

export async function PricingSection() {
  const locale = await getLocale();
  const [plans, settings] = await Promise.all([
    getPublicPricingPlans(),
    getPublicSectionSetting("pricing"),
  ]);

  if (plans.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} align="center" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const features = (
              (plan.features_translations as FeaturesTranslations | null)?.[
                locale
              ] ??
              (plan.features_translations as FeaturesTranslations | null)?.[
                "en"
              ] ??
              []
            ) as string[];
            return (
              <Card
                key={plan.slug}
                variant={plan.is_featured ? "featured" : "standard"}
                className="flex flex-col"
              >
                {plan.is_featured ? (
                  <Badge variant="warning" className="self-start">
                    Most Popular
                  </Badge>
                ) : null}
                <h3 className="mt-3 font-display text-xl font-semibold text-text-primary">
                  {resolveTranslation(plan.name_translations, locale)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {resolveTranslation(plan.description_translations, locale)}
                </p>
                <p className="mt-4 font-display text-2xl font-bold text-text-primary">
                  {resolveTranslation(plan.price_label_translations, locale)}
                </p>
                <p className="text-sm text-text-muted">
                  {resolveTranslation(plan.billing_label_translations, locale)}
                </p>
                <ul className="mt-6 flex-1 space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="mt-1 text-primary">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.cta_label_translations ? (
                  <div className="mt-6">
                    <Button
                      variant={plan.is_featured ? "primary" : "secondary"}
                      className="w-full"
                    >
                      <a href={plan.cta_url ?? "/contact"} className="w-full">
                        {resolveTranslation(plan.cta_label_translations, locale)}
                      </a>
                    </Button>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}


