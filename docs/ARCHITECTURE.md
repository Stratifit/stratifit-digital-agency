# ARCHITECTURE.md — Stratifit Digital Agency Platform

**Project:** Stratifit Digital Agency  
**Architecture type:** Next.js application with Supabase backend and custom visual CMS  
**Status:** Initial architecture specification  
**Primary reference:** `docs/PROJECT.md`

---

## 1. Purpose

This document defines the technical architecture of the Stratifit Digital Agency Platform.

It explains how the public website, custom CMS, Supabase backend, multilingual content system, AI chat system, Resend email system, and deployment workflow work together.

This document must guide:

- Human developers
- OpenCode
- GLM-5.2
- OpenSpec implementation plans
- Database migrations
- CMS development
- Frontend development
- Security decisions
- Deployment decisions

The architecture should remain simple enough to maintain while supporting the approved project scope and future growth.

---

## 2. Architecture Goals

The system must be:

- Professional
- Secure
- Maintainable
- CMS-driven
- Multilingual
- Responsive
- Fast
- Accessible
- Testable
- Easy for non-technical administrators
- Compatible with AI-assisted development
- Flexible enough for approved future features

The architecture should avoid unnecessary complexity.

The first version is not a general-purpose page builder, multi-tenant SaaS, or full CRM.

---

## 3. High-Level System Overview

The platform consists of five main systems:

1. Public website
2. Admin CMS
3. Supabase backend
4. AI chat and lead communication system
5. Email delivery system

```text
Public Visitor
    │
    ├── Public Website
    │      ├── Pages
    │      ├── CMS content
    │      ├── Forms
    │      ├── AI chatbot
    │      └── AI FAQ
    │
    └── Sends requests to Next.js
               │
               ├── Reads published data from Supabase
               ├── Writes approved public submissions
               ├── Calls AI provider securely
               └── Sends email through Resend

Administrator
    │
    └── Admin CMS
           ├── Authenticated with Supabase Auth
           ├── Reads and updates Supabase content
           ├── Manages media
           ├── Manages leads
           ├── Manages conversations
           ├── Takes over AI chats
           └── Configures website settings
```

---

## 4. Core Technology Architecture

### 4.1 Application framework

The application uses:

- Next.js 16
- React 19
- TypeScript
- App Router
- React Server Components
- Client Components only when required
- Server Actions where appropriate
- Route Handlers for APIs and integrations

Next.js is responsible for:

- Public pages
- Admin pages
- Server-side rendering
- Static generation where appropriate
- Server-side data access
- Form processing
- API integrations
- Metadata generation
- Authentication flow
- Preview rendering
- Deployment on Vercel

### 4.2 Backend platform

Supabase provides:

- PostgreSQL database
- Authentication
- Storage
- Row Level Security
- Realtime where approved
- Database functions when necessary
- Generated TypeScript database types
- Migration workflow
- Seed workflow

### 4.3 Email provider

Resend provides:

- Transactional email
- Lead notifications
- Contact confirmations
- Conversation follow-up
- Admin notifications
- Delivery status handling

### 4.4 AI provider

The AI layer must use a provider abstraction.

The exact model provider may change without changing the main application architecture.

The AI layer is responsible for:

- AI chatbot responses
- AI FAQ answers
- Lead qualification support
- Conversation summaries when introduced
- Approved content suggestions when introduced

The AI provider must never be called directly from the browser using a secret API key.

---

## 5. Repository Structure

The initial project structure should evolve toward:

