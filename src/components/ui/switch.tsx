import * as React from "react";
import { cn } from "@/lib/cn";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  id,
  className,
  ...rest
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-[42px] shrink-0 cursor-pointer items-center rounded-full border border-card-border bg-card-dark transition-[background-color,border-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-card-border-hover active:border-card-border-active active:bg-card-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2",
        checked &&
          "border-primary bg-primary hover:border-primary-bright hover:bg-primary-bright",
        disabled &&
          "cursor-not-allowed border-card-border-disabled bg-card-disabled opacity-60 hover:border-card-border-disabled hover:bg-card-disabled",
        className
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[3px] top-[3px] size-[18px] rounded-full bg-white transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
          checked && "translate-x-[18px] bg-text-inverse"
        )}
      />
    </button>
  );
}
