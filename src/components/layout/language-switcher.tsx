"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/actions/locale";
import { SUPPORTED_LOCALES } from "@/lib/i18n/resolve-translation";
import { cn } from "@/lib/cn";

const LOCALE_META: Record<string, { flag: string; code: string; name: string }> = {
  en: { flag: "🇺🇸", code: "EN", name: "English" },
  de: { flag: "🇩🇪", code: "DE", name: "Deutsch" },
  fr: { flag: "🇫🇷", code: "FR", name: "Français" },
  es: { flag: "🇪🇸", code: "ES", name: "Español" },
};

export function LanguageSwitcher({ currentLocale = "en" }: { currentLocale?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const meta = LOCALE_META[currentLocale] ?? LOCALE_META.en;

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
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-1.5 rounded-2xl border border-border-default px-3 py-1.5 text-[13px] font-semibold text-text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover hover:border-border-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span>{meta.flag}</span>
        <span>{meta.code}</span>
        <svg
          className="size-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

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
              className={cn(
                "flex w-full items-center gap-2 rounded-radius-xs px-3 py-2 text-left text-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                locale === currentLocale
                  ? "font-medium text-primary"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <span>{LOCALE_META[locale].flag}</span>
              {LOCALE_META[locale].name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
