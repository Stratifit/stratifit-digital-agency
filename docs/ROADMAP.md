# ROADMAP.md — Stratifit Digital Agency Platform

**Project:** Stratifit Digital Agency  
**Document type:** Implementation roadmap and delivery sequence  
**Status:** Initial approved roadmap  
**Primary references:** `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/FRONTEND.md`, `docs/CMS.md`, `docs/DATABASE.md`, `docs/CHAT_SYSTEM.md`, `docs/EMAIL_SYSTEM.md`

---

## 1. Purpose

This document defines the implementation roadmap for the Stratifit Digital Agency Platform.

It organizes the work into clear phases so that:

- The architecture remains stable
- Database changes happen deliberately
- The public frontend and CMS remain aligned
- AI-assisted development stays controlled
- Each feature can be planned through OpenSpec
- Testing and deployment are included from the beginning
- Future ideas do not silently expand version 1

The roadmap is a delivery guide, not a substitute for feature-specific OpenSpec plans.

---

## 2. Roadmap Goals

The roadmap must help the team:

- Build in the correct order
- Avoid rework
- Protect the database and RLS foundation
- Keep the design system consistent
- Deliver usable increments
- Verify each phase before continuing
- Keep scope under control
- Support OpenCode and GLM-5.2
- Prepare for production deployment
- Leave room for approved future features

---

## 3. Version 1 Outcome

Version 1 should deliver:

- Premium multilingual public website
- Custom visual CMS
- Supabase database
- Supabase Auth
- Supabase Storage
- RLS
- Homepage and public pages
- Services
- Portfolio
- Insights
- Testimonials
- Pricing
- FAQ
- Contact and project enquiries
- Acquisition enquiries
- Media library
- Leads
- AI chatbot
- AI FAQ
- Human takeover
- Conversation inbox
- Resend email system
- Vercel deployment
- Documentation
- Testing and review

Version 1 does not include:

- Multi-tenant SaaS
- Customer portal
- Subscription billing
- White-label CMS
- General page builder
- Arbitrary drag-and-drop layouts
- Full CRM
- Voice calling
- Autonomous quoting
- Full marketing automation

---

## 4. Delivery Principles

### 4.1 Foundation before features

Do not begin large frontend or CMS feature development before:

- Documentation is approved
- Design tokens are defined
- Supabase structure is planned
- Auth and RLS strategy are clear
- Migration workflow is ready

### 4.2 Database before CMS forms

CMS forms must be based on approved schemas.

Do not build forms against temporary or guessed table structures.

### 4.3 Public components before visual preview

Visual preview should reuse stable public section components.

### 4.4 Security before production

RLS, authentication, permissions, validation, and secret handling must be completed before launch.

### 4.5 Incremental delivery

Each phase should produce a working, reviewable result.

---

## 5. Phase Overview

```text
Phase 0 — Documentation and project governance
Phase 1 — Local project foundation
Phase 2 — Design-system implementation
Phase 3 — Supabase foundation
Phase 4 — Authentication and admin shell
Phase 5 — Public layout and global content
Phase 6 — Homepage sections
Phase 7 — Core content collections
Phase 8 — CMS editors and visual preview
Phase 9 — Leads and public forms
Phase 10 — Chat and AI FAQ
Phase 11 — Human takeover and conversation inbox
Phase 12 — Resend email system
Phase 13 — SEO, accessibility, performance, and analytics
Phase 14 — Testing, hardening, and production launch
Phase 15 — Post-launch operations
```

---

## 6. Phase 0 — Documentation and Governance

### Objective

Establish the project source of truth before implementation.

### Required documents

```text
PROJECT.md
ARCHITECTURE.md
DESIGN_SYSTEM.md
FRONTEND.md
CMS.md
DATABASE.md
CHAT_SYSTEM.md
EMAIL_SYSTEM.md
ROADMAP.md
AGENTS.md
```

### Tasks

- Review all documents for consistency
- Confirm version 1 scope
- Confirm four core services
- Confirm homepage order
- Confirm languages
- Confirm brand colors
- Confirm Satoshi and Inter roles
- Confirm Supabase and Resend
- Confirm AI provider abstraction
- Confirm OpenSpec workflow
- Remove contradictory old documentation

### Completion criteria

- Core documents agree
- Major scope contradictions are resolved
- AI agents have clear instructions
- Version 1 exclusions are explicit

---

## 7. Phase 1 — Local Project Foundation

### Objective

Prepare a clean, stable Next.js project.

### Tasks

