-- Migration: 00037_acquisition_page_section_labels
-- Description: CMS-editable labels for the Buy a Business (/buy-business) page.
--              Adds optional CTA fields to section_settings and seeds two new
--              sections: the "Explore by Niche" heading and the closing CTA block.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Schema: optional CTA fields on section_settings
-- =============================================================================

ALTER TABLE public.section_settings
  ADD COLUMN IF NOT EXISTS cta_label_translations jsonb,
  ADD COLUMN IF NOT EXISTS cta_url text;

ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;
ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','final-cta','trusted-by','acquisition','acquisition-niches','acquisition-cta'));

-- =============================================================================
-- Seed: Explore by Niche heading
-- =============================================================================

INSERT INTO public.section_settings (section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, is_visible, display_order)
VALUES (
  'acquisition-niches',
  'Acquisition — Niche Filter',
  '{"en": "", "de": "", "fr": "", "es": ""}'::jsonb,
  '{"en": "Explore by", "de": "Stöbern nach", "fr": "Explorer par", "es": "Explorar por"}'::jsonb,
  '{"en": "Niche", "de": "Nische", "fr": "Niche", "es": "Nicho"}'::jsonb,
  '{"en": "Select a niche to see available businesses for acquisition.", "de": "Wählen Sie eine Nische, um verfügbare Unternehmen zur Übernahme zu sehen.", "fr": "Sélectionnez une niche pour voir les sociétés disponibles à l''acquisition.", "es": "Selecciona un nicho para ver los negocios disponibles para adquisición."}'::jsonb,
  true,
  56
)
ON CONFLICT (section_key) DO UPDATE SET
  label = EXCLUDED.label,
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  description_translations = EXCLUDED.description_translations,
  is_visible = EXCLUDED.is_visible,
  display_order = EXCLUDED.display_order;

-- =============================================================================
-- Seed: Closing CTA block
-- =============================================================================

INSERT INTO public.section_settings (section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, cta_label_translations, cta_url, is_visible, display_order)
VALUES (
  'acquisition-cta',
  'Acquisition — Final CTA',
  '{"en": "", "de": "", "fr": "", "es": ""}'::jsonb,
  '{"en": "Ready to Own a Business?", "de": "Bereit, ein Unternehmen zu kaufen?", "fr": "Prêt à posséder une entreprise ?", "es": "¿Listo para ser dueño de un negocio?"}'::jsonb,
  '{}'::jsonb,
  '{"en": "Our team will guide you through every step of the acquisition process — from due diligence to transition.", "de": "Unser Team begleitet Sie durch jeden Schritt des Übernahmeprozesses — von der Due Diligence bis zum Übergang.", "fr": "Notre équipe vous accompagne à chaque étape du processus d''acquisition — de la due diligence à la transition.", "es": "Nuestro equipo te guiará en cada paso del proceso de adquisición: desde la debida diligencia hasta la transición."}'::jsonb,
  '{"en": "Schedule a Consultation", "de": "Beratung vereinbaren", "fr": "Planifier une consultation", "es": "Programar una consulta"}'::jsonb,
  '/contact',
  true,
  57
)
ON CONFLICT (section_key) DO UPDATE SET
  label = EXCLUDED.label,
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  description_translations = EXCLUDED.description_translations,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url,
  is_visible = EXCLUDED.is_visible,
  display_order = EXCLUDED.display_order;

-- =============================================================================
-- Rollback
-- =============================================================================
-- DELETE FROM public.section_settings WHERE section_key IN ('acquisition-niches', 'acquisition-cta');
-- ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;
-- ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','final-cta','trusted-by','acquisition'));
-- ALTER TABLE public.section_settings DROP COLUMN IF EXISTS cta_label_translations;
-- ALTER TABLE public.section_settings DROP COLUMN IF EXISTS cta_url;
