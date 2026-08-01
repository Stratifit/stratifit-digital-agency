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
  siteDescription: string | null;
  socialLinks: Record<string, string> | null;
  services: PublicServiceDetail[];
  footerGroups: PublicFooterGroup[];
  currentYear: number;
}

const SOCIAL_ICONS: { key: string; label: string; path: string }[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    path: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z",
  },
  {
    key: "twitter",
    label: "Twitter",
    path: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z",
  },
  {
    key: "instagram",
    label: "Instagram",
    path: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
  },
];

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
  siteDescription,
  socialLinks,
  services,
  footerGroups,
  currentYear,
}: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const [activeService, setActiveService] = React.useState(0);
  const servicesScrollRef = React.useRef<HTMLDivElement>(null);
  const navScrollRef = React.useRef<HTMLDivElement>(null);
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

  function scrollNavToTop() {
    navScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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
          className="flex h-[100dvh] max-w-[430px] flex-col overflow-hidden border-l border-border-subtle bg-background-deep p-0 shadow-lg sm:max-w-[430px]"
        >
          <DrawerTitle className="sr-only">Navigation menu</DrawerTitle>

          <header className="relative z-20 flex min-h-20 shrink-0 items-center justify-between border-b border-border-subtle bg-black px-6 pr-20">
            <div className="flex min-w-0 items-center">
              <div className="flex w-[160px] items-center">
                <BrandLogo alt={siteName} />
              </div>
            </div>

            <LanguageSwitcher currentLocale={locale} />
          </header>

          <div ref={navScrollRef} className="flex-1 overflow-y-auto bg-black">
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
                            className="group flex flex-[0_0_70%] snap-start flex-col rounded-[10px] border border-[#1f1f1f] bg-[#111] p-3.5 transition-[border-color,background-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-[#ffb300]/40 hover:bg-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <div className="mb-2.5 flex items-center justify-between">
                              <div className="flex min-w-0 items-center gap-2.5">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ffb300] text-black">
                                  <ServiceIcon
                                    name={service.icon_name}
                                    className="!size-4 !text-black !drop-shadow-none"
                                  />
                                </span>
                                <span className="min-w-0 truncate text-[15px] font-semibold text-white">
                                  {resolveTranslation(service.title_translations, locale)}
                                </span>
                              </div>
                              <ArrowIcon />
                            </div>
                            <p className="line-clamp-2 min-h-[31.2px] overflow-hidden text-xs leading-[1.3] text-[#888]">
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

          <footer className="shrink-0 border-t border-border-subtle bg-black px-6 pb-6 pt-5">
            <div className="space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded bg-primary">
                    <span className="text-[10px] font-extrabold text-black">
                      {siteName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-display text-base font-extrabold uppercase tracking-tight text-white">
                    {siteName}
                  </span>
                </div>
                {siteDescription ? (
                  <p className="max-w-[80%] text-sm font-medium leading-relaxed text-text-subtle">
                    {siteDescription}
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {footerGroups.map((group) => (
                  <div key={group.id} className="flex flex-col gap-2.5">
                    <h4 className="mb-0.5 text-xs font-bold uppercase tracking-wider text-white">
                      {resolveTranslation(group.title_translations, locale)}
                    </h4>
                    {group.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.href}
                        target={link.is_external ? "_blank" : undefined}
                        rel={link.is_external ? "noopener noreferrer" : undefined}
                        onClick={() => setOpen(false)}
                        className="text-xs text-text-subtle transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {resolveTranslation(link.label_translations, locale)}
                      </a>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                {SOCIAL_ICONS.map(({ key, label, path }) => {
                  const href = socialLinks?.[key] ?? "#";
                  return (
                    <a
                      key={key}
                      href={href}
                      target={href !== "#" ? "_blank" : undefined}
                      rel={href !== "#" ? "noopener noreferrer" : undefined}
                      aria-label={label}
                      className="group flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <svg
                        viewBox="0 0 448 512"
                        className="size-4 text-primary transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:scale-110"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d={path} />
                      </svg>
                    </a>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div className="h-px w-full bg-primary/30" />
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-medium text-text-subtle">
                    © {currentYear} {siteName}. All rights reserved.
                  </p>
                  <button
                    type="button"
                    onClick={scrollNavToTop}
                    className="text-[10px] font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Back to Top
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </DrawerContent>
      </Drawer>
    </>
  );
}
