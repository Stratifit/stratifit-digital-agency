-- Migration: 20260826110000_limit_clenqo_case_study_gallery
-- Description: Keeps the CLENQO brand case study focused on its four approved
--              uploaded visuals instead of the previous ten-image gallery.
-- Stratifit Digital Agency Platform

DELETE FROM public.portfolio_media
WHERE portfolio_id = (
  SELECT id
  FROM public.portfolio_projects
  WHERE slug = 'aura-cosmetics-identity'
)
AND id NOT IN (
  '300de6e7-68e4-4d98-ad75-bb78439117ee'::uuid,
  '53de3e36-5ce8-4884-bea6-052102c9577e'::uuid,
  'f004aa98-3808-48ae-af37-fab5126fab9d'::uuid,
  '7916ee23-2f90-4de9-a251-afa600b59a31'::uuid
);

-- =============================================================================
-- Rollback
-- =============================================================================
-- Restore removed gallery rows from the previous seed/migration records if
-- those placeholder visuals are ever required again.
