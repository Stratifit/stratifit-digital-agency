import { getPublicProcessSteps } from "@/features/process/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export async function ProcessSection({ locale = "en" }: { locale?: string }) {
  const steps = await getPublicProcessSteps();

  if (steps.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Our Process
          </h2>
        </div>
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
