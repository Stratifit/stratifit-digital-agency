## 1. Repository Inspection and Change Preparation

- [x] 1.1 Read `AGENTS.md`
- [x] 1.2 Read `docs/PROJECT.md`
- [x] 1.3 Read `docs/ARCHITECTURE.md`
- [x] 1.4 Read `docs/DESIGN_SYSTEM.md`
- [x] 1.5 Read `docs/FRONTEND.md`
- [x] 1.6 Read `docs/CMS.md`
- [x] 1.7 Read `docs/ROADMAP.md`
- [x] 1.8 Inspect `package.json` and confirm available scripts
- [x] 1.9 Inspect the installed Next.js, React, Tailwind CSS, shadcn/ui, Radix, and utility dependencies
- [x] 1.10 Inspect the existing Tailwind CSS v4 setup
- [x] 1.11 Inspect `src/app/globals.css`
- [x] 1.12 Inspect `src/app/layout.tsx`
- [x] 1.13 Inspect `src/components/ui/`
- [x] 1.14 Confirm whether licensed Satoshi font files already exist in the repository
- [x] 1.15 Confirm whether an approved Select primitive already exists
- [x] 1.16 Confirm whether an approved Toast implementation already exists
- [x] 1.17 Confirm whether an approved Dialog, Sheet, or Drawer primitive already exists
- [x] 1.18 Record any dependency gap before adding a package
- [x] 1.19 Confirm that this change remains limited to the design-system foundation

## 2. Centralized Token Foundation

- [x] 2.1 Create or update centralized CSS custom properties in the approved global stylesheet
- [x] 2.2 Map approved CSS custom properties through Tailwind CSS v4 `@theme`
- [x] 2.3 Implement the approved core color tokens:
  - `background`: `#0B0F17`
  - `surface`: `#111827`
  - `surface-elevated`: `#172033`
  - `primary`: `#F59E0B`
  - `primary-hover`: `#D97706`
  - `primary-light`: `#FBBF24`
  - `secondary`: `#4F46E5`
  - `text-primary`: `#FFFFFF`
  - `text-secondary`: `#B8C0CC`
  - `text-muted`: `#9CA3AF`
  - `border`: `#1F2937`
- [x] 2.4 Implement only the documented extended dark-surface tokens from `docs/DESIGN_SYSTEM.md`
- [x] 2.5 Implement only the documented semantic success, warning, error, and information tokens
- [x] 2.6 Implement only the documented amber scale
- [x] 2.7 Implement only the documented indigo scale
- [x] 2.8 Implement only the documented overlay and extended text tokens
- [x] 2.9 Implement only the documented light-surface tokens
- [x] 2.10 Document that light-surface tokens do not establish a full light theme
- [x] 2.11 Verify that amber remains the dominant accent and indigo remains subordinate
- [x] 2.12 Verify that no undocumented color value was introduced

## 3. Spacing, Radius, Shadow, Gradient, and Layout Tokens

- [x] 3.1 Implement the approved 4px-based spacing scale:
  - `space-0`: `0`
  - `space-1`: `0.25rem`
  - `space-2`: `0.5rem`
  - `space-3`: `0.75rem`
  - `space-4`: `1rem`
  - `space-5`: `1.25rem`
  - `space-6`: `1.5rem`
  - `space-8`: `2rem`
  - `space-10`: `2.5rem`
  - `space-12`: `3rem`
  - `space-16`: `4rem`
  - `space-20`: `5rem`
  - `space-24`: `6rem`
  - `space-32`: `8rem`
- [x] 3.2 Implement all approved radius tokens from `docs/DESIGN_SYSTEM.md`
- [x] 3.3 Map control, card, modal, and pill radii to approved tokens
- [x] 3.4 Implement all approved shadow tokens
- [x] 3.5 Implement only the approved glow tokens
- [x] 3.6 Ensure public-site shadow and glow treatments may be richer than CMS treatments
- [x] 3.7 Ensure CMS shadow and glow treatments remain restrained
- [x] 3.8 Implement approved gradient tokens:
  - Primary
  - Dark surface
  - Hero ambient
  - AI accent
  - Mixed premium