```text
stratifit-digital-agency/
├── public/
│   ├── images/
│   ├── icons/
│   └── static/
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── services/
│   │   │   ├── work/
│   │   │   ├── insights/
│   │   │   ├── about/
│   │   │   ├── acquisition/
│   │   │   ├── contact/
│   │   │   ├── privacy/
│   │   │   └── imprint/
│   │   │
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── website/
│   │   │   ├── content/
│   │   │   ├── conversations/
│   │   │   ├── leads/
│   │   │   ├── media/
│   │   │   ├── ai/
│   │   │   └── settings/
│   │   │
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   ├── contact/
│   │   │   ├── email/
│   │   │   ├── preview/
│   │   │   └── webhooks/
│   │   │
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── forms/
│   │   ├── admin/
│   │   ├── chat/
│   │   └── shared/
│   │
│   ├── features/
│   │   ├── services/
│   │   ├── portfolio/
│   │   ├── insights/
│   │   ├── testimonials/
│   │   ├── pricing/
│   │   ├── faq/
│   │   ├── leads/
│   │   ├── conversations/
│   │   ├── media/
│   │   └── settings/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   ├── auth/
│   │   ├── validation/
│   │   ├── email/
│   │   ├── ai/
│   │   ├── i18n/
│   │   ├── seo/
│   │   ├── permissions/
│   │   ├── security/
│   │   └── utilities/
│   │
│   ├── registry/
│   │   └── sections.ts
│   │
│   ├── schemas/
│   ├── types/
│   ├── hooks/
│   ├── actions/
│   └── config/
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
│
├── docs/
│   ├── PROJECT.md
│   ├── ARCHITECTURE.md
│   ├── FRONTEND.md
│   ├── CMS.md
│   ├── DATABASE.md
│   ├── DESIGN_SYSTEM.md
│   ├── CHAT_SYSTEM.md
│   ├── EMAIL_SYSTEM.md
│   └── ROADMAP.md
│
├── openspec/
├── AGENTS.md
├── README.md
├── package.json
├── next.config.ts
└── tsconfig.json
```

Folders should be created only when needed.

Empty folders should not be created only for appearance.

---

## 6. Application Boundaries

The architecture should separate public experience, admin experience, and backend operations.

### 6.1 Public application

The public application includes:

- Marketing pages
- Services
- Portfolio
- Insights
- Contact forms
- AI chatbot
- AI FAQ
- Legal pages
- SEO metadata
- Public media

The public application may read only published content.

### 6.2 Admin application

The admin application includes:

- Authentication
- Dashboard
- Content management
- Visual previews
- Media library
- Lead management
- Conversation inbox
- Chatbot knowledge management
- Email settings
- Site settings
- User management

The admin application must be protected.

### 6.3 Server-only operations

The following must run only on the server:

- Supabase service-role operations
- Resend API calls
- AI provider calls
- Sensitive admin mutations
- Secure webhook handling
- Secret validation
- Privileged database operations
- Email delivery logging
- Chatbot system prompts

---

## 7. Routing Architecture

The public website uses intentional routes.

Initial routes:

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

Admin routes:

```text
/admin/login
/admin/dashboard
/admin/website
/admin/content
/admin/services
/admin/work
/admin/insights
/admin/testimonials
/admin/pricing
/admin/faq
/admin/leads
/admin/conversations
/admin/media
/admin/ai
/admin/settings
```

The project should not use a general catch-all route as the primary architecture in version 1.

Dynamic routes are appropriate for content collections such as:

- Portfolio projects
- Insight articles
- Future case studies

---

## 8. Rendering Strategy

The rendering strategy should be chosen per page.

### 8.1 Static or cached pages

Use static generation or caching for:

- Home
- Services overview
- About
- Acquisition
- Legal pages
- Published portfolio pages
- Published insights

These pages should be refreshed when content changes.

### 8.2 Dynamic pages

Use dynamic rendering when required for:

- Admin dashboard
- Conversation inbox
- Lead management
- Authenticated content
- Live previews
- User-specific state

### 8.3 Revalidation

CMS changes should trigger content revalidation.

Possible approaches:

- `revalidatePath`
- `revalidateTag`
- Cache tags per content type
- Revalidation after successful Server Actions

Suggested tags:

```text
site-settings
navigation
footer
homepage
services
portfolio
insights
testimonials
pricing
faq
seo
```

---

## 9. Data Access Architecture

Data access must be centralized.

Avoid scattering raw Supabase queries throughout components.

Recommended pattern:

```text
Page or Server Component
        │
        └── Feature query function
                │
                └── Supabase server client
```

Example:

```text
src/features/services/queries.ts
src/features/services/mutations.ts
src/features/services/schemas.ts
src/features/services/types.ts
```

### 9.1 Query responsibilities

Query functions should:

- Return typed data
- Filter published content for public pages
- Handle multilingual content
- Apply stable ordering
- Avoid exposing private fields
- Produce predictable empty states
- Throw or return controlled errors

### 9.2 Mutation responsibilities

Mutation functions should:

- Validate input with Zod
- Confirm authentication
- Confirm authorization
- Write through approved tables
- Return structured results
- Trigger revalidation
- Log important failures
- Avoid exposing database errors directly to users

---

## 10. Supabase Client Architecture

Use separate Supabase clients for different environments.

### 10.1 Browser client

Used for:

- Safe authenticated browser operations
- Realtime subscriptions when approved
- User session behavior
- Public operations allowed by RLS

It must use only public environment variables.

### 10.2 Server client

Used for:

- Server Components
- Server Actions
- Route Handlers
- Authenticated server reads
- Admin mutations under the current user session

### 10.3 Service-role client

Used only when absolutely necessary.

It must:

- Exist only in server-only modules
- Never be imported by Client Components
- Never be exposed to the browser
- Never bypass RLS without a documented reason
- Be limited to controlled system operations

Preferred rule:

> Use user-session access with RLS first. Use service-role access only for specific trusted backend operations.

---

## 11. Authentication Architecture

Supabase Auth provides admin authentication.

Version 1 does not require visitor accounts.

### 11.1 Admin login

The admin login flow should:

1. Accept email and password
2. Validate input
3. Authenticate through Supabase Auth
4. Confirm the user has an approved admin role
5. Redirect to the admin dashboard
6. Reject unauthorized users

### 11.2 Protected routes

Admin routes must be protected through:

- Server-side session checks
- Route-level authorization
- Database-level RLS
- Role checks for sensitive areas

UI hiding alone is not authorization.

### 11.3 Roles

Initial role model:

- Owner
- Administrator

Possible future roles:

- Editor
- Support Agent
- Translator

Roles should be implemented only when required.

---

## 12. Authorization Architecture

Authorization must exist at multiple levels:

1. Route protection
2. Server action validation
3. Database RLS
4. Storage policies
5. Feature-level permissions

Examples:

- Public users can read published services
- Public users cannot read draft content
- Public users cannot read leads
- Public users cannot read private conversations
- Administrators can manage approved content
- Support agents may manage conversations but not site settings
- Editors may update content but not users

The final role matrix will be defined in `AUTHENTICATION.md` or `SECURITY.md`.

---

## 13. Content Architecture

Content should be divided into:

### 13.1 Singleton content

One active record per concept.

Examples:

- Hero
- Site settings
- Contact settings
- Global SEO defaults
- Announcement bar
- Chatbot settings

### 13.2 Collection content

Multiple records.

Examples:

- Services
- Process steps
- Portfolio projects
- Insights
- Testimonials
- Pricing plans
- FAQs
- Chatbot knowledge articles
- Leads
- Conversations

### 13.3 Shared content

Used across multiple pages.

Examples:

- Navigation
- Footer
- CTAs
- Social links
- Contact information
- Brand assets
- Design tokens

---

## 14. Section Registry Architecture

The Section Registry maps approved section identifiers to approved React components and schemas.

Example:

```ts
export const sectionRegistry = {
  hero: {
    component: HeroSection,
    schema: heroSectionSchema,
  },
  trustedBy: {
    component: TrustedBySection,
    schema: trustedBySectionSchema,
  },
  services: {
    component: ServicesSection,
    schema: servicesSectionSchema,
  },
  process: {
    component: ProcessSection,
    schema: processSectionSchema,
  },
  whyChooseUs: {
    component: WhyChooseUsSection,
    schema: whyChooseUsSectionSchema,
  },
  insights: {
    component: InsightsSection,
    schema: insightsSectionSchema,
  },
  portfolio: {
    component: PortfolioSection,
    schema: portfolioSectionSchema,
  },
  acquisition: {
    component: AcquisitionSection,
    schema: acquisitionSectionSchema,
  },
  testimonials: {
    component: TestimonialsSection,
    schema: testimonialsSectionSchema,
  },
  pricing: {
    component: PricingSection,
    schema: pricingSectionSchema,
  },
  faq: {
    component: FAQSection,
    schema: faqSectionSchema,
  },
  cta: {
    component: CTASection,
    schema: ctaSectionSchema,
  },
} as const;
```

