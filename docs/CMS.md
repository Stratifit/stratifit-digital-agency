# CMS.md — Stratifit Digital Agency Platform

**Project:** Stratifit Digital Agency  
**Document type:** Custom CMS and admin dashboard specification  
**Status:** Initial approved CMS specification  
**Primary references:** `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/FRONTEND.md`

---

## 1. Purpose

This document defines the CMS architecture and admin experience for the Stratifit Digital Agency Platform.

The CMS is the internal system used by authorized administrators to manage:

- Public website content
- Homepage sections
- Navigation
- Footer
- Services
- Portfolio projects
- Insights
- Testimonials
- Pricing
- FAQs
- SEO metadata
- Media
- Leads
- Conversations
- AI chatbot knowledge
- AI FAQ settings
- Email activity
- Global settings
- Users and permissions

The CMS must be powerful enough to manage the full public website while remaining calm, predictable, and easy for non-technical users.

The CMS is not a general-purpose page builder in version 1.

---

## 2. CMS Goals

The CMS must:

- Allow non-technical administrators to manage website content
- Keep editable marketing content in Supabase
- Prevent accidental design-system breakage
- Use structured forms instead of raw database editing
- Support multilingual content
- Support visual previews
- Support desktop, tablet, and mobile preview modes
- Support visible and hidden content states
- Support published and draft workflows where implemented
- Support AI chat and human follow-up
- Support lead management
- Support safe media management
- Preserve security and RLS
- Remain consistent with the public frontend
- Be maintainable by human developers and coding agents

---

## 3. CMS Principles

### 3.1 Structured editing

Administrators edit approved fields through structured forms.

The CMS must not expose:

- Raw SQL
- Raw database tables
- Raw JSON unless a controlled advanced field is explicitly approved
- Raw CSS
- Raw JavaScript
- Arbitrary HTML
- Arbitrary Tailwind classes
- Arbitrary GSAP code

### 3.2 Content-driven, not code-driven

The CMS manages content and approved presentation choices.

The codebase controls:

- React component structure
- Layout logic
- Design tokens
- Responsive behavior
- Animation implementation
- Accessibility behavior
- Section Registry
- Validation schemas

### 3.3 Non-technical usability

The CMS should use language that reflects website and business tasks.

Good labels:

- Hero
- Services
- Testimonials
- Conversations
- Leads
- Media
- SEO

Avoid labels such as:

- `hero_records`
- `jsonb_payload`
- `content_blocks`
- `row_id`
- `component_type`

### 3.4 Security by default

Every sensitive read and write must be protected through:

- Authentication
- Authorization
- Server-side validation
- Row Level Security
- Storage policies
- Protected routes

### 3.5 Premium but operational

The CMS shares the Stratifit brand but should be visually calmer than the public website.

It must prioritize:

- Readability
- Stability
- Speed
- Clarity
- Error prevention
- Clear save states
- Clear status states

---

## 4. CMS Scope

Version 1 includes:

- Admin authentication
- Dashboard overview
- Homepage content management
- Page content management
- Core service management
- Portfolio management
- Insight management
- Testimonial management
- Pricing management
- FAQ management
- Navigation management
- Footer management
- Media library
- SEO management
- Multilingual editing
- Visual preview
- Responsive preview
- Leads
- Conversations
- Human takeover
- Chatbot knowledge
- Email activity
- Global settings

Version 1 does not include:

- Unrestricted page building
- Arbitrary section creation
- Drag-and-drop section ordering
- Multi-tenant workspaces
- Customer billing
- White-label accounts
- Real-time collaborative editing
- Full CRM functionality
- Raw theme editing
- Plugin installation

---

## 5. CMS Navigation Structure

Recommended admin navigation:

