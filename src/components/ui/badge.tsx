import * as React from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "information";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    "border-border bg-surface text-text-secondary",
  success:
    "border-success-border bg-success-soft text-success",
  warning:
    "border-warning-border bg-warning-soft text-warning",
  error:
    "border-error-border bg-error-soft text-error",
  information:
    "border-info-border bg-info-soft text-info",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