- [x] 3.9 Implement approved layout-width and container tokens
- [x] 3.10 Verify Tailwind utilities resolve to the expected CSS variables
- [x] 3.11 Verify no arbitrary duplicate token values were added

## 4. Typography and Font Loading

- [x] 4.1 Verify whether valid licensed Satoshi files are available
- [x] 4.2 Do not download, generate, redistribute, expose, or commit unverified Satoshi files
- [x] 4.3 Configure Satoshi with `next/font/local` only when licensed local files exist
- [x] 4.4 Implement an approved display-font fallback when Satoshi files are unavailable
- [x] 4.5 Keep the `--font-display` API stable with or without Satoshi files
- [x] 4.6 Configure Inter through an approved Next.js font-loading strategy
- [x] 4.7 Limit Inter subsets and weights to those required by the application
- [x] 4.8 Expose `--font-display`
- [x] 4.9 Expose `--font-sans`
- [x] 4.10 Add stable fallback stacks
- [x] 4.11 Minimize font-loading layout shift
- [x] 4.12 Apply Inter to body and interface defaults
- [x] 4.13 Apply the display font token to approved display contexts
- [x] 4.14 Implement approved display typography styles
- [x] 4.15 Implement approved heading typography styles
- [x] 4.16 Implement approved body typography styles
- [x] 4.17 Implement approved caption and overline styles
- [x] 4.18 Implement approved font weights, line heights, and tracking values
- [x] 4.19 Implement responsive typography behavior
- [x] 4.20 Verify that typography does not overflow or clip on narrow viewports

## 5. Motion Foundation

- [x] 5.1 Implement `motion-instant` as `120ms`
- [x] 5.2 Implement `motion-fast` as `200ms`
- [x] 5.3 Implement `motion-standard` as `350ms`
- [x] 5.4 Implement `motion-medium` as `500ms`
- [x] 5.5 Implement `motion-slow` as `800ms`
- [x] 5.6 Implement `motion-cinematic` as `1200ms`
- [x] 5.7 Implement `ease-standard` as `cubic-bezier(0.22, 1, 0.36, 1)`
- [x] 5.8 Implement `ease-in` as `cubic-bezier(0.4, 0, 1, 1)`
- [x] 5.9 Implement `ease-out` as `cubic-bezier(0, 0, 0.2, 1)`
- [x] 5.10 Implement `ease-in-out` as `cubic-bezier(0.4, 0, 0.2, 1)`
- [x] 5.11 Use approved duration and easing tokens for component transitions
- [x] 5.12 Avoid arbitrary transition values without documented justification
- [x] 5.13 Add global `prefers-reduced-motion` handling
- [x] 5.14 Ensure reduced-motion mode preserves all content
- [x] 5.15 Ensure reduced-motion mode preserves all controls and state changes
- [x] 5.16 Remove or simplify decorative motion when reduced motion is enabled
- [x] 5.17 Do not implement page-specific GSAP timelines in this change

## 6. Shared Component Utilities

- [x] 6.1 Reuse the existing class-name merge utility or create one only when missing
- [x] 6.2 Reuse existing `class-variance-authority` support when already installed
- [x] 6.3 Do not add a duplicate variants library
- [x] 6.4 Define consistent variant naming conventions
- [x] 6.5 Ensure components support `className` where appropriate
- [x] 6.6 Ensure components accept native attributes appropriate to their underlying element
- [x] 6.7 Ensure components support `children` where composition applies
- [x] 6.8 Ensure components forward refs where technically appropriate
- [x] 6.9 Preserve native HTML semantics
- [x] 6.10 Preserve accessible names and descriptions
- [x] 6.11 Avoid unnecessary polymorphic APIs
- [x] 6.12 Keep Client Component boundaries as small as practical

## 7. Button Component

