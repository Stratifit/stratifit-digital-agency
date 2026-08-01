# design-system-foundation Specification

## Purpose

Provides the foundational design-system implementation for the Stratifit Digital Agency platform.

The capability establishes reusable design tokens, typography, layout primitives, interaction patterns, and foundational UI components for both the premium public website and the operational custom CMS.

This capability must follow:

- `AGENTS.md`
- `docs/PROJECT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/FRONTEND.md`
- `docs/CMS.md`
- `docs/ROADMAP.md`

## Requirements

### Requirement: Centralized design-token system

The system SHALL implement a centralized token system using CSS custom properties and Tailwind CSS v4 theme configuration.

The token system SHALL cover:

- Colors
- Spacing
- Typography
- Radii
- Shadows
- Gradients
- Motion durations
- Motion easing
- Layout widths
- Responsive spacing

Components SHALL use approved tokens rather than duplicate or arbitrary values.

#### Scenario: Core color-token availability

- **WHEN** a developer uses design-system color utilities
- **THEN** the system SHALL provide these approved core tokens:
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

#### Scenario: Extended color-token availability

- **WHEN** extended surface, semantic, accent-scale, overlay, text, or light-surface tokens are implemented
- **THEN** they SHALL use only the exact values defined in `docs/DESIGN_SYSTEM.md`
- **AND** the implementation SHALL not invent undocumented color values
- **AND** semantic colors for success, warning, error, and information SHALL use the exact approved values
- **AND** the secondary indigo accent SHALL remain visually subordinate to the primary amber accent

#### Scenario: Light-surface token scope

- **WHEN** approved light-surface tokens are implemented
- **THEN** they MAY be used for isolated light surfaces, previews, email-like areas, or approved components
- **AND** their presence SHALL NOT imply implementation of a complete application-wide light mode
- **AND** the Stratifit public website and CMS SHALL remain dark-mode-first in version 1

#### Scenario: Spacing-token availability

- **WHEN** a developer uses design-system spacing utilities
- **THEN** the system SHALL provide this approved 4px-based scale:
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

#### Scenario: Radius-token availability

- **WHEN** a component requires rounded corners
- **THEN** it SHALL use an approved radius token from `docs/DESIGN_SYSTEM.md`
- **AND** arbitrary radius values SHALL not be introduced when an approved token is suitable
- **AND** control, card, modal, and pill radii SHALL remain visually consistent

#### Scenario: Shadow-token availability

- **WHEN** a component requires elevation, separation, or glow
- **THEN** it SHALL use an approved shadow or glow token from `docs/DESIGN_SYSTEM.md`
- **AND** amber glow SHALL be used selectively
- **AND** public-site shadows MAY be richer than CMS shadows
- **AND** CMS shadows SHALL remain restrained and operational

#### Scenario: Gradient-token availability

- **WHEN** a component uses a gradient
- **THEN** it SHALL use an approved gradient token from `docs/DESIGN_SYSTEM.md`
- **AND** approved gradients MAY include primary, dark-surface, hero-ambient, AI-accent, and mixed-premium treatments
- **AND** gradients SHALL not be added purely as decoration without a documented design purpose

### Requirement: Typography system

The system SHALL implement Satoshi and Inter with clear role separation, stable fallbacks, and a Next.js-compatible loading strategy.

#### Scenario: Satoshi licensing and loading

- **WHEN** Satoshi is configured
- **THEN** local Satoshi font files SHALL be added only when the project has a valid license permitting their use
- **AND** coding agents SHALL not download, generate, redistribute, expose, or commit unverified font files
- **AND** Satoshi SHALL use `next/font/local` when licensed local files are available
- **AND** Satoshi SHALL expose the CSS variable `--font-display`

#### Scenario: Satoshi fallback

- **WHEN** licensed Satoshi files are unavailable
- **THEN** the design-system foundation SHALL continue using an approved fallback stack
- **AND** missing font files SHALL not block implementation
- **AND** no placeholder or unverified font file SHALL be added

