"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { LanguageSwitcher } from "./language-switcher";
import { ServiceIcon } from "@/components/ui/service-icon";
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
      className="size-4 shrink-0 text-[#ffb300] opacity-70 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5 group-hover:opacity-100"
    >
      <line x1="7" y1="17" x2="17" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="7 7 17 7 17 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#ffb300] text-sm font-extrabold text-black">
                  {siteName.charAt(0)}
                </div>
                <span className="truncate text-lg font-bold uppercase tracking-wide text-white">
                  {siteName}
                </span>
              </div>
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
                            className="group flex flex-[0_0_70%] snap-start flex-col rounded-[10px] border border-[#1f1f1f] bg-[#111] p-3.5 transition-[border-color,background-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-[#ffb300]/40 hover:bg-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <div className="mb-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ffb300] text-black">
                                  <ServiceIcon name={service.icon_name} className="!size-4" />
                                </span>
                                <span className="text-[15px] font-semibold text-white">
                                  {resolveTranslation(service.title_translations, locale)}
                                </span>
                              </div>
                              <ArrowIcon />
                            </div>
                            <p className="min-h-[31.2px] overflow-hidden text-xs leading-[1.3] text-[#888]">
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
