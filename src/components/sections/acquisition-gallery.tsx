"use client";

import * as React from "react";
import Link from "next/link";
import type { AcquisitionBusiness } from "@/features/acquisition/queries";
import { cn } from "@/lib/cn";

const CATEGORY_LABELS: Record<string, string> = {
  ecommerce: "Ecommerce",
  saas: "SaaS",
  agency: "Agency",
  "ai-tools": "AI Tools",
  "personal-brand": "Personal Brand",
  "local-business": "Local Business",
  "digital-products": "Digital Products",
};

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-3 shrink-0 text-text-subtle"
    >
      <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
    </svg>
  );
}

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

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-3 text-primary/30"
    >
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BusinessCard({ business }: { business: AcquisitionBusiness }) {
  return (
    <article className="group flex w-[300px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-card-border bg-card-dark transition-all duration-300 hover:border-primary/20 sm:w-[340px] md:w-[380px]">
      <div className="flex items-center gap-1.5 border-b border-white/5 bg-[#1a1a1a] px-3 py-2">
        <div className="flex shrink-0 items-center gap-1">
          <span className="size-2 rounded-full bg-red-500/60" />
          <span className="size-2 rounded-full bg-yellow-500/60" />
          <span className="size-2 rounded-full bg-green-500/60" />
        </div>
        <div className="mx-2 flex min-w-0 flex-1 items-center gap-1 rounded border border-white/5 bg-[#0d0d0d] px-2 py-1">
          <GlobeIcon />
          <span className="truncate text-[8px] text-text-subtle">
            {business.domain}
          </span>
        </div>
        <span
          className="shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white"
          style={{
            background: hexToRgba(business.accent, 0.19),
            borderColor: business.accent,
          }}
        >
          {CATEGORY_LABELS[business.category] ?? business.category}
        </span>
      </div>

      <div className="flex items-center justify-between border-b border-white/5 bg-[#141414] px-4 py-1.5">
        <div className="flex items-center gap-1">
          <span className="text-base">{business.emoji}</span>
          <span className="ml-0.5 text-[9px] font-bold text-text-tertiary">
            {business.name}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {["Home", "About", "Products", "Contact"].map((label, index) => (
            <span
              key={label}
              className={cn(
                "text-[7px] font-medium uppercase tracking-wider sm:text-[8px]",
                index === 3 ? "text-primary/60" : "text-text-subtle"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative h-28 overflow-hidden sm:h-32">
        <div
          className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-40"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(business.accent, 0.5)}, ${hexToRgba(business.accent, 0.05)})`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${hexToRgba(business.accent, 0.25)}, transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex size-12 items-center justify-center rounded-full border bg-black/60 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 sm:size-14"
            style={{
              borderColor: hexToRgba(business.accent, 0.314),
              boxShadow: `0 0 25px ${hexToRgba(business.accent, 0.082)}`,
            }}
          >
            <span className="text-2xl sm:text-3xl">{business.emoji}</span>
          </div>
        </div>
      </div>

      <div
        className="relative flex flex-1 flex-col items-center px-4 pb-4 pt-5 text-center sm:px-5"
        style={{
          background:
            "linear-gradient(#0d0d0d 0%, #111111 40%, #0d0d0d 100%)",
        }}
      >
        <h3 className="relative z-10 font-display text-lg font-black tracking-tight text-text-primary sm:text-xl">
          {business.name}
        </h3>
        <p className="relative z-10 mt-1 line-clamp-2 max-w-[260px] text-[10px] leading-relaxed text-text-muted opacity-70 sm:text-[11px]">
          {business.tagline}
        </p>

        <div className="relative z-10 mt-3 mb-4 flex flex-wrap justify-center gap-1">
          {business.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[7px] font-medium text-text-subtle sm:text-[8px]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="relative z-10 mb-4 w-full max-w-[250px]">
          <div className="grid grid-cols-3 gap-1.5">
            {business.tiles.map((tile, index) => (
              <div
                key={index}
                className="flex aspect-square items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.03] transition-colors duration-300 group-hover:border-primary/10"
              >
                <span className="text-sm opacity-40 transition-opacity group-hover:opacity-60 sm:text-base">
                  {tile}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mb-3 w-full max-w-[220px]">
          <span className="block w-full rounded-lg border border-primary/20 bg-primary/10 py-1.5 text-center text-[8px] font-bold text-primary transition-colors group-hover:bg-primary/15 sm:text-[9px]">
            {business.action_label} →
          </span>
        </div>

        <div className="relative z-10 flex w-full max-w-[250px] flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {business.trust.map((item) => (
            <span
              key={item}
              className="flex items-center gap-0.5 text-[7px] font-medium text-text-subtle sm:text-[8px]"
            >
              <ShieldIcon />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="flex items-center justify-between px-4 pb-2 pt-3 sm:px-5">
          <span className="font-display text-sm font-black tracking-tight text-primary sm:text-base">
            {business.price}
          </span>
          <Link
            href="/contact"
            className="group/link flex items-center gap-1.5 text-[10px] font-bold text-text-muted transition-colors hover:text-primary sm:text-xs"
          >
            View Full Detail
            <span className="transition-transform group-hover/link:translate-x-0.5">
              <ArrowIcon />
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2 px-4 pb-3 sm:px-5">
          <a
            href={business.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-bold text-black shadow-[0_0_12px_rgba(245,158,11,0.12)] transition-all hover:bg-primary-bright active:scale-95 sm:text-sm"
          >
            <GlobeIcon />
            Visit Site
          </a>
          <Link
            href="/contact"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/30 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary/10 active:scale-95 sm:text-sm"
          >
            Buy Business
          </Link>
        </div>
      </div>
    </article>
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
            "shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
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
              "shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
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
              <BusinessCard business={business} />
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
          href="/contact"
          className="absolute right-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:brightness-110"
        >
          View All
          <ArrowIcon />
        </Link>
      </div>

      <div className="mt-8 hidden justify-end md:flex">
        <Link
          href="/contact"
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
