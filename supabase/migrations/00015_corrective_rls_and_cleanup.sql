-- Migration: 00015_corrective_rls_and_cleanup
-- Description: Add explicit admin RLS policies for join tables,
--              drop unused _tmp_seed_uuid function.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Drop Unused Seed Helper Function
-- =============================================================================

DROP FUNCTION IF EXISTS public._tmp_seed_uuid();

-- =============================================================================
-- Admin RLS Policies for Join Tables
-- =============================================================================
-- These tables had RLS enabled but no explicit policies.
-- Add admin-only policies to make access explicit rather than relying on
-- implicit deny. The CMS manages these relationship tables directly.

CREATE POLICY "admins can manage insight_category_links"
  ON public.insight_category_links FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage portfolio_service_links"
  ON public.portfolio_service_links FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP POLICY IF EXISTS "admins can manage portfolio_service_links" ON public.portfolio_service_links;
-- DROP POLICY IF EXISTS "admins can manage insight_category_links" ON public.insight_category_links;
-- CREATE OR REPLACE FUNCTION public._tmp_seed_uuid()
-- RETURNS uuid AS $$
--   SELECT gen_random_uuid();
-- $$ LANGUAGE sql;
