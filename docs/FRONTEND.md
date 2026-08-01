# FRONTEND.md — Stratifit Digital Agency Platform

**Project:** Stratifit Digital Agency  
**Document type:** Public frontend implementation specification  
**Status:** Initial approved frontend specification  
**Primary references:** `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`

---

## 1. Purpose

This document defines how the public-facing Stratifit website should be implemented.

It covers:

- Public routes
- Page composition
- Supabase-driven content
- Section rendering
- Section Registry usage
- Multilingual behavior
- Responsive layouts
- Design-system application
- Typography usage
- Animation behavior
- Loading states
- Error states
- Accessibility
- SEO
- Performance
- Forms
- Chat integration
- CMS preview compatibility

The public website must look premium while remaining fast, readable, accessible, and easy to maintain.

---

## 2. Frontend Goals

The frontend must:

- Create immediate trust
- Demonstrate Stratifit’s design and development quality
- Clearly communicate services
- Showcase work and expertise
- Generate leads
- Support multilingual content
- Read editable content from Supabase
- Avoid hardcoded editable marketing content
- Render consistently across devices
- Preserve strong performance
- Support future CMS updates without frontend rewrites

The frontend should make visitors feel that Stratifit can deliver the same level of quality for their business.

---

## 3. Core Frontend Stack

The public frontend uses:

- Next.js 16
- React 19
- TypeScript
- App Router
- React Server Components
- Client Components only where required
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- GSAP
- Zod
- Supabase
- Vercel

React Hook Form is used for interactive forms where appropriate.

---

## 4. Public Route Structure

Initial public routes:

```text
/
/services
/work
/work/[slug]
/insights
/insights/[slug]
/about
/acquisition
/contact
/privacy
/imprint
```

Optional future routes may include:

```text
/case-studies
/case-studies/[slug]
/resources
/resources/[slug]
/book
```

Routes must be intentional.

The project should not use a general catch-all page builder in version 1.

---

## 5. Public Page Responsibilities

### 5.1 Home

The homepage must:

- Establish the brand
- Communicate the main value proposition
- Show core services
- Explain the process
- Differentiate Stratifit
- Demonstrate expertise
- Show selected work
- Present testimonials
- Address objections
- Guide visitors toward contact

### 5.2 Services

The services page must:

- Present the four core service categories
- Explain outcomes
- Show deliverables
- Connect services to relevant work
- Support service-specific CTAs
- Support SEO metadata
- Support multilingual content

### 5.3 Work

The work page must:

- Show selected portfolio projects
- Support category filtering when approved
- Display strong project imagery
- Link to project detail pages
- Show measurable outcomes where available

### 5.4 Work detail

A work detail page should support:

- Project title
- Client or brand
- Service categories
- Summary
- Challenge
- Approach
- Solution
- Deliverables
- Results
- Image gallery
- Testimonial
- CTA
- SEO metadata

### 5.5 Insights

The insights page must:

- Show published articles
- Support categories or tags when approved
- Present reading metadata
- Support pagination
- Link to article detail pages

### 5.6 Insight detail

An insight page should support:

- Title
- Excerpt
- Author
- Publication date
- Reading time
- Featured image
- Structured body content
- Related articles
- CTA
- SEO metadata

### 5.7 About

The About page should communicate:

- Stratifit’s purpose
- Values
- Approach
- Experience
- Team or founder information
- Capabilities
- CTA

### 5.8 Acquisition

The Acquisition page should explain:

- Buy-a-business service or initiative
- Who it is for
- Process
- Qualification criteria
- Enquiry form
- Privacy information
- CTA

### 5.9 Contact

The Contact page should include:

- Clear enquiry form
- Contact details
- Expected response guidance
- Service selection
- Language preference
- Consent text
- Chat access
- Confirmation state

### 5.10 Legal pages

Legal pages must:

- Be readable
- Use suitable line length
- Support versioning when needed
- Avoid excessive animation
- Preserve proper semantic heading structure

---

## 6. Homepage and Global Layout Order

The complete homepage rendering order for version 1 is:

1. Announcement Bar
2. Header / Navigation
3. Hero
4. Trusted By
5. Services
6. Process
7. Why Choose Us
8. Insights & Expertise
9. Portfolio
10. Acquisition — Buy a Business
11. Testimonials
12. Pricing
13. FAQ
14. Final CTA
15. Footer

