-- ============================================================================
-- Stratifit — Update navigation header links
-- Removes the FAQ link and adds a "Buy a Business" link.
-- ============================================================================

begin;

-- Replace the links array with the new order (FAQ removed, Buy a Business added)
update section_navigation_header
set content = jsonb_set(
  content,
  '{links}',
  '[
    {"id": "services", "label": "Services", "href": "/services"},
    {"id": "portfolio", "label": "Portfolio", "href": "/portfolio"},
    {"id": "insights", "label": "Insights", "href": "/insights"},
    {"id": "about", "label": "About", "href": "/about"},
    {"id": "buy-a-business", "label": "Buy a Business", "href": "/buy-a-business"},
    {"id": "contact", "label": "Contact", "href": "/contact"}
  ]'::jsonb
);

-- Add translations for "Buy a Business"
update section_navigation_header
set translations = jsonb_set(translations, '{fr,links.buy-a-business.label}', '"Acheter une entreprise"');

update section_navigation_header
set translations = jsonb_set(translations, '{de,links.buy-a-business.label}', '"Unternehmen kaufen"');

update section_navigation_header
set translations = jsonb_set(translations, '{es,links.buy-a-business.label}', '"Comprar un negocio"');

-- Remove obsolete FAQ translations
update section_navigation_header
set translations = translations #- '{fr,links.faq.label}';

update section_navigation_header
set translations = translations #- '{de,links.faq.label}';

update section_navigation_header
set translations = translations #- '{es,links.faq.label}';

commit;
