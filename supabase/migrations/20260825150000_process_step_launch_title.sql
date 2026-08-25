-- Migration: 20260825150000_process_step_launch_title
-- Description: Renames the final process step from "Launch & Grow" to
--              "Launch" in all four locales (approved copy change — the
--              breadcrumb and rollout cards now read Launch only).
-- Stratifit Digital Agency Platform

UPDATE public.process_steps
SET title_translations = '{"en": "Launch", "de": "Launch", "fr": "Lancement", "es": "Lanzamiento"}'::jsonb
WHERE step_key = 'growth';

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.process_steps
-- SET title_translations = '{"en": "Launch & Grow", "de": "Launch & Wachstum", "fr": "Lancement et croissance", "es": "Lanzamiento y crecimiento"}'::jsonb
-- WHERE step_key = 'growth';
