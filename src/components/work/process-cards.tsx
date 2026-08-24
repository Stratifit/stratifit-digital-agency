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
 * Matches the redesigned case-study layout: a tab row of step names with a
 * › separator and an underline on the active step, above a 2×2 grid of cards.
 * The last card is rendered as a solid amber highlight. Tabs are interactive:
 * clicking one highlights the matching card.
 */
export function ProcessCards({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = React.useState(0);
  const activeStep = Math.min(active, steps.length - 1);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Process steps"
        className="flex flex-wrap items-center gap-y-3"
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
              role="tab"
              aria-selected={index === activeStep}
              onClick={() => setActive(index)}
              className={cn(
                "relative pb-1.5 text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                index === activeStep
                  ? "text-primary"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {step.title}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 rounded-full transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
                  index === activeStep
                    ? "bg-primary opacity-100"
                    : "bg-primary/20 opacity-0"
                )}
              />
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {steps.map((step, index) => {
          const solid = index === steps.length - 1;
          const selected = index === activeStep;
          return (
            <article
              key={step.step_key}
              className={cn(
                "relative flex flex-col rounded-card-lg border p-6 transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)]",
                solid
                  ? "border-transparent bg-primary"
                  : "border-white/10 bg-card-dark",
                selected && !solid && "border-primary/50"
              )}
            >
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-full",
                  solid ? "bg-[#0A0A0A]" : "bg-primary/10"
                )}
              >
                <ProcessIcon
                  name={step.icon_name}
                  className={cn("size-5", solid ? "text-primary" : "text-primary")}
                />
              </div>
              <h3
                className={cn(
                  "mt-5 font-display text-lg font-bold",
                  solid ? "text-[#0A0A0A]" : "text-text-primary"
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed",
                  solid ? "text-[#0A0A0A]/70" : "text-text-muted"
                )}
              >
                {step.description}
              </p>
              <span
                className={cn(
                  "mt-6 font-display text-xs font-black",
                  solid ? "text-[#0A0A0A]/50" : "text-primary/50"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}
