import * as React from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full resize-y rounded-input border border-field-border bg-field-bg px-4 py-3 text-[15px] leading-[1.5] text-field-text placeholder:text-field-placeholder transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover active:border-field-border-hover focus-visible:border-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-2 aria-[invalid=true]:border-error/60 data-[state=success]:border-success-green-border disabled:cursor-not-allowed disabled:border-card-border-disabled disabled:bg-card-disabled disabled:opacity-60",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
