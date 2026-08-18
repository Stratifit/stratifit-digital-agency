import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ScrollTriggerSync } from "@/components/layout/scroll-trigger-sync";
import { PublicBackButton } from "@/components/layout/public-back-button";
import { ContactPopup } from "@/components/contact/contact-popup";
import { getPublicServices } from "@/features/services/queries";
import { getPublicPricingPlans } from "@/features/pricing/queries";
import { getPublicServicePageSlugs } from "@/features/service-pages/queries";
import { getPublicFaqs } from "@/features/faq/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getPublicCookieSettings } from "@/features/cookie-settings/queries";
import { CookieConsentBanner } from "@/components/cookie/cookie-consent-banner";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/ui-strings";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const [
    services,
    plans,
    servicePageSlugs,
    faqs,
    faqSettings,
    servicesSettings,
    pricingSettings,
    cookieSettings,
  ] = await Promise.all([
    getPublicServices(),
    getPublicPricingPlans(),
    getPublicServicePageSlugs(),
    getPublicFaqs(),
    getPublicSectionSetting("faq"),
    getPublicSectionSetting("services"),
    getPublicSectionSetting("pricing"),
    getPublicCookieSettings(locale),
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
      <PublicBackButton locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget
        services={services}
        plans={plans}
        servicePageSlugs={servicePageSlugs}
        faqs={faqs}
        faqSettings={faqSettings}
        servicesSettings={servicesSettings}
        pricingSettings={pricingSettings}
      />
      <ContactPopup services={services} locale={locale} />
      <CookieConsentBanner settings={cookieSettings} locale={locale} />
    </>
  );
}
