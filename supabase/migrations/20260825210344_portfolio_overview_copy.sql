-- Migration: 20260825210000_portfolio_overview_copy
-- Description: Updates `challenge_translations` for the CLENQO brand case
--              study (slug `aura-cosmetics-identity`) so the Project Overview
--              section carries the approved rebrand context: the previous
--              identity's weaknesses and the goal of the rebrand.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET challenge_translations = '{
  "en": "CLENQO''s previous identity suffered from a lack of authority, inconsistent color application, and poor typographic hierarchy. The goal of this rebrand was to establish trust and create a modern, scalable identity across all digital and physical touchpoints.",
  "de": "CLENQOs bisherige Identität litt unter mangelnder Autorität, inkonsistenter Farbanwendung und einer schwachen typografischen Hierarchie. Ziel dieses Rebrandings war es, Vertrauen aufzubauen und eine moderne, skalierbare Identität über alle digitalen und physischen Touchpoints hinweg zu schaffen.",
  "fr": "L''identité précédente de CLENQO souffrait d''un manque d''autorité, d''une application des couleurs incohérente et d''une hiérarchie typographique défaillante. L''objectif de ce rebranding était d''établir la confiance et de créer une identité moderne et évolutive sur tous les points de contact numériques et physiques.",
  "es": "La identidad anterior de CLENQO sufría una falta de autoridad, una aplicación de color incoherente y una jerarquía tipográfica deficiente. El objetivo de este rebranding fue establecer confianza y crear una identidad moderna y escalable en todos los puntos de contacto digitales y físicos."
}'::jsonb
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.portfolio_projects
-- SET challenge_translations = '{"en":"A growing natural-beauty brand looked premium in product but generic in everything else.","de":"A growing natural-beauty brand looked premium in product but generic in everything else.","fr":"A growing natural-beauty brand looked premium in product but generic in everything else.","es":"A growing natural-beauty brand looked premium in product but generic in everything else."}'::jsonb
-- WHERE slug = 'aura-cosmetics-identity';