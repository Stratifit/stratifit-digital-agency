"use client";

import * as React from "react";
import type { PublicProcessStep } from "@/features/process/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { ProcessIcon } from "@/components/ui/process-icon";

function StepCard({
  step,
  locale,
}: {
  step: PublicProcessStep;
  locale: string;
}) {
  return (
    <div className="relative flex w-[80vw] min-w-[280px] max-w-[320px] shrink-0 snap-center flex-col overflow-hidden rounded-radius-card-lg border border-card-border bg-card-dark p-6">
      <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3 py-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-inverse">
          STEP {step.number.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
        <ProcessIcon name={step.icon_name} className="size-6 text-primary" />
      </div>
      <h3 className="font-display text-lg font-bold text-text-primary">
        {resolveTranslation(step.title_translations, locale)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        {resolveTranslation(step.description_translations, locale)}
      </p>
    </div>
  );
}

export function ProcessCarousel({
  steps,
  locale,
}: {
  steps: PublicProcessStep[];
  locale: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-step-card]"));
    let best = 0;
    let bestDistance = Infinity;
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const mid = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(mid - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    setActive(best);
  }

  return (
    <div className="mt-12 md:hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-8 lg:px-8"
      >
        {steps.map((step) => (
          <div key={step.step_key} data-step-card>
            <StepCard step={step} locale={locale} />
          </div>
        ))}
      </div>
      {steps.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {steps.map((step, index) => (
            <span
              key={step.step_key}
              className={`size-1.5 rounded-full transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] ${
                index === active ? "bg-primary" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
