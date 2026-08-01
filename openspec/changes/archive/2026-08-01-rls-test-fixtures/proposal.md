## Why

The `cms-auth-rls-tests` change was archived with 5 incomplete runtime tests:

1. **1.2** — anonymous read of `portfolio_projects` (blocked: no published fixture)
2. **1.3** — anonymous read of `insights` (blocked: no published fixture)
3. **1.6** — anonymous read of `testimonials` (blocked: no visible fixture)
4. **6.1** — authenticated admin upload to `general-media` bucket (not executed)
5. **6.2** — authenticated admin delete from `general-media` bucket (not executed)

These tests cannot pass without temporary test fixtures and a `general-media` bucket test. This change creates the fixtures and executes the missing tests.

## What Changes

- **Temporary test fixtures**: Create published portfolio_project, published insight, and visible testimonial records with `test-*` identifiers
- **General-media bucket test**: Upload and delete a uniquely named file as authenticated admin
- **RLS verification**: Confirm anon can read the three new fixtures
- **Cleanup**: Remove all temporary rows, Auth users, admin_users rows, and Storage objects
- **Evidence**: Record expected/actual results for all 5 tests

## Capabilities

### New Capabilities

- `rls-test-fixtures`: Temporary test fixtures and remaining RLS/Storage runtime tests

### Modified Capabilities

<!-- None — this change only adds test fixtures and runs tests -->

## Impact

- **Database**: Temporary rows created and deleted during test run. No permanent schema changes.
- **Storage**: Temporary file uploaded and deleted during test run.
- **Testing**: Completes the 5 deferred tests from `cms-auth-rls-tests`.
- **No code changes**: Tests are SQL queries and Storage operations.
