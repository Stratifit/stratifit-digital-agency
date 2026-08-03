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
 * Fade-and-rise reveal powered by GSAP. Initial hidden state is set via the
 * `.gsap-reveal` CSS class (see globals.css) so there is no flash of
 * unstyled content before hydration. `prefers-reduced-motion` skips the
 * animation entirely (CSS restores full opacity). A <noscript> rule in the
 * root layout keeps content visible when JavaScript is unavailable.
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

      gsap.set(targets, { y: 24 });
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: immediate
          ? undefined
          : { trigger: el, start: "top 85%", once: true },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={`gsap-reveal ${className ?? ""}`}>
      {children}
    </div>
  );
}
