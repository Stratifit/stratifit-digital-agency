import * as React from "react";
import { cn } from "@/lib/cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full cursor-pointer appearance-none rounded-input border border-field-border bg-field-bg px-4 pr-9 text-sm text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover active:border-field-border-hover focus-visible:border-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-2 aria-[invalid=true]:border-error/60 data-[state=success]:border-success-green-border disabled:cursor-not-allowed disabled:border-card-border-disabled disabled:bg-card-disabled disabled:opacity-60",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