#### Scenario: Inter loading

- **WHEN** Inter is configured
- **THEN** it SHALL use an approved Next.js font-loading strategy
- **AND** it SHALL expose the CSS variable `--font-sans`
- **AND** required weights and subsets SHALL be limited to those used by the application
- **AND** loading SHALL minimize layout shift

#### Scenario: Display typography

- **WHEN** hero headings, section headings, card titles, brand expressions, or large metrics are rendered
- **THEN** the system SHALL use the display font token associated with Satoshi or its approved fallback

#### Scenario: Interface typography

- **WHEN** body copy, navigation, buttons, forms, labels, tables, CMS content, or chat interfaces are rendered
- **THEN** the system SHALL use Inter through the sans-serif font token

#### Scenario: Typography-scale availability

- **WHEN** developers implement text hierarchy
- **THEN** the system SHALL provide approved display, heading, body, caption, and overline styles from `docs/DESIGN_SYSTEM.md`
- **AND** typography styles SHALL include approved font size, line height, weight, and letter spacing
- **AND** arbitrary typography values SHALL be avoided when an approved style exists

### Requirement: Motion-token system

The system SHALL implement centralized duration and easing tokens for CSS interaction and animation behavior.

#### Scenario: Motion-duration tokens

- **WHEN** animation or transition durations are required
- **THEN** the following approved tokens SHALL be available:
  - `motion-instant`: `120ms`
  - `motion-fast`: `200ms`
  - `motion-standard`: `350ms`
  - `motion-medium`: `500ms`
  - `motion-slow`: `800ms`
  - `motion-cinematic`: `1200ms`

#### Scenario: Motion-easing tokens

- **WHEN** animation easing is required
- **THEN** the following approved tokens SHALL be available:
  - `ease-standard`: `cubic-bezier(0.22, 1, 0.36, 1)`
  - `ease-in`: `cubic-bezier(0.4, 0, 1, 1)`
  - `ease-out`: `cubic-bezier(0, 0, 0.2, 1)`
  - `ease-in-out`: `cubic-bezier(0.4, 0, 0.2, 1)`

#### Scenario: Tokenized interaction motion

- **WHEN** a component changes between hover, focus, active, open, closed, loading, or disabled states
- **THEN** it SHALL use approved duration and easing tokens
- **AND** it SHALL not introduce arbitrary timing values without documented justification

#### Scenario: Reduced-motion behavior

- **WHEN** `prefers-reduced-motion: reduce` is enabled
- **THEN** non-essential movement SHALL be removed or simplified
- **AND** content SHALL remain visible
- **AND** all controls SHALL remain usable
- **AND** important state changes SHALL still be communicated
- **AND** motion SHALL not be required to understand content or complete an action

### Requirement: Core UI components

The system SHALL provide reusable foundational UI components with consistent APIs, interaction states, responsive behavior, and accessibility support.

Required components include:

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

#### Scenario: Button variants

- **WHEN** a Button is rendered
- **THEN** it SHALL support:
  - Primary
  - Secondary
  - Tertiary
  - Destructive
- **AND** it SHALL support:
  - Small
  - Medium
  - Large
  - Hero
- **AND** it SHALL include:
  - Default
  - Hover
  - Active
  - Focus-visible
  - Disabled
  - Loading

#### Scenario: Button semantics

- **WHEN** a Button is implemented
- **THEN** it SHALL accept native button attributes
- **AND** it SHALL support `className`
- **AND** it SHALL forward refs where technically appropriate
- **AND** loading state SHALL prevent duplicate activation
- **AND** icon-only buttons SHALL require an accessible name

#### Scenario: Form-control behavior

- **WHEN** Input, Textarea, or Select is rendered
- **THEN** each control SHALL accept native or primitive-specific attributes appropriate to its underlying element
- **AND** each control SHALL support:
  - Label association
  - Description text
  - Error message
  - Required state
  - Disabled state
  - Focus-visible state
  - Invalid state
