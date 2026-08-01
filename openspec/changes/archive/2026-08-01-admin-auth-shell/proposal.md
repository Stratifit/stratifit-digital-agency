## Why

The public website is live, but there is no way to manage its content. Per `docs/ROADMAP.md` Phase 4, secure admin access must exist before any CMS editor work. Supabase Auth is configured but no login, session checks, route protection, or admin shell exist.

Per `docs/ARCHITECTURE.md` section 11 and `docs/CMS.md` sections 40–41, admin routes must be protected server-side with session + active-role checks. UI hiding is not authorization.

## What Changes

- **Admin login**: `/admin/login` page with email/password sign-in via Supabase Auth, validated with Zod.
- **Session handling**: Server-side session checks via the server Supabase client.
- **Route protection**: All `/admin/*` routes except `/admin/login` require a valid session AND an active `admin_users` record.
- **Logout**: Server action clearing the Supabase session.
- **Admin shell**: Sidebar + top bar + content area using the design system.
- **Dashboard**: `/admin/dashboard` overview with placeholder stats.
- **Unauthorized handling**: Redirect to login; clear error states.

## Capabilities

### New Capabilities

- `admin-auth-shell`: Admin authentication, route protection, and the admin application frame.

### Modified Capabilities

<!-- None — new capability -->

## Impact

- **Security**: Server-side authorization for all admin routes; RLS still governs data access.
- **Frontend**: New `/admin` route group with login and dashboard.
- **Database**: No schema changes. Uses existing `admin_users` table and `is_admin()` helper.
- **Dependencies**: Adds `zod`, `react-hook-form`, `@hookform/resolvers` (approved stack).
- **No CMS editors yet**: This change is the frame only.