```text
Dashboard

Website
├── Announcement Bar
├── Header / Navigation
├── Home
│   ├── Hero
│   ├── Services
│   ├── Process
│   ├── Why Choose Us
│   ├── Insights & Expertise
│   ├── Portfolio
│   ├── Acquisition
│   ├── Testimonials
│   ├── Pricing
│   ├── FAQ
│   └── Contact
├── About
├── Services Page
├── Work Page
├── Insights Page
├── Acquisition Page
├── Contact Page
├── Pages (Privacy, Terms, Cookie Policy, Imprint, Careers)
└── Footer

Content
├── Sections (eyebrow / title / highlight / description for homepage sections)
├── Pages (detail page editor)
├── Services
├── Process Steps
├── Why Choose Us (feature cards)
├── Portfolio Projects
├── Insights
├── Testimonials
├── Pricing
└── FAQs

Communication
├── Leads
├── Conversations
├── Contacts
└── Email Activity

AI
├── Chatbot Knowledge
├── Chatbot Settings
└── AI FAQ Settings

Media
├── Images
├── Videos
├── Documents
└── Reusable Assets

Settings
├── General
├── Languages
├── SEO Defaults
├── Social Links
├── Design Options
├── Email
└── Users
```

The exact sidebar grouping may evolve, but the user-facing structure should remain task-oriented.

---

## 6. Global Layout Management

The public site layout contains:

1. Announcement Bar
2. Header / Navigation
3. Page content
4. Footer

### 6.1 Announcement Bar

The CMS should allow administrators to manage:

- Enabled or disabled
- Message
- Optional link
- Link label
- Start date
- End date
- Target pages when introduced
- Language translations
- Accent style from approved variants

The Announcement Bar should not render when:

- Disabled
- Expired
- Missing required content

### 6.2 Header / Navigation

The CMS should manage:

- Navigation labels
- Navigation links
- Link order
- Visibility
- CTA label
- CTA link
- Language labels where applicable
- Mobile navigation labels

The CMS should not control header layout code.

### 6.3 Footer

The CMS should manage:

- Short company description
- Navigation groups
- Service links
- Legal links
- Contact details
- Social links
- Copyright text
- Optional newsletter content

---

## 7. Homepage Management

The homepage order is fixed in version 1:

1. Hero
2. Services
3. Process
4. Why Choose Us
5. Insights & Expertise
6. Portfolio
7. Acquisition — Buy a Business
8. Testimonials
9. Pricing
10. FAQ
11. Contact

The CMS may allow each section to be:

- Visible
- Hidden
- Edited
- Previewed

The CMS does not expose drag-and-drop ordering in version 1.

A future `display_order` field may exist in the database for compatibility, but section order remains governed by the approved frontend architecture.

---

## 8. Section Editing Model

Each section editor should include:

- Section title in the admin
- Status
- Language controls
- Structured form fields
- Media selectors
- Link selectors
- Visibility control
- Preview controls
- Save action
- Publish action when implemented
- Unsaved-change warning
- Validation feedback

Suggested editor layout:

```text
Editor Header
├── Section name
├── Status
├── Language selector
├── Preview device selector
└── Save / Publish actions

Main Area
├── Form panel
└── Visual preview panel
```

On smaller screens, the form and preview may stack vertically.

---

## 9. Visual Editing

Visual editing means:

1. An administrator opens a section
2. The CMS loads current Supabase data
3. The form displays structured fields
4. The preview renders the public section component
5. Draft form changes update the preview
6. Save validates the input
7. Valid content is written to Supabase
8. Relevant public pages are revalidated
9. The public website displays the updated content

Visual editing does not mean:

- Free-form canvas editing
- Dragging elements anywhere
- Editing component code
- Editing CSS
- Editing animation code
- Creating arbitrary page structures

---

## 10. Preview System

The preview system should support:

- Mobile
- Tablet
- Desktop

Suggested representative widths:

```text
Mobile: 390px
Tablet: 768px
Desktop: 1280px
```

Preview requirements:

- Use the same public section components where practical
- Accept unsaved draft data
- Avoid creating analytics events
- Avoid sending emails
- Avoid writing leads
- Avoid public indexing
- Avoid production side effects
- Show missing required fields clearly
- Support reduced motion

