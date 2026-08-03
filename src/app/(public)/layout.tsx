import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ScrollTriggerSync } from "@/components/layout/scroll-trigger-sync";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/ui-strings";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

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
      <ChatWidget />
    </>
  );
}