The registry should:

- Allow only known section types
- Validate section data
- Provide predictable rendering
- Support visual preview
- Support future variants
- Avoid executing arbitrary code from database content

The database stores content and settings.

The codebase defines component behavior.

---

## 15. Homepage Architecture

The homepage order is fixed in version 1:

1. Hero
2. Trusted By
3. Services
4. Process
5. Why Choose Us
6. Insights & Expertise
7. Portfolio
8. Acquisition
9. Testimonials
10. Pricing
11. FAQ
12. Final CTA
13. Footer

The homepage renderer should:

- Fetch approved section data
- Resolve the selected language
- Apply English fallback where approved
- Hide disabled sections
- Render sections in approved order
- Use safe empty states
- Avoid breaking the entire page when one section fails

Drag-and-drop ordering is not required.

A `display_order` column may still exist for future compatibility, but the CMS does not need to expose ordering controls in version 1.

---

## 16. Multilingual Architecture

The platform supports:

- English
- German
- French
- Spanish

English is the default language.

### 16.1 Storage strategy

Translatable fields should generally use JSONB.

Example:

```json
{
  "en": "Website Development",
  "de": "Webentwicklung",
  "fr": "Développement web",
  "es": "Desarrollo web"
}
```

### 16.2 Translation utility

A centralized helper should:

- Accept a JSONB translation object
- Accept the requested locale
- Return the requested translation
- Fall back to English
- Return a safe empty value if no valid translation exists

### 16.3 Locale routing

The exact locale URL strategy should be approved before implementation.

Possible approaches:

```text
/en/services
/de/services
/fr/services
/es/services
```

or default English without prefix:

```text
/services
/de/services
/fr/services
/es/services
```

The chosen strategy must be consistent across:

- Pages
- Metadata
- Canonical URLs
- Sitemaps
- Chatbot context
- CMS previews

### 16.4 CMS translation editing

The CMS should:

- Show language tabs
- Clearly indicate the default language
- Show missing translation warnings
- Avoid overwriting other languages
- Validate required default-language fields

---

## 17. CMS Architecture

The CMS is a custom Next.js admin application.

It should not expose raw database tables directly.

### 17.1 CMS layers

```text
Admin page
    │
    ├── Editor form
    ├── Visual preview
    ├── Validation
    └── Save action
            │
            ├── Auth check
            ├── Permission check
            ├── Zod validation
            ├── Supabase mutation
            └── Revalidation
```

### 17.2 Editing model

The CMS should use structured forms.

Examples:

- Text inputs
- Rich-text inputs when approved
- Image selectors
- URL inputs
- Boolean toggles
- Multi-language tabs
- Repeater fields
- Select fields
- Date pickers
- SEO fields

The CMS should not allow unrestricted HTML, CSS, or JavaScript editing.

### 17.3 Visual preview

Visual preview should use the same public section components where practical.

The preview receives draft form data and renders it inside a controlled preview frame.

Preview modes:

- Mobile
- Tablet
- Desktop

Preview is not the source of truth.

Supabase remains the source of truth after saving.

---

## 18. Form Architecture

Forms use:

- React Hook Form
- Zod
- Server-side validation
- Client-side validation for usability

Validation rules must exist on the server.

Client validation alone is insufficient.

Suggested result type:

```ts
type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

Public forms should include:

- Spam protection
- Rate limiting
- Consent handling
- Input length limits
- Safe error messages
- Duplicate submission protection where appropriate

---

## 19. Media Architecture

Supabase Storage provides media storage.

Suggested buckets:

```text
logos
portfolio-images
insights-images
general-media
```

Additional buckets may be added when needed.

Each media record should support:

- Storage path
- Public or signed URL strategy
- Original filename
- MIME type
- File size
- Width and height where applicable
- Alt text
- Caption
- Usage status
- Created timestamp
- Uploaded by

The CMS should manage media through a media library rather than requiring repeated direct uploads.

---

## 20. AI Chat Architecture

The AI chatbot is a server-mediated feature.

### 20.1 Chat request flow

```text
Visitor message
    │
    ├── Validate input
    ├── Check rate limit
    ├── Load conversation
    ├── Load approved knowledge
    ├── Check conversation mode
    ├── Call AI provider
    ├── Store user message
    ├── Store AI response
    └── Return response
