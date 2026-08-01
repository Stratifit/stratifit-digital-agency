# DESIGN_SYSTEM.md — Stratifit Digital Agency Platform

**Project:** Stratifit Digital Agency  
**Document type:** Visual and interaction design system  
**Status:** Initial approved design specification  
**Primary references:** `docs/PROJECT.md`, `docs/ARCHITECTURE.md`

---

## 1. Purpose

This document defines the visual design system for the Stratifit Digital Agency public website and custom CMS.

It establishes the approved rules for:

- Brand expression
- Color usage
- Typography
- Spacing
- Layout
- Grid behavior
- Border radii
- Borders
- Shadows
- Gradients
- Buttons
- Cards
- Forms
- Navigation
- Data tables
- Status colors
- Responsive behavior
- Accessibility
- GSAP animation
- Public website styling
- CMS styling
- AI-generated UI code

All visual components must follow this document.

The design system should make Stratifit feel:

- Premium
- Modern
- Sophisticated
- Technical
- Trustworthy
- Focused
- Distinctive
- Calm
- High quality

The design system should not feel:

- Cheap
- Overdecorated
- Inconsistent
- Noisy
- Excessively futuristic
- Difficult to use
- Dependent on animation
- Limited to luxury brands

---

## 2. Design Principles

### 2.1 Premium through restraint

Premium design should come from:

- Strong hierarchy
- Excellent spacing
- Refined typography
- Consistent alignment
- Purposeful contrast
- Controlled motion
- High-quality content
- Deliberate detail

Premium design should not depend on:

- Excessive glow
- Constant animation
- Too many gradients
- Decorative clutter
- Oversized shadows
- Too many accent colors
- Unnecessary glass effects

### 2.2 Clarity before decoration

Content and actions must remain easy to understand.

Visual effects must never reduce:

- Readability
- Navigation clarity
- Form usability
- Accessibility
- Performance
- Mobile usability

### 2.3 Consistency across systems

The public website and CMS share the same brand foundation.

They do not use the same visual intensity.

The public website may feel more expressive and cinematic.

The CMS should feel calmer, more structured, and more operational.

### 2.4 Token-first implementation

Approved tokens must be used by default.

Arbitrary values may be used only when:

- No approved token solves the requirement
- The value is technically justified
- It is reviewed
- It does not duplicate an existing token
- It is promoted to a token when reused

### 2.5 Responsive by design

Responsive behavior must be intentional.

A desktop design must not simply be compressed into a mobile viewport.

Each section should define:

- Mobile hierarchy
- Tablet behavior
- Desktop behavior
- Content wrapping
- Image behavior
- Animation reduction
- Touch interaction

### 2.6 Accessibility is part of quality

Accessibility must be built into:

- Color contrast
- Typography
- Focus states
- Keyboard interaction
- Motion behavior
- Form feedback
- Navigation
- Status indicators
- Media content

---

## 3. Brand Identity

### 3.1 Brand character

Stratifit’s visual identity combines:

- Deep navy and charcoal surfaces
- Warm amber highlights
- Controlled indigo support accents
- Strong geometric structure
- Spacious layout
- High-contrast typography
- Premium motion
- Technical precision

### 3.2 Brand impression

The visual identity should communicate:

- Strategic thinking
- Technical competence
- Reliability
- Modern execution
- Professional confidence
- Digital sophistication

### 3.3 Main visual formula

```text
Deep navy foundation
+
Warm amber identity
+
White typography
+
Controlled indigo support
+
Satoshi display typography
+
Inter interface typography
+
Purposeful GSAP motion
```

---

## 4. Color System

### 4.1 Core brand colors

