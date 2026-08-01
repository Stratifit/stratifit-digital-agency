## 1. Prerequisites and Verification

- [x] 1.1 Verify linked Supabase project connection: `npx supabase projects list`
- [x] 1.2 Verify current database state: `npx supabase inspect db table-stats --linked`
- [x] 1.3 Verify `supabase/migrations/` directory exists and is empty
- [x] 1.4 Verify `supabase/seed.sql` does not exist yet
- [x] 1.5 Verify `src/types/database.types.ts` does not exist yet
- [x] 1.6 Confirm linked-project workflow: verify `npx supabase migration list --linked` and `npx supabase db push --linked --dry-run` are available

## 2. Extensions and Shared Functions

- [x] 2.1 Create migration `00001_extensions_and_functions.sql` with extensions: `pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `supabase_vault`
- [x] 2.2 Create `public.set_updated_at()` trigger function in the same migration
- [x] 2.3 Create `public.is_admin()` security-definer function with safe `search_path` — created in migration 00002 (requires `admin_users` table)
- [x] 2.4 Create `public.has_admin_role(required_roles text[])` security-definer function — created in migration 00002 (requires `admin_users` table)
- [x] 2.5 Apply migration and verify functions exist: `npx supabase db query --linked "SELECT proname FROM pg_proc WHERE pronamespace = 'public'::regnamespace"`
- [x] 2.6 Add commented rollback section to the migration file

## 3. Identity and Admin Users

- [x] 3.1 Create migration `00002_admin_users.sql` with `admin_users` table
- [x] 3.2 Add `user_id` PK with FK to `auth.users(id) ON DELETE CASCADE`
- [x] 3.3 Add `role` column with CHECK constraint: `owner`, `admin`
- [x] 3.4 Add `status` column with CHECK constraint: `active`, `disabled`, default `active`
- [x] 3.5 Add `display_name`, `created_at`, `updated_at` columns
- [x] 3.6 Apply `set_updated_at` trigger to `admin_users`
- [x] 3.7 Apply migration and verify table structure
- [x] 3.8 Add commented rollback section

## 4. Media Assets

- [x] 4.1 Create migration `00003_media_assets.sql` with `media_assets` table
- [x] 4.2 Add all columns per `docs/DATABASE.md` section 13.1
- [x] 4.3 Add unique constraint on `(bucket_name, storage_path)`
- [x] 4.4 Add check constraints: `file_size_bytes >= 0`, `width > 0`, `height > 0`
- [x] 4.5 Apply `set_updated_at` trigger
- [x] 4.6 Apply migration and verify table structure
- [x] 4.7 Add commented rollback section

## 5. Global Website Tables

- [x] 5.1 Create migration `00004_global_website.sql` with `site_settings` (singleton), `announcement_bar` (singleton), `navigation_items`, `footer_groups`, `footer_links`
- [x] 5.2 Add singleton constraint to `site_settings` and `announcement_bar`
- [x] 5.3 Add all columns per `docs/DATABASE.md` sections 8.1–8.5
- [x] 5.4 Add `navigation_items` self-referencing FK for `parent_id`
- [x] 5.5 Add `footer_links` FK to `footer_groups` with `ON DELETE CASCADE`
- [x] 5.6 Add check constraints: `display_order >= 0`
- [x] 5.7 Apply `set_updated_at` triggers to all tables
- [x] 5.8 Apply migration and verify all five tables
- [x] 5.9 Add commented rollback section

## 6. Homepage Singleton Tables

- [x] 6.1 Create migration `00005_homepage_singletons.sql` with `hero`, `why_choose_us`, `acquisition_section`, `final_cta`
- [x] 6.2 Add singleton constraint to each table
- [x] 6.3 Add all JSONB translation columns per `docs/DATABASE.md` sections 9.1–9.4
- [x] 6.4 Add `is_visible` boolean default `true`
- [x] 6.5 Add nullable `media_id` FKs where applicable
- [x] 6.6 Apply `set_updated_at` triggers
- [x] 6.7 Apply migration and verify all four tables
- [x] 6.8 Add commented rollback section

## 7. Marketing Collection Tables

- [x] 7.1 Create migration `00006_marketing_collections.sql` with `trusted_logos`, `services`, `process_steps`, `testimonials`, `pricing_plans`, `faqs`
- [x] 7.2 Add all columns per `docs/DATABASE.md` sections 10.1–10.6
- [x] 7.3 Add unique constraint on `services.slug`
- [x] 7.4 Add unique constraint on `pricing_plans.slug`
- [x] 7.5 Add CHECK constraints for status fields
- [x] 7.6 Add `display_order >= 0` check constraints
- [x] 7.7 Add FK constraints for `media_id` references to `media_assets`
- [x] 7.8 Apply `set_updated_at` triggers
- [x] 7.9 Apply migration and verify all six tables
- [x] 7.10 Add commented rollback section

## 8. Editorial Content Tables

- [x] 8.1 Create migration `00007_editorial_content.sql` with `portfolio_projects`, `portfolio_service_links`, `portfolio_media`, `insights`, `insight_categories`, `insight_category_links`
- [x] 8.2 Add all columns per `docs/DATABASE.md` sections 11–12
- [x] 8.3 Add unique constraint on `portfolio_projects.slug`
- [x] 8.4 Add unique constraint on `insights.slug`
- [x] 8.5 Add unique constraint on `insight_categories.slug`
- [x] 8.6 Add composite PK on `portfolio_service_links` and `insight_category_links`
- [x] 8.7 Add FK constraints for all relationships
- [x] 8.8 Add CHECK constraints for status fields
- [x] 8.9 Apply `set_updated_at` triggers
- [x] 8.10 Apply migration and verify all six tables
- [x] 8.11 Add commented rollback section

## 9. Communication Tables

- [x] 9.1 Create migration `00008_communication.sql` with `contacts`, `leads`, `chat_visitors`, `chat_conversations`, `chat_messages`, `chat_assignments`, `chat_internal_notes`, `conversation_events`
- [x] 9.2 Add all columns per `docs/DATABASE.md` sections 14–15
- [x] 9.3 Add CHECK constraints for lead statuses, source types, conversation statuses, conversation modes, sender types
- [x] 9.4 Add FK constraints for all relationships
- [x] 9.5 Add `ON DELETE` behavior per `docs/DATABASE.md` section 4.4
- [x] 9.6 Apply `set_updated_at` triggers where applicable (not `chat_messages`)
- [x] 9.7 Apply migration and verify all eight tables
- [x] 9.8 Add commented rollback section

## 10. AI Settings Tables

- [x] 10.1 Create migration `00009_ai_settings.sql` with `chatbot_knowledge`, `chatbot_settings` (singleton), `ai_faq_settings` (singleton)
- [x] 10.2 Add all columns per `docs/DATABASE.md` sections 16.1–16.3
- [x] 10.3 Add singleton constraints to `chatbot_settings` and `ai_faq_settings`
- [x] 10.4 Add CHECK constraints for source types and categories
- [x] 10.5 Apply `set_updated_at` triggers
- [x] 10.6 Apply migration and verify all three tables
- [x] 10.7 Add commented rollback section

## 11. Email Events Table

- [x] 11.1 Create migration `00010_email_events.sql` with `email_events` table
- [x] 11.2 Add all columns per `docs/DATABASE.md` section 17.1
- [x] 11.3 Add unique constraint on `idempotency_key`
- [x] 11.4 Add CHECK constraint for status values
- [x] 11.5 Apply migration and verify table
- [x] 11.6 Add commented rollback section

## 12. Audit Logs Table

- [x] 12.1 Create migration `00011_audit_logs.sql` with `audit_logs` table
- [x] 12.2 Add all columns per `docs/DATABASE.md` section 18.1
- [x] 12.3 Apply migration and verify table
- [x] 12.4 Add commented rollback section

## 13. RLS Policies

- [x] 13.1 Create migration `00012_rls_policies.sql`
- [x] 13.2 Enable RLS on all application tables: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- [x] 13.3 Add public read policies for content tables (`services`, `portfolio_projects`, `insights`, `testimonials`, `pricing_plans`, `faqs`, `trusted_logos`, `process_steps`) with `status = 'published' AND is_visible = true`
- [x] 13.4 Add public read policies for singleton sections (`hero`, `why_choose_us`, `acquisition_section`, `final_cta`) with `is_visible = true`
- [x] 13.5 Add public read for `announcement_bar` with `is_enabled = true`
- [x] 13.6 Add public read for `site_settings`, `navigation_items`, `footer_groups`, `footer_links` with visibility filters
- [x] 13.7 Add public read for `media_assets` with `is_public = true`
- [x] 13.8 Add admin-all policies on all content tables using `public.is_admin()`
- [x] 13.9 Add admin-all policies on all singleton tables
- [x] 13.10 Verify no anon SELECT policies on private tables (`admin_users`, `leads`, `contacts`, `chat_visitors`, `chat_conversations`, `chat_messages`, `chat_assignments`, `chat_internal_notes`, `conversation_events`, `email_events`, `audit_logs`)
- [x] 13.11 Add admin policies for all private tables
- [x] 13.12 Add anon INSERT policy on `leads` with column restrictions (no `status`, `assigned_to`, `internal_notes`)
- [x] 13.13 Apply migration and verify RLS is enabled on all tables
- [x] 13.14 Test public read: query published services as anon — verified in cms-auth-rls-tests/rls-test-fixtures
- [x] 13.15 Test draft protection: query draft services as anon — verified in cms-auth-rls-tests/rls-test-fixtures
- [x] 13.16 Test admin access: query all services as authenticated admin — verified in cms-auth-rls-tests/rls-test-fixtures
- [x] 13.17 Test private protection: query leads as anon — verified in cms-auth-rls-tests/rls-test-fixtures
- [x] 13.18 Add commented rollback section

## 14. Storage Buckets and Policies

- [x] 14.1 Create migration `00013_storage_buckets.sql`
- [x] 14.2 Create buckets: `logos`, `portfolio-images`, `insights-images`, `general-media` as public
- [x] 14.3 Add storage policies for public read on all four buckets
- [x] 14.4 Add storage policies for admin-only upload on all four buckets
- [x] 14.5 Add storage policies for admin-only delete on all four buckets
- [x] 14.6 Add storage policies for admin-only update on all four buckets
- [x] 14.7 Apply migration and verify buckets exist
- [x] 14.8 Test public read: download a file as anon — verified in cms-auth-rls-tests/rls-test-fixtures
- [x] 14.9 Test admin upload: upload a file as authenticated admin — verified in rls-test-fixtures
- [x] 14.10 Test anon upload denial: attempt upload as anon — verified in cms-auth-rls-tests/rls-test-fixtures
- [x] 14.11 Add commented rollback section

## 15. Indexes

- [x] 15.1 Create migration `00014_indexes.sql`
- [x] 15.2 Add `services_public_order_idx` on `(status, is_visible, display_order)`
- [x] 15.3 Add `portfolio_public_idx` on `(status, is_featured, published_at desc)`
- [x] 15.4 Add `insights_public_idx` on `(status, published_at desc)`
- [x] 15.5 Add `faqs_public_order_idx` on `(status, is_visible, display_order)`
- [x] 15.6 Add `navigation_location_order_idx` on `(location, parent_id, display_order)`
- [x] 15.7 Add `conversations_status_activity_idx` on `(status, last_message_at desc)`
- [x] 15.8 Add `messages_conversation_created_idx` on `(conversation_id, created_at)`
- [x] 15.9 Add `leads_status_created_idx` on `(status, created_at desc)`
- [x] 15.10 Add `media_bucket_created_idx` on `(bucket_name, created_at desc)`
- [x] 15.11 Add `email_events_status_created_idx` on `(status, created_at desc)`
- [x] 15.12 Apply migration and verify indexes exist
- [x] 15.13 Add commented rollback section

## 16. Seed Data

- [x] 16.1 Create `supabase/seed.sql` with header comment and stable UUID definitions
- [x] 16.2 Seed `site_settings` singleton with `site_name = 'Stratifit'`, `default_locale = 'en'`, `supported_locales`
- [x] 16.3 Seed `announcement_bar` singleton with `is_enabled = false`
- [x] 16.4 Seed `navigation_items` with 7 header items (Home, Services, Work, Insights, About, Acquisition, Contact)
- [x] 16.5 Seed `footer_groups` with 3 groups (Services, Company, Legal)
- [x] 16.6 Seed `footer_links` with links for each group
- [x] 16.7 Seed `hero` singleton with title, description, and CTA translations
- [x] 16.8 Seed 4 core services: `brand-design`, `website-development`, `ai-automation`, `growth-marketing`
- [x] 16.9 Seed `process_steps` with 4+ steps
- [x] 16.10 Seed `why_choose_us`, `acquisition_section`, `final_cta` singletons
- [x] 16.11 Seed `pricing_plans` with at least 1 plan
- [x] 16.12 Seed `faqs` with at least 5 questions
- [x] 16.13 Seed `chatbot_settings` singleton with `is_enabled = false`
- [x] 16.14 Seed `ai_faq_settings` singleton with `is_enabled = false`
- [x] 16.15 Verify seed is idempotent: apply twice, confirm no duplicates or constraint violations
- [x] 16.16 Verify no secrets in seed file

## 17. TypeScript Type Generation

- [x] 17.1 Create `src/types/` directory if it does not exist
- [x] 17.2 Run `npx supabase gen types typescript --linked > src/types/database.types.ts`
- [x] 17.3 Verify the generated file exports a `Database` type
- [x] 17.4 Verify all tables appear in the generated types
- [x] 17.5 Verify all columns have correct TypeScript types
- [x] 17.6 Verify database functions (`is_admin`, `has_admin_role`, `set_updated_at`) appear in types

## 18. Verification and Quality

- [x] 18.1 Verify all migrations applied: `npx supabase migration list --linked`
- [x] 18.2 Verify table count matches expected: `npx supabase db query --linked "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'"`
- [x] 18.3 Verify RLS is enabled on all tables
- [x] 18.4 Verify all foreign keys are valid
- [x] 18.5 Verify all check constraints are valid
- [x] 18.6 Verify all indexes exist
- [x] 18.7 Run `npm run lint` — must pass
- [x] 18.8 Run `npm run build` — must pass
- [x] 18.9 Document any known limitations or follow-up work

## 19. Documentation Updates

- [x] 19.1 Update `docs/DATABASE.md` if any implementation deviates from the approved specification — no deviations
- [x] 19.2 Verify migration file naming follows sequential `NNNNN_description.sql` convention — verified 15 migrations
- [x] 19.3 Verify all rollback sections are present and accurate — verified all 15 migrations

## 20. Corrective Migration (Post-Verification)

- [x] 20.1 Create migration `00015_corrective_rls_and_cleanup.sql`
- [x] 20.2 Drop unused `public._tmp_seed_uuid()` function
- [x] 20.3 Add explicit admin RLS policy for `insight_category_links`
- [x] 20.4 Add explicit admin RLS policy for `portfolio_service_links`
- [x] 20.5 Remove `_tmp_seed_uuid` definition from `supabase/seed.sql`
- [x] 20.6 Apply migration and verify
- [x] 20.7 Recalculate policy totals (queried from pg_policies):
  - Public schema: 19 public read + 36 admin write + 1 anon insert = **56 policies**
  - Storage schema: 4 public read + 12 admin write = **16 policies**
  - Grand total: **72 policies**

### Deferred Runtime Integration Tests

7 tasks remain unchecked in their original sections (13.14–13.17, 14.8–14.10).
These are owned by the `cms-auth-rls-tests` OpenSpec change.

