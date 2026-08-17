"use client";

import { cn } from "@/lib/cn";

export const EDITOR_LOCALES = ["en", "de", "fr", "es"] as const;
export type EditorLocale = (typeof EDITOR_LOCALES)[number];

/** Language switcher shared by admin editors (en / de / fr / es). */
export function LocaleTabs({
  value,
  onChange,
}: {
  value: EditorLocale;
  onChange: (l: EditorLocale) => void;
}) {
  return (
    <div className="flex gap-1">
      {EDITOR_LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={cn(
            "rounded-button px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            value === l
              ? "bg-primary/15 text-primary"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