| Token | Value | Primary usage |
|---|---:|---|
| `background` | `#0A0A0A` | Main public page background |
| `background-deep` | `#070A10` | Very dark cinematic areas |
| `surface` | `#111827` | Section surfaces, cards, navigation |
| `surface-soft` | `#151E2D` | Soft section separation |
| `surface-elevated` | `#182235` | Elevated cards, modal surfaces |
| `surface-hover` | `#1D293B` | Hovered dark cards |
| `surface-active` | `#243249` | Selected admin controls |
| `primary` | `#F59E0B` | Main amber brand accent |
| `primary-hover` | `#E89008` | Amber hover state |
| `primary-active` | `#D97706` | Amber pressed state |
| `primary-light` | `#FBBF24` | Highlights and subtle gradient endpoints |
| `primary-dark` | `#B45309` | Deep amber accents |
| `secondary` | `#4F46E5` | Controlled indigo support accent |
| `secondary-hover` | `#4338CA` | Indigo hover state |
| `secondary-light` | `#6366F1` | Indigo highlights |
| `text-primary` | `#FFFFFF` | Main text on dark surfaces |
| `text-secondary` | `#B8C0CC` | Supporting text |
| `text-muted` | `#9CA3AF` | Metadata, captions, quiet labels |
| `text-subtle` | `#6B7280` | Disabled or very low-emphasis text |
| `border` | `#1F2937` | Default structural border |
| `border-soft` | `#18212F` | Subtle dividers |
| `border-strong` | `#2B374A` | Emphasized borders |

### 4.2 Extended dark surfaces

| Token | Value | Usage |
|---|---:|---|
| `background-deep` | `#070A10` | Very dark cinematic areas |
| `surface-soft` | `#151E2D` | Soft section separation |
| `surface-hover` | `#1D293B` | Hovered dark cards |
| `surface-active` | `#243249` | Selected admin controls |
| `overlay` | `rgba(7, 10, 16, 0.72)` | Modal and drawer overlays |
| `overlay-strong` | `rgba(7, 10, 16, 0.88)` | Strong modal overlays |

### 4.3 Text colors

| Token | Value | Usage |
|---|---:|---|
| `text-primary` | `#FFFFFF` | Headings and primary body copy |
| `text-secondary` | `#B8C0CC` | Paragraphs and supporting copy |
| `text-muted` | `#9CA3AF` | Metadata and labels |
| `text-subtle` | `#6B7280` | Disabled or very low-emphasis text |
| `text-inverse` | `#0B0F17` | Text on amber or light backgrounds |

### 4.4 Primary amber scale

| Token | Value |
|---|---:|
| `amber-50` | `#FFFBEB` |
| `amber-100` | `#FEF3C7` |
| `amber-200` | `#FDE68A` |
| `amber-300` | `#FCD34D` |
| `amber-400` | `#FBBF24` |
| `amber-500` | `#F59E0B` |
| `amber-600` | `#D97706` |
| `amber-700` | `#B45309` |
| `amber-800` | `#92400E` |
| `amber-900` | `#78350F` |

Primary brand usage should center on:

- `amber-500`
- `amber-600`
- `amber-400`

### 4.5 Secondary indigo scale

| Token | Value |
|---|---:|
| `indigo-100` | `#E0E7FF` |
| `indigo-300` | `#A5B4FC` |
| `indigo-500` | `#6366F1` |
| `indigo-600` | `#4F46E5` |
| `indigo-700` | `#4338CA` |

Indigo should be used selectively for:

- AI features
- Automation
- Data visualization
- Informational states
- Secondary badges
- Small gradient accents

Indigo must not compete with amber as the main brand identity.

### 4.6 Semantic colors

| Role | Base | Soft background | Border |
|---|---:|---:|---:|
| Success | `#22C55E` | `rgba(34,197,94,0.12)` | `rgba(34,197,94,0.35)` |
| Warning | `#F59E0B` | `rgba(245,158,11,0.12)` | `rgba(245,158,11,0.35)` |
| Error | `#EF4444` | `rgba(239,68,68,0.12)` | `rgba(239,68,68,0.35)` |
| Info | `#4F46E5` | `rgba(79,70,229,0.12)` | `rgba(79,70,229,0.35)` |

Semantic states must not rely on color alone.

Use:

- Icons
- Labels
- Text
- Borders
- Status badges

### 4.7 Light surfaces

The project is dark-mode-first.

Light surfaces may be used selectively for:

- Editorial sections
- Case-study contrast
- Print-friendly views
- Specific CMS documents
- Inverted callouts

| Token | Value |
|---|---:|
| `light-background` | `#FFFFFF` |
| `light-surface` | `#F8FAFC` |
| `light-surface-muted` | `#F1F5F9` |
| `light-text` | `#0B0F17` |
| `light-text-secondary` | `#475569` |
| `light-border` | `#E2E8F0` |

Light mode should not be introduced inconsistently across random components.

