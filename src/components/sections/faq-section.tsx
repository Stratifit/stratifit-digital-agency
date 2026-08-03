import { getPublicFaqs } from "@/features/faq/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { FaqAccordion, type FaqItem } from "./faq-accordion";

export async function FaqSection() {
  const locale = await getLocale();
  const [faqs, settings] = await Promise.all([
    getPublicFaqs(),
    getPublicSectionSetting("faq"),
  ]);

  if (faqs.length === 0) {
    return null;
  }

  const items: FaqItem[] = faqs.map((faq) => ({
    id: faq.id,
    question: resolveTranslation(faq.question_translations, locale),
    answer: resolveTranslation(faq.answer_translations, locale),
  }));

  return (
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <Reveal className="mx-auto mt-12 max-w-6xl">
          <FaqAccordion items={items} />
        </Reveal>
      </Container>
    </Section>
  );
}
