"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Collapsible card used by admin editors to keep long forms short. The header
 * row toggles the body; an optional action (e.g. "+ Add metric") sits on the
 * right and expands the section when clicked so the result is visible.
 */
export function CollapsibleSection({
  title,
  description,
  defaultOpen = false,
  hasError = false,
  action,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  /** Shows an amber dot when the section contains validation errors. */
  hasError?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-card border border-card-border bg-card-dark shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xs text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-transform duration-300 ease-[var(--ease-standard)]",
              open ? "rotate-180" : ""
            )}
          >
            <ChevronDown className="size-3.5 text-primary" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
              {title}
              {hasError ? (
                <span
                  aria-label="Section has validation errors"
                  className="size-1.5 shrink-0 rounded-full bg-error"
                />
              ) : null}
            </span>
            {description ? (
              <span className="mt-0.5 block text-xs text-text-muted">
                {description}
              </span>
            ) : null}
          </span>
        </button>

        {action ? (
          <div
            className="shrink-0"
            onClick={() => setOpen(true)}
            role="presentation"
          >
            {action}
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-standard)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/5 p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