The Announcement Bar, Header / Navigation, and Footer are global layout components.

The primary homepage content sections are:

1. Hero
2. Trusted By
3. Services
4. Process
5. Why Choose Us
6. Insights & Expertise
7. Portfolio
8. Acquisition — Buy a Business
9. Testimonials
10. Pricing
11. FAQ
12. Final CTA

The order is fixed for version 1.

Drag-and-drop section ordering is not required.

The Announcement Bar may be hidden when it is disabled or when no active announcement exists.

The Header / Navigation and Footer must remain available across all approved public pages.

The frontend must render this approved sequence consistently.

---

## 7. Homepage Section Requirements

### 7.1 Hero

The Hero should include:

- Eyebrow or category label
- Primary heading
- Supporting description
- Primary CTA
- Secondary CTA
- Optional trust metrics
- Optional visual or animated system
- Optional background media
- Chat access where appropriate

The Hero should feel premium without becoming visually crowded.

The primary message must remain understandable without animation.

### 7.2 Trusted By

The Trusted By section may include:

- Approved customer logos
- Partner logos
- Industry names
- Proof metrics
- Trust statement

Fake or placeholder client logos must not be published as real clients.

### 7.3 Services

The Services section must present:

1. Brand Design
2. Website Development
3. AI and Automation
4. Growth and Marketing

Each service card should support:

- Title
- Short description
- Key deliverables
- Icon
- Optional image
- CTA
- Link
- Featured state

### 7.4 Process

The Process section should explain how Stratifit works.

Possible steps:

- Discover
- Define
- Design
- Build
- Launch
- Improve

The exact public wording remains editable in Supabase.

### 7.5 Why Choose Us

This section should communicate differentiation such as:

- Strategic approach
- Premium execution
- Modern technology
- Clear communication
- Multilingual capability
- Performance focus
- Long-term support

### 7.6 Insights & Expertise

This section should:

- Demonstrate knowledge
- Highlight selected insights
- Show topics or categories
- Link to the Insights page
- Avoid looking like a generic blog feed

### 7.7 Portfolio

The Portfolio section should:

- Highlight selected projects
- Use strong visual presentation
- Include service categories
- Show concise outcomes
- Link to project details
- Avoid overcrowding the homepage

### 7.8 Acquisition

The Acquisition section should:

- Explain the Buy a Business offering
- Make the service feel intentional
- Avoid confusing it with standard web services
- Include a dedicated CTA
- Link to the Acquisition page

### 7.9 Testimonials

Testimonials should support:

- Quote
- Person
- Role
- Company
- Image
- Related service
- Featured status

Testimonials must not be invented or misleading.

### 7.10 Pricing

Pricing may show:

- Starting prices
- Packages
- Custom quote guidance
- Included features
- CTA
- Important conditions

Pricing content must remain editable.

### 7.11 FAQ

The FAQ section should:

- Use structured accessible accordions
- Support multilingual content
- Include only useful questions
- Link to the AI FAQ assistant where appropriate
- Avoid excessive animation

### 7.12 Final CTA

The final CTA should:

- Restate the value
- Provide one clear primary action
- Optionally provide a secondary contact path
- Avoid introducing new complex information

### 7.13 Footer

The footer should include:

- Logo
- Short company description
- Navigation
- Services
- Legal links
- Contact information
- Social links
- Language selector when appropriate
- Copyright
- Optional newsletter form

---

## 8. Content Source Rules

Editable public content must come from Supabase.

This includes:

- Headings
- Paragraphs
- Images
- Videos
- Buttons
- Links
- Services
- Process steps
- Testimonials
- Portfolio projects
- Insights
- Pricing
- FAQs
- Navigation
- Footer
- SEO metadata
- Chatbot knowledge

The frontend may hardcode:

- Component structure
- System labels
- Technical error messages
- Accessibility labels
- Default empty-state messages
- Validation logic
- Section identifiers
- Safe fallbacks
- Design tokens
- Animation logic

Rule:

> No hardcoded editable marketing content.

---

## 9. Data Fetching

### 9.1 Server-first reads

Public CMS content should be fetched through Server Components or server-side query functions where practical.

Benefits:

- Better SEO
- Reduced client JavaScript
- Safer data access
- Better performance
- Simpler loading behavior

### 9.2 Centralized queries

Do not place raw Supabase queries directly inside every section.

Use feature-level query modules.