```

### 20.2 Knowledge sources

The chatbot may use:

- Services
- FAQs
- Process information
- Portfolio summaries
- Pricing guidance
- Published pages
- Approved knowledge articles
- Business rules

The chatbot should not use unpublished private CMS content unless explicitly designed for internal use.

### 20.3 AI provider abstraction

Recommended interface:

```ts
interface ChatProvider {
  generateResponse(input: ChatRequest): Promise<ChatResponse>;
}
```

This allows changing providers without rewriting the chat system.

### 20.4 Human takeover

Conversation mode controls whether AI replies automatically.

Suggested modes:

```text
ai
waiting_for_admin
human
waiting_for_visitor
resolved
archived
```

When mode is `human`, automatic AI replies must stop.

---

## 21. Conversation Architecture

Conversation data should be separated into:

- Visitors
- Conversations
- Messages
- Assignments
- Internal notes
- Conversation events

Messages should identify:

- Sender type
- Sender ID when available
- Message content
- Delivery status
- Created time
- AI or human origin
- Email notification state

Suggested sender types:

```text
visitor
ai
admin
system
```

Private internal notes must never be returned to public visitors.

---

## 22. Lead Architecture

Leads may be created from:

- Contact forms
- Chat conversations
- AI FAQ interactions
- Acquisition enquiries
- Project forms

Lead creation should be centralized.

The system should avoid creating uncontrolled duplicate leads.

Possible duplicate matching:

- Email address
- Conversation ID
- Form submission ID

Lead records should be linkable to conversations and contact submissions.

---

## 23. Email Architecture

Resend calls must run on the server.

### 23.1 Email flow

```text
Trigger
    │
    ├── Validate recipient
    ├── Select approved template
    ├── Generate content
    ├── Create idempotency key
    ├── Send through Resend
    ├── Store delivery record
    └── Handle success or failure
```

### 23.2 Email templates

Templates should be reusable and typed.

Examples:

- New lead notification
- Contact acknowledgement
- Human support request
- Offline chat reply
- Conversation follow-up
- Admin invitation

### 23.3 Delivery records

Store:

- Template type
- Recipient
- Provider message ID
- Status
- Related entity
- Error details
- Created timestamp
- Sent timestamp

Sensitive content should be minimized in logs.

---

## 24. Realtime Architecture

Supabase Realtime may be used for:

- New conversation messages
- Conversation status changes
- Admin inbox updates
- Visitor receiving a live admin reply

Realtime should be introduced only where needed.

The CMS can use normal server refresh for features that do not need live updates.

Realtime subscriptions must respect authorization and RLS.

---

## 25. SEO Architecture

SEO data should be manageable through structured fields.

Possible hierarchy:

1. Page-specific SEO
2. Content-specific SEO
3. Global SEO defaults
4. Safe system fallback

SEO fields may include:

- Meta title
- Meta description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Indexing status
- Structured data type

Metadata should be generated on the server.

---

## 26. Design System Architecture

The design system must be shared across the public website and CMS while allowing each environment to use a different level of visual intensity.

### 26.1 Approved visual foundation

The approved starting palette is:

- Background: `#0B0F17`
- Surface: `#111827`
- Elevated surface: `#172033`
- Primary accent: `#F59E0B`
- Primary hover: `#D97706`
- Primary light: `#FBBF24`
- Secondary accent: `#4F46E5`
- Primary text: `#FFFFFF`
- Secondary text: `#B8C0CC`
- Muted text: `#9CA3AF`
- Border: `#1F2937`

Amber is the dominant brand accent.

Indigo is a limited secondary accent for AI, automation, analytics, informational states, and selected supporting visuals.

### 26.2 Typography architecture

The approved font roles are:

