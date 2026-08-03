import { getPublicServices } from "@/features/services/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services — Stratifit",
  description:
    "Explore Stratifit's core services: brand design, website development, AI & automation, and growth marketing.",
  path: "/services",
});

import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { ServiceIcon } from "@/components/ui/service-icon";
import { Reveal } from "@/components/ui/reveal";

export default async function ServicesPage() {
  const locale = await getLocale();
  const services = await getPublicServices();

  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-20 md:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Services
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            What we do
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            Four core disciplines, one integrated approach to digital growth.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <Reveal stagger variant="card" className="space-y-6">
            {services.map((service, index) => (
              <Card
                key={service.slug}
                variant={index === 0 ? "featured" : "standard"}
                className="p-8"
              >
                <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
                  <div>
                    {service.icon_name ? (
                      <span className="text-primary">
                        <ServiceIcon name={service.icon_name} />
                      </span>
                    ) : null}
                    <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-text-primary">
                      {resolveTranslation(service.title_translations, locale)}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {resolveTranslation(service.short_description_translations, locale)}
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <p className="text-base leading-7 text-text-secondary">
                      {resolveTranslation(service.full_description_translations, locale)}
                    </p>
                    {service.cta_label_translations &&
                    resolveTranslation(service.cta_label_translations, locale) ? (
                      <LinkButton
                        href={service.cta_url ?? "/contact"}
                        size="small"
                        className="mt-6"
                      >
                        {resolveTranslation(service.cta_label_translations, locale)}
                      </LinkButton>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}


