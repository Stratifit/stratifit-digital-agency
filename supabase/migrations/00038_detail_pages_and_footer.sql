-- Migration: 00038_detail_pages_and_footer
-- Description: Purpose-built table for CMS-editable detail pages (privacy,
--              terms, cookie policy, imprint, careers), plus a footer
--              restructure to the Platform / Company / Legal link structure.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Detail Pages
-- Structured content blocks: heading | paragraph | note
-- =============================================================================

CREATE TABLE public.detail_pages (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 text NOT NULL UNIQUE,
  title_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  subtitle_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  content_translations jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_visible           boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.detail_pages IS 'CMS-editable detail pages (privacy, terms, cookie policy, imprint, careers).';

CREATE TRIGGER set_detail_pages_updated_at
  BEFORE UPDATE ON public.detail_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.detail_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read visible detail_pages"
  ON public.detail_pages FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "admins can manage detail_pages"
  ON public.detail_pages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- Seed (current page copy, English bootstrap; full 4-language content in seed.sql)
-- =============================================================================

INSERT INTO public.detail_pages (slug, title_translations, subtitle_translations, content_translations, is_visible)
VALUES
  ('privacy',
   '{"en": "Privacy Policy"}'::jsonb,
   '{"en": "Last updated: August 2026"}'::jsonb,
   '[
     {"type": "paragraph", "text_translations": {"en": "This privacy policy explains how Stratifit collects, uses, and protects personal information submitted through this website."}},
     {"type": "heading", "text_translations": {"en": "1. Data we collect"}},
     {"type": "paragraph", "text_translations": {"en": "When you contact us, we collect the details you provide: name, email, phone, company, and message content. We also collect basic technical data such as the pages you visit."}},
     {"type": "heading", "text_translations": {"en": "2. How we use data"}},
     {"type": "paragraph", "text_translations": {"en": "We use your information to respond to enquiries, qualify leads, and improve our services. We do not sell your personal data."}},
     {"type": "heading", "text_translations": {"en": "3. Legal basis"}},
     {"type": "paragraph", "text_translations": {"en": "We process personal data based on your consent and on our legitimate interest in operating our business and responding to enquiries."}},
     {"type": "heading", "text_translations": {"en": "4. Your rights"}},
     {"type": "paragraph", "text_translations": {"en": "You may request access to, correction of, or deletion of your personal data at any time. Contact us to exercise these rights."}},
     {"type": "heading", "text_translations": {"en": "5. Contact"}},
     {"type": "paragraph", "text_translations": {"en": "For privacy questions, contact us through the contact page or email the address listed on this website."}},
     {"type": "note", "text_translations": {"en": "Note: This placeholder must be reviewed and finalized by qualified legal counsel before launch."}}
   ]'::jsonb,
   true),
  ('terms-conditions',
   '{"en": "Terms of Service"}'::jsonb,
   '{"en": "Last updated: August 2026"}'::jsonb,
   '[
     {"type": "paragraph", "text_translations": {"en": "These terms govern the use of the Stratifit website and its services. By accessing this website, you agree to these terms."}},
     {"type": "heading", "text_translations": {"en": "1. Services"}},
     {"type": "paragraph", "text_translations": {"en": "Stratifit provides digital agency services including brand design, website development, AI & automation, and growth marketing."}},
     {"type": "heading", "text_translations": {"en": "2. Intellectual property"}},
     {"type": "paragraph", "text_translations": {"en": "All content, designs, and materials delivered remain the intellectual property of their respective owners unless agreed otherwise in writing."}},
     {"type": "heading", "text_translations": {"en": "3. Limitation of liability"}},
     {"type": "paragraph", "text_translations": {"en": "Stratifit is not liable for indirect or consequential damages arising from the use of this website or its services."}},
     {"type": "heading", "text_translations": {"en": "4. Contact"}},
     {"type": "paragraph", "text_translations": {"en": "For questions about these terms, contact us through the contact page."}},
     {"type": "note", "text_translations": {"en": "Note: This placeholder must be reviewed and finalized by qualified legal counsel before launch."}}
   ]'::jsonb,
   true),
  ('cookie-policy',
   '{"en": "Cookie Policy"}'::jsonb,
   '{"en": "Last updated: August 2026"}'::jsonb,
   '[
     {"type": "paragraph", "text_translations": {"en": "This cookie policy explains how Stratifit uses cookies and similar technologies on this website."}},
     {"type": "heading", "text_translations": {"en": "1. What are cookies"}},
     {"type": "paragraph", "text_translations": {"en": "Cookies are small text files stored on your device that help websites function and improve your browsing experience."}},
     {"type": "heading", "text_translations": {"en": "2. How we use cookies"}},
     {"type": "paragraph", "text_translations": {"en": "We use essential cookies for basic site functionality and, where enabled, analytics cookies to understand how visitors use the site."}},
     {"type": "heading", "text_translations": {"en": "3. Managing cookies"}},
     {"type": "paragraph", "text_translations": {"en": "You can control or delete cookies through your browser settings at any time. Disabling cookies may affect site functionality."}},
     {"type": "heading", "text_translations": {"en": "4. Contact"}},
     {"type": "paragraph", "text_translations": {"en": "For questions about this cookie policy, contact us through the contact page."}},
     {"type": "note", "text_translations": {"en": "Note: This placeholder must be reviewed and finalized by qualified legal counsel before launch."}}
   ]'::jsonb,
   true),
  ('imprint',
   '{"en": "Imprint"}'::jsonb,
   '{"en": "Legal notice / Impressum"}'::jsonb,
   '[
     {"type": "heading", "text_translations": {"en": "Company"}},
     {"type": "paragraph", "text_translations": {"en": "Stratifit\nAddress to be provided"}},
     {"type": "heading", "text_translations": {"en": "Contact"}},
     {"type": "paragraph", "text_translations": {"en": "Email: hello@stratifit.com"}},
     {"type": "heading", "text_translations": {"en": "Represented by"}},
     {"type": "paragraph", "text_translations": {"en": "Managing director / owner to be provided."}},
     {"type": "heading", "text_translations": {"en": "Responsible for content"}},
     {"type": "paragraph", "text_translations": {"en": "To be provided."}},
     {"type": "note", "text_translations": {"en": "Note: This placeholder must be completed with the legally required company information before launch."}}
   ]'::jsonb,
   true),
  ('careers',
   '{"en": "Careers"}'::jsonb,
   '{"en": "Join the Stratifit team"}'::jsonb,
   '[
     {"type": "paragraph", "text_translations": {"en": "We are building a team of strategists, designers, engineers, and marketers obsessed with craft — people who want to build digital experiences that move businesses forward."}},
     {"type": "heading", "text_translations": {"en": "Why Stratifit"}},
     {"type": "paragraph", "text_translations": {"en": "You will work on premium projects with modern technology, collaborate directly with leadership, and see the real impact of your work on client outcomes."}},
     {"type": "heading", "text_translations": {"en": "How we work"}},
     {"type": "paragraph", "text_translations": {"en": "We are async-first: tight specs, short meetings, and high trust. We hire for seniority, autonomy, and judgment."}},
     {"type": "heading", "text_translations": {"en": "Open positions"}},
     {"type": "paragraph", "text_translations": {"en": "We hire on a rolling basis for design, engineering, and growth roles. If you are exceptional at what you do, we want to hear from you."}},
     {"type": "heading", "text_translations": {"en": "Apply"}},
     {"type": "paragraph", "text_translations": {"en": "Send your portfolio or CV through the contact page and we will get back to you within a few days."}}
   ]'::jsonb,
   true)
