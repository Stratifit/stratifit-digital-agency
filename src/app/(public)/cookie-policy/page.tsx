import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy — Stratifit",
  description: "How Stratifit uses cookies.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-16 md:py-20">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm text-text-muted">Last updated: August 2026</p>
        </Container>
      </section>
      <Section>
        <Container className="max-w-3xl">
          <div className="space-y-6 text-sm leading-7 text-text-secondary">
            <p>
              This cookie policy explains how Stratifit uses cookies and similar
              technologies on this website.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">1. What are cookies</h2>
            <p>
              Cookies are small text files stored on your device that help websites
              function and improve your browsing experience.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">2. How we use cookies</h2>
            <p>
              We use essential cookies for basic site functionality and, where
              enabled, analytics cookies to understand how visitors use the site.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">3. Managing cookies</h2>
            <p>
              You can control or delete cookies through your browser settings at any
              time. Disabling cookies may affect site functionality.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">4. Contact</h2>
            <p>
              For questions about this cookie policy, contact us through the contact
              page.
            </p>
            <p className="rounded-sm border border-border bg-surface p-4 text-text-muted">
              Note: This placeholder must be reviewed and finalized by qualified
              legal counsel before launch.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
