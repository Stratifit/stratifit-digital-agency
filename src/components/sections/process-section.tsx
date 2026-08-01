import { getPublicProcessSteps } from "@/features/process/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

export async function ProcessSection() {
  const locale = await getLocale();
  const [steps, settings] = await Promise.all([
    getPublicProcessSteps(),
    getPublicSectionSetting("process"),
  ]);

  if (steps.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.step_key} className="relative">
              <span className="font-display text-3xl font-bold text-primary">
                {step.number.toString().padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-text-primary">
                {resolveTranslation(step.title_translations, locale)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {resolveTranslation(step.description_translations, locale)}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}


