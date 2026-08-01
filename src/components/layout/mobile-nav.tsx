"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { LanguageSwitcher } from "./language-switcher";
import { ServiceIcon } from "@/components/ui/service-icon";
import { BrandLogo } from "@/components/ui/brand-logo";
import type { PublicFooterGroup } from "@/features/footer/queries";
import type { PublicNavigationItem } from "@/features/navigation/queries";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";

interface MobileNavProps {
  items: PublicNavigationItem[];
  locale: string;
  siteName: string;
  services: PublicServiceDetail[];
  footerGroups: PublicFooterGroup[];
  currentYear: number;
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-4 text-primary transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="size-5 text-text-subtle transition-[color,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5 group-hover:text-primary"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MobileNav({
  items,
  locale,
  siteName,
  services,
  footerGroups,
  currentYear,
}: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return null;
  }

  const footerLinks = footerGroups.flatMap((group) => group.links);

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex size-11 items-center justify-center rounded-radius-md text-text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface active:bg-background-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:size-12"
      >
        <svg
          className="size-7 sm:size-8"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          direction="right"
          className="flex h-[100dvh] max-w-[430px] flex-col overflow-hidden border-l border-border-subtle bg-background-deep p-0 shadow-lg sm:max-w-[430px]"
        >
          <DrawerTitle className="sr-only">Navigation menu</DrawerTitle>

          <header className="relative z-20 flex min-h-20 shrink-0 items-center justify-between border-b border-border-subtle bg-black px-6 pr-20">
            <div className="flex min-w-0 items-center">
              <BrandLogo alt={siteName} className="w-[175px]" />
            </div>

            <LanguageSwitcher currentLocale={locale} />
          </header>

          <div className="flex-1 overflow-y-auto bg-black">
            <nav className="flex flex-col" aria-label="Mobile">
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <a
                    href={item.href}
                    target={item.open_in_new_tab || item.is_external ? "_blank" : undefined}
                    rel={item.open_in_new_tab || item.is_external ? "noopener noreferrer" : undefined}
                    onClick={() => setOpen(false)}
                    className="group flex min-h-16 items-center justify-between border-b border-border-subtle px-6 py-4 text-lg font-semibold text-text-primary transition-[background-color,color,padding] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-card-dark hover:pl-7 hover:text-text-primary active:bg-surface-active focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  >
                    <span>{resolveTranslation(item.label_translations, locale)}</span>
                    <ChevronIcon />
                  </a>

                  {item.href === "/services" && services.length > 0 ? (
                    <section
                      aria-label="Services"
                      className="border-b border-border-subtle bg-black px-4 py-4"
                    >
                      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {services.map((service) => (
                          <a
                            key={service.slug}
                            href={service.cta_url ?? "/contact"}
                            onClick={() => setOpen(false)}
                            className="group flex w-[78%] min-w-[220px] shrink-0 snap-start flex-col rounded-radius-md border border-white/10 bg-card-dark p-4 shadow-shadow-sm transition-[border-color,background-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                <ServiceIcon name={service.icon_name} className="!size-4" />
                              </span>
                              <span className="min-w-0 flex-1 truncate text-sm font-bold text-text-primary">
                                {resolveTranslation(service.title_translations, locale)}
                              </span>
                              <ArrowIcon />
                            </div>
                            <p className="mt-3 line-clamp-2 text-xs leading-5 text-text-muted">
                              {resolveTranslation(
                                service.short_description_translations,
                                locale
                              )}
                            </p>
                          </a>
                        ))}
                      </div>
                      {services.length > 1 ? (
                        <div className="mt-1 flex justify-center gap-1.5" aria-hidden="true">
                          {services.map((service, index) => (
                            <span
                              key={service.slug}
                              className={`size-1.5 rounded-full ${index === 0 ? "bg-primary" : "bg-text-subtle/50"}`}
                            />
                          ))}
                        </div>
                      ) : null}
                    </section>
                  ) : null}
                </React.Fragment>
              ))}
            </nav>

            <footer className="border-t border-border-subtle bg-black px-6 py-7 text-center">
              {footerLinks.length > 0 ? (
                <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                  {footerLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.href}
                      target={link.is_external ? "_blank" : undefined}
                      rel={link.is_external ? "noopener noreferrer" : undefined}
                      onClick={() => setOpen(false)}
                      className="text-xs text-text-subtle transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {resolveTranslation(link.label_translations, locale)}
                    </a>
                  ))}
                </nav>
              ) : null}
              <p className="mt-4 text-[11px] text-text-subtle">
                © {currentYear} {siteName}
              </p>
            </footer>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
