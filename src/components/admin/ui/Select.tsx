// ============================================================================
// Stratifit — Admin UI: Select
// ============================================================================

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block font-body text-body-sm text-neutral-300">
          {label}
        </label>
        <select
          ref={ref}
          className={`w-full bg-surface-dark border ${
            error ? "border-red-500/50" : "border-surface-darkBorder"
          } rounded-xl px-4 py-2.5 font-body text-body-md text-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="font-body text-caption text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
