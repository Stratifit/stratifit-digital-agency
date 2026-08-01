import { getPublicSiteSettings } from "@/features/site-settings/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Stratifit",
};

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/contact-form";

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();

  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-20 md:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Contact
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Let&apos;s start a project
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            Tell us about your goals and we will get back to you with next steps.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-5">
            <Card className="p-6 lg:col-span-2">
              <h2 className="font-display text-lg font-semibold text-text-primary">
                Contact details
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-text-secondary">
                {settings?.contact_email ? (
                  <li>
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="hover:text-primary"
                    >
                      {settings.contact_email}
                    </a>
                  </li>
                ) : null}
                {settings?.contact_phone ? <li>{settings.contact_phone}</li> : null}
              </ul>
              {settings?.address_translations ? (
                <p className="mt-4 text-sm text-text-secondary">
                  {(settings.address_translations as Record<string, string>)?.en}
                </p>
              ) : null}
            </Card>

            <div className="lg:col-span-3">
              <Card className="p-6">
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  Send us a message
                </h2>
                <div className="mt-4">
                  <ContactForm />
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

