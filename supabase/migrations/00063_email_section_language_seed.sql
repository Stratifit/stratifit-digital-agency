-- Migration: 00063_email_section_language_seed
-- Description: Seed language-specific contact inbox sections (German, French,
--   Spanish) so language-aware inbound routing is active out of the box.
--   English continues to use the language-agnostic `contact` section, which
--   also remains the target for contact-form submissions (form_source_key).
-- Stratifit Digital Agency Platform

insert into public.email_inbox_sections (
  slug,
  name_translations,
  enabled,
  routing_addresses,
  form_source_key,
  from_address,
  language,
  auto_reply_enabled,
  auto_reply_template_id,
  display_order
)
select
  v.slug,
  v.name_translations,
  true,
  '{"contact@stratifit.com", "hello@stratifit.com"}'::text[],
  null,
  'hello@stratifit.com',
  v.language,
  true,
  t.id,
  v.display_order
from (
  values
    ('contact-de', 'de', 11,
     '{"en": "Contact — German", "de": "Kontakt — Deutsch", "fr": "Contact — Allemand", "es": "Contacto — Alemán"}'::jsonb),
    ('contact-fr', 'fr', 12,
     '{"en": "Contact — French", "de": "Kontakt — Französisch", "fr": "Contact — Français", "es": "Contacto — Francés"}'::jsonb),
    ('contact-es', 'es', 13,
     '{"en": "Contact — Spanish", "de": "Kontakt — Spanisch", "fr": "Contact — Espagnol", "es": "Contacto — Español"}'::jsonb)
) as v(slug, language, display_order, name_translations)
join public.email_templates t on t.key = 'contact_auto_thanks'
on conflict (slug) do nothing;

-- Rollback:
-- DELETE FROM public.email_inbox_sections
--   WHERE slug IN ('contact-de', 'contact-fr', 'contact-es');
