-- Migration: 20260826140000_portfolio_strategy_headline_copy
-- Description: Replaces the Strategy phase-document headline and subtitle on
--              the CLENQO brand case study with the approved copy in every
--              locale. The headline is rendered as a solid white title and
--              the subtitle below it; all other strategy fields (tagline,
--              audience, challenges, positioning, messaging, identity) are
--              preserved by merging JSONB objects per locale.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET strategy_translations = (
  SELECT jsonb_object_agg(
    locale,
    COALESCE(strategy_translations -> locale, '{}'::jsonb)
      || jsonb_build_object(
        'headline', v.headline,
        'subtitle', v.subtitle
      )
  )
  FROM (VALUES
    (
      'en',
      'Strategic Foundation',
      'A clear strategic direction that defines how CLENQO positions, communicates, and expresses its identity across all touchpoints.'
    ),
    (
      'de',
      'Strategische Grundlage',
      'Eine klare strategische Ausrichtung, die definiert, wie CLENQO seine Identität über alle Touchpoints positioniert, kommuniziert und ausdrückt.'
    ),
    (
      'fr',
      'Fondation stratégique',
      'Une orientation stratégique claire qui définit comment CLENQO positionne, communique et exprime son identité sur tous les points de contact.'
    ),
    (
      'es',
      'Fundamento estratégico',
      'Una dirección estratégica clara que define cómo CLENQO posiciona, comunica y expresa su identidad en todos los puntos de contacto.'
    )
  ) AS v(locale, headline, subtitle)
)
WHERE slug = 'aura-cosmetics-identity';

-- Rollback: restore the previous approved headline/subtitle copy.
-- UPDATE public.portfolio_projects
-- SET strategy_translations = (
--   SELECT jsonb_object_agg(
--     locale,
--     COALESCE(strategy_translations -> locale, '{}'::jsonb)
--       || jsonb_build_object(
--         'headline', v.headline,
--         'subtitle', v.subtitle
--       )
--   )
--   FROM (VALUES
--     ('en', 'CLEAN, PREMIUM STRUCTURE', 'Professional cleaning · eco-friendly products · trusted service for your home and business.'),
--     ('de', 'SAUBERE, PREMIUM-STRUKTUR', 'Professionelle Reinigung · umweltfreundliche Produkte · vertrauensvoller Service für Zuhause und Unternehmen.'),
--     ('fr', 'STRUCTURE PROPRE ET PREMIUM', 'Nettoyage professionnel · produits écologiques · service de confiance pour votre maison et votre entreprise.'),
--     ('es', 'ESTRUCTURA LIMPIA Y PREMIUM', 'Limpieza profesional · productos ecológicos · servicio de confianza para tu hogar y tu negocio.')
--   ) AS v(locale, headline, subtitle)
-- )
-- WHERE slug = 'aura-cosmetics-identity';