Example:

```text
src/features/services/queries.ts
src/features/portfolio/queries.ts
src/features/insights/queries.ts
src/features/faq/queries.ts
```

### 9.3 Public filtering

Public queries must return only:

- Published content
- Visible content
- Approved fields
- Approved language values
- Approved media

Private CMS fields must not be returned.

### 9.4 Ordering

Collections should have stable ordering.

Examples:

- Featured first
- Display order
- Publication date
- Manual priority

### 9.5 Empty content

Missing content must not break the page.

The frontend should either:

- Hide the section
- Show an approved fallback
- Show a controlled empty state in preview mode

---

## 10. Section Registry Usage

The Section Registry maps section types to React components and schemas.

The frontend should:

- Render only approved section types
- Validate incoming section data
- Use safe fallback behavior
- Keep section logic in code
- Keep editable content in Supabase
- Support visual CMS previews

Example concept:

```ts
const sectionRegistry = {
  hero: HeroSection,
  trustedBy: TrustedBySection,
  services: ServicesSection,
  process: ProcessSection,
  whyChooseUs: WhyChooseUsSection,
  insights: InsightsSection,
  portfolio: PortfolioSection,
  acquisition: AcquisitionSection,
  testimonials: TestimonialsSection,
  pricing: PricingSection,
  faq: FAQSection,
  cta: CTASection,
} as const;
```

The registry must not execute arbitrary component code from the database.

---

## 11. Component Architecture

### 11.1 Component categories

Recommended categories:

```text
components/
├── ui/
├── layout/
├── sections/
├── forms/
├── chat/
└── shared/
```

### 11.2 UI components

Examples:

- Button
- Input
- Textarea
- Select
- Dialog
- Drawer
- Tabs
- Accordion
- Badge
- Tooltip
- Toast
- Skeleton

### 11.3 Layout components

Examples:

- Container
- Section
- Header
- Footer
- Grid
- Stack
- PageShell
- LanguageSwitcher

### 11.4 Section components

Examples:

- HeroSection
- ServicesSection
- ProcessSection
- PortfolioSection
- FAQSection
- CTASection

### 11.5 Composition rules

Components should:

- Have one clear responsibility
- Use typed props
- Avoid duplicated layout logic
- Use design tokens
- Support responsive behavior
- Support accessibility
- Support preview mode when necessary

Avoid overly abstract generic components that make the design harder to understand.

### 11.6 Public and CMS styling boundaries

Shared UI components are used by both the public website and the CMS. Context
differences are expressed through approved variants, composition, and
surrounding layout styles — never through generic `isPublic` or `isCms` props on
every component.

Public context MAY use:

- Larger Satoshi-led display typography on approved headings and card titles
- Controlled amber glow on primary surfaces
- Limited indigo accents in AI, automation, analytics, and informational contexts
- Richer but approved shadow and motion tokens
- More expressive composition

CMS context SHALL:

- Keep Inter dominant
- Use neutral, operational surfaces
- Keep shadows and glows restrained
- Keep motion minimal
- Prioritize form clarity, statuses, tables, and predictable actions

Explicit variants (for example `Card` `standard` vs `featured`, or `Button`
`primary` vs `secondary`) are preferred only where behavior genuinely differs.
Do not create duplicate public and CMS component libraries. Shared components
live once in `src/components/ui/` and are reused by both contexts.

---

## 12. Server and Client Component Rules

### 12.1 Use Server Components for

- Public pages
- Data fetching
- Metadata generation
- Static content
- Non-interactive sections
- Initial page composition

### 12.2 Use Client Components for

- Accordions
- Tabs
- Carousels
- Chat
- Forms with client interaction
- GSAP animations
- Language controls requiring client state
- Interactive filters

### 12.3 Boundary rules

Keep Client Components as small as practical.

Do not make an entire page a Client Component only because one child is interactive.

---

## 13. Design System Application

The frontend must follow `DESIGN_SYSTEM.md`.

Approved foundation:

- Background: `#0B0F17`
- Surface: `#111827`
- Elevated surface: `#182235`
- Primary: `#F59E0B`
- Secondary: `#4F46E5`
- Primary text: `#FFFFFF`
- Secondary text: `#B8C0CC`
- Muted text: `#9CA3AF`
- Border: `#1F2937`

Amber is the dominant accent.

Indigo is a supporting accent.

---

