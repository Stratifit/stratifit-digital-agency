"use client";

import * as React from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import {
  MOBILE_PRESETS,
  PRESETS,
  SCROLL_TRIGGER_START,
  STAGGER_DESKTOP,
  STAGGER_MOBILE,
  type RevealVariant,
} from "@/lib/animation/presets";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Stagger direct children instead of animating the wrapper as one block.
   * Useful for grids/lists (e.g. service cards).
   */
  stagger?: boolean;
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
 *
 * Desktop and mobile use slightly different distances/durations via
 * `gsap.matchMedia`; reduced motion skips animation entirely.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  immediate = false,
  variant = "revealUp",
}: RevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const targets: gsap.TweenTarget = stagger
        ? gsap.utils.toArray<HTMLElement>(el.children)
        : el;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Content stays fully visible — no animation.
      });

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        gsap.from(targets, {
          ...PRESETS[variant],
          stagger: stagger ? STAGGER_DESKTOP : 0,
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start: SCROLL_TRIGGER_START, once: true },
        });
      });

      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
        const mobile = MOBILE_PRESETS[variant] ?? {};
        gsap.from(targets, {
          ...PRESETS[variant],
          ...mobile,
          stagger: stagger ? STAGGER_MOBILE : 0,
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start: SCROLL_TRIGGER_START, once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
