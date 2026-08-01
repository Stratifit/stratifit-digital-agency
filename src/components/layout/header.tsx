import Link from "next/link";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicNavigation } from "@/features/navigation/queries";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";

export async function Header() {
  const locale = await getLocale();
  const [items, settings] = await Promise.all([
    getPublicNavigation("header"),
    getPublicSiteSettings(),
  ]);

  const siteName = settings?.site_name ?? "Stratifit";

  return (
    <header className="border-b border-border bg-background">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-text-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {siteName}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.open_in_new_tab ? "_blank" : undefined}
              rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
              className="rounded-radius-sm px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {resolveTranslation(item.label_translations, locale)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} />
          <div className="md:hidden">
            <MobileNav items={items} locale={locale} />
          </div>
        </div>
      </Container>
    </header>
  );
}