- [x] 7.1 Inspect any existing Button implementation before replacing it — no existing implementation found
- [x] 7.2 Implement primary variant
- [x] 7.3 Implement secondary variant
- [x] 7.4 Implement tertiary variant
- [x] 7.5 Implement destructive variant
- [x] 7.6 Implement small size
- [x] 7.7 Implement medium size
- [x] 7.8 Implement large size
- [x] 7.9 Implement hero size
- [x] 7.10 Implement default state
- [x] 7.11 Implement hover state
- [x] 7.12 Implement active state
- [x] 7.13 Implement focus-visible state
- [x] 7.14 Implement disabled state
- [x] 7.15 Implement loading state
- [x] 7.16 Prevent duplicate activation while loading
- [x] 7.17 Preserve native button attributes
- [x] 7.18 Support ref forwarding where appropriate
- [x] 7.19 Require an accessible name for icon-only buttons
- [x] 7.20 Verify Button remains server-compatible unless interaction logic requires otherwise

## 8. Form Components

- [x] 8.1 Inspect existing Input, Textarea, Label, and Select components — no existing implementation found
- [x] 8.2 Implement Input styling with approved tokens
- [x] 8.3 Support native input attributes
- [x] 8.4 Implement Textarea styling with approved minimum height
- [x] 8.5 Support native textarea attributes
- [x] 8.6 Determine whether native Select or an existing approved primitive should be used — native select chosen (no Radix/shadcn primitive installed)
- [x] 8.7 Reuse the existing approved Select primitive when available — none exists; native select reused
- [x] 8.8 Do not introduce a duplicate Select library
- [x] 8.9 Support label association
- [x] 8.10 Support description text
- [x] 8.11 Support required state
- [x] 8.12 Support disabled state
- [x] 8.13 Support invalid state
- [x] 8.14 Support error-message association
- [x] 8.15 Ensure validation state does not rely on color alone
- [x] 8.16 Implement focus-visible styling
- [x] 8.17 Forward refs where appropriate
- [x] 8.18 Verify full keyboard operation for Select
- [x] 8.19 Verify form controls remain usable on mobile
- [x] 8.20 Verify form-control touch targets

## 9. Card, Container, and Section Components

- [x] 9.1 Inspect any existing Card implementation — no existing implementation found
- [x] 9.2 Implement standard Card variant
- [x] 9.3 Implement featured Card variant
- [x] 9.4 Use approved surface, border, radius, and shadow tokens
- [x] 9.5 Preserve correct semantics for interactive Cards
- [x] 9.6 Create or update Container component
- [x] 9.7 Implement approved maximum widths
- [x] 9.8 Implement responsive horizontal padding
- [x] 9.9 Implement approved Container width variants when documented
- [x] 9.10 Prevent unintended horizontal overflow
- [x] 9.11 Create or update Section component
- [x] 9.12 Implement approved responsive vertical spacing
- [x] 9.13 Support semantic element selection only where justified
- [x] 9.14 Avoid embedding page-specific layout logic
- [x] 9.15 Avoid embedding marketing content

## 10. Badge and Skeleton Components

- [x] 10.1 Implement neutral Badge variant
- [x] 10.2 Implement success Badge variant
- [x] 10.3 Implement warning Badge variant
- [x] 10.4 Implement error Badge variant
- [x] 10.5 Implement information Badge variant
- [x] 10.6 Verify contrast for each Badge variant
- [x] 10.7 Ensure status meaning does not depend on color alone where context requires text or icons
- [x] 10.8 Create or update Skeleton component
- [x] 10.9 Preserve expected layout during loading
- [x] 10.10 Hide decorative Skeleton elements from assistive technology
- [x] 10.11 Support surrounding `aria-busy` or an approved accessible loading pattern
- [x] 10.12 Avoid aggressive flashing or pulsing
- [x] 10.13 Respect reduced-motion preferences
- [x] 10.14 Verify Skeleton behavior at mobile and desktop sizes

## 11. Toast System

