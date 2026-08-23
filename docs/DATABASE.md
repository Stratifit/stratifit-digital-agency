# DATABASE.md — Stratifit Digital Agency Platform

**Project:** Stratifit Digital Agency  
**Document type:** Supabase PostgreSQL database specification  
**Status:** Initial approved database specification  
**Primary references:** `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/CMS.md`, `docs/FRONTEND.md`

---

## 1. Purpose

This document defines the database architecture for the Stratifit Digital Agency Platform.

It specifies:

- PostgreSQL table structure
- Relationships
- Multilingual JSONB fields
- Content lifecycle rules
- Row Level Security
- Storage metadata
- Lead and conversation data
- AI chatbot knowledge
- Communication Engine email logging
- Indexes
- Constraints
- Triggers
- Migration rules
- Seed rules
- Type generation
- Data-governance requirements

Supabase PostgreSQL is the source of truth for editable website content, CMS content, leads, conversations, chatbot knowledge, operational email records, and admin configuration.

The database must support the approved version 1 project without becoming a generic page-builder or multi-tenant SaaS schema.

---

## 2. Database Goals

The database must be:

- Secure
- Typed
- Predictable
- CMS-friendly
- Multilingual
- Easy to query
- Easy to migrate
- Safe under RLS
- Compatible with Next.js
- Compatible with Supabase Auth
- Compatible with Supabase Storage
- Flexible enough for approved future growth

The database should avoid:

- One unrestricted universal content table
- Arbitrary component payload execution
- Uncontrolled JSONB usage
- Public access to private records
- Direct production schema changes
- Duplicate content models
- Hidden business rules inside application code only

---

## 3. Core Database Principles

### 3.1 Purpose-built tables

Use dedicated tables for major content and business concepts.

Examples:

- Services
- Portfolio
- Insights
- Testimonials
- FAQs
- Leads
- Conversations
- Messages

Do not force unrelated content into one generic `content_blocks` table.

### 3.2 JSONB for translations, not everything

JSONB is appropriate for:

- Multilingual strings
- Structured but bounded configuration
- Approved content arrays
- Metadata
- Provider payload summaries

Relational columns should be used for:

- IDs
- Status
- Relationships
- Timestamps
- Ordering
- Ownership
- Permissions
- Frequently filtered values

### 3.3 RLS by default

RLS must be enabled on all relevant public, CMS, and private tables.

Public access must be limited to approved published content.

Private operational tables must not be publicly readable.

### 3.4 Migrations are mandatory

All schema changes must be represented by version-controlled SQL migration files.

### 3.5 Seeds are controlled

Seed files must provide predictable development content and must not contain production secrets or uncontrolled duplicates.

### 3.6 Supabase Auth remains authoritative

Admin identities come from `auth.users`.

Application roles should be stored in an approved profile or admin table linked to `auth.users`.

---

## 4. Conventions

### 4.1 Primary keys

Use:

```sql
id uuid primary key default gen_random_uuid()
```

### 4.2 Timestamps

Use:

```sql
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Use `published_at`, `archived_at`, `resolved_at`, or similar only when the domain requires them.

### 4.3 Naming

Use:

- `snake_case` for tables and columns
- Singular business concepts in code
- Plural table names
- Clear foreign-key names
- Explicit enum-like checks

### 4.4 Deletion

Prefer:

- `ON DELETE CASCADE` for owned child records
- `ON DELETE SET NULL` for optional historical references
- Archive or soft-delete behavior for important operational records

### 4.5 Status fields

Status fields must have check constraints or database enums.

Check constraints are preferred initially for simpler migrations.

### 4.6 Slugs

Slugs should:

- Be lowercase
- Use hyphens
- Be unique within the relevant content type
- Avoid leading or trailing hyphens
- Avoid reserved routes

---

## 5. Multilingual JSONB Standard

Supported languages:

- English: `en`
- German: `de`
- French: `fr`
- Spanish: `es`

English is the default language.

### 5.1 Translation object

Standard shape:

```json
{
  "en": "English content",
  "de": "German content",
  "fr": "French content",
  "es": "Spanish content"
}
```

### 5.2 Required behavior

- `en` should exist for required public content
- Secondary languages may be incomplete
- Frontend fallback is English
- CMS must preserve all language keys
- Empty secondary values must not overwrite valid English content

### 5.3 Validation

The application must validate translation objects with Zod.

The database may also use helper checks for JSONB object shape where practical.

### 5.4 Naming

Use suffixes such as:

```text
title_translations
description_translations
content_translations
label_translations
seo_title_translations
seo_description_translations
```

Avoid generic names like `translations` when the field purpose is unclear.

---

## 6. Schema Overview

The initial database is organized into these domains:

```text
Identity and permissions
├── admin_users

Global website
├── site_settings
├── announcement_bar
├── navigation_items
├── footer_groups
├── footer_links

Homepage and marketing content
├── hero
├── about_page
├── services
├── detail_pages
├── process_steps
├── why_choose_us
├── acquisition_section
├── testimonials
├── pricing_plans
├── faqs

Editorial content
├── portfolio_projects
├── portfolio_media
├── insights
├── insight_categories
├── insight_category_links

Media
├── media_assets

