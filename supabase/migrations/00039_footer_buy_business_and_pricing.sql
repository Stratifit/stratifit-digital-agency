-- Migration: 00039_footer_buy_business_and_pricing
-- Description: Add "Buy a Business" under Platform and "Pricing" under
--              Company in the footer link structure.
-- Stratifit Digital Agency Platform

-- Platform group (20000000-0000-4000-8000-000000000001):
--   Buy a Business → /buy-business (the marketplace hub; /acquisition redirects there).
-- Company group (20000000-0000-4000-8000-000000000002):
--   Pricing → /#pricing (homepage pricing section anchor).

INSERT INTO public.footer_links (id, group_id, label_translations, href, is_external, display_order, is_visible)
VALUES
  ('30000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000001', '{"en": "Buy a Business", "de": "Unternehmen kaufen", "fr": "Acheter une entreprise", "es": "Comprar un negocio"}'::jsonb, '/buy-business', false, 5, true),
  ('30000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000002', '{"en": "Pricing", "de": "Preise", "fr": "Tarifs", "es": "Precios"}'::jsonb, '/#pricing', false, 4, true)
ON CONFLICT (id) DO UPDATE SET
  group_id = EXCLUDED.group_id,
  label_translations = EXCLUDED.label_translations,
  href = EXCLUDED.href,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Rollback
-- =============================================================================
-- DELETE FROM public.footer_links
-- WHERE id IN ('30000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000012');
