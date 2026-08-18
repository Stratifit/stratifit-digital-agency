-- Migration: 00058_hero_trusted_by
-- Description: Adds a CMS-editable trusted-by logo strip to the hero.
--              Stores {name, icon} items on the hero singleton so the logos
--              shown under the hero stats can be edited from the admin
--              (Hero → Trusted by logos) instead of being hardcoded.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Schema
-- =============================================================================

ALTER TABLE public.hero ADD COLUMN IF NOT EXISTS trusted_by jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.hero.trusted_by IS 'Trusted-by logo strip items ({name, icon}) shown at the bottom of the hero.';

-- =============================================================================
-- Seed (idempotent: only fills the strip when it is still empty)
-- =============================================================================

UPDATE public.hero SET
  trusted_by = '[
    {"name": "LUMEN", "icon": "lumen"},
    {"name": "NOVUS", "icon": "novus"},
    {"name": "PULSE", "icon": "pulse"},
    {"name": "VERTEX", "icon": "vertex"},
    {"name": "ORBIT", "icon": "orbit"},
    {"name": "NEXUS", "icon": "nexus"}
  ]'::jsonb
WHERE singleton_key = true AND jsonb_array_length(trusted_by) = 0;

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.hero DROP COLUMN IF EXISTS trusted_by;