Communication
├── contacts
├── leads
├── chat_visitors
├── chat_conversations
├── chat_messages
├── chat_assignments
├── chat_internal_notes
├── conversation_events

AI
├── chatbot_knowledge
├── chatbot_settings
├── ai_faq_settings

Email
├── email_events

Operational
├── audit_logs
```

Some singleton concepts may use a single-row table.

Exact implementation may be simplified during migrations if equivalent integrity is preserved.

---

## 7. Identity and Admin Access

### 7.1 `admin_users`

Links Supabase Auth users to application roles.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `user_id` | `uuid` | PK, FK to `auth.users(id)` ON DELETE CASCADE | Auth identity |
| `role` | `text` | NOT NULL, CHECK | `owner`, `admin` initially |
| `status` | `text` | NOT NULL, DEFAULT `active`, CHECK | `active`, `disabled` |
| `display_name` | `text` | NULLABLE | Admin-facing name |
| `created_at` | `timestamptz` | NOT NULL DEFAULT now() | Created |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT now() | Updated |

Possible future roles:

- editor
- support_agent
- translator

Do not add them until permissions are implemented.

### 7.2 Admin helper function

Recommended function:

```sql
public.is_admin()
```

It should return true only for active approved admin users.

A second helper may support role checks:

```sql
public.has_admin_role(required_roles text[])
```

Security-definer functions must set a safe `search_path`.

---

## 8. Global Website Tables

## 8.1 `site_settings`

Singleton table for public and operational site defaults.

Suggested columns:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Singleton PK |
| `site_name` | `text` | Stratifit |
| `site_description_translations` | `jsonb` | Global description |
| `contact_email` | `text` | Public contact email |
| `contact_phone` | `text` | Optional |
| `address_translations` | `jsonb` | Optional |
| `social_links` | `jsonb` | Approved social URLs |
| `default_locale` | `text` | `en` |
| `supported_locales` | `text[]` | `en,de,fr,es` |
| `default_seo` | `jsonb` | Global SEO fallback |
| `created_at` | `timestamptz` | Standard |
| `updated_at` | `timestamptz` | Standard |

Use a singleton constraint or known fixed ID.

Do not store secrets in this table.

## 8.2 `announcement_bar`

Singleton table.

Suggested columns:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Singleton |
| `message_translations` | `jsonb` | Announcement text |
| `link_label_translations` | `jsonb` | Optional label |
| `link_url` | `text` | Optional |
| `is_enabled` | `boolean` | Default false |
| `starts_at` | `timestamptz` | Optional |
| `ends_at` | `timestamptz` | Optional |
| `variant` | `text` | Approved variant |
| `created_at` | `timestamptz` | Standard |
| `updated_at` | `timestamptz` | Standard |

Approved variants may include:

- primary
- neutral
- ai

## 8.3 `navigation_items`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `location` | `text` | `header`, `footer`, future |
| `parent_id` | `uuid` | Self FK nullable |
| `label_translations` | `jsonb` | Link label |
| `href` | `text` | Internal or external URL |
| `is_external` | `boolean` | Default false |
| `open_in_new_tab` | `boolean` | Default false |
| `display_order` | `integer` | Stable order |
| `is_visible` | `boolean` | Default true |
| `created_at` | `timestamptz` | Standard |
| `updated_at` | `timestamptz` | Standard |

Index:

```sql
(location, parent_id, display_order)
```

## 8.4 `footer_groups`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `title_translations` | `jsonb` | Group title |
| `display_order` | `integer` | Order |
| `is_visible` | `boolean` | Default true |
| `created_at` | `timestamptz` | Standard |
| `updated_at` | `timestamptz` | Standard |

## 8.5 `footer_links`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `group_id` | `uuid` | FK to footer_groups ON DELETE CASCADE |
| `label_translations` | `jsonb` | Label |
| `href` | `text` | Destination |
| `is_external` | `boolean` | Default false |
| `display_order` | `integer` | Order |
| `is_visible` | `boolean` | Default true |
| `created_at` | `timestamptz` | Standard |
| `updated_at` | `timestamptz` | Standard |

Seed groups (Platform / Company / Legal) and links are maintained in `seed.sql` and migration `00039_footer_buy_business_and_pricing.sql`. The footer links to the detail pages, the Buy a Business hub (`/buy-business`, under Platform), and the homepage pricing anchor (`/#pricing`, under Company).

---

## 9. Homepage Singleton Tables

## 9.1 `hero`

Singleton table.

Suggested columns:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `eyebrow_translations` | `jsonb` |
| `title_translations` | `jsonb` |
| `highlight_translations` | `jsonb` |
| `description_translations` | `jsonb` |
| `primary_cta_label_translations` | `jsonb` |
| `primary_cta_url` | `text` |
| `secondary_cta_label_translations` | `jsonb` |
| `secondary_cta_url` | `text` |
| `media_id` | `uuid` nullable FK |
| `metrics` | `jsonb` |
| `variant` | `text` |
| `animation_preset` | `text` |
| `is_visible` | `boolean` |
| `created_at` | `timestamptz` |
| `updated_at` | `timestamptz` |

`metrics` should use a validated bounded structure.

## 9.2 `why_choose_us`

Singleton table.

