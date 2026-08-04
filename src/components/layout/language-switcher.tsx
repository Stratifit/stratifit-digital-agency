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

export function LanguageSwitcher({
  currentLocale = "en",
  onLocaleSelect,
}: {
  currentLocale?: string;
  onLocaleSelect?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [activeLocale, setActiveLocale] = React.useState(currentLocale);
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

  React.useEffect(() => {
    document.documentElement.lang = activeLocale;
  }, [activeLocale]);

  async function handleSelect(locale: string) {
    setOpen(false);
    if (locale === currentLocale) return;
    await setLocale(locale);
    setActiveLocale(locale);
    onLocaleSelect?.();
    // Keep client-only surfaces (e.g. the chat widget) in sync with the
    // website locale chosen from the header/mobile navigation.
    window.dispatchEvent(
      new CustomEvent("stratifit:locale-change", { detail: { locale } })
    );
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 rounded-[10px] border px-3 py-1.5 text-[13px] font-semibold text-text-primary transition-[background-color,border-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover hover:border-card-border-hover active:bg-card-active active:border-card-border-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2",
          open ? "border-card-border-active bg-card-active" : "border-card-border"
        )}
      >
        <span>{meta.flag}</span>
        <span>{meta.code}</span>
        <svg
          className={cn(
            "size-3 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
            open && "rotate-180"
          )}
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

      <div
        role="menu"
        aria-hidden={!open}
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-36 origin-top-right rounded-input border border-card-border bg-card-dark p-1 shadow-shadow-md transition-[opacity,transform,visibility] duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
          open
            ? "visible pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "invisible pointer-events-none -translate-y-1 scale-95 opacity-0"
        )}
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            onClick={() => handleSelect(locale)}
            className={cn(
              "flex items-center gap-2 rounded-xs border px-3 py-2 text-left text-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2",
              locale === currentLocale
                ? "mx-1 w-auto rounded-[8px] border-card-border-active bg-card-active font-medium text-primary"
                : "w-full border-transparent text-text-secondary hover:bg-primary/8 hover:text-primary"
            )}
          >
            <span>{LOCALE_META[locale].flag}</span>
            {LOCALE_META[locale].name}
          </button>
        ))}
      </div>
    </div>
  );
}
