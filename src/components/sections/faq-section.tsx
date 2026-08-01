import { getPublicFaqs } from "@/features/faq/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";

export async function FaqSection() {
  const locale = await getLocale();
  const [faqs, settings] = await Promise.all([
    getPublicFaqs(),
    getPublicSectionSetting("faq"),
  ]);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} align="center" />
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-radius-md border border-border bg-surface px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {resolveTranslation(faq.question_translations, locale)}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-text-muted transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {resolveTranslation(faq.answer_translations, locale)}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}


