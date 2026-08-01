# PROJECT.md — Stratifit Digital Agency Platform

**Project:** Stratifit Digital Agency
**Project type:** Premium multilingual agency website with a custom visual CMS
**Status:** Active development
**Primary market:** Germany and international clients
**Default language:** English
**Supported languages:** English, German, French, and Spanish

---

## 1. Project Overview

Stratifit is a premium digital agency website and internal content-management platform built with Next.js and Supabase.

The public website must demonstrate the quality of work Stratifit can deliver to customers. It should look modern, professional, trustworthy, fast, responsive, and visually refined.

The website itself acts as a live example of Stratifit’s capabilities in:

* Website design and development
* Brand identity
* UI/UX design
* Digital systems
* AI and automation
* Content management
* Multilingual websites
* Performance and SEO

The platform includes:

1. A public-facing digital agency website
2. A custom CMS and admin dashboard
3. A Supabase-powered content backend
4. A multilingual content system
5. A visual section-editing experience
6. An AI chatbot and AI FAQ assistant
7. A shared customer-conversation inbox
8. Lead and contact management
9. Email notifications and follow-up through Resend

The current goal is not to build a general-purpose commercial page builder. The immediate goal is to create an exceptional Stratifit agency platform that can later provide a foundation for additional products and client systems.

---

## 2. Project Vision

The Stratifit website should make visitors think:

> “This agency clearly knows how to build professional digital experiences. I would trust them to build something like this for my business.”

The platform must combine premium visual design with a powerful but easy-to-use content-management system.

Non-technical administrators should be able to update website content without editing code or working directly with database tables.

The long-term vision is to gradually expand Stratifit into a broader digital operating platform, but only after the agency website and internal CMS are stable, polished, secure, and successfully deployed.

---

## 3. Primary Objectives

### 3.1 Build a premium agency website

The public website must:

* Look professional and high-end
* Build trust with potential customers
* Clearly communicate Stratifit’s services
* Showcase portfolio projects and expertise
* Generate enquiries and qualified leads
* Work correctly across mobile, tablet, laptop, and desktop
* Load quickly and follow modern accessibility practices
* Use purposeful animations without reducing usability
* Support multilingual content
* Be optimized for search engines and social sharing

### 3.2 Build a custom internal CMS

The CMS must allow authorized administrators to:

* Create, read, update, and delete supported content
* Edit all public website sections
* Edit content through structured, user-friendly forms
* Preview sections visually
* Preview mobile, tablet, and desktop layouts
* Manage multilingual content
* Upload and reuse media
* Manage SEO metadata
* Manage navigation and footer content
* Publish or hide supported content
* Manage leads and customer conversations
* Configure chatbot and email settings

### 3.3 Make editable content Supabase-driven

Editable public content must be stored in Supabase and managed through the CMS.

This includes:

* Headings
* Descriptions
* Images
* Videos
* Buttons and links
* Services
* Process steps
* Why Stratifit content
* Insights and articles
* Portfolio projects
* Testimonials
* Pricing content
* FAQs
* Calls to action
* Navigation
* Footer content
* SEO metadata
* Chatbot knowledge

The application structure, components, validation messages, system labels, accessibility labels, technical fallbacks, and internal implementation details may remain in code.

The correct rule is:

> No hardcoded editable marketing content.

---

## 4. Target Customers

### 4.1 Startups and growing businesses

Companies that need:

* Professional websites
* Landing pages
* Brand identity
* UI/UX design
* Digital transformation
* AI-powered business systems
* Marketing automation
* SEO and performance improvements

### 4.2 Established businesses

Businesses that want to:

* Modernize an outdated website
* Improve customer trust
* Generate more leads
* Improve online conversion
* Introduce multilingual content
* Automate repetitive workflows
* Improve website speed and usability

### 4.3 Professional service companies

Examples include:

* Consultants
* Agencies
* Medical and dental practices
* Law firms
* Real-estate companies
* Financial service companies
* Local service businesses
* Educational organizations

### 4.4 Internal Stratifit operations

The platform will also support:

* Stratifit’s own content management
* Lead collection
* Customer enquiries
* Portfolio management
* Publishing insights
* Chat and support follow-up
* Marketing and sales operations

