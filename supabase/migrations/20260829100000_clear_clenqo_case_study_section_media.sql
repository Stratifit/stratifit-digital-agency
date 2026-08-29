-- Migration: 20260829100000_clear_clenqo_case_study_section_media
-- Description: Removes the stale uploaded image from the CLENQO case-study
--              "Section images" tab. All slots are reset to empty so each
--              public section shows the empty "Add image" placeholder and
--              renders a visual only once an admin uploads a new one.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET case_study_section_media = '{}'::jsonb
WHERE slug = 'clenqo';

-- =============================================================================
-- Rollback
-- =============================================================================
-- The previous value (overview.main → chatgpt-image-aug-29-2026-...png) is
-- intentionally not restored: the image was a temporary upload. If it is ever
-- needed again it can be re-uploaded from Admin > Portfolio > Section images.