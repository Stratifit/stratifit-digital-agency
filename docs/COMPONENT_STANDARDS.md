# COMPONENT_STANDARDS.md

## 1. Purpose

This document defines the engineering standards for all UI components in the Stratifit Digital Agency platform and CMS.
It ensures consistency, accessibility, performance, type safety, and alignment with the Stratifit Design System and App Router architecture.

All components — human-written or AI-generated — must strictly follow these rules without exception.

---

## 2. Component Principles

Stratifit components must be:

* **Composable:** Built from small, focused elements that can be combined cleanly.
* **Predictable:** Strict props contract with explicit types and sensible defaults.
* **Token-Driven:** All visual styling references `DESIGN_SYSTEM.md` and `tailwind.config.ts`.
* **Accessible:** Native semantic HTML elements, accessible keyboard focus, and `aria-*` attributes.
* **CMS-Compatible:** Seamlessly consumes data payloads from Supabase CMS tables.
* **Motion-Safe:** GSAP animations use clean lifecycle wrappers and respect reduced-motion settings.
* **AI-Friendly:** Standardized interfaces and layout patterns that AI code-generation agents can consume and generate reliably.

---

## 3. Component Categories & Separation of Concerns

Stratifit enforces a strict 3-tier architecture for components:

### 3.1 Layout Components

Structure-only components that govern alignment, grids, and page flow.

* **Examples:** `Container`, `Grid`, `Flex`, `SectionWrapper`.
* **Rules:**
* **No visual styling** (no background colors, text styles, or border radii).
* **No motion timelines.**
* Only layout utility classes and spacing scale tokens (`p-space-lg`, `gap-space-md`).



### 3.2 UI Components

Atomic, reusable visual components that define presentation and micro-interactions.

* **Examples:** `Button`, `Card`, `Input`, `Badge`, `IconWrapper`.
* **Rules:**
* Must use declared Tailwind color, shadow, and typography tokens.
* Must support light/dark variants using designated surface tokens.
* Must be stateless or strictly manage local UI interaction states.



### 3.3 CMS Components

Components that consume dynamic data models fetched from Supabase.

* **Examples:** `HeroSection`, `FeaturesSection`, `PricingSection`, `TextBlock`, `CardBlock`.
* **Rules:**
* Must map 1:1 with corresponding `component_type` or `block_type` schemas in `CMS.md`.
* Must accept validated CMS data payloads.
* Must not contain hardcoded text, static media links, or mock content.
* Must compose atomic UI components internally for rendering layout and visuals.



---

## 4. File Naming & Folder Structure

### File Naming Conventions

* **UI & Layout Components:** `kebab-case.tsx` (e.g., `button.tsx`, `grid.tsx`)
* **CMS Section Components:** `kebab-case.tsx` inside `src/components/cms/sections/` (e.g., `hero-primary.tsx`)
* **CMS Block Components:** `kebab-case.tsx` inside `src/components/cms/blocks/` (e.g., `card-block.tsx`)
* **Hooks:** `use-something.ts` (e.g., `use-media-query.ts`)

### Directory Structure

```text
src/components/
├── ui/         → Reusable presentation components (button, badge, card, input)
├── layout/     → Layout structure wrappers (container, grid, flex, section-wrapper)
└── cms/        → CMS dynamic rendering components
    ├── blocks/   → Atomic CMS content block components (heading, card-block)
    └── sections/ → Section components & section-registry.ts

```

* **Strict Rule:** No component files may exist outside `src/components/`. Mixing concerns within a single component file is prohibited.

---

## 5. Props, Types, & Contracts

* **Type Definitions:** All component props must be typed using TypeScript `type` aliases. Use of `interface` for props is prohibited to maintain strict linting consistency.
* **Shared Domain Types:** Shared data models reside strictly in `src/lib/types/`.
* **No `any`:** `any` is forbidden. Explicitly type complex objects or fallback to generic types.
* **Default Values:** Use ES6 default parameters inside component signatures for optional props.

```typescript
// Example: src/components/ui/button.tsx
import type { ReactNode } from 'react';

export type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  className?: string;
  disabled?: boolean;
};

export const Button = ({
  children,
  variant = 'primary',
  href,
  className = '',
  disabled = false,
}: ButtonProps) => {
  // Component implementation...
};

```

---

## 6. Tailwind Usage Standards

