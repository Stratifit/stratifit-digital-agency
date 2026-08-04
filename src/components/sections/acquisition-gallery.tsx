"use client";

import * as React from "react";
import Link from "next/link";
import type { AcquisitionBusiness } from "@/features/acquisition/queries";
import { BusinessCard, CATEGORY_LABELS } from "./business-card";
import { cn } from "@/lib/cn";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function AcquisitionGallery({
  businesses,
}: {
  businesses: AcquisitionBusiness[];
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = React.useState("all");
  const [active, setActive] = React.useState(0);

  const categories = [
    ...new Set(businesses.map((b) => b.category)),
  ];

  const filtered =
    activeFilter === "all"
      ? businesses
      : businesses.filter((b) => b.category === activeFilter);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = Array.from(
      el.querySelectorAll<HTMLElement>("[data-business-card]")
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

  function scrollByCard(direction: number) {
    scrollRef.current?.scrollBy({
      left: direction * 360,
      behavior: "smooth",
    });
  }

  function selectFilter(slug: string) {
    setActiveFilter(slug);
    setActive(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }

  return (
    <div>
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => selectFilter("all")}
          className={cn(
            "shrink-0 rounded-[10px] px-5 py-2.5 text-sm font-bold transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
            activeFilter === "all"
              ? "bg-primary text-text-inverse shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              : "border border-white/10 bg-white/5 text-white hover:border-primary/30"
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => selectFilter(category)}
            className={cn(
              "shrink-0 rounded-[10px] px-5 py-2.5 text-sm font-bold transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
              activeFilter === category
                ? "bg-primary text-text-inverse shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : "border border-white/10 bg-white/5 text-white hover:border-primary/30"
            )}
          >
            {CATEGORY_LABELS[category] ?? category}
          </button>
        ))}
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6 lg:-mx-8 lg:px-8"
        >
          {filtered.map((business) => (
            <div key={business.slug} data-business-card>
              <BusinessCard
                business={business}
                className="w-[300px] sm:w-[340px] md:w-[380px]"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Scroll businesses left"
          onClick={() => scrollByCard(-1)}
          className="absolute -left-20 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary hover:text-black md:flex"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          aria-label="Scroll businesses right"
          onClick={() => scrollByCard(1)}
          className="absolute -right-20 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary hover:text-black md:flex"
        >
          <ArrowIcon />
        </button>
      </div>

      <div className="relative mt-3 flex items-center justify-center gap-1.5 md:hidden">
        {filtered.map((business, index) => (
          <span
            key={business.slug}
            className={cn(
              "size-1.5 rounded-full transition-colors duration-200 ease-out",
              index === active ? "bg-primary" : "bg-white/20"
            )}
          />
        ))}
        <Link
          href="/buy-business"
          className="absolute right-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:brightness-110"
        >
          View All
          <ArrowIcon />
        </Link>
      </div>

      <div className="mt-8 hidden justify-end md:flex">
        <Link
          href="/buy-business"
          className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary transition-colors hover:brightness-110"
        >
          View All Businesses
          <span className="transition-transform group-hover:translate-x-1">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </div>
  );
}
