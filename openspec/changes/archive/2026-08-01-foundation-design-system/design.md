## Context

The Stratifit Digital Agency platform currently has a Next.js 16 and Tailwind CSS v4 foundation, but it does not yet have an implemented design system.

The approved visual language is defined in:

- `AGENTS.md`
- `docs/PROJECT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/FRONTEND.md`
- `docs/CMS.md`
- `docs/ROADMAP.md`

Phase 2 of the roadmap requires translating the approved design language into reusable code before public pages, CMS screens, Supabase-backed content editors, chat interfaces, or other product features are built.

The design-system foundation must provide:

- Centralized design tokens
- Satoshi and Inter font roles
- Responsive typography and spacing
- Foundational UI components
- Public-site and CMS styling boundaries
- Accessibility behavior
- Reduced-motion support
- Controlled dependency usage

The implementation must remain limited to the design-system foundation. It must not expand into page-specific sections, CMS business logic, Supabase, chat, email, or deployment work.

---

## Goals / Non-Goals

### Goals

- Implement CSS custom properties for all approved design tokens
- Expose approved tokens through Tailwind CSS v4
- Use only exact values documented in `docs/DESIGN_SYSTEM.md`
- Implement the approved dark-mode-first color system
- Preserve approved light-surface tokens without introducing a complete light theme
- Implement the approved spacing, radius, shadow, gradient, typography, layout, and motion systems
- Load Inter through an approved Next.js font-loading strategy
- Load Satoshi through `next/font/local` only when licensed local font files are available
- Provide a safe display-font fallback when Satoshi files are unavailable
- Create reusable foundational UI components
- Preserve native HTML behavior and accessible semantics
- Keep Client Component boundaries minimal
- Establish public-site and CMS styling differences without creating duplicate component libraries
- Support mobile-first responsive behavior
- Support keyboard navigation
- Support focus-visible behavior
- Support reduced-motion preferences
- Use existing project dependencies before introducing new ones
- Verify the implementation with lint, build, accessibility, responsive, and architecture checks

### Non-Goals

- Building the Announcement Bar
- Building the Header or Footer
- Building homepage sections
- Building page-specific layouts
- Implementing the Section Registry
- Building CMS content editors
- Building CMS navigation or dashboards beyond shared primitives
- Adding Supabase database logic
- Adding authentication
- Adding Storage integration
- Adding lead forms
- Adding the AI chatbot
- Adding AI FAQ behavior
- Adding conversation management
- Adding Resend email integration
- Adding analytics
- Adding deployment configuration
- Implementing full application-wide light mode
- Implementing page-specific GSAP timelines
- Creating a second component library
- Introducing arbitrary design-token editing

---

## Decisions

### Decision: Use CSS custom properties with Tailwind CSS v4 theme mapping

**Choice**

Define raw and semantic tokens as CSS custom properties in the approved global stylesheet, then expose them through Tailwind CSS v4 `@theme` configuration.

**Rationale**

This approach:

- Keeps token values centralized
- Supports both CSS and Tailwind utilities
- Allows semantic naming
- Avoids duplicating values in TypeScript
- Supports future controlled theme extension
- Works with the approved Tailwind CSS v4 architecture

**Implementation guidance**

Token categories should include:

- Colors (core, extended, semantic, scale, overlay, light)
- Typography (font families, sizes, line heights, weights, tracking)
- Spacing (4px-based scale)
- Radii (none through full)
- Shadows (elevation and glow variants)
- Gradients (primary, dark-surface, hero-ambient, AI-accent, mixed-premium)
- Motion durations (instant through cinematic)
- Motion easing (standard, in, out, in-out)
- Layout widths (container breakpoints)

**Alternatives considered**

- Tailwind config only: Limited to Tailwind utilities, no CSS variable access
- JavaScript token objects: Adds runtime overhead, complicates dark mode
- Design-token JSON files: Adds build complexity, reduces runtime flexibility

---

### Decision: Font loading strategy

