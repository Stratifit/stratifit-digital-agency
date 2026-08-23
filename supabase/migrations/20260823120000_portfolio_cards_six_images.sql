-- =============================================================================
-- Description: Extend the portfolio_media gallery to six images per published
--              case study (migration 00041 seeded three). The homepage "Our
--              Work" cards render a 3x2 grid of small thumbnails, so each card
--              needs up to six images. Idempotent via stable UUIDs, mirroring
--              the migration 00041 seed pattern.
-- Stratifit Digital Agency Platform
-- =============================================================================

INSERT INTO public.portfolio_media (id, portfolio_id, image_url, caption_translations, display_order, is_featured)
SELECT g.id, p.id, g.image_url, '{}'::jsonb, g.display_order, g.is_featured
FROM (VALUES
  -- Maison Lumière Brand System (slots 4–6)
  ('55555555-5555-4555-8555-555555555601'::uuid, '11111111-1111-4111-8111-111111111101'::uuid, 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=800&fit=crop&auto=format', 4, false),
  ('55555555-5555-4555-8555-555555555602'::uuid, '11111111-1111-4111-8111-111111111101'::uuid, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop&auto=format', 5, false),
  ('55555555-5555-4555-8555-555555555603'::uuid, '11111111-1111-4111-8111-111111111101'::uuid, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&fit=crop&auto=format', 6, false),
  -- Nordlicht Logistics Website (slots 4–6)
  ('55555555-5555-4555-8555-555555555604'::uuid, '11111111-1111-4111-8111-111111111102'::uuid, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop&auto=format', 4, false),
  ('55555555-5555-4555-8555-555555555605'::uuid, '11111111-1111-4111-8111-111111111102'::uuid, 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=800&fit=crop&auto=format', 5, false),
  ('55555555-5555-4555-8555-555555555606'::uuid, '11111111-1111-4111-8111-111111111102'::uuid, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop&auto=format', 6, false),
  -- Helios Health AI Support (slots 4–6)
  ('55555555-5555-4555-8555-555555555607'::uuid, '11111111-1111-4111-8111-111111111103'::uuid, 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=800&fit=crop&auto=format', 4, false),
  ('55555555-5555-4555-8555-555555555608'::uuid, '11111111-1111-4111-8111-111111111103'::uuid, 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200&h=800&fit=crop&auto=format', 5, false),
  ('55555555-5555-4555-8555-555555555609'::uuid, '11111111-1111-4111-8111-111111111103'::uuid, 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&h=800&fit=crop&auto=format', 6, false),
  -- Aura Cosmetics Rebrand (slots 4–6)
  ('55555555-5555-4555-8555-555555555610'::uuid, '11111111-1111-4111-8111-111111111104'::uuid, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop&auto=format', 4, false),
  ('55555555-5555-4555-8555-555555555611'::uuid, '11111111-1111-4111-8111-111111111104'::uuid, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop&auto=format', 5, false),
  ('55555555-5555-4555-8555-555555555612'::uuid, '11111111-1111-4111-8111-111111111104'::uuid, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&fit=crop&auto=format', 6, false),
  -- Nova Fintech Platform (slots 4–6)
  ('55555555-5555-4555-8555-555555555613'::uuid, '11111111-1111-4111-8111-111111111105'::uuid, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop&auto=format', 4, false),
  ('55555555-5555-4555-8555-555555555614'::uuid, '11111111-1111-4111-8111-111111111105'::uuid, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop&auto=format', 5, false),
  ('55555555-5555-4555-8555-555555555615'::uuid, '11111111-1111-4111-8111-111111111105'::uuid, 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=800&fit=crop&auto=format', 6, false),
  -- Atlas Commerce Platform (slots 4–6)
  ('55555555-5555-4555-8555-555555555616'::uuid, '11111111-1111-4111-8111-111111111106'::uuid, 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=800&fit=crop&auto=format', 4, false),
  ('55555555-5555-4555-8555-555555555617'::uuid, '11111111-1111-4111-8111-111111111106'::uuid, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', 5, false),
  ('55555555-5555-4555-8555-555555555618'::uuid, '11111111-1111-4111-8111-111111111106'::uuid, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', 6, false),
  -- SmartFlow AI Pipeline (slots 4–6)
  ('55555555-5555-4555-8555-555555555619'::uuid, '11111111-1111-4111-8111-111111111107'::uuid, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&auto=format', 4, false),
  ('55555555-5555-4555-8555-555555555620'::uuid, '11111111-1111-4111-8111-111111111107'::uuid, 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200&h=800&fit=crop&auto=format', 5, false),
  ('55555555-5555-4555-8555-555555555621'::uuid, '11111111-1111-4111-8111-111111111107'::uuid, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop&auto=format', 6, false),
  -- GrowthStack Campaign (slots 4–6)
  ('55555555-5555-4555-8555-555555555622'::uuid, '11111111-1111-4111-8111-111111111108'::uuid, 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=800&fit=crop&auto=format', 4, false),
  ('55555555-5555-4555-8555-555555555623'::uuid, '11111111-1111-4111-8111-111111111108'::uuid, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop&auto=format', 5, false),
  ('55555555-5555-4555-8555-555555555624'::uuid, '11111111-1111-4111-8111-111111111108'::uuid, 'https://images.unsplash.com/photo-1567449303078-57ad995bd17b?w=1200&h=800&fit=crop&auto=format', 6, false),
  -- Vertex SaaS Landing (slots 4–6)
  ('55555555-5555-4555-8555-555555555625'::uuid, '11111111-1111-4111-8111-111111111109'::uuid, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop&auto=format', 4, false),
  ('55555555-5555-4555-8555-555555555626'::uuid, '11111111-1111-4111-8111-111111111109'::uuid, 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=800&fit=crop&auto=format', 5, false),
  ('55555555-5555-4555-8555-555555555627'::uuid, '11111111-1111-4111-8111-111111111109'::uuid, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop&auto=format', 6, false)
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
--     '55555555-5555-4555-8555-555555555601'::uuid,
--     '55555555-5555-4555-8555-555555555602'::uuid,
--     '55555555-5555-4555-8555-555555555603'::uuid,
--     '55555555-5555-4555-8555-555555555604'::uuid,
--     '55555555-5555-4555-8555-555555555605'::uuid,
--     '55555555-5555-4555-8555-555555555606'::uuid,
--     '55555555-5555-4555-8555-555555555607'::uuid,
--     '55555555-5555-4555-8555-555555555608'::uuid,
--     '55555555-5555-4555-8555-555555555609'::uuid,
--     '55555555-5555-4555-8555-555555555610'::uuid,
--     '55555555-5555-4555-8555-555555555611'::uuid,
--     '55555555-5555-4555-8555-555555555612'::uuid,
--     '55555555-5555-4555-8555-555555555613'::uuid,
--     '55555555-5555-4555-8555-555555555614'::uuid,
--     '55555555-5555-4555-8555-555555555615'::uuid,
--     '55555555-5555-4555-8555-555555555616'::uuid,
--     '55555555-5555-4555-8555-555555555617'::uuid,
--     '55555555-5555-4555-8555-555555555618'::uuid,
--     '55555555-5555-4555-8555-555555555619'::uuid,
--     '55555555-5555-4555-8555-555555555620'::uuid,
--     '55555555-5555-4555-8555-555555555621'::uuid,
--     '55555555-5555-4555-8555-555555555622'::uuid,
--     '55555555-5555-4555-8555-555555555623'::uuid,
--     '55555555-5555-4555-8555-555555555624'::uuid,
--     '55555555-5555-4555-8555-555555555625'::uuid,
--     '55555555-5555-4555-8555-555555555626'::uuid,
--     '55555555-5555-4555-8555-555555555627'::uuid
--   );
