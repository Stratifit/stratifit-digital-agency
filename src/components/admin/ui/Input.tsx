// ============================================================================
// Stratifit — Admin UI: Input
// ============================================================================

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block font-body text-body-sm text-neutral-300">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full bg-surface-dark border ${
            error ? "border-red-500/50" : "border-surface-darkBorder"
          } rounded-xl px-4 py-2.5 font-body text-body-md text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors ${className}`}
          {...props}
        />
        {error && (
          <p className="font-body text-caption text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