- **AND** validation state SHALL not rely on color alone

#### Scenario: Input API

- **WHEN** an Input is implemented
- **THEN** it SHALL support native input attributes
- **AND** it SHALL support `className`
- **AND** it SHALL forward refs where appropriate

#### Scenario: Textarea API

- **WHEN** a Textarea is implemented
- **THEN** it SHALL support native textarea attributes
- **AND** it SHALL support `className`
- **AND** it SHALL forward refs where appropriate
- **AND** it SHALL use an approved minimum height

#### Scenario: Select API

- **WHEN** a Select is implemented
- **THEN** it SHALL use either the native select element or an approved accessible Select primitive already supported by the project
- **AND** it SHALL provide full keyboard navigation
- **AND** it SHALL preserve an accessible label and selected value
- **AND** it SHALL not introduce a new component library without approval

#### Scenario: Card variants

- **WHEN** a Card is rendered
- **THEN** it SHALL support standard and featured variants
- **AND** it SHALL use approved surface, border, radius, and shadow tokens
- **AND** it SHALL support `className`
- **AND** it SHALL forward refs where appropriate
- **AND** an interactive Card SHALL preserve correct keyboard and link semantics

### Requirement: Component API consistency

Foundational components SHALL follow consistent React and HTML composition patterns.

#### Scenario: Shared component API

- **WHEN** a foundational component is implemented
- **THEN** it SHALL support `className` where appropriate
- **AND** it SHALL accept native attributes appropriate to its underlying element
- **AND** it SHALL support `children` where composition applies
- **AND** it SHALL forward refs where technically appropriate
- **AND** it SHALL preserve accessible names and semantics
- **AND** it SHALL avoid custom prop names when a standard HTML attribute is suitable

#### Scenario: Client Component boundaries

- **WHEN** a component does not require browser state, event handlers, focus primitives, portals, or browser APIs
- **THEN** it SHALL remain compatible with Server Components
- **AND** the implementation SHALL not add `"use client"` unnecessarily
- **AND** client boundaries SHALL remain as small as practical

### Requirement: Container and Section primitives

The system SHALL provide Container and Section primitives for consistent page layout.

#### Scenario: Container behavior

- **WHEN** a Container is rendered
- **THEN** it SHALL apply approved maximum width and horizontal padding
- **AND** it SHALL adapt across mobile, tablet, and desktop breakpoints
- **AND** it SHALL support approved width variants where documented
- **AND** it SHALL prevent unintended horizontal overflow

#### Scenario: Section behavior

- **WHEN** a Section is rendered
- **THEN** it SHALL apply approved vertical spacing
- **AND** it SHALL support responsive spacing
- **AND** it SHALL preserve semantic HTML through an appropriate element or polymorphic API
- **AND** it SHALL not hardcode public marketing content

### Requirement: Feedback components

The system SHALL provide Badge, Skeleton, and Toast components with complete accessibility and interaction behavior.

#### Scenario: Badge variants

- **WHEN** a Badge is rendered
- **THEN** it SHALL support approved neutral, success, warning, error, and information variants
- **AND** each variant SHALL meet approved contrast requirements
- **AND** status meaning SHALL not rely on color alone when additional context is necessary

#### Scenario: Skeleton behavior

- **WHEN** a loading placeholder is shown
- **THEN** Skeleton elements SHALL preserve the expected layout
- **AND** decorative Skeleton elements SHALL be hidden from assistive technology
- **AND** the surrounding loading region SHALL expose an appropriate loading state through `aria-busy`, visually hidden text, or another approved pattern
- **AND** Skeleton animation SHALL respect reduced-motion preferences
- **AND** Skeletons SHALL avoid flashing or aggressive pulsing

#### Scenario: Toast announcement behavior

- **WHEN** an informational or success Toast appears
- **THEN** it SHALL use an appropriate polite live region

#### Scenario: Urgent Toast behavior

