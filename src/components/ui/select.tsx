import * as React from "react";
import { cn } from "@/lib/cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full cursor-pointer appearance-none rounded-input border border-card-border bg-card-dark px-4 pr-9 text-sm text-text-primary transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-card-border-hover active:border-card-border-active active:bg-card-active focus-visible:border-card-border-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2 aria-[invalid=true]:border-error/60 data-[state=success]:border-success-green-border disabled:cursor-not-allowed disabled:border-card-border-disabled disabled:bg-card-disabled disabled:opacity-60",
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
