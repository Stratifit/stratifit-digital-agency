-- Migration: 00002_admin_users
-- Description: Create admin_users table and admin authorization functions.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Admin Users Table
-- =============================================================================

CREATE TABLE public.admin_users (
  user_id       uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          text NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin')),
  status        text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  display_name  text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.admin_users IS 'Links Supabase Auth users to application roles.';

-- Apply updated_at trigger
CREATE TRIGGER set_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Admin Authorization Functions
-- =============================================================================

-- Returns true only for active admin users with 'owner' or 'admin' roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
      AND au.status = 'active'
      AND au.role IN ('owner', 'admin')
  );
END;
$$;

-- Returns true if the current user has any of the required roles
CREATE OR REPLACE FUNCTION public.has_admin_role(required_roles text[])
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
      AND au.status = 'active'
      AND au.role = ANY(required_roles)
  );
END;
$$;

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP FUNCTION IF EXISTS public.has_admin_role(text[]);
-- DROP FUNCTION IF EXISTS public.is_admin();
-- DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
-- DROP TABLE IF EXISTS public.admin_users;