Suggested columns:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `eyebrow_translations` | `jsonb` |
| `title_translations` | `jsonb` |
| `description_translations` | `jsonb` |
| `items` | `jsonb` |
| `media_id` | `uuid` nullable |
| `variant` | `text` |
| `is_visible` | `boolean` |
| timestamps | standard |

## 9.3 `acquisition_section`

Singleton homepage section.

Suggested columns:

- `title_translations`
- `description_translations`
- `benefits`
- `cta_label_translations`
- `cta_url`
- `media_id`
- `variant`
- `is_visible`
- timestamps

The public Buy a Business page (`/buy-business`) drives its section labels from `section_settings` rows:

- `acquisition` — page hero heading (eyebrow, title, highlight, description)
- `acquisition-cta` — closing call-to-action block (title, description, optional `cta_label_translations`, `cta_url`)

`section_settings` also carries two optional CTA columns used by CTA-capable sections: `cta_label_translations jsonb` and `cta_url text` (both nullable).

Since migration `00042`, `section_settings` also has a `stats jsonb` column (default `[]`): an editable stats band of `{ value, label_translations }` items. The `/work` page reads the `portfolio` section's `stats` row instead of hardcoding its stats band; the admin editor (Sections → Portfolio) edits it in all 4 languages.

Since migration `00049`, `section_settings` also has a `review_summary jsonb` column (default `{}`): the review summary band on `/testimonials`, shaped as `{ rating, verifiedReviews, googleRating, googleReviews, googleReviewsUrl }`. The `/testimonials` page reads the `testimonials` section's `review_summary` row (falling back to approved defaults); the admin editor (Sections → Testimonials) edits it. The `googleReviewsUrl` is an external link to the agency's Google reviews listing.

Since migration `00050`, the `section_key` check constraint only allows live sections (`services`, `process`, `why-choose-us`, `insights`, `portfolio`, `testimonials`, `pricing`, `faq`, `acquisition`, `contact`, `acquisition-niches`, `acquisition-cta`). The removed `final-cta` and `trusted-by` keys were dropped from the constraint after their backing tables were removed (migrations `00046` and `00031`).

Since migration `00051`, `section_settings`, `about_page`, and `detail_pages` also carry `seo_title_translations jsonb` and `seo_description_translations jsonb` (default `{}`, seeded with the previously hardcoded page metadata). Every public page now resolves its SEO from the database: `section_settings` rows drive `/work` (portfolio), `/services`, `/testimonials`, `/insights`, `/contact`, and `/buy-business` (acquisition); `about_page` drives `/about`; `detail_pages` drive the legal pages (privacy, terms, cookies, imprint, careers, hiring). The `services`, `insights`, and `portfolio_projects` tables already carried SEO columns and now drive their detail routes (`/services/[slug]`, `/insights/[slug]`, `/work/[slug]`). `site_settings.default_seo` (shaped `{ [locale]: { title, description } }`) is the global fallback used by the homepage and whenever a row's SEO is empty.

## 9.4 `acquisition_niches`

Collection table (migration `00043`) replacing the hardcoded niche catalog in `src/features/acquisition/niches.ts`. Editable from the CMS in all 4 languages; rendered on `/buy-business` (card grid) and `/buy-business/niches/[slug]` (detail page), and included in `sitemap.xml`.

| Column | Type |
|---|---|
| `id` | `uuid` PK |
| `slug` | `text` UNIQUE |
| `emoji` | `text` |
| `accent` | `text` |
| `label_translations` | `jsonb` |
| `description_translations` | `jsonb` |
| `why_title_translations` | `jsonb` |
| `why_description_translations` | `jsonb` |
| `stats` | `jsonb` (array of `{ value, label_translations, hint_translations }`) |
| `is_visible` | `boolean` |
| `display_order` | `integer` |
| timestamps | standard |

RLS: public `SELECT` scoped to `is_visible = true`; admins manage rows via `is_admin()`.

## 9.5 `about_page`

Singleton table for the public About page.

Suggested columns:

| Column | Type |
|---|---|
| `eyebrow_translations` | `jsonb` |
| `title_translations` | `jsonb` |
| `highlight_translations` | `jsonb` |
| `intro_translations` | `jsonb` |
| `stats` | `jsonb` |
| `mission_translations` | `jsonb` |
| `story_translations` | `jsonb` |
| `values` | `jsonb` |
| `team_translations` | `jsonb` |
| `cta_title_translations` | `jsonb` |
| `cta_highlight_translations` | `jsonb` |
| `cta_description_translations` | `jsonb` |
| `cta_label_translations` | `jsonb` |
| `cta_url` | `text` |
| `is_visible` | `boolean` |
| timestamps | standard |

`stats` items: `{ icon, value, label_translations }`.

`values` items: `{ icon, title_translations, description_translations }`.

Icons are restricted to the approved set (`bolt`, `users`, `globe`, `chart`, `sparkles`).

## 9.6 `detail_pages`

CMS-editable detail pages such as Privacy Policy, Terms of Service, Cookie Policy, Imprint, Careers, and Hiring.

Suggested columns:

| Column | Type |
|---|---|
| `slug` | `text` unique |
| `eyebrow_translations` | `jsonb` |
| `title_translations` | `jsonb` |
| `description_translations` | `jsonb` |
| `subtitle_translations` | `jsonb` |
| `content_translations` | `jsonb` |
| `is_visible` | `boolean` |
| timestamps | standard |

