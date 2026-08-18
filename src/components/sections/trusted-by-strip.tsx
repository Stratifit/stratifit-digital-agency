"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

interface TrustedByItem {
  name: string;
  icon: string;
  /** Public URL of an uploaded logo image (overrides the icon). */
  image_url?: string | null;
}

/**
 * Trusted-by icon paths keyed by the icon identifier stored in
 * `hero.trusted_by` ({name, icon}). Icons are code-side (the CMS stores only
 * the identifier, never raw SVG).
 */
const TRUSTED_BY_ICON_PATHS: Record<string, React.ReactNode> = {
  lumen: (
    <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
  ),
  novus: (
    <path
      fillRule="evenodd"
      d="M11.622 1.602a.75.75 0 0 1 .756 0l2.25 1.313a.75.75 0 0 1-.756 1.295L12 3.118 10.128 4.21a.75.75 0 1 1-.756-1.295l2.25-1.313ZM5.898 5.81a.75.75 0 0 1-.27 1.025l-1.14.665 1.14.665a.75.75 0 1 1-.756 1.295L3.75 8.806v.944a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .372-.648l2.25-1.312a.75.75 0 0 1 1.026.27Zm12.204 0a.75.75 0 0 1 1.026-.27l2.25 1.312a.75.75 0 0 1 .372.648v2.25a.75.75 0 0 1-1.5 0v-.944l-1.122.654a.75.75 0 1 1-.756-1.295l1.14-.665-1.14-.665a.75.75 0 0 1-.27-1.025Zm-9 5.25a.75.75 0 0 1 1.026-.27L12 11.882l1.872-1.092a.75.75 0 1 1 .756 1.295l-1.878 1.096V15a.75.75 0 0 1-1.5 0v-1.82l-1.878-1.095a.75.75 0 0 1-.27-1.025ZM3 13.5a.75.75 0 0 1 .75.75v1.82l1.878 1.095a.75.75 0 1 1-.756 1.295l-2.25-1.312a.75.75 0 0 1-.372-.648v-2.25A.75.75 0 0 1 3 13.5Zm18 0a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.372.648l-2.25 1.312a.75.75 0 1 1-.756-1.295l1.878-1.096V14.25a.75.75 0 0 1 .75-.75Zm-9 5.25a.75.75 0 0 1 .75.75v.944l1.122-.654a.75.75 0 1 1 .756 1.295l-2.25 1.313a.75.75 0 0 1-.756 0l-2.25-1.313a.75.75 0 1 1 .756-1.295l1.122.654V19.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  ),
  pulse: (
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
  ),
  vertex: (
    <path
      fillRule="evenodd"
      d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
      clipRule="evenodd"
    />
  ),
  orbit: (
    <path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  ),
  nexus: (
    <path
      fillRule="evenodd"
      d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 0 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
      clipRule="evenodd"
    />
  ),
};

/** Uploaded logo image rendered from the media library. */
function TrustedLogoImage({
  item,
  className,
}: {
  item: TrustedByItem;
  className?: string;
}) {
  if (!item.image_url) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- user-uploaded logos (incl. SVG) render as plain images
    <img
      src={item.image_url}
      alt={item.name}
      loading="lazy"
      className={cn(
        "h-8 w-auto max-w-[140px] object-contain",
        className
      )}
    />
  );
}

/** Icon + label pair styled like the Tech Stack marquee items. */
function TrustedByLogo({ item }: { item: TrustedByItem }) {
  if (item.image_url) {
    return <TrustedLogoImage item={item} />;
  }
  return (
    <span className="flex items-center gap-2 whitespace-nowrap text-lg font-medium text-text-secondary sm:text-xl">
      <span className="shrink-0 text-text-subtle">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="size-6 shrink-0"
        >
          {TRUSTED_BY_ICON_PATHS[item.icon] ?? TRUSTED_BY_ICON_PATHS.pulse}
        </svg>
      </span>
      {item.name}
    </span>
  );
}

/**
 * Trusted-by logo strip shown at the bottom of the hero.
 *
 * Mobile: a single scrollable line with dot indicators (dots only appear when
 * there are more than 3 logos). Desktop/tablet: the label plus all logos on
 * one row, unchanged.
 */
export function TrustedByStrip({ items }: { items: TrustedByItem[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const showDots = items.length > 3;

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    let best = 0;
    let bestDistance = Infinity;
    el.querySelectorAll<HTMLElement>("[data-trusted-logo]").forEach(
      (logo, index) => {
        const logoRect = logo.getBoundingClientRect();
        const mid = logoRect.left + logoRect.width / 2;
        const distance = Math.abs(mid - center);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      }
    );
    setActive(best);
  }

  return (
    <div className="w-full pb-6 lg:mx-auto lg:max-w-3xl">
      {/* Mobile: single scrollable line + dots */}
      <div className="sm:hidden">
        <div className="flex items-center gap-3 pb-4 opacity-90">
          <span className="h-px flex-1 bg-white/10" />
          <span className="shrink-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-white">
            Trusted by <span className="text-primary">Growing</span> Companies
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex touch-pan-x overscroll-x-contain snap-x snap-mandatory items-center gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <span key={item.name} data-trusted-logo className="shrink-0 snap-center">
              <TrustedByLogo item={item} />
            </span>
          ))}
        </div>

        {showDots ? (
          <div
            className="mt-3 flex items-center justify-center gap-1.5"
            aria-label="Scroll position"
          >
            {items.map((item, index) => (
              <span
                key={item.name}
                className={cn(
                  "size-2 rounded-full transition-colors duration-200 ease-out",
                  index === active
                    ? "bg-primary"
                    : "border border-white/30 bg-transparent"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop / tablet: label + all logos on one row */}
      <div className="hidden shrink-0 items-center justify-between gap-8 whitespace-nowrap opacity-90 sm:flex lg:justify-start">
        <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-white md:text-sm">
          Trusted by <span className="text-primary">Growing</span> Companies
        </span>
        {items.map((item) => (
          <span
            key={item.name}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-base font-black tracking-[0.3em]"
          >
            {item.image_url ? (
              <TrustedLogoImage item={item} className="h-6" />
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="shrink-0 text-xl text-gray-300"
                  height="1em"
                  width="1em"
                >
                  {TRUSTED_BY_ICON_PATHS[item.icon] ??
                    TRUSTED_BY_ICON_PATHS.pulse}
                </svg>
                <span className="text-gray-100">{item.name}</span>
              </>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