- **Satoshi** for display typography, hero headings, section headings, card titles, large figures, and brand expression
- **Inter** for body copy, navigation, buttons, forms, tables, labels, and the CMS interface

Font loading should use a reliable local or approved hosted strategy compatible with Next.js.

Font usage must remain centralized and should not be redefined separately inside individual components.

### 26.3 Controlled design tokens

The design system should combine:

- Code-defined color tokens
- Typography tokens
- Spacing tokens
- Radius tokens
- Shadow tokens
- Gradient tokens
- Motion tokens
- Reusable UI components
- Section-level variants

Design tokens remain controlled in code.

The CMS may select from approved values or variants, but it must not create arbitrary CSS.

The CMS must not allow editors to inject:

- Raw CSS
- Inline style strings
- JavaScript
- Unapproved color values
- Unapproved font families
- Arbitrary layout values
- Unsupported animation code

### 26.4 Token governance

Approved tokens should be used by default.

Arbitrary values are allowed only when:

- No existing token satisfies the design requirement
- The value is required for a deliberate responsive or animation behavior
- The value has been reviewed
- The value does not duplicate an existing token
- The value is documented when it becomes reusable

Repeated arbitrary values should be promoted into named design tokens.

### 26.5 Public website styling

The public website may use:

- Larger Satoshi headings
- More expressive section composition
- Refined amber glows
- Controlled indigo accents
- Stronger gradients
- Richer GSAP storytelling
- Premium transitions
- More visual depth

The public experience must still preserve readability, speed, accessibility, and restraint.

### 26.6 CMS styling

The CMS should use:

- Inter as the dominant font
- Satoshi only for selected page titles or branded moments
- Neutral surfaces
- Clear form hierarchy
- Restrained shadows
- Smaller motion effects
- Strong focus states
- Predictable spacing
- Clear success, warning, error, and information states

The CMS should feel calm, stable, and easy to operate for non-technical users.

### 26.7 Implementation boundary

The database stores editable content and approved presentation choices.

The codebase controls:

- Component structure
- Responsive behavior
- Layout logic
- Design tokens
- Animation implementation
- Accessibility behavior
- Interactive states
- Visual fallbacks

The complete implementation rules belong in `DESIGN_SYSTEM.md`.

---

## 27. Animation Architecture

GSAP should be used for:

- Hero entrance sequences
- Scroll-based storytelling
- Premium section transitions
- Complex controlled motion
- High-value visual emphasis

CSS transitions should be used for:

- Button states
- Hover states
- Focus states
- Small interface transitions
- Simple visibility changes

### 27.1 Animation ownership

Animation logic must remain in code.

The CMS may control approved animation content or variants, such as:

- Whether animation is enabled
- A named animation preset
- Approved delay levels
- Approved emphasis levels
- Approved media or text used by the animation

The CMS must not store or execute arbitrary GSAP code, JavaScript, CSS keyframes, or selector logic.

### 27.2 GSAP implementation rules

Animation components should:

- Use `useGSAP()` or `gsap.context()` for lifecycle cleanup
- Respect React Strict Mode
- Prefer transforms and opacity
- Avoid layout-thrashing properties
- Avoid blocking interaction
- Avoid causing layout shift
- Respect `prefers-reduced-motion`
- Be tested on mobile
- Clean up timelines, triggers, and observers
- Avoid excessive simultaneous effects

### 27.3 Public and CMS motion levels

The public website may use expressive motion when it supports hierarchy and storytelling.

The CMS should use restrained motion focused on:

- Feedback
- Navigation
- State changes
- Drawer and modal transitions
- Save and validation feedback

The CMS must not use cinematic motion that slows down routine editing.

### 27.4 Responsive animation behavior

Animation intensity may be reduced on:

- Small mobile screens
- Low-powered devices
- Reduced-motion environments
- Complex data-heavy CMS views

The same content must remain understandable without animation.

### 27.5 Motion governance

Reusable animation timings, easing presets, stagger values, and reduced-motion behavior should be defined centrally in `DESIGN_SYSTEM.md`.

New animation patterns should not be introduced independently inside unrelated components without review.

---

## 28. Error Handling Architecture

The application should use layered error handling.

### 28.1 Public errors

