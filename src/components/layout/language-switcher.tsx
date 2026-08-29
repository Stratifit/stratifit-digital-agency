"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/actions/locale";
import { SUPPORTED_LOCALES } from "@/lib/i18n/resolve-translation";
import { cn } from "@/lib/cn";

const LOCALE_META: Record<string, { code: string; name: string }> = {
  en: { code: "EN", name: "English" },
  de: { code: "DE", name: "Deutsch" },
  fr: { code: "FR", name: "Français" },
  es: { code: "ES", name: "Español" },
};

/**
 * Inline SVG flags — emoji flags (🇺🇸 etc.) don't render on Windows and some
 * browsers (they fall back to "US" letters), so each locale gets a crisp
 * vector flag that looks identical on every platform and screen size.
 */
function FlagIcon({ locale, className }: { locale: string; className?: string }) {
  const cls = cn("shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]", className);
  switch (locale) {
    case "de":
      return (
        <svg viewBox="0 0 24 16" className={cls} aria-hidden="true">
          <rect width="24" height="16" fill="#FFCE00" />
          <rect width="24" height="5.4" fill="#000000" />
          <rect width="24" y="10.6" height="5.4" fill="#DD0000" />
        </svg>
      );
    case "fr":
      return (
        <svg viewBox="0 0 24 16" className={cls} aria-hidden="true">
          <rect width="8" height="16" fill="#0055A4" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#EF4135" />
        </svg>
      );
    case "es":
      return (
        <svg viewBox="0 0 24 16" className={cls} aria-hidden="true">
          <rect width="24" height="16" fill="#F1BF00" />
          <rect width="24" height="4" fill="#AA151B" />
          <rect width="24" y="12" height="4" fill="#AA151B" />
        </svg>
      );
    case "en":
    default:
      return (
        <svg viewBox="0 0 24 16" className={cls} aria-hidden="true">
          {Array.from({ length: 13 }).map((_, i) => (
            <rect
              key={i}
              width="24"
              height="16"
              y={i * (16 / 13)}
              fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"}
            />
          ))}
          <rect width="9.6" height="8.5" fill="#3C3B6E" />
        </svg>
      );
  }
}

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
          "flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-semibold text-text-primary transition-[background-color,border-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover hover:border-card-border-hover active:bg-card-active active:border-card-border-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2",
          open ? "border-card-border-active bg-card-active" : "border-card-border"
        )}
      >
        <FlagIcon locale={currentLocale} className="size-4" />
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
          "absolute right-0 top-full z-50 mt-2 w-40 origin-top-right rounded-input border border-card-border bg-card-dark p-1 shadow-md transition-[opacity,transform,visibility] duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
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
              "flex w-full items-center gap-2.5 rounded-xs border px-3 py-2 text-left text-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2",
              locale === currentLocale
                ? "border-card-border-active bg-card-active font-medium text-primary"
                : "border-transparent text-text-secondary hover:bg-primary/8 hover:text-primary"
            )}
          >
            <FlagIcon locale={locale} className="size-4" />
            <span className="font-semibold">{LOCALE_META[locale].code}</span>
            <span className="truncate text-text-muted">
              {LOCALE_META[locale].name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
