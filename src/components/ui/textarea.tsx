import * as React from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full rounded-radius-sm border border-border-default bg-surface px-3.5 py-3 text-sm text-text-primary placeholder:text-text-muted transition-[border-color,box-shadow,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-border-interactive focus-visible:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-error aria-[invalid=true]:bg-error-soft disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
