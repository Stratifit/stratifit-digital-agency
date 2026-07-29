// ============================================================================
// Stratifit — Admin UI: Button
// ============================================================================

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-gold text-surface-dark hover:bg-brand-gold-600 shadow-gold-glow",
  secondary:
    "bg-surface-darkHover text-neutral-200 border border-surface-darkBorder hover:bg-surface-darkCard hover:text-white",
  danger:
    "bg-red-900/30 text-red-400 border border-red-800/30 hover:bg-red-900/50",
  ghost:
    "text-neutral-400 hover:text-white hover:bg-surface-darkHover",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      loading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-body-sm transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
        {...props}
      >
        {loading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
