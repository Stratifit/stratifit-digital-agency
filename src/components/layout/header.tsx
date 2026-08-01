import Link from "next/link";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";
import { HeaderChatButton } from "./header-chat-button";

function Brand({ siteName }: { siteName: string }) {
  return (
    <Link
      href="/"
      className="flex select-none items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-radius-md bg-primary text-sm font-extrabold tracking-tight text-text-inverse sm:h-10 sm:w-10 sm:text-base shadow-[rgba(245,158,11,0.25)_0px_6px_20px]"
      >
        SF
      </span>
      <span className="text-sm font-semibold uppercase tracking-[0.15em] text-text-primary sm:text-base">
        {siteName}
      </span>
    </Link>
  );
}

export async function Header() {
  const locale = await getLocale();
  const [items, settings] = await Promise.all([
    getPublicNavigation("header"),
    getPublicSiteSettings(),
  ]);

  const siteName = settings?.site_name ?? "Stratifit";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background-deep/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        {/* Mobile: hamburger (left) */}
        <div className="md:hidden">
          <MobileNav items={items} locale={locale} siteName={siteName} />
        </div>

        {/* Brand: centered on mobile, left on desktop */}
        <div className="flex flex-1 justify-center md:flex-none md:justify-start">
          <Brand siteName={siteName} />
        </div>

        {/* Desktop: nav + language + CTA */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6" aria-label="Main">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.open_in_new_tab ? "_blank" : undefined}
                rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {resolveTranslation(item.label_translations, locale)}
              </a>
            ))}
          </nav>

          <LanguageSwitcher currentLocale={locale} />

          <a
            href="/contact"
            className="flex items-center gap-2 rounded-radius-md bg-primary px-5 py-2.5 text-sm font-bold text-text-inverse transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-hover active:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-background-deep"
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
