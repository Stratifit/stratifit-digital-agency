-- Migration: 00090_service_why_numeric_stats
-- Description: Convert the "Why It Matters" stat badges on the Brand Design,
--              Website Development, and AI & Automation service pages to the
--              numeric big-number style used on Growth & Marketing (value +
--              uppercase label + small hint). Growth & Marketing already has
--              this style and is left untouched.
-- Stratifit Digital Agency Platform

UPDATE public.service_pages
SET why_badges = '[
  {
    "value": "3.4x",
    "hint_translations": {
      "de": "Rendite auf Werbeausgaben",
      "en": "return on ad spend",
      "es": "retorno de la inversión publicitaria",
      "fr": "retour sur dépenses publicitaires"
    },
    "label_translations": {
      "de": "ROAS",
      "en": "ROAS",
      "es": "ROAS",
      "fr": "ROAS"
    }
  },
  {
    "value": "+340%",
    "hint_translations": {
      "de": "im 90-Tage-Ramp-up",
      "en": "in 90-day ramp",
      "es": "en rampa de 90 días",
      "fr": "en montée en charge de 90 jours"
    },
    "label_translations": {
      "de": "Zielgruppenwachstum",
      "en": "Audience Growth",
      "es": "Crecimiento de audiencia",
      "fr": "Croissance d''audience"
    }
  },
  {
    "value": "-41%",
    "hint_translations": {
      "de": "Kundenakquisitionskosten",
      "en": "customer acquisition cost",
      "es": "costo de adquisición de clientes",
      "fr": "coût d''acquisition client"
    },
    "label_translations": {
      "de": "CAC",
      "en": "CAC",
      "es": "CAC",
      "fr": "CAC"
    }
  }
]'::jsonb
WHERE slug IN ('brand-design', 'website-development', 'ai-automation');
