import { getPublicAcquisitionSection } from "@/features/acquisition/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { AcquisitionGallery } from "./acquisition-gallery";

export async function AcquisitionSection() {
  const locale = await getLocale();
  const [data, settings] = await Promise.all([
    getPublicAcquisitionSection(),
    getPublicSectionSetting("acquisition"),
  ]);

  const businesses = data?.businesses ?? [];

  if (businesses.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <div className="mt-12">
          <Reveal cardSelector="[data-business-card]">
            <AcquisitionGallery businesses={businesses} />
          </Reveal>
        </div>
      </Container>
      <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </Section>
  );
}