---

## 5. Core Services

Stratifit provides four primary service categories.

These categories define the initial service structure for the public website, CMS, chatbot knowledge base, portfolio classification, lead forms, and SEO architecture.

Public-facing titles, descriptions, deliverables, buttons, images, icons, and translations must be editable through the CMS and stored in Supabase.

### 5.1 Brand Design

Stratifit creates distinctive brand identities that communicate credibility, personality, and strategic positioning.

Initial deliverables include:

* Brand strategy
* Logo design
* Visual identity
* Color systems
* Typography systems
* Brand guidelines
* Brand asset kits
* UI/UX visual direction

### 5.2 Website Development

Stratifit designs and develops high-performance websites and web applications engineered for speed, scalability, usability, and conversion.

Initial deliverables include:

* Custom business websites
* Landing pages
* E-commerce websites
* Web applications
* Responsive development
* CMS integration
* Headless CMS solutions
* Multilingual websites
* Performance optimization
* Website maintenance

### 5.3 AI and Automation

Stratifit builds intelligent systems that reduce repetitive work, improve customer communication, qualify leads, and support business operations.

Initial deliverables include:

* AI chatbots
* AI FAQ assistants
* AI lead qualification
* Workflow automation
* Customer-support automation
* Internal knowledge assistants
* Email automation
* CRM integrations
* Custom API integrations
* Business-process automation

### 5.4 Growth and Marketing

Stratifit develops data-driven growth systems that improve visibility, attract qualified audiences, and support measurable business growth.

Initial deliverables include:

* Search engine optimization
* Search engine marketing
* Performance marketing
* Content strategy
* Social media strategy
* Conversion-rate optimization
* Analytics and reporting
* Campaign landing pages
* Technical SEO
* Growth audits

### 5.5 Service Content Rules

Each service record should support:

* Title
* Short description
* Full description
* Key deliverables
* Icon or visual
* Featured image
* CTA label
* CTA destination
* Slug
* SEO title
* SEO description
* Display status
* Featured status
* Multilingual translations

Service content must be manageable through the CMS.

The initial public service categories are fixed, but administrators may edit their content and deliverables.

Adding or removing a major service category should require an approved product decision and, where necessary, an OpenSpec change.

---

## 6. Public Website Pages

The initial website should include:

* Home
* Services
* Work or Portfolio
* Insights
* About
* Acquisition — Buy a Business
* Contact
* Privacy Policy
* Legal Notice or Impressum
* Terms, when required

Additional pages may be added when approved.

Routes should be clear and intentional. A general dynamic catch-all page builder is not required for the first version.

Suggested routes:

```text
/
/services
/work
/insights
/insights/[slug]
/about
/acquisition
/contact
/privacy
/imprint
```

---

## 7. Homepage Structure

The approved homepage section order is:

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
13. Footer

This order is fixed for the initial version.

Drag-and-drop section ordering is not required in version 1. It may be introduced later if it provides meaningful value.

Each supported section should be:

* Connected to Supabase
* Editable through the CMS
* Multilingual where applicable
* Responsive
* Previewable in the admin dashboard
* Configurable as visible or hidden where appropriate
* Rendered through a registered section component
* Validated before saving

---

## 8. Public Website Experience

The public website should communicate:

* What Stratifit does
* Who Stratifit helps
* Why customers should trust Stratifit
* How the agency works
* What results or projects Stratifit has delivered
* What services are available
* How a potential customer can start a project

The design should feel:

* Premium
* Modern
* Technical
* Strategic
* Clear
* Confident
* Trustworthy
* Spacious
* Consistent
* Easy to navigate

Animations must support the content rather than distract from it.

The website must remain usable when:

* Animations are reduced
* JavaScript is loading
* Images fail
* Content is temporarily unavailable
* A visitor uses a smaller mobile device
* A visitor uses keyboard navigation

---

## 9. CMS and Admin Dashboard

The admin dashboard is an internal system for authorized Stratifit administrators.

It should be organized around website content and business workflows rather than raw database tables.

Suggested navigation:

