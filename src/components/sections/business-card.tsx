"use client";

import type { AcquisitionBusiness } from "@/features/acquisition/queries";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import { cn } from "@/lib/cn";
import { hexToRgba } from "@/lib/color";

export const CATEGORY_LABELS: Record<string, string> = {
  ecommerce: "Ecommerce",
  saas: "SaaS",
  agency: "Agency",
  "ai-tools": "AI Tools",
  "personal-brand": "Personal Brand",
  "local-business": "Local Business",
  "digital-products": "Digital Products",
};

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-3 shrink-0", className)}
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

export function BusinessCard({
  business,
  className,
}: {
  business: AcquisitionBusiness;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex w-full shrink-0 snap-center flex-col overflow-hidden rounded-card border border-card-border bg-card-dark transition-all duration-300 hover:border-primary/20",
        className
      )}
    >
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
          <ContactTrigger className="group/link flex items-center gap-1.5 text-[10px] font-bold text-text-muted transition-colors hover:text-primary sm:text-xs">
            View Full Detail
            <span className="transition-transform group-hover/link:translate-x-0.5">
              <ArrowIcon />
            </span>
          </ContactTrigger>
        </div>
        <div className="flex items-center gap-2 px-4 pb-3 sm:px-5">
          <a
            href={business.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-bold text-text-inverse shadow-[0_0_12px_rgba(245,158,11,0.12)] transition-all hover:bg-primary-hover active:bg-primary-active active:scale-95 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 sm:text-sm"
          >
            <GlobeIcon className="text-text-inverse" />
            Visit Site
          </a>
          <ContactTrigger className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/30 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary/10 active:scale-95 sm:text-sm">
            Buy Business
          </ContactTrigger>
        </div>
      </div>
    </article>
  );
}
