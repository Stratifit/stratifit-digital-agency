## Context

The `foundation-design-system` change is archived (316/316 tasks). The database foundation is complete (16 migrations, 36 tables, RLS enabled). The application has no Supabase clients yet — `src/lib/` does not exist, `@supabase/supabase-js` and `@supabase/ssr` are not installed, and no feature modules exist.

This change establishes the client layer required by every subsequent phase (public layout, homepage, CMS, chat, leads, email).

## Goals / Non-Goals

**Goals:**

- Provide separate browser, server, and service-role clients per `docs/ARCHITECTURE.md` section 10
- Type all clients with the generated `Database` type
- Protect the service-role key from the browser bundle
- Centralize queries in feature modules per `docs/DATABASE.md` section 33
- Provide an exemplar services feature module
- Document environment variables

**Non-Goals:**

- No authentication flows or login pages
- No admin route protection
- No homepage or layout components
- No CMS features
- No schema changes
- No chat or email features

## Decisions

### Decision 1: Browser client

**Choice:** A `createBrowserClient()` function in `src/lib/supabase/browser.ts` using `createBrowserClient` from `@supabase/ssr`, typed with `Database`.

**Rationale:** `@supabase/ssr` provides the correct cookie-refresh handling for browser sessions and is the current approved approach. Using public env vars only keeps secrets out of the client bundle.

### Decision 2: Server client

**Choice:** A `createServerClient()` function in `src/lib/supabase/server.ts` using `createServerClient` from `@supabase/ssr` with `cookies()` from `next/headers`.

**Rationale:** Server Components and Actions need the authenticated session context via cookies. `@supabase/ssr` handles token refresh.

### Decision 3: Service-role client

**Choice:** A `createServiceRoleClient()` in `src/lib/supabase/service-role.ts` that imports `server-only` and reads `SUPABASE_SERVICE_ROLE_KEY`.

**Rationale:** `server-only` makes the module unimportable from Client Components at build time, protecting the key. The key is a server env var (no `NEXT_PUBLIC_` prefix).

### Decision 4: Typed clients

**Choice:** All clients pass `Database` as the generic type parameter.

**Rationale:** `src/types/database.types.ts` is generated and reflects the live schema.

### Decision 5: Feature module pattern

**Choice:** Create `src/features/services/queries.ts` as the exemplar, exporting `getPublicServices()` that returns published, visible services ordered by `display_order`.

**Rationale:** Demonstrates the centralized query pattern with RLS-safe public filtering. Future features copy this structure.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Service-role key leaks to browser | `server-only` import fails the build; no `NEXT_PUBLIC_` prefix |
| Cookie handling breaks auth | Use `@supabase/ssr` standard pattern with `cookies()` await |
| Query scattering returns | Feature modules centralize access; docs record the pattern |
| Type drift | Regenerate `database.types.ts` after schema changes |

## Implementation Plan

1. Install `@supabase/supabase-js`, `@supabase/ssr`, `server-only`
2. Create `.env.example` with approved variable names
3. Create `src/lib/supabase/browser.ts`, `server.ts`, `service-role.ts`
4. Create `src/features/services/queries.ts` exemplar
5. Verify lint and build
6. Document client boundaries in `docs/ARCHITECTURE.md` if materially changed

## Rollback

No database changes; rollback is a matter of removing the client modules and dependency. No migration involved.
