import { getPublicWhyChooseUs } from "@/features/why-choose-us/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { WhyChooseUsIcon } from "@/components/ui/why-choose-us-icon";
import { Reveal } from "@/components/ui/reveal";
import { WhyChooseUsCarousel } from "./why-choose-us-carousel";

export async function WhyChooseUsSection() {
  const locale = await getLocale();
  const [data, settings] = await Promise.all([
    getPublicWhyChooseUs(),
    getPublicSectionSetting("why-choose-us"),
  ]);

  if (!data) {
    return null;
  }

  const items = data.items ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <>
    <Section id="why-choose-us" className="scroll-mt-24">
      <Container>
        <SectionHeader settings={settings} locale={locale} />

        <Reveal
          stagger
          variant="card"
          className="mt-12 hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative flex h-full flex-col overflow-hidden rounded-card border border-card-border bg-card-dark p-6 transition-[border-color,transform,background-color] duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-primary/20 active:translate-y-0 active:border-primary/40 active:bg-card-active focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2 md:p-8"
            >
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <WhyChooseUsIcon name={item.icon} className="size-7 text-primary" />
                </div>

                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold tracking-tight text-text-primary">
                    {resolveTranslation(item.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-text-muted">
                    {resolveTranslation(item.description, locale)}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <div className="font-display text-2xl font-black text-primary">
                    {item.stat_value}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">
                    {resolveTranslation(item.stat_label, locale)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal cardSelector="[data-why-card]">
          <WhyChooseUsCarousel items={items} locale={locale} />
        </Reveal>
      </Container>
    </Section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
