import { getPublicServices } from "@/features/services/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/forms/contact-form";

export async function ContactSection() {
  const locale = await getLocale();
  const [services, settings] = await Promise.all([
    getPublicServices(),
    getPublicSectionSetting("contact"),
  ]);

  return (
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <Reveal className="mx-auto mt-12 max-w-2xl">
          <ContactForm services={services} locale={locale} />
        </Reveal>
      </Container>
    </Section>
  );
}