Public users should receive:

- Clear messages
- No stack traces
- No internal database details
- Recovery actions where possible

### 28.2 Admin errors

Admins may receive:

- Helpful validation errors
- Actionable save failures
- Retry options
- Clear permission errors

### 28.3 Server logging

Server logs should include:

- Operation
- Error category
- Related entity ID
- Safe technical context
- Timestamp

Do not log:

- Passwords
- API keys
- Service-role keys
- Full private conversations without need
- Sensitive personal data unnecessarily

---

## 29. Security Architecture

Security must be applied across:

- Authentication
- Authorization
- RLS
- Server boundaries
- Validation
- File uploads
- Chat
- Forms
- Email
- Environment variables

Required rules:

- Never expose service-role credentials
- Never trust browser input
- Validate all mutations
- Protect admin routes
- Restrict private tables
- Apply rate limiting
- Sanitize risky content
- Validate uploaded files
- Use secure cookies
- Avoid unsafe raw HTML
- Verify webhooks
- Keep secrets out of Git

---

## 30. Privacy Architecture

The platform operates in Germany and should support European privacy requirements.

Architecture must support:

- Consent capture
- Privacy notices
- Data retention
- Data deletion
- Communication preferences
- Conversation deletion
- Lead deletion
- Export workflows when required
- Cookie controls when non-essential tracking is added

Only necessary personal data should be collected.

---

## 31. Caching Architecture

Caching should improve speed without serving stale private data.

Cache public published content only.

Do not cache:

- Private admin data
- Leads
- Conversations
- Auth sessions
- Internal notes
- Sensitive settings

Use cache invalidation after successful CMS updates.

---

## 32. Environment Configuration

Environment variables should be separated by environment.

