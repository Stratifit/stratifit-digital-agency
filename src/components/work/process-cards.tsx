"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { ProcessIcon } from "@/components/ui/process-icon";

export interface ProcessStep {
  step_key: string;
  icon_name: string | null;
  title: string;
  description: string;
}

/**
 * ProcessCards — the case-study "Our Process" section.
 *
 * Matches the Figma rollout-process design: a plain breadcrumb row of step
 * names separated by ›, above a 2×2 grid of dark cards. Each card carries a
 * circular amber icon chip in the top corner; the final card is the
 * "highlight" card — amber glow shadow, amber border and an inverted solid
 * amber chip. Clicking a breadcrumb step highlights the matching card.
 */
export function ProcessCards({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = React.useState(0);
  const activeStep = Math.min(active, steps.length - 1);

  return (
    <div>
      <nav
        aria-label="Process steps"
        className="flex flex-wrap items-center gap-y-2"
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.step_key}>
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="mx-2 text-sm text-text-subtle sm:mx-3"
              >
                ›
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-current={index === activeStep ? "step" : undefined}
              className={cn(
                "text-sm font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                index === activeStep
                  ? "text-primary"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {step.title}
            </button>
          </React.Fragment>
        ))}
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {steps.map((step, index) => {
          const highlight = index === steps.length - 1;
          const selected = index === activeStep;
          return (
            <article
              key={step.step_key}
              className={cn(
                "relative rounded-card-lg border p-6 transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)]",
                highlight
                  ? "border-primary/30 bg-card-dark shadow-[0_4px_10px_rgba(245,158,11,0.15)]"
                  : "border-white/10 bg-card-dark",
                selected && !highlight && "border-primary/50"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-8 items-center justify-center rounded-full",
                  highlight
                    ? "bg-primary text-text-inverse"
                    : "bg-primary/10 text-primary"
                )}
              >
                <ProcessIcon name={step.icon_name} className="size-4" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold leading-snug text-text-primary">
                {step.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
                {step.description}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