`content_translations` is an ordered array of structured blocks:

```text
{ type: heading, icon?: string, text_translations: {...} }
{ type: subheading, divider?: boolean, text_translations: {...} }
{ type: paragraph, text_translations: {...} }
{ type: list, items: [{ text_translations: {...} }] }
{ type: panel, title_translations, tag_translations?, body_translations }
{ type: note, text_translations: {...} }
```

The CMS exposes only these approved block types — no raw HTML or arbitrary markup.
Icons are restricted to the approved set in `src/features/detail-pages/icons.ts`.
Paragraph and panel text may use the `[label](url)` inline-link markup, which
renders only safe links. Section headings group the blocks after them into
cards until the next heading.

Block rendering is shared between the public `DetailPageView` and the CMS live preview via `src/components/detail-pages/detail-block.tsx` (see `docs/FRONTEND.md` §5.10 and `docs/CMS.md` §39.5).

Seeded slugs: `privacy`, `terms-conditions`, `cookie-policy`, `imprint`, `careers`, `hiring`.

The footer links to these pages via `footer_links`.

---

## 10. Marketing Collection Tables

## 10.1 `services`

Initial seeded categories:

- brand-design
- website-development
- ai-automation
- growth-marketing

Suggested columns:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `slug` | `text` unique |
| `title_translations` | `jsonb` |
| `short_description_translations` | `jsonb` |
| `full_description_translations` | `jsonb` |
| `deliverables_translations` | `jsonb` |
| `icon_name` | `text` |
| `featured_media_id` | `uuid` nullable |
| `cta_label_translations` | `jsonb` |
| `cta_url` | `text` |
| `seo_title_translations` | `jsonb` |
| `seo_description_translations` | `jsonb` |
| `display_order` | `integer` |
| `is_featured` | `boolean` |
| `is_visible` | `boolean` |
| `status` | `text` |
| timestamps | standard |

Status:

```text
draft
published
archived
```

## 10.2 `process_steps`

Suggested columns:

- `id`
- `step_key`
- `number`
- `title_translations`
- `description_translations`
- `icon_name`
- `display_order`
- `is_visible`
- timestamps

## 10.3 `testimonials`

Suggested columns:

- `id`
- `quote_translations`
- `person_name`
- `person_role_translations`
- `company_name`
- `person_media_id`
- `related_service_id`
- `related_portfolio_id`
- `display_order`
- `is_featured`
- `is_visible`
- `is_verified`
- timestamps

Only verified testimonials may be published.

## 10.4 `pricing_plans`

Suggested columns:

- `id`
- `slug`
- `name_translations`
- `description_translations`
- `price_label_translations`
- `billing_label_translations`
- `features_translations`
- `limitations_translations`
- `cta_label_translations`
- `cta_url`
- `disclaimer_translations`
- `display_order`
- `is_featured`
- `is_visible`
- `status`
- timestamps

## 10.5 `faqs`

Suggested columns:

- `id`
- `question_translations`
- `answer_translations`
- `category`
- `display_order`
- `is_featured`
- `is_visible`
- `is_ai_eligible`
- `status`
- timestamps

---

## 11. Portfolio Tables

## 11.1 `portfolio_projects`

Suggested columns:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `slug` | `text` unique |
| `client_name` | `text` |
| `title_translations` | `jsonb` |
| `summary_translations` | `jsonb` |
| `challenge_translations` | `jsonb` |
| `approach_translations` | `jsonb` |
| `solution_translations` | `jsonb` |
| `deliverables_translations` | `jsonb` |
| `results_translations` | `jsonb` |
| `metrics` | `jsonb` |
| `featured_media_id` | `uuid` nullable |
| `testimonial_id` | `uuid` nullable |
| `seo_title_translations` | `jsonb` |
| `seo_description_translations` | `jsonb` |
| `is_featured` | `boolean` |
| `status` | `text` |
| `published_at` | `timestamptz` nullable |
| `year` | `integer` nullable |
| timestamps | standard |

`year` (migration `20260823130000`) is the display year for the case study
Year fact card, backfilled from `published_at`. It is edited via the
portfolio project's Case study tab; the public page falls back to the
`published_at` year when null.

## 11.2 `portfolio_service_links`

Many-to-many join table:

- `portfolio_id`
- `service_id`

Composite primary key.

## 11.3 `portfolio_media`

Gallery rows for work detail pages.

Columns:

- `id`
- `portfolio_id`
- `media_id` — nullable; media-library reference (preferred when set)
- `image_url` — nullable; direct gallery image URL, added by migration `00041`. Preferred over `media_id` when set (mirrors the `portfolio_projects.image_url` pattern from migration `00029`)
- `caption_translations`
- `display_order`
- `is_featured`
- timestamps