- Confirm Next.js project structure
- Confirm TypeScript strictness
- Confirm ESLint
- Confirm Tailwind
- Add shadcn/ui foundation
- Add Lucide Icons
- Add Zod
- Add React Hook Form
- Add GSAP and `@gsap/react`
- Add Supabase packages
- Add Resend package when needed
- Create environment-variable example
- Create server-only boundaries
- Create feature-folder conventions
- Confirm lint and production build

### Suggested deliverables

```text
src/app/
src/components/
src/features/
src/lib/
src/registry/
src/schemas/
src/types/
src/config/
```

Create folders only when used.

### Completion criteria

- Development server works
- Lint passes
- Build passes
- No unused major dependencies
- Environment strategy is documented

---

## 8. Phase 2 — Design-System Implementation

### Objective

Translate `DESIGN_SYSTEM.md` into reusable code.

### Tasks

- Load Satoshi
- Load Inter
- Create CSS variables
- Create Tailwind theme tokens
- Add color tokens
- Add spacing tokens
- Add radius tokens
- Add shadow tokens
- Add gradient tokens
- Add motion tokens
- Create base typography
- Create focus-visible styles
- Create reduced-motion behavior
- Create base Button
- Create Input
- Create Textarea
- Create Select
- Create Card
- Create Badge
- Create Container
- Create Section wrapper
- Create Skeleton
- Create Toast
- Create Dialog and Drawer

### Public and CMS separation

Public components may use:

- Larger typography
- Richer motion
- More visual depth

CMS components should use:

- Inter dominance
- Restrained motion
- Clear operational layouts

### Completion criteria

- Satoshi and Inter render correctly
- Core tokens are centralized
- Components have all interaction states
- Mobile and keyboard behavior are tested
- Reduced motion works

---

## 9. Phase 3 — Supabase Foundation

### Objective

Create the secure database and Storage foundation.

### Tasks

- Create or select development Supabase project
- Initialize Supabase CLI configuration
- Link project through CLI
- Create migration structure
- Create shared trigger functions
- Create `admin_users`
- Create admin helper functions
- Create media table
- Create global settings tables
- Create homepage tables
- Create content collection tables
- Create lead and chat tables
- Create AI settings tables
- Create email-event table
- Add indexes
- Add constraints
- Enable RLS
- Add public read policies
- Add admin policies
- Create Storage buckets
- Add Storage policies
- Create seed file
- Generate TypeScript database types

### Important rules

- No direct undocumented production SQL
- No service-role key in the browser
- No broad anonymous access to private tables
- No generic page-builder schema

### Completion criteria

- Migrations apply successfully
- Seeds apply predictably
- RLS tests pass
- Admin helper works
- TypeScript types are generated
- Storage policies work

---

## 10. Phase 4 — Authentication and Admin Shell

### Objective

Create secure admin access and the CMS application frame.

### Tasks

- Build admin login
- Build logout
- Add server-side session checks
- Protect admin routes
- Check active admin role
- Build admin sidebar
- Build top bar
- Build mobile admin navigation
- Build dashboard shell
- Build unauthorized page
- Add loading and error states
- Add basic user management for owner

### Admin navigation

```text
Dashboard
Website
Content
Communication
AI
Media
Settings
```

### Completion criteria

- Unauthorized users cannot access admin
- Disabled admins are rejected
- Owner can access all initial areas
- Mobile admin navigation works
- Admin shell follows design system

---

## 11. Phase 5 — Public Layout and Global Content

### Objective

Build the global public website frame.

### Tasks

- Build Announcement Bar
- Build Header
- Build desktop navigation
- Build mobile drawer
- Build language selector
- Build global PageShell
- Build Footer
- Connect navigation to Supabase
- Connect footer to Supabase
- Connect site settings
- Add global metadata defaults
- Add route-level loading and error states

### Complete public layout order

```text
Announcement Bar
Header / Navigation
Page content
Footer
```

### Completion criteria

- Global layout works on all public routes
- Announcement logic works
- Navigation is multilingual
- Header remains readable on scroll
- Footer is CMS-driven
- Mobile navigation is accessible

---

## 12. Phase 6 — Homepage Sections

### Objective

Build the homepage in approved order.

### Approved section order

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

### Tasks

- Build Section Registry
- Create Zod schema for each section
- Build public section component
- Add multilingual content resolution
- Add loading and safe-empty behavior
- Add approved animation
- Add reduced-motion behavior
- Connect to Supabase
- Add cache tags and revalidation paths

### Completion criteria

