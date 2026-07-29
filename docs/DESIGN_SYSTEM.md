# DESIGN_SYSTEM.md

## 1. Purpose

This document defines the visual design system for the Stratifit Digital Agency platform and CMS.
It establishes brand identity, color tokens, typography, spacing scales, border radii, shadows, gradients, and GSAP motion standards across all pages and application states.

All UI components, CMS-rendered sections, and AI-generated component templates must strictly adhere to this design system. No external inline styling or arbitrary non-token values are permitted.

---

## 2. Brand Identity & Visual Language

Stratifit’s visual identity is characterized by a high-contrast, premium, dark-mode-first aesthetic:

* **Palette:** Deep Black (`#050505`), Charcoal Surfacing (`#111111`), and Warm Brand Gold (`#F59E0B`).
* **Geometry:** Sharp typographic hierarchy, clean geometric alignment, and crisp borders.
* **Atmosphere:** Subtle radial gold glows, elevated dark card surfaces, and smooth, performance-focused motion.

---

## 3. Color System (Tailwind Tokens)

All colors are declared in `tailwind.config.ts` and referenced via standard Tailwind CSS utility classes. Arbitrary hex codes (e.g., `bg-[#1a1a1a]`) are strictly forbidden.

### 3.1 Brand Gold Tokens

| Token | Hex / Value | Usage | Tailwind Class Example |
| --- | --- | --- | --- |
| `primary` | `#F59E0B` | Main brand gold, accents, active states | `bg-primary`, `text-primary` |
| `primary-hover` | `#D97706` | Interactive hover state for gold elements | `hover:bg-primary-hover` |
| `primary-light` | `#FBBF24` | Highlights, badges, gradient end-stops | `text-primary-light` |
| `primary-glow` | `rgba(245, 158, 11, 0.15)` | Background radial glows and ambient light | `bg-primary-glow` |

### 3.2 Dark Mode Surface Tokens (Primary Environment)

| Token | Hex / Value | Usage | Tailwind Class Example |
| --- | --- | --- | --- |
| `background-dark` | `#050505` | Primary dark page background | `bg-background-dark` |
| `surface-dark` | `#111111` | Secondary dark containers, headers, footers | `bg-surface-dark` |
| `card-dark` | `#1A1A1A` | Cards, modals, elevated UI containers | `bg-card-dark` |

### 3.3 Light Mode / Inverted Surface Tokens (Secondary)

| Token | Hex / Value | Usage | Tailwind Class Example |
| --- | --- | --- | --- |
| `background-light` | `#FFFFFF` | Primary light page background | `bg-background-light` |
| `surface-light` | `#F9FAFB` | Inverted section surfaces | `bg-surface-light` |
| `card-light` | `#F3F4F6` | Inverted card backgrounds | `bg-card-light` |

### 3.4 Text Tokens

| Token | Hex / Value | Usage | Tailwind Class Example |
| --- | --- | --- | --- |
| `text-primary` | `#FFFFFF` | Primary headings and body copy on dark surfaces | `text-text-primary` |
| `text-secondary` | `#D1D5DB` | Subtitles, secondary copy, metadata | `text-text-secondary` |
| `text-muted` | `#9CA3AF` | Form labels, captions, disabled states | `text-text-muted` |

### 3.5 Border Tokens

| Token | Hex / Value | Usage | Tailwind Class Example |
| --- | --- | --- | --- |
| `border-dark` | `#374151` | Structural lines, card borders, dividers | `border-border-dark` |

---

## 4. Typography System

Stratifit uses two primary font families configured in `tailwind.config.ts`:

* **Satoshi:** Geometric display font used for headlines, wordmarks, and feature titles.
* **Inter:** Highly readable sans-serif font used for UI components, body text, and forms.

### Font Family Mappings

```typescript
// tailwind.config.ts excerpt
theme: {
  extend: {
    fontFamily: {
      display: ['Satoshi', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
    },
  },
}

```

### Typographic Tokens

| Token | Font Family | Weight | Recommended Usage | Tailwind Utility Class |
| --- | --- | --- | --- | --- |
| `font.display` | Satoshi | Bold / Black (700/900) | Hero titles, large section headlines, wordmark | `font-display font-bold` |
| `font.heading` | Satoshi | Medium / Bold (500/700) | Subheaders, H2/H3 tags, card titles | `font-display font-medium` |
| `font.body` | Inter | Regular (400) | Paragraphs, rich text blocks, long copy | `font-sans font-normal` |
| `font.ui` | Inter | Medium / SemiBold (500/600) | Buttons, badges, navigation links, form inputs | `font-sans font-medium` |

---

## 5. Gradients & Glows

Defined directly in Tailwind configuration as custom utilities:

