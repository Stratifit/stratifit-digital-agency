import { getPublicServices } from "@/features/services/queries";
import { getPublicServicePages } from "@/features/service-pages/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCard, ServiceCardCta } from "./service-card";

export async function ServicesSection() {
  const locale = await getLocale();
  const [services, settings, servicePages] = await Promise.all([
    getPublicServices(),
    getPublicSectionSetting("services"),
    getPublicServicePages(),
  ]);

  if (services.length === 0) {
    return null;
  }

  const pageSlugs = new Set(servicePages.map((p) => p.slug));

  return (
    <>
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />

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
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}

