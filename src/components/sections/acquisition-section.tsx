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

  // Paused via the admin sections manager (is_visible = false) or no
  // listings yet → render nothing.
  if (!settings || businesses.length === 0) {
    return null;
  }

  return (
    <>
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <div className="mt-12">
          <Reveal cardSelector="[data-business-card]">
            <AcquisitionGallery businesses={businesses} locale={locale} />
          </Reveal>
        </div>
      </Container>
    </Section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
