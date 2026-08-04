import { getPublicServices } from "@/features/services/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { pageMetadata } from "@/lib/seo";
import { ContactPanel } from "@/components/contact/contact-panel";

export const metadata = pageMetadata({
  title: "Contact — Stratifit",
  description:
    "Get in touch with Stratifit. We reply to every enquiry within 24 hours.",
  path: "/contact",
});

export default async function ContactPage() {
  const locale = await getLocale();
  const services = await getPublicServices();

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="rounded-lg border border-card-border bg-card-dark p-4 sm:p-8 lg:p-10">
          <ContactPanel services={services} locale={locale} />
        </div>
      </div>
    </section>
  );
}
