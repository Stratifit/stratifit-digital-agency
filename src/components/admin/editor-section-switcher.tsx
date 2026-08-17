"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface EditorSectionOption<T extends string = string> {
  key: T;
  label: string;
  description?: string;
  /** Shows an amber dot when the section contains validation errors. */
  hasError?: boolean;
  /** Right-side action in the card header, e.g. "+ Add metric". */
  action?: React.ReactNode;
}

/**
 * Editor shell that shows a single card section at a time, switched via a
 * dropdown in the header. The header also exposes a shared slot (e.g. the
 * language tabs) used by every section, so editors stay short and only one
 * card occupies the viewport.
 */
export function EditorSectionSwitcher<T extends string>({
  options,
  value,
  onChange,
  headerRight,
  children,
}: {
  options: EditorSectionOption<T>[];
  value: T;
  onChange: (key: T) => void;
  /** Right side of the header bar, e.g. the language tabs. */
  headerRight?: React.ReactNode;
  /** Content of the selected section card. */
  children: React.ReactNode;
}) {
  const current = options.find((o) => o.key === value) ?? options[0];

  return (
    <>
      {/* Header bar: section dropdown (left) + shared controls (right) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <label
            htmlFor="editor-section-select"
            className="text-sm font-medium text-text-secondary"
          >
            Section
          </label>
          <div className="relative">
            <select
              id="editor-section-select"
              value={current.key}
              onChange={(e) => onChange(e.target.value as T)}
              className="h-10 min-w-[190px] cursor-pointer appearance-none rounded-input border border-field-border bg-field-bg pl-3.5 pr-9 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none focus-visible:outline-offset-2 sm:min-w-[240px]"
            >
              {options.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
          </div>
        </div>
        {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
      </div>

      {/* Selected section card — only one visible at a time */}
      <div className="overflow-hidden rounded-card border border-card-border bg-card-dark shadow-sm">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
              {current.label}
              {current.hasError ? (
                <span
                  aria-label="Section has validation errors"
                  className="size-1.5 shrink-0 rounded-full bg-error"
                />
              ) : null}
            </p>
            {current.description ? (
              <p className="mt-0.5 text-xs text-text-muted">
                {current.description}
              </p>
            ) : null}
          </div>
          {current.action ? (
            <div className="shrink-0">{current.action}</div>
          ) : null}
        </div>
        <div className={cn("border-t border-white/5 p-5")}>{children}</div>
      </div>
    </>
  );
}
