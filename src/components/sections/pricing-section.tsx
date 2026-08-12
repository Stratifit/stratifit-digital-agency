import { getPublicPricingPlans } from "@/features/pricing/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { PricingPlans } from "./pricing-plans";

export async function PricingSection() {
  const locale = await getLocale();
  const [plans, settings] = await Promise.all([
    getPublicPricingPlans(),
    getPublicSectionSetting("pricing"),
  ]);

  if (plans.length === 0) {
    return null;
  }

  return (
    <>
    <Section id="pricing" className="scroll-mt-24">
      <Container>
        <SectionHeader settings={settings} locale={locale} align="left" />
        <Reveal variant="card" className="mt-12" cardSelector="[data-plan-card]">
          <PricingPlans plans={plans} locale={locale} />
        </Reveal>
      </Container>
    </Section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
