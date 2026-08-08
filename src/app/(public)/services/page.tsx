import { getPublicServices } from "@/features/services/queries";
import { getPublicServicePages } from "@/features/service-pages/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services — Stratifit",
  description:
    "Explore Stratifit's core services: brand design, website development, AI & automation, and growth marketing.",
  path: "/services",
});

import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { t } from "@/lib/i18n/ui-strings";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { ServiceIcon } from "@/components/ui/service-icon";
import { Reveal } from "@/components/ui/reveal";

export default async function ServicesPage() {
  const locale = await getLocale();
  const [services, servicePages, settings] = await Promise.all([
    getPublicServices(),
    getPublicServicePages(),
    getPublicSectionSetting("services"),
  ]);
  const pageSlugs = new Set(servicePages.map((page) => page.slug));

  const eyebrow =
    resolveTranslation(settings?.eyebrow_translations ?? null, locale) ||
    t(locale, "servicesEyebrow");
  const title =
    resolveTranslation(settings?.title_translations ?? null, locale) ||
    t(locale, "servicesTitle");
  const description =
    resolveTranslation(settings?.description_translations ?? null, locale) ||
    t(locale, "servicesDescription");

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Warm amber halo behind the heading — Stratifit yellow on black */}
          <div className="absolute left-1/2 top-0 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <Container className="relative pt-16 pb-8">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            {description}
          </p>
        </Container>
      </section>

      <div aria-hidden="true" className="h-px w-full bg-white/5" />

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
                      <ContactAwareLink
                        href={
                          pageSlugs.has(service.slug)
                            ? `/services/${service.slug}`
                            : service.cta_url
                        }
                        size="small"
                        className="mt-6"
                      >
                        {resolveTranslation(service.cta_label_translations, locale)}
                      </ContactAwareLink>
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


