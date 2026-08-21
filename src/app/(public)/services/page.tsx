import { getPublicServices } from "@/features/services/queries";
import type { Metadata } from "next";
import { getPublicServicePages } from "@/features/service-pages/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicSectionSettingIncludingHidden } from "@/features/section-settings/queries";
import { pageMetadata, resolveSeoMetadata } from "@/lib/seo";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { t } from "@/lib/i18n/ui-strings";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCard, ServiceCardCta } from "@/components/sections/service-card";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const setting = await getPublicSectionSettingIncludingHidden("services");
  const { title, description } = resolveSeoMetadata({
    seoTitleTranslations: setting?.seo_title_translations,
    seoDescriptionTranslations: setting?.seo_description_translations,
    locale,
    fallbackTitle: "Services Stratifit",
    fallbackDescription:
      "Explore Stratifit's core services: brand design, website development, AI & automation, and growth marketing.",
  });
  return pageMetadata({ title, description, path: "/services" });
}

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
      <section className="relative overflow-hidden bg-background">
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
          <Reveal stagger variant="card" className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                service={service}
                locale={locale}
                cta={
                  <ServiceCardCta
                    service={service}
                    locale={locale}
                    hasDetailPage={pageSlugs.has(service.slug)}
                  />
                }
              />
            ))}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