Seeded gallery rows (27 rows across the 9 published case studies) ship in migration `00041` and `seed.sql` so work detail galleries render without a populated media library. Migration `20260823120000` (and its `seed.sql` mirror) extends every case study to six rows; the homepage/work cards render a full cover image, except brand-design cards (`portfolio_service_links` → `brand-design`: Maison Lumière, Aura Cosmetics) which show the first four as a 2×2 thumbnail grid. Card images can be managed from two editors — the Portfolio Projects editor (Content tab: Category dropdown + six upload slots) and the Our Work section editor (Sections → Portfolio → Card images) — both persist to `portfolio_media` on save (delete + reinsert per project, so ordering and removals stay consistent); empty slots are dropped. Saving a project also reconciles `portfolio_service_links` to the selected category service (delete + insert). Public read access is gated by the policies from migrations `00033`/`00034`.

---

## 12. Insight Tables

## 12.1 `insights`

Suggested columns:

- `id`
- `slug`
- `title_translations`
- `excerpt_translations`
- `content_translations`
- `featured_media_id`
- `author_user_id`
- `reading_time_minutes`
- `seo_title_translations`
- `seo_description_translations`
- `is_featured`
- `status`
- `published_at`
- timestamps

Content must use a validated structured format.

## 12.2 `insight_categories`

Suggested columns:

- `id`
- `slug`
- `name_translations`
- `description_translations`
- timestamps

## 12.3 `insight_category_links`

Composite join table:

- `insight_id`
- `category_id`

---

## 13. Media Tables

## 13.1 `media_assets`

Tracks metadata for Supabase Storage objects.

Suggested columns:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `bucket_name` | `text` |
| `storage_path` | `text` |
| `original_filename` | `text` |
| `mime_type` | `text` |
| `file_size_bytes` | `bigint` |
| `width` | `integer` nullable |
| `height` | `integer` nullable |
| `alt_text_translations` | `jsonb` |
| `caption_translations` | `jsonb` |
| `category` | `text` |
| `uploaded_by` | `uuid` nullable |
| `is_public` | `boolean` |
| `created_at` | `timestamptz` |
| `updated_at` | `timestamptz` |

Unique constraint:

```sql
(bucket_name, storage_path)
```

Do not store a permanent public URL as the source of truth.

Generate public or signed URLs from bucket and path.

Suggested buckets:

```text
logos
portfolio-images
insights-images
general-media
```

The `category` CHECK constraint allows
`('general', 'image', 'video', 'document', 'icon', 'logo', 'banner',
'portfolio', 'insight')`. The `portfolio-images` and `insights-images`
buckets map to `portfolio` / `insight` (migration `20260823140000` added
them — uploads to those buckets previously failed the check and were
rolled back).

Use exact approved naming consistently in SQL and code.

---

## 14. Contacts and Leads

## 14.1 `contacts`

Represents known people across forms and chat.

Suggested columns:

- `id`
- `email`
- `name`
- `phone`
- `company`
- `preferred_locale`
- `consent_marketing`
- `consent_timestamp`
- timestamps

Email may be unique when present, but anonymous chat visitors should not require a contact record.

## 14.2 `leads`

Suggested columns:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `contact_id` | `uuid` nullable |
| `name` | `text` nullable |
| `email` | `text` nullable |
| `phone` | `text` nullable |
| `company` | `text` nullable |
| `requested_service_id` | `uuid` nullable |
| `budget_range` | `text` nullable |
| `project_timeline` | `text` nullable |
| `preferred_locale` | `text` |
| `message` | `text` nullable |
| `source` | `text` |
| `status` | `text` |
| `assigned_to` | `uuid` nullable |
| `internal_notes` | `text` nullable |
| `consent_data` | `jsonb` |
| timestamps | standard |

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

Lead sources:

```text
contact_form
project_enquiry
chat
ai_faq
acquisition
newsletter
manual
```

---

## 15. Chat Tables

## 15.1 `chat_visitors`

Supports anonymous and identified visitors.

Suggested columns:

- `id`
- `anonymous_token_hash`
- `contact_id`
- `first_seen_at`
- `last_seen_at`
- `preferred_locale`
- `metadata`
- timestamps

Do not store raw insecure session tokens.

## 15.2 `chat_conversations`

Suggested columns:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `visitor_id` | `uuid` |
| `lead_id` | `uuid` nullable |
| `status` | `text` |
| `mode` | `text` |
| `source_page` | `text` nullable |
| `assigned_to` | `uuid` nullable |
| `last_message_at` | `timestamptz` |
| `resolved_at` | `timestamptz` nullable |
| `archived_at` | `timestamptz` nullable |
| `metadata` | `jsonb` |
| timestamps | standard |

Conversation statuses:

```text
open
waiting_for_admin
waiting_for_visitor
resolved
archived
```

Conversation modes:

```text
ai
human
paused
closed
```

## 15.3 `chat_messages`

Suggested columns:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `conversation_id` | `uuid` |
| `sender_type` | `text` |
| `sender_user_id` | `uuid` nullable |
| `content` | `text` |
| `content_format` | `text` |
| `ai_model` | `text` nullable |
| `ai_provider` | `text` nullable |
| `delivery_status` | `text` |
| `is_internal` | `boolean` |
| `created_at` | `timestamptz` |

Sender types:

```text
visitor
ai
admin
system
```

Public chat queries must never return `is_internal = true`.

## 15.4 `chat_assignments`

Optional assignment history:

- `id`
- `conversation_id`
- `assigned_to`
- `assigned_by`
- `assigned_at`
- `ended_at`