Preview mode is not a replacement for real-device testing.

---

## 11. Section Registry Integration

The CMS and public frontend share the same Section Registry.

The registry defines:

- Section key
- React component
- Zod schema
- Editor configuration
- Preview support
- Approved variants
- Default values
- Version where needed

Example concept:

```ts
export const sectionRegistry = {
  hero: {
    component: HeroSection,
    schema: heroSectionSchema,
    editor: heroEditorConfig,
  },
  services: {
    component: ServicesSection,
    schema: servicesSectionSchema,
    editor: servicesEditorConfig,
  },
} as const;
```

The CMS must not allow a section type that has no registered component and schema.

---

## 12. Content Models

The CMS should use purpose-built content models rather than one unrestricted generic page-builder table.

### 12.1 Singleton content

Examples:

- Announcement Bar
- Hero
- Why Choose Us
- Acquisition section
- Site settings
- SEO defaults
- Chatbot settings

### 12.2 Collection content

Examples:

- Services
- Process steps
- Portfolio projects
- Insights
- Testimonials
- Pricing plans
- FAQs
- Detail pages (Privacy, Terms, Cookie Policy, Imprint, Careers)
- Navigation items
- Chatbot knowledge
- Acquisition niches (Buy-a-Business catalog — `/admin/content/acquisition/niches`, 4-language editor with stats)
- Leads
- Conversations

### 12.3 Shared content

Examples:

- Media
- Navigation
- Footer groups
- Social links
- Contact information
- Reusable CTAs

The exact database tables are defined in `DATABASE.md`.

---

## 13. Core Service Management

The CMS manages four initial service categories:

1. Brand Design
2. Website Development
3. AI and Automation
4. Growth and Marketing

Each service should support:

- Title
- Short description
- Full description
- Key deliverables
- Icon
- Featured image
- CTA label
- CTA destination
- Slug
- SEO title
- SEO description
- Visibility
- Featured state
- Translations

Administrators may edit service content.

Adding or removing a major service category requires an approved project decision and, where necessary, an OpenSpec change.

---

## 14. Portfolio Management

Each portfolio project should support:

- Title
- Slug
- Client or brand
- Summary
- Challenge
- Approach
- Solution
- Deliverables
- Results
- Service categories
- Featured image
- Gallery
- Testimonial
- Featured status
- Publication status
- Publication date
- SEO metadata
- Translations

Portfolio editors should support:

- Image selection
- Image ordering
- Result metrics
- Draft preview
- Related services

---

## 15. Insight Management

Each insight should support:

- Title
- Slug
- Excerpt
- Body content
- Featured image
- Author
- Category
- Tags
- Reading time
- Publication date
- Publication status
- Featured status
- SEO metadata
- Translations

Rich content should use an approved structured editor.

The CMS must not allow unsafe unrestricted HTML.

---

## 16. Testimonial Management

Each testimonial should support:

- Quote
- Person name
- Role
- Company
- Image
- Related service
- Related project
- Featured status
- Visibility
- Translations when needed

Testimonials must be authentic and approved.

---

## 17. Pricing Management

Pricing may support:

- Package name
- Short description
- Price or starting price
- Billing label
- Included features
- Excluded features
- CTA label
- CTA link
- Featured state
- Visibility
- Disclaimer
- Translations

The system should support custom-quote pricing without forcing a numeric value.

---

## 18. FAQ Management

Each FAQ should support:

- Question
- Answer
- Category
- Visibility
- Featured state
- Display order
- AI knowledge eligibility
- Translations

The standard FAQ and AI FAQ may use the same approved FAQ records.

The CMS should clearly indicate whether an FAQ can be used by the AI assistant.

---

## 19. Multilingual Editing

Supported languages:

- English
- German
- French
- Spanish

English is the default language.

### 19.1 Editor behavior

The CMS should provide:

