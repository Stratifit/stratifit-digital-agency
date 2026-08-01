# rls-test-fixtures Specification

## Purpose

Defines requirements for temporary test fixtures and the remaining 5 RLS/Storage runtime tests that were blocked or not executed in the cms-auth-rls-tests change.

## Requirements

### Requirement: Temporary published portfolio_projects fixture

A temporary `portfolio_projects` row SHALL be created with `status = 'published'` and a unique `test-*` slug. The fixture SHALL be deletable after testing.

#### Scenario: Fixture created

- **WHEN** the test setup creates a temporary portfolio_project
- **THEN** it SHALL have `status = 'published'`, `is_featured = false`, and a slug prefixed with `test-`

#### Scenario: Fixture readable by anon

- **WHEN** the `anon` role queries `portfolio_projects` where `status = 'published'`
- **THEN** the temporary fixture SHALL be returned

#### Scenario: Fixture cleaned up

- **WHEN** testing completes
- **THEN** the temporary portfolio_project row SHALL be deleted

### Requirement: Temporary published insights fixture

A temporary `insights` row SHALL be created with `status = 'published'` and a unique `test-*` slug. The fixture SHALL be deletable after testing.

#### Scenario: Fixture created

- **WHEN** the test setup creates a temporary insight
- **THEN** it SHALL have `status = 'published'`, `is_featured = false`, and a slug prefixed with `test-`

#### Scenario: Fixture readable by anon

- **WHEN** the `anon` role queries `insights` where `status = 'published'`
- **THEN** the temporary fixture SHALL be returned

#### Scenario: Fixture cleaned up

- **WHEN** testing completes
- **THEN** the temporary insight row SHALL be deleted

### Requirement: Temporary visible testimonials fixture

A temporary `testimonials` row SHALL be created with `is_visible = true` and a unique `person_name` prefixed with `test-`. The fixture SHALL be deletable after testing.

#### Scenario: Fixture created

- **WHEN** the test setup creates a temporary testimonial
- **THEN** it SHALL have `is_visible = true` and a `person_name` prefixed with `test-`

#### Scenario: Fixture readable by anon

- **WHEN** the `anon` role queries `testimonials` where `is_visible = true`
- **THEN** the temporary fixture SHALL be returned

#### Scenario: Fixture cleaned up

- **WHEN** testing completes
- **THEN** the temporary testimonial row SHALL be deleted

### Requirement: General-media bucket upload test

An authenticated active admin SHALL be able to upload a uniquely named file to the `general-media` bucket.

#### Scenario: Admin uploads to general-media

- **WHEN** an authenticated active admin uploads a file prefixed with `test-` to `general-media`
- **THEN** the upload SHALL succeed

#### Scenario: File exists in bucket

- **WHEN** the upload completes
- **THEN** the file SHALL be retrievable via public URL

### Requirement: General-media bucket delete test

An authenticated active admin SHALL be able to delete the uploaded file from the `general-media` bucket.

#### Scenario: Admin deletes from general-media

- **WHEN** an authenticated active admin deletes the test file from `general-media`
- **THEN** the deletion SHALL succeed

#### Scenario: File removed from bucket

- **WHEN** the deletion completes
- **THEN** the file SHALL no longer be retrievable

### Requirement: All temporary resources cleaned up

Every temporary row, Auth user, admin_users row, and Storage object created during testing SHALL be removed.

#### Scenario: Database cleanup verified

- **WHEN** cleanup executes
- **THEN** verification queries SHALL confirm no `test-*` rows remain in `portfolio_projects`, `insights`, or `testimonials`

#### Scenario: Storage cleanup verified

- **WHEN** cleanup executes
- **THEN** no `test-*` files SHALL remain in the `general-media` bucket

#### Scenario: Auth cleanup verified

- **WHEN** cleanup executes
- **THEN** the temporary Auth user and admin_users row SHALL be deleted

### Requirement: Evidence recorded

Each of the 5 tests SHALL record: test ID, role, resource, operation, expected result, actual result, and pass/fail.

#### Scenario: Evidence for each test

- **WHEN** each test completes
- **THEN** an evidence record SHALL be created with all required fields


