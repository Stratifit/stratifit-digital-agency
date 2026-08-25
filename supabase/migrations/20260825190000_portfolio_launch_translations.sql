-- Migration: 20260825190000_portfolio_launch_translations
-- Description: Adds `launch_translations` to portfolio_projects so brand
--              case studies can carry the "Launch & Activation" phase
--              document (headline, digital presence intro, physical
--              touchpoints intro, brand guidelines intro) per locale, and
--              backfills the CLENQO case study with the approved rollout copy.
-- Stratifit Digital Agency Platform

ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS launch_translations jsonb;

COMMENT ON COLUMN public.portfolio_projects.launch_translations
  IS 'Multilingual Launch & Activation phase document for brand case studies: headline, intro, physical touchpoints intro, brand guidelines intro.';

-- Backfill the CLENQO brand case study.
UPDATE public.portfolio_projects
SET launch_translations = '{
  "en": {
    "headline": "REAL WORLD ROLLOUT & ACTIVATION\nDIGITAL PRESENCE",
    "intro": "Apply the brand system to CLENQO''s website, social templates, and online assets — creating a cohesive, modern experience that reinforces trust and eco-focused values.",
    "physical": "Introduce the identity across uniforms, vehicles, packaging, and printed materials, establishing a unified visual language in every customer interaction.",
    "guidelines": "Deliver a scalable guideline system that defines logo usage, color rules, typography, and layout principles — ensuring long-term consistency as the brand grows."
  },
  "de": {
    "headline": "REAL-WORLD-ROLLOUT & AKTIVIERUNG\nDIGITALE PRÄSENZ",
    "intro": "Wenden Sie das Markensystem auf CLENQOs Website, Social-Media-Vorlagen und Online-Assets an – für ein kohärentes, modernes Erlebnis, das Vertrauen und ökologische Werte stärkt.",
    "physical": "Führen Sie die Identität über Uniformen, Fahrzeuge, Verpackungen und Druckmaterialien ein und etablieren Sie so eine einheitliche visuelle Sprache in jeder Kundeninteraktion.",
    "guidelines": "Liefern Sie ein skalierbares Richtliniensystem, das Logoverwendung, Farbregeln, Typografie und Layout-Prinzipien definiert – für langfristige Konsistenz, während die Marke wächst."
  },
  "fr": {
    "headline": "DÉPLOIEMENT RÉEL & ACTIVATION\nPRÉSENCE NUMÉRIQUE",
    "intro": "Appliquez le système de marque au site web de CLENQO, aux modèles de réseaux sociaux et aux actifs en ligne – créant une expérience cohérente et moderne qui renforce la confiance et les valeurs éco-responsables.",
    "physical": "Introduisez l''identité à travers les uniformes, les véhicules, les emballages et les supports imprimés, en établissant un langage visuel unifié dans chaque interaction client.",
    "guidelines": "Livrez un système de directives évolutif qui définit l''utilisation du logo, les règles de couleur, la typographie et les principes de mise en page – garantissant une cohérence à long terme à mesure que la marque grandit."
  },
  "es": {
    "headline": "LANZAMIENTO REAL Y ACTIVACIÓN\nPRESENCIA DIGITAL",
    "intro": "Aplique el sistema de marca al sitio web de CLENQO, las plantillas de redes sociales y los activos en línea, creando una experiencia cohesiva y moderna que refuerza la confianza y los valores ecológicos.",
    "physical": "Introduzca la identidad en uniformes, vehículos, empaques y materiales impresos, estableciendo un lenguaje visual unificado en cada interacción con el cliente.",
    "guidelines": "Entregue un sistema de pautas escalable que defina el uso del logo, las reglas de color, la tipografía y los principios de diseño, garantizando la consistencia a largo plazo a medida que la marca crece."
  }
}'::jsonb
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.portfolio_projects DROP COLUMN IF EXISTS launch_translations;
