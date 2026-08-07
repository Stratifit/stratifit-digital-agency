-- Migration: 00032_fix_vertex_saas_project_image
-- Description: Replace the Vertex SaaS portfolio project image. The original
--              Unsplash photo (photo-1467232004584) was removed upstream and
--              now returns 404, showing a broken image on /work, the homepage
--              portfolio section, and the case study page.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET image_url = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop&auto=format',
    updated_at = now()
WHERE slug = 'vertex-saas-landing';

-- Rollback:
-- UPDATE public.portfolio_projects
-- SET image_url = 'https://images.unsplash.com/photo-1467232004584-a241de8a7c0d?w=1200&h=800&fit=crop&auto=format',
--     updated_at = now()
-- WHERE slug = 'vertex-saas-landing';
