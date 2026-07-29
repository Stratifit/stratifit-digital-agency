# DATABASE.md

## 1. Purpose

This document defines the database architecture for the Stratifit Digital Agency platform and CMS.
It outlines the Postgres schema, table relationships, foreign key constraints, Row Level Security (RLS) policies, triggers, index strategies, and migration rules implemented in Supabase.

The database serves as the single source of truth for:

* Dynamic CMS page trees, sections, and composable content blocks
* Multilingual content models (EN + DE localization support)
* Media asset metadata and storage references
* Global platform configurations and navigation structure
* AI execution logs and system audit trails
* Future multi-tenant SaaS expansions

All schema changes must originate from an OpenSpec change proposal and be applied strictly through version-controlled SQL migrations in `supabase/migrations/`.

---

## 2. Core Architectural Principles

* **CMS-Driven & Compositional:** All page routes, section trees, and content payloads originate from relational SQL tables rather than static code files.
* **Multilingual-First:** English (`en`) and German (`de`) localization are natively built into the schema via standard entity translation mappings with clean language fallbacks.
* **Strict Row Level Security (RLS):** Read-only public access is restricted to published content (`status = 'published'`). Mutations require authenticated JWT roles or server-side service-role keys.
* **JSONB Payload Flexibility:** `content_blocks` use typed JSONB payloads for presentation properties, backed by explicit relational identifiers for foreign media assets.
* **Auditability & AI Safety:** All mutations execute audit triggers. AI agent actions operate strictly through server-bound service-role environments and log prompt/output metadata into `ai_logs`.

---

## 3. Schema Overview & Entity Relationship Diagram

```text
+---------------------+         +------------------------+         +-------------------------------+
|       pages         | 1     N |        sections        | 1     N |        content_blocks         |
|---------------------|---------|------------------------|---------|-------------------------------|
| id (PK)             |         | id (PK)                |         | id (PK)                       |
| slug (UQ)           |         | page_id (FK)           |         | section_id (FK)               |
| title               |         | component_type         |         | block_type                    |
| status              |         | display_order          |         | data (JSONB)                  |
| meta_data (JSONB)   |         | visibility_rules JSONB |         | display_order                 |
+---------------------+         +------------------------+         +-------------------------------+
           |                                                                       |
           |                                                                       | N (via data.media_id)
           | 1                                                                     v 1
           |                                                       +-------------------------------+
           |                                                       |             media             |
           |                                                       |-------------------------------|
           |                                                       | id (PK)                       |
           |                                                       | storage_path (UQ)             |
           |                                                       | alt_text                      |
           |                                                       | mime_type                     |
           +---------------------------------------------+         +-------------------------------+
                                                         |
                                                         v N
+---------------------+         +------------------------+         +-------------------------------+
|     navigation      |         |      translations      |         |           settings            |
|---------------------|         |------------------------|         |-------------------------------|
| id (PK)             |         | id (PK)                |         | id (PK)                       |
| page_id (FK, OPT)   |         | entity_type            |         | key (UQ)                      |
| label               |         | entity_id              |         | value (JSONB)                 |
| target_url          |         | locale                 |         +-------------------------------+
| display_order       |         | translated_fields JSONB|
+---------------------+         +------------------------+

```

---

## 4. Table Definitions

### 4.1 `pages`

Stores top-level CMS pages, route slugs, and SEO metadata.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique page identifier |
| `slug` | `text` | `NOT NULL`, `UNIQUE` | Canonical URL slug (e.g., `/`, `about`, `services/web-dev`) |
| `title` | `text` | `NOT NULL` | Page title for navigation and SEO |
| `status` | `text` | `NOT NULL`, `DEFAULT 'draft'` | Content lifecycle (`draft`, `published`, `archived`) |
| `meta_data` | `jsonb` | `NOT NULL`, `DEFAULT '{}'::jsonb` | Structured OpenGraph, meta description, and canonical tags |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Creation timestamp |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Updated via trigger |

### 4.2 `sections`

Represents structural layout sections on a page (e.g., hero, feature grid, contact form).

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique section identifier |
| `page_id` | `uuid` | `NOT NULL`, `REFERENCES pages(id) ON DELETE CASCADE` | Parent page relationship |
| `component_type` | `text` | `NOT NULL` | Registered frontend component key (e.g., `hero-primary`) |
| `display_order` | `integer` | `NOT NULL`, `DEFAULT 0` | Render ordering index |
| `visibility` | `jsonb` | `NOT NULL`, `DEFAULT '{"device": "all"}'::jsonb` | Conditional render settings (e.g., mobile vs desktop) |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Creation timestamp |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Updated via trigger |

### 4.3 `content_blocks`

Atomic presentation components contained inside sections.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique content block identifier |
| `section_id` | `uuid` | `NOT NULL`, `REFERENCES sections(id) ON DELETE CASCADE` | Parent section relationship |
| `block_type` | `text` | `NOT NULL` | Atomic element type (`heading`, `rich_text`, `card`, `media_embed`) |
| `data` | `jsonb` | `NOT NULL`, `DEFAULT '{}'::jsonb` | Component property payload (text, media_id references, styles) |
| `display_order` | `integer` | `NOT NULL`, `DEFAULT 0` | Display position within section |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Creation timestamp |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Updated via trigger |

### 4.4 `media`