### 4.8 Card interaction states

Cards use a defined interaction model across the public site.

| State | Background | Border | Other |
|---|---:|---:|---|
| Default | `#161616` (`card-dark`) | `1px solid #1C1C1C` | — |
| Hover | `#161616` | `rgba(245,158,11,0.25)` | `translateY(-2px)` |
| Active / press | `#141414` | `rgba(245,158,11,0.40)` | Back to neutral (no lift) |
| Focus (keyboard) | — | — | `outline: 2px solid rgba(245,158,11,0.60)`, `offset: 2px` |
| Disabled | `#1A1A1A` | `rgba(255,255,255,0.05)` | `opacity: 0.6`, `cursor: not-allowed` |

---

## 5. Color Usage Rules

### 5.1 Amber

Use amber for:

- Primary CTAs
- Active navigation indicators
- Key highlighted words
- Important metrics
- Selected states
- Brand accents
- Focus details
- Premium decorative elements

Do not use amber for:

- Long body text
- Large page backgrounds
- Every icon
- Every border
- Every heading
- Decorative overload

### 5.2 Indigo

Use indigo for:

- AI indicators
- Automation labels
- Secondary analytics
- Informational badges
- Supporting chart series

Do not use indigo as:

- Main CTA color
- Main logo color
- Dominant page accent
- Replacement for amber

### 5.3 White

White is the primary high-contrast text color.

Avoid pure white for all secondary text.

Use secondary and muted text tokens to create hierarchy.

### 5.4 Contrast

Text contrast must meet WCAG expectations.

Important UI states must remain distinguishable under:

- Low brightness
- Different displays
- Color-vision deficiencies
- Reduced transparency

---

## 6. Typography System

### 6.1 Font families

Stratifit uses two approved font families:

#### Satoshi

Use for:

- Hero headings
- Major section headings
- Card titles
- Large statistics
- Portfolio titles
- Brand wordmark
- Premium marketing statements

#### Inter

Use for:

- Body copy
- Navigation
- Buttons
- Forms
- Inputs
- Tables
- Labels
- Admin dashboard
- Chat interface
- Metadata
- Long-form reading

Principle:

> Satoshi provides brand personality. Inter provides readability and usability.

### 6.2 Font loading

Fonts should be loaded through a reliable Next.js-compatible approach.

Preferred order:

1. Approved local font assets
2. Approved package-based font integration
3. Trusted hosted source

Font loading must:

- Avoid layout shift
- Use appropriate fallback stacks
- Preload only necessary weights
- Avoid loading unused styles

### 6.3 Font stacks

```css
--font-display: "Satoshi", "Inter", system-ui, sans-serif;
--font-sans: "Inter", system-ui, sans-serif;
```

### 6.4 Display scale

| Token | Mobile | Desktop | Weight | Line height |
|---|---:|---:|---:|---:|
| `display-xl` | `3rem` | `5.5rem` | 700–900 | 0.95–1.0 |
| `display-lg` | `2.5rem` | `4.5rem` | 700–900 | 0.98–1.05 |
| `display-md` | `2rem` | `3.5rem` | 700 | 1.0–1.1 |
| `display-sm` | `1.75rem` | `2.75rem` | 600–700 | 1.05–1.15 |

Use fluid sizing where appropriate.

Example:

```css
font-size: clamp(3rem, 7vw, 5.5rem);
```

### 6.5 Heading scale

| Element | Mobile | Desktop | Weight |
|---|---:|---:|---:|
| `h1` | `2.75rem` | `5rem` | 700–900 |
| `h2` | `2.125rem` | `3.75rem` | 700 |
| `h3` | `1.5rem` | `2.25rem` | 600–700 |
| `h4` | `1.25rem` | `1.5rem` | 600 |
| `h5` | `1.125rem` | `1.25rem` | 600 |
| `h6` | `1rem` | `1.125rem` | 600 |

### 6.6 Body scale

| Token | Size | Line height | Usage |
|---|---:|---:|---|
| `body-lg` | `1.125rem` | 1.7 | Lead paragraphs |
| `body-md` | `1rem` | 1.65 | Standard body copy |
| `body-sm` | `0.875rem` | 1.55 | Supporting text |
| `caption` | `0.75rem` | 1.45 | Metadata |
| `overline` | `0.75rem` | 1.2 | Section labels |

