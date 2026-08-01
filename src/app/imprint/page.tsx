import { getPublicSiteSettings } from "@/features/site-settings/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprint — Stratifit",
};

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default async function ImprintPage() {
  const settings = await getPublicSiteSettings();

  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-16 md:py-20">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Imprint
          </h1>
          <p className="mt-3 text-sm text-text-muted">Legal notice / Impressum</p>
        </Container>
      </section>
      <Section>
        <Container className="max-w-3xl">
          <div className="space-y-6 text-sm leading-7 text-text-secondary">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Company</h2>
              <p className="mt-2">
                {settings?.site_name ?? "Stratifit"}
                <br />
                Address to be provided
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Contact</h2>
              <p className="mt-2">
                {settings?.contact_email ? (
                  <>
                    Email:{" "}
                    <a href={`mailto:${settings.contact_email}`} className="hover:text-hover">
                      {settings.contact_email}
                    </a>
                    <br />
                  </>
                ) : null}
                {settings?.contact_phone ? (
                  <>Phone: {settings.contact_phone}</>
                ) : null}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Represented by</h2>
              <p className="mt-2">Managing director / owner to be provided.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Responsible for content</h2>
              <p className="mt-2">To be provided.</p>
            </div>
            <p className="rounded-radius-sm border border-border bg-surface p-4 text-text-muted">
              Note: This placeholder must be completed with the legally required
              company information before launch.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}


