-- =============================================================================
-- Stratifit Digital Agency — Seed Data
-- Description: Demonstrates a fully dynamic, multi-block home page with
--              English and German translations.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. HOMEPAGE
-- -----------------------------------------------------------------------------
INSERT INTO pages (slug, title, status, meta_data)
VALUES (
  '/',
  'Home',
  'published',
  '{
    "meta_title": "Stratifit — Digital Agency for Brand Strategy & AI Automation",
    "meta_description": "Stratifit builds high-performance digital experiences. Brand strategy, web development, and AI automation for modern businesses.",
    "og_image": "/images/og-home.jpg"
  }'::jsonb
);

-- -----------------------------------------------------------------------------
-- 2. SECTIONS (ordered by display_order)
-- -----------------------------------------------------------------------------
WITH page_ref AS (SELECT id FROM pages WHERE slug = '/')

-- 2a. Hero Primary Section
INSERT INTO sections (page_id, component_type, display_order, visibility)
SELECT id, 'hero-primary', 0, '{"device": "all"}'::jsonb
FROM page_ref;

-- 2b. Feature Grid Section
INSERT INTO sections (page_id, component_type, display_order, visibility)
SELECT id, 'feature-grid', 1, '{"device": "all"}'::jsonb
FROM page_ref;

-- 2c. CTA Banner Section
INSERT INTO sections (page_id, component_type, display_order, visibility)
SELECT id, 'cta-banner', 2, '{"device": "all"}'::jsonb
FROM page_ref;

-- -----------------------------------------------------------------------------
-- 3. CONTENT BLOCKS
-- -----------------------------------------------------------------------------

-- 3a. Hero Primary — Blocks
WITH hero_section AS (
  SELECT id FROM sections
  WHERE component_type = 'hero-primary'
  AND page_id = (SELECT id FROM pages WHERE slug = '/')
)
INSERT INTO content_blocks (section_id, block_type, data, display_order)
SELECT
  hero_section.id, block_type, data::jsonb, display_order
FROM hero_section,
(VALUES
  ('heading', '{"text": "We Build Digital That Works.", "level": "h1", "align": "center"}'::text, 0),
  ('rich_text', '{"html_content": "<p>Stratifit combines brand strategy, web development, and AI automation to deliver high-performance digital experiences.</p>", "formatted": true}', 1),
  ('button', '{"label": "Start Your Project", "href": "/contact", "variant": "primary"}', 2),
  ('button', '{"label": "View Our Work", "href": "/work", "variant": "outline"}', 3)
) AS t(block_type, data, display_order);

-- 3b. Feature Grid — Blocks (3 feature cards)
WITH feature_section AS (
  SELECT id FROM sections
  WHERE component_type = 'feature-grid'
  AND page_id = (SELECT id FROM pages WHERE slug = '/')
)
INSERT INTO content_blocks (section_id, block_type, data, display_order)
SELECT
  feature_section.id, block_type, data::jsonb, display_order
FROM feature_section,
(VALUES
  ('heading', '{"text": "What We Deliver", "level": "h2", "align": "center"}'::text, 0),
  ('card', '{"title": "Brand Strategy", "description": "Position your brand for lasting impact with data-driven identity design and messaging frameworks.", "icon_name": "sparkles", "media_id": null}', 1),
  ('card', '{"title": "Web Development", "description": "High-performance Next.js applications engineered for speed, accessibility, and conversion.", "icon_name": "code", "media_id": null}', 2),
  ('card', '{"title": "AI Automation", "description": "Intelligent workflows and custom AI agents that streamline operations and scale your output.", "icon_name": "bot", "media_id": null}', 3)
) AS t(block_type, data, display_order);

-- 3c. CTA Banner — Blocks
WITH cta_section AS (
  SELECT id FROM sections
  WHERE component_type = 'cta-banner'
  AND page_id = (SELECT id FROM pages WHERE slug = '/')
)
INSERT INTO content_blocks (section_id, block_type, data, display_order)
SELECT
  cta_section.id, block_type, data::jsonb, display_order
FROM cta_section,
(VALUES
  ('heading', '{"text": "Ready to scale your digital presence?", "level": "h2", "align": "center"}'::text, 0),
  ('rich_text', '{"html_content": "<p>Book a free consultation and discover how Stratifit can transform your brand.</p>", "formatted": true}', 1),
  ('button', '{"label": "Get in Touch", "href": "/contact", "variant": "primary"}', 2)
) AS t(block_type, data, display_order);

-- -----------------------------------------------------------------------------
-- 4. GERMAN TRANSLATIONS (locale: de)
-- -----------------------------------------------------------------------------