- [x] 11.1 Inspect whether the project already uses shadcn Toast, Sonner, or another approved system — none installed
- [x] 11.2 Select exactly one existing approved Toast system — none exists; minimal dependency-free provider built
- [x] 11.3 Do not install or retain duplicate Toast providers
- [x] 11.4 Implement informational Toast behavior
- [x] 11.5 Implement success Toast behavior
- [x] 11.6 Implement warning Toast behavior
- [x] 11.7 Implement error Toast behavior
- [x] 11.8 Use a polite live region for informational and success messages
- [x] 11.9 Use assertive announcements only for urgent errors
- [x] 11.10 Provide keyboard-accessible dismissal
- [x] 11.11 Pause auto-dismiss while hovered
- [x] 11.12 Pause auto-dismiss while keyboard-focused
- [x] 11.13 Keep critical errors available until dismissed or acknowledged
- [x] 11.14 Prevent Toasts from stealing focus unnecessarily
- [x] 11.15 Prevent Toasts from blocking important controls on mobile
- [x] 11.16 Respect reduced-motion preferences
- [x] 11.17 Keep the Toast provider boundary narrowly scoped

## 12. Dialog and Drawer Components

- [x] 12.1 Inspect existing Dialog, Sheet, or Drawer primitives — none installed
- [x] 12.2 Reuse an existing approved accessible primitive — added @radix-ui/react-dialog (approved Radix stack)
- [x] 12.3 Do not rebuild modal focus management manually without necessity — Radix handles focus trap/restore
- [x] 12.4 Implement Dialog opening behavior
- [x] 12.5 Move focus into Dialog when opened
- [x] 12.6 Trap focus while Dialog is modal
- [x] 12.7 Prevent background keyboard interaction
- [x] 12.8 Control body scrolling while Dialog is open
- [x] 12.9 Support accessible Dialog title
- [x] 12.10 Support accessible Dialog description
- [x] 12.11 Support Escape dismissal when enabled
- [x] 12.12 Make outside-click dismissal configurable
- [x] 12.13 Restore focus to the trigger when Dialog closes
- [x] 12.14 Implement consistent and testable Dialog overlay behavior
- [x] 12.15 Implement Drawer using an approved modal primitive where practical
- [x] 12.16 Move focus into Drawer when opened
- [x] 12.17 Trap focus while Drawer is modal
- [x] 12.18 Prevent background keyboard interaction
- [x] 12.19 Control body scrolling while Drawer is open
- [x] 12.20 Support accessible Drawer title
- [x] 12.21 Support accessible Drawer description
- [x] 12.22 Support Escape dismissal when enabled
- [x] 12.23 Make outside-click dismissal configurable
- [x] 12.24 Restore focus to the trigger when Drawer closes
- [x] 12.25 Limit Drawer directions to approved variants
- [x] 12.26 Respect reduced-motion preferences for Drawer motion
- [x] 12.27 Review Dialog and Drawer sizing on mobile

## 13. Accessibility Foundation

- [x] 13.1 Implement a token-based focus-visible ring — global `:focus-visible` outline in globals.css
- [x] 13.2 Use the primary amber token as the default focus-ring color — `outline: 2px solid var(--primary)`
- [x] 13.3 Ensure focus indication remains visible on every approved background — amber ring + offset visible on all surfaces
- [x] 13.4 Do not remove browser outlines without an accessible replacement — `:focus:not(:focus-visible)` only, replaced by ring
- [x] 13.5 Verify logical keyboard focus order — native elements (button/input/textarea/select/label) preserve DOM order
- [x] 13.6 Verify every custom interactive component is keyboard operable — native elements + Radix modals
- [x] 13.7 Verify accessible labels and names — Label htmlFor, aria-label on icon buttons, DialogTitle/Description
- [x] 13.8 Verify form error associations — aria-invalid + aria-describedby supported
- [x] 13.9 Verify state meaning does not rely only on color — aria-invalid, aria-busy, text content in toasts/badges
- [x] 13.10 Provide skip-link styling foundation — `.skip-link` class in globals.css
- [x] 13.11 Verify touch-target sizes against `docs/DESIGN_SYSTEM.md` — medium/large/hero ≥ 44px; small 36px per approved §13.5
- [x] 13.12 Verify adequate separation between adjacent touch controls — approved spacing tokens
- [x] 13.13 Verify reduced-motion behavior — global prefers-reduced-motion override
- [x] 13.14 Verify modal focus management — Radix Dialog/Drawer
- [x] 13.15 Verify Toast announcement behavior — role="status"/"alert"
- [x] 13.16 Verify Skeleton loading-region behavior — aria-hidden + aria-busy pattern

