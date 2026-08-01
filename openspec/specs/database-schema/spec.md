# database-schema Specification

## Purpose

Defines the complete PostgreSQL table structure, columns, types, constraints, indexes, triggers, and relationships for the Stratifit Digital Agency Platform.

## Requirements

### Requirement: UUID primary keys

Every application table SHALL use `uuid primary key default gen_random_uuid()` for its primary key column. The `admin_users` table SHALL use `user_id uuid primary key` as a foreign key to `auth.users(id)`.

#### Scenario: Primary key generation

- **WHEN** a new row is inserted into any application table without specifying an `id` value
- **THEN** PostgreSQL SHALL generate a UUID v4 using `gen_random_uuid()` and assign it to the `id` column

### Requirement: Timestamp columns

Every application table SHALL include `created_at timestamptz not null default now()` and `updated_at timestamptz not null default now()` columns. Tables with domain-specific temporal semantics (e.g., `published_at`, `resolved_at`, `archived_at`) SHALL use nullable `timestamptz` columns.

#### Scenario: Timestamp default values

- **WHEN** a new row is inserted without specifying `created_at` or `updated_at`
- **THEN** both columns SHALL default to `now()`

#### Scenario: Updated-at trigger

- **WHEN** an existing row is updated in a table that has an `updated_at` column
- **THEN** the `updated_at` column SHALL be set to `now()` automatically by the `set_updated_at()` trigger function

### Requirement: Multilingual JSONB translation fields

Translatable text fields SHALL use the naming pattern `<field>_translations` and store a JSONB object with keys `en`, `de`, `fr`, and `es`. The `en` key SHALL be present for required public content. Secondary language keys MAY be absent or empty.

#### Scenario: Translation object shape

- **WHEN** a row is inserted or updated with a translation field
- **THEN** the JSONB value SHALL be a JSON object with optional keys `en`, `de`, `fr`, and `es`

### Requirement: Singleton table enforcement

Singleton tables (`site_settings`, `announcement_bar`, `hero`, `why_choose_us`, `acquisition_section`, `final_cta`, `chatbot_settings`, `ai_faq_settings`) SHALL prevent more than one active row. The approved pattern is `singleton_key boolean primary key default true check (singleton_key)`.

#### Scenario: Singleton row limit

- **WHEN** an INSERT attempts to add a second row to a singleton table
- **THEN** PostgreSQL SHALL reject the insert with a unique constraint violation

### Requirement: Slug constraints

Tables with a `slug` column SHALL enforce `text unique not null` with a check constraint ensuring lowercase, hyphens only, no leading/trailing hyphens, and no consecutive hyphens.

#### Scenario: Slug uniqueness

- **WHEN** a row is inserted with a `slug` value that already exists in the same table
- **THEN** PostgreSQL SHALL reject the insert with a unique constraint violation

#### Scenario: Slug format

- **WHEN** a row is inserted with a `slug` value containing uppercase letters, underscores, leading hyphens, trailing hyphens, or consecutive hyphens
- **THEN** PostgreSQL SHALL reject the insert with a check constraint violation

### Requirement: Ordering fields

Collection tables that require display ordering SHALL include an `integer not null default 0` column named `display_order`. A check constraint SHALL enforce `display_order >= 0`.

#### Scenario: Non-negative ordering

- **WHEN** a row is inserted or updated with a negative `display_order` value
- **THEN** PostgreSQL SHALL reject the write with a check constraint violation

### Requirement: Status constraints

Tables with a `status` column SHALL use a CHECK constraint with approved values. The standard content status is `draft`, `published`, `archived`. Lead statuses are `new`, `contacted`, `qualified`, `proposal`, `won`, `lost`, `archived`. Conversation statuses are `open`, `waiting_for_admin`, `waiting_for_visitor`, `resolved`, `archived`.

#### Scenario: Valid status value

- **WHEN** a row is inserted or updated with a `status` value not in the approved CHECK list
- **THEN** PostgreSQL SHALL reject the write with a check constraint violation

### Requirement: Boolean visibility and publish flags

Tables with an `is_visible` column SHALL default to `true`. Tables with an `is_featured` column SHALL default to `false`. Tables with an `is_enabled` column SHALL default to `false`.

#### Scenario: Default visibility

- **WHEN** a new row is inserted without specifying `is_visible`
- **THEN** `is_visible` SHALL default to `true`

### Requirement: Foreign key relationships

