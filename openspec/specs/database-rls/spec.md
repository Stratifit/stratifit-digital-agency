# database-rls Specification

## Purpose

Defines Row Level Security policies that protect public read access to published content, restrict admin writes to authorized users, and prevent public access to private operational data.

## Requirements

### Requirement: RLS enabled on all application tables

Every application table in the `public` schema SHALL have Row Level Security enabled. No table SHALL operate without RLS policies.

#### Scenario: RLS enforcement

- **WHEN** a query is executed against any application table
- **THEN** PostgreSQL SHALL evaluate RLS policies before returning or modifying rows

### Requirement: Public read for published content

Public users (anon and authenticated) SHALL be able to read rows from content tables only when `status = 'published'` AND `is_visible = true`. Tables affected: `services`, `portfolio_projects`, `insights`, `testimonials`, `pricing_plans`, `faqs`, `trusted_logos`, `process_steps`.

#### Scenario: Published visible content readable

- **WHEN** a public user (anon or authenticated) queries a content table
- **AND** the row has `status = 'published'` AND `is_visible = true`
- **THEN** the row SHALL be returned

#### Scenario: Draft content hidden from public

- **WHEN** a public user queries a content table
- **AND** the row has `status = 'draft'` OR `is_visible = false`
- **THEN** the row SHALL NOT be returned

### Requirement: Public read for singleton sections

Public users SHALL be able to read singleton section tables (`hero`, `why_choose_us`, `acquisition_section`, `final_cta`) when `is_visible = true`. The `announcement_bar` table SHALL be readable when `is_enabled = true`.

#### Scenario: Visible singleton readable

- **WHEN** a public user queries a singleton section table
- **AND** `is_visible = true` (or `is_enabled = true` for `announcement_bar`)
- **THEN** the row SHALL be returned

#### Scenario: Hidden singleton not readable

- **WHEN** a public user queries a singleton section table
- **AND** `is_visible = false` (or `is_enabled = false` for `announcement_bar`)
- **THEN** no rows SHALL be returned

### Requirement: Public read for global settings

Public users SHALL be able to read `site_settings`, `navigation_items` (where `is_visible = true`), `footer_groups` (where `is_visible = true`), and `footer_links` (where `is_visible = true`).

#### Scenario: Navigation items visible to public

- **WHEN** a public user queries `navigation_items`
- **AND** the row has `is_visible = true`
- **THEN** the row SHALL be returned

### Requirement: Public read for media

Public users SHALL be able to read `media_assets` rows where `is_public = true`.

#### Scenario: Public media readable

- **WHEN** a public user queries `media_assets`
- **AND** `is_public = true`
- **THEN** the row SHALL be returned

### Requirement: Admin full access for content tables

Authenticated users WHERE `public.is_admin()` returns `true` SHALL have full SELECT, INSERT, UPDATE, and DELETE access on all content tables, regardless of status or visibility.

#### Scenario: Admin reads all content

- **WHEN** an authenticated admin queries a content table
- **THEN** all rows SHALL be returned, including drafts and hidden content

#### Scenario: Admin writes content

- **WHEN** an authenticated admin inserts, updates, or deletes a row in a content table
- **THEN** the operation SHALL succeed if `public.is_admin()` returns `true`

### Requirement: Admin access for singleton tables

Authenticated users WHERE `public.is_admin()` returns `true` SHALL have full access to singleton tables (`site_settings`, `announcement_bar`, `hero`, `why_choose_us`, `acquisition_section`, `final_cta`, `chatbot_settings`, `ai_faq_settings`).

#### Scenario: Admin manages singleton

- **WHEN** an authenticated admin updates a singleton table
- **THEN** the operation SHALL succeed

### Requirement: Private tables have no anon read policy

Private operational tables (`admin_users`, `leads`, `contacts`, `chat_visitors`, `chat_conversations`, `chat_messages`, `chat_assignments`, `chat_internal_notes`, `conversation_events`, `email_events`, `audit_logs`) SHALL NOT have a SELECT policy for the `anon` role.

#### Scenario: Anonymous cannot read leads

- **WHEN** the `anon` role queries the `leads` table
- **THEN** zero rows SHALL be returned

#### Scenario: Anonymous cannot read conversations

- **WHEN** the `anon` role queries `chat_conversations`
- **THEN** zero rows SHALL be returned

### Requirement: Admin access for private tables

Authenticated users WHERE `public.is_admin()` returns `true` SHALL have SELECT, INSERT, UPDATE, and DELETE access on private operational tables.

#### Scenario: Admin reads leads

- **WHEN** an authenticated admin queries `leads`
- **THEN** all lead rows SHALL be returned

#### Scenario: Admin manages conversations

- **WHEN** an authenticated admin inserts, updates, or deletes rows in `chat_conversations` or `chat_messages`
- **THEN** the operations SHALL succeed

### Requirement: No public write for chat tables

The `anon` role SHALL NOT have INSERT, UPDATE, or DELETE policies on `chat_conversations`, `chat_messages`, `chat_assignments`, `chat_internal_notes`, or `conversation_events`. Public chat creation SHALL go through a server-side Route Handler, Server Action, or security-definer RPC.

#### Scenario: Anonymous cannot insert messages directly

- **WHEN** the `anon` role attempts to INSERT into `chat_messages`
- **THEN** the operation SHALL be denied by RLS

### Requirement: Internal messages not visible to public

Public SELECT policies on `chat_messages` SHALL exclude rows where `is_internal = true`. Only admin users SHALL be able to read internal messages.

#### Scenario: Internal message hidden from public

- **WHEN** a public user queries `chat_messages`
- **AND** the row has `is_internal = true`
- **THEN** the row SHALL NOT be returned

#### Scenario: Admin reads internal messages

- **WHEN** an authenticated admin queries `chat_messages`
- **THEN** all rows, including `is_internal = true`, SHALL be returned

### Requirement: Public can insert leads via server actions

The `anon` role MAY have INSERT access on the `leads` table for public form submissions, but the INSERT policy SHALL restrict which columns can be set. The `assigned_to`, `internal_notes`, and `status` columns SHALL NOT be settable by anonymous users.

#### Scenario: Anonymous lead insert

- **WHEN** the `anon` role inserts a row into `leads` with only permitted columns
- **THEN** the insert SHALL succeed

#### Scenario: Anonymous lead insert with restricted columns

- **WHEN** the `anon` role attempts to INSERT into `leads` with `status` or `assigned_to` set
- **THEN** the operation SHALL be denied by the INSERT policy check

### Requirement: Service role bypasses RLS

The Supabase service role client SHALL bypass all RLS policies. Service role access SHALL only be used in trusted server-only code for documented operations.

#### Scenario: Service role reads all data

- **WHEN** a query executes with the service role
- **THEN** all rows SHALL be returned regardless of RLS policies
