import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { getPublicServices } from "@/features/services/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Stratifit",
};

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/forms/contact-form";

export default async function ContactPage() {
  const locale = await getLocale();
  const [settings, services] = await Promise.all([
    getPublicSiteSettings(),
    getPublicServices(),
  ]);

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
          <div className="overflow-hidden rounded-card-lg border border-card-border bg-card-dark">
            <div className="grid lg:grid-cols-5">
              <div className="p-8 sm:p-10 lg:col-span-2 lg:border-r lg:border-card-border">
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  Contact details
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-text-secondary">
                  {settings?.contact_email ? (
                    <li>
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="text-primary transition-colors hover:text-primary-bright"
                      >
                        {settings.contact_email}
                      </a>
                    </li>
                  ) : null}
                  {settings?.contact_phone ? (
                    <li>{settings.contact_phone}</li>
                  ) : null}
                </ul>
                {settings?.address_translations ? (
                  <p className="mt-4 text-sm text-text-secondary">
                    {resolveTranslation(
                      settings.address_translations,
                      locale
                    )}
                  </p>
                ) : null}
                <p className="mt-8 rounded-[16px] border border-card-border bg-background/40 p-4 text-sm leading-relaxed text-text-muted">
                  We reply to every enquiry within 24 hours. Prefer email?
                  Reach us directly at the address above.
                </p>
              </div>
              <div className="p-8 sm:p-10 lg:col-span-3">
                <ContactForm services={services} locale={locale} />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