```text
Dashboard

Website
├── Home
│   ├── Hero
│   ├── Trusted By
│   ├── Services
│   ├── Process
│   ├── Why Choose Us
│   ├── Insights & Expertise
│   ├── Portfolio
│   ├── Acquisition
│   ├── Testimonials
│   ├── Pricing
│   ├── FAQ
│   └── Final CTA
├── About
├── Services
├── Work
├── Insights
├── Acquisition
├── Contact
├── Navigation
└── Footer

Content
├── Services
├── Portfolio Projects
├── Insights
├── Testimonials
├── FAQs
└── Pricing

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
├── SEO
├── Social Links
├── Design Tokens
├── Email
└── Users
```

### 8.1 CMS capabilities

The CMS should provide:

* CRUD operations
* Structured editing forms
* Visual section previews
* Desktop preview
* Tablet preview
* Mobile preview
* Multilingual editing
* Media upload and selection
* Visibility controls
* Validation and helpful errors
* Unsaved-change warnings
* Save confirmation
* Authentication and authorization
* Safe deletion workflows
* Empty states
* Loading states
* Error states

### 8.2 Visual editing

Visual editing means an administrator can:

1. Open a website section in the CMS
2. See a preview representing the public section
3. Edit text, images, links, buttons, and supported settings
4. Preview the result at different viewport sizes
5. Save the changes
6. Store the updated values in Supabase
7. See the updated content on the public website

Visual editing does not initially mean unrestricted page-builder functionality.

The CMS should not allow administrators to accidentally break the component structure or enter unsupported design values.

---

## 10. Multilingual Content System

The platform supports:

* English — default
* German
* French
* Spanish

Multilingual content should generally use JSONB objects:

```json
{
  "en": "English content",
  "de": "German content",
  "fr": "French content",
  "es": "Spanish content"
}
```

The exact database implementation will be defined in `DATABASE.md`.

The multilingual system must support:

* Language-specific page content
* Navigation labels
* Buttons
* Services
* Portfolio content
* Insights
* FAQs
* SEO metadata
* Chatbot knowledge
* Fallback to English when an approved translation is unavailable

Administrators should be able to switch languages clearly while editing.

The CMS should indicate:

* Missing translations
* Incomplete translations
* Default-language content
* Published translation status, when implemented

---

## 11. Section Registry

The Section Registry connects CMS section records to approved React components.

The registry should:

* Define supported section types
* Map each type to a React component
* Define the expected content schema
* Define validation requirements
* Prevent unsupported components from being rendered
* Provide safe fallback behavior
* Support future section variants

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
};
```

The exact implementation belongs in `ARCHITECTURE.md` and `FRONTEND.md`.

---

## 12. AI Chat and Customer Communication System

The website will include a focused AI customer-support and lead-conversation system.

This is not currently a general multi-agent development platform.

### 11.1 AI chatbot

The chatbot should:

* Answer questions about Stratifit
* Explain services
* Answer common questions
* Help visitors identify suitable services
* Direct visitors to relevant pages
* Collect lead information
* Store conversations in Supabase
* Allow human takeover
* Escalate unanswered or sensitive questions
* Avoid inventing prices, promises, policies, timelines, or capabilities
* Use approved Stratifit knowledge as its primary source

### 11.2 AI FAQ assistant

The AI FAQ assistant should provide conversational answers based on approved knowledge.

Knowledge may include:

* Published FAQ records
* Services
* Process information
* Portfolio descriptions
* Pricing guidance
* Website page content
* Approved chatbot knowledge articles
* Business rules

The standard FAQ section and AI FAQ assistant may use the same approved knowledge while offering different user experiences.

### 11.3 Conversation inbox

Administrators should be able to view all stored conversations.

Conversation statuses may include:

* AI handling
* Waiting for admin
* Human handling
* Waiting for visitor
* Resolved
* Archived

Each conversation should support:

* Visitor identity when provided
* Visitor email when provided
* Message history
* AI and human message identification
* Current page or source
* Lead status
* Assigned administrator
* Internal notes
* Conversation status
* Creation date
* Last activity
* Human-takeover state
* Resolution state

### 11.4 Human takeover

The system should support this workflow:

```text
Visitor sends a message
↓
AI provides an approved answer
↓
Visitor requests a human or AI cannot answer safely
↓
Conversation changes to “Waiting for admin”
↓
Administrator receives a notification
↓
Administrator opens the conversation
↓
Administrator takes control
↓
AI automatic replies pause
↓
Administrator replies
↓
The reply is stored in Supabase
↓
The visitor receives the message in chat or by email
```

When an administrator takes control, the AI must not continue responding automatically unless control is intentionally returned to the AI.

---

## 13. Email System

Resend will be used for transactional and operational email.

Possible email events include:

* New contact-form submission
* New qualified lead
* Human-support request
* Unread admin reply
* Offline visitor reply
* Contact confirmation
* Conversation follow-up
* Internal notification
* Approved daily conversation summary
* Project enquiry acknowledgement

Supabase remains the source of truth for conversations and message history.

Resend is responsible for delivering email notifications and follow-up messages.

The email system should include:

* Approved templates
* Sender configuration
* Trigger rules
* Delivery status logging
* Failure logging
* Retry rules where appropriate
* Protection against duplicate sending
* Consent handling
* Unsubscribe handling where legally required
* Environment-specific configuration

Detailed behavior will be defined in `EMAIL_SYSTEM.md`.

---

## 14. Lead Management

The system should capture and manage potential customers from:

* Contact forms
* Chat conversations
* AI FAQ interactions
* Project enquiry forms
* Acquisition enquiries
* Newsletter or resource forms, when introduced

A lead may include:

* Name
* Email
* Phone, when provided
* Company
* Requested service
* Budget range
* Project timeline
* Preferred language
* Message
* Source
* Status
* Assigned administrator
* Internal notes
* Consent data
* Created and updated timestamps

Possible lead statuses:

* New
* Contacted
* Qualified
* Proposal
* Won
* Lost
* Archived

A full CRM is not required in the initial version.

---

## 15. Main Technology Stack

### Framework

* Next.js 16
* React 19
* TypeScript
* App Router
* React Server Components where appropriate
* Server Actions where appropriate

### Frontend and styling

* Tailwind CSS
* shadcn/ui
* Lucide Icons
* GSAP
* Responsive design
* Accessible reusable components

### Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage
* Row Level Security
* Supabase JavaScript client
* Supabase CLI
* Supabase MCP for approved AI-assisted database operations

### Forms and validation

* Zod
* React Hook Form
* Server-side validation
* Client-side validation where it improves usability

### CMS architecture

* Custom Next.js admin dashboard
* JSONB multilingual content
* Section Registry
* Visual previews
* Media management
* SEO management
* Fixed section order for version 1

### AI and communication

* Approved AI model provider
* AI chatbot
* AI FAQ assistant
* Supabase conversation storage
* Human takeover
* Resend email API

The exact AI provider and model may change without requiring a major architecture rewrite.

### Development workflow

* Zed Editor
* OpenCode
* GLM-5.2 as the primary coding agent
* OpenSpec
* OpenCode Review
* Git
* GitHub
* npm
* ESLint
* TypeScript strict mode
* Prettier, when configured

### Deployment

* Vercel
* Supabase cloud
* Resend
* Environment variables
* GitHub-based deployment workflow

### Database workflow

* Supabase migration files
* Manual SQL seed files
* No Docker requirement
* RLS policies
* Generated TypeScript database types
* No untracked production schema changes

---

## 16. Data and Content Rules

### 15.1 Source of truth

Supabase is the source of truth for editable website and CMS content.

### 15.2 Database changes

Database changes must:

* Be represented by migration files
* Be reviewed before production use
* Include appropriate constraints
* Include appropriate indexes
* Include appropriate RLS policies
* Avoid destructive operations without explicit approval
* Be documented when they affect architecture

### 15.3 Seed data

Seed files should:

* Provide development content
* Create predictable local or linked development data
* Avoid production secrets
* Avoid uncontrolled duplicate records
* Be safe to rerun where practical

### 15.4 Storage

Supabase Storage may contain:

* Logos
* Portfolio images
* Insight images
* General website media
* Chat attachments, when introduced
* Downloadable files, when introduced

Uploads must have:

* File-type restrictions
* File-size restrictions
* Secure access policies
* Meaningful filenames or metadata
* Alt text where required
* Deletion safety

---

## 17. Authentication and Authorization

The public website does not require visitor accounts in version 1.

The admin dashboard requires authentication.

Initial authorization should support:

* Administrator access
* Protected admin routes
* Admin-only content changes
* Public read access to published content
* Restricted access to leads and conversations
* Restricted access to chatbot settings
* Restricted access to email configuration
* Secure RLS policies

Additional roles may be introduced later, such as:

* Owner
* Administrator
* Editor
* Support agent
* Translator

Detailed rules will be defined in `AUTHENTICATION.md` and `SECURITY.md` when those implementation phases begin.

---

## 18. Design Direction

Stratifit uses a premium, dark-mode-first visual identity designed to communicate trust, precision, technical capability, and sophistication.

### 18.1 Core visual direction

- Deep navy and charcoal backgrounds
- Warm amber as the primary brand accent
- Indigo as a limited secondary accent
- High-contrast typography
- Spacious layouts
- Strong visual hierarchy
- Clean geometric alignment
- Refined gradients and glows
- Purposeful GSAP motion
- Minimal visual noise
- Consistent responsive behavior

### 18.2 Core colors

- Background: `#0B0F17`
- Surface: `#111827`
- Elevated surface: `#182235`
- Primary accent: `#F59E0B`
- Primary hover: `#E89008`
- Primary active: `#D97706`
- Primary light: `#FBBF24`
- Secondary accent: `#4F46E5`
- Primary text: `#FFFFFF`
- Secondary text: `#B8C0CC`
- Muted text: `#9CA3AF`
- Border: `#1F2937`

