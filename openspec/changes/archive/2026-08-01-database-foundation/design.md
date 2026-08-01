## Context

The connected Supabase project (`dmkxvalcflotfekpxdfw`) is fresh with zero user tables. The approved database architecture in `docs/DATABASE.md` defines 40+ tables across identity, global website, homepage, marketing, editorial, media, communication, AI, email, and audit domains. This design establishes the migration strategy, RLS pattern, storage setup, seed approach, and type generation workflow.

No Docker is required for the primary linked-project workflow. All schema changes SHALL be stored as versioned SQL migration files under `supabase/migrations/`. The implementation workflow uses `npx supabase db push --linked` for migration application and `npx supabase migration list --linked` for history comparison. Direct `db query` commands are used only for targeted inspection, diagnostics, or verification.

## Goals / Non-Goals

**Goals:**

- Create all approved tables from `docs/DATABASE.md` through version-controlled migrations
- Enable RLS on every table with public read and admin write policies
- Create Supabase Storage buckets with public read and admin-only write policies
- Provide predictable seed data for development
- Generate TypeScript database types for type-safe application code
- Establish a migration naming and ordering convention

**Non-Goals:**

- Build any frontend components or pages
- Build any CMS editors or forms
- Implement chat or email functionality
- Add Realtime subscriptions
- Create a local Supabase development environment (Docker not required)
- Implement data retention or deletion workflows
- Build audit log viewing

## Decisions

### Decision 1: Migration file structure

**Choice:** Single migration file per domain area, using `YYYYMMDDHHMMSS_description.sql` naming.

**Rationale:** The initial schema has many tables that share foreign keys and RLS policies. Splitting into too many small migrations creates ordering dependencies and complicates rollback. Grouping by domain (identity, media, global, homepage, marketing, editorial, communication, AI, email, audit, RLS, storage) keeps each file self-contained while remaining reviewable.

**Alternatives considered:**

- One migration per table: Rejected because cross-table foreign keys and RLS policies create tight coupling between consecutive migrations.
- Single monolithic migration: Rejected because it is too large to review safely and makes partial rollback impossible.

**Migration order:**

```text
00001_extensions_and_functions.sql
00002_admin_users.sql
00003_media_assets.sql
00004_global_website.sql
00005_homepage_singletons.sql
00006_marketing_collections.sql
00007_editorial_content.sql
00008_communication.sql
00009_ai_settings.sql
00010_email_events.sql
00011_audit_logs.sql
00012_rls_policies.sql
00013_storage_buckets.sql
00014_indexes.sql
```

### Decision 2: RLS policy pattern

**Choice:** Two-layer policy pattern — public read policies per content table, and admin-all policies per table using `public.is_admin()`.

**Rationale:** This matches the approved pattern in `docs/DATABASE.md` sections 21.1–21.3. Public policies filter on `status = 'published' AND is_visible = true`. Admin policies use `public.is_admin()` for both `USING` and `WITH CHECK`. Private tables have no anon select policy.

**Alternatives considered:**

- Role-based per-role policies: Rejected because version 1 only has `owner` and `admin` roles. Adding granular role policies now would be premature.
- Function-based access control: Rejected because RLS policies are simpler to audit and debug for the initial schema.

### Decision 3: Singleton enforcement pattern

**Choice:** Boolean primary key pattern: `singleton_key boolean primary key default true check (singleton_key)`.

**Rationale:** This is the approved pattern in `docs/DATABASE.md` section 26. It prevents multiple rows through a unique constraint on the boolean column, requires no additional trigger logic, and is simple to query (`SELECT * FROM hero`).

**Alternatives considered:**

- Fixed UUID: Rejected because it requires application code to know and use the specific UUID.
- Unique expression index: Rejected because the boolean PK pattern is simpler and already approved.

### Decision 4: Seed data approach

**Choice:** SQL seed file using stable UUIDs, `ON CONFLICT DO UPDATE` for singletons, and `ON CONFLICT DO NOTHING` for collections.

