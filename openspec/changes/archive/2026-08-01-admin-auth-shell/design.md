## Context

The public site is live. Supabase Auth exists in the stack, `admin_users` table + `is_admin()` RLS helper exist in the database, and the client layer provides `createSupabaseServerClient`. No admin routes, login, or shell exist.

This change builds Phase 4: admin login, server-side route protection, logout, and the admin shell.

## Goals / Non-Goals

**Goals:**

- Secure `/admin/login` page with validated email/password sign-in
- Server-side session + active-admin-role checks on every protected admin route
- Logout that clears the session
- Admin shell: sidebar, top bar, dashboard
- Zod + React Hook Form for the login form (approved stack)

**Non-Goals:**

- No CMS editors or content forms (later phases)
- No user management UI (owner-only, later)
- No media library UI
- No chat/leads inbox (later phases)
- No password reset flow (later)

## Decisions

### Decision 1: Route structure

**Choice:**

```text
src/app/admin/
├── login/page.tsx          (public)
└── (dashboard)/
    ├── layout.tsx          (protected shell)
    └── dashboard/page.tsx
```

**Rationale:** The `(dashboard)` route group carries the protected layout; `/admin/login` sits outside it so it is never wrapped by the shell.

### Decision 2: Authorization in layout

**Choice:** The protected layout is a Server Component that resolves the session via `createSupabaseServerClient`, verifies an active `admin_users` row, and redirects to `/admin/login` otherwise.

**Rationale:** Layout-level redirect short-circuits children, so every nested admin route is protected without per-page checks. Matches ARCHITECTURE.md's server-side authorization requirement.

### Decision 3: Login via Server Action

**Choice:** A server action `signIn` validates email/password with Zod, calls `supabase.auth.signInWithPassword`, and returns an `ActionResult`.

**Rationale:** Server-side validation is required by AGENTS.md. The browser client is not needed for the submit; the server action keeps the boundary small.

### Decision 4: Admin identity

**Choice:** A `getCurrentAdmin()` server helper returns the session user plus `admin_users` role/status/display_name.

**Rationale:** The shell and future features need identity + role; centralizing avoids repeated queries.

### Decision 5: Dependencies

**Choice:** Add `zod`, `react-hook-form`, and `@hookform/resolvers`.

**Rationale:** All are in the approved stack (Zod, React Hook Form) and required for validated forms.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Session refresh issues | Use `@supabase/ssr` server client with cookie handling |
| Admin disabled mid-session | Layout re-checks `admin_users.status = 'active'` on every render |
| Login brute force | Supabase Auth rate limiting; no custom password store |
| Shell too heavy | Keep shell server-rendered; only interactive bits as client components |

## Implementation Plan

1. Install `zod`, `react-hook-form`, `@hookform/resolvers`
2. Create `src/actions/auth.ts` (signIn, signOut, getCurrentAdmin)
3. Create `/admin/login` page
4. Create `(dashboard)/layout.tsx` protected shell
5. Create sidebar, topbar, shell components
6. Create dashboard page
7. Verify lint, build, and manual flow

## Rollback

No database changes. Rollback removes the admin route group. No migration involved.
