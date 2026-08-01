import * as React from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "standard" | "featured";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "standard", interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-radius-lg border p-6 transition-[border-color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
          variant === "standard" &&
            "border-border-subtle bg-surface shadow-shadow-sm",
          variant === "featured" &&
            "border-primary/40 bg-surface-elevated p-8 shadow-shadow-amber",
          interactive &&
            "hover:border-border-interactive hover:shadow-shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
