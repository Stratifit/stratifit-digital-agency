import * as React from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full resize-y rounded-input border border-card-border bg-card-dark px-4 py-3 text-[15px] leading-[1.5] text-text-primary placeholder:text-white/35 transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-card-border-hover active:border-card-border-active active:bg-card-active focus-visible:border-card-border-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2 aria-[invalid=true]:border-error/60 data-[state=success]:border-success-green-border disabled:cursor-not-allowed disabled:border-card-border-disabled disabled:bg-card-disabled disabled:opacity-60",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