-- 4a. Homepage — German meta_data override
INSERT INTO translations (entity_type, entity_id, locale, translated_fields)
SELECT
  'pages',
  id,
  'de',
  '{
    "title": "Startseite",
    "meta_data": {
      "meta_title": "Stratifit — Digitalagentur für Markenstrategie & KI-Automation",
      "meta_description": "Stratifit entwickelt leistungsstarke digitale Erlebnisse. Markenstrategie, Webentwicklung und KI-Automation für moderne Unternehmen."
    }
  }'::jsonb
FROM pages
WHERE slug = '/';

-- 4b. Hero heading — German
INSERT INTO translations (entity_type, entity_id, locale, translated_fields)
SELECT
  'content_blocks',
  cb.id,
  'de',
  '{"data": {"text": "Wir bauen Digitales, das funktioniert."}}'::jsonb
FROM content_blocks cb
JOIN sections s ON s.id = cb.section_id
JOIN pages p ON p.id = s.page_id
WHERE p.slug = '/' AND s.component_type = 'hero-primary' AND cb.block_type = 'heading';

-- 4c. Hero rich_text — German
INSERT INTO translations (entity_type, entity_id, locale, translated_fields)
SELECT
  'content_blocks',
  cb.id,
  'de',
  '{"data": {"html_content": "<p>Stratifit vereint Markenstrategie, Webentwicklung und KI-Automation, um leistungsstarke digitale Erlebnisse zu schaffen.</p>"}}'::jsonb
FROM content_blocks cb
JOIN sections s ON s.id = cb.section_id
JOIN pages p ON p.id = s.page_id
WHERE p.slug = '/' AND s.component_type = 'hero-primary' AND cb.block_type = 'rich_text';

-- 4d. Hero CTA buttons — German
INSERT INTO translations (entity_type, entity_id, locale, translated_fields)
SELECT
  'content_blocks',
  cb.id,
  'de',
  CASE cb.display_order
    WHEN 2 THEN '{"data": {"label": "Projekt starten"}}'::jsonb
    WHEN 3 THEN '{"data": {"label": "Arbeiten ansehen"}}'::jsonb
  END
FROM content_blocks cb
JOIN sections s ON s.id = cb.section_id
JOIN pages p ON p.id = s.page_id
WHERE p.slug = '/' AND s.component_type = 'hero-primary' AND cb.block_type = 'button';

-- 4e. Feature grid heading — German
INSERT INTO translations (entity_type, entity_id, locale, translated_fields)
SELECT
  'content_blocks',
  cb.id,
  'de',
  '{"data": {"text": "Was wir liefern"}}'::jsonb
FROM content_blocks cb
JOIN sections s ON s.id = cb.section_id
JOIN pages p ON p.id = s.page_id
WHERE p.slug = '/' AND s.component_type = 'feature-grid' AND cb.block_type = 'heading'
AND cb.display_order = 0;

-- 4f. Feature cards — German (by display_order)
INSERT INTO translations (entity_type, entity_id, locale, translated_fields)
SELECT
  'content_blocks',
  cb.id,
  'de',
  CASE cb.display_order
    WHEN 1 THEN '{"data": {"title": "Markenstrategie", "description": "Positionieren Sie Ihre Marke mit datengestützter Identitätsentwicklung und Messaging-Frameworks für nachhaltige Wirkung."}}'::jsonb
    WHEN 2 THEN '{"data": {"title": "Webentwicklung", "description": "Hochleistungsfähige Next.js-Anwendungen, entwickelt für Geschwindigkeit, Barrierefreiheit und Konversion."}}'::jsonb
    WHEN 3 THEN '{"data": {"title": "KI-Automation", "description": "Intelligente Workflows und maßgeschneiderte KI-Agenten, die Abläufe optimieren und Ihre Ergebnisse skalieren."}}'::jsonb
  END
FROM content_blocks cb
JOIN sections s ON s.id = cb.section_id
JOIN pages p ON p.id = s.page_id
WHERE p.slug = '/' AND s.component_type = 'feature-grid' AND cb.block_type = 'card';

-- 4g. CTA banner — German
INSERT INTO translations (entity_type, entity_id, locale, translated_fields)
SELECT
  'content_blocks',
  cb.id,
  'de',
  CASE cb.block_type
    WHEN 'heading' THEN '{"data": {"text": "Bereit, Ihre digitale Präsenz zu skalieren?"}}'::jsonb
    WHEN 'rich_text' THEN '{"data": {"html_content": "<p>Vereinbaren Sie ein kostenloses Beratungsgespräch und entdecken Sie, wie Stratifit Ihre Marke transformieren kann.</p>"}}'::jsonb
    WHEN 'button' THEN '{"data": {"label": "Kontakt aufnehmen"}}'::jsonb
  END
FROM content_blocks cb
JOIN sections s ON s.id = cb.section_id
JOIN pages p ON p.id = s.page_id
WHERE p.slug = '/' AND s.component_type = 'cta-banner';
