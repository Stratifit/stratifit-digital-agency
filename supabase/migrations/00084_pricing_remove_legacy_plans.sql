-- =============================================================================
-- 00084_pricing_remove_legacy_plans.sql
-- The Pricing section must show exactly the 4 approved master plans:
--   launch (1), grow (2, featured), scale (3), custom (4).
-- Migration 00006 originally created starter / professional / enterprise,
-- and 00080 added the approved slugs alongside them, leaving 7 published
-- plans in the database. This removes the 3 legacy plans so the section
-- renders 4 cards only.
-- =============================================================================

DELETE FROM public.pricing_plans
WHERE slug IN ('starter', 'professional', 'enterprise');

-- =============================================================================
-- Rollback (if ever needed): restore the legacy rows from migration 00006.
-- The exact original rows lived in supabase/migrations/00006_marketing_collections.sql.
-- =============================================================================