```typescript
// Background image utility tokens
backgroundImage: {
  'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
  'dark-gradient': 'linear-gradient(180deg, #111111 0%, #050505 100%)',
  'hero-gradient': 'radial-gradient(circle at top, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
  'card-shine': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
}

```

* **CTA Buttons & Accent Highlights:** `bg-gold-gradient`
* **Hero Background Ambient Glow:** `bg-hero-gradient`
* **Card Surface Shine:** `bg-card-shine`

---

## 6. Elevation & Shadows

| Token | CSS Box Shadow Value | Usage | Tailwind Class |
| --- | --- | --- | --- |
| `gold-glow` | `0 0 30px rgba(245, 158, 11, 0.25)` | Primary CTA buttons, featured hero items | `shadow-gold-glow` |
| `soft-dark` | `0 10px 40px rgba(0, 0, 0, 0.4)` | Floating cards, modal windows, elevated dropdowns | `shadow-soft-dark` |

---

## 7. Spacing & Grid System

Spacing strictly adheres to standard Tailwind 8-point multiplier tokens. Non-standard spacing (e.g., `mt-[19px]`) is prohibited.

| Token | Rem Value | Pixel Equivalent | Typical Application |
| --- | --- | --- | --- |
| `space.xs` | `0.25rem` | 4px | Micro padding, icon gaps |
| `space.sm` | `0.5rem` | 8px | Button inline padding, badge margins |
| `space.md` | `1.0rem` | 16px | Card internal padding, form input spacing |
| `space.lg` | `1.5rem` | 24px | Grid gap sizes, stack spacing |
| `space.xl` | `2.0rem` | 32px | Section sub-block margins |
| `space.2xl` | `3.0rem` | 48px | Component stack separators |
| `space.3xl` | `4.0rem` | 64px | Page section vertical padding |

---

## 8. Border Radii Scale

| Token | Pixel Value | Application Target | Tailwind Utility Class |
| --- | --- | --- | --- |
| `radius.none` | `0px` | Flush containers, full-bleed hero elements | `rounded-none` |
| `radius.sm` | `4px` | Buttons, badge tags, form text inputs | `rounded-sm` |
| `radius.md` | `8px` | Feature cards, content containers, dropdown menus | `rounded-md` |
| `radius.lg` | `12px` | Modals, prominent hero cards, highlight containers | `rounded-lg` |

---

## 9. Motion & GSAP Animation Tokens

Animations are powered by GSAP via `@gsap/react`. All motions must reference standard duration and easing settings.

### Motion Tokens

* **Duration:**
* `motion.fast`: `0.25s` (Button hover states, micro-interactions)
* `motion.normal`: `0.5s` (Card fades, dropdown reveals)
* `motion.slow`: `0.8s` (Hero entrance timelines, section transitions)


* **Easing Presets:**
* `motion.ease`: `power2.out` (Standard exit/reveal)
* `motion.ease-in`: `power2.in` (Disappearances)
* `motion.ease-in-out`: `power2.inOut` (Looping animations)



### GSAP Implementation Rules

1. **Lifecycle Management:** Always wrap animations inside `useGSAP()` or `gsap.context()` to clean up memory in React Strict Mode.
2. **Transform Only:** Animate `x`, `y`, `scale`, `rotation`, and `opacity` exclusively. Never animate layout dimensions (`width`, `height`, `top`).
3. **Accessibility:** Respect user motion preferences by applying reduced-motion overrides:
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) return; // Skip or apply static opacity transition

```



---

## 10. Component Mapping Rules

All UI components and CMS dynamic sections must assemble existing tokens:

### Hero Section

* **Background:** `bg-background-dark` + `bg-hero-gradient`
* **Headline:** `font-display font-bold text-text-primary` (Satoshi)
* **Subheadline:** `font-sans font-normal text-text-secondary` (Inter)
* **CTA Button:** `bg-gold-gradient text-background-dark font-ui shadow-gold-glow rounded-sm`

### Feature Card

* **Container:** `bg-card-dark border border-border-dark rounded-md shadow-soft-dark`
* **Header:** `font-display font-medium text-text-primary`
* **Icon Accent:** `text-primary`

---

## 11. AI Code Generation Rules

AI tools (OpenCode, Copilot, Zed Assistant) generating visual layout code must:

1. Limit font usage strictly to `Satoshi` (`font-display`) and `Inter` (`font-sans`).
2. Utilize only pre-configured Tailwind classes mapping to this design system.
3. Reject arbitrary inline color codes or custom inline pixel measurements.
4. Ensure full compliance with component schemas defined in `COMPONENT_STANDARDS.md`.

---

## 12. System Governance

Modifications to the Stratifit Design System require:

1. An OpenSpec change proposal in `openspec/changes/`.
2. Updates synchronized across `DESIGN_SYSTEM.md` and `tailwind.config.ts`.
3. Open Code Review automated check passes prior to PR merge approval into `main`.
