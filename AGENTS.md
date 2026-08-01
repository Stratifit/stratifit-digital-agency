# AGENTS.md — Stratifit Digital Agency Platform

**Project:** Stratifit Digital Agency  
**Location:** Repository root  
**Purpose:** Operating rules for AI coding agents and human contributors  
**Status:** Initial approved agent specification

---

## 1. Purpose

This file defines how AI coding agents and human contributors must work inside the Stratifit repository.

It applies to:

- OpenCode
- GLM-5.2
- Zed Assistant
- OpenCode Review
- Future coding agents
- Human developers

This file is an execution guide.

The documents inside `docs/` define the product and technical architecture.

This file defines how work must be performed.

---

## 2. Required Reading Order

Before making meaningful changes, read:

```text
1. AGENTS.md
2. docs/PROJECT.md
3. docs/ARCHITECTURE.md
4. docs/DESIGN_SYSTEM.md
5. docs/FRONTEND.md
6. docs/CMS.md
7. docs/DATABASE.md
8. docs/CHAT_SYSTEM.md
9. docs/EMAIL_SYSTEM.md
10. docs/ROADMAP.md
```

Then read:

- The relevant OpenSpec change
- The files directly related to the task
- Existing tests
- Existing migration files
- Existing schemas and types

Do not begin implementation from a prompt alone when the repository already contains approved documentation.

---

## 3. Source of Truth Priority

When instructions conflict, use this order:

```text
1. Explicit current user instruction
2. AGENTS.md
3. Approved OpenSpec change
4. docs/PROJECT.md
5. docs/ARCHITECTURE.md
6. Feature-specific documentation
7. Existing implementation
8. Assumptions
```

Existing code is not automatically correct.

If existing code conflicts with approved documentation, do not silently preserve the conflict.

Document it and implement the approved direction.

---

## 4. Approved Technology Stack

The approved stack is:

- Next.js 16
- React 19
- TypeScript
- App Router
- React Server Components
- Server Actions
- Route Handlers
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- GSAP
- `@gsap/react`
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Row Level Security
- Supabase CLI
- Zod
- React Hook Form
- Resend
- Vercel
- npm
- OpenSpec

Do not replace the approved stack without explicit approval.

---

## 5. Package Management

Use:

```text
npm
```

Do not introduce:

- pnpm
- Yarn
- Bun

unless explicitly approved.

Before installing a package:

1. Confirm the feature cannot be implemented cleanly with the existing stack
2. Confirm the package is maintained
3. Confirm it is compatible with Next.js 16 and React 19
4. Confirm it does not duplicate an existing dependency
5. Explain why it is required
6. Add it only after approval when it is a major dependency

Avoid dependency inflation.

---

## 6. Repository Structure

Preferred structure:

```text
src/
├── app/
├── components/
├── features/
├── lib/
├── registry/
├── schemas/
├── types/
├── actions/
├── hooks/
└── config/

supabase/
├── migrations/
├── seed.sql
└── config.toml

docs/
openspec/
public/
```

Create folders only when they are needed.

Do not create empty architectural folders for appearance.

---

## 7. Public and Admin Boundaries

The application contains two major areas:

```text
Public website
Admin CMS
```

Keep them clearly separated.

Public routes belong in the approved public route groups.

Admin routes belong under:

```text
/admin
```

Admin logic must not leak into public bundles.

Public UI and CMS UI may share primitives, but they must not share inappropriate visual intensity or authorization assumptions.

---

## 8. Server and Client Component Rules

Use Server Components by default.

Use Client Components only when required for:

- Browser state
- Event handlers
- React Hook Form
- GSAP
- Realtime subscriptions
- Dialogs
- Drawers
- Tabs
- Accordions
- Chat interaction
- Browser-only APIs

Do not mark an entire page as a Client Component because one nested component is interactive.

Keep client boundaries small.

---

## 9. Data Access Rules

Do not scatter raw Supabase queries throughout components.

Use feature-level modules.

Example:

```text
src/features/services/queries.ts
src/features/services/mutations.ts
src/features/services/schemas.ts
src/features/services/types.ts
```

Public queries must:

- Return published content only
- Return visible content only
- Select only needed fields
- Exclude private fields
- Resolve translations safely
- Use stable ordering

Avoid:

```ts
select("*")
```

in sensitive or performance-critical queries.

---

## 10. Supabase Client Rules

Maintain separate clients for:

- Browser
- Server
- Service role

### Browser client

May use only public environment variables.

### Server client

Use for:

- Server Components
- Server Actions
- Route Handlers
- Authenticated reads
- Authenticated mutations

### Service-role client

Use only for documented trusted server operations.

Never:

- Import it into Client Components
- Expose it to the browser
- Use it merely to avoid writing correct RLS
- Commit its key

Preferred rule:

> Use user-session access with RLS first. Use service-role access only when necessary.

---

## 11. Database Rules

All database changes must use migrations.

Migration path:

```text
supabase/migrations/
```

Naming:

```text
YYYYMMDDHHMMSS_description.sql
```

Do not:

- Change production tables manually without a migration
- Create undocumented tables
- Add columns only through the Supabase dashboard
- Remove RLS to make code work
- Use broad anonymous policies
- Store secrets in database content tables

After schema changes:

1. Apply and test the migration
2. Test constraints
3. Test RLS
4. Update seeds
5. Generate database types
6. Update relevant documentation
7. Run lint and build

---

## 12. Database Architecture Rules

Use purpose-built tables.

Do not recreate the old generic architecture based on:

```text
pages
sections
content_blocks
translations
```

The approved architecture uses dedicated tables for major business concepts.

Use JSONB primarily for:

- Multilingual content
- Bounded structured content
- Metadata
- Approved configuration

Use relational columns for:

- IDs
- Status
- Ownership
- Ordering
- Relationships
- Frequently filtered values

---

## 13. Multilingual Rules

Supported languages:

```text
en
de
fr
es
```

English is the default.

Translatable fields use approved JSONB objects.

Example:

```json
{
  "en": "Website Development",
  "de": "Webentwicklung",
  "fr": "Développement web",
  "es": "Desarrollo web"
}
```

Rules:

- Preserve all language keys
- Fall back to English
- Do not mix languages in one public response
- Do not overwrite valid translations accidentally
- Validate translation shape with Zod
- Keep locale behavior centralized

---

## 14. CMS Rules

The CMS uses structured forms.

It must not expose:

- Raw SQL
- Raw CSS
- Raw JavaScript
- Arbitrary HTML
- Arbitrary Tailwind classes
- Arbitrary GSAP code
- Arbitrary section types
- Unrestricted JSON editing

The CMS may control only approved presentation options such as:

- Visibility
- Approved variant
- Alignment
- Media position
- Background mode
- Accent mode
- Animation preset
- Animation intensity

The codebase controls layout and behavior.

---

## 15. Section Registry Rules

Every dynamic section must be registered.

The registry should define:

- Section key
- React component
- Zod schema
- Editor configuration
- Approved variants
- Preview support
- Defaults

Do not render arbitrary component names from the database.

Do not create a new section type without:

1. Approved requirement
2. OpenSpec change where significant
3. Public component
4. Schema
5. CMS editor support
6. Preview support
7. Documentation update

---

## 16. Homepage Order

The complete public layout is:

```text
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
```

Global layout components:

- Announcement Bar
- Header / Navigation
- Footer

Homepage content sections:

- Hero through Final CTA

Do not add drag-and-drop section ordering in version 1.

---

## 17. Editable Content Rules

Editable marketing content belongs in Supabase.

Examples:

- Headings
- Paragraphs
- Buttons
- Links
- Services
- Testimonials
- Pricing
- FAQs
- Navigation
- Footer
- SEO
- Chatbot knowledge

Code may contain:

- System labels
- Validation messages
- Accessibility labels
- Safe fallbacks
- Technical errors
- Section identifiers
- Design tokens
- Animation logic