- **WHEN** an urgent error Toast appears
- **THEN** it MAY use an assertive announcement
- **AND** critical messages SHALL remain available until dismissed or acknowledged

#### Scenario: Toast interaction

- **WHEN** a Toast supports auto-dismiss
- **THEN** timing SHALL pause while the Toast is hovered or keyboard-focused
- **AND** dismissal SHALL be keyboard accessible
- **AND** the Toast SHALL not steal focus unnecessarily
- **AND** Toast placement SHALL not obstruct important mobile controls

### Requirement: Dialog and Drawer components

The system SHALL implement accessible Dialog and Drawer primitives using existing approved project capabilities.

#### Scenario: Dialog opening

- **WHEN** a Dialog opens
- **THEN** focus SHALL move into the Dialog
- **AND** focus SHALL remain trapped while it is modal
- **AND** background content SHALL not be keyboard-accessible
- **AND** body scrolling SHALL be controlled
- **AND** an accessible title SHALL be supported
- **AND** an accessible description SHALL be supported

#### Scenario: Dialog dismissal

- **WHEN** Dialog dismissal is enabled
- **THEN** Escape dismissal SHALL work
- **AND** outside-click dismissal SHALL be explicitly configurable
- **AND** focus SHALL return to the trigger after closing
- **AND** overlay behavior SHALL be consistent and testable

#### Scenario: Drawer opening

- **WHEN** a Drawer opens
- **THEN** focus SHALL move into the Drawer
- **AND** focus SHALL remain trapped while it is modal
- **AND** background content SHALL not be keyboard-accessible
- **AND** body scrolling SHALL be controlled
- **AND** an accessible title SHALL be supported
- **AND** an accessible description SHALL be supported

#### Scenario: Drawer dismissal and direction

- **WHEN** Drawer dismissal is enabled
- **THEN** Escape dismissal SHALL work
- **AND** outside-click dismissal SHALL be explicitly configurable
- **AND** focus SHALL return to the trigger after closing
- **AND** direction SHALL be limited to approved variants
- **AND** slide motion SHALL respect reduced-motion preferences

### Requirement: Accessibility foundation

The system SHALL establish accessibility behavior for foundational components and layouts.

#### Scenario: Focus-visible styling

- **WHEN** an interactive element receives keyboard focus
- **THEN** it SHALL show a visible token-based focus indicator
- **AND** the default focus indicator SHALL use the primary amber token
- **AND** it SHALL remain visible against all approved backgrounds
- **AND** focus indication SHALL not rely on browser outline removal without replacement

#### Scenario: Keyboard operability

- **WHEN** a user navigates using a keyboard
- **THEN** every interactive component SHALL be reachable and operable
- **AND** focus order SHALL be logical
- **AND** custom controls SHALL support expected keyboard behavior

#### Scenario: Skip-link foundation

- **WHEN** the global public or CMS layout is implemented
- **THEN** it SHALL support a visible-on-focus skip link to the main content
- **AND** this design-system phase SHALL provide the required styling foundation

#### Scenario: Touch targets

- **WHEN** an interactive control is used on a touch viewport
- **THEN** its target size SHALL follow the minimum target guidance defined in `docs/DESIGN_SYSTEM.md`
- **AND** adjacent controls SHALL have adequate separation

### Requirement: Responsive design foundation

The system SHALL implement mobile-first responsive behavior.

#### Scenario: Breakpoint support

- **WHEN** foundational components are rendered at different viewport widths
- **THEN** they SHALL support the approved Tailwind breakpoints:
  - `sm`
  - `md`
  - `lg`
  - `xl`
  - `2xl`
- **AND** responsive behavior SHALL be mobile-first

#### Scenario: Responsive typography

- **WHEN** typography scales across viewports
- **THEN** it SHALL use approved responsive values or fluid sizing rules from `docs/DESIGN_SYSTEM.md`
- **AND** text SHALL remain readable
- **AND** headings SHALL avoid overflow and unintended clipping