- Language tabs
- Current language indicator
- Missing translation warning
- Incomplete translation warning
- English fallback information
- Protection against accidental overwrite

### 19.2 Required fields

Default-language fields may be required.

Secondary-language fields may be optional until published.

### 19.3 JSONB translations

Translatable fields generally use JSONB objects:

```json
{
  "en": "English content",
  "de": "German content",
  "fr": "French content",
  "es": "Spanish content"
}
```

The exact schema belongs in `DATABASE.md`.

### 19.4 Collection editors (portfolio / insights / testimonials / pricing / FAQ)

Implemented status: the generic collection editor (`ContentForm`, used by Portfolio Projects, Insights, Testimonials, Pricing, and FAQs) supports language tabs for every translatable field.

Behavior:

- A `EN / DE / FR / ES` tab row sits at the top of the form and controls which locale is edited
- Slug, client name, status, display order, visibility, and other non-translatable fields are locale-independent
- English is required; de/fr/es are optional but preserved on save
- Each translation is stored as the full JSONB object (`en`/`de`/`fr`/`es`) — existing translations are never overwritten by saving another language
- Field-level validation errors show for the currently active tab
- Server-side Zod schemas validate the complete translation object shape before every write

---

## 20. Draft and Publish Workflow

Where draft and publish are implemented, content states may include:

```text
draft
published
archived
```

Possible section visibility states:

```text
visible
hidden
```

Rules:

- Public users see only published and visible content
- Admins may preview draft content
- Publishing requires valid required fields
- Archiving must not silently delete data
- Destructive actions require confirmation
- Revalidation occurs after successful publishing

A simple visible/hidden workflow may be used initially for singleton sections if full draft publishing is not yet needed.

---

## 21. Save Behavior

Save actions should:

1. Validate with Zod
2. Confirm authentication
3. Confirm authorization
4. Write through approved server-side code
5. Return a structured result
6. Show success or error state
7. Revalidate affected public content
8. Preserve form values on failure

Suggested result:

```ts
type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };
```

---

## 22. Unsaved Changes

The CMS should warn users when:

- They navigate away with unsaved changes
- They switch content items with unsaved changes
- They close a modal containing unsaved changes
- They change language with unsaved edits

The warning should be clear and not trigger when no meaningful changes exist.

---

## 23. Validation

Validation must exist on the server.

Client-side validation may improve usability but is not sufficient.

Validation should cover:

- Required fields
- Length limits
- URLs
- Slugs
- File types
- File sizes
- Translation object shape
- Status values
- Approved variants
- Relationship IDs

Validation errors should be field-specific when possible.

---

## 24. Media Library

The CMS should provide a reusable media library.

Media may include:

- Images
- Videos
- SVG files
- Documents
- Logos
- Portfolio assets
- Insight assets

Each media record should support:

- Filename
- Storage path
- MIME type
- File size
- Width
- Height
- Alt text
- Caption
- Category
- Uploaded by
- Created date
- Usage information

### 24.1 Media actions

Administrators should be able to:

- Upload
- Search
- Filter
- Preview
- Select
- Edit metadata
- Replace where safe
- Delete where safe

### 24.2 Deletion safety

The CMS should prevent accidental deletion of media currently in use.

Possible behaviors:

- Block deletion
- Show usage list
- Require replacement
- Require explicit confirmation

---

## 25. Design Controls

The CMS may expose approved design choices such as:

- Section variant
- Alignment
- Media position
- Background mode
- Accent mode
- Content width
- Animation preset
- Animation intensity

The CMS must not expose:

- Raw CSS
- Arbitrary color picker for public sections
- Arbitrary font selection
- Arbitrary spacing values
- Arbitrary Tailwind classes
- Arbitrary JavaScript
- Arbitrary GSAP code

Design options must map to approved tokens in `DESIGN_SYSTEM.md`.

---

## 26. CMS Visual Design

The CMS should use:

- Background and surface tokens from the design system
- Inter as the dominant font
- Satoshi only for selected high-level titles
- Restrained amber accents
- Limited indigo for AI and information
- Strong focus states
- Clear form grouping
- Predictable spacing
- Calm motion

The CMS should not use:

- Excessive glows
- Cinematic transitions
- Oversized headings
- Decorative gradients in forms
- Low-contrast inputs
- Hidden primary actions

---

## 27. Dashboard

The dashboard should provide a concise operational overview.

Possible widgets:

- New leads
- Open conversations
- Waiting for admin
- Recent content updates
- Draft content
- Published insights
- Media storage summary
- Email delivery issues

The dashboard should not become an analytics product in version 1.

---

## 28. Lead Management

Lead sources may include:

- Contact form
- Project enquiry
- Chatbot
- AI FAQ
- Acquisition enquiry
- Newsletter

Lead records may include:

- Name
- Email
- Phone
- Company
- Requested service
- Budget range
- Project timeline
- Preferred language
- Source
- Status
- Assigned admin
- Internal notes
- Consent
- Created date
- Updated date

Lead statuses:

```text
new
contacted
qualified
proposal
won
lost
archived
```

### 28.1 Lead actions

Admins should be able to:

- View
- Filter
- Search
- Assign
- Change status
- Add internal notes
- Open related conversation
- Send approved follow-up
- Archive

---

## 29. Conversation Inbox

The conversation inbox should support:

- Open conversations
- Waiting for admin
- AI handling
- Human handling
- Waiting for visitor
- Resolved
- Archived

Each conversation should show:

- Visitor
- Email when provided
- Current page
- Source
- Last message
- Last activity
- Status
- Assigned admin
- Lead status
- Human takeover state

---

## 30. Conversation Detail

The conversation detail view should include:

- Message history
- Sender type
- Timestamps
- Visitor information
- Related lead
- Internal notes
- Assignment
- Status
- Human takeover control
- Reply box
- Email delivery state

Sender types:

```text
visitor
ai
admin
system
```

Internal notes must never be visible to visitors.

---

## 31. Human Takeover

Workflow:

```text
AI handles conversation
↓
Visitor requests a human or AI escalates
↓
Status becomes waiting_for_admin
↓
Admin opens conversation
↓
Admin takes control
↓
Mode becomes human
↓
AI automatic replies stop
↓
Admin replies
↓
Reply is stored
↓
Visitor receives reply in chat or email
```

The CMS must clearly show when AI automatic replies are paused.

---

## 32. Chatbot Knowledge Management

Knowledge sources may include:

- Services
- FAQs
- Process
- Portfolio summaries
- Pricing guidance
- Published pages
- Approved knowledge articles
- Business rules

Each knowledge record should support:

- Title
- Content
- Category
- Visibility
- AI eligibility
- Priority
- Source reference
- Last reviewed date
- Translations

The AI should use only approved knowledge.

---

## 33. Chatbot Settings

Possible settings:

- Enabled
- Welcome message
- Offline message
- Escalation message
- Lead capture timing
- Human support availability
- AI response style
- Allowed knowledge categories
- Fallback behavior
- Email follow-up behavior

The CMS must not expose secret AI API keys to browser-side users.

---

## 34. AI FAQ Settings

The CMS may manage:

- Enabled
- Intro text
- Suggested questions
- Knowledge categories
- Fallback message
- Escalation option
- Related CTA
- Language behavior

---

## 35. Email Activity

The CMS should show operational email records.

Possible fields:

- Recipient
- Template
- Related lead
- Related conversation
- Provider message ID
- Status
- Error
- Created date
- Sent date

Possible statuses:

```text
queued
sent
delivered
failed
bounced
```

The exact statuses depend on implemented Resend events.

---

## 36. SEO Management

The CMS should support:

- Global SEO defaults
- Page-specific SEO
- Service SEO
- Portfolio SEO
- Insight SEO
- Open Graph images
- Canonical URLs
- Indexing controls
- Localized metadata

