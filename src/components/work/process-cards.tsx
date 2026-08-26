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
 * consistent circular amber icon chip inline with the step title. Clicking a
 * breadcrumb step updates the matching breadcrumb state without changing the
 * shared card treatment.
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
              className="text-sm font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-text-muted hover:text-text-primary"
            >
              {step.title}
            </button>
          </React.Fragment>
        ))}
      </nav>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
        {steps.map((step) => (
          <article
            key={step.step_key}
            className="relative rounded-card border border-white/10 bg-card-dark p-4 transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <ProcessIcon name={step.icon_name} className="size-5" />
              </span>
              <h3 className="font-display text-base font-bold leading-snug text-text-primary">
                {step.title}
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-text-muted">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
