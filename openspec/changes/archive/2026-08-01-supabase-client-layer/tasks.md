## 1. Prerequisites

- [x] 1.1 Verify `src/types/database.types.ts` exists and exports `Database`
- [x] 1.2 Confirm `@supabase/supabase-js` and `@supabase/ssr` are not yet installed

## 2. Dependencies

- [x] 2.1 Install `@supabase/supabase-js`
- [x] 2.2 Install `@supabase/ssr`
- [x] 2.3 Install `server-only`
- [x] 2.4 Confirm no duplicate Supabase packages are added

## 3. Environment

- [x] 3.1 Create `.env.example` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and related approved variables
- [x] 3.2 Confirm `.env.local` is Git-ignored
- [x] 3.3 Confirm secret variables lack `NEXT_PUBLIC_` prefix

## 4. Browser Client

- [x] 4.1 Create `src/lib/supabase/browser.ts`
- [x] 4.2 Use `createBrowserClient` from `@supabase/ssr` with public env vars
- [x] 4.3 Type with `Database` from `src/types/database.types.ts`
- [x] 4.4 Verify no secret env var is referenced

## 5. Server Client

- [x] 5.1 Create `src/lib/supabase/server.ts`
- [x] 5.2 Use `createServerClient` from `@supabase/ssr` with `cookies()` from `next/headers`
- [x] 5.3 Type with `Database`
- [x] 5.4 Verify cookie handling pattern is correct for Next.js 16

## 6. Service-Role Client

- [x] 6.1 Create `src/lib/supabase/service-role.ts`
- [x] 6.2 Import `server-only` at top of module
- [x] 6.3 Read `SUPABASE_SERVICE_ROLE_KEY` from server env
- [x] 6.4 Type with `Database`
- [x] 6.5 Verify module cannot be imported by Client Components

## 7. Feature Query Foundation

- [x] 7.1 Create `src/features/services/queries.ts`
- [x] 7.2 Export `getPublicServices()` returning published, visible services ordered by `display_order`
- [x] 7.3 Select only needed fields
- [x] 7.4 Add `src/features/services/types.ts` for feature-specific types if needed — inline types sufficient for exemplar

## 8. Verification

- [x] 8.1 Run `npm run lint`
- [x] 8.2 Run `npm run build`
- [x] 8.3 Confirm browser bundle contains no service-role key
- [x] 8.4 Document client boundaries in `docs/ARCHITECTURE.md` only if materially changed — architecture already documents the 3-client pattern; no change needed
- [x] 8.5 Record any known limitations or follow-up work