Rule:

> Do not hardcode editable marketing content.

---

## 18. Design System Rules

Approved foundation:

```text
Background:       #0B0F17
Background Deep:  #070A10
Surface:          #111827
Surface Soft:     #151E2D
Elevated Surface: #182235
Surface Hover:    #1D293B
Surface Active:   #243249
Primary:          #F59E0B
Primary Hover:    #E89008
Primary Active:   #D97706
Primary Light:    #FBBF24
Primary Dark:     #B45309
Secondary:        #4F46E5
Secondary Hover:  #4338CA
Secondary Light:  #6366F1
Text Primary:     #FFFFFF
Text Secondary:   #B8C0CC
Text Muted:       #9CA3AF
Text Subtle:      #6B7280
Border:           #1F2937
Border Soft:      #18212F
Border Strong:    #2B374A
```

Amber is the dominant brand accent.

Indigo is a limited supporting accent.

Do not introduce new brand colors without approval.

---

## 19. Typography Rules

Use:

```text
Satoshi
→ Hero headings
→ Section headings
→ Card titles
→ Large figures
→ Brand expression

Inter
→ Body copy
→ Navigation
→ Buttons
→ Forms
→ CMS
→ Tables
→ Labels
→ Chat
```

Principle:

> Satoshi provides brand personality. Inter provides readability and usability.

Do not introduce additional font families without approval.

---

## 20. Styling Rules

Use approved tokens by default.

Avoid:

- Repeated arbitrary values
- Inline style strings
- Hardcoded colors throughout components
- Random spacing
- Inconsistent radii
- Excessive glows
- Excessive gradients
- Duplicate utility patterns

Arbitrary values may be used only when:

- No token solves the need
- The requirement is technically justified
- The value is reviewed
- It does not duplicate an existing token
- It becomes a token when reused

---

## 21. Public Website Styling

The public website may use:

- Larger Satoshi typography
- Richer visual composition
- Controlled amber glows
- Limited indigo accents
- GSAP storytelling
- Premium transitions
- More depth

It must remain:

- Fast
- Readable
- Accessible
- Focused
- Mobile-friendly

Do not overdecorate.

---

## 22. CMS Styling

The CMS should use:

- Inter as the dominant font
- Satoshi only for selected high-level titles
- Neutral surfaces
- Restrained shadows
- Minimal motion
- Strong focus states
- Clear forms
- Clear statuses
- Predictable spacing

Do not use cinematic public-site motion in routine CMS views.

---

## 23. GSAP Rules

Use GSAP for:

- Hero sequences
- Scroll storytelling
- Complex reveals
- Controlled parallax
- Premium transitions

Use CSS transitions for:

- Hover
- Focus
- Button states
- Small interface changes

Always:

- Use `useGSAP()` or `gsap.context()`
- Clean up timelines
- Clean up ScrollTriggers
- Scope selectors
- Prefer transforms and opacity
- Respect reduced motion
- Test mobile
- Avoid layout shift
- Avoid blocking interaction

Animation logic remains in code.

The CMS must not store arbitrary GSAP code.

---

## 24. Accessibility Rules

Every feature must consider:

- Keyboard navigation
- Focus-visible states
- Semantic HTML
- Heading order
- Form labels
- Error announcements
- Dialog focus management
- Reduced motion
- Contrast
- Touch targets
- Alt text

Do not consider accessibility an optional final step.

---

## 25. Form Rules

Use:

- React Hook Form where interactive client forms are needed
- Zod for runtime validation
- Server-side validation for every mutation

Client validation alone is not sufficient.

Forms must define:

- Loading
- Success
- Error
- Disabled
- Validation
- Duplicate-submission behavior

Public forms must include spam protection and rate limiting.

---

## 26. Action Result Pattern

Preferred result pattern:

```ts
type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };
```

Do not return raw database or provider errors to users.

---

## 27. Authentication Rules