## 15.5 `chat_internal_notes`

Suggested columns:

- `id`
- `conversation_id`
- `author_user_id`
- `note`
- `created_at`
- `updated_at`

Never publicly readable.

## 15.6 `conversation_events`

Suggested events:

- created
- escalated
- assigned
- human_takeover
- returned_to_ai
- resolved
- archived
- email_sent

Suggested columns:

- `id`
- `conversation_id`
- `event_type`
- `actor_user_id`
- `metadata`
- `created_at`

---

## 16. AI Knowledge Tables

## 16.1 `chatbot_knowledge`

Suggested columns:

- `id`
- `slug`
- `title_translations`
- `content_translations`
- `category`
- `source_type`
- `source_id`
- `priority`
- `is_enabled`
- `is_ai_eligible`
- `last_reviewed_at`
- `reviewed_by`
- timestamps

Source types may include:

```text
manual
service
faq
portfolio
page
policy
```

## 16.2 `chatbot_settings`

Singleton.

Suggested columns:

- `id`
- `is_enabled`
- `welcome_message_translations`
- `offline_message_translations`
- `escalation_message_translations`
- `fallback_message_translations`
- `lead_capture_mode`
- `human_support_enabled`
- `allowed_categories`
- `response_style`
- `provider_config_public`
- timestamps

Never store secret API keys here.

## 16.3 `ai_faq_settings`

Singleton.

Suggested columns:

- `id`
- `is_enabled`
- `intro_translations`
- `suggested_questions`
- `allowed_categories`
- `fallback_translations`
- `cta_label_translations`
- `cta_url`
- timestamps

---

## 17. Email Tables (Communication Engine)

## 17.1 `email_logs`

Tracks every email sent through the Communication Engine (replaces the
Resend-era `email_events`, which was dropped in migration 00066).

Columns:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `template_key` | `text` nullable |
| `recipient_email` | `text` |
| `sender_email` | `text` |
| `subject` | `text` nullable |
| `language` | `text` (`en`/`de`/`fr`/`es`) |
| `status` | `text` |
| `provider_message_id` | `text` nullable |
| `error_message` | `text` nullable |
| `related_type` | `text` nullable |
| `related_id` | `uuid` nullable |
| `idempotency_key` | `text` nullable unique |
| `metadata` | `jsonb` |
| `created_at` | `timestamptz` |
| `sent_at` | `timestamptz` nullable |
| `delivered_at` | `timestamptz` nullable |

Possible statuses:

```text
queued
sent
delivered
failed
bounced
complained
```

Do not log complete sensitive message bodies unless required.

### 17.2 `email_templates`

The multilingual (en/de/fr/es) template library — 23 auto-replies + 16 manual
`template_type` templates with `key`, `category`, `name_translations`,
`subject_translations`, `body_translations`, `description`, `trigger_event`,
`is_enabled`, `display_order`. Seeded in migration 00066; CMS-editable.

### 17.3 `email_schedules`

Scheduled template sends: `template_key`, `recipient_email`, `recipient_name`,
`language`, `send_at`, `status` (`pending`/`sent`/`failed`/`cancelled`),
`data` (auto-fill context), `error_message`.

### 17.4 `automation_triggers`

Maps business `event_type` to a `template_key` (`enabled` flag). Seeded with
defaults in migration 00066; admin-configurable.

---

## 18. Audit Logs

## 18.1 `audit_logs`

Audit logs may be introduced for high-value actions.

Suggested columns:

- `id`
- `actor_user_id`
- `action`
- `target_table`
- `target_id`
- `previous_data`
- `new_data`
- `metadata`
- `created_at`

Avoid logging secrets and unnecessary personal data.

Audit logging may initially cover:

- Publish
- Delete
- Role change
- Human takeover
- Settings changes
- Media deletion

---

## 19. Content Status Rules

Standard content status:

```text
draft
published
archived
```

Visibility:

```text
is_visible boolean
```

Public content must satisfy both:

```text
status = 'published'
and is_visible = true
```

Singleton sections without full publishing may initially use only `is_visible`.

Do not mix status meanings inconsistently across tables.

---

## 20. Public Read Model

Public users may read only approved public content.

Examples:

- Published services
- Published portfolio projects
- Published insights
- Visible testimonials
- Visible pricing
- Visible FAQs
- Active announcement
- Public navigation
- Public footer
- Public site settings
- Public media

Public users must not read:

- Draft content
- Admin users
- Leads
- Contacts
- Private conversations
- Internal notes
- Email logs
- Audit logs
- Private settings
- Secret configuration

---

## 21. RLS Strategy

RLS must be enabled on all application tables.

### 21.1 Public content policies

Example pattern:

```sql
create policy "public can read published services"
on public.services
for select
to anon, authenticated
using (
  status = 'published'
  and is_visible = true
);
```

### 21.2 Admin policies

Example pattern:

```sql
create policy "admins can manage services"
on public.services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
```

### 21.3 Private operational tables

Tables such as leads and conversations should have no anon select policy.

Authenticated access should require admin role.

### 21.4 Public chat inserts

Public chat operations should not rely on unrestricted direct table inserts.

Preferred approaches:

- Controlled Route Handler
- Server Action
- Security-definer RPC with strict validation

