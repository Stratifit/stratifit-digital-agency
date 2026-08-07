-- =============================================================================
-- Description: Allow direct image URLs on portfolio_media (mirroring the
--              portfolio_projects.image_url pattern from migration 00029) so
--              work detail galleries render real imagery without a populated
--              media library. Also seeds gallery rows for the published case
--              studies (idempotent, stable UUIDs).
-- Stratifit Digital Agency Platform
-- =============================================================================

ALTER TABLE public.portfolio_media
  ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE public.portfolio_media
  ALTER COLUMN media_id DROP NOT NULL;

COMMENT ON COLUMN public.portfolio_media.image_url
  IS 'Optional direct gallery image URL. Preferred over media_id when set.';

-- =============================================================================
-- Seed gallery rows for the published case studies.
-- Only rows whose portfolio project exists are inserted (JOIN guard), and the
-- insert is idempotent via ON CONFLICT (id).
-- =============================================================================

INSERT INTO public.portfolio_media (id, portfolio_id, image_url, caption_translations, display_order, is_featured)
SELECT g.id, p.id, g.image_url, '{}'::jsonb, g.display_order, g.is_featured
FROM (VALUES
  -- Maison Lumière Brand System
  ('55555555-5555-4555-8555-555555555501'::uuid, '11111111-1111-4111-8111-111111111101'::uuid, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555502'::uuid, '11111111-1111-4111-8111-111111111101'::uuid, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555503'::uuid, '11111111-1111-4111-8111-111111111101'::uuid, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Nordlicht Logistics Website
  ('55555555-5555-4555-8555-555555555504'::uuid, '11111111-1111-4111-8111-111111111102'::uuid, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555505'::uuid, '11111111-1111-4111-8111-111111111102'::uuid, 'https://images.unsplash.com/photo-1567449303078-57ad995bd17b?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555506'::uuid, '11111111-1111-4111-8111-111111111102'::uuid, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Helios Health AI Support
  ('55555555-5555-4555-8555-555555555507'::uuid, '11111111-1111-4111-8111-111111111103'::uuid, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555508'::uuid, '11111111-1111-4111-8111-111111111103'::uuid, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555509'::uuid, '11111111-1111-4111-8111-111111111103'::uuid, 'https://images.unsplash.com/photo-1567449303078-57ad995bd17b?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Aura Cosmetics Rebrand
  ('55555555-5555-4555-8555-555555555510'::uuid, '11111111-1111-4111-8111-111111111104'::uuid, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555511'::uuid, '11111111-1111-4111-8111-111111111104'::uuid, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555512'::uuid, '11111111-1111-4111-8111-111111111104'::uuid, 'https://images.unsplash.com/photo-1567449303078-57ad995bd17b?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Nova Fintech Platform
  ('55555555-5555-4555-8555-555555555513'::uuid, '11111111-1111-4111-8111-111111111105'::uuid, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555514'::uuid, '11111111-1111-4111-8111-111111111105'::uuid, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555515'::uuid, '11111111-1111-4111-8111-111111111105'::uuid, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Atlas Commerce Platform
  ('55555555-5555-4555-8555-555555555516'::uuid, '11111111-1111-4111-8111-111111111106'::uuid, 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555517'::uuid, '11111111-1111-4111-8111-111111111106'::uuid, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555518'::uuid, '11111111-1111-4111-8111-111111111106'::uuid, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- SmartFlow AI Pipeline
  ('55555555-5555-4555-8555-555555555519'::uuid, '11111111-1111-4111-8111-111111111107'::uuid, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555520'::uuid, '11111111-1111-4111-8111-111111111107'::uuid, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555521'::uuid, '11111111-1111-4111-8111-111111111107'::uuid, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- GrowthStack Campaign
  ('55555555-5555-4555-8555-555555555522'::uuid, '11111111-1111-4111-8111-111111111108'::uuid, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555523'::uuid, '11111111-1111-4111-8111-111111111108'::uuid, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555524'::uuid, '11111111-1111-4111-8111-111111111108'::uuid, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Vertex SaaS Landing
  ('55555555-5555-4555-8555-555555555525'::uuid, '11111111-1111-4111-8111-111111111109'::uuid, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555526'::uuid, '11111111-1111-4111-8111-111111111109'::uuid, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555527'::uuid, '11111111-1111-4111-8111-111111111109'::uuid, 'https://images.unsplash.com/photo-1567449303078-57ad995bd17b?w=1200&h=800&fit=crop&auto=format', 3, false)
) AS g(id, portfolio_id, image_url, display_order, is_featured)
JOIN public.portfolio_projects p ON p.id = g.portfolio_id
ON CONFLICT (id) DO UPDATE SET
  portfolio_id = EXCLUDED.portfolio_id,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured;

-- =============================================================================
-- Rollback
-- =============================================================================
-- DELETE FROM public.portfolio_media
--   WHERE id IN (
--     '55555555-5555-4555-8555-555555555501'::uuid,
--     '55555555-5555-4555-8555-555555555502'::uuid,
--     '55555555-5555-4555-8555-555555555503'::uuid,
--     '55555555-5555-4555-8555-555555555504'::uuid,
--     '55555555-5555-4555-8555-555555555505'::uuid,
--     '55555555-5555-4555-8555-555555555506'::uuid,
--     '55555555-5555-4555-8555-555555555507'::uuid,
--     '55555555-5555-4555-8555-555555555508'::uuid,
--     '55555555-5555-4555-8555-555555555509'::uuid,
--     '55555555-5555-4555-8555-555555555510'::uuid,
--     '55555555-5555-4555-8555-555555555511'::uuid,
--     '55555555-5555-4555-8555-555555555512'::uuid,
--     '55555555-5555-4555-8555-555555555513'::uuid,
--     '55555555-5555-4555-8555-555555555514'::uuid,
--     '55555555-5555-4555-8555-555555555515'::uuid,
--     '55555555-5555-4555-8555-555555555516'::uuid,
--     '55555555-5555-4555-8555-555555555517'::uuid,
--     '55555555-5555-4555-8555-555555555518'::uuid,
--     '55555555-5555-4555-8555-555555555519'::uuid,
--     '55555555-5555-4555-8555-555555555520'::uuid,
--     '55555555-5555-4555-8555-555555555521'::uuid,
--     '55555555-5555-4555-8555-555555555522'::uuid,
--     '55555555-5555-4555-8555-555555555523'::uuid,
--     '55555555-5555-4555-8555-555555555524'::uuid,
--     '55555555-5555-4555-8555-555555555525'::uuid,
--     '55555555-5555-4555-8555-555555555526'::uuid,
--     '55555555-5555-4555-8555-555555555527'::uuid
--   );
-- ALTER TABLE public.portfolio_media ALTER COLUMN media_id SET NOT NULL;
-- ALTER TABLE public.portfolio_media DROP COLUMN IF EXISTS image_url;