Supabase Auth is used for admin authentication.

Admin routes must enforce:

- Valid session
- Active admin record
- Approved role
- Server-side authorization
- RLS

UI hiding is not authorization.

---

## 28. RLS Rules

RLS must remain enabled.

Public users may read only approved published content.

Public users must not read:

- Leads
- Contacts
- Private conversations
- Internal notes
- Email events
- Admin users
- Draft content
- Private settings

Do not weaken RLS to make a feature pass.

Fix the access design.

---

## 29. Chat System Rules

The AI chatbot must:

- Use approved knowledge
- Stay within approved business facts
- Use the visitor’s language
- Escalate when uncertain
- Preserve conversation history
- Stop automatic replies in human mode

The AI must not invent:

- Prices
- Discounts
- Timelines
- Availability
- Testimonials
- Results
- Guarantees
- Human approvals

Human takeover must be explicit.

---

## 30. Email System Rules

Resend calls must be server-side.

Use:

- Approved template keys
- Validated template data
- Idempotency
- Email event logging
- Verified webhooks
- Controlled retries

Public routes must not accept arbitrary:

- Recipient
- Subject
- Sender
- Body
- Reply-to

Prevent open-relay behavior.

---

## 31. Media Rules

Use Supabase Storage.

Media must include:

- Bucket
- Path
- MIME type
- File size
- Width and height where relevant
- Alt text
- Caption where relevant
- Uploaded-by metadata

Do not use permanent public URLs as the source of truth.

Generate URLs from bucket and path.

Validate uploads.

---

## 32. Security Rules

Never expose:

- Supabase service-role key
- Resend API key
- AI provider key
- Webhook secret
- Private database records
- Internal notes
- Raw stack traces

Never commit:

- `.env.local`
- Secret keys
- Passwords
- Production tokens

Validate all external input.

---

## 33. OpenSpec Workflow

Meaningful features and architecture changes should follow:

```text
Proposal
↓
Requirements
↓
Design
↓
Tasks
↓
Implementation
↓
Validation
```

Suggested change groups are defined in `docs/ROADMAP.md`.

Do not create unnecessary OpenSpec changes for trivial formatting fixes.

Do create OpenSpec changes for:

- New database domains
- Major routes
- Major CMS modules
- Chat architecture
- Email architecture
- New roles
- Security changes
- New major dependencies
- Scope changes

---

## 34. Documentation Rules

Update documentation when changing:

- Architecture
- Database schema
- CMS behavior
- Frontend behavior
- Design tokens
- Chat behavior
- Email behavior
- Version 1 scope
- Roadmap dependencies

Do not let documentation drift from the implementation.

---

## 35. Testing Rules

At minimum, run relevant checks after changes.

Required baseline:

```text
npm run lint
npm run build
```

Run type checking separately if the project defines a script.

Add or run tests for:

- Validation
- RLS
- Forms
- CMS editing
- Chat
- Human takeover
- Email idempotency
- Critical routes

Do not claim a feature is complete without verification.

---

## 36. Command Rules

Use repository scripts from `package.json`.

Typical commands may include:

```bash
npm install
npm run dev
npm run lint
npm run build
npm run test
npm run test:e2e
```

Do not invent scripts that do not exist.

Inspect `package.json` first.

Supabase CLI commands must be verified against the installed CLI version before use.

---

## 37. Build and Review Rules

Before completing meaningful work:

1. Review changed files
2. Confirm no accidental scope expansion
3. Run lint
4. Run build
5. Run relevant tests
6. Review RLS if database-related
7. Review mobile behavior if UI-related
8. Review accessibility
9. Update documentation
10. Run OpenCode Review when applicable

---

## 38. Destructive Action Rules

Do not perform destructive actions without explicit approval.

Examples:

- Dropping tables
- Deleting production content
- Rewriting migration history
- Force-pushing shared branches
- Removing Storage buckets
- Deleting user accounts
- Removing production environment variables
- Disabling RLS

Prefer reversible actions.

