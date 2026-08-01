## Purpose

Defines runtime verification requirements for Stratifit RLS and Storage policies using real anonymous and authenticated sessions.

## ADDED Requirements

### Requirement: Safe runtime-test setup

The test setup SHALL use unique test identifiers for all temporary resources. The test setup SHALL NOT mutate production seeded content. The test setup SHALL NOT expose secrets in logs or evidence records. The test setup SHALL register cleanup steps before any mutation.

#### Scenario: Unique test identifiers

- **WHEN** test records are created
- **THEN** they SHALL use unique slugs, titles, or filenames prefixed with `test-`

#### Scenario: No production-data mutation

- **WHEN** tests execute
- **THEN** no existing seeded business content SHALL be modified

#### Scenario: No secret exposure

- **WHEN** test evidence is recorded
- **THEN** service-role keys, admin passwords, access tokens, and OAuth tokens SHALL NOT appear in output

#### Scenario: Cleanup registration

- **WHEN** a test creates a temporary resource
- **THEN** a cleanup step SHALL be registered before the mutation executes

### Requirement: Anonymous published-content access

The `anon` role SHALL be able to read published and visible content from approved public tables.

#### Scenario: Anon reads published services

- **WHEN** the `anon` role queries `services` where `status = 'published' AND is_visible = true`
- **THEN** matching rows SHALL be returned

#### Scenario: Anon reads published portfolio_projects

- **WHEN** the `anon` role queries `portfolio_projects` where `status = 'published'`
- **THEN** matching rows SHALL be returned

#### Scenario: Anon reads published insights

- **WHEN** the `anon` role queries `insights` where `status = 'published'`
- **THEN** matching rows SHALL be returned

#### Scenario: Anon reads published faqs

- **WHEN** the `anon` role queries `faqs` where `status = 'published' AND is_visible = true`
- **THEN** matching rows SHALL be returned

#### Scenario: Anon reads published pricing_plans

- **WHEN** the `anon` role queries `pricing_plans` where `status = 'published' AND is_visible = true`
- **THEN** matching rows SHALL be returned

#### Scenario: Anon reads visible testimonials

- **WHEN** the `anon` role queries `testimonials` where `is_visible = true`
- **THEN** matching rows SHALL be returned

#### Scenario: Anon reads visible hero

- **WHEN** the `anon` role queries `hero` where `is_visible = true`
- **THEN** matching rows SHALL be returned

#### Scenario: Anon reads site_settings

- **WHEN** the `anon` role queries `site_settings`
- **THEN** rows SHALL be returned

#### Scenario: Anon reads visible navigation_items

- **WHEN** the `anon` role queries `navigation_items` where `is_visible = true`
- **THEN** matching rows SHALL be returned

### Requirement: Anonymous draft-content denial

The `anon` role SHALL NOT be able to read draft or hidden content from content tables.

#### Scenario: Anon denied draft services

- **WHEN** the `anon` role queries `services` where `status = 'draft'`
- **THEN** zero rows SHALL be returned

#### Scenario: Anon denied hidden services

- **WHEN** the `anon` role queries `services` where `is_visible = false`
- **THEN** zero rows SHALL be returned

#### Scenario: Anon denied draft portfolio_projects

- **WHEN** the `anon` role queries `portfolio_projects` where `status = 'draft'`
- **THEN** zero rows SHALL be returned

#### Scenario: Anon denied draft insights

- **WHEN** the `anon` role queries `insights` where `status = 'draft'`
- **THEN** zero rows SHALL be returned

#### Scenario: Anon denied draft faqs

- **WHEN** the `anon` role queries `faqs` where `status = 'draft'`
- **THEN** zero rows SHALL be returned

### Requirement: Authenticated admin access

An authenticated active admin user SHALL have full SELECT, INSERT, UPDATE, and DELETE access on all tables.

#### Scenario: Admin reads all services

- **WHEN** an authenticated active admin queries `services`
- **THEN** all rows (published and draft) SHALL be returned

#### Scenario: Admin reads private leads

- **WHEN** an authenticated active admin queries `leads`
- **THEN** all rows SHALL be returned

#### Scenario: Admin inserts temporary service

- **WHEN** an authenticated active admin inserts a temporary service row
- **THEN** the insert SHALL succeed

#### Scenario: Admin updates temporary service

- **WHEN** an authenticated active admin updates a temporary service row
- **THEN** the update SHALL succeed

#### Scenario: Admin deletes temporary service

- **WHEN** an authenticated active admin deletes a temporary service row
- **THEN** the delete SHALL succeed

#### Scenario: Inactive admin denied

- **WHEN** an authenticated user has no `admin_users` row or `status != 'active'`
- **THEN** admin-only operations SHALL be denied by RLS

### Requirement: Anonymous private-table denial

The `anon` role SHALL NOT be able to read private operational tables.

#### Scenario: Anon denied admin_users

- **WHEN** the `anon` role queries `admin_users`
- **THEN** zero rows SHALL be returned

#### Scenario: Anon denied leads

- **WHEN** the `anon` role queries `leads`
- **THEN** zero rows SHALL be returned

#### Scenario: Anon denied contacts