**Rationale:** Seed data is applied via `npx supabase db push --linked --include-seed`, which runs the configured `supabase/seed.sql` file. Stable UUIDs ensure idempotency. Direct `db query` commands SHALL NOT replace versioned migration files or the configured seed workflow.

**Alternatives considered:**

- Direct `db query` seed application: Rejected because it bypasses the versioned migration and seed infrastructure.
- JavaScript seed file: Rejected because the project uses plain SQL seeds and the Supabase CLI `--include-seed` flag.

### Decision 5: Type generation timing

**Choice:** Generate types as the final migration verification step, after all migrations and seeds are applied.

**Rationale:** Types must reflect the complete schema. Generating them incrementally during migration creation would produce incomplete types. The Supabase CLI command `npx supabase gen types typescript --linked` queries the live database schema.

### Decision 6: Storage bucket policies

**Choice:** Public read buckets with admin-only upload, update, and delete policies using `public.is_admin()`.

**Rationale:** Media assets like logos, portfolio images, and insight images are public-facing. Public read is required for the public website. Admin-only write prevents unauthorized uploads. This matches `docs/DATABASE.md` sections 22.1–22.2.

### Decision 7: Linked-project migration workflow

**Choice:** No Docker is required for the primary linked-project workflow. All schema changes SHALL be stored as versioned SQL migration files under `supabase/migrations/`.

**Implementation workflow:**

- `npx supabase migration list --linked` — compare local and remote migration history
- `npx supabase db push --linked --dry-run` — preview pending migrations without applying them
- `npx supabase db push --linked` — apply approved versioned migrations
- `npx supabase db push --linked --include-seed` — apply configured idempotent seed data when required
- `npx supabase db query --linked` — only for targeted inspection, diagnostics, or verification queries

**Rationale:** Docker is not required per `docs/DATABASE.md` section 30. The linked project provides a real PostgreSQL environment for testing RLS, constraints, and seeds. Versioned migration files are the only acceptable mechanism for schema changes. Direct `db query` commands SHALL NOT replace versioned migration files.

**Alternatives considered:**

- Local Docker stack: Rejected because Docker is not required and `supabase db reset` is not available on this machine.
- Direct `db query` for schema changes: Rejected because it bypasses versioned migration history and makes rollback impossible.

## Risks / Trade-offs

**[Risk] Large migration file review difficulty** → Mitigation: Group by domain, keep each file under 300 lines, add SQL comments explaining each section.

**[Risk] RLS policy testing without local database** → Mitigation: Use `supabase db query --linked` to test policies with different roles. Document test queries in the migration comments.

**[Risk] Seed data drift from documentation** → Mitigation: Seed values are derived directly from `docs/DATABASE.md` and `docs/PROJECT.md`. Update both files when seed content changes.

**[Risk] Type generation requires live database connection** → Mitigation: Verify the linked project connection before running type generation. Fall back to manual type update if connection fails.

**[Risk] Foreign key ordering between migrations** → Mitigation: Each migration checks for dependent table existence using `IF EXISTS` and `IF NOT EXISTS` where appropriate. The migration order is designed so parent tables are created before children.

## Migration Plan

1. Verify linked Supabase project connection: `npx supabase projects list`
2. Create migration files in `supabase/migrations/` following the numbered order
3. Apply each migration: `npx supabase db push --linked` or apply SQL via dashboard
4. Verify each migration applied: `npx supabase migration list --linked`
5. Apply seed data: `npx supabase db push --linked --include-seed`
6. Verify seed data: query each table via `supabase db query --linked`
7. Generate TypeScript types: `npx supabase gen types typescript --linked > src/types/database.types.ts`
8. Verify build: `npm run lint && npm run build`

## Rollback Strategy

Each migration should include a commented rollback section at the bottom. Rollback for the initial foundation is straightforward because no production data exists yet. If a migration fails:

1. Check the error message and fix the SQL
2. Re-apply the corrected migration
3. If needed, drop and recreate the affected table(s) using the rollback SQL

For seed data rollback: truncate the affected tables in reverse dependency order.

After production launch, rollback strategy must include data preservation considerations. This is not relevant for the initial foundation on a fresh database.
