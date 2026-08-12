"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleSectionVisibility } from "@/features/section-settings/mutations";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";

const LOCALES = ["en", "de", "fr", "es"] as const;
const LOCALE_NAMES: Record<string, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
  es: "ES",
};

export interface SectionPreview {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
}

export interface SectionManagerRow {
  /** Key used for the visibility toggle (hero / section_settings key). */
  key: string;
  label: string;
  description: string;
  editHref: string | null;
  /** live = toggleable; auto = content-driven (shows when content exists). */
  status: "live" | "auto";
  isVisible: boolean;
  countLabel?: string;
  preview: Record<(typeof LOCALES)[number], SectionPreview>;
}

const EMPTY: SectionPreview = { eyebrow: "", title: "", highlight: "", description: "" };

function SectionCard({
  row,
  onToggle,
  busy,
}: {
  row: SectionManagerRow;
  onToggle: (visible: boolean) => void;
  busy: boolean;
}) {
  const [locale, setLocale] = React.useState<(typeof LOCALES)[number]>("en");
  const preview = row.preview[locale] ?? EMPTY;

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-card border bg-card-dark shadow-sm transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
        row.status === "live" && row.isVisible
          ? "border-card-border hover:border-primary/30 hover:shadow-md"
          : "border-border opacity-90"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate font-display text-sm font-bold text-text-primary">
            {row.label}
          </h2>
          <p className="truncate text-[11px] text-text-muted">{row.description}</p>
        </div>
        {row.status === "auto" ? (
          <Badge variant="information">Auto</Badge>
        ) : row.isVisible ? (
          <Badge variant="success">Live</Badge>
        ) : (
          <Badge variant="neutral">Paused</Badge>
        )}
      </div>

      {/* Language tabs */}
      <div className="flex gap-1 border-b border-border px-4 pt-3" role="tablist" aria-label="Preview language">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={locale === l}
            onClick={() => setLocale(l)}
            className={cn(
              "rounded-t-button px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              locale === l
                ? "bg-surface-soft text-primary"
                : "text-text-muted hover:bg-surface-soft/50 hover:text-text-secondary"
            )}
          >
            {LOCALE_NAMES[l]}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="flex-1 space-y-2 px-4 py-4">
        {preview.eyebrow ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {preview.eyebrow}
          </p>
        ) : null}
        <p className="font-display text-lg font-bold leading-tight text-text-primary">
          {preview.title || "—"}
          {preview.highlight ? (
            <span className="text-primary"> {preview.highlight}</span>
          ) : null}
        </p>
        {preview.description ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-text-secondary">
            {preview.description}
          </p>
        ) : null}
        {row.countLabel ? (
          <p className="pt-1 text-[11px] font-medium text-text-muted">
            {row.countLabel}
          </p>
        ) : null}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          {row.status === "auto" ? (
            <span
              aria-hidden="true"
              className="flex size-6 items-center justify-center text-text-muted"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
                <path d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-9.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Z" />
              </svg>
            </span>
          ) : (
            <Switch
              checked={row.isVisible}
              disabled={busy}
              onCheckedChange={(checked) => onToggle(checked)}
              aria-label={`${row.label} visibility`}
            />
          )}
          <span className="text-xs text-text-muted">
            {row.status === "auto"
              ? "Shown when content exists"
              : row.isVisible
                ? "Pause to hide"
                : "Resume to show"}
          </span>
        </div>
        {row.editHref ? (
          <Link
            href={row.editHref}
            className="inline-flex items-center gap-1 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Edit
            <ArrowIcon />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="text-xs"
      height="1em"
      width="1em"
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SectionsManager({ rows }: { rows: SectionManagerRow[] }) {
  const router = useRouter();
  const [pendingKey, setPendingKey] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle(row: SectionManagerRow, visible: boolean) {
    setError(null);
    setPendingKey(row.key);
    startTransition(async () => {
      const result = await toggleSectionVisibility(row.key, visible);
      if (!result.success) {
        setError(result.error);
      }
      setPendingKey(null);
      router.refresh();
    });
  }

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-4 rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => (
          <SectionCard
            key={row.key}
            row={row}
            busy={isPending && pendingKey === row.key}
            onToggle={(visible) => handleToggle(row, visible)}
          />
        ))}
      </div>
    </div>
  );
}
