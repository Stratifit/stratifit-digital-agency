import { getPublicAcquisitionSection } from "@/features/acquisition/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy a Business — Stratifit",
};

import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { AcquisitionEnquiryForm } from "@/components/forms/acquisition-enquiry-form";

export default async function AcquisitionPage() {
  const locale = await getLocale();
  const section = await getPublicAcquisitionSection();

  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-20 md:py-28">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Acquisition
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            {section
              ? resolveTranslation(section.title_translations, locale)
              : "Buy a Business"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            {section
              ? resolveTranslation(section.description_translations, locale)
              : "Looking to acquire a digital business? We help you find and evaluate opportunities."}
          </p>
        </Container>
      </section>

      {section ? (
        <Section>
          <Container>
            <Card variant="featured">
              <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary">
                What we offer
              </h2>
              {Array.isArray(section.benefits) ? (
                <ul className="mt-6 space-y-4">
                  {(section.benefits as { text?: Record<string, string> }[]).map(
                    (benefit, index) => (
                      <li key={index} className="flex items-center gap-3 text-text-primary">
                        <span className="font-medium text-primary">✓</span>
                        {resolveTranslation(benefit.text, locale)}
                      </li>
                    )
                  )}
                </ul>
              ) : null}
              {section.cta_label_translations && section.cta_url ? (
                <div className="mt-8">
                  <LinkButton href={section.cta_url} size="large">
                    {resolveTranslation(section.cta_label_translations, locale)}
                  </LinkButton>
                </div>
              ) : null}
            </Card>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Enquire
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                Interested in a business?
              </h2>
              <p className="mt-6 max-w-lg leading-8 text-text-secondary">
                Tell us which business you are interested in and what you are
                looking for. We will get back to you within 24 hours to discuss
                next steps.
              </p>
            </div>
            <Card variant="featured">
              <AcquisitionEnquiryForm
                businesses={
                  section
                    ? section.businesses?.map((b) => b.name) ?? []
                    : []
                }
                locale={locale}
              />
            </Card>
          </div>
        </Container>
      </Section>

      <FinalCtaSection />
    </>
  );
}


