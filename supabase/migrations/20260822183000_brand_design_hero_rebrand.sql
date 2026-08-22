-- Migration: 20260822183000_brand_design_hero_rebrand
-- Description: Rebrands the brand-design service hero to the three-part
--              "We Build Brands / People Trust." pattern with new per-locale
--              descriptions (en/de/fr/es).

UPDATE public.service_pages
SET
  hero_title_translations = $${
    "en": "We Build Brands",
    "de": "Wir entwickeln Marken,",
    "fr": "Nous créons des marques",
    "es": "Creamos marcas"
  }$$::jsonb,
  hero_highlight_translations = $${
    "en": "People Trust.",
    "de": "denen Menschen vertrauen.",
    "fr": "qui inspirent confiance.",
    "es": "que inspiran confianza."
  }$$::jsonb,
  hero_description_translations = $${
    "en": "We create strategic brand identities that define your positioning, build lasting credibility, and deliver a consistent, memorable experience across every touchpoint.",
    "de": "Wir entwickeln strategische Markenidentitäten, die Ihre Positionierung definieren, Ihre Glaubwürdigkeit nachhaltig stärken und an jedem Kontaktpunkt ein konsistentes, einprägsames Markenerlebnis schaffen.",
    "fr": "Nous créons des identités de marque stratégiques qui définissent votre positionnement, renforcent durablement votre crédibilité et offrent une expérience cohérente et mémorable à chaque point de contact.",
    "es": "Creamos identidades de marca estratégicas que definen su posicionamiento, consolidan una credibilidad duradera y ofrecen una experiencia coherente y memorable en cada punto de contacto."
  }$$::jsonb
WHERE slug = 'brand-design';
