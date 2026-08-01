## Context

The `database-foundation` change is structurally complete. All 15 migrations are applied, 72 RLS policies are active, 36 public tables have RLS enabled, and 4 storage buckets exist with public read and admin-only write policies.

Seven runtime integration tests were deferred because they require:
- Real `anon` and `authenticated` role contexts (not just SQL inspection)
- A temporary Supabase Auth admin user
- Temporary published and draft test records
- Temporary Storage test files
- Cleanup of all test artifacts afterward

These tests cannot be performed through `pg_policies` inspection alone. They require actual client requests through the Supabase API with proper role contexts.

## Goals / Non-Goals

**Goals:**

- Verify anonymous published-content reads return approved rows
- Verify anonymous draft-content queries return zero protected rows
- Verify authenticated active admin users have full access to all tables
- Verify anonymous users cannot read private tables (admin_users, leads, contacts, chat, email, audit)
- Verify anonymous users can download public Storage objects
- Verify authenticated admin users can upload and delete Storage objects
- Verify anonymous users are denied Storage uploads
- Collect reproducible evidence for each test
- Clean up all temporary test data, users, sessions, and files

**Non-Goals:**

- No schema redesign
- No new production tables
- No permanent RLS changes unless a confirmed failure requires a separate corrective migration
- No CMS UI implementation
- No business-content changes
- No production-data mutation
- No service-role key exposure
- No disabling RLS
- No broad bypass of authorization

## Decisions

### Decision 1: Test environment

**Choice:** Use the linked Supabase project (`dmkxvalcflotfekpxdfw`) with controlled temporary test records.

**Rationale:** The linked project provides a real PostgreSQL environment for testing RLS behavior. Tests must run against the actual database, not a mock.

**Constraint:** Do not run tests against unknown or valuable production data. All test rows and files must use clear test identifiers (e.g., `test-*` slugs, `test-*` filenames).

### Decision 2: Role testing

**Choice:** Test using real role contexts: `anon`, `authenticated` (non-admin), and `authenticated` (active admin).

**Rationale:** RLS policies are evaluated per-role. Testing with actual role contexts verifies policy behavior under real conditions.

**Constraint:** Do not simulate admin access using service-role queries. Service-role bypasses RLS and would produce false positives.

### Decision 3: Admin test user

**Choice:** Use a dedicated temporary Supabase Auth user with a matching `admin_users` row.

**Rationale:** The `is_admin()` function checks `auth.uid()` against `admin_users.user_id`. A real Auth user is required for proper admin policy evaluation.

**Constraint:** Use a unique test email (e.g., `test-rls-admin@example.com`). Remove both the `admin_users` row and Auth user after testing.

### Decision 4: Test data

**Choice:** Create temporary published and draft records with unique slugs or titles.

**Rationale:** Testing requires both readable (published/visible) and unreadable (draft/hidden) content to verify RLS filtering.

**Constraint:** Do not alter existing seeded business content. Clean up all test rows after verification.

### Decision 5: RLS verification method

**Choice:** Verify behavior through Supabase client requests using anon and authenticated sessions.

**Rationale:** SQL inspection of `pg_policies` confirms policies exist but not that they evaluate correctly under real role contexts. Client requests exercise the full RLS pipeline.

### Decision 6: Storage verification

**Choice:** Upload uniquely named temporary files to approved buckets.

**Rationale:** Storage policies are evaluated on actual upload/download/delete operations, not just policy definitions.

**Constraint:** Remove all test objects afterward. Use distinct filenames to avoid collision with real assets.

### Decision 7: Failure handling

**Choice:** If a policy fails, stop the affected test group and record the failure.

**Rationale:** A failed test indicates a real policy issue that must be understood before proceeding. Patching the database mid-test obscures the root cause.

**Constraint:** Do not patch the database directly. Create a separate versioned corrective migration only after confirming the defect.

### Decision 8: Secrets handling

**Choice:** Use environment variables for credentials. Never print or commit service-role keys, admin passwords, access tokens, or OAuth tokens.

**Rationale:** Secrets in logs or committed files create security vulnerabilities.

