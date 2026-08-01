import { getPublicWhyChooseUs } from "@/features/why-choose-us/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

interface WhyChooseUsItem {
  icon?: string;
  title?: Record<string, string>;
  description?: Record<string, string>;
}

export async function WhyChooseUsSection() {
  const locale = await getLocale();
  const [data, settings] = await Promise.all([
    getPublicWhyChooseUs(),
    getPublicSectionSetting("why-choose-us"),
  ]);

  if (!data) {
    return null;
  }

  const items = Array.isArray(data.items)
    ? (data.items as WhyChooseUsItem[])
    : [];

  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <SectionHeader settings={settings} locale={locale} />
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((item, index) => (
              <Card key={index}>
                {item.icon ? (
                  <p className="text-sm font-medium text-primary">
                    {item.icon}
                  </p>
                ) : null}
                <h3 className="mt-3 font-display text-lg font-semibold text-text-primary">
                  {resolveTranslation(item.title, locale)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {resolveTranslation(item.description, locale)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}