**Choice**

Load Satoshi through `next/font/local` only when properly licensed local font files are available. Load Inter through an approved Next.js font-loading strategy (`next/font/google` or `next/font/local`).

**Rationale**

This approach:

- Respects font licensing requirements
- Prevents accidental distribution of unlicensed fonts
- Maintains fallback behavior when Satoshi files are unavailable
- Uses Next.js font optimization for performance
- Prevents layout shift through proper font-display settings
- Keeps font configuration centralized

**Implementation guidance**

- Satoshi: Use `next/font/local` with local `.woff2` files only when a valid license exists
- Inter: Use `next/font/google` with subset and weight limiting, or `next/font/local` if preferred
- Both fonts expose CSS variables: `--font-display` (Satoshi or fallback), `--font-sans` (Inter)
- Fallback stacks: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Font-display: `swap` for both fonts to prevent invisible text
- Coding agents shall not download, generate, redistribute, or commit unverified font files
- When Satoshi files are unavailable, the design-system foundation continues with the fallback stack

**Alternatives considered**

- Google Fonts CDN for both: Less control, potential privacy concerns, no Next.js optimization
- Manual @font-face: More complex, harder to optimize, no layout-shift prevention
- Self-hosting Inter: Unnecessary when Next.js font loading is available

---

### Decision: Component architecture

**Choice**

Create individual component files in `src/components/ui/` with variant support through `class-variance-authority` (cva), following existing shadcn/ui patterns.

**Rationale**

This approach:

- Follows established project patterns
- Provides type-safe variant definitions
- Maintains small bundle size through tree-shaking
- Supports both Server and Client Component patterns
- Allows gradual adoption without breaking changes
- Works with existing Tailwind CSS utilities

**API requirements**

- `className` prop for custom styling
- Native HTML attributes appropriate to the underlying element
- `children` prop for content composition
- Ref forwarding where technically appropriate
- Preserved accessible names and semantics
- Minimal `"use client"` directives

**Implementation guidance**

- Inspect existing shadcn/ui components before creating new ones
- Reuse existing Radix primitives where already installed
- Keep variant definitions declarative and testable
- Avoid polymorphic APIs unless genuinely necessary
- Prefer Server Components when browser interaction is not required

**Alternatives considered**

- Monolithic component library: Larger bundle, less flexible
- CSS-only components: Limited interactivity, harder to maintain states
- Headless UI library: Adds dependency, may duplicate Radix

---

### Decision: Public vs CMS styling boundaries

**Choice**

Implement styling differences through variant options, composition patterns, and surrounding layout styles rather than creating separate component libraries.

**Rationale**

This approach:

- Reduces code duplication
- Maintains consistent component APIs
- Allows theme-based differences without duplication
- Keeps maintenance overhead manageable
- Supports shared primitive components

**Implementation guidance**

- Public website may use: larger Satoshi-led display typography, richer composition, controlled amber glow, limited indigo accents, more expressive approved motion
- CMS must use: Inter-dominant typography, neutral surfaces, restrained shadows and glows, minimal motion, clear operational layouts
- Use Tailwind variant prefixes or CSS custom property overrides for context differences
- Document public vs CMS styling boundaries clearly

**Alternatives considered**

- Separate component libraries: High maintenance overhead, duplication risk
- CSS class overrides: Less type-safe, harder to document
- Theme provider: Adds complexity, may not suit all differences

---

### Decision: Accessibility implementation

**Choice**

Build accessibility into base components using ARIA attributes, keyboard handlers, and focus management, following WCAG 2.1 AA guidelines.

**Rationale**

This approach:

- Ensures compliance by default
- Reduces developer burden
- Prevents accessibility regressions
- Supports assistive technology users
- Meets legal and ethical requirements

**Implementation guidance**

