import { getPublicWhyChooseUs } from "@/features/why-choose-us/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

interface WhyChooseUsItem {
  icon?: string;
  title?: Record<string, string>;
  description?: Record<string, string>;
}

export async function WhyChooseUsSection({ locale = "en" }: { locale?: string }) {
  const data = await getPublicWhyChooseUs();

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
          <div>
            {data.eyebrow_translations ? (
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                {resolveTranslation(data.eyebrow_translations, locale)}
              </p>
            ) : null}
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              {resolveTranslation(data.title_translations, locale)}
            </h2>
            <p className="mt-4 text-lg leading-8 text-text-secondary">
              {resolveTranslation(data.description_translations, locale)}
            </p>
          </div>
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
