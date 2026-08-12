# CHAT_SYSTEM.md — Stratifit Digital Agency Platform

**Project:** Stratifit Digital Agency  
**Document type:** AI chatbot, AI FAQ, and conversation system specification  
**Status:** Initial approved chat-system specification  
**Primary references:** `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/CMS.md`, `docs/DATABASE.md`, `docs/FRONTEND.md`

---

## 1. Purpose

This document defines the Stratifit AI chatbot, AI FAQ, live conversation, lead-capture, and human-takeover system.

It specifies:

- Visitor chat experience
- AI response behavior
- Approved knowledge sources
- Conversation storage
- Lead capture
- Human escalation
- Admin replies
- Offline follow-up
- Multilingual behavior
- Safety rules
- Privacy
- Rate limiting
- Error handling
- Realtime behavior
- CMS management
- Testing
- Operational governance

The chat system must help visitors understand Stratifit’s services, answer common questions, capture qualified leads, and connect visitors with a human when needed.

The system must not invent facts, pricing, timelines, guarantees, case studies, or commitments.

---

## 2. Chat System Goals

The chat system must:

- Answer approved business questions
- Explain services clearly
- Help visitors choose the right service
- Capture useful lead information
- Escalate appropriately
- Support human takeover
- Preserve conversation history
- Support English, German, French, and Spanish
- Work on mobile and desktop
- Remain secure
- Respect privacy
- Avoid misleading claims
- Fail safely when AI is unavailable

---

## 3. Chat System Scope

Version 1 includes:

- Public AI chatbot
- AI FAQ assistant
- Anonymous visitor sessions
- Conversation persistence
- Message history
- Approved knowledge retrieval
- Lead capture
- Human escalation
- Admin conversation inbox
- Human takeover
- Admin replies
- Email follow-up when appropriate
- Conversation statuses
- Basic assignment
- Multilingual responses
- Safety fallback responses

Version 1 does not include:

- Voice calling
- Autonomous quoting
- Autonomous contract generation
- Autonomous scheduling without approved integration
- Full CRM automation
- Unrestricted web browsing
- Open-ended tool execution
- Customer accounts
- Multi-tenant chat workspaces

---

## 4. System Components

The chat system consists of:

```text
Public Chat Widget
    │
    ├── Visitor messages
    ├── AI responses
    ├── Human replies
    ├── Lead capture
    └── Escalation controls
            │
            v
Next.js Server Layer
    │
    ├── Validation
    ├── Rate limiting
    ├── Session resolution
    ├── Conversation state
    ├── Knowledge retrieval
    ├── AI provider call
    ├── Safety checks
    ├── Message persistence
    └── Email trigger
            │
            v
Supabase
    ├── Visitors
    ├── Conversations
    ├── Messages
    ├── Leads
    ├── Assignments
    ├── Internal notes
    ├── Events
    ├── Knowledge
    └── Settings
            │
            v
Admin CMS
    ├── Conversation inbox
    ├── Human takeover
    ├── Replies
    ├── Notes
    ├── Assignment
    └── Resolution
```

---

## 5. Public Chat Entry Points

The chat system may be opened from:

- Floating chat button
- Header chat action
- Mobile chat action
- Contact page
- FAQ section
- Service pages
- AI FAQ prompt

The chat widget must not cover:

- Primary navigation
- Form submit buttons
- Cookie controls
- Important mobile CTAs

---

## 6. Chat Widget Requirements

The public chat widget should include:

- Welcome state
- Message list
- AI and human sender identification
- Typing or waiting state
- Message input
- Send action
- Escalation action
- Close and minimize controls
- Error state
- Offline state
- Privacy notice or link
- Lead capture when appropriate

The widget must:

- Be keyboard accessible
- Work on touch devices
- Preserve conversation state
- Avoid unnecessary autoplay behavior
- Support reduced motion
- Remain readable in all supported languages

---

## 7. Conversation Identity

Visitors may begin anonymously.

A visitor session should use:

- Secure browser identifier
- Hashed anonymous token
- Supabase visitor record
- Server-validated conversation access

The system must not rely on exposing raw database IDs alone as proof of ownership.

