"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/actions/locale";
import { SUPPORTED_LOCALES } from "@/lib/i18n/resolve-translation";
import { Button } from "@/components/ui/button";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
  es: "ES",
};

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

export function LanguageSwitcher({ currentLocale = "en" }: { currentLocale?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSelect(locale: string) {
    setOpen(false);
    if (locale === currentLocale) return;
    await setLocale(locale);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="secondary"
        size="small"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {LOCALE_LABELS[currentLocale] ?? currentLocale}
      </Button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-36 rounded-radius-md border border-border bg-surface-elevated p-1 shadow-shadow-md"
        >
          {SUPPORTED_LOCALES.map((locale) => (
            <button
              key={locale}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(locale)}
              className={`block w-full rounded-radius-xs px-3 py-2 text-left text-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                locale === currentLocale
                  ? "font-medium text-primary"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              {LOCALE_NAMES[locale]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