Child tables SHALL reference parent tables using `uuid` foreign keys with appropriate `ON DELETE` behavior. Owned child records SHALL use `ON DELETE CASCADE`. Optional historical references SHALL use `ON DELETE SET NULL`.

#### Scenario: Cascade delete

- **WHEN** a parent row is deleted and a child table has `ON DELETE CASCADE`
- **THEN** all matching child rows SHALL be deleted

#### Scenario: Set null on delete

- **WHEN** a parent row is deleted and a child table has `ON DELETE SET NULL`
- **THEN** the foreign key column in matching child rows SHALL be set to `NULL`

### Requirement: Admin users table

The `admin_users` table SHALL link Supabase Auth users to application roles. Columns: `user_id uuid PK FK auth.users(id) ON DELETE CASCADE`, `role text NOT NULL CHECK (role IN ('owner', 'admin'))`, `status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled'))`, `display_name text`, `created_at timestamptz`, `updated_at timestamptz`.

#### Scenario: Admin user creation

- **WHEN** an admin user is inserted with a valid `auth.users` ID
- **THEN** the row SHALL be created with the specified role and default `active` status

#### Scenario: Cascade on auth user deletion

- **WHEN** a row in `auth.users` is deleted
- **THEN** the corresponding `admin_users` row SHALL be deleted automatically

### Requirement: Media assets table

The `media_assets` table SHALL track Supabase Storage metadata. Unique constraint on `(bucket_name, storage_path)`. The `file_size_bytes` column SHALL be `bigint not null check (file_size_bytes >= 0)`. The `width` and `height` columns SHALL be nullable integers with `check (width > 0)` and `check (height > 0)` when present.

#### Scenario: Duplicate storage path rejection

- **WHEN** a row is inserted with a `(bucket_name, storage_path)` pair that already exists
- **THEN** PostgreSQL SHALL reject the insert with a unique constraint violation

### Requirement: Public content tables

Public-facing content tables (`services`, `portfolio_projects`, `insights`, `testimonials`, `pricing_plans`, `faqs`, `trusted_logos`, `process_steps`) SHALL include status, visibility, and ordering fields as specified in `docs/DATABASE.md`.

#### Scenario: Services table structure

- **WHEN** the `services` table is queried
- **THEN** it SHALL contain columns: `id`, `slug`, `title_translations`, `short_description_translations`, `full_description_translations`, `deliverables_translations`, `icon_name`, `featured_media_id`, `cta_label_translations`, `cta_url`, `seo_title_translations`, `seo_description_translations`, `display_order`, `is_featured`, `is_visible`, `status`, `created_at`, `updated_at`

### Requirement: Chat and communication tables

Chat tables (`chat_visitors`, `chat_conversations`, `chat_messages`, `chat_assignments`, `chat_internal_notes`, `conversation_events`) SHALL follow the structure defined in `docs/DATABASE.md` sections 15.1–15.6. The `chat_messages` table SHALL NOT have an `updated_at` column.

#### Scenario: Message sender types

- **WHEN** a row is inserted into `chat_messages`
- **THEN** `sender_type` SHALL be one of `visitor`, `ai`, `admin`, or `system`

### Requirement: Email events table

The `email_events` table SHALL track Resend delivery records with an `idempotency_key text unique` column. Status values SHALL be `queued`, `sent`, `delivered`, `failed`, `bounced`, `complained`.

#### Scenario: Idempotent email logging

- **WHEN** an email event is inserted with an `idempotency_key` that already exists
- **THEN** PostgreSQL SHALL reject the insert with a unique constraint violation

### Requirement: Indexes

The following indexes SHALL be created to support common query patterns:

- `services_public_order_idx` on `(status, is_visible, display_order)`
- `portfolio_public_idx` on `(status, is_featured, published_at desc)`
- `insights_public_idx` on `(status, published_at desc)`
- `faqs_public_order_idx` on `(status, is_visible, display_order)`
- `navigation_location_order_idx` on `(location, parent_id, display_order)`
- `conversations_status_activity_idx` on `(status, last_message_at desc)`
- `messages_conversation_created_idx` on `(conversation_id, created_at)`
- `leads_status_created_idx` on `(status, created_at desc)`
- `media_bucket_created_idx` on `(bucket_name, created_at desc)`
- `email_events_status_created_idx` on `(status, created_at desc)`

#### Scenario: Public services query performance

- **WHEN** a query selects published, visible services ordered by `display_order`
- **THEN** PostgreSQL SHALL use the `services_public_order_idx` index
