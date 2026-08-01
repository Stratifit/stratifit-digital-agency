## Why

The database-foundation change created 72 RLS policies across 36 public tables and 4 storage buckets. Seven runtime integration tests were deferred because they require authenticated admin sessions or storage uploads that cannot be performed in read-only verification mode.

Without these tests, we cannot confirm that:
- Anon users can read published content
- Anon users cannot read draft content
- Authenticated admins have full access
- Anon users cannot read private tables
- Storage public read works
- Admin storage upload works
- Anon storage upload is denied

## What Changes

- **RLS runtime tests**: Execute SQL queries as anon and authenticated roles to verify policy behavior
- **Storage integration tests**: Upload, download, and deny test files in storage buckets
- **Test documentation**: Record test results and any issues found

## Capabilities

### New Capabilities

- `rls-runtime-tests`: Runtime verification of RLS policies using actual database queries with different role contexts

### Modified Capabilities

<!-- None — this change only tests existing policies, does not modify them -->

## Impact

- **Database**: No schema changes. Read-only queries only.
- **Security**: Tests verify security policies work correctly
- **Testing**: Provides documented evidence of RLS correctness
- **No code changes**: Tests are SQL queries and storage operations
