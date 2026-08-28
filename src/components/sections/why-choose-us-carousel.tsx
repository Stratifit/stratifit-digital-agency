"use client";

import * as React from "react";
import type { WhyChooseUsItem } from "@/features/why-choose-us/queries";
import { resolvePublicTranslation as resolveTranslation } from "@/lib/i18n/public-translation";
import { WhyChooseUsIcon } from "@/components/ui/why-choose-us-icon";

function FeatureCard({
  item,
  locale,
}: {
  item: WhyChooseUsItem;
  locale: string;
}) {
  return (
    <div className="relative flex h-full w-[80vw] min-w-[280px] max-w-[320px] shrink-0 snap-center flex-col overflow-hidden rounded-card border border-card-border bg-card-dark p-6">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
        <WhyChooseUsIcon name={item.icon} className="size-6 text-primary" />
      </div>
      <h3 className="font-display text-lg font-bold text-text-primary">
        {resolveTranslation(item.title, locale)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        {resolveTranslation(item.description, locale)}
      </p>
      <div className="mt-auto border-t border-white/5 pt-3">
        <div className="font-display text-xl font-black text-primary">
          {item.stat_value}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">
          {resolveTranslation(item.stat_label, locale)}
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
    const cards = Array.from(
      el.querySelectorAll<HTMLElement>("[data-why-card]")
    );
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
        className="-mx-6 flex touch-pan-x touch-pan-y overscroll-x-contain snap-x snap-proximity gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-8 lg:px-8"
      >
        {items.map((item, index) => (
          <div key={index} data-why-card className="flex">
            <FeatureCard item={item} locale={locale} />
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-1.5">
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
