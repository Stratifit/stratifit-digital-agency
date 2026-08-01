## 1. Dependencies

- [x] 1.1 Install `zod`
- [x] 1.2 Install `react-hook-form`
- [x] 1.3 Install `@hookform/resolvers`
- [x] 1.4 Confirm no duplicate form library introduced

## 2. Auth Server Helpers

- [x] 2.1 Create `src/actions/auth.ts`
- [x] 2.2 Implement `signIn(email, password)` server action with Zod validation
- [x] 2.3 Implement `signOut()` server action clearing the session
- [x] 2.4 Implement `getCurrentAdmin()` returning session user + admin_users record
- [x] 2.5 Use `ActionResult` result pattern

## 3. Admin Login

- [x] 3.1 Create `src/app/admin/login/page.tsx` (client component)
- [x] 3.2 Build email + password form with React Hook Form + Zod
- [x] 3.3 Show loading, success, and error states
- [x] 3.4 Redirect to `/admin/dashboard` on success
- [x] 3.5 Show a clear error on failed sign-in
- [x] 3.6 Style with design-system components

## 4. Route Protection

- [x] 4.1 Create `src/app/admin/(dashboard)/layout.tsx` (server component)
- [x] 4.2 Resolve session via server client
- [x] 4.3 Verify active admin_users record (status = active)
- [x] 4.4 Redirect to `/admin/login` when unauthorized
- [x] 4.5 Render children only when authorized

## 5. Admin Shell

- [x] 5.1 Create `src/components/admin/admin-shell.tsx`
- [x] 5.2 Create `src/components/admin/sidebar.tsx` with approved nav sections
- [x] 5.3 Create `src/components/admin/topbar.tsx` with identity + logout
- [x] 5.4 Ensure mobile-friendly sidebar behavior
- [x] 5.5 Use design-system tokens and components

## 6. Dashboard

- [x] 6.1 Create `src/app/admin/(dashboard)/dashboard/page.tsx`
- [x] 6.2 Render operational summary widgets
- [x] 6.3 Use loading and empty states

## 7. Verification

- [x] 7.1 Run `npm run lint`
- [x] 7.2 Run `npm run build`
- [x] 7.3 Verify `/admin/login` renders
- [x] 7.4 Verify unauthenticated `/admin/dashboard` redirects to login
- [x] 7.5 Verify logout clears session
- [x] 7.6 Record known limitations or follow-up work

## 8. CRUD Extensions (requested)

- [x] 8.1 Create `src/features/services/admin-queries.ts` — admin service list
- [x] 8.2 Create `src/features/services/schemas.ts` — Zod service schema
- [x] 8.3 Create `src/features/services/mutations.ts` — create/update/delete server actions
- [x] 8.4 Create `src/components/admin/admin-list.tsx` — reusable admin table
- [x] 8.5 Create `src/components/admin/confirm-delete.tsx` — dialog-confirmed delete
- [x] 8.6 Create service form component + new/edit pages
- [x] 8.7 Create services list page
- [x] 8.8 Create `src/features/content/admin-queries.ts` + `mutations.ts`
- [x] 8.9 Create portfolio, insights, testimonials, pricing, faq list pages
- [x] 8.10 Update dashboard with live stats from Supabase
- [x] 8.11 Update sidebar with Content section links
- [x] 8.12 Fix seed idempotency: stable UUIDs for navigation/footer
- [x] 8.13 Clean duplicated navigation/footer rows
- [x] 8.14 Update admin credentials (stratifi1@gmail.com / password note)
- [x] 8.15 Verify lint, build, and page rendering
