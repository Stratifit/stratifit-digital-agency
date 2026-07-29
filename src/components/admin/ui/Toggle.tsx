// ============================================================================
// Stratifit — Admin UI: Toggle (boolean switch)
// ============================================================================

"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className="w-10 h-6 rounded-full bg-surface-darkBorder peer-checked:bg-brand-gold transition-colors duration-fast" />
          <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white peer-checked:translate-x-4 transition-transform duration-fast shadow-md" />
        </div>
        <span className="font-body text-body-sm text-neutral-300 group-hover:text-white transition-colors">
          {label}
        </span>
      </label>
    );
  }
);

Toggle.displayName = "Toggle";