When a visitor provides contact information, the conversation may be linked to:

- Contact record
- Lead record
- Email address
- Name
- Preferred language

---

## 8. Conversation Lifecycle

Recommended lifecycle:

```text
Conversation created
↓
AI handles initial messages
↓
Lead information may be captured
↓
AI answers or escalates
↓
Admin may take over
↓
Visitor and admin continue
↓
Conversation is resolved
↓
Conversation may be archived
```

### 8.1 Conversation statuses

Approved statuses:

```text
open
waiting_for_admin
waiting_for_visitor
resolved
archived
```

### 8.2 Conversation modes

Approved modes:

```text
ai
human
paused
closed
```

Status describes workflow state.

Mode describes who may reply automatically.

---

## 9. Message Types

Sender types:

```text
visitor
ai
admin
system
```

Each message should support:

- Conversation ID
- Sender type
- Sender user ID when relevant
- Content
- Content format
- AI model when relevant
- AI provider when relevant
- Delivery status
- Internal flag
- Timestamp

Internal notes must never be exposed publicly.

---

## 10. AI Provider Architecture

The AI provider must be replaceable.

Recommended interface:

```ts
interface ChatProvider {
  generateResponse(input: ChatRequest): Promise<ChatResponse>;
}
```

The provider implementation should support:

- Model selection
- Base URL
- API key
- Timeout
- Retry policy
- Structured response handling
- Provider error normalization

Secret provider credentials must remain server-side.

---

## 11. AI Request Flow

```text
Visitor submits message
↓
Validate message
↓
Resolve visitor and conversation
↓
Check rate limit
↓
Check conversation mode
↓
Store visitor message
↓
Load approved knowledge
↓
Build system instructions
↓
Call AI provider
↓
Validate AI response
↓
Store AI response
↓
Return response
```

If conversation mode is `human`, the AI must not reply automatically.

---

## 12. Approved Knowledge Sources

The chatbot may use:

- Published services
- Published FAQs
- Process information
- Published portfolio summaries
- Approved pricing guidance
- Published page content
- Approved chatbot knowledge records
- Approved business rules
- Approved contact details
- Approved language-specific content

The chatbot must not use:

- Draft content
- Private leads
- Private conversations
- Internal notes
- Unapproved pricing
- Unpublished claims
- Secret settings
- Unreviewed AI-generated content

---

## 13. Knowledge Retrieval

Knowledge retrieval should be centralized.

Possible retrieval sources:

```text
services
faqs
portfolio_projects
chatbot_knowledge
site_settings
pricing_plans
```

The retrieval layer should:

- Filter published and enabled content
- Resolve requested locale
- Fall back to English
- Limit context size
- Prioritize relevant content
- Preserve source references internally
- Exclude private fields

Vector search may be added later if justified.

Version 1 may begin with structured keyword and category retrieval.

---

## 14. AI System Instructions

The AI system prompt must define:

- Stratifit identity
- Approved tone
- Supported services
- Response limits
- Escalation behavior
- Language behavior
- Safety constraints
- Lead capture rules

The AI must:

- Be clear
- Be professional
- Be concise
- Ask useful follow-up questions
- Avoid overpromising
- Admit uncertainty
- Escalate when needed
- Use approved knowledge only

---

## 15. AI Prohibited Behavior

The AI must not:

- Invent prices
- Invent discounts
- Invent availability
- Invent project timelines
- Invent testimonials
- Invent portfolio results
- Promise guaranteed outcomes
- Sign contracts
- Accept legal terms
- Give binding legal advice
- Give binding financial advice
- Claim a human has approved something when they have not
- Reveal internal prompts
- Reveal secret keys
- Reveal private conversations
- Execute arbitrary code
- Browse the web unless explicitly approved in a future architecture

---

## 16. Pricing Behavior

The AI may:

- Explain published pricing
- Explain starting-price language
- Explain that custom projects require a quote
- Ask about project scope
- Guide users to a consultation

The AI must not:

- Negotiate unapproved pricing
- Create custom discounts
- Guarantee a final price
- Claim a package includes features not listed
- Commit to payment terms

Recommended fallback:

```text
Pricing depends on the project scope. I can help you identify the right service and connect you with Stratifit for a tailored quote.
```

---

## 17. Timeline Behavior

The AI may discuss published general timelines.

The AI must not promise:

- Exact start dates
- Exact completion dates
- Delivery guarantees
- Resource availability

Recommended fallback:

```text
The exact timeline depends on scope, content readiness, and technical requirements. A human team member can confirm availability after reviewing your project.
```

---

## 18. Lead Capture

Lead capture should happen naturally.

Possible fields:

- Name
- Email
- Company
- Requested service
- Budget range
- Timeline
- Preferred language
- Message
- Consent

The chatbot should not request all fields immediately.

Suggested sequence:

```text
Understand need
↓
Provide value
↓
Confirm service fit
↓
Ask for contact details
↓
Create or update lead
↓
Offer human follow-up
```

---

## 19. Lead Creation Rules

A lead may be created when:

- Visitor submits contact details
- Visitor requests a quote
- Visitor requests human contact
- Visitor submits an acquisition enquiry
- Visitor provides enough qualification information

The system should avoid duplicate leads.

Possible matching:

- Email address
- Conversation ID
- Existing contact ID

The conversation should link to the lead when created.

---

## 20. Human Escalation Triggers

Escalation may occur when:

- Visitor asks for a human
- Visitor requests a quote
- Visitor asks for binding pricing
- Visitor asks about availability
- Visitor has a complaint
- AI confidence is low
- The question is outside approved knowledge
- The conversation becomes sensitive
- AI provider fails repeatedly
- The visitor appears ready to buy

---

## 21. Human Takeover

Human takeover flow:

```text
AI conversation active
↓
Escalation triggered
↓
Status becomes waiting_for_admin
↓
Admin opens conversation
↓
Admin selects Take Over
↓
Mode becomes human
↓
AI automatic replies stop
↓
Admin replies
↓
Visitor receives reply
```

The CMS must clearly show:

- Current mode
- Current status
- Assigned admin
- Last activity
- Whether AI is paused

---

## 22. Return to AI

Returning a conversation to AI must be explicit.

Possible flow:

```text
Admin selects Return to AI
↓
System confirms action
↓
Mode becomes ai
↓
System stores event
↓
AI may respond to future visitor messages
```

The system should not silently return to AI.

---

## 23. Offline Follow-Up

When the visitor is no longer active, an admin reply may trigger email follow-up if:

- Visitor provided a valid email
- Email follow-up is allowed
- Consent requirements are satisfied
- The reply has not already been sent
- The conversation is not archived

Email behavior is defined in `EMAIL_SYSTEM.md`.

---

## 24. Realtime Behavior

Realtime may support:

- New visitor messages
- New admin replies
- Conversation status changes
- Assignment changes
- Human takeover state

Realtime must:

- Respect RLS
- Use narrow subscriptions
- Clean up subscriptions
- Avoid duplicate messages
- Reconcile optimistic UI with stored records

Polling or refresh may be used where realtime is unnecessary.

---

## 25. Multilingual Behavior

Supported languages:

- English
- German
- French
- Spanish

The chat system should:

- Detect or receive the current locale
- Respond in the current locale
- Preserve the language during the conversation
- Fall back to English when content is missing
- Allow the visitor to switch language
- Avoid mixing languages in one response

The admin inbox should display the conversation language.

---

## 26. AI FAQ

The AI FAQ is a focused assistant for common questions.

It may:

- Suggest common questions
- Answer approved FAQs
- Link to relevant services
- Escalate to chat
- Capture a lead when appropriate

It must use the same approved knowledge and safety rules as the main chatbot.

---

## 27. Standard FAQ and AI FAQ Relationship

The standard FAQ and AI FAQ may share:

- FAQ records
- Categories
- Translations
- AI eligibility
- Visibility

An FAQ may be:

- Publicly visible
- AI eligible
- Both
- Neither

The database flags control eligibility.

---

## 27.1 FAQ Section Bot (Implementation)

The FAQ section's "Ask More Questions" CTA opens a dedicated FAQ bot popup
(`src/components/chat/faq-chat-bot.tsx`) styled like the main chat widget.