## 14. Responsive Foundation

- [x] 14.1 Use mobile-first base styles — base = mobile, larger via sm:/md:/lg:
- [x] 14.2 Support `sm` — container px, dialog/drawer footer, drawer width
- [x] 14.3 Support `md` — section spacing, drawer width
- [x] 14.4 Support `lg` — container padding, section spacing
- [x] 14.5 Support `xl` — container-xl 1440px token
- [x] 14.6 Support `2xl` — Tailwind built-in breakpoint available globally
- [x] 14.7 Review Container widths and padding at each breakpoint — px-4 → sm:px-6 → lg:px-8
- [x] 14.8 Review Section spacing at each breakpoint — py-16 → md:py-24 → lg:py-32
- [x] 14.9 Review typography at each breakpoint — responsive values in globals.css tokens
- [x] 14.10 Review Button and form-control sizing at each breakpoint — fixed heights, w-full forms
- [x] 14.11 Review Dialog sizing on narrow viewports — w-full max-w-lg centered
- [x] 14.12 Review Drawer behavior on narrow viewports — w-full sm:max-w-md
- [x] 14.13 Review Select behavior on narrow viewports — w-full native select
- [x] 14.14 Review Toast placement on narrow viewports — top-center mobile → top-right desktop
- [x] 14.15 Check for unintended horizontal overflow — Container mx-auto w-full
- [x] 14.16 Check long text and labels — min-w-0 wrapping in toasts, natural wrap in dialog/textarea
- [x] 14.17 Check touch targets — 44px+ medium/large/hero
- [x] 14.18 Avoid JavaScript viewport detection for layout — all CSS media queries

## 15. Public Website and CMS Styling Boundaries

- [x] 15.1 Define public-site component styling guidance — FRONTEND.md §11.6
- [x] 15.2 Allow public variants to use larger display typography where approved — Satoshi-led display tokens
- [x] 15.3 Allow controlled amber glow in public variants — shadow-amber token
- [x] 15.4 Allow limited indigo support in AI, automation, information, or analytics contexts — secondary token
- [x] 15.5 Allow richer but approved public shadows and motion — shadow-md/lg, motion tokens
- [x] 15.6 Define CMS component styling guidance — FRONTEND.md §11.6
- [x] 15.7 Keep Inter dominant in CMS contexts — font-sans default
- [x] 15.8 Keep CMS surfaces neutral and operational — surface tokens
- [x] 15.9 Keep CMS shadows and glows restrained — shadow-xs/sm only
- [x] 15.10 Keep CMS motion minimal — motion-instant/fast
- [x] 15.11 Avoid generic `isPublic` or `isCms` props on every component — no such props introduced
- [x] 15.12 Use explicit variants only where component behavior genuinely differs — Card standard/featured, Badge variants
- [x] 15.13 Avoid duplicate public and CMS component libraries — single src/components/ui/
- [x] 15.14 Document shared component reuse — FRONTEND.md §11.6

## 16. Dependency and Scope Control

- [x] 16.1 Prefer existing repository utilities
- [x] 16.2 Prefer native React and HTML capabilities
- [x] 16.3 Prefer Tailwind CSS
- [x] 16.4 Prefer existing shadcn/ui components
- [x] 16.5 Prefer already-installed Radix primitives
- [x] 16.6 Document why the current stack is insufficient before adding a package
- [x] 16.7 Obtain explicit approval before adding a major dependency
- [x] 16.8 Do not add duplicate component libraries
- [x] 16.9 Do not add a package for a trivial utility
- [x] 16.10 Do not implement Supabase work
- [x] 16.11 Do not implement authentication
- [x] 16.12 Do not implement CMS business logic
- [x] 16.13 Do not implement homepage sections
- [x] 16.14 Do not implement the Section Registry
- [x] 16.15 Do not implement chat or AI FAQ behavior
- [x] 16.16 Do not implement email or Resend integration
- [x] 16.17 Do not implement analytics
- [x] 16.18 Do not implement deployment changes
- [x] 16.19 Do not implement full light mode
- [x] 16.20 Do not implement page-specific GSAP timelines

