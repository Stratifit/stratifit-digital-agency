"use client";

import * as React from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";

/**
 * Section heading entrance. Targets elements marked with [data-sh]
 * (eyebrow, heading, description) and builds them up in sequence when the
 * heading approaches the viewport. Desktop uses a subtle grouped reveal;
 * mobile uses a short timeline with more visible movement.
 */
export function SectionHeadingReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Content stays fully visible — no animation.
      });

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        gsap.from("[data-sh]", {
          opacity: 0,
          y: 22,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
        const parts = gsap.utils.toArray<HTMLElement>("[data-sh]", el);
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        const specs = [
          { y: 15, duration: 0.65 },
          { y: 30, duration: 0.8 },
          { y: 22, duration: 0.75 },
        ];
        parts.forEach((part, index) => {
          const spec = specs[index] ?? { y: 20, duration: 0.7 };
          tl.from(part, { opacity: 0, ...spec }, index === 0 ? 0 : "-=0.35");
        });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