## 14. Typography Usage

### 14.1 Satoshi

Use Satoshi for:

- Hero headings
- Section headings
- Large metrics
- Portfolio titles
- Card titles
- Brand statements

### 14.2 Inter

Use Inter for:

- Body copy
- Navigation
- Buttons
- Forms
- Labels
- Metadata
- Chat
- Legal content
- CMS previews

### 14.3 Typography rules

- Maintain readable line lengths
- Avoid excessive uppercase
- Avoid overly tight body tracking
- Use fluid heading sizes
- Avoid tiny text on mobile
- Preserve hierarchy between heading levels

---

## 15. Section Spacing

Recommended section padding:

```text
Mobile: 64–80px
Tablet: 80–112px
Desktop: 112–160px
```

Hero sections may use larger spacing.

Section spacing should vary intentionally.

Avoid identical spacing and composition for every section.

Recommended section header gap:

```text
Heading to body: 16–24px
Header to main content: 40–64px
```

---

## 16. Responsive Behavior

### 16.1 Mobile

On mobile:

- Use one main column
- Stack CTAs when necessary
- Keep tap targets at least 44px
- Reduce motion intensity
- Avoid hover-only behavior
- Prevent horizontal overflow
- Use shorter copy blocks
- Keep floating chat controls away from content
- Avoid oversized decorative effects

### 16.2 Tablet

On tablet:

- Use one or two columns
- Preserve generous spacing
- Test portrait and landscape
- Avoid assuming desktop navigation

### 16.3 Desktop

On desktop:

- Use stronger grid composition
- Preserve readable line lengths
- Keep containers controlled
- Avoid unnecessary full-width text
- Balance content and whitespace

### 16.4 Large screens

Do not stretch layouts indefinitely.

Use maximum widths and deliberate negative space.

---

## 17. Header Behavior

The public header should support:

- Desktop navigation
- Mobile menu
- Primary CTA
- Language selection
- Chat access
- Active link state
- Scroll state

Possible states:

- Transparent over hero
- Solid dark after scroll
- Mobile drawer open
- Language menu open

The header should remain readable against all section backgrounds.

---

## 18. Navigation Rules

Navigation labels must come from Supabase where editable.

Navigation should:

- Remain short
- Avoid deep nesting
- Support keyboard navigation
- Show active state
- Work without hover
- Support multilingual labels

Primary menu:

```text
Home
Services
Work
Insights
About
FAQ
Contact
```

The exact final labels may be adjusted through approved content decisions.

---

## 19. Buttons and CTAs

The main CTA should remain visually dominant.

Possible primary CTAs:

- Start Your Project
- Book a Strategy Call
- Message Us

Button usage:

- One primary CTA per major section
- One secondary CTA when justified
- Avoid multiple equal-priority buttons
- Use descriptive labels
- Preserve loading width
- Provide focus-visible state

---

## 20. Animation and GSAP

### 20.1 Public motion goals

Motion should:

- Guide attention
- Improve hierarchy
- Support storytelling
- Create premium perception
- Remain performant

### 20.2 Approved uses

GSAP may be used for:

- Hero entrance sequences
- Text reveals
- Section transitions
- Portfolio reveals
- Scroll-based storytelling
- Counter animations
- Controlled parallax
- Line or shape motion

### 20.3 Rules

Always:

- Use `useGSAP()` or `gsap.context()`
- Clean up timelines
- Clean up ScrollTriggers
- Respect reduced motion
- Prefer transforms and opacity
- Avoid layout shift
- Avoid blocking interaction
- Reduce intensity on mobile

### 20.4 Content independence

All content must remain visible and understandable without animation.

### 20.5 CMS-controlled animation

The CMS may select:

- Enabled or disabled
- Named preset
- Approved intensity
- Approved delay level

The CMS must not store arbitrary animation code.

---

## 21. Accessibility

The frontend must support:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Proper heading order
- Accessible labels
- Accessible dialogs
- Accessible accordions
- Reduced motion
- Sufficient contrast
- Meaningful alt text
- Error announcements
- Form descriptions

Avoid:

- Clickable non-button elements
- Missing labels
- Color-only state communication
- Keyboard traps
- Auto-playing audio
- Long motion sequences without reduction

---

## 22. SEO

### 22.1 Metadata

Pages should support:

- Title
- Description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Twitter metadata
- Indexing status

### 22.2 Structured data

