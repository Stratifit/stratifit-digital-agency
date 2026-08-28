import { getPublicProcessSteps } from "@/features/process/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolvePublicTranslation as resolveTranslation } from "@/lib/i18n/public-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { ProcessIcon } from "@/components/ui/process-icon";
import { Reveal } from "@/components/ui/reveal";
import { ProcessCarousel } from "./process-carousel";

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
    <>
    <Section id="process" className="scroll-mt-24">
      <Container>
        <SectionHeader settings={settings} locale={locale} />

        <Reveal stagger variant="card" className="mt-12 hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.step_key} className="group relative">
              <div className="relative h-full overflow-hidden rounded-card border border-card-border bg-card-dark p-6 transition-[border-color,transform,background-color] duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-primary/20 active:translate-y-0 active:border-primary/40 active:bg-card-active focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2 md:p-8">
                <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3 py-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-inverse">
                    STEP {step.number.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="mb-5 flex size-14 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <ProcessIcon name={step.icon_name} className="size-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary">
                  {resolveTranslation(step.title_translations, locale)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {resolveTranslation(step.description_translations, locale)}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-xl text-primary/30 lg:block"
                >
                  →
                </span>
              ) : null}
            </div>
          ))}
        </Reveal>

        <Reveal cardSelector="[data-step-card]">
          <ProcessCarousel steps={steps} locale={locale} />
        </Reveal>
      </Container>
    </Section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
