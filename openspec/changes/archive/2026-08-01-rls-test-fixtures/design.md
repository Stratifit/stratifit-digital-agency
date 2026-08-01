## Context

The `cms-auth-rls-tests` change was archived with 5 incomplete tests. The `database-foundation` change established 36 public tables with RLS, 72 policies, and 4 storage buckets. The `cms-auth-rls-tests` change verified 33 of 38 tests but left 5 blocked or unexecuted due to missing test fixtures and an untested bucket.

This change creates temporary fixtures and executes the remaining tests to achieve full RLS/Storage verification.

## Goals / Non-Goals

**Goals:**

- Create temporary published portfolio_projects fixture
- Create temporary published insights fixture
- Create temporary visible testimonials fixture
- Test anonymous read of all three fixtures
- Test authenticated admin upload to general-media bucket
- Test authenticated admin delete from general-media bucket
- Clean up all temporary resources
- Record evidence for all 5 tests
- Confirm migration list unchanged

**Non-Goals:**

- No permanent seed data changes
- No schema migrations
- No RLS policy modifications
- No new database tables or functions
- No application code changes

## Decisions

### Decision 1: Fixture strategy

**Choice:** Create temporary rows with `test-*` prefixes, run tests, then delete.

**Rationale:** Fixtures must be temporary to avoid polluting the database. Using `test-*` prefixes makes them identifiable and easy to clean up.

### Decision 2: Auth user reuse pattern

**Choice:** Create a temporary Auth user and admin_users row (same pattern as cms-auth-rls-tests).

**Rationale:** The general-media upload/delete tests require an authenticated admin session. Reusing the established pattern ensures consistency.

### Decision 3: Storage test approach

**Choice:** Upload a uniquely named text file to `general-media`, verify download, then delete.

**Rationale:** A simple text file is sufficient to verify upload/delete policies. No need for complex file types.

### Decision 4: Cleanup verification

**Choice:** Run verification queries after cleanup to confirm all temporary resources are absent.

**Rationale:** Cleanup verification prevents orphaned test data from accumulating.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Fixture creation fails | Stop test group, record failure, clean up partial resources |
| general-media upload fails | Record failure, continue with other tests |
| Cleanup fails | Report orphaned resources, do not archive until resolved |
| Test data collides with real data | Use unique timestamps in identifiers |

## Test Plan

### Phase 1: Environment Setup

1. Verify linked project connection
2. Confirm migration list (15 migrations)
3. Generate unique test identifiers

### Phase 2: Fixture Creation

4. Create temporary Auth admin user
5. Add active admin_users row
6. Create temporary published portfolio_project
7. Create temporary published insight
8. Create temporary visible testimonial

### Phase 3: Anon Read Tests

9. Query portfolio_projects as anon — verify fixture returned
10. Query insights as anon — verify fixture returned
11. Query testimonials as anon — verify fixture returned

### Phase 4: Storage Tests

12. Upload test file to general-media as admin — verify success
13. Delete test file from general-media as admin — verify success

### Phase 5: Cleanup

14. Delete temporary portfolio_project
15. Delete temporary insight
16. Delete temporary testimonial
17. Delete temporary admin_users row
18. Delete temporary Auth user
19. Verify all temporary resources absent

### Phase 6: Verification

20. Confirm migration list unchanged
21. Run npm run lint
22. Run npm run build
23. Record all evidence

## Rollback / Cleanup

All temporary resources MUST be removed:

- Temporary portfolio_project row
- Temporary insight row
- Temporary testimonial row
- Temporary Auth user
- Temporary admin_users row
- Temporary Storage file in general-media
- No local test files or scripts retained

Cleanup executes even if tests fail.
