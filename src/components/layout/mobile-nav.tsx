"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import type { PublicNavigationItem } from "@/features/navigation/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";

interface MobileNavProps {
  items: PublicNavigationItem[];
  locale: string;
  siteName: string;
}

export function MobileNav({ items, locale, siteName }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return null;
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

          <header className="flex min-h-20 shrink-0 items-center border-b border-border-subtle bg-black px-6 pr-20">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-radius-xs bg-primary text-sm font-extrabold text-text-inverse shadow-[0_6px_20px_rgba(245,158,11,0.25)]"
              >
                {siteName.slice(0, 1).toUpperCase()}
              </span>
              <span className="truncate text-lg font-bold uppercase tracking-[0.08em] text-text-primary">
                {siteName}
              </span>
            </div>

          </header>

          <nav className="flex-1 overflow-y-auto bg-black" aria-label="Mobile">
            <div className="flex flex-col">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.open_in_new_tab ? "_blank" : undefined}
                  rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className="group flex min-h-16 items-center justify-between border-b border-border-subtle px-6 py-4 text-lg font-semibold text-text-primary transition-[background-color,color,padding] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-card-dark hover:pl-7 hover:text-text-primary active:bg-surface-active focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                >
                  <span>{resolveTranslation(item.label_translations, locale)}</span>
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
                </a>
              ))}
            </div>
          </nav>
        </DrawerContent>
      </Drawer>
    </>
  );
}