- All sections render in approved order
- Sections can be hidden
- Missing optional content does not break the page
- Motion is responsive and accessible
- Content comes from Supabase

---

## 13. Phase 7 — Core Content Collections

### Objective

Build dedicated public pages and detail routes.

### Services

- Services overview
- Service detail behavior if approved
- Related work
- CTA

### Portfolio

- Work listing
- Work detail
- Media gallery
- Related services
- Project results

### Insights

- Insight listing
- Insight detail
- Categories
- Related articles
- Structured content rendering

### Other pages

- About
- Acquisition
- Contact
- Privacy
- Imprint

### Completion criteria

- All approved routes exist
- Published filtering works
- Drafts remain private
- Metadata works
- Localized routes and content work
- Images are optimized

---

## 14. Phase 8 — CMS Editors and Visual Preview

### Objective

Make public content manageable through the custom CMS.

### Tasks

- Announcement Bar editor
- Header/navigation editor
- Footer editor
- Hero editor
- Homepage section editors
- Services editor
- Portfolio editor
- Insights editor
- Testimonials editor
- Pricing editor
- FAQ editor
- SEO fields
- Media selectors
- Language tabs
- Save actions
- Publish actions where needed
- Unsaved-change warnings
- Visual preview
- Mobile preview
- Tablet preview
- Desktop preview
- Revalidation after save

### Completion criteria

- Non-technical admin can edit content
- Preview uses public components
- Validation is clear
- Translations are preserved
- Public site updates after save
- Production side effects are disabled in preview

---

## 15. Phase 9 — Leads and Public Forms

### Objective

Capture and manage real enquiries.

### Public forms

- Contact
- Project enquiry
- Acquisition enquiry
- Optional newsletter interest

### Tasks

- Build Zod schemas
- Build Server Actions or Route Handlers
- Add spam protection
- Add rate limiting
- Add consent
- Store contacts and leads
- Avoid duplicates
- Build CMS lead list
- Build lead detail
- Add status changes
- Add assignment
- Add internal notes

### Completion criteria

- Forms validate
- Data is stored securely
- Duplicate protection works
- Leads are private
- Admin can manage lead status
- Success and error states are clear

---

## 16. Phase 10 — AI Chatbot and AI FAQ

### Objective

Implement the public AI assistant using approved knowledge and safe behavior.

### Tasks

- Build secure visitor session handling
- Build conversation creation
- Build message persistence
- Add AI provider abstraction
- Add approved knowledge retrieval
- Add system instructions
- Add output validation
- Add rate limiting
- Add spam controls
- Build public chat widget
- Build AI FAQ interface
- Add multilingual behavior
- Add safe provider fallback
- Add lead capture
- Add escalation triggers

### Completion criteria

- AI responds using approved knowledge
- Messages are stored
- Private data is protected
- AI avoids invented pricing and promises
- Supported languages work
- Provider failures fail safely
- Escalation can move a conversation to `waiting_for_admin`

---

## 17. Phase 11 — Conversation Inbox and Human Takeover

### Objective

Allow the Stratifit team to manage conversations directly.

### Tasks

- Build conversation inbox
- Add status and assignment filters
- Build conversation detail
- Add Realtime only where justified
- Add assignment
- Add internal notes
- Add escalation view
- Add Take Over action
- Stop AI in human mode
- Add admin replies
- Add Return to AI action
- Add resolve
- Add archive
- Add conversation events
- Add mobile admin reply experience

### Completion criteria

- Escalated chats appear in the CMS
- Human takeover stops automatic AI replies
- Admin replies are stored and delivered
- Internal notes remain private
- Conversation status and mode remain consistent
- Resolved conversations can reopen when appropriate

---

## 18. Phase 12 — Resend Email System

### Objective

Add reliable transactional and operational communication.

### Tasks

- Verify sender domain
- Configure Resend
- Build server-only email client
- Build typed templates
- Build contact acknowledgement
- Build new-lead notification
- Build acquisition notification
- Build chat escalation notification
- Build offline chat reply
- Build admin invitation
- Add plain-text fallbacks
- Add multilingual templates
- Add email-event logging
- Add idempotency
- Add webhook route
- Verify webhook signatures
- Add CMS email activity
- Add controlled retry

### Completion criteria

- Core templates send successfully
- Duplicate sends are prevented
- Webhooks update delivery statuses
- Failed sends are visible
- Public routes cannot send arbitrary emails
- Offline chat replies work

---

## 19. Phase 13 — SEO, Accessibility, Performance, and Analytics

