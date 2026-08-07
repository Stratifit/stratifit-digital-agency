-- Migration: 00042_section_stats_band
-- Description: Adds an editable stats band (value + 4-language label) to
--              section_settings so the /work page stats band is CMS-editable
--              instead of hardcoded in the frontend.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- section_settings.stats
-- =============================================================================

ALTER TABLE public.section_settings
  ADD COLUMN IF NOT EXISTS stats jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.section_settings.stats IS
  'Optional stats band: array of { value: text, label_translations: {en,de,fr,es} }. Consumed by the /work page (portfolio section settings).';

-- =============================================================================
-- Seed the default stats band for the portfolio section (idempotent)
-- =============================================================================

UPDATE public.section_settings
SET stats = '[
  {
    "value": "50+",
    "label_translations": {
      "en": "Projects delivered",
      "de": "Projekte umgesetzt",
      "fr": "Projets livrés",
      "es": "Proyectos entregados"
    }
  },
  {
    "value": "340%",
    "label_translations": {
      "en": "Average client ROAS",
      "de": "Durchschnittlicher Client-ROAS",
      "fr": "ROAS moyen client",
      "es": "ROAS medio de clientes"
    }
  },
  {
    "value": "92%",
    "label_translations": {
      "en": "Clients who renew",
      "de": "Kunden, die verlängern",
      "fr": "Clients qui renouvellent",
      "es": "Clientes que renuevan"
    }
  }
]'::jsonb
WHERE section_key = 'portfolio'
  AND stats = '[]'::jsonb;
