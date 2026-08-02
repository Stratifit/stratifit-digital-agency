import * as React from "react";
import { cn } from "@/lib/cn";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <span className={cn("inline-flex shrink-0", className)}>
        <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
        <span
          aria-hidden="true"
          className="flex size-5 items-center justify-center rounded-xs border border-card-border bg-card-dark transition-[background-color,border-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] peer-hover:border-card-border-hover peer-active:border-card-border-active peer-active:bg-card-active peer-checked:border-primary peer-checked:bg-primary peer-checked:hover:border-primary-bright peer-checked:hover:bg-primary-bright peer-disabled:cursor-not-allowed peer-disabled:border-card-border-disabled peer-disabled:bg-card-disabled peer-disabled:opacity-60"
        >
          <svg
            viewBox="0 0 16 16"
            className="size-3.5 text-text-inverse opacity-0 transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)] peer-checked:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 8.5 6.5 12 13 4.5" />
          </svg>
        </span>
      </span>
    );
  }
);

Checkbox.displayName = "Checkbox";