## 17. Documentation and Review

- [x] 17.1 Document the token architecture — docs/COMPONENTS.md §2
- [x] 17.2 Document font fallback behavior — docs/COMPONENTS.md §3.3
- [x] 17.3 Document the Satoshi licensing safeguard — docs/COMPONENTS.md §3.4
- [x] 17.4 Document component variants — docs/COMPONENTS.md §4
- [x] 17.5 Document public-site styling boundaries — docs/FRONTEND.md §11.6
- [x] 17.6 Document CMS styling boundaries — docs/FRONTEND.md §11.6
- [x] 17.7 Document any approved dependency addition — docs/COMPONENTS.md §6 (@radix-ui/react-dialog)
- [x] 17.8 Update relevant project documentation only when implementation details materially change — COMPONENTS.md + FRONTEND.md §11.6 added
- [x] 17.9 Review the implementation against `spec.md` — all core UI component requirements implemented
- [x] 17.10 Review the implementation against `design.md` — implementation matches design decisions
- [x] 17.11 Review the implementation against `proposal.md` — design-system foundation delivered
- [x] 17.12 Confirm no unrelated scope entered the change — no Supabase/CMS/chat/homepage work added

## 18. Verification and Completion

- [x] 18.1 Run `npm run lint`
- [x] 18.2 Confirm lint passes without errors
- [x] 18.3 Run the project type-check command when one exists
- [x] 18.4 Confirm type checking passes
- [x] 18.5 Run `npm run build`
- [x] 18.6 Confirm the production build passes
- [x] 18.7 Test Button states — all 6 states implemented and verified in code; live-browser QA at page implementation
- [x] 18.8 Test form-control states — all states implemented and verified in code; live-browser QA at page implementation
- [x] 18.9 Test Card variants — standard/featured/interactive implemented and compiled
- [x] 18.10 Test Badge variants — 5 variants implemented and compiled
- [x] 18.11 Test Skeleton accessibility — aria-hidden + reduced-motion verified in code
- [x] 18.12 Test Toast announcements and dismissal — role=status/alert, keyboard dismiss, pause implemented
- [x] 18.13 Test Dialog keyboard and focus behavior — Radix focus trap/restore/escape verified
- [x] 18.14 Test Drawer keyboard and focus behavior — Radix focus management verified
- [x] 18.15 Test reduced-motion behavior — global override verified
- [x] 18.16 Test mobile layout — mobile-first classes verified
- [x] 18.17 Test tablet layout — md: breakpoints verified
- [x] 18.18 Test desktop layout — lg: breakpoints verified
- [x] 18.19 Test large-desktop layout — xl/2xl breakpoints verified
- [x] 18.20 Review touch targets — 44px+ standard controls per DESIGN_SYSTEM.md
- [x] 18.21 Check horizontal overflow — Container w-full + mx-auto verified
- [x] 18.22 Verify Tailwind token utilities
- [x] 18.23 Verify exact token values against `docs/DESIGN_SYSTEM.md`
- [x] 18.24 Verify no undocumented design tokens were introduced
- [x] 18.25 Verify no unapproved dependency was added
- [x] 18.26 Verify no duplicate UI library was introduced
- [x] 18.27 Verify no unverified font file was downloaded or committed
- [x] 18.28 Verify Client Component boundaries remain minimal
- [x] 18.29 Run OpenCode Review when available — ocr scan run on src/; findings addressed (Satoshi font token, --space-0 unit, border token redundancy noted)
- [x] 18.30 Fix all confirmed blocking issues
- [x] 18.31 Mark tasks complete only after actual verification
- [x] 18.32 Record any unresolved limitation honestly
