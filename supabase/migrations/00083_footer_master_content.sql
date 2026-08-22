-- =============================================================================
-- 00083_footer_master_content.sql
-- Footer — approved copy (STRATIFIT Content Master)
--   • site_settings.site_description_translations (brand description)
--   • footer_groups titles: Platform -> Explore, Legal labels updated
--   • footer_links: Explore (Home, Services, Our Work, Insights, Pricing),
--     Company (About, How We Work, Why STRATIFIT, Careers, Contact),
--     Legal (Privacy Policy, Terms & Conditions, Cookie Policy, Imprint)
-- All labels in 4 languages.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Brand description (site_settings)
-- ---------------------------------------------------------------------------

UPDATE public.site_settings
SET site_description_translations = '{
  "en": "We build high-performing websites, distinctive brands, and AI-powered systems that help businesses grow.",
  "de": "Wir entwickeln leistungsstarke Websites, unverwechselbare Marken und KI-gestützte Systeme, die Unternehmen wachsen lassen.",
  "fr": "Nous créons des sites web performants, des marques distinctives et des systèmes basés sur l''IA pour aider les entreprises à se développer.",
  "es": "Creamos sitios web de alto rendimiento, marcas distintivas y sistemas impulsados por IA que ayudan a las empresas a crecer."
}'::jsonb;

-- ---------------------------------------------------------------------------
-- Footer group titles
-- ---------------------------------------------------------------------------

UPDATE public.footer_groups
SET title_translations = '{
  "en": "Explore",
  "de": "Entdecken",
  "fr": "Découvrir",
  "es": "Explorar"
}'::jsonb
WHERE id = '20000000-0000-4000-8000-000000000001';

-- Company group (id ...0002) keeps its title (Company / Unternehmen / Entreprise / Empresa).

UPDATE public.footer_groups
SET title_translations = '{
  "en": "Legal",
  "de": "Rechtliches",
  "fr": "Informations légales",
  "es": "Información legal"
}'::jsonb
WHERE id = '20000000-0000-4000-8000-000000000003';

-- ---------------------------------------------------------------------------
-- Footer links
-- ---------------------------------------------------------------------------

-- Explore: Home (1), Services (2), Our Work (3), Insights (4), Pricing (5)
UPDATE public.footer_links
SET label_translations = '{
  "en": "Our Work",
  "de": "Unsere Projekte",
  "fr": "Nos réalisations",
  "es": "Nuestros proyectos"
}'::jsonb
WHERE id = '30000000-0000-4000-8000-000000000003';

UPDATE public.footer_links
SET label_translations = '{
  "en": "Insights",
  "de": "Insights",
  "fr": "Perspectives",
  "es": "Perspectivas"
}'::jsonb
WHERE id = '30000000-0000-4000-8000-000000000004';

-- Former "Buy a Business" link becomes Pricing.
UPDATE public.footer_links
SET label_translations = '{
  "en": "Pricing",
  "de": "Preise",
  "fr": "Tarifs",
  "es": "Precios"
}'::jsonb,
    href = '/#pricing',
    display_order = 5
WHERE id = '30000000-0000-4000-8000-000000000011';

-- Company: About (1), How We Work (2), Why STRATIFIT (3), Careers (4), Contact (5)
UPDATE public.footer_links
SET label_translations = '{
  "en": "About",
  "de": "Über uns",
  "fr": "À propos",
  "es": "Sobre nosotros"
}'::jsonb
WHERE id = '30000000-0000-4000-8000-000000000005';

-- Former "Pricing" (Company) link becomes "How We Work".
UPDATE public.footer_links
SET label_translations = '{
  "en": "How We Work",
  "de": "So arbeiten wir",
  "fr": "Notre méthode",
  "es": "Cómo trabajamos"
}'::jsonb,
    href = '/#process',
    display_order = 2
WHERE id = '30000000-0000-4000-8000-000000000012';

-- Former "Hiring" link becomes "Why STRATIFIT".
UPDATE public.footer_links
SET label_translations = '{
  "en": "Why STRATIFIT",
  "de": "Warum STRATIFIT",
  "fr": "Pourquoi STRATIFIT",
  "es": "Por qué STRATIFIT"
}'::jsonb,
    href = '/#why-choose-us',
    display_order = 3
WHERE id = '30000000-0000-4000-8000-000000000014';

UPDATE public.footer_links
SET label_translations = '{
  "en": "Careers",
  "de": "Karriere",
  "fr": "Carrières",
  "es": "Trabaja con nosotros"
}'::jsonb,
    display_order = 4
WHERE id = '30000000-0000-4000-8000-000000000006';

UPDATE public.footer_links
SET display_order = 5
WHERE id = '30000000-0000-4000-8000-000000000007';

-- Legal: Privacy Policy (1), Terms & Conditions (2), Cookie Policy (3), Imprint (4)
UPDATE public.footer_links
SET label_translations = '{
  "en": "Terms & Conditions",
  "de": "Allgemeine Geschäftsbedingungen",
  "fr": "Conditions générales",
  "es": "Términos y condiciones"
}'::jsonb
WHERE id = '30000000-0000-4000-8000-000000000009';

UPDATE public.footer_links
SET label_translations = '{
  "en": "Cookie Policy",
  "de": "Cookie-Richtlinie",
  "fr": "Politique relative aux cookies",
  "es": "Política de cookies"
}'::jsonb
WHERE id = '30000000-0000-4000-8000-000000000010';

-- =============================================================================
-- Rollback (if ever needed): restore previous labels/hrefs/orders via the
-- seed block in supabase/seed.sql (Platform/Company/Legal + original links).
-- =============================================================================