Before destructive changes:

- Explain impact
- Confirm target environment
- Confirm backup or rollback
- Use migration or version control

---

## 39. Git Rules

Use clear branches and commits.

Recommended branches:

```text
feature/<name>
fix/<name>
```

Do not mix unrelated work.

Do not commit:

- Secrets
- Build output
- Temporary logs
- Local environment files
- Unapproved generated artifacts

Do not force push without explicit approval.

---

## 40. Code Quality Rules

Code should be:

- Typed
- Readable
- Small enough to understand
- Explicit at security boundaries
- Reusable without over-abstraction
- Consistent with existing patterns

Avoid:

- `any`
- Giant components
- Hidden side effects
- Duplicate schemas
- Duplicate query logic
- Deep prop drilling where avoidable
- Premature abstraction
- Unnecessary comments
- Dead code

Use comments for reasoning, not for restating obvious code.

---

## 41. Error Handling Rules

Errors should be normalized.

Public users receive:

- Friendly messages
- No internal details
- Recovery guidance

Admins receive:

- Actionable messages
- Validation details
- Safe technical context

Logs may include:

- Operation
- Entity ID
- Error category
- Safe context

Do not log secrets.

---

## 42. Performance Rules

Prioritize:

- Server rendering
- Small client boundaries
- Image optimization
- Controlled animation
- Cache tags
- Revalidation
- Pagination
- Narrow Realtime subscriptions
- Efficient font loading

Avoid:

- Loading all records
- Multiple animation libraries
- Excessive third-party scripts
- Full-page client hydration
- Unnecessary polling
- Large unoptimized media

---

## 43. Preview Rules

CMS preview must:

- Use public components
- Accept draft data
- Avoid analytics
- Avoid email sends
- Avoid lead creation
- Avoid public indexing
- Avoid production side effects
- Support mobile, tablet, and desktop frames

Preview is not the source of truth.

Supabase remains the source of truth after save.

---

## 44. AI Agent Behavior

AI coding agents must:

- Inspect before changing
- Read relevant docs
- Reuse existing patterns
- Avoid speculative architecture
- Avoid unapproved dependencies
- Avoid silent scope growth
- Be honest about failures
- Preserve working code
- Prefer small reviewable changes
- Explain major decisions in commit or task notes

Do not rewrite large areas unless necessary.

---

## 45. Prohibited Agent Actions

Agents must not:

- Expose secrets
- Disable RLS
- Create arbitrary admin access
- Invent database tables
- Invent section types
- Invent business claims
- Hardcode editable content
- Add unsupported fonts or colors
- Add arbitrary CSS systems
- Replace npm
- Replace the approved stack
- Introduce a generic page builder
- Introduce multi-tenancy
- Introduce billing
- Execute destructive production actions without approval

---

## 46. Definition of Done

A task is complete only when:

- Requirements are satisfied
- Code follows architecture
- Design follows tokens
- Data access follows RLS
- Inputs are validated
- Errors are handled
- Mobile behavior is reviewed
- Accessibility is reviewed
- Relevant tests pass
- Lint passes
- Build passes
- Documentation is updated
- No secrets are exposed
- No unapproved scope was added

---

## 47. Task Completion Report

When finishing meaningful work, report:

- What changed
- Files changed
- Database migrations added
- Tests run
- Lint result
- Build result
- Known limitations
- Follow-up work required

Do not claim checks passed if they were not run.

---

## 48. Project Summary for Agents

Stratifit is a premium multilingual digital agency platform consisting of:

- Public marketing website
- Custom visual CMS
- Supabase backend
- Multilingual JSONB content
- Media library
- Leads
- AI chatbot
- AI FAQ
- Conversation inbox
- Human takeover
- Resend email system
- Vercel deployment

The project is dark-mode-first.

Primary brand color:

```text
#F59E0B
```

Primary fonts:

```text
Satoshi
Inter
```

The platform is built for the current Stratifit agency first.

Do not silently turn it into a generic SaaS platform.
