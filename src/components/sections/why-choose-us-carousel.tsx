"use client";

import * as React from "react";
import type { WhyChooseUsItem } from "@/features/why-choose-us/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { WhyChooseUsIcon } from "@/components/ui/why-choose-us-icon";

function WhyCard({
  item,
  locale,
  compact,
}: {
  item: WhyChooseUsItem;
  locale: string;
  compact?: boolean;
}) {
  return (
    <div className="relative flex w-[300px] shrink-0 snap-center flex-col overflow-hidden rounded-radius-card border border-white/5 bg-card-dark p-6 shadow-xl shadow-black/50">
      <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative z-10 flex flex-1 flex-col gap-4">
        <div
          className={`flex items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_15px_rgba(245,158,11,0.1)] ${
            compact ? "size-12" : "size-14"
          }`}
        >
          <WhyChooseUsIcon
            name={item.icon}
            className={compact ? "size-6 text-primary" : "size-7 text-primary"}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold tracking-tight text-text-primary">
            {resolveTranslation(item.title, locale)}
          </h3>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-text-muted">
            {resolveTranslation(item.description, locale)}
          </p>
        </div>
        <div className="border-t border-white/5 pt-3">
          <div className="font-display text-xl font-black text-primary">
            {item.stat_value}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">
            {resolveTranslation(item.stat_label, locale)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WhyChooseUsCarousel({
  items,
  locale,
}: {
  items: WhyChooseUsItem[];
  locale: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-why-card]"));
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
    <div className="lg:hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-8 lg:px-8"
      >
        {items.map((item, index) => (
          <div key={index} data-why-card>
            <WhyCard item={item} locale={locale} compact />
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {items.map((item, index) => (
            <span
              key={index}
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
