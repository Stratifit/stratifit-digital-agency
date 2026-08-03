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
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} dot />

        <Reveal stagger className="mt-12 hidden gap-6 lg:grid lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col overflow-hidden rounded-card border border-white/5 bg-card-dark p-6 shadow-xl shadow-black/50 transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/20 md:p-8"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/10" />

              <div className="relative z-10 flex flex-1 flex-col gap-5">
                <div className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-shadow group-hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]">
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

        <div className="mt-12 lg:hidden">
          <WhyChooseUsCarousel items={items} locale={locale} />
        </div>
      </Container>
    </Section>
  );
}