SEO forms should use clear guidance and character-count indicators where useful.

---

## 37. Navigation Management

Navigation records should support:

- Label
- Destination
- External link flag
- Parent item
- Order
- Visibility
- Target behavior
- Translations

The CMS should validate internal links against approved routes where practical.

---

## 38. Footer Management

Footer management should support:

- Link groups
- Group headings
- Link labels
- Destinations
- Company description
- Contact details
- Social links
- Legal links
- Copyright
- Translations

---

## 39. Page Content Management

Detail pages — Privacy Policy, Terms of Service, Cookie Policy, Imprint, and Careers — are managed as structured, CMS-editable records rather than hardcoded static JSX.

### 39.1 Managed pages

Seeded pages (slug in parentheses):

- Privacy Policy (`privacy`)
- Terms of Service (`terms-conditions`)
- Cookie Policy (`cookie-policy`)
- Imprint (`imprint`)
- Careers (`careers`)

Each page is a record in the `detail_pages` table (see `DATABASE.md` §9.6).

### 39.2 Page fields

The editor should support:

- Eyebrow, e.g. "Legal" (4 languages)
- Title (4 languages)
- Hero description (4 languages)
- Subtitle, e.g. "Last updated: July 2026" (4 languages)
- Ordered content blocks
- Visibility

### 39.3 Content blocks

The CMS exposes only approved block types:

- Section heading (card) — optional icon from the approved set, starts a card
- Subheading — optional divider line above (e.g. a "Contact Us" block)
- Paragraph
- Bullet list
- Info panel — title, optional tag, and body (used for cookie categories)
- Note box

Each block stores its text in all four languages. Paragraph and panel body text
supports a tiny inline-link markup — `[label](url)` — that renders only safe
links (`https://`, `mailto:`, `tel:`, or internal `/` paths); anything else
stays literal. The CMS must not allow raw HTML, arbitrary markup, or free-form
styling.

Section headings group the blocks that follow them into cards until the next
heading; blocks before the first heading render as plain lead content above the
cards.

### 39.4 Editor behavior

The editor should support:

- Reordering blocks
- Adding blocks
- Removing blocks
- Per-block type selection
- Per-block translations
- Visibility toggle
- English required on title and every block
- Live preview pane with device (mobile / tablet / desktop) and language (EN / DE / FR / ES) switchers

### 39.5 Live preview

The detail-page editor includes a sticky live preview pane on large screens (it stacks below the form on mobile). It renders draft values as the admin types, without saving or hitting the database.

Preview behavior:

- Device frames: mobile (390px), tablet (768px), desktop (full column width)
- Language switcher resolves each title, subtitle, and block in the selected locale, falling back to English
- Hidden pages show a "Hidden" badge in the preview header
- A page with no blocks shows a controlled empty state
- Preview uses the shared `DetailPagePreview` client component (`src/components/detail-pages/detail-page-preview.tsx`), which mirrors the public `DetailPageView` structure using the same `DetailBlock` renderer (`src/components/detail-pages/detail-block.tsx`)

Preview is not the source of truth — Supabase remains the source of truth after save.

### 39.6 Public behavior

- A visible page renders its stored blocks on its public route (`/privacy`, `/terms-conditions`, `/cookie-policy`, `/imprint`, `/careers`)
- A hidden page is not reachable on the public site (404)
- A page with no stored row falls back to the previous static copy so the site never breaks
- Sitemap entries are generated only for visible pages

### 39.7 Revalidation

Saving a page must revalidate:

- The public route (`/privacy`, …)
- The admin Pages list
- The admin edit route

---

## 40. User Management

Initial roles:

- Owner
- Administrator

Possible future roles:

- Editor
- Support Agent
- Translator

User management should support:

- Invite
- View
- Disable
- Role assignment
- Last login
- Status

High-risk actions should require stronger confirmation.

---

## 41. Authentication