### Objective

Prepare the experience for real public use.

### SEO tasks

- Localized metadata
- Canonical URLs
- Sitemap
- Robots directives
- Open Graph metadata
- Structured data
- Draft and admin no-index rules

### Accessibility tasks

- Keyboard review
- Focus review
- Contrast review
- Heading-order review
- Dialog and drawer review
- Form labels
- Error announcements
- Reduced-motion testing

### Performance tasks

- Image optimization
- Font optimization
- Client-JavaScript review
- Animation performance
- Cache review
- Revalidation review
- Core Web Vitals review

### Analytics tasks

- Add approved analytics
- Add consent behavior
- Avoid blocking scripts
- Verify event usefulness

### Completion criteria

- SEO metadata is complete
- Accessibility issues are resolved
- Performance is acceptable
- Analytics respect privacy and consent

---

## 20. Phase 14 — Testing, Hardening, and Launch

### Objective

Verify the complete system before production.

### Static checks

- ESLint
- TypeScript
- Production build

### Database checks

- Migrations
- Seeds
- RLS
- Storage policies
- Constraints
- Indexes

### End-to-end checks

- Admin login
- Content editing
- Publishing
- Public rendering
- Forms
- Leads
- Chat
- Human takeover
- Email
- Language switching
- Preview mode

### Security checks

- Secret exposure
- Admin access
- Service-role usage
- Webhook verification
- Public API abuse
- File uploads
- Private data access

### Launch tasks

- Configure production environment
- Configure Vercel
- Configure production Supabase project
- Configure Resend production settings
- Verify domain and DNS
- Apply production migrations
- Apply approved production seed defaults
- Deploy
- Run smoke tests
- Monitor logs

### Completion criteria

- Critical tests pass
- Production environment is configured
- Domain resolves
- Public site works
- Admin works
- Forms work
- Chat works
- Email works
- Rollback steps are documented

---

## 21. Phase 15 — Post-Launch Operations

### Objective

Stabilize and improve the platform after launch.

### Tasks

- Monitor errors
- Review lead flow
- Review chat questions
- Review unanswered AI topics
- Review email failures
- Review performance
- Review SEO indexing
- Review accessibility feedback
- Update chatbot knowledge
- Improve conversion points
- Add approved content
- Document operational lessons

### Completion criteria

- Major launch issues are resolved
- Knowledge remains current
- Lead and chat workflows are functioning
- Documentation reflects production reality

---

## 22. Suggested OpenSpec Changes

Major work should be divided into OpenSpec changes.

Suggested sequence:

```text
foundation-design-system
supabase-schema-foundation
admin-auth-shell
global-public-layout
homepage-sections
core-content-pages
cms-visual-editors
lead-capture-system
ai-chatbot
human-takeover
resend-email-system
production-hardening
```

Each change should include:

- Proposal
- Requirements
- Design
- Tasks
- Validation

---

## 23. Quality Gates

Each phase should pass these gates where relevant:

### Gate 1 — Documentation

- Docs agree
- Scope is approved
- No contradiction

### Gate 2 — Database

- Migration reviewed
- RLS tested
- Types generated

### Gate 3 — Design

- Follows design system
- Responsive
- Accessible
- Motion justified

### Gate 4 — Code

- Typed
- Validated
- Secure
- Maintainable

### Gate 5 — Verification

- Lint passes
- Build passes
- Tests pass
- OpenCode Review passes

---

## 24. Dependency Rules

Important dependencies:

```text
Design system
→ Public components
→ CMS preview

Database schema
→ Query layer
→ CMS forms
→ Public content

Auth and RLS
→ Admin CMS
→ Leads
→ Conversations

Chat persistence
→ Human takeover
→ Offline email follow-up

Resend event logging
→ CMS email activity
```

Do not implement dependent features before their foundations.

---

## 25. Priority Levels

### P0 — Required for launch

- Public website
- CMS
- Supabase database
- Authentication
- RLS
- Core public content
- Forms
- Leads
- Media library
- Chatbot
- Human takeover
- Transactional email
- SEO
- Accessibility
- Production deployment

### P1 — Valuable soon after launch

- Additional analytics
- More portfolio content
- Expanded chatbot knowledge
- Additional CMS filters
- Improved audit visibility
- Scheduled publishing
- Additional admin roles

### P2 — Future candidates

- Customer portal
- Multi-tenancy
- SaaS billing
- White-label CMS
- Voice AI
- Advanced CRM
- Marketing automation
- A/B testing
- Personalization

