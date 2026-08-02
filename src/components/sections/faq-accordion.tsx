"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = React.useState<string | null>(
    items.length > 0 ? items[0].id : null
  );

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "h-full rounded-radius-card-lg border transition-all duration-300 ease-[var(--ease-standard)]",
              open
                ? "border-primary/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                : "border-card-border hover:border-white/10"
            )}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => toggle(item.id)}
              className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span
                className={cn(
                  "font-display text-sm font-bold transition-colors duration-300 sm:text-base",
                  open
                    ? "text-primary"
                    : "text-text-primary group-hover:text-primary/80"
                )}
              >
                {item.question}
              </span>
              <span
                className={cn(
                  "shrink-0 transition-all duration-300",
                  open
                    ? "rotate-180 text-primary"
                    : "text-text-subtle group-hover:text-primary/70"
                )}
              >
                <ChevronIcon />
              </span>
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-standard)]",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-text-muted">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
