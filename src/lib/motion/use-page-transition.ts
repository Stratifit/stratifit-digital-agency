// ============================================================================
// Stratifit — Page Transition Hook (GSAP)
// Minimal scaffolding for future animation integration.
// ============================================================================

"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Detects user preference for reduced motion.
 * Returns `true` when the user prefers reduced motion.
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * usePageTransition
 *
 * Minimal hook that prepares GSAP animations for page content.
 * Currently only logs the transition lifecycle.
 * Expand later to animate section entrance, scroll-triggered reveals, etc.
 *
 * @param containerRef - Ref to the element wrapping the page content.
 * @param deps         - Dependency array to re-run the effect.
 */
export function usePageTransition(
  containerRef: React.RefObject<HTMLDivElement | null>,
  deps: unknown[] = []
) {
  const hasAnimated = useRef(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        // User prefers reduced motion — skip all animations.
        gsap.set(containerRef.current, { opacity: 1 });
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      // Initial hidden state
      gsap.set(container, { opacity: 0, y: 20 });

      // Entrance animation
      gsap.to(container, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        onStart: () => {
          hasAnimated.current = true;
        },
      });
    },
    { dependencies: deps, scope: containerRef }
  );
}
