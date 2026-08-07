import { getPublicServices } from "@/features/services/queries";
import {
  getPublicSectionSetting,
  type PublicSectionSettings,
} from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/ui-strings";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/forms/contact-form";

/** Fills empty translation fields with localized fallbacks so the section
    header never renders without its title/description. */
function withFallbacks(
  settings: PublicSectionSettings | null,
  locale: string
): PublicSectionSettings | null {
  if (!settings) return null;

  const eyebrow =
    settings.eyebrow_translations?.[locale]?.trim() ||
    settings.eyebrow_translations?.en?.trim()
      ? settings.eyebrow_translations
      : { [locale]: t(locale, "contactEyebrow") };
  const title =
    settings.title_translations?.[locale]?.trim() ||
    settings.title_translations?.en?.trim()
      ? settings.title_translations
      : { [locale]: t(locale, "contactTitleFallback") };
  const description =
    settings.description_translations?.[locale]?.trim() ||
    settings.description_translations?.en?.trim()
      ? settings.description_translations
      : { [locale]: t(locale, "contactDescriptionFallback") };

  return {
    ...settings,
    eyebrow_translations: eyebrow,
    title_translations: title,
    description_translations: description,
  };
}

export async function ContactSection() {
  const locale = await getLocale();
  const [services, settings] = await Promise.all([
    getPublicServices(),
    getPublicSectionSetting("contact"),
  ]);

  const effectiveSettings = withFallbacks(settings, locale);

  return (
    <Section>
      <Container>
        <SectionHeader settings={effectiveSettings} locale={locale} />
        <Reveal className="mx-auto mt-12 max-w-2xl">
          <ContactForm services={services} locale={locale} />
        </Reveal>
      </Container>
    </Section>
  );
}
