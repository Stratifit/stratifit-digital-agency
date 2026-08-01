import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";
type ButtonSize = "small" | "medium" | "large" | "hero";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-text-inverse hover:bg-hover active:bg-primary-hover shadow-shadow-amber",
  secondary:
    "border border-border bg-surface text-text-primary hover:border-hover hover:text-hover active:border-primary active:text-primary",
  tertiary:
    "bg-transparent text-text-secondary underline-offset-4 hover:text-hover hover:underline active:text-primary",
  destructive:
    "bg-error text-white hover:bg-error-border active:bg-error-border",
};

const sizeClasses: Record<ButtonSize, string> = {
  small: "h-9 px-3.5 text-sm",
  medium: "h-11 px-[18px] text-sm",
  large: "h-[52px] px-6 text-base",
  hero: "h-[58px] px-8 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "medium",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,border-color,color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span
            className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

