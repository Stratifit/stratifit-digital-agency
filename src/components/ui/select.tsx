import * as React from "react";
import { cn } from "@/lib/cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-radius-sm border border-border-default bg-surface px-3.5 pr-9 text-sm text-text-primary transition-[border-color,box-shadow,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-border-interactive focus-visible:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-error aria-[invalid=true]:bg-error-soft disabled:cursor-not-allowed disabled:opacity-50",
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
