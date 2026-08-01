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
          "h-11 w-full rounded-radius-sm border border-border-default bg-surface px-3.5 text-sm text-text-primary placeholder:text-text-muted transition-[border-color,box-shadow,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-border-interactive focus-visible:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-error aria-[invalid=true]:bg-error-soft disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
