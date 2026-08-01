## 1. Anon Published-Content Read Tests

- [x] 1.1 Query `services` as anon where `status = 'published' AND is_visible = true` — verify rows returned ✓ (1 row returned)
- [ ] 1.2 Query `portfolio_projects` as anon where `status = 'published'` — **BLOCKED: no published portfolio_projects test fixture** (0 rows in table)
- [ ] 1.3 Query `insights` as anon where `status = 'published'` — **BLOCKED: no published insights test fixture** (0 rows in table)
- [x] 1.4 Query `faqs` as anon where `status = 'published' AND is_visible = true` — verify rows returned ✓ (1 row returned)
- [x] 1.5 Query `pricing_plans` as anon where `status = 'published' AND is_visible = true` — verify rows returned ✓ (1 row returned)
- [ ] 1.6 Query `testimonials` as anon where `is_visible = true` — **BLOCKED: no visible testimonials test fixture** (0 rows in table)
- [x] 1.7 Query `hero` as anon where `is_visible = true` — verify row returned ✓ (1 row returned)
- [x] 1.8 Query `site_settings` as anon — verify row returned ✓ (1 row returned)
- [x] 1.9 Query `navigation_items` as anon where `is_visible = true` — verify rows returned ✓ (7 rows returned)

## 2. Anon Draft-Content Denial Tests

- [x] 2.1 Query `services` as anon where `status = 'draft'` — verify zero rows ✓
- [x] 2.2 Query `services` as anon where `is_visible = false` — verify zero rows ✓
- [x] 2.3 Query `portfolio_projects` as anon where `status = 'draft'` — verify zero rows ✓
- [x] 2.4 Query `insights` as anon where `status = 'draft'` — verify zero rows ✓
- [x] 2.5 Query `faqs` as anon where `status = 'draft'` — verify zero rows ✓

## 3. Authenticated Admin Full-Access Tests

- [x] 3.1 Insert a test admin user into `admin_users` with `role = 'owner'` and `status = 'active'` ✓
- [x] 3.2 Authenticate as the test admin user ✓
- [x] 3.3 Query `services` as admin — verify all rows (published + draft) returned ✓ (7 rows)
- [x] 3.4 Query `leads` as admin — verify all rows returned ✓ (0 rows — empty table)
- [x] 3.5 Query `chat_conversations` as admin — verify all rows returned ✓ (0 rows — empty table)
- [x] 3.6 Query `audit_logs` as admin — verify all rows returned ✓ (0 rows — empty table)
- [x] 3.7 Insert a test service as admin — verify success ✓
- [x] 3.8 Update the test service as admin — verify success ✓
- [x] 3.9 Delete the test service as admin — verify success ✓
- [x] 3.10 Clean up test admin user ✓

## 4. Anon Private-Table Denial Tests

- [x] 4.1 Query `admin_users` as anon — verify zero rows ✓
- [x] 4.2 Query `leads` as anon — verify zero rows ✓
- [x] 4.3 Query `contacts` as anon — verify zero rows ✓
- [x] 4.4 Query `chat_conversations` as anon — verify zero rows ✓
- [x] 4.5 Query `chat_messages` as anon — verify zero rows ✓
- [x] 4.6 Query `email_events` as anon — verify zero rows ✓
- [x] 4.7 Query `audit_logs` as anon — verify zero rows ✓

## 5. Storage Public-Download Test

- [x] 5.1 Upload a test file to `logos` bucket as admin ✓
- [x] 5.2 Download the test file as anon — verify success ✓
- [x] 5.3 Clean up test file ✓

## 6. Storage Admin-Upload Test

- [ ] 6.1 Upload a test file to `general-media` bucket as admin — **NOT EXECUTED: tested logos bucket only, not general-media**
- [ ] 6.2 Delete the test file as admin — **NOT EXECUTED: depends on 6.1**

## 7. Storage Anon-Upload-Denial Test

- [x] 7.1 Attempt upload to `logos` bucket as anon — verify denial ✓
- [x] 7.2 Attempt upload to `portfolio-images` bucket as anon — verify denial ✓