Possible structured data:

- Organization
- LocalBusiness
- Service
- Article
- BreadcrumbList
- FAQPage where appropriate

### 22.3 Sitemap

The sitemap should include:

- Public pages
- Published work pages
- Published insights
- Language variants

### 22.4 Robots

Draft, preview, and admin routes must not be indexed.

---

## 23. Performance

The frontend should prioritize:

- Server rendering
- Optimized images
- Controlled client JavaScript
- Lazy loading
- Font efficiency
- Cache revalidation
- Reduced layout shift
- Efficient animation
- Minimal third-party scripts

Avoid:

- Heavy carousels without need
- Large unoptimized videos
- Multiple animation libraries
- Excessive client hydration
- Unnecessary analytics scripts
- Loading all CMS content on every page

---

## 24. Image Handling

Use Next.js image optimization where appropriate.

Images should have:

- Width and height
- Responsive sizes
- Alt text
- Optimized format
- Controlled quality
- Meaningful crop
- Fallback behavior

Portfolio images should preserve visual quality.

Avoid using low-resolution images stretched into large layouts.

---

## 25. Video Handling

Videos should:

- Be optional
- Use poster images
- Avoid autoplay with sound
- Respect mobile data
- Provide controls when necessary
- Avoid blocking initial rendering

Background video should not reduce text readability.

---

## 26. Forms

Public forms may include:

- Contact form
- Project enquiry
- Acquisition enquiry
- Newsletter form
- Chat lead capture

Forms must:

- Validate with Zod
- Validate on the server
- Show clear errors
- Include consent where required
- Prevent spam
- Rate limit public submissions
- Show success confirmation
- Avoid duplicate submissions

---

## 27. Contact Form

Suggested fields:

- Name
- Email
- Company
- Service
- Budget range
- Project timeline
- Message
- Preferred language
- Consent

Only necessary data should be required.

---

## 28. AI Chat Integration

The chat interface should:

- Be visible but not intrusive
- Work on mobile and desktop
- Preserve conversation state
- Clearly identify AI and human messages
- Support human takeover
- Show waiting states
- Support offline follow-up
- Avoid covering key mobile content

The chat button should follow the design system.

---

## 29. AI FAQ Integration

The AI FAQ may appear:

- Near the standard FAQ section
- As part of the chat experience
- On service pages
- On the Contact page

It should clearly communicate that answers are AI-assisted.

It must use approved knowledge.

---

## 30. Loading States

Use:

- Skeletons
- Reserved layout space
- Loading labels
- Button spinners
- Controlled transitions

Avoid:

- Blank screens
- Layout jumps
- Indefinite spinners
- Flashing content

---

## 31. Error States

Public errors should:

- Use friendly language
- Avoid technical details
- Provide recovery
- Preserve navigation
- Offer contact when necessary

Examples:

- Content unavailable
- Form submission failed
- Chat temporarily unavailable
- Page not found

---

## 32. Empty States

Public empty states should generally hide unavailable optional sections.

Examples:

- No testimonials: hide section
- No portfolio items: show controlled placeholder only in preview
- No insights: hide homepage insight cards
- Missing translation: fall back to English

---

## 33. 404 Page

The 404 page should include:

- Clear heading
- Short explanation
- Home link
- Contact or navigation option
- Strong Stratifit branding
- Minimal animation

---

## 34. Preview Compatibility

Public section components should support CMS preview.

Preview requirements:

- Accept draft data
- Render without saving
- Support mobile, tablet, and desktop frames
- Use the same design system
- Avoid performing public analytics
- Avoid indexing
- Avoid sending production emails
- Avoid creating public leads

---

## 35. Multilingual Frontend

The public frontend supports:

- English
- German
- French
- Spanish

English is the default.

The frontend must:

- Resolve locale consistently
- Use English fallback
- Generate localized metadata
- Preserve locale through navigation
- Avoid mixed-language pages
- Support translated navigation
- Support translated forms
- Support translated chatbot context

---

## 36. Language Switching

The language switcher should:

- Show current language
- Be keyboard accessible
- Preserve the current page when possible
- Avoid full-page confusion
- Use clear language labels
- Avoid relying only on flags

Recommended labels:

```text
EN
DE
FR
ES
```

Flags may support the label but should not replace it.

---

## 37. Content Formatting

Rich content should use approved structured content.

Avoid unrestricted HTML from the CMS.

