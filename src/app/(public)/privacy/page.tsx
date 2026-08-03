import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/reveal";

export const metadata = pageMetadata({
  title: "Privacy Policy — Stratifit",
  description: "How Stratifit collects, uses, and protects personal data.",
  path: "/privacy",
});

import { Section } from "@/components/ui/section";

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-16 md:py-20">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-text-muted">Last updated: August 2026</p>
        </Container>
      </section>
      <Section>
        <Container className="max-w-3xl">
          <Reveal variant="fade">
          <div className="space-y-6 text-sm leading-7 text-text-secondary">
            <p>
              This privacy policy explains how Stratifit collects, uses, and
              protects personal information submitted through this website.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">1. Data we collect</h2>
            <p>
              When you contact us, we collect the details you provide: name, email,
              phone, company, and message content. We also collect basic technical
              data such as the pages you visit.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">2. How we use data</h2>
            <p>
              We use your information to respond to enquiries, qualify leads, and
              improve our services. We do not sell your personal data.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">3. Legal basis</h2>
            <p>
              We process personal data based on your consent and on our legitimate
              interest in operating our business and responding to enquiries.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">4. Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal
              data at any time. Contact us to exercise these rights.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">5. Contact</h2>
            <p>
              For privacy questions, contact us through the contact page or email
              the address listed on this website.
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

