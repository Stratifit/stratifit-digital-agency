import { getPublicFaqs } from "@/features/faq/queries";
import { getPublicFaqBotSettings } from "@/features/faq-bot/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolvePublicTranslation as resolveTranslation } from "@/lib/i18n/public-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { FaqChatBot } from "@/components/chat/faq-chat-bot";
import { FaqAccordion, type FaqItem } from "./faq-accordion";
import { FaqHelpCard } from "./faq-help-card";

export async function FaqSection() {
  const locale = await getLocale();
  const [faqs, settings, faqBotSettings] = await Promise.all([
    getPublicFaqs(),
    getPublicSectionSetting("faq"),
    getPublicFaqBotSettings(),
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
    <>
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <Reveal className="mx-auto mt-12 max-w-6xl">
          <FaqAccordion items={items} />
        </Reveal>
        {faqBotSettings?.faq_bot_enabled ? (
          <Reveal className="mx-auto mt-6 max-w-6xl">
            <FaqHelpCard locale={locale} />
          </Reveal>
        ) : null}
      </Container>
    </Section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    {faqBotSettings?.faq_bot_enabled ? (
      <FaqChatBot locale={locale} settings={faqBotSettings} />
    ) : null}
    </>
  );
}