### 6.7 Tracking

Use tighter tracking for large Satoshi headings.

Use normal tracking for body text.

Use wider tracking only for:

- Overlines
- Labels
- Small uppercase navigation details
- Premium microcopy

Avoid excessive letter spacing on long text.

### 6.8 Line length

Recommended readable line length:

- Body copy: 55–75 characters
- Lead copy: 45–65 characters
- CMS form help text: 45–70 characters

---

## 7. Spacing System

### 7.1 Base scale

The spacing system follows a controlled 4px foundation.

| Token | Value |
|---|---:|
| `space-0` | `0` |
| `space-1` | `0.25rem` |
| `space-2` | `0.5rem` |
| `space-3` | `0.75rem` |
| `space-4` | `1rem` |
| `space-5` | `1.25rem` |
| `space-6` | `1.5rem` |
| `space-8` | `2rem` |
| `space-10` | `2.5rem` |
| `space-12` | `3rem` |
| `space-16` | `4rem` |
| `space-20` | `5rem` |
| `space-24` | `6rem` |
| `space-32` | `8rem` |

### 7.2 Section spacing

Recommended public section padding:

| Breakpoint | Vertical padding |
|---|---:|
| Mobile | 64–80px |
| Tablet | 80–112px |
| Desktop | 112–160px |

Hero sections may use larger spacing.

CMS sections should use smaller, more operational spacing.

### 7.3 Component spacing

Recommended values:

- Input label to input: 8px
- Input to help text: 6–8px
- Form field gap: 20–24px
- Card internal padding: 20–32px
- Card grid gap: 20–32px
- Section title to body: 16–24px
- Section header to content grid: 40–64px

### 7.4 Spacing rules

Avoid:

- Unexplained single-use pixel values
- Inconsistent card padding
- Different gaps for visually identical components
- Excessively compressed mobile spacing

---

## 8. Layout and Grid

### 8.1 Content width

Recommended container widths:

| Token | Width |
|---|---:|
| `container-sm` | `768px` |
| `container-md` | `1024px` |
| `container-lg` | `1280px` |
| `container-xl` | `1440px` |

The main public site should generally use:

```text
max-width: 1280px to 1440px
```

### 8.2 Horizontal padding

| Breakpoint | Padding |
|---|---:|
| Mobile | 16–20px |
| Tablet | 24–32px |
| Desktop | 40–64px |

### 8.3 Grid

Use a 12-column conceptual grid on desktop.

Recommended patterns:

- 12-column hero
- 3-column service grid
- 2-column editorial layout
- 4-column metric grid
- 8/4 or 7/5 split layouts

Mobile usually collapses to one column.

Tablet may use two columns.

### 8.4 Alignment

Use consistent:

- Left edges
- Baselines
- Card heights
- Section title positions
- Content widths
- Button alignment

Avoid centering every section.

Use centered layouts only when they strengthen the message.

---

## 9. Border Radius System

| Token | Value | Usage |
|---|---:|---|
| `radius-none` | `0px` | Full-bleed layouts |
| `radius-xs` | `4px` | Small labels |
| `radius-sm` | `8px` | Inputs, small buttons |
| `radius-md` | `12px` | Standard cards |
| `radius-lg` | `16px` | Prominent cards |
| `radius-xl` | `24px` | Hero media, major panels |
| `radius-full` | `9999px` | Pills, avatars |

Public site cards may use 12–24px radii.

CMS controls should usually use 8–12px radii.

Avoid mixing many radius values in one area.

---

## 10. Border System

### 10.1 Default borders

```text
Default border: #1F2937
Subtle border: rgba(255,255,255,0.06)
Interactive border: rgba(245,158,11,0.35)
Focus border: #F59E0B
```

### 10.2 Border rules

Borders should:

- Clarify structure
- Improve state visibility
- Separate data
- Support forms
- Remain subtle

Avoid bright borders on every card.

---

## 11. Shadow System

### 11.1 Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.18)` | Inputs and small controls |
| `shadow-sm` | `0 6px 20px rgba(0,0,0,0.22)` | Cards |
| `shadow-md` | `0 16px 48px rgba(0,0,0,0.30)` | Floating panels |
| `shadow-lg` | `0 28px 80px rgba(0,0,0,0.38)` | Modals and hero media |
| `shadow-amber` | `0 0 40px rgba(245,158,11,0.20)` | Select premium accents |
| `shadow-indigo` | `0 0 36px rgba(79,70,229,0.18)` | AI support accents |

