import { getPublicServices } from "@/features/services/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Stratifit",
};

import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          <div className="space-y-6">
            {services.map((service, index) => (
              <Card
                key={service.slug}
                variant={index === 0 ? "featured" : "standard"}
                className="p-8"
              >
                <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
                  <div>
                    {service.icon_name ? (
                      <p className="text-sm font-medium text-primary">
                        {service.icon_name}
                      </p>
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
                      <Button size="small" className="mt-6">
                        <a href={service.cta_url ?? "/contact"}>
                          {resolveTranslation(service.cta_label_translations, locale)}
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}