### Decision 9: Evidence format

**Choice:** Record test name, role, operation, expected result, actual result, pass/fail, and cleanup status.

**Rationale:** Structured evidence allows reproducible verification and audit.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Accidental modification of real data | Use unique test identifiers; never modify seeded business content |
| Leaving test users or files behind | Register cleanup steps before mutation; verify cleanup even after failure |
| False positives from service-role bypass | Never use service-role for test queries; always use anon/authenticated sessions |
| Token leakage in logs | Never print tokens; use environment variables; redact in evidence records |
| Rate limits or auth delays | Add delays between rapid auth operations; retry on transient failures |
| Cleanup failure | Verify cleanup queries succeed; report any orphaned resources |
| SQL editor vs. client behavior differences | Test through Supabase client, not just dashboard SQL editor |

## Test Plan

### Phase 1: Environment Setup

1. Inspect environment and required keys (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
2. Confirm linked project connection: `npx supabase projects list`
3. Create temporary test identifiers (UUIDs, slugs, filenames)

### Phase 2: Test User Creation

4. Create temporary Supabase Auth user with unique email
5. Add active `admin_users` row linking to the Auth user

### Phase 3: Test Data Creation

6. Create temporary published service (status=published, is_visible=true)
7. Create temporary draft service (status=draft)
8. Create temporary hidden service (is_visible=false)

### Phase 4: Anon Published-Read Tests

7. Query published services as anon — verify test published service returned
8. Query published portfolio_projects as anon — verify rows returned
9. Query published insights as anon — verify rows returned
10. Query published faqs as anon — verify rows returned
11. Query visible hero as anon — verify row returned
12. Query site_settings as anon — verify row returned

### Phase 5: Anon Draft-Denial Tests

13. Query draft services as anon — verify zero rows
14. Query hidden services as anon — verify zero rows
15. Query draft portfolio_projects as anon — verify zero rows
16. Query draft insights as anon — verify zero rows

### Phase 6: Anon Private-Table Denial Tests

17. Query admin_users as anon — verify zero rows
18. Query leads as anon — verify zero rows
19. Query contacts as anon — verify zero rows
20. Query chat_conversations as anon — verify zero rows
21. Query email_events as anon — verify zero rows
22. Query audit_logs as anon — verify zero rows

### Phase 7: Authenticated Admin Tests

23. Authenticate as temporary admin user
24. Query services as admin — verify all rows (published + draft) returned
25. Query leads as admin — verify all rows returned
26. Insert temporary service as admin — verify success
27. Update temporary service as admin — verify success
28. Delete temporary service as admin — verify success

### Phase 8: Storage Tests

29. Upload temporary file to `logos` bucket as admin — verify success
30. Download temporary file as anon — verify success
31. Delete temporary file as admin — verify success
32. Attempt upload to `logos` bucket as anon — verify denial
33. Attempt upload to `portfolio-images` bucket as anon — verify denial

### Phase 9: Cleanup

34. Delete temporary published service
35. Delete temporary draft service
36. Delete temporary hidden service
37. Delete temporary admin_users row
38. Delete temporary Auth user
39. Delete any remaining temporary Storage objects
40. Verify all temporary resources are absent

### Phase 10: Evidence and Verification

41. Record all test results in structured evidence format
42. Verify migration list unchanged (no corrective migrations needed)
43. Run `npm run lint` if any repository test code was added
44. Run `npm run build` if any repository code was changed

## Rollback / Cleanup

Require cleanup of:

- Temporary service rows (published, draft, hidden)
- Temporary leads or private rows created during testing
- Temporary Auth user
- Temporary `admin_users` row
- Temporary Storage objects (test files)
- Temporary local test files or scripts
- Temporary environment variables or scripts containing secrets

Cleanup must execute even if tests fail. Verify cleanup success after completion.

## Open Questions

- Whether a test runner (e.g., Vitest, Playwright) already exists in the project
- Whether Supabase client helpers already exist for role-context testing
- Whether a dedicated test Supabase project is available (vs. using the linked dev project)
