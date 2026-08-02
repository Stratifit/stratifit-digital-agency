import * as React from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "standard" | "featured";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  disabled?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "standard", interactive = false, disabled = false, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        aria-disabled={disabled || undefined}
        className={cn(
          "rounded-[10px] border p-6 transition-[border-color,box-shadow,transform,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
          variant === "standard" &&
            "border-card-border bg-card-dark shadow-shadow-sm",
          variant === "featured" &&
            "border-primary/40 bg-surface-elevated p-8 shadow-shadow-amber",
          interactive &&
            !disabled &&
            "hover:-translate-y-0.5 hover:border-card-border-hover active:translate-y-0 active:bg-card-active active:border-card-border-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2",
          disabled && "cursor-not-allowed border-card-border-disabled bg-card-disabled opacity-60",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
