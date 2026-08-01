## Why

The Stratifit Digital Agency platform needs a reusable design-system foundation before public pages, CMS interfaces, Supabase-backed editors, chat experiences, or other product features are implemented.

Phase 2 of `docs/ROADMAP.md` requires translating `docs/DESIGN_SYSTEM.md` into reusable code. Without this foundation, later UI work would risk inconsistent tokens, duplicated component patterns, accessibility regressions, unnecessary Client Components, and avoidable rework.

This change establishes the shared visual and interaction foundation for both the premium public website and the operational custom CMS.

## What Changes

- Implement centralized CSS custom properties and Tailwind CSS v4 theme mappings for the approved:
  - Core colors
  - Extended surfaces
  - Semantic colors
  - Amber and indigo scales
  - Light-surface tokens
  - Spacing
  - Radii
  - Shadows
  - Gradients
  - Typography
  - Layout widths
  - Motion durations
  - Motion easing
- Use only exact token values defined in `docs/DESIGN_SYSTEM.md`
- Keep the platform dark-mode-first
- Preserve approved light-surface tokens without implementing a complete application-wide light mode
- Configure Inter through an approved Next.js font-loading strategy
- Configure Satoshi through `next/font/local` only when properly licensed local files are available
- Provide a stable display-font fallback when Satoshi files are unavailable
- Prevent coding agents from downloading, generating, redistributing, or committing unverified font files
- Create foundational UI components:
  - Button
  - Input
  - Textarea
  - Select
  - Card
  - Container
  - Section
  - Badge
  - Skeleton
  - Toast
  - Dialog
  - Drawer
- Establish consistent component APIs with:
  - `className` support where appropriate
  - Native attributes appropriate to each underlying element
  - Ref forwarding where technically appropriate
  - `children` composition where relevant
  - Preserved accessible names and semantics
  - Minimal Client Component boundaries
- Add complete interaction states including:
  - Default
  - Hover
  - Active
  - Focus-visible
  - Disabled
  - Loading
  - Error
  - Open and closed states where relevant
- Implement accessibility behavior including:
  - Keyboard operability
  - Visible focus indicators
  - Logical focus order
  - Label and error association
  - Reduced-motion support
  - Dialog and Drawer focus management
  - Focus restoration
  - Configurable outside-click dismissal
  - Controlled body scrolling
  - Toast live-region behavior
  - Skeleton loading-region behavior
  - Touch-target support
  - Skip-link styling foundation
- Establish mobile-first responsive behavior for:
  - Containers
  - Section spacing
  - Typography
  - Component sizing
  - Dialogs
  - Drawers
  - Selects
  - Toast placement
  - Horizontal-overflow prevention
- Establish shared public-site and CMS styling boundaries:
  - Public UI may use larger display typography, richer composition, controlled amber glow, and more expressive approved motion
  - CMS UI remains Inter-dominant, neutral, restrained, and operational
- Reuse existing React, Tailwind CSS, shadcn/ui, Radix, and repository utilities before adding dependencies
- Prohibit duplicate component libraries and unapproved major dependencies
- Add verification requirements for:
  - `npm run lint`
  - `npm run build`
  - Project type checking when available
  - Keyboard navigation
  - Reduced-motion behavior
  - Dialog and Drawer focus management
  - Toast announcements
  - Skeleton accessibility
  - Mobile, tablet, and desktop review
  - Touch-target review
  - Client-boundary review
  - Token-value review
  - Dependency review
  - Font-license safeguards

## Capabilities

### New Capabilities

- `design-system-foundation`: Provides the shared design tokens, typography system, layout primitives, foundational UI components, accessibility behavior, responsive rules, and public-versus-CMS styling boundaries required by the Stratifit platform.

### Modified Capabilities

No existing capability is modified.

## Non-Goals

This change does not include:

- Announcement Bar
- Header
- Footer
- Homepage sections
- Page-specific layouts
- Section Registry
- CMS business logic
- CMS content editors
- Supabase database work
- Authentication
- Storage integration
- Lead forms
- AI chatbot
- AI FAQ
- Conversation management
- Resend email integration
- Analytics
- Deployment configuration
- Full application-wide light mode
- Page-specific GSAP timelines
- A second component library
- Arbitrary design-token editing

## Impact

- **Frontend architecture:** All future UI work will depend on the shared token and component foundation.
- **Public website:** Establishes the premium dark visual system, Satoshi-led display typography, amber brand accent, controlled indigo support, and expressive but accessible styling.
- **CMS:** Establishes an Inter-dominant, restrained, operational interface language using the same shared primitives.
- **Tailwind CSS:** Adds Tailwind CSS v4 theme mappings backed by centralized CSS custom properties.
- **Typography:** Introduces approved font roles, stable CSS variables, licensed Satoshi handling, and layout-shift-conscious loading.
- **Accessibility:** Builds keyboard, focus, reduced-motion, announcement, modal, loading, and touch-target behavior into the foundation.
- **Responsive design:** Establishes mobile-first layout, spacing, typography, and component behavior.
- **Component architecture:** Creates reusable primitives under the approved repository conventions while minimizing Client Components.
- **Dependency management:** Enforces existing-stack-first implementation and prevents duplicate UI systems.
- **Future delivery:** Reduces rework for homepage, CMS, forms, chat, and later platform features.
