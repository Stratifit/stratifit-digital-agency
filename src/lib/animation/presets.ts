"use client";

export const ANIM_EASE = "power2.out";
export const CARD_EASE = "power3.out";

export type RevealVariant =
  | "fade"
  | "fadeDown"
  | "revealUp"
  | "card"
  | "image"
  | "cta"
  | "calm";

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
  /** Calmest motion on the site — a slow, still fade (footer). */
  calm: { opacity: 0, duration: 1.2, ease: "power1.out" },
};

/**
 * Mobile values: stronger, clearly visible rise for scroll reveals while
 * staying premium. Cards trigger individually with their own ScrollTrigger
 * (see Reveal), so distances can be larger without feeling synced-up.
 */
export const MOBILE_PRESETS: Partial<Record<RevealVariant, gsap.TweenVars>> = {
  fade: { duration: 0.6 },
  fadeDown: { y: -6, duration: 0.5 },
  revealUp: { y: 32, duration: 0.8, ease: "power3.out" },
  card: { y: 45, scale: 0.97, duration: 0.9, ease: "power3.out" },
  image: { scale: 1.03, duration: 1.0, ease: "power2.out" },
  cta: { y: 40, duration: 0.9, ease: "power3.out" },
  calm: { y: 0, scale: 1, duration: 1.0, ease: "power1.out" },
};

/** Per-card mobile reveal values (each card gets its own trigger). */
export const MOBILE_CARD_FROM = {
  opacity: 0,
  y: 45,
  scale: 0.97,
  duration: 0.9,
  ease: "power3.out",
} as const;

/**
 * Mobile reveal for cards inside horizontal carousels. A gentle fade with a
 * small rise: big y-offsets make cards visibly push up inside the container
 * while the user is scrolling vertically past the carousel.
 */
export const MOBILE_CAROUSEL_CARD_FROM = {
  opacity: 0,
  y: 12,
  duration: 0.55,
  ease: "power2.out",
} as const;

/** Single-block mobile reveal values (panels, forms, non-stagger content). */
export const MOBILE_BLOCK_FROM = {
  opacity: 0,
  y: 36,
  scale: 0.99,
  duration: 0.85,
  ease: "power3.out",
} as const;

export const STAGGER_DESKTOP = 0.08;

export const SCROLL_TRIGGER_START = "top 85%";
export const MOBILE_TRIGGER_START = "top 90%";
