"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function RadioGroup({
  value,
  onValueChange,
  disabled,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn("flex flex-col gap-2.5", className)} {...rest}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<RadioGroupItemProps>(child)) {
          return child;
        }
        const childValue = child.props.value;
        return React.cloneElement(child, {
          checked: childValue === value,
          disabled: disabled || child.props.disabled,
          onCheckedChange: (checked: boolean) => {
            if (checked && childValue !== undefined) {
              onValueChange(childValue);
            }
          },
        });
      })}
    </div>
  );
}

export interface RadioGroupItemProps {
  value: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export function RadioGroupItem({
  value,
  checked = false,
  onCheckedChange,
  disabled,
  id,
  className,
  children,
}: RadioGroupItemProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 text-sm text-text-primary",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-card-border bg-card-dark transition-[background-color,border-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] peer-hover:border-card-border-hover peer-active:border-card-border-active peer-active:bg-card-active peer-checked:border-primary peer-checked:hover:border-primary-bright peer-checked:active:border-primary/60 peer-focus-visible:outline-2 peer-focus-visible:outline-card-focus peer-focus-visible:outline-offset-2 peer-disabled:cursor-not-allowed peer-disabled:border-card-border-disabled peer-disabled:bg-card-disabled"
      >
        <span
          className={cn(
            "size-2.5 rounded-full bg-primary transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
            checked ? "opacity-100" : "opacity-0"
          )}
        />
      </span>
      {children}
    </label>
  );
}
