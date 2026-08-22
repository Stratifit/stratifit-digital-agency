-- Migration: 00091_service_hero_numeric_stats
-- Description: Convert the hero value-stat cards on the Brand Design, Website
--              Development, and AI & Automation service pages to the numeric
--              big-number style used on Growth & Marketing (amber value +
--              uppercase label). Growth & Marketing already has this style and
--              is left untouched.
-- Stratifit Digital Agency Platform

UPDATE public.service_pages
SET hero_stats = '[
  {
    "value": "5x",
    "label_translations": {
      "de": "Ø-ROAS",
      "en": "Avg. ROAS",
      "es": "ROAS medio",
      "fr": "ROAS moyen"
    }
  },
  {
    "value": "400%",
    "label_translations": {
      "de": "Traffic-Wachstum",
      "en": "Traffic Growth",
      "es": "Crecimiento de tráfico",
      "fr": "Croissance du trafic"
    }
  },
  {
    "value": "150+",
    "label_translations": {
      "de": "Verwaltete Kampagnen",
      "en": "Campaigns Managed",
      "es": "Campañas gestionadas",
      "fr": "Campagnes gérées"
    }
  }
]'::jsonb
WHERE slug IN ('brand-design', 'website-development', 'ai-automation');