Avoid broad anon insert policies that allow arbitrary fields.

### 21.5 Service role

The service role bypasses RLS.

Use it only in trusted server-only code for documented operations.

---

## 22. Storage Policies

Storage policies must match media visibility.

### 22.1 Public buckets

Possible public buckets:

- logos
- portfolio-images
- insights-images
- general-media

Public read may be allowed for approved public assets.

### 22.2 Upload policies

Only approved admins may upload, replace, or delete CMS media.

### 22.3 Private future buckets

Chat attachments or private documents should use private buckets and signed URLs.

### 22.4 File rules

Validate:

- MIME type
- Extension
- Size
- Dimensions where appropriate
- Ownership
- Storage path

---

## 23. Index Strategy

Indexes should support real query patterns.

Recommended examples:

```sql
create index services_public_order_idx
on public.services (status, is_visible, display_order);

create index portfolio_public_idx
on public.portfolio_projects (status, is_featured, published_at desc);

create index insights_public_idx
on public.insights (status, published_at desc);

create index faqs_public_order_idx
on public.faqs (status, is_visible, display_order);

create index navigation_location_order_idx
on public.navigation_items (location, parent_id, display_order);

create index conversations_status_activity_idx
on public.chat_conversations (status, last_message_at desc);

create index messages_conversation_created_idx
on public.chat_messages (conversation_id, created_at);

create index leads_status_created_idx
on public.leads (status, created_at desc);

create index media_bucket_created_idx
on public.media_assets (bucket_name, created_at desc);

create index email_events_status_created_idx
on public.email_events (status, created_at desc);
```

Do not create speculative indexes without query evidence.

---

## 24. Constraints

Use constraints for:

- Status values
- Role values
- Locale values
- Non-negative ordering
- Non-negative file size
- Positive image dimensions
- Valid source types
- Valid sender types
- Valid conversation modes

Example:

```sql
check (display_order >= 0)
```

Validate URLs in application code.

Use database checks where practical and maintainable.

---

## 25. Updated-At Trigger

Use one reusable trigger function.

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Apply to tables containing `updated_at`.

Trigger names should be consistent:

```text
set_<table>_updated_at
```

---

## 26. Singleton Enforcement

Singleton tables should prevent multiple active rows.

Options:

1. Fixed known UUID
2. Boolean singleton column with unique check
3. Unique constant expression index

A simple approved pattern:

```sql
singleton_key boolean primary key default true check (singleton_key)
```

Use one consistent method across singleton tables.

---

## 27. Database Functions

Potential helper functions:

```text
is_admin()
has_admin_role(text[])
get_public_site_settings()
create_chat_message(...)
take_over_conversation(...)
return_conversation_to_ai(...)
resolve_conversation(...)
```

Security-definer functions must:

- Set a safe `search_path`
- Validate authorization
- Validate inputs
- Avoid exposing extra fields
- Be narrowly scoped
- Be documented

---

## 28. Realtime

Realtime may be enabled for:

- Chat messages
- Conversation status
- Admin inbox updates

Do not enable Realtime on all tables.

Realtime subscriptions must respect RLS.

Before enabling, confirm:

- Required publication configuration
- Query filters
- Client authorization
- Data volume
- Cleanup behavior

---

## 29. Migration Workflow

Migration files live in:

```text
supabase/migrations/
```

Naming:

```text
YYYYMMDDHHMMSS_description.sql
```

Workflow:

```text
Create migration
↓
Review SQL
↓
Apply to linked development project
↓
Test constraints
↓
Test RLS
↓
Run seeds if needed
↓
Generate TypeScript types
↓
Run lint and build
↓
Commit migration and docs
↓
Apply through approved production workflow
```

No untracked production schema changes.

---

## 30. No-Docker Workflow

Docker is not required.

The project may use:

- Supabase cloud project
- Supabase CLI
- Linked remote project
- Migration files
- Manual SQL seed files

Commands depend on the installed Supabase CLI version and must be verified before use.

Do not assume local `supabase db reset` is available or appropriate without Docker.

For this project, remote linked development can be the primary workflow.

---

## 31. Seed Strategy

Seed file:

```text
supabase/seed.sql
```

Seeds should include:

- Singleton defaults
- Initial navigation
- Footer groups
- Four core services
- Initial process steps
- Initial homepage content
- Initial FAQs
- Safe chatbot knowledge
- Development-only portfolio examples when appropriate

Seeds must not include:

- Production API keys
- Real private customer data
- Real private conversations
- Passwords
- Service-role keys

### 31.1 Idempotency

Seeds should be safe to rerun where practical.

Use:

- Stable IDs
- `insert ... on conflict`
- Unique slugs
- Controlled upserts

---

## 32. Generated TypeScript Types

Generate database types after schema changes.

Recommended output:

```text
src/types/database.types.ts
```

Generated types should not be manually edited.

Application-specific types may wrap generated database types.

---

## 33. Query Layer

Raw Supabase queries should be centralized in feature modules.

Examples:

```text
src/features/services/queries.ts
src/features/services/mutations.ts
src/features/portfolio/queries.ts
src/features/chat/queries.ts
```

Public query functions should select only required fields.

Avoid `select('*')` in sensitive or performance-critical paths.

---

## 34. Data Validation