### Strict Rules

* Only use tokens configured in `tailwind.config.ts`.
* **No Arbitrary Values:** Avoid inline bracket syntax like `w-[37px]`, `bg-[#121212]`, or `p-[19px]`.
* **No Inline Hex Colors:** Never use hex or RGB strings in JSX style objects.

| Category | Allowed Example | Forbidden Example |
| --- | --- | --- |
| **Color** | `bg-primary`, `text-text-secondary` | `bg-[#F59E0B]`, `text-[#D1D5DB]` |
| **Shadow** | `shadow-gold-glow`, `shadow-soft-dark` | `shadow-[0_0_10px_rgba(0,0,0,0.5)]` |
| **Radius** | `rounded-sm`, `rounded-md`, `rounded-lg` | `rounded-[5px]` |
| **Spacing** | `p-space-md`, `gap-space-lg` | `p-[17px]`, `mt-[23px]` |

---

## 7. Typography Rules

* **Display & Headings:** Use Satoshi via `font-display` (`font-bold`, `font-medium`).
* **Body & UI Elements:** Use Inter via `font-sans` (`font-normal`, `font-medium`).
* **No Inline Styling:** Never use `style={{ fontFamily: 'Satoshi' }}`. Always use Tailwind utility classes.

---

## 8. Motion & GSAP Rules

* **Lifecycle Safety:** All GSAP animations inside React components **must** be executed within `@gsap/react` `useGSAP()` or cleaned up using `gsap.context()`.
* **No Server Animations:** GSAP code must only exist inside components marked with `'use client'`.
* **Animate Transform & Opacity Only:** Animate `x`, `y`, `scale`, `rotation`, and `opacity`. Never animate `width`, `height`, `top`, `left`, or `margin`.
* **Reduced Motion Override:** Always respect user system preferences:
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) return;

```



---

## 9. Accessibility (a11y) Standards

* **Semantic Elements:** Use native `<button>`, `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, and heading hierarchy tags (`<h1>`–`<h6>`).
* **Keyboard Focus:** Ensure all interactive elements retain visible focus states (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`).
* **Image Accessibility:** Every image must include an `alt` attribute. If decorative, set `alt=""`.
* **ARIA Attributes:** Include `aria-expanded`, `aria-controls`, and `aria-label` where required for dynamic controls.

---

## 10. CMS Component Standards

### 10.1 CMS Section Components

* Located in `src/components/cms/sections/`.
* Must be registered in `src/components/cms/sections/section-registry.ts`.
* Must accept section configuration props along with an array of child `content_blocks`.
* Must not hardcode copy or static URLs.

### 10.2 CMS Block Components

* Located in `src/components/cms/blocks/`.
* Must accept a typed `data` payload matching the block schema defined in `CMS.md`.
* Must validate required payload fields prior to rendering JSX.

---

## 11. Dark & Light Mode Responsiveness

* Components must support dark and light mode background surfaces seamlessly.
* Primary surfaces must use `bg-background-dark` / `bg-surface-dark` with `text-text-primary`.
* Inverted light surfaces must use `bg-background-light` / `bg-surface-light` with corresponding text tokens.
* Hardcoding color defaults that break theme adaptability is strictly prohibited.

---

## 12. AI Code Generation Rules

AI tools generating component code must:

1. Restrict typography strictly to `font-display` (Satoshi) and `font-sans` (Inter).
2. Utilize Tailwind design tokens exclusively for colors, spacing, radii, shadows, and gradients.
3. Include proper TypeScript type annotations for all props.
4. Wrap GSAP animation effects inside `@gsap/react` `useGSAP()` hooks.
5. Adhere to component file placement rules (`src/components/ui/`, `src/components/layout/`, `src/components/cms/`).

---

## 13. Component Testing Standards

* **UI Component Testing:** Snapshot and interaction tests implemented via React Testing Library and Vitest.
* **CMS Component Testing:** Data payload rendering tests verifying correct component output for given JSON data structures.
* **Linting:** Zero ESLint or TypeScript compiler errors permitted before PR check merges.

---

## 14. Component Governance

Any modification or addition to component standards requires:

1. An OpenSpec proposal in `openspec/changes/`.
2. Updates synchronized in `COMPONENT_STANDARDS.md` and related docs.
3. Automated validation pass via Open Code Review prior to merging into `main`.