P1 and P2 work must not delay P0 launch requirements unless a new approved scope decision changes priorities.

---

## 26. Git Strategy

Recommended branch pattern:

```text
main
develop or preview branch when needed
feature/<feature-name>
fix/<issue-name>
```

Examples:

```text
feature/design-system
feature/supabase-schema
feature/admin-auth
feature/homepage
feature/chat-human-takeover
```

Use clear commits.

Avoid mixing unrelated features into one commit.

---

## 27. Definition of Version 1

Version 1 includes:

- Premium multilingual public website
- Announcement bar
- Header and footer
- Approved homepage sections
- Services
- Portfolio
- Insights
- About
- Acquisition
- Contact
- Legal pages
- Custom CMS
- Visual preview
- Responsive preview
- Supabase backend
- Admin authentication
- Media library
- Leads
- AI chatbot
- AI FAQ
- Conversation inbox
- Human takeover
- Resend transactional email
- SEO
- Accessibility
- Vercel deployment

---

## 28. Version 1 Exclusions

Version 1 excludes:

- Customer accounts
- Customer portal
- Multi-tenancy
- SaaS billing
- Subscription plans
- White-label CMS
- General drag-and-drop page builder
- Voice AI
- Full CRM
- Complex email campaigns
- Marketplace
- Plugin system
- Arbitrary design editing
- Arbitrary AI tool execution

---

## 29. Launch Readiness Checklist

### Content

- Homepage content approved
- Services approved
- Portfolio approved
- Testimonials verified
- Pricing reviewed
- FAQs reviewed
- Legal pages approved
- Translations reviewed

### Technical

- Build passes
- RLS tested
- Migrations applied
- Storage policies tested
- Environment variables configured
- Domain connected
- Backups considered

### UX

- Mobile reviewed
- Tablet reviewed
- Desktop reviewed
- Forms reviewed
- Chat reviewed
- Accessibility reviewed

### Communication

- Contact emails work
- Lead notifications work
- Chat escalation works
- Offline replies work
- Sender domain verified

### SEO

- Metadata complete
- Sitemap works
- Robots correct
- Canonicals correct
- Structured data validated

---

## 30. Roadmap Governance

The roadmap should be updated when:

- Scope changes
- A phase is completed
- A dependency changes
- A feature is postponed
- A launch requirement changes
- A new approved feature is added

Major roadmap changes should align with OpenSpec.

Completed work should be tracked in the approved project-tracking workflow.

The roadmap must remain consistent with:

- `PROJECT.md`
- `ARCHITECTURE.md`
- `DATABASE.md`
- `CMS.md`
- `FRONTEND.md`
- `CHAT_SYSTEM.md`
- `EMAIL_SYSTEM.md`

---

## 31. Future Roadmap Candidates

Possible future phases:

- Additional admin roles
- Scheduled publishing
- Content version history
- Approval workflows
- Customer portal
- White-label CMS
- Multi-tenant SaaS
- Billing
- Voice assistant
- Vector search
- CRM integrations
- Calendar booking
- Advanced reporting
- Automated backups
- Queue infrastructure
- Background jobs
- A/B testing
- Personalization

These require new scope approval.

---

## 32. Definition of Version 1 Completion

Version 1 is complete when:

- Public website is live
- CMS is usable
- Supabase schema is stable
- RLS protects private data
- Core content is editable
- Four languages are supported
- Media library works
- Leads are captured
- Chat works
- Human takeover works
- Email works
- SEO and accessibility are complete
- Tests pass
- Production deployment is stable
- Documentation matches the system

---

## 33. Related Documentation

Read this roadmap with:

```text
docs/PROJECT.md
docs/ARCHITECTURE.md
docs/DESIGN_SYSTEM.md
docs/FRONTEND.md
docs/CMS.md
docs/DATABASE.md
docs/CHAT_SYSTEM.md
docs/EMAIL_SYSTEM.md
AGENTS.md
```

Implementation details for each major phase should be defined through OpenSpec.

---

## 34. Roadmap Summary

The Stratifit platform should be built in a controlled sequence:

1. Documentation
2. Project foundation
3. Design system
4. Supabase database
5. Authentication and CMS shell
6. Public layout
7. Homepage
8. Content collections
9. Visual CMS
10. Leads
11. AI chat
12. Human takeover
13. Resend email
14. SEO, accessibility, and performance
15. Testing and launch
16. Post-launch improvement

This order reduces rework, protects security, and keeps the public website, CMS, database, chat, and email systems aligned.
