"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
  immediate = false,
}: RevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const targets: gsap.TweenTarget = stagger
        ? gsap.utils.toArray<HTMLElement>(el.children)
        : el;

      gsap.from(targets, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: immediate
          ? undefined
          : { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
