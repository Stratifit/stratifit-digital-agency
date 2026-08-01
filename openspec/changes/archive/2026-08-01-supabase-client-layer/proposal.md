## Why

The design system is complete but the application cannot yet read or write any Supabase data. The project has no Supabase clients, no typed query layer, and no feature modules. Every downstream phase — public layout, homepage sections, CMS, chat, leads, email — depends on a secure, correctly separated client architecture.

Per `docs/ARCHITECTURE.md` section 10, three distinct clients are required (browser, server, service-role) with strict boundaries. Per `docs/DATABASE.md` section 33, raw queries must be centralized in feature modules rather than scattered through components.

## What Changes

- **Environment setup**: Create `.env.example` with approved variable names. Document required Supabase variables.
- **Browser client**: `createBrowserClient` using only public env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **Server client**: `createServerClient` using `@supabase/ssr` cookie handling for authenticated server reads/mutations.
- **Service-role client**: `createServiceRoleClient` in a server-only module, never importable by client components.
- **Server-only boundary**: Add `server-only` package usage to protect service-role module.
- **Typed helpers**: Wrap all clients with the generated `Database` type from `src/types/database.types.ts`.
- **Feature query foundation**: Create `src/features/` structure with at least one exemplar module (`services`) demonstrating the centralized query pattern.
- **Documentation**: Document client usage and boundaries.

## Capabilities

### New Capabilities

- `supabase-clients`: Browser, server, and service-role Supabase client creation with strict boundaries and typed helpers.

### Modified Capabilities

<!-- None — this is a new capability -->

## Impact

- **Architecture**: Establishes the Supabase client layer required by all future features.
- **Security**: Service-role key stays server-only. Browser bundle never receives secrets.
- **Database**: No schema changes. Reads existing 36 tables.
- **Dependencies**: Adds `@supabase/ssr` and `server-only` (both required, approved stack).
- **No route changes**: No application routes modified.