Supported content may include:

- Paragraphs
- Headings
- Lists
- Quotes
- Links
- Images
- Code blocks for insights
- Callouts

Content rendering must be sanitized.

---

## 38. Legal Content Styling

Legal content should use:

- Inter
- Strong heading hierarchy
- Narrow readable width
- Minimal animation
- Clear links
- Visible update date when required

---

## 39. Analytics

Analytics may include:

- Vercel Analytics
- Vercel Speed Insights
- Google Analytics
- Search Console
- Approved privacy-conscious tools

Analytics must not block rendering.

Non-essential tracking must follow consent requirements.

---

## 40. Frontend Security

The frontend must not expose:

- Service-role keys
- Resend API keys
- AI API keys
- Private conversation data
- Internal notes
- Admin-only content
- Unpublished drafts

All public inputs must be validated.

---

## 41. Testing Requirements

Frontend testing should include:

- Mobile layout
- Tablet layout
- Desktop layout
- Keyboard navigation
- Focus states
- Reduced motion
- Form validation
- Public data visibility
- Missing content
- Missing translations
- Slow loading
- Chat behavior
- SEO metadata
- Production build

Possible automated tools:

- Vitest
- React Testing Library
- Playwright

---

## 42. Frontend Development Workflow

For each section:

```text
Read PROJECT.md
↓
Read DESIGN_SYSTEM.md
↓
Read FRONTEND.md
↓
Read relevant OpenSpec
↓
Confirm Supabase content shape
↓
Build typed component
↓
Add responsive behavior
↓
Add accessibility
↓
Add motion when justified
↓
Add preview compatibility
↓
Test
↓
Run lint
↓
Run build
↓
Review
```

---

## 43. AI Coding Rules

Coding agents must:

- Read this document
- Use approved design tokens
- Use Satoshi and Inter correctly
- Avoid hardcoded editable marketing content
- Use Server Components by default
- Keep Client Components small
- Use centralized queries
- Respect RLS
- Avoid arbitrary styling without reason
- Respect reduced motion
- Preserve accessibility
- Support preview mode where required
- Run lint and build

---

## 44. Frontend Review Checklist

Before approving a page or section, confirm:

### Content

- Does content come from Supabase?
- Is English fallback handled?
- Are private fields excluded?

### Design

- Does it follow the design system?
- Is amber dominant?
- Is indigo restrained?
- Are typography roles correct?

### Responsive

- Does it work on mobile?
- Does it work on tablet?
- Does it work on desktop?
- Is there horizontal overflow?

### Accessibility

- Is keyboard navigation supported?
- Are focus states visible?
- Is contrast sufficient?
- Is reduced motion respected?

### Performance

- Is client JavaScript controlled?
- Are images optimized?
- Does animation remain smooth?
- Is layout shift minimized?

### CMS compatibility

- Can the section preview draft data?
- Does missing content fail safely?
- Are fields structured and predictable?

---

## 45. Definition of Frontend Completion

The initial public frontend is complete when:

- All approved routes exist
- Homepage sections render in approved order
- Editable content comes from Supabase
- All pages are responsive
- Satoshi and Inter are applied correctly
- The design system is consistent
- Multilingual navigation works
- Metadata is localized
- Forms validate correctly
- Chat is integrated
- Human takeover works
- Accessibility checks pass
- Reduced motion works
- Images are optimized
- Production build passes
- Vercel preview works
- CMS preview uses the same section components

---

## 46. Related Documentation

Read this document with:

```text
docs/PROJECT.md
docs/ARCHITECTURE.md
docs/DESIGN_SYSTEM.md
docs/CMS.md
docs/DATABASE.md
docs/CHAT_SYSTEM.md
docs/EMAIL_SYSTEM.md
AGENTS.md
```

Feature-specific frontend work should follow OpenSpec.

---

## 47. Frontend Summary

The Stratifit frontend is a premium multilingual Next.js website powered by Supabase content.

It uses:

- Satoshi for brand expression
- Inter for readability
- Amber as the main accent
- Indigo as a supporting accent
- Responsive section components
- Server-first rendering
- Centralized data queries
- Accessible interactions
- Purposeful GSAP animation
- CMS-compatible previews
- Strong SEO and performance practices

The frontend must look impressive enough to demonstrate Stratifit’s capabilities while remaining trustworthy, usable, and maintainable.
