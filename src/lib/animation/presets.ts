"use client";

export const ANIM_EASE = "power2.out";
export const CARD_EASE = "power3.out";

export type RevealVariant =
  | "fade"
  | "fadeDown"
  | "revealUp"
  | "card"
  | "image"
  | "cta";

/**
 * Standardized animation presets. Values are intentionally restrained and
 * aligned with the design system's motion tokens. Initial states are applied
 * from JS (gsap.from) so content is always visible when JS/GSAP fails.
 */
export const PRESETS: Record<RevealVariant, gsap.TweenVars> = {
  fade: { opacity: 0, duration: 0.5, ease: ANIM_EASE },
  fadeDown: { opacity: 0, y: -8, duration: 0.5, ease: ANIM_EASE },
  revealUp: { opacity: 0, y: 20, duration: 0.6, ease: ANIM_EASE },
  card: {
    opacity: 0,
    y: 24,
    scale: 0.985,
    duration: 0.6,
    ease: CARD_EASE,
  },
  image: { opacity: 0, scale: 1.03, duration: 0.9, ease: ANIM_EASE },
  cta: { opacity: 0, y: 30, duration: 0.7, ease: CARD_EASE },
};

/** Shorter distances/durations on mobile — motion should feel faster. */
export const MOBILE_PRESETS: Partial<Record<RevealVariant, gsap.TweenVars>> = {
  revealUp: { y: 14, duration: 0.5 },
  card: { y: 16, scale: 0.99, duration: 0.5 },
  cta: { y: 20, duration: 0.55 },
};

export const STAGGER_DESKTOP = 0.08;
export const STAGGER_MOBILE = 0.05;

export const SCROLL_TRIGGER_START = "top 85%";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
