## Why

The connected Supabase project (`dmkxvalcflotfekpxdfw`) is fresh with zero user tables or migrations. Every downstream feature — public website rendering, CMS editing, leads, chat, email, and AI — depends on a secure, typed, multilingual PostgreSQL foundation. This change establishes that foundation before any feature work begins, following the approved database architecture in `docs/DATABASE.md`.

Without this foundation, no content can be stored, no RLS can protect data, no CMS forms can write records, and no public queries can read published content.

## What Changes

- **Extensions and shared functions**: Enable required PostgreSQL extensions (`pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `supabase_vault`). Create the reusable `set_updated_at()` trigger function and the `is_admin()` / `has_admin_role()` authorization helpers.
- **Identity**: Create `admin_users` table linking `auth.users` to application roles with `owner` and `admin` roles.
- **Media**: Create `media_assets` table tracking Supabase Storage metadata with bucket/path uniqueness.
- **Global website tables**: Create `site_settings` (singleton), `announcement_bar` (singleton), `navigation_items`, `footer_groups`, and `footer_links`.
- **Homepage singleton tables**: Create `hero`, `why_choose_us`, `acquisition_section`, and `final_cta`.
- **Marketing collections**: Create `trusted_logos`, `services`, `process_steps`, `testimonials`, `pricing_plans`, and `faqs`.
- **Editorial content**: Create `portfolio_projects`, `portfolio_service_links`, `portfolio_media`, `insights`, `insight_categories`, and `insight_category_links`.
- **Communication**: Create `contacts`, `leads`, `chat_visitors`, `chat_conversations`, `chat_messages`, `chat_assignments`, `chat_internal_notes`, and `conversation_events`.
- **AI**: Create `chatbot_knowledge`, `chatbot_settings` (singleton), and `ai_faq_settings` (singleton).
- **Email**: Create `email_events`.
- **Audit**: Create `audit_logs`.
- **RLS policies**: Enable RLS on all tables. Add public read policies for published/visible content. Add admin-only policies for all writes.
- **Storage buckets**: Create `logos`, `portfolio-images`, `insights-images`, and `general-media` buckets with appropriate policies.
- **Seed data**: Create `supabase/seed.sql` with singleton defaults, navigation, footer, four core services, process steps, homepage content, FAQs, chatbot settings, and AI FAQ settings.
- **TypeScript types**: Generate `src/types/database.types.ts` from the final schema.
- **Indexes**: Add performance indexes for common query patterns.

## Capabilities

### New Capabilities

- `database-schema`: All PostgreSQL tables, columns, types, constraints, indexes, triggers, and relationships for the Stratifit platform.
- `database-rls`: Row Level Security policies protecting public read, admin write, and private data boundaries.
- `database-storage`: Supabase Storage buckets and policies for media management.
- `database-seed`: Seed data providing predictable development content for all major content types.
- `database-types`: Generated TypeScript database types for type-safe application code.

### Modified Capabilities

<!-- None — this is the initial foundation. No existing capabilities are being modified. -->

## Impact

- **Database**: All tables defined in `docs/DATABASE.md` sections 7–18 will be created through migrations in `supabase/migrations/`.
- **Security**: RLS will be enabled on every application table. Public users will read only published/visible content. Admin writes will require `is_admin()` authorization.
- **CMS**: All CMS editors will depend on these tables and their schemas.
- **Public website**: Every public page and section will query these tables.
- **Chat system**: Conversation, message, and visitor tables will support the AI chatbot and human takeover workflow.
- **Email system**: `email_events` will log Resend delivery records.
- **Type safety**: Generated TypeScript types will be consumed by query modules, Zod schemas, and server actions.
- **No route changes**: This change creates only database artifacts. No application routes or components are modified.
- **No dependency additions**: No new npm packages are required.
- **No scope expansion**: This change implements only the tables, RLS, storage, seeds, and types already approved in `docs/DATABASE.md`. It does not introduce new features, new content models, or new business capabilities beyond what the documentation specifies.