Amber is the main brand color.

Indigo is a supporting accent used selectively for AI, automation, analytics, informational states, and secondary visual details. It must not compete with amber as the primary identity color.

### 18.3 Typography

Stratifit uses two primary font families:

- **Satoshi** for hero headings, section headings, card titles, large numbers, and brand expression
- **Inter** for body text, navigation, buttons, forms, CMS interfaces, tables, and labels

The general typography principle is:

> Satoshi provides brand personality. Inter provides readability and usability.

### 18.4 Motion direction

Motion should feel premium, controlled, and purposeful.

Animations should:

- Improve hierarchy
- Support storytelling
- Guide attention
- Feel smooth and technically refined
- Respect reduced-motion preferences
- Avoid blocking interaction
- Avoid slowing down navigation
- Avoid excessive movement on mobile
- Remain more expressive on the public website than in the CMS

The detailed color tokens, typography scale, spacing system, component rules, responsive behavior, accessibility requirements, and GSAP standards are defined in `DESIGN_SYSTEM.md`.

---

## 19. Responsive Requirements

The public website and CMS should work across:

* Small mobile devices
* Standard mobile devices
* Tablets
* Laptops
* Desktop displays
* Large desktop displays

Responsive behavior must be intentionally designed rather than treated as an automatic result of CSS.

The CMS preview system should provide representative views for:

* Mobile
* Tablet
* Desktop

The preview system does not replace testing on real devices and browsers.

---

## 20. SEO, Performance, and Accessibility

The platform should include:

* Dynamic metadata
* Localized metadata
* Open Graph metadata
* Social sharing images
* Canonical URLs
* Sitemap generation
* Robots configuration
* Structured data where appropriate
* Optimized images
* Semantic HTML
* Keyboard navigation
* Clear focus states
* Appropriate color contrast
* Reduced-motion support
* Meaningful alt text
* Fast loading
* Core Web Vitals monitoring
* Graceful loading and error states

Performance and accessibility should be considered throughout development rather than added only at the end.

---

## 21. Security and Privacy

The system must protect:

* Admin accounts
* Customer enquiries
* Lead information
* Conversation history
* Internal notes
* Email addresses
* Chatbot configuration
* API keys
* Service-role credentials

Security requirements include:

* RLS on protected tables
* Server-only handling of privileged keys
* Input validation
* Output sanitization where appropriate
* Rate limiting for public forms and chat
* Bot and spam protection
* Secure file uploads
* Protected admin routes
* Audit logging for important operations when introduced
* No service-role key exposure to the browser
* No secrets committed to Git

Privacy requirements should account for applicable German and European data-protection obligations.

The platform should provide appropriate:

* Privacy notices
* Consent handling
* Retention rules
* Deletion workflows
* Data-access controls
* Email preferences
* Cookie controls when non-essential tracking is introduced

---

## 22. Testing and Quality Control

Development should include:

* TypeScript checks
* ESLint
* Production builds
* Form validation tests
* Responsive testing
* Accessibility checks
* Database migration review
* RLS verification
* Admin authorization testing
* Chatbot fallback testing
* Human-takeover testing
* Email delivery testing
* Manual browser testing
* OpenCode Review

Additional automated testing may include:

* Vitest
* React Testing Library
* Playwright

A feature should not be treated as complete only because it visually renders.

---

## 23. Development Workflow

The recommended workflow is:

```text
Project documentation
↓
OpenSpec proposal
↓
Requirements and design
↓
Implementation tasks
↓
OpenCode implementation
↓
Lint and type checks
↓
Production build
↓
Database and RLS verification
↓
OpenCode Review
↓
Manual testing
↓
Git commit
↓
GitHub push
↓
Vercel preview
↓
Approval
↓
Production deployment
```

Every meaningful feature should follow the approved project documentation and relevant OpenSpec change.

Coding agents must:

* Read `AGENTS.md`
* Read relevant files in `/docs`
* Read the relevant OpenSpec artifacts
* Avoid unapproved architectural changes
* Avoid hardcoding editable content
* Use migrations for database changes
* Preserve RLS
* Validate external inputs
* Run required checks after changes
* Document important decisions

---

## 24. Included in Version 1

Version 1 includes:

* Premium public agency website
* Responsive frontend
* Multilingual content
* Supabase-driven editable content
* Custom CMS/admin dashboard
* Structured section editing
* Visual section previews
* Mobile, tablet, and desktop previews
* Navigation management
* Footer management
* Service management
* Portfolio management
* Insight management
* Testimonial management
* FAQ management
* Pricing management
* Media management
* SEO management
* Supabase authentication
* Supabase Storage
* Supabase RLS
* Database migrations
* Manual SQL seed data
* AI chatbot
* AI FAQ assistant
* Conversation storage
* Admin conversation inbox
* Human takeover
* Lead management
* Resend email integration
* Vercel deployment
* Project documentation
* OpenSpec development workflow

---

## 25. Not Included in the Initial Version

The initial version intentionally excludes:

* General-purpose page-builder SaaS
* Public customer accounts
* Customer billing
* Subscription management
* White-label customer workspaces
* Self-hosted customer distributions
* Multi-tenant architecture
* Full CRM functionality
* Unrestricted drag-and-drop page building
* Drag-and-drop section ordering
* Real-time team collaboration
* Advanced workflow automation
* Separate AI development bots inside the website
* Native mobile applications
* WordPress
* Laravel
* PHP
* Prisma unless later justified
* Redux unless later justified
* Docker as a requirement
* Hardcoded editable marketing content

These items may be reconsidered through the feature-suggestion and approval process.

---

## 26. Future Suggestions and Feature Evolution

The project must remain open to useful future improvements.

New features may be proposed during development when they:

* Improve customer trust
* Improve lead generation
* Improve content management
* Improve admin productivity
* Improve accessibility
* Improve security
* Improve performance
* Reduce unnecessary maintenance
* Support Stratifit’s business model
* Provide meaningful value without unnecessary complexity

Potential future features include:

* Drag-and-drop section ordering
* Additional admin roles
* Translation workflow and approvals
* Content version history
* Scheduled publishing
* Reusable content blocks
* Website announcement management
* Advanced analytics dashboard
* Conversation analytics
* Lead scoring
* Appointment booking
* Calendar integration
* Newsletter management
* CRM integration
* Slack or team notifications
* AI-assisted content suggestions
* AI-assisted translation
* AI conversation summaries
* Knowledge-source citations in chatbot answers
* Voice chat
* Customer portal
* Client project dashboard
* White-label CMS
* Multi-tenant architecture
* Subscription billing
* Reusable client website templates
* Commercial SaaS edition
* Self-hosted edition
* Automated backups
* Advanced audit logs
* A/B testing
* Personalization
* Consent-management platform integration

