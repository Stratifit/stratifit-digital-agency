"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import type { PublicNavigationItem } from "@/features/navigation/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";

interface MobileNavProps {
  items: PublicNavigationItem[];
  locale: string;
}

export function MobileNav({ items, locale }: MobileNavProps) {
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
        className="inline-flex size-10 items-center justify-center rounded-radius-sm text-text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
      >
        <svg
          className="size-6"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent direction="right">
          <DrawerTitle className="sr-only">Navigation menu</DrawerTitle>
          <nav className="flex flex-col gap-1 px-6 pt-14" aria-label="Mobile">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.open_in_new_tab ? "_blank" : undefined}
                rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="rounded-radius-sm px-3 py-3 text-base font-medium text-text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover hover:text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {resolveTranslation(item.label_translations, locale)}
              </a>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
    </>
  );
}

