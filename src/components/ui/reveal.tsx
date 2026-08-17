"use client";

import * as React from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animation/gsap";
import {
  MOBILE_BLOCK_FROM,
  MOBILE_CARD_FROM,
  MOBILE_CAROUSEL_CARD_FROM,
  MOBILE_PRESETS,
  MOBILE_TRIGGER_START,
  PRESETS,
  SCROLL_TRIGGER_START,
  STAGGER_DESKTOP,
  type RevealVariant,
} from "@/lib/animation/presets";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Stagger direct children instead of animating the wrapper as one block.
   * On desktop the grid triggers once and cards stagger (~0.08s). On mobile
   * each child gets its OWN ScrollTrigger and rises independently when it
   * approaches the viewport (stacked cards reveal one by one).
   */
  stagger?: boolean;
  /**
   * Mobile-only: cascade-reveal matching descendant cards (carousels).
   * Cards share the same vertical position, so one container trigger fires a
   * staggered rise — same feel as the services cards.
   */
  cardSelector?: string;
  /** Disable the scroll trigger and animate immediately on mount (hero). */
  immediate?: boolean;
  variant?: RevealVariant;
  /**
   * Override the desktop breakpoint for the grouped entrance. Use when a
   * stagger grid stays `display:none` below a custom breakpoint (e.g. a
   * `hidden lg:grid` grid) so ScrollTrigger never measures a hidden element.
   * Defaults to 768px (the `md` breakpoint).
   */
  desktopMinWidth?: number;
}

/**
 * Fade-and-rise reveal powered by GSAP.
 *
 * Uses `gsap.from` so content is visible by default: if JavaScript is disabled,
 * GSAP fails, or the user prefers reduced motion, everything simply stays
 * visible without animation. Nothing is ever hidden via CSS.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  cardSelector,
  immediate = false,
  variant = "revealUp",
  desktopMinWidth = 768,
}: RevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  // Mirror props for the mount-once effect (they never change for a given
  // Reveal, so keeping them out of the dependency array is intentional).
  const revealPropsRef = React.useRef({ stagger, cardSelector });

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Content stays fully visible — no animation.
      });

      // Desktop / tablet: grouped entrance. Grids trigger once, cards stagger.
      mm.add(
        `(prefers-reduced-motion: no-preference) and (min-width: ${desktopMinWidth}px)`,
        () => {
          const targets: gsap.TweenTarget = stagger
            ? gsap.utils.toArray<HTMLElement>(el.children)
            : el;
          gsap.from(targets, {
            ...PRESETS[variant],
            stagger: stagger ? STAGGER_DESKTOP : 0,
            scrollTrigger: immediate
              ? undefined
              : { trigger: el, start: SCROLL_TRIGGER_START, once: true },
          });
        }
      );

      // Mobile: stronger, clearly visible rise. Staggered groups reveal each
      // card independently with its own ScrollTrigger when it approaches the
      // bottom of the viewport; single blocks rise as one panel; carousels
      // (cardSelector) reveal each card with its own trigger + small delay.
      // From-states apply at creation (default immediateRender) so content is
      // hidden before it enters the viewport — no flash when it appears.
      mm.add(
        `(prefers-reduced-motion: no-preference) and (max-width: ${desktopMinWidth - 1}px)`,
        () => {
          if (cardSelector) {
            gsap.utils
              .toArray<HTMLElement>(el.querySelectorAll(cardSelector))
              .forEach((card, index) => {
                gsap.from(card, {
                  ...MOBILE_CAROUSEL_CARD_FROM,
                  delay: index * 0.06,
                  scrollTrigger: immediate
                    ? undefined
                    : { trigger: card, start: MOBILE_TRIGGER_START, once: true },
                });
              });
          } else if (stagger) {
            gsap.utils.toArray<HTMLElement>(el.children).forEach((item) => {
              gsap.from(item, {
                ...MOBILE_CARD_FROM,
                scrollTrigger: immediate
                  ? undefined
                  : { trigger: item, start: MOBILE_TRIGGER_START, once: true },
              });
            });
          } else {
            gsap.from(el, {
              ...MOBILE_BLOCK_FROM,
              ...(MOBILE_PRESETS[variant] ?? {}),
              scrollTrigger: immediate
                ? undefined
                : { trigger: el, start: MOBILE_TRIGGER_START, once: true },
            });
          }
        }
      );

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  // Correct ScrollTrigger positions that were measured while a grid was still
  // display:none (e.g. breakpoint-based grids) or before webfonts finished
  // loading (font-display: swap reflows the page after window.load, so the
  // measured trigger starts drift and reveals never fire). Refreshing after
  // layout, on window load, and when fonts are ready prevents reveals from
  // firing at the wrong scroll position or never firing.
  React.useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    let cancelled = false;
    const timers: number[] = [];

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    // Keep re-measuring while the page settles (webfonts, images, lazy
    // content, breakpoint grids) so triggers never keep a stale start position
    // that would stop a reveal from firing.
    [750, 1500, 3000, 4500, 6000].forEach((ms) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) refresh();
        }, ms)
      );
    });
    window.addEventListener("load", refresh);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          if (!cancelled) refresh();
        })
        .catch(() => {});
    }

    // Permanent safety net: if a ScrollTrigger measured a stale position and
    // never fires, its targets would stay hidden forever. An IntersectionObserver
    // watches the ACTUAL rendered position (independent of ScrollTrigger's
    // position math), so the moment a target enters the viewport while still
    // fully hidden, it is force-shown. Normal scroll reveals are untouched —
    // by the time the grace check runs they are already animating (opacity > 0).
    let observer: IntersectionObserver | null = null;
    const el = containerRef.current;
    const { stagger, cardSelector } = revealPropsRef.current;
    if (el && typeof IntersectionObserver !== "undefined") {
      const targets: HTMLElement[] = stagger
        ? Array.from(el.children as HTMLCollectionOf<HTMLElement>)
        : cardSelector
          ? Array.from(el.querySelectorAll<HTMLElement>(cardSelector))
          : [el];
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const target = entry.target as HTMLElement;
            observer?.unobserve(target);
            window.setTimeout(() => {
              if (!cancelled && target.style.opacity === "0") {
                gsap.to(target, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.45,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              }
            }, 350);
          });
        },
        { rootMargin: "0px 0px 10% 0px" }
      );
      targets.forEach((t) => observer?.observe(t));
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      observer?.disconnect();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