### 11.2 Shadow rules

Use glows sparingly.

A glow should emphasize:

- One primary CTA
- One important visual
- A selected AI feature
- A hero accent

Avoid glowing every card.

---

## 12. Gradient System

### 12.1 Approved gradients

#### Primary amber gradient

```css
linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)
```

#### Dark surface gradient

```css
linear-gradient(180deg, #111827 0%, #0A0A0A 100%)
```

#### Hero ambient glow

```css
radial-gradient(
  circle at 70% 20%,
  rgba(245, 158, 11, 0.14) 0%,
  rgba(245, 158, 11, 0.04) 35%,
  transparent 70%
)
```

#### AI accent gradient

```css
linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)
```

#### Mixed premium accent

```css
linear-gradient(135deg, #F59E0B 0%, #FBBF24 55%, #4F46E5 140%)
```

Use the mixed gradient only in selected branded moments.

### 12.2 Gradient rules

Do not:

- Use gradients for long body text
- Use multiple unrelated gradients in one section
- Apply animated gradients everywhere
- Reduce text contrast

---

## 13. Button System

### 13.1 Primary button

Use for the main action.

Examples:

- Start Your Project
- Book a Strategy Call
- Save Changes
- Publish

Style:

- Amber background
- Dark text
- Medium or semibold Inter
- Strong focus state
- Clear hover
- Clear disabled state

### 13.2 Secondary button

Use for supporting actions.

Style:

- Transparent or dark surface
- Subtle border
- White or secondary text
- Amber hover border or text

### 13.3 Tertiary button

Use for low-emphasis actions.

Style:

- No filled background
- Text and icon
- Underline or arrow movement on hover

### 13.4 Destructive button

Use only for destructive actions.

Style:

- Red semantic treatment
- Explicit wording
- Confirmation for high-risk actions

### 13.5 Button sizes

| Size | Height | Horizontal padding |
|---|---:|---:|
| Small | 36px | 14px |
| Medium | 44px | 18px |
| Large | 52px | 24px |
| Hero | 56–60px | 28–32px |

### 13.6 Button states

Every button must define:

- Default
- Hover
- Active
- Focus-visible
- Disabled
- Loading

Loading buttons should preserve width.

---

## 14. Card System

### 14.1 Standard card

Use for:

- Services
- Portfolio previews
- Insights
- Admin summaries

Style:

- Surface background
- Subtle border
- 12–16px radius
- Controlled shadow
- Clear internal hierarchy

### 14.2 Featured card

Use for:

- Primary service
- Highlighted case study
- Premium CTA
- Important dashboard item

May include:

- Amber accent border
- Soft glow
- Stronger elevation
- Larger padding

### 14.3 Interactive card

Interactive cards must show:

- Hover state
- Focus-visible state
- Click affordance
- Consistent motion
- Keyboard accessibility

### 14.4 Card rules

Avoid:

- Excessively nested cards
- Different padding without reason
- Too much text
- Decorative borders on every card
- Hover effects that shift layout

---

## 15. Form System

### 15.1 Input structure

Each field should include:

- Label
- Required marker when needed
- Input control
- Help text when useful
- Error message when invalid

### 15.2 Input styling

Inputs should use:

- Inter
- Dark neutral background
- Clear border
- Strong focus ring
- Adequate height
- Readable placeholder
- Visible disabled state

### 15.3 Input heights

- Standard input: 44–48px
- Large public form input: 52px
- Textarea minimum: 120px
- Compact CMS control: 36–40px when appropriate

### 15.4 Error states

Error states must include:

- Red border
- Error icon when helpful
- Clear text
- Specific guidance

Do not rely only on red color.

### 15.5 Success states

Use clear confirmation for:

- Saved
- Published
- Uploaded
- Sent
- Updated

### 15.6 Form layout

Public forms should feel spacious.

CMS forms should prioritize scanning and efficient editing.

---

## 16. Navigation System

### 16.1 Public header

The public header should:

- Remain clear
- Use strong spacing
- Support desktop and mobile
- Make the primary CTA obvious
- Avoid too many links
- Support language switching
- Support chat access