- **Own conversation scope** — FAQ-bot conversations are stored in
  `chat_conversations` with `bot_type = 'faq'` (migration `00052`), so they
  never mix with the main chat conversation for the same visitor. They appear
  in the admin inbox (badged "FAQ bot") and support the same human takeover,
  replies, resolve, and archive flows.
- **Separate settings** — the bot reads `ai_faq_settings`
  (`faq_bot_enabled`, `welcome_message_translations`,
  `suggested_question_translations` — a curated multilingual list of default
  question chips, `fallback_translations`, `allowed_categories`). Managed at
  `/admin/content/chatbot/faq-bot`.
- **Knowledge scoping** — answers come only from approved knowledge filtered
  to the configured allowed categories; when the AI cannot answer safely the
  bot sends the configured fallback and escalates to `waiting_for_admin`.
- **Writes** are mediated by the service-role server actions in
  `src/features/faq-bot/mutations.ts` (same anonymous-access model as the
  main chat).

## 28. Chatbot Knowledge Management

The CMS should allow administrators to manage:

- Knowledge title
- Knowledge content
- Category
- Source
- Priority
- AI eligibility
- Enabled state
- Last reviewed date
- Translations

Knowledge should be reviewed periodically.

Outdated knowledge should be disabled or updated.

---

## 29. Chatbot Settings

CMS-managed settings may include:

- Chat enabled
- Welcome message
- Offline message
- Escalation message
- Fallback message
- Lead capture mode
- Human support enabled
- Allowed knowledge categories
- Response style
- Suggested questions

Secret credentials must not be stored in browser-readable settings.

---

## 30. Rate Limiting

Rate limiting should protect:

- Message submission
- Conversation creation
- Lead capture
- AI calls
- Email follow-up

Rate limits may use:

- IP-derived key
- Visitor token
- Conversation ID
- Server-side store
- Provider limits

The system should avoid storing raw IP addresses unless necessary and approved.

---

## 31. Spam Protection

Spam protection may include:

- Rate limiting
- Honeypot fields
- Message-length limits
- URL-count limits
- Repeated-message detection
- Bot challenge when necessary
- Abuse scoring

Spam controls should not create unnecessary friction for real visitors.

---

## 32. Input Validation

Validate:

- Message length
- Allowed content format
- Email format
- Name length
- Locale
- Conversation ownership
- Lead fields
- URLs
- File attachments if introduced

Do not accept arbitrary HTML.

Store plain text or approved structured content.

---

## 33. Output Validation

AI output should be checked for:

- Empty content
- Excessive length
- Unsupported markup
- Secret leakage patterns
- Invalid structured output
- Prohibited claims
- Unapproved links

The system should use a safe fallback when output validation fails.

---

## 34. Error Handling

Possible errors:

- AI provider unavailable
- Supabase write failure
- Invalid visitor session
- Rate limit exceeded
- Conversation closed
- Human mode active
- Email unavailable
- Realtime disconnected

Public errors should be friendly and safe.

Example:

```text
I’m having trouble responding right now. You can leave your email and message, and the Stratifit team can follow up.
```

---

## 35. Timeouts and Retries

AI calls should use:

- Explicit timeout
- Controlled retry policy
- No uncontrolled retry loops
- Provider error normalization

Retries should not create duplicate messages.

Use idempotency or operation identifiers where appropriate.

---

## 36. Message Persistence

Recommended rule:

1. Store visitor message
2. Attempt AI response
3. Store AI response
4. Return persisted response

If the AI call fails, the visitor message must remain stored.

A system event may record the failure.

---

## 37. Delivery Status

Possible message delivery states:

```text
pending
sent
delivered
failed
```

Not every channel requires all states initially.

Use only statuses supported by the implementation.

---

## 38. Conversation Events

Important events may include:

- Conversation created
- Lead captured
- Escalation requested
- Assigned
- Human takeover
- Returned to AI
- Resolved
- Archived
- Email follow-up sent
- AI error

Events support operational visibility and future auditability.

---

## 39. Internal Notes

Admins may add internal notes.

Internal notes:

- Are visible only to authorized admins
- Must never be included in public chat payloads
- Must never be sent by email
- May contain operational context
- Should avoid unnecessary sensitive information

---

## 40. Assignment

Conversations may be assigned to:

- Owner
- Administrator
- Future support agent

Assignment should support:

- Assigned user
- Assigned by
- Assigned time
- Reassignment
- Assignment history when implemented

---

## 41. Resolution

An admin may resolve a conversation when:

- Visitor request is complete
- Follow-up is sent
- No further action is needed
- Conversation is spam

Resolving should:

- Set status to resolved
- Record timestamp
- Store event
- Stop unnecessary notifications

Resolved conversations may be reopened when a visitor replies.

---

## 42. Archiving

Archiving should:

- Preserve history
- Remove conversation from active queues
- Prevent unnecessary AI responses
- Remain reversible when appropriate

Permanent deletion should follow privacy or retention workflows.

---

## 43. Privacy

The chat system may process:

- Messages
- Names
- Emails
- Companies
- Service interests
- Conversation history
- Consent information
- Technical session data

Rules:

- Collect only necessary data
- Restrict access
- Support deletion
- Avoid unnecessary logging
- Show privacy information
- Avoid exposing data across visitors
- Follow applicable European privacy requirements

---

## 44. Retention

Retention periods should be approved for:

- Anonymous visitor records
- Conversations
- Messages
- Leads
- Email events
- Internal notes

The system must support:

- Deletion
- Anonymization
- Archiving
- Export when required

---

## 45. Security

The chat system must:

- Keep AI keys server-side
- Keep service-role keys server-side
- Validate conversation ownership
- Protect private messages with RLS
- Sanitize output
- Rate limit requests
- Avoid unsafe HTML
- Restrict admin operations
- Verify webhook events
- Prevent internal-note leakage

---

## 46. Public API Boundaries

Possible route handlers:

```text
/api/chat/message
/api/chat/conversation
/api/chat/lead
/api/chat/escalate
/api/chat/session
```

Admin operations may use:

- Server Actions
- Protected Route Handlers
- Approved database functions

Public APIs should return only necessary fields.

---

## 47. CMS Conversation Inbox

The inbox should support filters for:

- Open
- Waiting for admin
- Waiting for visitor
- AI handling
- Human handling
- Resolved
- Archived
- Assigned to me

Each row should show:

- Visitor name or anonymous label
- Language
- Source page
- Last message
- Last activity
- Status
- Mode
- Assigned admin
- Lead indicator

---

## 48. CMS Conversation Detail

The detail view should include:

- Message history
- Visitor information
- Lead information
- Status
- Mode
- Assignment
- Internal notes
- Reply editor
- Human takeover control
- Resolve and archive actions
- Email follow-up state

---

## 49. Notifications

Admin notifications may be triggered for:

- New qualified lead
- Human escalation
- Unanswered conversation
- Visitor reply during human mode
- Email delivery failure

Notifications should avoid unnecessary volume.

---

## 50. Analytics

Future chat analytics may include:

- Conversation volume
- Escalation rate
- Lead conversion
- Response time
- Common questions
- Unanswered topics
- Language distribution
- AI failure rate

Analytics must not expose unnecessary personal data.

---

## 51. Performance

The chat system should:

- Load widget code efficiently
- Avoid blocking page rendering
- Lazy-load when appropriate
- Limit message history retrieval
- Paginate long conversations
- Use narrow realtime subscriptions
- Avoid sending excessive context to AI

---

## 52. Accessibility

The chat interface must support:

- Keyboard navigation
- Screen-reader labels
- Focus management
- Accessible live regions
- Clear sender labels
- Visible focus states
- Reduced motion
- Sufficient contrast
- Touch targets of at least 44px

---

## 53. Testing

Testing should cover:

- Conversation creation
- Anonymous session access
- Message submission
- AI response
- Provider failure
- Rate limiting
- Lead capture
- Escalation
- Human takeover
- AI pause
- Admin reply
- Return to AI
- Resolution
- Archiving
- Multilingual responses
- Internal note privacy
- RLS
- Email follow-up trigger
- Mobile widget behavior

