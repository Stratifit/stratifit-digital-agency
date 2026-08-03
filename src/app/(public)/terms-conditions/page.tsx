import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/reveal";

export const metadata = pageMetadata({
  title: "Terms of Service — Stratifit",
  description: "Terms and conditions for using the Stratifit website.",
  path: "/terms-conditions",
});

export default function TermsConditionsPage() {
  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-16 md:py-20">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-text-muted">Last updated: August 2026</p>
        </Container>
      </section>
      <Section>
        <Container className="max-w-3xl">
          <Reveal variant="fade">
          <div className="space-y-6 text-sm leading-7 text-text-secondary">
            <p>
              These terms govern the use of the Stratifit website and its services.
              By accessing this website, you agree to these terms.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">1. Services</h2>
            <p>
              Stratifit provides digital agency services including brand design,
              website development, AI & automation, and growth marketing.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">2. Intellectual property</h2>
            <p>
              All content, designs, and materials delivered remain the intellectual
              property of their respective owners unless agreed otherwise in writing.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">3. Limitation of liability</h2>
            <p>
              Stratifit is not liable for indirect or consequential damages arising
              from the use of this website or its services.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">4. Contact</h2>
            <p>
              For questions about these terms, contact us through the contact page.
            </p>
            <p className="rounded-sm border border-border bg-surface p-4 text-text-muted">
              Note: This placeholder must be reviewed and finalized by qualified
              legal counsel before launch.
            </p>
          </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