Typical variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
AI_API_KEY
AI_BASE_URL
AI_MODEL
NEXT_PUBLIC_SITE_URL
```

Rules:

- Public variables may be exposed to the browser
- Secret variables must remain server-only
- `.env.local` must not be committed
- `.env.example` should contain names only
- Production variables should be configured in Vercel
- Preview and production environments may use separate backends where needed

---

## 33. Database Change Architecture

All schema changes must use migrations.

Workflow:

```text
Create migration
↓
Review SQL
↓
Apply to development
↓
Test constraints and RLS
↓
Update generated types
↓
Run application checks
↓
Commit migration
↓
Apply to production through approved workflow
```

Direct manual production changes should be avoided.

Seed data should be stored in approved SQL seed files.

Docker is not required.

---

## 34. Type Safety Architecture

Type safety should cover:

- Database records
- Form inputs
- Server actions
- API responses
- Section schemas
- Translation objects
- Chat messages
- Email templates

Supabase database types should be generated after schema changes.

Zod schemas should validate runtime data.

TypeScript types alone do not validate external input.

---

## 35. Testing Architecture

Testing should be layered.

### 35.1 Static checks

- TypeScript
- ESLint
- Production build

### 35.2 Unit tests

Suitable for:

- Translation helpers
- Validation schemas
- Permission helpers
- Data transformers
- Chat logic
- Email template logic

### 35.3 Component tests

Suitable for:

- CMS forms
- Section rendering
- Empty states
- Error states
- Language switching

### 35.4 End-to-end tests

Suitable for:

- Admin login
- Content editing
- Publishing
- Public content display
- Contact form
- Chat flow
- Human takeover
- Email-trigger flow

### 35.5 Database tests

Suitable for:

- RLS
- Public read rules
- Admin write rules
- Private conversation access
- Migration correctness

---

## 36. Deployment Architecture

Deployment stack:

- GitHub
- Vercel
- Supabase
- Resend
- Approved AI provider

Workflow:

```text
Local development
↓
Git commit
↓
GitHub push
↓
Vercel preview deployment
↓
Review and test
↓
Production deployment
```

Database migrations must be handled deliberately.

Application deployment and database migration should not be treated as the same operation.

---

## 37. Observability Architecture

Initial observability may include:

- Vercel logs
- Supabase logs
- Resend delivery records
- Application error logging
- Basic analytics
- Core Web Vitals

Future additions may include:

- Error tracking
- Audit logs
- Conversation analytics
- Performance dashboards
- Structured application logs

Observability must not expose unnecessary personal data.

---

## 38. Feature Development Architecture

Every meaningful feature should follow:

```text
PROJECT.md scope
↓
Relevant docs
↓
OpenSpec proposal
↓
Requirements
↓
Design
↓
Tasks
↓
Implementation
↓
Review
↓
Testing
↓
Deployment
```

Architecture changes must update this document.

Feature-specific implementation details should remain in OpenSpec or the relevant technical document.

---

## 39. Architectural Decisions

Initial approved decisions:

1. Use Next.js App Router
2. Use Supabase as the backend platform
3. Use PostgreSQL through Supabase
4. Use a custom Next.js CMS
5. Use JSONB for multilingual content
6. Use a Section Registry
7. Use fixed homepage section order in version 1
8. Use Supabase Auth for admins
9. Use Supabase Storage for media
10. Use RLS for database access control
11. Use Zod for runtime validation
12. Use React Hook Form for CMS forms
13. Use GSAP for advanced motion
14. Use Resend for email
15. Use a replaceable AI provider layer
16. Use manual SQL migrations and seeds
17. Do not require Docker
18. Do not use Prisma initially
19. Do not build a general page-builder SaaS in version 1
20. Do not expose editable raw HTML, CSS, or JavaScript in the CMS

---

## 40. Future Architecture Options

Possible future architecture changes include:

- Additional admin roles
- Scheduled publishing
- Content versioning
- Multi-tenant architecture
- Customer portal
- White-label CMS
- Subscription billing
- Advanced CRM
- Voice chat
- AI-assisted translation
- Content approval workflows
- Realtime collaborative editing
- External CRM integration
- Calendar integration
- Queue-based email processing
- Background job infrastructure
- Search or vector retrieval
- Dedicated analytics warehouse

These are not part of the initial architecture unless approved through OpenSpec.

---

## 41. Architecture Constraints

The system must not:

- Expose service-role keys
- Trust client-side authorization
- Hardcode editable marketing content
- Permit arbitrary section code from Supabase
- Allow AI to change architecture without approval
- Perform database changes without migrations
- Store secrets in Git
- Allow public access to private conversations
- Allow admin actions without validation
- Add major dependencies without justification
- Add future features silently
- create unnecessary abstraction before it is needed

---

## 42. Definition of Architectural Completion

The initial architecture is successfully implemented when:

- Public and admin applications are clearly separated
- Supabase clients are correctly separated
- Admin routes are protected
- RLS protects private data
- Editable public content comes from Supabase
- The Section Registry renders approved components
- Multilingual content has a consistent strategy
- CMS mutations validate input
- Chat calls run securely on the server
- Human takeover stops automatic AI replies
- Resend calls run securely on the server
- Media uploads are controlled
- Production builds pass
- Deployment works on Vercel
- Architectural decisions are documented
- Future features can be added without rewriting the entire system

---

## 43. Related Documentation

This document should be read with:

```text
docs/PROJECT.md
docs/FRONTEND.md
docs/CMS.md
docs/DATABASE.md
docs/DESIGN_SYSTEM.md
docs/CHAT_SYSTEM.md
docs/EMAIL_SYSTEM.md
docs/ROADMAP.md
AGENTS.md
```

More specialized documents may be added later:

```text
docs/AUTHENTICATION.md
docs/SECURITY.md
docs/API.md
docs/DEPLOYMENT.md
docs/TESTING.md
docs/ENVIRONMENT.md
docs/SEO.md
docs/ANALYTICS.md
```

---

## 44. Architecture Summary

Stratifit uses a single Next.js application with clearly separated public and admin areas.

Supabase provides PostgreSQL, Auth, Storage, RLS, migrations, and typed data access.

The public website reads published CMS content.

The admin dashboard allows authorized users to manage structured content, media, leads, conversations, AI knowledge, and settings.

The Section Registry connects approved database content to approved React components.

The AI chat system runs through secure server-side routes and supports human takeover.

Resend handles transactional and operational email.

The architecture is designed for the current agency platform first, with controlled room for future growth.