---

## 54. Chat Development Workflow

```text
Read PROJECT.md
↓
Read ARCHITECTURE.md
↓
Read DATABASE.md
↓
Read CHAT_SYSTEM.md
↓
Read relevant OpenSpec
↓
Confirm conversation schema
↓
Implement validation
↓
Implement server route
↓
Implement provider abstraction
↓
Implement knowledge retrieval
↓
Implement safety checks
↓
Implement persistence
↓
Implement widget
↓
Implement CMS inbox
↓
Test
↓
Run lint and build
```

---

## 55. AI Coding Rules

Coding agents must:

- Read this document
- Keep provider calls server-side
- Use approved knowledge
- Respect conversation mode
- Stop AI replies during human mode
- Validate all inputs
- Preserve message history
- Avoid duplicate writes
- Respect RLS
- Avoid exposing internal notes
- Avoid inventing business rules
- Run lint and build
- Update documentation for major changes

---

## 56. Chat Review Checklist

Before approving chat work, confirm:

### AI

- Does it use approved knowledge?
- Does it avoid invented claims?
- Does it escalate safely?
- Does it stay in the visitor’s language?

### Security

- Are keys server-side?
- Is conversation ownership validated?
- Are private messages protected?
- Are internal notes excluded?

### Human takeover

- Does AI stop?
- Is mode clearly shown?
- Can admin reply?
- Can the conversation return to AI explicitly?

### Data

- Are messages stored?
- Are leads linked?
- Are events recorded?
- Are duplicates prevented?

### UX

- Does mobile work?
- Is the widget accessible?
- Are errors understandable?
- Is loading clear?

---

## 57. Definition of Chat-System Completion

The initial chat system is complete when:

- Visitors can start a conversation
- Anonymous sessions are protected
- Messages are stored
- AI responses use approved knowledge
- AI follows safety rules
- English, German, French, and Spanish work
- Leads can be captured
- Escalation works
- Admin inbox works
- Human takeover stops AI
- Admin replies work
- Offline email follow-up can be triggered
- Internal notes remain private
- RLS protects conversations
- Rate limits work
- Provider failure has a safe fallback
- Mobile and desktop widgets work
- Production build passes

---

## 58. Related Documentation

Read this document with:

```text
docs/PROJECT.md
docs/ARCHITECTURE.md
docs/CMS.md
docs/DATABASE.md
docs/FRONTEND.md
docs/EMAIL_SYSTEM.md
docs/SECURITY.md
AGENTS.md
```

Chat-system changes should follow OpenSpec.

---

## 59. Chat System Summary

The Stratifit chat system combines:

- AI chatbot
- AI FAQ
- Approved knowledge
- Multilingual responses
- Lead capture
- Conversation storage
- Human escalation
- Human takeover
- Admin replies
- Offline email follow-up
- RLS and privacy controls

The AI helps visitors but does not make binding commitments.

Human takeover is explicit, and automatic AI replies stop while a human controls the conversation.

---

## 60. Anonymous Chat Access Model (Implementation)

Anonymous visitors have no Supabase user session, so the chat write flow cannot rely on user-scoped RLS. The approved V1 model is:

- **Public read on `chatbot_settings`** — a `SELECT` policy (`USING (true)`) exposes only public-facing operational config (enabled flag, welcome/offline/escalation/fallback messages, lead-capture mode, human-support flag). This mirrors `site_settings`. No secrets are stored in `chatbot_settings`.
- **Service-role mediation for chat writes** — the server action `sendVisitorMessage` (`src/features/chat/mutations.ts`) uses the service-role client (server-only, never imported by Client Components) for all reads/writes of `chat_visitors`, `chat_conversations`, `chat_messages`, and `conversation_events`. The action validates all input with Zod and constructs every payload, so visitors cannot control privileged fields (sender type, conversation mode, status).
- **Private data stays admin-only** — no `anon` SELECT policies exist on the chat tables, so visitors cannot read other visitors' conversations or messages. Admin actions (`adminReply`, `takeOverConversation`, …) use the user-session server client and are governed by `is_admin()` RLS policies.

See migration `00024_anon_chat_access.sql`.