Admin authentication uses Supabase Auth.

The CMS should provide:

- Login
- Logout
- Session handling
- Protected routes
- Unauthorized state
- Password reset when implemented
- Secure redirect behavior

UI hiding is not authorization.

---

## 42. Authorization

Authorization must be enforced through:

- Route checks
- Server-side permission checks
- RLS
- Storage policies
- Feature permissions

Examples:

- Public users cannot read leads
- Public users cannot read private conversations
- Admins can manage content
- Support agents may later manage conversations without changing design settings

---

## 43. RLS Requirements

RLS must protect:

- Leads
- Conversations
- Messages
- Internal notes
- Admin users
- Private settings
- Draft content
- Email activity

Public read policies should be limited to published public content.

Database details belong in `DATABASE.md`.

---

## 44. Server-Side Operations

Sensitive CMS operations must run on the server:

- Content mutations
- Service-role operations
- Email sending
- AI calls
- User management
- Secure file actions
- Revalidation
- Webhook handling

The browser must not receive secret keys.

---

## 45. Revalidation

After successful content updates, the CMS should revalidate affected paths or tags.

Examples:

```text
homepage
services
portfolio
insights
testimonials
pricing
faq
navigation
footer
seo
```

Revalidation must happen only after successful writes.

---

## 46. Search and Filtering

CMS collections should support search and filters where useful.

Examples:

- Portfolio by service
- Insights by status
- Leads by status
- Conversations by assignment
- Media by type
- FAQs by category

Search must not create unsafe unrestricted queries.

---

## 47. Pagination

Use pagination for large collections such as:

- Insights
- Leads
- Conversations
- Media
- Email activity

Small fixed collections do not require pagination.

---

## 48. Tables and Mobile Behavior

Tables should support:

- Clear headers
- Row actions
- Sorting where useful
- Filters
- Loading states
- Empty states
- Error states
- Pagination

On mobile, use:

- Stacked cards
- Priority columns
- Horizontal scroll only when necessary

Do not compress tables until text becomes unreadable.

---

## 49. Loading States

The CMS should use:

- Skeletons
- Button loading states
- Inline progress
- Upload progress
- Controlled toasts

Loading states should preserve layout and clearly communicate progress.

---

## 50. Empty States

Empty states should explain:

- What is missing
- Why it matters
- What action to take

Example:

```text
No portfolio projects yet.
Create your first project to display it on the website.
```

---

## 51. Error States

CMS errors should be:

- Human-readable
- Specific
- Actionable
- Safe
- Close to the relevant field or action

Do not show raw:

- Database errors
- Stack traces
- API keys
- Provider secrets

---

## 52. Destructive Actions

Destructive actions include:

- Delete
- Archive
- Disable user
- Remove media
- Remove conversation
- Remove translation

High-risk actions should require:

- Clear wording
- Confirmation
- Impact explanation
- Typed confirmation when appropriate

Prefer archive over permanent deletion when practical.

---

## 53. Auditability

Important future audit events may include:

- Content published
- Content deleted
- Role changed
- Conversation takeover
- Lead status changed
- Settings changed
- Media deleted

Full audit logging may be introduced later.

---

## 54. Accessibility

The CMS must support:

- Keyboard navigation
- Visible focus states
- Semantic forms
- Accessible dialogs
- Accessible tables
- Accessible tabs
- Error announcements
- Reduced motion
- Sufficient contrast
- Large enough touch targets

Non-technical usability depends on accessibility.

---

## 55. Responsive CMS

The CMS should work on:

- Mobile
- Tablet
- Laptop
- Desktop

Desktop is the main editing environment.

Mobile should still support:

- Viewing dashboard
- Reading conversations
- Replying to chats
- Updating simple content
- Managing leads
- Approving urgent changes

Complex visual editing may be optimized for tablet and desktop.

---

## 56. Performance

The CMS should avoid:

- Loading all records at once
- Excessive realtime subscriptions
- Heavy animation
- Unnecessary client hydration
- Re-rendering full previews for every small event without control
- Large unoptimized media uploads

Use server rendering, pagination, and controlled client state.

---

## 57. Security

The CMS must:

- Protect all admin routes
- Validate all inputs
- Restrict uploads
- Apply rate limits where appropriate
- Keep secrets server-side
- Avoid unsafe HTML
- Verify webhooks
- Respect RLS
- Prevent privilege escalation
- Avoid exposing internal notes

---

## 58. Testing

CMS testing should cover:

- Login
- Authorization
- Content editing
- Validation
- Translation switching
- Visual preview
- Save behavior
- Publishing
- Revalidation
- Media upload
- Lead management
- Conversation takeover
- Human replies
- Email activity
- Mobile behavior
- RLS

Possible tools:

- Vitest
- React Testing Library
- Playwright

---

## 59. CMS Development Workflow

For each CMS feature:

```text
Read PROJECT.md
↓
Read ARCHITECTURE.md
↓
Read DESIGN_SYSTEM.md
↓
Read CMS.md
↓
Read DATABASE.md
↓
Read relevant OpenSpec
↓
Confirm schema
↓
Build form and validation
↓
Build server mutation
↓
Apply permission checks
↓
Add preview if needed
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

## 60. AI Coding Rules

Coding agents must:

- Read this document
- Follow the Section Registry
- Use structured forms
- Use Zod
- Keep secrets server-only
- Respect RLS
- Avoid raw database-table UI
- Avoid arbitrary CSS
- Avoid arbitrary section types
- Preserve multilingual structure
- Preserve visual preview compatibility
- Run lint and build
- Document major changes

AI agents must not create new content models or section types without approval.

---

## 61. CMS Review Checklist

Before approving a CMS feature, confirm:

### Usability

- Can a non-technical admin understand it?
- Are labels clear?
- Are save states obvious?
- Are errors actionable?

### Security

- Is the route protected?
- Is authorization enforced?
- Is input validated?
- Does RLS protect the data?

### Design

- Does it follow the design system?
- Is Inter dominant?
- Is motion restrained?
- Are focus states visible?

### Data

- Does it write to the correct model?
- Are translations preserved?
- Are public and private fields separated?
- Does revalidation happen correctly?

### Preview

- Does preview use the public component?
- Does draft data render safely?
- Are production side effects disabled?

---

## 62. Definition of CMS Completion

The initial CMS is complete when:

- Admin login works
- Protected routes work
- Homepage sections are editable
- Global layout is editable
- Services are manageable
- Portfolio is manageable
- Insights are manageable
- Testimonials are manageable
- Pricing is manageable
- FAQs are manageable
- Multilingual editing works
- Media library works
- Visual preview works
- Mobile, tablet, and desktop preview work
- Leads are visible
- Conversations are visible
- Human takeover works
- Admin replies work
- Chatbot knowledge is manageable
- Email activity is visible
- RLS protects private data
- Production build passes
- The interface is usable by non-technical administrators

---

## 63. Related Documentation

Read this document with:

```text
docs/PROJECT.md
docs/ARCHITECTURE.md
docs/DESIGN_SYSTEM.md
docs/FRONTEND.md
docs/DATABASE.md
docs/CHAT_SYSTEM.md
docs/EMAIL_SYSTEM.md
docs/ROADMAP.md
AGENTS.md
```

Feature-specific CMS work should follow OpenSpec.

---

## 64. CMS Summary

The Stratifit CMS is a custom Next.js admin dashboard powered by Supabase.

It manages:

- Public website content
- Global layout
- Structured sections
- Multilingual content
- Media
- SEO
- Leads
- Conversations
- AI knowledge
- Email activity
- Settings

The CMS uses structured forms, shared public components, validated server-side mutations, RLS, and controlled design options.

It is designed for non-technical administrators and does not expose unrestricted page-building, raw CSS, raw JavaScript, or arbitrary section code.