Tracks visual assets stored in Supabase Storage buckets.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique media identifier |
| `storage_path` | `text` | `NOT NULL`, `UNIQUE` | Bucket path in Supabase Storage (e.g., `images/hero-bg.webp`) |
| `public_url` | `text` | `NOT NULL` | Fully resolved CDN image URL |
| `alt_text` | `text` | `NOT NULL`, `DEFAULT ''` | Accessibility description |
| `mime_type` | `text` | `NOT NULL` | Asset MIME type (`image/png`, `image/webp`, `video/mp4`) |
| `dimensions` | `jsonb` | `NOT NULL`, `DEFAULT '{}'::jsonb` | Width, height, and display aspect ratios |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Creation timestamp |

### 4.5 `navigation`

Defines hierarchical navigation headers, footers, and menu items.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique navigation item ID |
| `page_id` | `uuid` | `NULLABLE`, `REFERENCES pages(id) ON DELETE SET NULL` | Optional direct link to page entity |
| `label` | `text` | `NOT NULL` | Menu display string |
| `target_url` | `text` | `NOT NULL` | Destination URL path |
| `menu_type` | `text` | `NOT NULL`, `DEFAULT 'header'` | Navigation location (`header`, `footer`, `sidebar`) |
| `display_order` | `integer` | `NOT NULL`, `DEFAULT 0` | Rendering order |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Creation timestamp |

### 4.6 `settings`

Global application settings and configuration values.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique setting identifier |
| `key` | `text` | `NOT NULL`, `UNIQUE` | Unique key name (`site_name`, `theme_config`, `analytics_id`) |
| `value` | `jsonb` | `NOT NULL` | Structured setting payload |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Updated via trigger |

### 4.7 `translations`

Stores localized field overrides for pages, sections, and blocks.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique record identifier |
| `entity_type` | `text` | `NOT NULL` | Target entity (`pages`, `sections`, `content_blocks`) |
| `entity_id` | `uuid` | `NOT NULL` | Target record UUID |
| `locale` | `text` | `NOT NULL` | Target language code (`en`, `de`) |
| `translated_fields` | `jsonb` | `NOT NULL` | Key-value pairs matching entity translation schema |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Updated via trigger |

---

### 4.8 System & Audit Tables

#### `ai_logs`

Tracks AI agent executions, prompt payloads, and code generation outputs.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique log entry ID |
| `agent_role` | `text` | `NOT NULL` | Name of execution agent (e.g., `Architecture Bot`, `CMS Bot`) |
| `action` | `text` | `NOT NULL` | Description of operation performed |
| `input_payload` | `jsonb` | `NOT NULL` | Prompt, context, and spec constraints |
| `output_payload` | `jsonb` | `NOT NULL` | Model response, generated code, or action output |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Log timestamp |

#### `audit_logs`

Audits database write events across tables.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Log ID |
| `target_table` | `text` | `NOT NULL` | Affected database table name |
| `record_id` | `uuid` | `NOT NULL` | Affected record UUID |
| `operation` | `text` | `NOT NULL` | Operation type (`INSERT`, `UPDATE`, `DELETE`) |
| `user_id` | `uuid` | `NULLABLE`, `REFERENCES auth.users(id)` | Authenticated user performing action |
| `previous_data` | `jsonb` | `NULLABLE` | Pre-mutation row snapshot |
| `new_data` | `jsonb` | `NULLABLE` | Post-mutation row snapshot |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Timestamp |

---

## 5. Indexes & Performance Rules

To optimize CMS dynamic query paths, explicit composite indexes are enforced:

```sql
-- Fast page lookup by slug
CREATE UNIQUE INDEX idx_pages_slug ON pages(slug);

-- Fast hierarchical lookup of published page trees
CREATE INDEX idx_pages_status_slug ON pages(status, slug);

-- Ordered section lookup by parent page
CREATE INDEX idx_sections_page_order ON sections(page_id, display_order ASC);

-- Ordered block lookup by parent section
CREATE INDEX idx_blocks_section_order ON content_blocks(section_id, display_order ASC);

-- Entity translation lookup
CREATE INDEX idx_translations_entity ON translations(entity_type, entity_id, locale);

```

---

## 6. Row Level Security (RLS) Policies

RLS is enabled on all public-facing and administration tables.

### 6.1 Public Read Policies

```sql
-- Public can read published pages
CREATE POLICY "Public Read Published Pages" ON pages
  FOR SELECT USING (status = 'published');

-- Public can read sections of published pages
CREATE POLICY "Public Read Sections" ON sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = sections.page_id AND pages.status = 'published'
    )
  );

-- Public can read content_blocks of published pages
CREATE POLICY "Public Read Content Blocks" ON content_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sections
      JOIN pages ON pages.id = sections.page_id
      WHERE sections.id = content_blocks.section_id AND pages.status = 'published'
    )
  );

```

### 6.2 Admin & Service Role Policies

```sql
-- Admin full access across tables
CREATE POLICY "Admin Full Access Pages" ON pages
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- System & AI Service Role Bypass
-- Service role key automatically bypasses RLS in secure server contexts.

```

---

## 7. Database Triggers & Functions

### Automated `updated_at` Refresh

```sql
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER refresh_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER refresh_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

```

---

## 8. Migration Rules & Governance

1. **Version-Controlled Files:** SQL migrations are sequentially named in `supabase/migrations/<YYYYMMDDHHMMSS>_<description>.sql`.
2. **Migration Rollback Safety:** Every migration must be tested locally via the Supabase CLI (`supabase db reset` and `supabase migration up`) before deployment.
3. **OpenSpec Alignment:** No database migration PR will be merged without an accompanying change proposal in `openspec/changes/`.
4. **Documentation Synchronization:** Any schema adjustment requires an explicit update to `DATABASE.md` and `CMS.md`.
