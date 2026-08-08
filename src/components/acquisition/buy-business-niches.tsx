"use client";

import * as React from "react";
import Link from "next/link";
import { getNicheSummary } from "@/features/acquisition/niches";
import type { AcquisitionBusiness } from "@/features/acquisition/queries";
import { t, tWithNumber, tWithValue } from "@/lib/i18n/ui-strings";
import { FilterPills } from "@/components/ui/filter-pills";

/** Resolved niche card data (translations already resolved by the server). */
export interface NicheCardData {
  slug: string;
  label: string;
  emoji: string;
  accent: string;
  description: string;
}

function ArrowRightIcon() {
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

function NicheCard({
  niche,
  businesses,
  locale,
}: {
  niche: NicheCardData;
  businesses: AcquisitionBusiness[];
  locale: string;
}) {
  const summary = getNicheSummary(businesses, niche.slug);

  return (
    <Link
      href={`/buy-business/niches/${niche.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-white/5 bg-card-dark transition-all duration-300 hover:border-primary/20"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/5 bg-[#1a1a1a] px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-red-500/60" />
          <span className="size-2 rounded-full bg-yellow-500/60" />
          <span className="size-2 rounded-full bg-green-500/60" />
        </div>
        <div className="mx-2 flex min-w-0 flex-1 items-center gap-1 rounded border border-white/5 bg-[#0d0d0d] px-2 py-1">
          <GlobeIcon />
          <span className="truncate text-[8px] text-text-subtle">
            stratifit.com/buy/{niche.slug}
          </span>
        </div>
      </div>

      <div
        className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-10 text-center md:py-14"
        style={{
          background:
            "linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #0d0d0d 100%)",
        }}
      >
        <div
          className="mb-4 flex size-16 items-center justify-center rounded-card border bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-shadow duration-500 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]"
          style={{ borderColor: `${niche.accent}55` }}
        >
          <span className="text-3xl">{niche.emoji}</span>
        </div>
        <h3 className="mb-2 font-display text-2xl font-black tracking-tight text-text-primary md:text-3xl">
          {niche.label}
        </h3>
        <p className="mb-5 max-w-xs flex-1 text-sm leading-relaxed text-text-muted">
          {niche.description}
        </p>
        <div className="mb-5 flex items-center gap-4 text-xs font-medium text-text-subtle">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary/50" />
            {tWithNumber(locale, "businessesCount", summary.count)}
          </span>
          <span className="size-1 rounded-full bg-text-subtle/40" />
          {summary.avg ? (
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary/50" />
              {summary.avg} {t(locale, "avgShort")}
            </span>
          ) : null}
        </div>
        <span className="rounded-lg border border-primary/20 bg-primary/10 px-5 py-2 text-xs font-bold text-primary transition-colors group-hover:bg-primary/20">
          {t(locale, "viewListings")} →
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-2xl"
        />
      </div>

      <div className="border-t border-white/5 p-4">
        <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/10 py-3 text-xs font-bold text-primary transition-all group-hover:bg-primary/20">
          {tWithValue(locale, "viewNicheBusinesses", niche.label)}
          <ArrowRightIcon />
        </span>
      </div>
    </Link>
  );
}

export function BuyBusinessNiches({
  niches,
  businesses,
  locale,
}: {
  niches: NicheCardData[];
  businesses: AcquisitionBusiness[];
  locale: string;
}) {
  const [active, setActive] = React.useState<string>("all");

  const pills = [
    { slug: "all", label: t(locale, "filterAll") },
    ...niches.map((niche) => ({
      slug: niche.slug,
      label: niche.label,
    })),
  ];

  const visible =
    active === "all"
      ? niches
      : niches.filter((niche) => niche.slug === active);

  return (
    <div>
      <FilterPills
        className="-mx-6 mt-10 mb-10 px-6 pb-6 lg:-mx-8 lg:px-8"
        pills={pills}
        active={active}
        onSelect={setActive}
      />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((niche) => (
          <NicheCard
            key={niche.slug}
            niche={niche}
            businesses={businesses}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
