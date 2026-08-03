"use client";

import * as React from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";

/**
 * Controlled hero entrance. Animates blocks marked with [data-hero] in
 * sequence: eyebrow → heading → description → CTAs → proof. Desktop only —
 * mobile renders instantly (like the original hero). Content is visible by
 * default (gsap.fromTo inside the timeline); reduced motion skips animation.
 */
export function HeroEntrance({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Content stays fully visible.
      });

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-hero]", el);
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            items,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }
          );
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