This list is not a commitment to build every feature.

### 25.1 Feature proposal process

A new feature should not be added directly to the codebase only because it seems useful.

Each meaningful feature should be evaluated using:

1. What problem does it solve?
2. Who will use it?
3. Is it needed now?
4. Can the current system already solve the problem?
5. What complexity does it add?
6. What security or privacy risks does it introduce?
7. What database changes are required?
8. What maintenance will it require?
9. Does it support the current business goals?
10. Should it be version 1, a later phase, or rejected?

Approved features should be documented through OpenSpec before implementation.

### 25.2 Scope protection

New suggestions must not silently expand the project.

A suggestion can be classified as:

* **Required now**
* **Useful for the current phase**
* **Future roadmap**
* **Experimental**
* **Not aligned**

This protects the project from unnecessary complexity while allowing it to evolve.

---

## 27. Project Principles

### 26.1 Premium quality over feature quantity

A smaller number of polished features is more valuable than many unfinished features.

### 26.2 CMS-driven editable content

Editable public marketing content should come from Supabase.

### 26.3 Clear architecture over unnecessary abstraction

The system should remain understandable, maintainable, and testable.

### 26.4 Security by default

Authentication, authorization, RLS, validation, and secret management must be considered from the beginning.

### 26.5 Multilingual by design

Public content structures should support English, German, French, and Spanish without requiring separate page implementations.

### 26.6 Mobile-first responsibility

Every public feature and CMS workflow must be usable at appropriate screen sizes.

### 26.7 AI with human control

The AI chatbot should help visitors, but administrators must remain able to review, take over, correct, and resolve conversations.

### 26.8 No uncontrolled AI changes

Coding agents must follow approved documentation, specifications, database rules, and review procedures.

### 26.9 Build for current needs with future flexibility

The architecture should support future growth without building every possible future feature today.

### 26.10 Documentation is part of the product

Documentation must be updated when approved architectural or functional decisions change.

---

## 28. Success Criteria

The first major version is successful when:

* The public website looks premium and professional
* Visitors can clearly understand Stratifit’s services
* The website works correctly across major screen sizes
* Editable public content comes from Supabase
* Administrators can update content without editing code
* Multilingual content can be managed safely
* Portfolio and insights can be published through the CMS
* Leads are captured and visible in the admin dashboard
* The chatbot answers from approved Stratifit knowledge
* Conversations are saved correctly
* Administrators can take over conversations
* Offline visitors can receive follow-up emails
* RLS protects private information
* Production builds pass
* Core pages meet performance and accessibility expectations
* The website is deployed successfully on Vercel
* The system is understandable and maintainable

---

## 29. Related Documentation

The project documentation should include:

```text
README.md
AGENTS.md

docs/
├── PROJECT.md
├── ARCHITECTURE.md
├── FRONTEND.md
├── CMS.md
├── DATABASE.md
├── DESIGN_SYSTEM.md
├── CHAT_SYSTEM.md
├── EMAIL_SYSTEM.md
└── ROADMAP.md
```

Additional documentation may be introduced when required:

```text
docs/
├── AUTHENTICATION.md
├── SECURITY.md
├── API.md
├── DEPLOYMENT.md
├── TESTING.md
├── ENVIRONMENT.md
├── SEO.md
└── ANALYTICS.md
```

OpenSpec should contain feature-specific proposals, requirements, designs, and implementation tasks.

---

## 30. Project Scope Summary

Stratifit version 1 is:

> A premium multilingual digital agency website powered by Supabase, supported by a custom visual CMS, an AI customer-support chatbot, an AI FAQ assistant, a shared admin conversation inbox, lead management, and Resend-powered email communication.

The platform must first succeed as Stratifit’s own professional website and internal operating system.

Future SaaS, white-label, client portal, multi-tenant, and advanced AI features may be added gradually only after evaluation and approval.

