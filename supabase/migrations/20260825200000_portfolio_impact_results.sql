-- Migration: 20260825200000_portfolio_impact_results
-- Description: Backfills the CLENQO brand case study with the approved
--              "Impact & Results" rollout content: the four metric cards
--              (42%, 12, -30%, 1.2M) and the results subtitle, replacing the
--              placeholder metrics from the original business-content seed.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET metrics = '[
  {
    "value": "42%",
    "label_translations": {
      "en": "Increase in new markets",
      "de": "Steigerung neuer Märkte",
      "fr": "Hausse des nouveaux marchés",
      "es": "Aumento de nuevos mercados"
    }
  },
  {
    "value": "12",
    "label_translations": {
      "en": "Brand recall lift",
      "de": "Markenerinnerung gestärkt",
      "fr": "Hausse de la notoriété de marque",
      "es": "Aumento del recuerdo de marca"
    }
  },
  {
    "value": "-30%",
    "label_translations": {
      "en": "Packaging costs reduced",
      "de": "Verpackungskosten gesenkt",
      "fr": "Coûts d''emballage réduits",
      "es": "Costos de empaque reducidos"
    }
  },
  {
    "value": "1.2M",
    "label_translations": {
      "en": "Major contracts secured",
      "de": "Großaufträge gesichert",
      "fr": "Contrats majeurs conclus",
      "es": "Contratos importantes asegurados"
    }
  }
]'::jsonb,
  results_translations = '{
    "en": "A measurable transformation driven by strategic clarity, a modern identity system, and consistent real-world execution.",
    "de": "Eine messbare Transformation, angetrieben durch strategische Klarheit, ein modernes Identitätssystem und eine konsequente Umsetzung in der realen Welt.",
    "fr": "Une transformation mesurable, portée par une clarté stratégique, un système d''identité moderne et une exécution cohérente dans le monde réel.",
    "es": "Una transformación medible impulsada por la claridad estratégica, un sistema de identidad moderno y una ejecución consistente en el mundo real."
  }'::jsonb
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.portfolio_projects
-- SET metrics = '[...previous metrics...]'::jsonb,
--     results_translations = '{...previous results...}'::jsonb
-- WHERE slug = 'aura-cosmetics-identity';