- **WHEN** the `anon` role queries `contacts`
- **THEN** zero rows SHALL be returned

#### Scenario: Anon denied chat_conversations

- **WHEN** the `anon` role queries `chat_conversations`
- **THEN** zero rows SHALL be returned

#### Scenario: Anon denied email_events

- **WHEN** the `anon` role queries `email_events`
- **THEN** zero rows SHALL be returned

#### Scenario: Anon denied audit_logs

- **WHEN** the `anon` role queries `audit_logs`
- **THEN** zero rows SHALL be returned

### Requirement: Lead submission boundary

The `anon` role SHALL be able to insert leads with only permitted columns. The `anon` role SHALL NOT be able to read inserted leads afterward.

#### Scenario: Anon inserts allowed lead payload

- **WHEN** the `anon` role inserts a lead with `status = 'new'`, `assigned_to = NULL`, `internal_notes = NULL`
- **THEN** the insert SHALL succeed

#### Scenario: Anon denied protected lead fields

- **WHEN** the `anon` role inserts a lead with `status != 'new'` or `assigned_to IS NOT NULL`
- **THEN** the insert SHALL be denied by RLS

#### Scenario: Anon cannot read inserted leads

- **WHEN** the `anon` role queries `leads` after inserting
- **THEN** zero rows SHALL be returned (including the just-inserted row)

### Requirement: Public Storage download

An anonymous user SHALL be able to download objects from public Storage buckets.

#### Scenario: Anon downloads public Storage file

- **WHEN** the `anon` role requests a file from a public bucket (e.g., `logos`)
- **THEN** the file SHALL be returned successfully

### Requirement: Admin Storage management

An authenticated active admin SHALL be able to upload, update, and delete Storage objects.

#### Scenario: Admin uploads Storage file

- **WHEN** an authenticated active admin uploads a file to an approved bucket
- **THEN** the upload SHALL succeed

#### Scenario: Admin deletes Storage file

- **WHEN** an authenticated active admin deletes a file from an approved bucket
- **THEN** the deletion SHALL succeed

### Requirement: Anonymous Storage mutation denial

The `anon` role SHALL NOT be able to upload, update, or delete Storage objects.

#### Scenario: Anon upload to logos denied

- **WHEN** the `anon` role attempts to upload a file to the `logos` bucket
- **THEN** the upload SHALL be denied

#### Scenario: Anon upload to portfolio-images denied

- **WHEN** the `anon` role attempts to upload a file to the `portfolio-images` bucket
- **THEN** the upload SHALL be denied

#### Scenario: Anon update denied

- **WHEN** the `anon` role attempts to update an object in any public bucket
- **THEN** the update SHALL be denied

#### Scenario: Anon delete denied

- **WHEN** the `anon` role attempts to delete an object from any public bucket
- **THEN** the deletion SHALL be denied

### Requirement: Evidence collection

Every test result SHALL record: test ID, role, resource, operation, expected result, actual result, pass or fail, and cleanup status.

#### Scenario: Evidence record created

- **WHEN** a test completes
- **THEN** an evidence record SHALL be created with all required fields

### Requirement: Cleanup

All temporary resources SHALL be removed after testing. Cleanup SHALL execute even if tests fail.

#### Scenario: Temporary database rows removed

- **WHEN** testing completes
- **THEN** all temporary service, lead, and admin_users rows SHALL be deleted

#### Scenario: Temporary Auth user removed

- **WHEN** testing completes
- **THEN** the temporary Auth user SHALL be deleted

#### Scenario: Temporary Storage objects removed

- **WHEN** testing completes
- **THEN** all temporary Storage files SHALL be deleted

#### Scenario: Cleanup verified

- **WHEN** cleanup executes
- **THEN** verification queries SHALL confirm all temporary resources are absent

### Requirement: Failure handling

If a policy test fails, the affected test group SHALL stop. The failure SHALL be recorded with the exact request, role, table or bucket, expected result, and actual result. No direct production patch SHALL be applied.

#### Scenario: Policy mismatch stops test group

- **WHEN** a test observes an unexpected RLS result
- **THEN** the remaining tests in that group SHALL be skipped

#### Scenario: Failure recorded honestly

- **WHEN** a test fails
- **THEN** the evidence record SHALL contain the exact failure details

#### Scenario: No direct patch

- **WHEN** a test fails
- **THEN** no SQL SHALL be executed against the database during the test run

### Requirement: Verification

After testing, migration list SHALL remain unchanged unless a separate corrective migration is approved. No new permanent schema objects SHALL exist. Lint and build SHALL pass if repository code was changed.

#### Scenario: Migration list unchanged

- **WHEN** tests complete
- **THEN** `npx supabase migration list --linked` SHALL show the same migrations as before testing

#### Scenario: No new schema objects

- **WHEN** tests complete
- **THEN** no new tables, functions, or policies SHALL exist beyond what was created before testing

#### Scenario: Lint passes

- **WHEN** repository test code was added
- **THEN** `npm run lint` SHALL pass

#### Scenario: Build passes

- **WHEN** repository code was changed
- **THEN** `npm run build` SHALL pass