Use both:

- Database constraints
- Zod validation

Database constraints protect integrity.

Zod provides application-level messages and runtime validation.

Do not rely only on TypeScript types.

---

## 35. Data Retention

Retention rules must be defined for:

- Leads
- Conversations
- Messages
- Email events
- Audit logs
- Anonymous visitors

Retention must support applicable privacy requirements.

Exact periods should be approved before implementation.

The architecture must support deletion or anonymization.

---

## 36. Privacy and Personal Data

Personal data may include:

- Names
- Emails
- Phone numbers
- Companies
- Messages
- Conversation history
- IP-derived metadata if collected
- Consent records

Rules:

- Collect only necessary data
- Restrict access
- Avoid unnecessary duplication
- Support deletion
- Avoid logging sensitive data
- Do not expose data through public policies

---

## 37. Backup and Recovery

Supabase backup capabilities should be reviewed for the selected plan.

The project should preserve:

- Migration history
- Seed files
- Documentation
- Storage references
- Recovery procedures

Future backup automation may be added.

---

## 38. Environments

Recommended environments:

- Development
- Preview or staging
- Production

Each environment should have separate:

- Supabase project where feasible
- Environment variables
- Storage
- SMTP (AWS SES) configuration
- AI configuration

Never use production private data for casual development.

---

## 39. Database Testing

Database tests should cover:

- Public read policies
- Draft-content protection
- Admin write access
- Disabled-admin rejection
- Lead privacy
- Conversation privacy
- Internal note privacy
- Storage policies
- Status constraints
- Foreign keys
- Singleton enforcement
- Seed reruns
- Human takeover functions

---

## 40. AI and Coding-Agent Rules

Coding agents must:

- Read this document
- Use migrations
- Preserve RLS
- Avoid service-role exposure
- Avoid arbitrary new tables
- Avoid generic content-block architecture
- Use approved JSONB translation fields
- Add constraints
- Add indexes based on queries
- Update generated types
- Update documentation
- Run lint and build
- Test SQL before production

AI agents must not execute destructive production SQL without explicit approval.

---

## 41. Database Review Checklist

Before approving a migration, confirm:

### Schema

- Is a dedicated table appropriate?
- Are column names clear?
- Are required fields NOT NULL?
- Are statuses constrained?
- Are timestamps present?
- Are foreign keys correct?

### Security

- Is RLS enabled?
- Are public policies minimal?
- Are private records protected?
- Is service-role use justified?

### Performance

- Are common filters indexed?
- Are indexes non-duplicative?
- Are queries selecting only needed fields?

### Multilingual

- Are translation fields consistent?
- Is English fallback supported?
- Are JSONB shapes validated?

### Operations

- Is the migration repeat-safe where applicable?
- Are seeds updated?
- Are generated types updated?
- Are docs synchronized?

---

## 42. Initial Migration Order

Recommended migration sequence:

```text
1. Extensions and shared functions
2. Admin users and role helpers
3. Media assets
4. Global settings and navigation
5. Homepage singleton tables
6. Services, process, testimonials, pricing, FAQs
7. Portfolio tables
8. Insight tables
9. Contacts and leads
10. Chat tables
11. AI knowledge and settings
12. Email events
13. Audit logs if included
14. RLS policies
15. Storage policies
16. Indexes and final constraints
```

This may be split differently if dependencies remain correct.

---

## 43. Initial Seed Order

Recommended seed order:

```text
1. Site settings
2. Announcement bar default
3. Navigation
4. Footer groups and links
5. Hero
6. Four core services
7. Process steps
8. Why Choose Us
9. Acquisition
10. Pricing
11. FAQs
12. Contact
13. Chatbot settings
14. AI FAQ settings
15. Chatbot knowledge
```

---

## 44. Definition of Database Completion

The initial database foundation is complete when:

- Migrations exist
- RLS is enabled
- Admin helper functions work
- Public content is safely readable
- Private data is protected
- Four services are seeded
- Homepage singleton records exist
- Media metadata works
- Portfolio and insights schemas exist
- Leads are stored
- Conversations and messages are stored
- Human takeover state is supported
- Chatbot knowledge is manageable
- Email events are logged
- Storage policies work
- Generated TypeScript types exist
- Seeds can be applied predictably
- Documentation matches the schema

---

## 45. Related Documentation

Read this document with:

```text
docs/PROJECT.md
docs/ARCHITECTURE.md
docs/CMS.md
docs/FRONTEND.md
docs/CHAT_SYSTEM.md
docs/EMAIL_SYSTEM.md
docs/SECURITY.md
AGENTS.md
```

Database changes should follow OpenSpec.

---

## 46. Database Summary

The Stratifit database is a purpose-built Supabase PostgreSQL schema for:

- Multilingual CMS content
- Homepage sections
- Services
- Portfolio
- Insights
- Testimonials
- Pricing
- FAQs
- Navigation and footer
- Media
- Leads
- AI chat conversations
- Human takeover
- Chatbot knowledge
- Communication Engine email logs
- Admin access

It uses dedicated tables, JSONB translation fields, strict RLS, controlled migrations, manual SQL seeds, and generated TypeScript types.

The schema is designed for the current Stratifit agency platform first, with controlled room for future features.
