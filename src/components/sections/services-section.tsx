import { getPublicServices } from "@/features/services/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export async function ServicesSection() {
  const locale = await getLocale();
  const services = await getPublicServices();

  if (services.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Our Services
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const featured = service.display_order <= 1;
            return (
              <Card
                key={service.slug}
                variant={featured ? "featured" : "standard"}
                className="flex flex-col"
              >
                {service.icon_name ? (
                  <p className="text-sm font-medium text-primary">
                    {service.icon_name}
                  </p>
                ) : null}
                <h3 className="mt-3 font-display text-xl font-semibold text-text-primary">
                  {resolveTranslation(service.title_translations, locale)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">
                  {resolveTranslation(
                    service.short_description_translations,
                    locale
                  )}
                </p>
                <div className="mt-4">
                  <Badge variant={featured ? "warning" : "neutral"}>
                    {featured ? "Featured" : "Available"}
                  </Badge>
                </div>
                <div className="mt-4">
                  <Button variant={featured ? "primary" : "secondary"} size="small">
                    Learn More
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}


