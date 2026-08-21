import { getPublicServices } from "@/features/services/queries";
import { getPublicServicePages } from "@/features/service-pages/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { ServicesAccordion } from "./services-accordion";

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

  return (
    <>
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />

        <Reveal>
          <ServicesAccordion
            services={services}
            locale={locale}
            detailSlugs={servicePages.map((page) => page.slug)}
          />
        </Reveal>

      </Container>
    </Section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}