#### Scenario: Responsive spacing

- **WHEN** section or component spacing changes across breakpoints
- **THEN** it SHALL use approved spacing tokens
- **AND** it SHALL preserve hierarchy without excessive empty space on mobile

#### Scenario: Overflow prevention

- **WHEN** foundational components render on narrow viewports
- **THEN** they SHALL avoid unintended horizontal page overflow
- **AND** long text, controls, and dialogs SHALL remain usable

### Requirement: Public website and CMS styling boundaries

The system SHALL establish distinct but related styling behavior for the public website and CMS.

#### Scenario: Public-site styling

- **WHEN** a component is rendered in the public website
- **THEN** it MAY use:
  - Larger Satoshi-led typography
  - Richer composition
  - Controlled amber glow
  - Limited indigo accents
  - More expressive approved motion
- **AND** visual expression SHALL not reduce readability, accessibility, or performance

#### Scenario: CMS styling

- **WHEN** a component is rendered in the CMS
- **THEN** Inter SHALL remain the dominant font
- **AND** surfaces SHALL remain neutral and operational
- **AND** shadows and glows SHALL be restrained
- **AND** motion SHALL remain minimal
- **AND** forms, statuses, tables, and actions SHALL prioritize clarity

#### Scenario: Shared component reuse

- **WHEN** a foundational component is used in both public and CMS contexts
- **THEN** context differences SHALL be implemented through approved variants, composition, or surrounding layout styles
- **AND** separate duplicate component libraries SHALL not be created

### Requirement: Dependency control

The implementation SHALL use the approved stack and existing dependencies before introducing additional packages.

#### Scenario: Existing capabilities first

- **WHEN** foundational component behavior is required
- **THEN** the implementation SHALL first inspect and use existing:
  - React
  - Tailwind CSS
  - shadcn/ui
  - Radix primitives already installed
  - Existing project utilities

#### Scenario: New dependency consideration

- **WHEN** a new package appears necessary
- **THEN** the implementation SHALL document why the current stack is insufficient
- **AND** no major dependency SHALL be added without explicit approval
- **AND** duplicate component libraries SHALL not be introduced
- **AND** a package SHALL not be added merely to implement a trivial utility

### Requirement: Verification and testing

The implementation SHALL be verified before the change is considered complete.

#### Scenario: Code-quality verification

- **WHEN** implementation is complete
- **THEN** `npm run lint` SHALL pass without errors
- **AND** `npm run build` SHALL pass without errors
- **AND** any project-specific type-check command SHALL pass when available

#### Scenario: Component-state verification

- **WHEN** foundational components are reviewed
- **THEN** default, hover, active, focus-visible, disabled, loading, error, and open states SHALL be tested where applicable

#### Scenario: Accessibility verification

- **WHEN** interactive components are implemented
- **THEN** keyboard navigation SHALL be tested
- **AND** reduced-motion behavior SHALL be tested
- **AND** Dialog and Drawer focus management SHALL be tested
- **AND** Toast live-region behavior SHALL be tested
- **AND** Skeleton accessibility behavior SHALL be tested
- **AND** accessible names and labels SHALL be reviewed

#### Scenario: Responsive verification

- **WHEN** foundational components are complete
- **THEN** mobile, tablet, and desktop layouts SHALL be reviewed
- **AND** touch targets SHALL be reviewed
- **AND** unintended horizontal overflow SHALL be checked
- **AND** Dialog, Drawer, Select, and Toast behavior SHALL be reviewed on mobile

#### Scenario: Architecture compliance verification

- **WHEN** implementation is complete
- **THEN** Client Component boundaries SHALL remain minimal
- **AND** no unapproved dependencies SHALL have been added
- **AND** no undocumented design tokens SHALL have been introduced
- **AND** no unverified font files SHALL have been downloaded or committed
- **AND** no Supabase, CMS business logic, homepage sections, chat, email, or deployment work SHALL have been added as part of this change
