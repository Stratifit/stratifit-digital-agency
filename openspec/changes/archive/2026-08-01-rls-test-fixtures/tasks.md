## 1. Environment Setup

- [x] 1.1 Verify linked project connection: `npx supabase projects list` ✓
- [x] 1.2 Confirm migration list unchanged: `npx supabase migration list --linked` ✓ (15 migrations)
- [x] 1.3 Generate unique test identifiers (timestamps, slugs) ✓

## 2. Fixture Creation

- [x] 2.1 Create temporary Auth admin user with unique email ✓
- [x] 2.2 Add active admin_users row for the test admin ✓
- [x] 2.3 Create temporary published portfolio_project (status=published, slug=test-pk-*) ✓
- [x] 2.4 Create temporary published insight (status=published, slug=test-insight-*) ✓
- [x] 2.5 Create temporary visible testimonial (is_visible=true, person_name=test-*) ✓

## 3. Anon Published-Read Tests

- [x] 3.1 Query portfolio_projects as anon where status='published' — verify fixture returned ✓ (1 row)
- [x] 3.2 Query insights as anon where status='published' — verify fixture returned ✓ (1 row)
- [x] 3.3 Query testimonials as anon where is_visible=true — verify fixture returned ✓ (1 row)

## 4. Storage General-Media Tests

- [x] 4.1 Upload test file to general-media bucket as admin — verify success ✓
- [x] 4.2 Delete test file from general-media bucket as admin — verify success ✓

## 5. Cleanup

- [x] 5.1 Delete temporary portfolio_project row ✓
- [x] 5.2 Delete temporary insight row ✓
- [x] 5.3 Delete temporary testimonial row ✓
- [x] 5.4 Delete temporary admin_users row ✓
- [x] 5.5 Delete temporary Auth user ✓
- [x] 5.6 Verify no test-* rows remain in portfolio_projects, insights, testimonials ✓
- [x] 5.7 Verify no test-* files remain in general-media bucket ✓

## 6. Verification

- [x] 6.1 Confirm migration list unchanged: `npx supabase migration list --linked` ✓ (15 migrations)
- [x] 6.2 Run `npm run lint` ✓
- [x] 6.3 Run `npm run build` ✓
- [x] 6.4 Record all 5 test results with role, resource, expected, actual, pass/fail ✓
