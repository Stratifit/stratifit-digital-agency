import * as React from "react";
import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-input border border-field-border bg-field-bg px-4 text-sm text-field-text placeholder:text-field-placeholder transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover active:border-field-border-hover focus-visible:border-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-2 aria-[invalid=true]:border-error/60 data-[state=success]:border-success-green-border disabled:cursor-not-allowed disabled:border-card-border-disabled disabled:bg-card-disabled disabled:opacity-60",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
