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

export interface ButtonClassesOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-primary text-text-inverse hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-hover active:translate-y-0 active:border-primary/60 active:bg-primary-active shadow-shadow-amber",
  secondary:
    "border border-card-border bg-card-dark text-text-primary hover:-translate-y-0.5 hover:border-primary/25 active:translate-y-0 active:border-primary/40 active:bg-card-active",
  tertiary:
    "border border-primary/25 bg-transparent text-primary hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/8 active:translate-y-0 active:border-primary/60 active:bg-primary/15",
  destructive:
    "bg-error text-white hover:bg-error-border active:bg-error-border",
};

const sizeClasses: Record<ButtonSize, string> = {
  small: "h-9 px-3.5 text-sm",
  medium: "h-11 px-[18px] text-sm",
  large: "h-[52px] px-6 text-base",
  hero: "h-[58px] px-8 text-base",
};

/**
 * Shared button styling for non-<button> elements (e.g. <Link>/<a>).
 * Use this instead of nesting a link inside <Button> (which is invalid HTML).
 */
export function buttonClasses({
  variant = "primary",
  size = "medium",
  className,
}: ButtonClassesOptions = {}): string {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-button font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

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
        className={buttonClasses({ variant, size, className })}
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