### 16.2 Header states

Possible states:

- Transparent over hero
- Solid or blurred after scroll
- Mobile drawer open
- Active navigation item

### 16.3 CMS navigation

CMS navigation should prioritize:

- Clear categories
- Predictable placement
- Active item visibility
- Keyboard accessibility
- Collapsible behavior
- Responsive usability

---

## 17. Iconography

Use Lucide Icons as the primary icon system.

Rules:

- Use consistent stroke width
- Avoid mixing unrelated icon libraries
- Use icons to support meaning
- Do not replace every label with an icon
- Provide accessible labels for icon-only buttons

Recommended sizes:

- 16px for compact controls
- 18–20px for standard UI
- 24px for cards
- 32px+ only for feature illustrations

---

## 18. Media and Image Treatment

Images should use:

- Consistent aspect ratios
- High-quality compression
- Meaningful alt text
- Intentional cropping
- Responsive loading
- Strong fallback states

Portfolio images may use:

- 16:10
- 4:3
- 3:2

Insight images may use:

- 16:9
- 3:2

Team portraits may use:

- 4:5
- 1:1

Avoid arbitrary aspect ratios within one collection.

---

## 19. Public Website Styling

The public website may use:

- Large Satoshi headings
- Strong visual storytelling
- More GSAP motion
- Refined glows
- Layered dark surfaces
- Controlled indigo accents
- Editorial layouts
- Premium transitions
- More visual depth

The public website must still feel:

- Fast
- Readable
- Accessible
- Focused
- Trustworthy

### 19.1 Public section rhythm

Recommended structure:

```text
Overline
Heading
Supporting paragraph
Primary action
Main content
Optional proof or metric
```

### 19.2 Public visual limits

Avoid:

- More than one major glow focal point per viewport
- More than two accent colors in one section
- Excessive animated text
- Long paragraphs centered on desktop
- Too many full-height sections
- Repetitive card grids

---

## 20. CMS Styling

The CMS should use:

- Inter as the dominant font
- Neutral surfaces
- Strong form readability
- Clear status colors
- Reduced visual effects
- Smaller spacing than the public site
- Consistent tables
- Predictable forms
- Clear save and publish states

Satoshi may be used for:

- Main dashboard page titles
- High-level section titles
- Selected brand moments

### 20.1 CMS priorities

The CMS must prioritize:

- Clarity
- Stability
- Speed
- Confidence
- Error prevention
- Non-technical usability

### 20.2 CMS visual limits

Avoid:

- Cinematic motion
- Excessive glows
- Oversized typography
- Decorative gradients in forms
- Low-contrast controls
- Hidden actions
- Unclear save states

---

## 21. Table and Data Display System

Tables should include:

- Clear header hierarchy
- Row hover
- Keyboard focus
- Empty states
- Loading states
- Error states
- Pagination when needed
- Responsive fallback

On mobile, tables may transform into:

- Cards
- Stacked rows
- Horizontal scroll
- Priority columns

Do not shrink table content until it becomes unreadable.

---

## 22. Badge and Status System

Badges should communicate status clearly.

Suggested statuses:

- Draft
- Published
- Hidden
- Waiting
- Active
- Resolved
- Archived
- Error
- AI handling
- Human handling

Badges should use:

- Text
- Semantic color
- Optional icon
- Controlled background
- Controlled border

---

## 23. Responsive System

### 23.1 Breakpoint intent

Use Tailwind breakpoints as a base.

Suggested interpretation:

| Breakpoint | Intent |
|---|---|
| Base | Small mobile |
| `sm` | Large mobile |
| `md` | Tablet |
| `lg` | Laptop |
| `xl` | Desktop |
| `2xl` | Large desktop |

### 23.2 Mobile rules

On mobile:

- Use one primary column
- Keep tap targets at least 44px
- Reduce decorative motion
- Avoid hover-dependent interactions
- Prevent horizontal overflow
- Use shorter line lengths
- Stack CTAs where needed
- Prioritize essential content
- Keep floating UI from covering content

### 23.3 Tablet rules

On tablet:

- Use one or two columns
- Preserve generous spacing
- Avoid desktop-only navigation assumptions
- Test landscape and portrait

### 23.4 Desktop rules

On desktop:

- Use stronger grid composition
- Preserve readable content width
- Avoid excessive empty space
- Use large typography responsibly
- Keep main content centered in approved containers

### 23.5 Large desktop rules

Large screens should not simply stretch content.

Use:

- Maximum widths
- Strong grids
- Controlled text line lengths
- Balanced negative space

---

## 24. Accessibility Rules

### 24.1 Keyboard

All interactive elements must be keyboard accessible.

### 24.2 Focus

Use strong `focus-visible` styles.

Recommended focus treatment:

- Amber ring
- 2px or greater visible outline
- Adequate offset
- Clear contrast

### 24.3 Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Reduced-motion mode should:

- Remove non-essential movement
- Preserve content visibility
- Keep important state changes understandable
- Avoid long smooth scrolling

### 24.4 Contrast

Text and controls must meet appropriate contrast.

Muted text must still remain readable.

### 24.5 Labels

Inputs require visible labels unless an accessible equivalent exists.

### 24.6 Icons

Icon-only controls require accessible names.

### 24.7 Media

Images require meaningful alt text where appropriate.

Decorative images should use empty alt text.

---

## 25. Motion System

### 25.1 Motion principles

Motion should:

- Support hierarchy
- Explain relationships
- Guide attention
- Improve perceived quality
- Remain subtle
- Respect user preferences

Motion should not:

- Delay interaction
- Hide content unnecessarily
- Cause dizziness
- Reduce performance
- Become the main reason a section exists

### 25.2 Duration tokens

| Token | Duration | Usage |
|---|---:|---|
| `motion-instant` | 120ms | Press and micro feedback |
| `motion-fast` | 200ms | Hover and focus transitions |
| `motion-standard` | 350ms | UI reveals |
| `motion-medium` | 500ms | Card and section entrances |
| `motion-slow` | 800ms | Hero timelines |
| `motion-cinematic` | 1200ms | Rare major storytelling moments |

### 25.3 Easing tokens

CSS easing:

```text
ease-standard: cubic-bezier(0.22, 1, 0.36, 1)
ease-in: cubic-bezier(0.4, 0, 1, 1)
ease-out: cubic-bezier(0, 0, 0.2, 1)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

GSAP easing:

```text
power2.out
power3.out
power2.inOut
expo.out
```

Use `expo.out` sparingly.

### 25.4 Animation presets

Approved conceptual presets:

- Fade up
- Fade in
- Staggered reveal
- Clip reveal
- Soft scale
- Horizontal slide
- Counter reveal
- Line draw
- Image parallax
- Section pinning when justified

### 25.5 GSAP rules

Always:

- Use `useGSAP()` or `gsap.context()`
- Clean up timelines
- Clean up ScrollTriggers
- Scope selectors
- Prefer transforms and opacity
- Avoid layout thrashing
- Test Strict Mode
- Test mobile
- Respect reduced motion

### 25.6 CMS motion

CMS motion should be limited to:

- Drawer transitions
- Modal transitions
- Toasts
- Save feedback
- Validation feedback
- Expand/collapse
- Navigation state

---

## 26. Interaction States

Every interactive component should define:

- Default
- Hover
- Active
- Focus-visible
- Disabled
- Loading
- Error
- Success when relevant

States must be consistent.

Do not invent new state behavior per component without reason.

---

## 27. Loading States

Use:

- Skeletons
- Progress indicators
- Button spinners
- Inline status text
- Optimistic feedback when safe

Loading states should:

- Preserve layout
- Avoid flashing
- Avoid disabling unrelated actions
- Communicate what is happening

---

## 28. Empty States

Empty states should explain:

- What is missing
- Why it matters
- What action to take

Example:

```text
No portfolio projects yet.
Create your first project to display it on the website.
```

Avoid empty blank panels.

---

## 29. Error States

Error messages should be:

- Specific
- Human-readable
- Actionable
- Safe
- Visible near the problem

Do not expose:

- Stack traces
- Raw database errors
- Internal API details
- Secrets

---

## 30. Design Tokens in Code

The implementation should use centralized tokens.

Possible locations:

```text
src/app/globals.css
src/config/design-tokens.ts
src/lib/motion/tokens.ts
```

For Tailwind CSS v4, theme tokens may be defined through CSS variables and `@theme`.

Example concept:

```css
:root {
  --color-background: #0b0f17;
  --color-surface: #111827;
  --color-surface-elevated: #182235;
  --color-primary: #f59e0b;
  --color-primary-hover: #e89008;
  --color-primary-active: #d97706;
  --color-secondary: #4f46e5;
  --color-text-primary: #ffffff;
  --color-text-secondary: #b8c0cc;
  --color-text-muted: #9ca3af;
  --color-border: #1f2937;
}
```

The exact implementation should match the installed Tailwind version.

---

## 31. CMS-Controlled Presentation

The CMS may control approved presentation choices such as:

- Section visibility
- Approved section variant
- Approved alignment
- Approved media position
- Approved background mode
- Approved accent mode
- Approved animation preset
- Approved animation intensity
- Approved content width

The CMS must not allow:

- Raw CSS
- Raw JavaScript
- Arbitrary classes
- Arbitrary HTML
- Arbitrary GSAP code
- Arbitrary color values
- Arbitrary font families
- Arbitrary spacing values

---

## 32. AI Code Generation Rules

OpenCode, GLM-5.2, and other coding agents must:

1. Read this file before generating UI.
2. Use Satoshi and Inter according to their roles.
3. Use approved tokens.
4. Avoid hardcoded editable content.
5. Avoid arbitrary styling unless justified.
6. Reuse approved components.
7. Follow responsive rules.
8. Respect reduced motion.
9. Include accessible focus states.
10. Avoid introducing new colors without approval.
11. Avoid mixing icon libraries.
12. Avoid adding visual dependencies without approval.
13. Keep public and CMS styling appropriately different.
14. Run lint, type checks, and build after changes.

AI-generated code must not silently redefine the design system.

---

## 33. Design Review Checklist

Before approving a component, confirm:

### Brand

- Does it feel like Stratifit?
- Is amber still the dominant accent?
- Is indigo used selectively?
- Are Satoshi and Inter used correctly?

### Layout

- Is spacing consistent?
- Is alignment clear?
- Is text width readable?
- Does it work on mobile?

### Interaction

- Are hover and focus states present?
- Are touch targets large enough?
- Is loading handled?
- Are errors clear?

### Accessibility

- Is contrast sufficient?
- Is keyboard navigation supported?
- Is reduced motion respected?
- Are labels and alt text present?

### Motion

- Does animation improve the experience?
- Is it performant?
- Is it cleaned up correctly?
- Is it reduced on mobile when needed?

### CMS

- Is the interface easy for non-technical users?
- Are save states clear?
- Are destructive actions safe?
- Is the design calm and operational?

---

## 34. Governance

Changes to the design system require:

1. A clear reason
2. Review against existing tokens
3. An OpenSpec change when significant
4. Updates to this document
5. Updates to code tokens
6. Review of affected components
7. OpenCode Review
8. Lint and production build checks

Repeated visual exceptions indicate a missing token or component rule.

---

## 35. Definition of Design-System Completion

The initial design system is successfully implemented when:

- Core colors are centralized
- Satoshi and Inter are loaded correctly
- Public and CMS typography roles are clear
- Spacing is consistent
- Buttons are standardized
- Cards are standardized
- Forms are standardized
- Focus states are accessible
- Motion tokens exist
- Reduced motion works
- Public sections follow the same visual language
- CMS screens feel consistent
- AI-generated UI follows the approved rules
- Arbitrary visual drift is controlled

---

## 36. Related Documentation

Read this document with:

```text
docs/PROJECT.md
docs/ARCHITECTURE.md
docs/FRONTEND.md
docs/CMS.md
AGENTS.md
```

Feature-specific design changes should be documented through OpenSpec.

---

## 37. Design System Summary

Stratifit uses a premium dark visual system based on:

- Background `#0A0A0A`
- Surface `#111827`
- Elevated surface `#182235`
- Amber primary `#F59E0B`
- Indigo secondary `#4F46E5`
- White primary text
- Satoshi display typography
- Inter body and UI typography
- Controlled gradients
- Restrained glows
- Strong spacing
- Clear responsive behavior
- Accessible interaction
- Purposeful GSAP motion

The public website may be expressive and cinematic.

The CMS must remain calm, clear, and easy to use.

The system should look more professional through consistency and restraint, not through excessive decoration.
