"use client";

import { cn } from "@/lib/cn";

export interface FilterPillOption {
  slug: string;
  label: string;
}

/**
 * Horizontally scrollable filter pill row (e.g. All + categories) shared by
 * the acquisition, portfolio, work, and insights galleries. Renders nothing
 * when there is no real category to filter by (only the "all" option).
 */
export function FilterPills({
  pills,
  active,
  onSelect,
  className,
}: {
  pills: FilterPillOption[];
  active: string;
  onSelect: (slug: string) => void;
  /** Extra classes for the scroll container (spacing / margins). */
  className?: string;
}) {
  if (pills.length <= 1) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex touch-pan-x touch-pan-y gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {pills.map((pill) => (
        <button
          key={pill.slug}
          type="button"
          aria-pressed={active === pill.slug}
          onClick={() => onSelect(pill.slug)}
          className={cn(
            "shrink-0 rounded-[10px] px-5 py-2.5 text-sm font-bold transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
            active === pill.slug
              ? "bg-primary text-text-inverse shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              : "border border-white/10 bg-white/5 text-white hover:border-primary/30"
          )}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}
