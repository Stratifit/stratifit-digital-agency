import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ScrollTriggerSync } from "@/components/layout/scroll-trigger-sync";
import { ContactPopup } from "@/components/contact/contact-popup";
import { getPublicServices } from "@/features/services/queries";
import { getPublicPricingPlans } from "@/features/pricing/queries";
import { getPublicServicePageSlugs } from "@/features/service-pages/queries";
import { getPublicFaqs } from "@/features/faq/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/ui-strings";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, services, plans, servicePageSlugs, faqs] = await Promise.all([
    getLocale(),
    getPublicServices(),
    getPublicPricingPlans(),
    getPublicServicePageSlugs(),
    getPublicFaqs(),
  ]);

  return (
    <>
      <ScrollTriggerSync />
      <a
        href="#main"
        className="skip-link"
      >
        {t(locale, "skipToContent")}
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget
        services={services}
        plans={plans}
        servicePageSlugs={servicePageSlugs}
        faqs={faqs}
      />
      <ContactPopup services={services} locale={locale} />
    </>
  );
}