ON CONFLICT (slug) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  subtitle_translations = EXCLUDED.subtitle_translations,
  content_translations = EXCLUDED.content_translations,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Footer restructure
-- Groups: Platform / Company / Legal with the mockup link set.
-- Existing links are replaced by the new structure (approved change).
-- =============================================================================

-- The stable group IDs below are referenced by the link seed; create them
-- here so fresh database resets work (seed.sql runs after migrations).
INSERT INTO public.footer_groups (id, title_translations, display_order, is_visible)
VALUES
  ('20000000-0000-4000-8000-000000000001', '{"en": "Platform", "de": "Plattform", "fr": "Plateforme", "es": "Plataforma"}'::jsonb, 1, true),
  ('20000000-0000-4000-8000-000000000002', '{"en": "Company", "de": "Unternehmen", "fr": "Entreprise", "es": "Empresa"}'::jsonb, 2, true),
  ('20000000-0000-4000-8000-000000000003', '{"en": "Legal", "de": "Rechtliches", "fr": "Mentions légales", "es": "Legal"}'::jsonb, 3, true)
ON CONFLICT (id) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

UPDATE public.footer_groups
SET title_translations = '{"en": "Platform", "de": "Plattform", "fr": "Plateforme", "es": "Plataforma"}'::jsonb
WHERE id = '20000000-0000-4000-8000-000000000001';

DELETE FROM public.footer_links;

INSERT INTO public.footer_links (id, group_id, label_translations, href, is_external, display_order, is_visible)
VALUES
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '{"en": "Home", "de": "Startseite", "fr": "Accueil", "es": "Inicio"}'::jsonb, '/', false, 1, true),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '{"en": "Services", "de": "Leistungen", "fr": "Services", "es": "Servicios"}'::jsonb, '/services', false, 2, true),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', '{"en": "Work", "de": "Arbeiten", "fr": "Réalisations", "es": "Proyectos"}'::jsonb, '/work', false, 3, true),
  ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', '{"en": "Insights", "de": "Einblicke", "fr": "Insights", "es": "Perspectivas"}'::jsonb, '/insights', false, 4, true),
  ('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000002', '{"en": "About", "de": "Über uns", "fr": "À propos", "es": "Nosotros"}'::jsonb, '/about', false, 1, true),
  ('30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000002', '{"en": "Careers", "de": "Karriere", "fr": "Carrières", "es": "Carreras"}'::jsonb, '/careers', false, 2, true),
  ('30000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000002', '{"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}'::jsonb, '/contact', false, 3, true),
  ('30000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000003', '{"en": "Privacy Policy", "de": "Datenschutzerklärung", "fr": "Politique de confidentialité", "es": "Política de privacidad"}'::jsonb, '/privacy', false, 1, true),
  ('30000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000003', '{"en": "Terms of Service", "de": "Nutzungsbedingungen", "fr": "Conditions d''utilisation", "es": "Términos del servicio"}'::jsonb, '/terms-conditions', false, 2, true),
  ('30000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000003', '{"en": "Cookie Policy", "de": "Cookie-Richtlinie", "fr": "Politique de cookies", "es": "Política de cookies"}'::jsonb, '/cookie-policy', false, 3, true)
ON CONFLICT (id) DO UPDATE SET
  group_id = EXCLUDED.group_id,
  label_translations = EXCLUDED.label_translations,
  href = EXCLUDED.href,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP POLICY IF EXISTS "admins can manage detail_pages" ON public.detail_pages;
-- DROP POLICY IF EXISTS "public can read visible detail_pages" ON public.detail_pages;
-- DROP TRIGGER IF EXISTS set_detail_pages_updated_at ON public.detail_pages;
-- DROP TABLE IF EXISTS public.detail_pages;
-- (Footer links are re-seeded via seed.sql.)
