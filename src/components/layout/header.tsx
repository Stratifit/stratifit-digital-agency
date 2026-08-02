import Link from "next/link";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { getPublicServices } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { BrandLogo } from "@/components/ui/brand-logo";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";
import { HeaderChatButton } from "./header-chat-button";

function Brand({ siteName }: { siteName: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteName} home`}
      className="flex w-[170px] select-none items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-[220px]"
    >
      <BrandLogo alt={siteName} priority />
    </Link>
  );
}

export async function Header() {
  const locale = await getLocale();
  const [items, settings, services] = await Promise.all([
    getPublicNavigation("header"),
    getPublicSiteSettings(),
    getPublicServices(),
  ]);

  const siteName = settings?.site_name ?? "Stratifit";
  const socialLinks = settings?.social_links ?? null;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/90 backdrop-blur-md">
      <Container className="relative flex h-16 items-center justify-between sm:h-20">
        {/* Mobile: hamburger (left) */}
        <div className="md:hidden">
          <MobileNav
            items={items}
            locale={locale}
            siteName={siteName}
            socialLinks={socialLinks}
            services={services}
            currentYear={new Date().getFullYear()}
          />
        </div>

        {/* Brand: centered on mobile, left on desktop */}
        <div className="absolute left-1/2 flex -translate-x-1/2 md:static md:flex-1 md:translate-x-0 md:justify-start">
          <Brand siteName={siteName} />
        </div>

        {/* Desktop: nav + language + CTA */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6" aria-label="Main">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.open_in_new_tab || item.is_external ? "_blank" : undefined}
                rel={item.open_in_new_tab || item.is_external ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {resolveTranslation(item.label_translations, locale)}
              </a>
            ))}
          </nav>

          <LanguageSwitcher currentLocale={locale} />

          <a
            href="/contact"
            className="flex items-center gap-2 rounded-button border border-transparent bg-primary px-5 py-2.5 text-sm font-bold text-text-inverse transition-[background-color,border-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-bright active:translate-y-0 active:border-primary/60 active:bg-primary-deep focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-2"
          >
            Start a Project
          </a>
        </div>

        {/* Mobile: chat button (right) */}
        <div className="md:hidden">
          <HeaderChatButton />
        </div>
      </Container>
    </header>
  );
}
