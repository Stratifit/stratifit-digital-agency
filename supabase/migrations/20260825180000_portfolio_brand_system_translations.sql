-- Migration: 20260825180000_portfolio_brand_system_translations
-- Description: Adds `brand_system_translations` to portfolio_projects so brand
--              case studies can carry the "Identity & Assets" phase document
--              (primary typeface + description, supporting sub-fonts, identity
--              assets intro, visual applications intro) per locale, and
--              backfills the CLENQO case study with the approved rollout copy.
-- Stratifit Digital Agency Platform

ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS brand_system_translations jsonb;

COMMENT ON COLUMN public.portfolio_projects.brand_system_translations
  IS 'Multilingual Identity & Assets phase document for brand case studies: typeface, typeface description, sub-fonts, identity assets intro, visual applications intro.';

-- Backfill the CLENQO brand case study.
UPDATE public.portfolio_projects
SET brand_system_translations = '{
  "en": {
    "typeface": "Clenqo Sans",
    "typeface_description": "A custom-tuned grotesque typeface designed for maximum clarity in high-pressure service environments.",
    "sub_fonts": [
      { "name": "Hanken Grotesk", "usage": "Primary Display / Bold, Modern, Sharp" },
      { "name": "Inter", "usage": "Secondary Body / Neutral, Legible\nAccent Label / Technical, Precise" }
    ],
    "identity_assets": "Create supporting elements such as iconography, patterns, and layout rules that strengthen brand recognition. These assets ensure CLENQO''s identity remains cohesive and adaptable across multiple formats.",
    "visual_applications": "Apply the identity system across real-world touchpoints business cards, uniforms, vehicles, product packaging, and digital interfaces demonstrating how the brand comes to life in practical scenarios."
  },
  "de": {
    "typeface": "Clenqo Sans",
    "typeface_description": "Eine individuell abgestimmte Grotesk-Schriftart, die für maximale Klarheit in anspruchsvollen Service-Umgebungen entwickelt wurde.",
    "sub_fonts": [
      { "name": "Hanken Grotesk", "usage": "Primäre Display-Schrift / Kühn, Modern, Scharf" },
      { "name": "Inter", "usage": "Sekundäre Textschrift / Neutral, Leserlich\nAkzent-Label / Technisch, Präzise" }
    ],
    "identity_assets": "Erstellen Sie unterstützende Elemente wie Ikonografie, Muster und Layout-Regeln, die die Wiedererkennung der Marke stärken. Diese Assets sorgen dafür, dass die Identität von CLENQO über mehrere Formate hinweg kohärent und anpassungsfähig bleibt.",
    "visual_applications": "Wenden Sie das Identitätssystem auf reale Touchpoints an – Visitenkarten, Uniformen, Fahrzeuge, Produktverpackungen und digitale Oberflächen – und zeigen Sie, wie die Marke in praktischen Szenarien zum Leben erweckt wird."
  },
  "fr": {
    "typeface": "Clenqo Sans",
    "typeface_description": "Une police grotesque sur mesure, conçue pour une clarté maximale dans des environnements de service exigeants.",
    "sub_fonts": [
      { "name": "Hanken Grotesk", "usage": "Affichage principal / Gras, Moderne, Net" },
      { "name": "Inter", "usage": "Corps de texte secondaire / Neutre, Lisible\nÉtiquette d''accent / Technique, Précise" }
    ],
    "identity_assets": "Créez des éléments de soutien tels que l''iconographie, les motifs et les règles de mise en page qui renforcent la reconnaissance de la marque. Ces assets garantissent que l''identité de CLENQO reste cohérente et adaptable à travers plusieurs formats.",
    "visual_applications": "Appliquez le système d''identité à des points de contact réels – cartes de visite, uniformes, véhicules, emballages produits et interfaces numériques – démontrant comment la marque prend vie dans des scénarios concrets."
  },
  "es": {
    "typeface": "Clenqo Sans",
    "typeface_description": "Una tipografía grotesca personalizada, diseñada para una claridad máxima en entornos de servicio exigentes.",
    "sub_fonts": [
      { "name": "Hanken Grotesk", "usage": "Pantalla principal / Audaz, Moderna, Nítida" },
      { "name": "Inter", "usage": "Texto secundario / Neutral, Legible\nEtiqueta de acento / Técnica, Precisa" }
    ],
    "identity_assets": "Cree elementos de apoyo como iconografía, patrones y reglas de diseño que fortalezcan el reconocimiento de la marca. Estos activos garantizan que la identidad de CLENQO se mantenga coherente y adaptable en múltiples formatos.",
    "visual_applications": "Aplique el sistema de identidad en puntos de contacto reales: tarjetas de presentación, uniformes, vehículos, empaques de producto e interfaces digitales, demostrando cómo la marca cobra vida en escenarios prácticos."
  }
}'::jsonb
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.portfolio_projects DROP COLUMN IF EXISTS brand_system_translations;
