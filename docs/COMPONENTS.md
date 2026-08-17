# COMPONENTS.md — Stratifit Design System Components

**Project:** Stratifit Digital Agency
**Document type:** Foundational UI component reference
**Status:** Initial implementation reference
**Primary references:** `docs/DESIGN_SYSTEM.md`, `docs/FRONTEND.md`, `docs/PROJECT.md`

---

## 1. Purpose

This document records the foundational UI component implementation for the
Stratifit platform. It covers token architecture, typography behavior,
component variants, styling boundaries, and dependency decisions.

The authoritative visual specification remains `docs/DESIGN_SYSTEM.md`.
This document captures implementation decisions and reusable component APIs.

---

## 2. Token Architecture

Tokens are defined as CSS custom properties in `src/app/globals.css` and mapped
into Tailwind CSS v4 theme namespaces inside the `@theme` block. Components
reference tokens only; they do not introduce arbitrary values.

### 2.1 Color tokens

All core and extended colors come from `docs/DESIGN_SYSTEM.md`. The primary
amber token `#F59E0B` is the dominant brand accent. The indigo secondary token
`#4F46E5` is limited to AI, automation, analytics, and informational contexts.

### 2.2 Spacing tokens

The approved 4px-based scale (`space-0` through `space-32`) is available as
Tailwind spacing utilities. Components use these tokens for padding, gaps, and
sizing.

### 2.3 Radius tokens

`radius-xs` (4px), `radius-sm` (8px), `radius-md` (12px), `radius-lg` (16px),
`radius-xl` (24px), and `radius-full` map to `rounded-*` utilities.

### 2.4 Shadow tokens

`shadow-sm` through `shadow-lg` provide elevation. `shadow-amber` provides the
controlled amber glow used selectively on primary surfaces.

### 2.5 Gradient tokens

Approved gradients (`gradient-primary`) are available but used sparingly and
only with a documented design purpose.

### 2.6 Motion tokens

Duration tokens (`motion-instant` 120ms through `motion-cinematic` 1200ms) and
easing tokens (`ease-standard`, `ease-in`, `ease-out`, `ease-in-out`) are used
for all component transitions. The global `prefers-reduced-motion` override
removes non-essential animation.

### 2.7 Container tokens

`container-sm` (768px), `container-md` (1024px), `container-lg` (1280px), and
`container-xl` (1440px) drive the `Container` width variants.

---

## 3. Typography and Fonts

### 3.1 Satoshi (display)

Satoshi is the display font for hero headings, section headings, card titles,
large figures, and brand expression. It is loaded from local files in
`public/satoshi/` via `@font-face` declarations in `globals.css` and exposed
through the `--font-display` token.

### 3.2 Inter (interface)

Inter is loaded via `next/font/google` in `src/app/layout.tsx` and exposed
through the `--font-sans` token. It is the default for body copy, navigation,
buttons, forms, tables, labels, the CMS, and chat interfaces.

### 3.3 Fallback behavior

If Satoshi files are unavailable, the `--font-display` stack falls back to
Inter, then system UI fonts. No placeholder or unverified font file is added.

### 3.4 Satoshi licensing safeguard

Local Satoshi files are only committed when the project holds a valid license.
Coding agents must not download, generate, redistribute, expose, or commit
unverified font files.

---

## 4. Component Variants

All components live in `src/components/ui/` and use the `cn()` utility from
`src/lib/cn.ts`.

| Component | File | Variants | Notes |
|-----------|------|----------|-------|
| Button | `button.tsx` | primary, secondary, tertiary, destructive; small, medium, large, hero | States: default, hover, active, focus-visible, disabled, loading; ref forwarding; no `"use client"` |
| Input | `input.tsx` | — | Native attributes, ref forwarding, invalid/disabled/focus states |
| Textarea | `textarea.tsx` | — | Min-height 120px, native attributes |
| Select | `select.tsx` | — | Native `<select>`, full keyboard operation |
| Label | `label.tsx` | — | `htmlFor` association |
| Card | `card.tsx` | standard, featured | Optional `interactive` for hover/focus |
| Container | `container.tsx` | sm, md, lg, xl | Responsive padding, overflow-safe |
| Section | `section.tsx` | — | Responsive vertical spacing, semantic `<section>` |
| Badge | `badge.tsx` | neutral, success, warning, error, information | Text/icon carry meaning, not color alone |
| Skeleton | `skeleton.tsx` | — | `aria-hidden`, pulse respects reduced motion |
| Toast | `toast.tsx` | info, success, warning, error | Provider + `useToast()`; polite/assertive live regions; hover/focus pause; errors persist |
| Dialog | `dialog.tsx` | — | Radix-based, focus trap/restore, accessible title/description |
| Drawer | `drawer.tsx` | direction: left, right | Radix-based side sheet, focus management |

---

## 5. Styling Boundaries

See `docs/FRONTEND.md` section 11.6 for the public website and CMS styling
contract.

Summary:

- Public context may use larger Satoshi display type, controlled amber glow,
  limited indigo, richer approved shadows and motion.
- CMS context keeps Inter dominant, neutral surfaces, restrained shadows, and
  minimal motion.
- Context differences are expressed through explicit variants, never generic
  `isPublic`/`isCms` props.
- Components are shared, not duplicated per context.

---

## 6. Dependency Decisions

The implementation reuses the approved stack. One dependency was added:

- `@radix-ui/react-dialog` — accessible modal primitive powering `Dialog` and
  `Drawer`. Required because hand-rolled focus trap/restore and scroll locking
  are error-prone and Radix is part of the approved shadcn/ui stack. No
  duplicate modal library is used.

No `class-variance-authority`, `clsx`, or `tailwind-merge` were added; the
minimal `cn()` utility in `src/lib/cn.ts` covers the current needs without
dependency inflation.
