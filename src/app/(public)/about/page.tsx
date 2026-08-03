import { getPublicWhyChooseUs } from "@/features/why-choose-us/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About — Stratifit",
  description:
    "Learn about Stratifit, a premium digital agency for web, brand, AI, and growth.",
  path: "/about",
});

import { getPublicProcessSteps } from "@/features/process/queries";
import { getPublicTestimonials } from "@/features/testimonials/queries";
import { getPublicFinalCta } from "@/features/final-cta/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { FinalCtaSection } from "@/components/sections/final-cta-section";

export default async function AboutPage() {
  const locale = await getLocale();
  const [why, process, testimonials, cta] = await Promise.all([
    getPublicWhyChooseUs(),
    getPublicProcessSteps(),
    getPublicTestimonials(3),
    getPublicFinalCta(),
  ]);

  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-20 md:py-28">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            About Stratifit
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            A digital agency built for results
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            We combine brand strategy, engineering, AI, and growth marketing to
            build digital experiences that perform.
          </p>
        </Container>
      </section>

      {why ? (
        <Section>
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                  {resolveTranslation(why.title_translations, locale)}
                </h2>
                <p className="mt-4 text-lg leading-8 text-text-secondary">
                  {resolveTranslation(why.description_translations, locale)}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {Array.isArray(why.items)
                  ? (why.items as { title?: Record<string, string>; description?: Record<string, string> }[]).map(
                      (item, index) => (
                        <Card key={index}>
                          <h3 className="font-display text-lg font-semibold text-text-primary">
                            {resolveTranslation(item.title, locale)}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-text-secondary">
                            {resolveTranslation(item.description, locale)}
                          </p>
                        </Card>
                      )
                    )
                  : null}
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {process.length > 0 ? (
        <Section>
          <Container>
            <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              How We Work
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {process.map((step) => (
                <Card key={step.step_key}>
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
      ) : null}

      {testimonials.length > 0 ? (
        <Section>
          <Container>
            <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              What Our Clients Say
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t, index) => (
                <Card key={index} className="flex flex-col">
                  <p className="flex-1 text-base leading-7 text-text-primary">
                    &ldquo;{resolveTranslation(t.quote_translations, locale)}&rdquo;
                  </p>
                  <div className="mt-6">
                    <p className="font-medium text-text-primary">{t.person_name}</p>
                    <p className="text-sm text-text-muted">
                      {resolveTranslation(t.person_role_translations, locale)}
                      {t.company_name ? ` — ${t.company_name}` : ""}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {cta ? (
        <FinalCtaSection />
      ) : (
        <Section>
          <Container className="text-center">
            <LinkButton href="/contact" size="large">
              Start Your Project
            </LinkButton>
          </Container>
        </Section>
      )}
    </>
  );
}


