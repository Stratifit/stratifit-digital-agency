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
}: RevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Content stays fully visible — no animation.
      });

      // Desktop / tablet: grouped entrance. Grids trigger once, cards stagger.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
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
      });

      // Mobile: stronger, clearly visible rise. Staggered groups reveal each
      // card independently with its own ScrollTrigger when it approaches the
      // bottom of the viewport; single blocks rise as one panel; carousels
      // (cardSelector) reveal each card with its own trigger + small delay.
      // From-states apply at creation (default immediateRender) so content is
      // hidden before it enters the viewport — no flash when it appears.
      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
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
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  // Correct ScrollTrigger positions that were measured while a grid was still
  // display:none (e.g. breakpoint-based grids). Refreshing after layout and on
  // window load prevents reveals from firing at the wrong scroll position.
  React.useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener("load", refresh);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
