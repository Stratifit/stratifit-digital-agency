-- Migration: 00050_remove_stale_section_keys
-- Description: Removes the dead `final-cta` and `trusted-by` values from the
--              section_settings.section_key check constraint. Both sections
--              were removed from the platform:
--                - `final_cta` table dropped by migration 00046
--                - `trusted_logos` table dropped by migration 00031
--              No registry entry, component, admin editor, seed row, or live
--              database row references these keys anymore, so the constraint
--              should stop advertising them.
-- Stratifit Digital Agency Platform

ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;

ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check
  CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','acquisition','contact','acquisition-niches','acquisition-cta'));

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;
-- ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check
--   CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','final-cta','trusted-by','acquisition','contact','acquisition-niches','acquisition-cta'));
