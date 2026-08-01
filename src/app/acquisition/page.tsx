import { getPublicAcquisitionSection } from "@/features/acquisition/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy a Business — Stratifit",
};

import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FinalCtaSection } from "@/components/sections/final-cta-section";

export default async function AcquisitionPage() {
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
              ? resolveTranslation(section.title_translations, "en")
              : "Buy a Business"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            {section
              ? resolveTranslation(section.description_translations, "en")
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
                        {resolveTranslation(benefit.text, "en")}
                      </li>
                    )
                  )}
                </ul>
              ) : null}
              {section.cta_label_translations && section.cta_url ? (
                <div className="mt-8">
                  <Button size="large">
                    <a href={section.cta_url}>
                      {resolveTranslation(section.cta_label_translations, "en")}
                    </a>
                  </Button>
                </div>
              ) : null}
            </Card>
          </Container>
        </Section>
      ) : null}

      <FinalCtaSection />
    </>
  );
}