- Focus-visible: Token-based amber focus ring on all interactive elements
- Keyboard navigation: All controls reachable and operable via keyboard
- Focus order: Logical and predictable tab order
- Labels: Proper label association for all form controls
- Error messages: Associated with inputs via `aria-describedby`
- Reduced motion: `prefers-reduced-motion: reduce` removes non-essential animation
- Dialog/Drawer: Focus trapping, escape dismissal, focus restoration, accessible titles
- Toast: Live region announcements, auto-dismiss pausing, mobile obstruction prevention
- Skeleton: Hidden from assistive technology, surrounding `aria-busy` state
- Touch targets: Minimum 44px per `docs/DESIGN_SYSTEM.md`

**Alternatives considered**

- Post-launch accessibility fixes: More expensive, risk of oversight
- Third-party accessibility library: Adds dependency, less control
- Manual accessibility reviews only: Inconsistent, error-prone

---

### Decision: Responsive design approach

**Choice**

Implement mobile-first responsive behavior using Tailwind CSS breakpoints and component-level responsive props.

**Rationale**

This approach:

- Leverages existing Tailwind infrastructure
- Provides consistent responsive behavior
- Supports progressive enhancement
- Works with Server Components
- Avoids JavaScript viewport detection

**Implementation guidance**

- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl` (Tailwind defaults)
- Container: Responsive max-width and horizontal padding per breakpoint
- Typography: Approved responsive sizes or fluid sizing from `docs/DESIGN_SYSTEM.md`
- Spacing: Responsive section padding (mobile 64-80px, tablet 80-112px, desktop 112-160px)
- Overflow prevention: All components avoid unintended horizontal overflow
- Mobile: Single column, larger touch targets, reduced decorative motion
- Tablet: One or two columns, preserved spacing
- Desktop: Strong grid composition, controlled text width

**Alternatives considered**

- CSS media queries only: Less type-safe, harder to maintain
- JavaScript-based responsiveness: Adds runtime overhead, not Server Component compatible
- Container queries: Not universally supported, adds complexity

---

### Decision: Motion token system

**Choice**

Implement centralized duration and easing tokens for CSS interaction and animation behavior.

**Rationale**

This approach:

- Centralizes motion values for consistency
- Supports reduced-motion behavior
- Prevents arbitrary timing values
- Documents approved motion patterns
- Separates public-site and CMS motion levels

**Implementation guidance**

Duration tokens:
- `motion-instant`: 120ms (press feedback)
- `motion-fast`: 200ms (hover, focus transitions)
- `motion-standard`: 350ms (UI reveals)
- `motion-medium`: 500ms (card/section entrances)
- `motion-slow`: 800ms (hero timelines)
- `motion-cinematic`: 1200ms (rare storytelling moments)

Easing tokens:
- `ease-standard`: cubic-bezier(0.22, 1, 0.36, 1)
- `ease-in`: cubic-bezier(0.4, 0, 1, 1)
- `ease-out`: cubic-bezier(0, 0, 0.2, 1)
- `ease-in-out`: cubic-bezier(0.4, 0, 0.2, 1)

Usage rules:
- Components use approved tokens instead of arbitrary values
- Public-site motion may be more expressive
- CMS motion remains minimal
- Reduced-motion mode preserves all content and state changes
- Decorative movement removed or simplified when `prefers-reduced-motion` is enabled
- GSAP timelines are not implemented in this change

**Alternatives considered**

- Inline timing values: Inconsistent, hard to maintain
- Animation library: Adds dependency, less control
- CSS transition-only approach: Limits animation capability

---

### Decision: Dependency control

**Choice**

Use existing project stack and dependencies before introducing additional packages.

**Rationale**

This approach:

- Prevents dependency inflation
- Maintains consistency with approved stack
- Reduces maintenance burden
- Avoids duplicate functionality
- Keeps bundle size manageable

**Implementation guidance**

Preferred capabilities to use first:
- React 19 and Server Components
- Tailwind CSS v4 utilities
- Existing shadcn/ui components
- Already-installed Radix primitives
- Existing project utilities

When a new package appears necessary:
- Document why the existing stack is insufficient
- Obtain explicit approval before adding major dependencies
- Do not add duplicate component libraries
- Do not add packages for trivial utilities

**Alternatives considered**

- Adding popular UI libraries: May duplicate existing functionality
- Custom solutions from scratch: More development effort, may reinvent capabilities
- No dependency control: Risk of dependency inflation and maintenance burden

---

## Risks / Trade-offs

### Risk: Token proliferation leading to inconsistency

**Impact**: Multiple token definitions could create confusion and inconsistency.

**Mitigation**: Strict governance through `docs/DESIGN_SYSTEM.md`, centralized CSS variables, regular audits, and verification that no undocumented tokens are introduced.

---

### Risk: Font loading performance impact

**Impact**: Font loading could cause layout shift or delayed text rendering.

**Mitigation**: Use `font-display: swap`, implement proper fallback stacks, preload critical fonts, limit Inter subsets/weights, and verify layout shift metrics.

---

### Risk: Satoshi licensing uncertainty

**Impact**: Local font files may not be available or properly licensed.

**Mitigation**: Design-system foundation continues with approved fallback stack when Satoshi files are unavailable. No placeholder or unverified font files are committed.

---

### Risk: Component API complexity

**Impact**: Inconsistent component APIs could confuse developers.

**Mitigation**: Follow established shadcn/ui patterns, document API conventions, enforce consistency through code review, and avoid unnecessary polymorphic APIs.

---

### Risk: Public/CMS boundary blurring

**Impact**: Styling differences could become inconsistent or duplicated.

**Mitigation**: Clear variant documentation, shared primitive components, visual testing, design reviews, and avoidance of duplicate component libraries.

---

### Risk: Accessibility regressions

**Impact**: Components could become inaccessible over time.

**Mitigation**: Build accessibility into base components, automated testing, manual keyboard/screen reader testing, CI integration, and verification requirements.

---

### Risk: Responsive design inconsistencies

**Impact**: Components could behave differently across viewports.

**Mitigation**: Use Tailwind breakpoints consistently, test across mobile/tablet/desktop, document responsive patterns, and review overflow behavior.

---

### Risk: Dependency inflation

**Impact**: Unnecessary packages could increase bundle size and maintenance burden.

**Mitigation**: Strict dependency control policy, require justification for new packages, reuse existing stack, and verify no duplicate libraries.

---

### Risk: Scope expansion

**Impact**: Change could expand beyond design-system foundation into page sections, CMS logic, or other features.

**Mitigation**: Clear non-goals, task scope-control checks, verification that no unrelated work was added, and explicit boundaries in proposal and design documents.

---

## Migration Plan

### Phase 1: Token Foundation

1. Create or update CSS custom properties in `src/app/globals.css`
2. Configure Tailwind CSS v4 `@theme` mappings
3. Implement core color tokens
4. Implement extended color tokens (semantic, scale, overlay, light)
5. Implement spacing tokens
6. Implement radius, shadow, and gradient tokens
7. Implement layout-width tokens
8. Verify token values against `docs/DESIGN_SYSTEM.md`

### Phase 2: Typography and Fonts

1. Verify Satoshi licensing availability
2. Configure Satoshi with `next/font/local` (if licensed) or fallback
3. Configure Inter with approved Next.js font strategy
4. Expose `--font-display` and `--font-sans` CSS variables
5. Implement display, heading, body, caption, and overline typography styles
6. Implement responsive typography behavior
7. Verify layout shift prevention

### Phase 3: Motion Foundation

1. Implement duration tokens (motion-instant through motion-cinematic)
2. Implement easing tokens (ease-standard, ease-in, ease-out, ease-in-out)
3. Add global `prefers-reduced-motion` handling
4. Verify reduced-motion behavior preserves content and controls

### Phase 4: Shared Component Utilities

1. Reuse existing class-name merge utility
2. Reuse existing `class-variance-authority` support
3. Define consistent variant naming conventions
4. Ensure className, native attributes, children, and ref forwarding support
5. Keep Client Component boundaries minimal

### Phase 5: Button Component

1. Inspect existing Button implementation
2. Implement primary, secondary, tertiary, and destructive variants
3. Implement small, medium, large, and hero sizes
4. Implement all interaction states
5. Preserve native button attributes and accessible names

### Phase 6: Form Components

1. Inspect existing Input, Textarea, Label, and Select components
2. Implement Input with native attributes and states
3. Implement Textarea with minimum height and native attributes
4. Determine Select implementation (native or existing primitive)
5. Implement label association, description, error, and validation states

### Phase 7: Card, Container, and Section

1. Implement standard and featured Card variants
2. Implement Container with responsive widths and padding
3. Implement Section with responsive vertical spacing
4. Preserve semantic HTML and accessibility

### Phase 8: Feedback Components

1. Implement Badge variants (neutral, success, warning, error, information)
2. Implement Skeleton with accessibility (hidden from AT, `aria-busy`)
3. Implement Toast with live regions, auto-dismiss pausing, and mobile behavior

### Phase 9: Dialog and Drawer

1. Inspect existing Dialog, Sheet, or Drawer primitives
2. Reuse existing approved accessible primitive
3. Implement Dialog focus management, dismissal, and overlay behavior
4. Implement Drawer with direction variants and reduced-motion support
5. Review mobile sizing and behavior

### Phase 10: Responsive and Accessibility Foundation

1. Implement focus-visible ring with amber token
2. Implement skip-link styling foundation
3. Verify keyboard operability across all components
4. Verify touch-target sizes
5. Review responsive behavior at all breakpoints
6. Check horizontal overflow prevention

### Phase 11: Public/CMS Styling Boundaries

1. Define public-site component styling guidance
2. Define CMS component styling guidance
3. Implement variant differences where needed
4. Document shared component reuse patterns

### Phase 12: Documentation and Verification

1. Document token architecture
2. Document font fallback behavior
3. Document component variants and styling boundaries
4. Run `npm run lint` and `npm run build`
5. Test all component states and accessibility
6. Review responsive behavior
7. Verify no scope expansion or undocumented changes

---

## Rollback Strategy

### Token Changes

- Maintain backward compatibility through CSS variable aliases
- Deprecate old token names gradually
- Document migration path for any renamed tokens

### Font Changes

- Fallback stacks ensure text remains visible
- No breaking changes when Satoshi files become available
- CSS variable approach allows font changes without component updates

### Component Changes

- Follow shadcn/ui patterns for incremental adoption
- No breaking API changes within the change
- Existing components can be updated incrementally

### Dependency Changes

- New dependencies are isolated and optional
- No removal of existing dependencies
- Fallback behavior when new packages are unavailable

### Verification Checkpoint

Before completing the change:
- All tokens match `docs/DESIGN_SYSTEM.md` values
- All components pass lint, build, and accessibility checks
- Responsive behavior verified at all breakpoints
- No scope expansion beyond design-system foundation

---

## Open Questions

### Resolved

- **Should we implement light mode tokens now or defer until needed?**
  Resolved: Defer. Preserve approved light-surface tokens for isolated use, but do not implement a complete application-wide light theme in this change.

- **What's the preferred approach for icon sizing tokens?**
  Resolved: Defer to icon implementation phase. Use Tailwind utilities and documented sizes from `docs/DESIGN_SYSTEM.md` for now.

### Unresolved

- **Should we use `next/font/google` or `next/font/local` for Inter?**
  Either approach is acceptable. The implementation should use the approach that best fits the project's privacy and performance requirements. Document the chosen approach.

- **Should we adopt existing shadcn/ui components as-is or customize them?**
  The implementation should inspect existing components first. Adopt them if they meet requirements, customize only when necessary for Stratifit-specific needs, and document any modifications.

- **What specific Radix primitives are already installed?**
  The implementation should inspect `package.json` and existing component code to determine which Radix primitives are available and should be reused.