"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { LanguageSwitcher } from "./language-switcher";
import { ServiceIcon } from "@/components/ui/service-icon";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SocialIcons } from "@/components/ui/social-icons";
import type { PublicNavigationItem } from "@/features/navigation/queries";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";

interface MobileNavProps {
  items: PublicNavigationItem[];
  locale: string;
  siteName: string;
  socialLinks: Record<string, string> | null;
  services: PublicServiceDetail[];
  currentYear: number;
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-4 shrink-0 text-primary opacity-70 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5 group-hover:opacity-100"
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
  socialLinks,
  services,
  currentYear,
}: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const [activeService, setActiveService] = React.useState(0);
  const servicesScrollRef = React.useRef<HTMLDivElement>(null);
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return null;
  }

  function handleServicesScroll() {
    const el = servicesScrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = Array.from(
      el.querySelectorAll<HTMLElement>("[data-service-card]")
    );
    let best = 0;
    let bestDistance = Infinity;
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const mid = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(mid - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    setActiveService(best);
  }

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
          className="flex h-[100dvh] max-w-[430px] flex-col overflow-hidden border-l border-border-subtle bg-background p-0 shadow-lg sm:max-w-[430px]"
        >
          <DrawerTitle className="sr-only">Navigation menu</DrawerTitle>

          <header className="relative z-20 flex min-h-20 shrink-0 items-center justify-between border-b border-border-subtle bg-background px-6 pr-16">
            <div className="flex min-w-0 items-center">
              <div className="flex w-[160px] items-center">
                <BrandLogo alt={siteName} />
              </div>
            </div>

            <LanguageSwitcher currentLocale={locale} />
          </header>

          <div className="flex-1 overflow-y-auto bg-background">
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
                      className="border-b border-border-subtle bg-background px-4 py-4"
                    >
                      <div
                        ref={servicesScrollRef}
                        onScroll={handleServicesScroll}
                        className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      >
                        {services.map((service) => (
                          <a
                            key={service.slug}
                            data-service-card
                            href={service.cta_url ?? "/contact"}
                            onClick={() => setOpen(false)}
                            className="group flex flex-[0_0_70%] snap-start flex-col rounded-[10px] border border-border bg-surface p-3.5 transition-[border-color,background-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <div className="mb-2.5 flex items-center justify-between">
                              <div className="flex min-w-0 items-center gap-2.5">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-text-inverse">
                                  <ServiceIcon
                                    name={service.icon_name}
                                    className="!size-4 !text-text-inverse !drop-shadow-none"
                                  />
                                </span>
                                <span className="min-w-0 truncate text-[15px] font-semibold text-text-primary">
                                  {resolveTranslation(service.title_translations, locale)}
                                </span>
                              </div>
                              <ArrowIcon />
                            </div>
                            <p className="line-clamp-2 min-h-[31.2px] overflow-hidden text-xs leading-[1.3] text-text-muted">
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
                              className={`size-1.5 rounded-full transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] ${index === activeService ? "bg-primary" : "bg-text-subtle/50"}`}
                            />
                          ))}
                        </div>
                      ) : null}
                    </section>
                  ) : null}
                </React.Fragment>
              ))}
            </nav>
          </div>

          <footer className="shrink-0 border-t border-border-subtle bg-background-deep px-6 pb-6 pt-4">
            <div className="flex flex-col items-center gap-4">
              <p className="text-[0.7rem] font-medium tracking-wide text-white/70">
                <a
                  href="/privacy"
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Privacy Policy
                </a>
                <span className="mx-1">.</span>
                <a
                  href="/terms-conditions"
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Terms of Service
                </a>
                <span className="mx-1">.</span>
                <a
                  href="/cookie-policy"
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Cookie Policy
                </a>
              </p>

              <SocialIcons socialLinks={socialLinks} />

              <p className="text-[10px] font-medium text-text-subtle">
                © {currentYear} {siteName}. All rights reserved.
              </p>
            </div>
          </footer>
        </DrawerContent>
      </Drawer>
    </>
  );
}
