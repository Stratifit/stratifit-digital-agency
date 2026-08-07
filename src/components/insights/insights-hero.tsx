"use client";

import * as React from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { Container } from "@/components/ui/container";

interface InsightsHeroProps {
  eyebrow?: string | null;
  title: string;
  highlight?: string | null;
  description?: string | null;
}

/**
 * Hero for the /insights index page.
 *
 * Keeps the reference composition (amber glow orb, eyebrow, display headline
 * with accent highlight, bordered description) and adds a premium entrance:
 * eyebrow → headline → description rise in sequence (desktop only), while the
 * glow orb drifts gently on scroll for depth. Content is visible by default —
 * JS failure or reduced motion simply skips the animation.
 */
export function InsightsHero({
  eyebrow,
  title,
  highlight,
  description,
}: InsightsHeroProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Content stays fully visible — no animation.
      });

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-hero]", root);
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            items,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }
          );

        const glow = glowRef.current;
        if (glow) {
          gsap.to(glow, {
            yPercent: 45,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      <section className="relative overflow-hidden pb-16 pt-32 md:pb-20 md:pt-40">
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]"
        />
        <Container className="relative z-10">
          {eyebrow ? (
            <p
              data-hero
              className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary"
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            data-hero
            className="mb-4 font-display text-4xl font-black leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-none lg:text-7xl"
          >
            <span>{title}</span>
            {highlight ? <span className="text-primary"> {highlight}</span> : null}
          </h1>
          {description ? (
            <p
              data-hero
              className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-base leading-relaxed text-text-muted sm:pl-6 sm:text-lg md:text-xl"
            >
              {description}
            </p>
          ) : null}
        </Container>
      </section>
    </div>
  );
}
