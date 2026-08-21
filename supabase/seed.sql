-- Seed Data: Stratifit Digital Agency Platform
-- Description: Predictable development content for all major content types.
-- Safe to rerun: Uses ON CONFLICT for idempotency.
-- No production secrets included.

-- =============================================================================
-- Site Settings (Singleton)
-- =============================================================================

INSERT INTO public.cookie_settings (
  singleton_key,
  banner_title_translations,
  banner_text_translations,
  accept_all_label_translations,
  essential_only_label_translations,
  settings_label_translations,
  save_preferences_label_translations,
  policy_url,
  categories
)
VALUES (
  true,
  '{"en": "Cookie Preferences"}'::jsonb,
  '{"en": "We use cookies to enhance your browsing experience, analyze site traffic, and deliver personalized content. By clicking “Accept All”, you consent to our use of cookies. You can learn more in our"}'::jsonb,
  '{"en": "Accept All"}'::jsonb,
  '{"en": "Essential Only"}'::jsonb,
  '{"en": "Settings"}'::jsonb,
  '{"en": "Save Preferences"}'::jsonb,
  '/cookie-policy',
  '[
    {
      "key": "essential",
      "essential": true,
      "enabled": true,
      "name_translations": { "en": "Essential cookies" },
      "description_translations": { "en": "Required for the website to function. Cannot be switched off." }
    },
    {
      "key": "analytics",
      "essential": false,
      "enabled": true,
      "name_translations": { "en": "Analytics cookies" },
      "description_translations": { "en": "Help us understand how visitors interact with the site. All data is aggregated and anonymous." }
    },
    {
      "key": "marketing",
      "essential": false,
      "enabled": false,
      "name_translations": { "en": "Marketing cookies" },
      "description_translations": { "en": "Used to show relevant advertising. Currently not in use unless you consent." }
    }
  ]'::jsonb
)
ON CONFLICT (singleton_key) DO NOTHING;

-- =============================================================================

INSERT INTO public.site_settings (singleton_key, site_name, site_description_translations, contact_email, default_locale, supported_locales, default_seo)
VALUES (
  true,
  'Stratifit',
  '{"en": "Premium digital agency specializing in brand design, website development, AI automation, and growth marketing.", "de": "Premium-Digitalagentur spezialisiert auf Branding, Webentwicklung, KI-Automatisierung und Growth Marketing.", "fr": "Agence digitale premium spécialisée en design de marque, développement web, automatisation IA et marketing de croissance.", "es": "Agencia digital premium especializada en diseño de marca, desarrollo web, automatización de IA y marketing de crecimiento."}'::jsonb,
  'hello@stratifit.com',
  'en',
  ARRAY['en', 'de', 'fr', 'es'],
  '{"en": {"title": "Stratifit Digital Agency", "description": "Stratifit is a premium multilingual digital agency delivering websites, web applications, e-commerce, and AI solutions."}}'::jsonb
)
ON CONFLICT (singleton_key) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_description_translations = EXCLUDED.site_description_translations,
  contact_email = EXCLUDED.contact_email,
  default_locale = EXCLUDED.default_locale,
  supported_locales = EXCLUDED.supported_locales,
  default_seo = EXCLUDED.default_seo;

-- =============================================================================
-- Announcement Bar (Singleton)
-- =============================================================================

INSERT INTO public.announcement_bar (singleton_key, message_translations, slides, link_label_translations, link_url, is_enabled, variant)
VALUES (
  true,
  '{"en": "We are now offering AI-powered business automation. Learn more.", "de": "Wir bieten jetzt KI-gestützte Geschäftsautomatisierung an. Erfahren Sie mehr.", "fr": "Nous proposons désormais l automatisation d entreprises par l IA. En savoir plus.", "es": "Ahora ofrecemos automatización empresarial con IA. Más información."}'::jsonb,
  '[
    {"en": "We are now offering AI-powered business automation.", "de": "Wir bieten jetzt KI-gestützte Geschäftsautomatisierung an.", "fr": "Nous proposons désormais l automatisation d entreprises par l IA.", "es": "Ahora ofrecemos automatización empresarial con IA."},
    {"en": "New: multilingual websites in four languages.", "de": "Neu: mehrsprachige Websites in vier Sprachen.", "fr": "Nouveau : sites web multilingues en quatre langues.", "es": "Nuevo: sitios web multilingües en cuatro idiomas."},
    {"en": "Book a free strategy call today.", "de": "Buchen Sie noch heute ein kostenloses Strategiegespräch.", "fr": "Réservez un appel stratégie gratuit dès aujourd hui.", "es": "Reserva una llamada estratégica gratuita hoy."}
  ]'::jsonb,
  '{"en": "Learn More", "de": "Mehr erfahren", "fr": "En savoir plus", "es": "Más información"}'::jsonb,
  '/acquisition',
  true,
  'primary'
)
ON CONFLICT (singleton_key) DO UPDATE SET
  message_translations = EXCLUDED.message_translations,
  slides = EXCLUDED.slides,
  link_label_translations = EXCLUDED.link_label_translations,
  link_url = EXCLUDED.link_url,
  is_enabled = EXCLUDED.is_enabled,
  variant = EXCLUDED.variant;

-- =============================================================================
-- Navigation Items (Header)
-- Stable UUIDs for idempotent re-runs.
-- =============================================================================

INSERT INTO public.navigation_items (id, location, label_translations, href, display_order, is_visible)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'header', '{"en": "Home", "de": "Startseite", "fr": "Accueil", "es": "Inicio"}'::jsonb, '/', 1, true),
  ('10000000-0000-4000-8000-000000000002', 'header', '{"en": "Services", "de": "Leistungen", "fr": "Services", "es": "Servicios"}'::jsonb, '/services', 2, true),
  ('10000000-0000-4000-8000-000000000003', 'header', '{"en": "Work", "de": "Arbeiten", "fr": "Réalisations", "es": "Proyectos"}'::jsonb, '/work', 3, true),
  ('10000000-0000-4000-8000-000000000004', 'header', '{"en": "Insights", "de": "Einblicke", "fr": "Insights", "es": "Perspectivas"}'::jsonb, '/insights', 4, true),
  ('10000000-0000-4000-8000-000000000005', 'header', '{"en": "About", "de": "Über uns", "fr": "À propos", "es": "Nosotros"}'::jsonb, '/about', 5, true),
  ('10000000-0000-4000-8000-000000000006', 'header', '{"en": "Buy a Business", "de": "Unternehmen kaufen", "fr": "Acheter une entreprise", "es": "Comprar un negocio"}'::jsonb, '/buy-business', 6, true),
  ('10000000-0000-4000-8000-000000000007', 'header', '{"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}'::jsonb, '/contact', 7, true)
ON CONFLICT (id) DO UPDATE SET
  label_translations = EXCLUDED.label_translations,
  href = EXCLUDED.href,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Section Settings
-- Editable headings (eyebrow, title, highlight, description) for homepage sections.
-- =============================================================================

INSERT INTO public.section_settings
  (section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, is_visible, display_order)
VALUES
  ('services', 'Services', '{"en": "Services", "de": "Leistungen", "fr": "Services", "es": "Servicios"}'::jsonb, '{"en": "Our Core", "de": "Unsere Kernleistungen", "fr": "Nos Services Principaux", "es": "Nuestros Servicios Principales"}'::jsonb, '{"en": "Services", "de": "", "fr": "", "es": ""}'::jsonb, '{"en": "Strategic solutions engineered to scale your digital presence with precision and luxury.", "de": "Strategische Lösungen, die Ihre digitale Präsenz präzise und hochwertig skalieren.", "fr": "Des solutions stratégiques conçues pour développer votre présence numérique avec précision et luxe.", "es": "Soluciones estratégicas diseñadas para escalar su presencia digital con precisión y lujo."}'::jsonb, true, 10),
  ('process', 'Process', '{"en": "Process", "de": "Prozess", "fr": "Processus", "es": "Proceso"}'::jsonb, '{"en": "How We", "de": "Wie wir", "fr": "Comment nous", "es": "Cómo"}'::jsonb, '{"en": "Work", "de": "arbeiten", "fr": "travaillons", "es": "trabajamos"}'::jsonb, '{"en": "A proven framework that takes you from idea to scale, predictably and efficiently.", "de": "Ein bewährtes Rahmenwerk, das Sie von der Idee bis zur Skalierung führt, vorhersehbar und effizient.", "fr": "Un cadre éprouvé qui vous mène de l''idée à l''échelle, de manière prévisible et efficace.", "es": "Un marco probado que le lleva de la idea a la escala, de forma predecible y eficiente."}'::jsonb, true, 20),
  ('why-choose-us', 'Why Choose Us', '{"en": "Why Us", "de": "Warum wir", "fr": "Pourquoi nous", "es": "Por qué nosotros"}'::jsonb, '{"en": "Not Just Another", "de": "Nicht nur eine weitere", "fr": "Pas juste une autre", "es": "No solo otra"}'::jsonb, '{"en": "Agency", "de": "Agentur", "fr": "agence", "es": "agencia"}'::jsonb, '{"en": "We build digital assets that drive valuation and market authority, not just websites.", "de": "Wir bauen digitale Assets, die Bewertung und Marktautorität steigern, nicht nur Websites.", "fr": "Nous créons des actifs numériques qui augmentent la valorisation et l''autorité de marché, pas seulement des sites web.", "es": "Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web."}'::jsonb, true, 30),
  ('insights', 'Insights & Expertise', '{"en": "Knowledge", "de": "Wissen", "fr": "Savoir", "es": "Conocimiento"}'::jsonb, '{"en": "Insights &", "de": "Einblicke &", "fr": "Insights &", "es": "Perspectivas y"}'::jsonb, '{"en": "Expertise", "de": "Expertise", "fr": "Expertise", "es": "Expertise"}'::jsonb, '{"en": "Thought leadership, industry perspectives, and actionable strategies from our team of strategists, designers, and engineers.", "de": "Thought Leadership, Branchenperspektiven und umsetzbare Strategien von unserem Team aus Strategen, Designern und Ingenieuren.", "fr": "Leadership éclairé, perspectives sectorielles et stratégies concrètes de notre équipe de stratèges, designers et ingénieurs.", "es": "Liderazgo de pensamiento, perspectivas de la industria y estrategias accionables de nuestro equipo de estrategas, diseñadores e ingenieros."}'::jsonb, true, 40),
  ('portfolio', 'Portfolio', '{"en": "Portfolio", "de": "Portfolio", "fr": "Portfolio", "es": "Portafolio"}'::jsonb, '{"en": "Our", "de": "Unsere", "fr": "Nos", "es": "Nuestros"}'::jsonb, '{"en": "Work", "de": "Arbeiten", "fr": "Réalisations", "es": "Proyectos"}'::jsonb, '{"en": "We craft digital experiences that define industries and elevate brands through precision and creativity.", "de": "Wir gestalten digitale Erlebnisse, die Branchen definieren und Marken durch Präzision und Kreativität aufwerten.", "fr": "Nous créons des expériences numériques qui définissent les industries et élèvent les marques grâce à la précision et la créativité.", "es": "Creamos experiencias digitales que definen industrias y elevan marcas a través de la precisión y la creatividad."}'::jsonb, true, 50),
  ('testimonials', 'Testimonials', '{"en": "Testimonials", "de": "Referenzen", "fr": "Témoignages", "es": "Testimonios"}'::jsonb, '{"en": "What Our Clients", "de": "Was unsere Kunden", "fr": "Ce que disent nos clients", "es": "Lo que dicen nuestros clientes"}'::jsonb, '{"en": "Say", "de": "sagen", "fr": "", "es": ""}'::jsonb, '{"en": "Don''t take our word for it, hear from the brands we''ve helped scale.", "de": "Verlassen Sie sich nicht nur auf unser Wort, hören Sie, was die Marken sagen, denen wir zum Wachstum verholfen haben.", "fr": "Ne nous croyez pas sur parole, écoutez les marques que nous avons aidées à se développer.", "es": "No confíe solo en nuestra palabra: escuche a las marcas que hemos ayudado a escalar."}'::jsonb, true, 60),
  ('pricing', 'Pricing', '{"en": "Pricing", "de": "Preise", "fr": "Tarifs", "es": "Precios"}'::jsonb, '{"en": "Service", "de": "Service", "fr": "Forfaits de", "es": "Paquetes de"}'::jsonb, '{"en": "Packages", "de": "Pakete", "fr": "services", "es": "servicios"}'::jsonb, '{"en": "Transparent pricing for every stage of growth. Start where you are and scale with confidence.", "de": "Transparente Preise für jede Wachstumsphase. Starten Sie dort, wo Sie sind, und skalieren Sie mit Zuversicht.", "fr": "Des tarifs transparents pour chaque étape de croissance. Commencez là où vous êtes et développez-vous en confiance.", "es": "Precios transparentes para cada etapa de crecimiento. Empiece donde está y escale con confianza."}'::jsonb, true, 70),
  ('faq', 'FAQ', '{"en": "Support", "de": "Support", "fr": "Support", "es": "Soporte"}'::jsonb, '{"en": "Frequently Asked", "de": "Häufig gestellte", "fr": "Questions", "es": "Preguntas"}'::jsonb, '{"en": "Questions", "de": "Fragen", "fr": "fréquentes", "es": "frecuentes"}'::jsonb, '{"en": "Clear answers to the most common questions we hear from clients.", "de": "Klare Antworten auf die häufigsten Fragen, die wir von Kunden hören.", "fr": "Des réponses claires aux questions les plus courantes que nous recevons de nos clients.", "es": "Respuestas claras a las preguntas más comunes que recibimos de los clientes."}'::jsonb, true, 80),
  ('contact', 'Contact', '{"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}'::jsonb, '{"en": "Let''s Talk", "de": "Sprechen wir", "fr": "Parlons-en", "es": "Hablemos"}'::jsonb, '{}'::jsonb, '{"en": "Ready to start your project? Fill out the form and we''ll get back to you within 24 hours.", "de": "Bereit, Ihr Projekt zu starten? Füllen Sie das Formular aus, wir melden uns innerhalb von 24 Stunden.", "fr": "Prêt à lancer votre projet ? Remplissez le formulaire et nous vous répondrons sous 24 heures.", "es": "¿Listo para empezar su proyecto? Complete el formulario y le responderemos en 24 horas."}'::jsonb, true, 95)
ON CONFLICT (section_key) DO UPDATE SET
  label = EXCLUDED.label,
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  description_translations = EXCLUDED.description_translations,
  is_visible = EXCLUDED.is_visible,
  display_order = EXCLUDED.display_order;

-- =============================================================================
-- Buy a Business page sections (Explore by Niche heading + closing CTA)
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

INSERT INTO public.section_settings (section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, cta_label_translations, cta_url, is_visible, display_order)
VALUES (
  'acquisition-cta',
  'Acquisition — Final CTA',
  '{"en": "", "de": "", "fr": "", "es": ""}'::jsonb,
  '{"en": "Ready to Own a Business?", "de": "Bereit, ein Unternehmen zu kaufen?", "fr": "Prêt à posséder une entreprise ?", "es": "¿Listo para ser dueño de un negocio?"}'::jsonb,
  '{}'::jsonb,
  '{"en": "We''ll guide you from due diligence to transition.", "de": "Wir begleiten Sie von der Due Diligence bis zum Übergang.", "fr": "Nous vous accompagnons de la due diligence à la transition.", "es": "Te guiamos desde la debida diligencia hasta la transición."}'::jsonb,
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
-- Tech Stack section (scrolling marquee between the hero and Services)
-- =============================================================================

INSERT INTO public.section_settings (section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, tech_stack, is_visible, display_order)
VALUES (
  'tech-stack',
  'Tech Stack',
  '{"en": "", "de": "", "fr": "", "es": ""}'::jsonb,
  '{"en": "Our", "de": "Unser", "fr": "Notre", "es": "Nuestro"}'::jsonb,
  '{"en": "Tech Stack", "de": "Tech-Stack", "fr": "stack technique", "es": "stack tecnológico"}'::jsonb,
  '{"en": "We build with trusted, modern technologies.", "de": "Wir bauen mit vertrauenswürdigen, modernen Technologien.", "fr": "Nous construisons avec des technologies modernes et éprouvées.", "es": "Construimos con tecnologías modernas y confiables."}'::jsonb,
  '[{"name": "Tailwind CSS", "icon": "brush"}, {"name": "Framer Motion", "icon": "zap"}, {"name": "GSAP", "icon": "zap"}, {"name": "Next.js", "icon": "code"}, {"name": "React", "icon": "atom"}, {"name": "TypeScript", "icon": "code"}]'::jsonb,
  true,
  5
)
ON CONFLICT (section_key) DO UPDATE SET
  label = EXCLUDED.label,
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  description_translations = EXCLUDED.description_translations,
  tech_stack = EXCLUDED.tech_stack,
  is_visible = EXCLUDED.is_visible,
  display_order = EXCLUDED.display_order;

-- =============================================================================
-- Footer Groups
-- Stable UUIDs for idempotent re-runs.
-- =============================================================================

INSERT INTO public.footer_groups (id, title_translations, display_order, is_visible)
VALUES
  ('20000000-0000-4000-8000-000000000001', '{"en": "Platform", "de": "Plattform", "fr": "Plateforme", "es": "Plataforma"}'::jsonb, 1, true),
  ('20000000-0000-4000-8000-000000000002', '{"en": "Company", "de": "Unternehmen", "fr": "Entreprise", "es": "Empresa"}'::jsonb, 2, true),
  ('20000000-0000-4000-8000-000000000003', '{"en": "Legal", "de": "Rechtliches", "fr": "Mentions légales", "es": "Legal"}'::jsonb, 3, true)
ON CONFLICT (id) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Footer Links
-- Stable UUIDs referencing the stable footer group IDs.
-- =============================================================================

INSERT INTO public.footer_links (id, group_id, label_translations, href, is_external, display_order, is_visible)
VALUES
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '{"en": "Home", "de": "Startseite", "fr": "Accueil", "es": "Inicio"}'::jsonb, '/', false, 1, true),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '{"en": "Services", "de": "Leistungen", "fr": "Services", "es": "Servicios"}'::jsonb, '/services', false, 2, true),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', '{"en": "Work", "de": "Arbeiten", "fr": "Réalisations", "es": "Proyectos"}'::jsonb, '/work', false, 3, true),
  ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', '{"en": "Insights", "de": "Einblicke", "fr": "Insights", "es": "Perspectivas"}'::jsonb, '/insights', false, 4, true),
  ('30000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000001', '{"en": "Buy a Business", "de": "Unternehmen kaufen", "fr": "Acheter une entreprise", "es": "Comprar un negocio"}'::jsonb, '/buy-business', false, 5, true),
  ('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000002', '{"en": "About", "de": "Über uns", "fr": "À propos", "es": "Nosotros"}'::jsonb, '/about', false, 1, true),
  ('30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000002', '{"en": "Careers", "de": "Karriere", "fr": "Carrières", "es": "Carreras"}'::jsonb, '/careers', false, 2, true),
  ('30000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000002', '{"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}'::jsonb, '/contact', false, 3, true),
  ('30000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000002', '{"en": "Pricing", "de": "Preise", "fr": "Tarifs", "es": "Precios"}'::jsonb, '/#pricing', false, 4, true),
  ('30000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000003', '{"en": "Privacy Policy", "de": "Datenschutzerklärung", "fr": "Politique de confidentialité", "es": "Política de privacidad"}'::jsonb, '/privacy', false, 1, true),
  ('30000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000003', '{"en": "Terms of Service", "de": "Nutzungsbedingungen", "fr": "Conditions d''utilisation", "es": "Términos del servicio"}'::jsonb, '/terms-conditions', false, 2, true),
  ('30000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000003', '{"en": "Cookie Policy", "de": "Cookie-Richtlinie", "fr": "Politique de cookies", "es": "Política de cookies"}'::jsonb, '/cookie-policy', false, 3, true),
  ('30000000-0000-4000-8000-000000000013', '20000000-0000-4000-8000-000000000003', '{"en": "Imprint", "de": "Impressum", "fr": "Mentions légales", "es": "Aviso legal"}'::jsonb, '/imprint', false, 4, true),
  ('30000000-0000-4000-8000-000000000014', '20000000-0000-4000-8000-000000000002', '{"en": "Hiring", "de": "Karriere bei uns", "fr": "Recrutement", "es": "Contratación"}'::jsonb, '/hiring', false, 5, true)
ON CONFLICT (id) DO UPDATE SET
  group_id = EXCLUDED.group_id,
  label_translations = EXCLUDED.label_translations,
  href = EXCLUDED.href,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Detail Pages (Privacy, Terms, Cookie Policy, Imprint, Careers)
-- Card-style content: icon headings, subheadings, lists, panels, and inline
-- links ([label](url)), all in 4 languages. Generated from migration 00040.
-- =============================================================================

INSERT INTO public.detail_pages (slug, eyebrow_translations, title_translations, description_translations, subtitle_translations, content_translations, is_visible)
VALUES
  ('privacy',
   '{"en": "Legal", "de": "Rechtliches", "fr": "Juridique", "es": "Legal"}'::jsonb,
   '{"en": "Privacy Policy", "de": "Datenschutzerklärung", "fr": "Politique de confidentialité", "es": "Política de privacidad"}'::jsonb,
   '{"en": "Your privacy matters to us. This policy explains how Stratifit collects, uses, and protects your personal information.", "de": "Ihre Privatsphäre ist uns wichtig. Diese Richtlinie erläutert, wie Stratifit Ihre persönlichen Daten erhebt, verwendet und schützt.", "fr": "Votre vie privée compte pour nous. Cette politique explique comment Stratifit collecte, utilise et protège vos informations personnelles.", "es": "Su privacidad es importante para nosotros. Esta política explica cómo Stratifit recopila, utiliza y protege su información personal."}'::jsonb,
   '{"en": "Last updated: July 2026", "de": "Zuletzt aktualisiert: Juli 2026", "fr": "Dernière mise à jour : juillet 2026", "es": "Última actualización: julio de 2026"}'::jsonb,
   '[
  {"type": "heading", "icon": "file-text", "text_translations": {"en": "1. Introduction", "de": "1. Einleitung", "fr": "1. Introduction", "es": "1. Introducción"}},
  {"type": "paragraph", "text_translations": {"en": "Stratifit (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [stratifit.com](https://stratifit.com) or use any of our digital services. Please read this policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy.", "de": "Stratifit („wir“ oder „uns“) verpflichtet sich zum Schutz Ihrer Privatsphäre. Diese Datenschutzerklärung erläutert, wie wir Ihre Informationen erfassen, verwenden, offenlegen und schützen, wenn Sie unsere Website [stratifit.com](https://stratifit.com) besuchen oder unsere digitalen Dienste nutzen. Bitte lesen Sie diese Richtlinie sorgfältig. Durch den Zugriff auf oder die Nutzung unserer Dienste bestätigen Sie, dass Sie diese Datenschutzerklärung gelesen, verstanden und ihr zugestimmt haben.", "fr": "Stratifit (« nous », « notre » ou « nos ») s''engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web [stratifit.com](https://stratifit.com) ou utilisez l''un de nos services numériques. Veuillez lire cette politique attentivement. En accédant à nos services ou en les utilisant, vous reconnaissez avoir lu, compris et accepté les termes de cette politique de confidentialité.", "es": "Stratifit («nosotros», «nuestro» o «nos») se compromete a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos su información cuando visita nuestro sitio web [stratifit.com](https://stratifit.com) o utiliza cualquiera de nuestros servicios digitales. Lea esta política atentamente. Al acceder o utilizar nuestros servicios, reconoce que ha leído, comprendido y aceptado los términos de esta Política de Privacidad."}},
  {"type": "heading", "icon": "eye", "text_translations": {"en": "2. Information We Collect", "de": "2. Welche Informationen wir erfassen", "fr": "2. Informations que nous collectons", "es": "2. Información que recopilamos"}},
  {"type": "subheading", "text_translations": {"en": "Personal Information", "de": "Persönliche Informationen", "fr": "Informations personnelles", "es": "Información personal"}},
  {"type": "paragraph", "text_translations": {"en": "When you contact us through our website forms, we may collect your name, email address, phone number, company name, and any other information you voluntarily provide in your message.", "de": "Wenn Sie uns über die Formulare auf unserer Website kontaktieren, können wir Ihren Namen, Ihre E-Mail-Adresse, Ihre Telefonnummer, Ihren Firmennamen und alle anderen Informationen erfassen, die Sie in Ihrer Nachricht freiwillig angeben.", "fr": "Lorsque vous nous contactez via les formulaires de notre site web, nous pouvons collecter votre nom, votre adresse e-mail, votre numéro de téléphone, le nom de votre entreprise et toute autre information que vous fournissez volontairement dans votre message.", "es": "Cuando nos contacta a través de los formularios de nuestro sitio web, podemos recopilar su nombre, dirección de correo electrónico, número de teléfono, nombre de la empresa y cualquier otra información que proporcione voluntariamente en su mensaje."}},
  {"type": "subheading", "text_translations": {"en": "Automatically Collected Information", "de": "Automatisch erfasste Informationen", "fr": "Informations collectées automatiquement", "es": "Información recopilada automáticamente"}},
  {"type": "paragraph", "text_translations": {"en": "When you visit our website, we automatically collect certain information including your IP address, browser type, operating system, referring URLs, device information, and browsing behavior. This is collected through cookies and similar tracking technologies.", "de": "Wenn Sie unsere Website besuchen, erfassen wir automatisch bestimmte Informationen, darunter Ihre IP-Adresse, den Browsertyp, das Betriebssystem, Referrer-URLs, Geräteinformationen und Ihr Surfverhalten. Dies erfolgt über Cookies und ähnliche Tracking-Technologien.", "fr": "Lorsque vous visitez notre site web, nous collectons automatiquement certaines informations, notamment votre adresse IP, le type de navigateur, le système d''exploitation, les URL de référence, les informations sur l''appareil et le comportement de navigation. Ces informations sont collectées via des cookies et des technologies de suivi similaires.", "es": "Cuando visita nuestro sitio web, recopilamos automáticamente cierta información, incluida su dirección IP, tipo de navegador, sistema operativo, URL de referencia, información del dispositivo y comportamiento de navegación. Esto se recopila mediante cookies y tecnologías de seguimiento similares."}},
  {"type": "subheading", "text_translations": {"en": "Analytics Data", "de": "Analysedaten", "fr": "Données d''analyse", "es": "Datos analíticos"}},
  {"type": "paragraph", "text_translations": {"en": "We use analytics tools to understand how visitors interact with our website. This includes page views, time spent on pages, click patterns, and navigation paths. This data is anonymized and aggregated.", "de": "Wir verwenden Analysetools, um zu verstehen, wie Besucher mit unserer Website interagieren. Dazu gehören Seitenaufrufe, Verweildauer, Klickmuster und Navigationspfade. Diese Daten werden anonymisiert und aggregiert.", "fr": "Nous utilisons des outils d''analyse pour comprendre comment les visiteurs interagissent avec notre site web. Cela comprend les pages vues, le temps passé sur les pages, les schémas de clics et les parcours de navigation. Ces données sont anonymisées et agrégées.", "es": "Utilizamos herramientas de análisis para comprender cómo interactúan los visitantes con nuestro sitio web. Esto incluye vistas de página, tiempo en las páginas, patrones de clics y rutas de navegación. Estos datos se anonimizan y agregan."}},
  {"type": "heading", "icon": "shield-check", "text_translations": {"en": "3. How We Use Your Information", "de": "3. Wie wir Ihre Informationen verwenden", "fr": "3. Comment nous utilisons vos informations", "es": "3. Cómo utilizamos su información"}},
  {"type": "paragraph", "text_translations": {"en": "We use the information we collect for the following purposes:", "de": "Wir verwenden die erfassten Informationen für folgende Zwecke:", "fr": "Nous utilisons les informations que nous collectons aux fins suivantes :", "es": "Utilizamos la información que recopilamos para los siguientes fines:"}},
  {"type": "list", "items": [
    {"text_translations": {"en": "To respond to your inquiries and provide services you request", "de": "Um auf Ihre Anfragen zu antworten und die von Ihnen angeforderten Dienste bereitzustellen", "fr": "Pour répondre à vos demandes et fournir les services que vous demandez", "es": "Para responder a sus consultas y proporcionar los servicios que solicita"}},
    {"text_translations": {"en": "To improve our website, services, and user experience", "de": "Um unsere Website, Dienste und das Nutzererlebnis zu verbessern", "fr": "Pour améliorer notre site web, nos services et l''expérience utilisateur", "es": "Para mejorar nuestro sitio web, nuestros servicios y la experiencia del usuario"}},
    {"text_translations": {"en": "To send relevant marketing communications (with your consent)", "de": "Um relevante Marketingmitteilungen zu senden (mit Ihrer Einwilligung)", "fr": "Pour envoyer des communications marketing pertinentes (avec votre consentement)", "es": "Para enviar comunicaciones de marketing relevantes (con su consentimiento)"}},
    {"text_translations": {"en": "To analyze website traffic and usage patterns", "de": "Um Website-Traffic und Nutzungsmuster zu analysieren", "fr": "Pour analyser le trafic du site web et les modèles d''utilisation", "es": "Para analizar el tráfico del sitio web y los patrones de uso"}},
    {"text_translations": {"en": "To protect against fraudulent or unauthorized activity", "de": "Um vor betrügerischen oder unbefugten Aktivitäten zu schützen", "fr": "Pour vous protéger contre les activités frauduleuses ou non autorisées", "es": "Para proteger contra actividades fraudulentas o no autorizadas"}},
    {"text_translations": {"en": "To comply with legal obligations and enforce our terms", "de": "Um gesetzlichen Verpflichtungen nachzukommen und unsere Bedingungen durchzusetzen", "fr": "Pour respecter les obligations légales et faire appliquer nos conditions", "es": "Para cumplir con las obligaciones legales y hacer cumplir nuestros términos"}}
  ]},
  {"type": "heading", "icon": "lock", "text_translations": {"en": "4. Data Protection & Security", "de": "4. Datenschutz & Sicherheit", "fr": "4. Protection des données et sécurité", "es": "4. Protección de datos y seguridad"}},
  {"type": "paragraph", "text_translations": {"en": "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, firewalls, secure server infrastructure, and regular security assessments. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.", "de": "Wir implementieren angemessene technische und organisatorische Sicherheitsmaßnahmen, um Ihre persönlichen Informationen vor unbefugtem Zugriff, Veränderung, Offenlegung oder Zerstörung zu schützen. Dazu gehören Verschlüsselung, Firewalls, sichere Serverinfrastruktur und regelmäßige Sicherheitsüberprüfungen. Keine Übertragung über das Internet oder elektronische Speicherung ist jedoch zu 100 % sicher, und wir können keine absolute Sicherheit garantieren.", "fr": "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos informations personnelles contre tout accès, modification, divulgation ou destruction non autorisés. Ces mesures comprennent le chiffrement, les pare-feu, une infrastructure de serveurs sécurisée et des évaluations de sécurité régulières. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n''est sécurisée à 100 %, et nous ne pouvons pas garantir une sécurité absolue.", "es": "Implementamos medidas de seguridad técnicas y organizativas adecuadas para proteger su información personal contra accesos, alteraciones, divulgaciones o destrucciones no autorizadas. Estas medidas incluyen cifrado, cortafuegos, infraestructura de servidores segura y evaluaciones de seguridad periódicas. Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100 % seguro, y no podemos garantizar una seguridad absoluta."}},
  {"type": "heading", "icon": "cookie", "text_translations": {"en": "5. Cookies & Tracking Technologies", "de": "5. Cookies & Tracking-Technologien", "fr": "5. Cookies et technologies de suivi", "es": "5. Cookies y tecnologías de seguimiento"}},
  {"type": "paragraph", "text_translations": {"en": "Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and deliver personalized content. For detailed information about the cookies we use and how you can manage your preferences, please see our [Cookie Policy](/cookie-policy).", "de": "Unsere Website verwendet Cookies und ähnliche Tracking-Technologien, um Ihr Surferlebnis zu verbessern, Website-Traffic zu analysieren und personalisierte Inhalte bereitzustellen. Detaillierte Informationen zu den von uns verwendeten Cookies und zur Verwaltung Ihrer Präferenzen finden Sie in unserer [Cookie-Richtlinie](/cookie-policy).", "fr": "Notre site web utilise des cookies et des technologies de suivi similaires pour améliorer votre expérience de navigation, analyser le trafic du site et fournir un contenu personnalisé. Pour plus d''informations sur les cookies que nous utilisons et sur la gestion de vos préférences, veuillez consulter notre [politique de cookies](/cookie-policy).", "es": "Nuestro sitio web utiliza cookies y tecnologías de seguimiento similares para mejorar su experiencia de navegación, analizar el tráfico del sitio y ofrecer contenido personalizado. Para obtener información detallada sobre las cookies que utilizamos y cómo gestionar sus preferencias, consulte nuestra [Política de Cookies](/cookie-policy)."}},
  {"type": "heading", "icon": "globe", "text_translations": {"en": "6. Third-Party Sharing", "de": "6. Weitergabe an Dritte", "fr": "6. Partage avec des tiers", "es": "6. Compartir con terceros"}},
  {"type": "paragraph", "text_translations": {"en": "We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential. We may also disclose information when required by law or to protect our rights.", "de": "Wir verkaufen, handeln oder vermieten Ihre persönlichen Informationen nicht an Dritte. Wir können Informationen mit vertrauenswürdigen Dienstleistern teilen, die uns beim Betrieb unserer Website und unseres Geschäfts unterstützen, sofern diese sich zur Vertraulichkeit verpflichten. Wir können Informationen auch offenlegen, wenn dies gesetzlich vorgeschrieben ist oder zum Schutz unserer Rechte erforderlich ist.", "fr": "Nous ne vendons, n''échangeons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager des informations avec des prestataires de services de confiance qui nous aident à exploiter notre site web et à mener nos activités, à condition qu''ils acceptent de garder ces informations confidentielles. Nous pouvons également divulguer des informations lorsque la loi l''exige ou pour protéger nos droits.", "es": "No vendemos, intercambiamos ni alquilamos su información personal a terceros. Podemos compartir información con proveedores de servicios de confianza que nos ayudan a operar nuestro sitio web y a realizar nuestro negocio, siempre que acepten mantener esta información confidencial. También podemos divulgar información cuando lo exija la ley o para proteger nuestros derechos."}},
  {"type": "heading", "icon": "clipboard-check", "text_translations": {"en": "7. Your Rights", "de": "7. Ihre Rechte", "fr": "7. Vos droits", "es": "7. Sus derechos"}},
  {"type": "paragraph", "text_translations": {"en": "Depending on your location, you may have the following rights regarding your personal data:", "de": "Je nach Ihrem Standort haben Sie möglicherweise die folgenden Rechte in Bezug auf Ihre personenbezogenen Daten:", "fr": "Selon votre lieu de résidence, vous pouvez disposer des droits suivants concernant vos données personnelles :", "es": "Según su ubicación, es posible que tenga los siguientes derechos con respecto a sus datos personales:"}},
  {"type": "list", "items": [
    {"text_translations": {"en": "The right to access your personal data", "de": "Das Recht auf Zugriff auf Ihre personenbezogenen Daten", "fr": "Le droit d''accéder à vos données personnelles", "es": "El derecho a acceder a sus datos personales"}},
    {"text_translations": {"en": "The right to rectify inaccurate or incomplete data", "de": "Das Recht auf Berichtigung unrichtiger oder unvollständiger Daten", "fr": "Le droit de rectifier des données inexactes ou incomplètes", "es": "El derecho a rectificar datos inexactos o incompletos"}},
    {"text_translations": {"en": "The right to request deletion of your data", "de": "Das Recht auf Löschung Ihrer Daten", "fr": "Le droit de demander la suppression de vos données", "es": "El derecho a solicitar la eliminación de sus datos"}},
    {"text_translations": {"en": "The right to restrict or object to processing", "de": "Das Recht auf Einschränkung der Verarbeitung oder Widerspruch", "fr": "Le droit de restreindre ou de vous opposer au traitement", "es": "El derecho a restringir u oponerse al procesamiento"}},
    {"text_translations": {"en": "The right to data portability", "de": "Das Recht auf Datenübertragbarkeit", "fr": "Le droit à la portabilité des données", "es": "El derecho a la portabilidad de los datos"}},
    {"text_translations": {"en": "The right to withdraw consent at any time", "de": "Das Recht, Ihre Einwilligung jederzeit zu widerrufen", "fr": "Le droit de retirer votre consentement à tout moment", "es": "El derecho a retirar el consentimiento en cualquier momento"}}
  ]},
  {"type": "paragraph", "text_translations": {"en": "To exercise any of these rights, please contact us at [privacy@stratifit.com](mailto:privacy@stratifit.com).", "de": "Um eines dieser Rechte auszuüben, kontaktieren Sie uns bitte unter [privacy@stratifit.com](mailto:privacy@stratifit.com).", "fr": "Pour exercer l''un de ces droits, veuillez nous contacter à [privacy@stratifit.com](mailto:privacy@stratifit.com).", "es": "Para ejercer cualquiera de estos derechos, contáctenos en [privacy@stratifit.com](mailto:privacy@stratifit.com)."}},
  {"type": "heading", "icon": "refresh", "text_translations": {"en": "8. Changes to This Policy", "de": "8. Änderungen dieser Richtlinie", "fr": "8. Modifications de cette politique", "es": "8. Cambios en esta política"}},
  {"type": "paragraph", "text_translations": {"en": "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically. Continued use of our services after changes constitutes acceptance of the updated policy.", "de": "Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Änderungen werden auf dieser Seite mit einem aktualisierten Revisionsdatum veröffentlicht. Wir empfehlen Ihnen, diese Richtlinie regelmäßig zu überprüfen. Die weitere Nutzung unserer Dienste nach Änderungen gilt als Zustimmung zur aktualisierten Richtlinie.", "fr": "Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Les modifications seront publiées sur cette page avec une date de révision mise à jour. Nous vous encourageons à consulter cette politique périodiquement. L''utilisation continue de nos services après les modifications constitue une acceptation de la politique mise à jour.", "es": "Podemos actualizar esta Política de Privacidad de vez en cuando. Los cambios se publicarán en esta página con una fecha de revisión actualizada. Le recomendamos revisar esta política periódicamente. El uso continuado de nuestros servicios después de los cambios constituye la aceptación de la política actualizada."}},
  {"type": "subheading", "divider": true, "text_translations": {"en": "Contact Us", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}},
  {"type": "paragraph", "text_translations": {"en": "If you have any questions about this Privacy Policy, please contact us at [privacy@stratifit.com](mailto:privacy@stratifit.com).", "de": "Wenn Sie Fragen zu dieser Datenschutzerklärung haben, kontaktieren Sie uns bitte unter [privacy@stratifit.com](mailto:privacy@stratifit.com).", "fr": "Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à [privacy@stratifit.com](mailto:privacy@stratifit.com).", "es": "Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos en [privacy@stratifit.com](mailto:privacy@stratifit.com)."}}
]'::jsonb,
   true),
  ('terms-conditions',
   '{"en": "Legal", "de": "Rechtliches", "fr": "Juridique", "es": "Legal"}'::jsonb,
   '{"en": "Terms of Service", "de": "Nutzungsbedingungen", "fr": "Conditions d''utilisation", "es": "Términos del servicio"}'::jsonb,
   '{"en": "These terms set out the rules for using the Stratifit website and the services we provide.", "de": "Diese Bedingungen legen die Regeln für die Nutzung der Stratifit-Website und der von uns angebotenen Dienste fest.", "fr": "Ces conditions définissent les règles d''utilisation du site web Stratifit et des services que nous fournissons.", "es": "Estos términos establecen las reglas para el uso del sitio web de Stratifit y los servicios que proporcionamos."}'::jsonb,
   '{"en": "Last updated: July 2026", "de": "Zuletzt aktualisiert: Juli 2026", "fr": "Dernière mise à jour : juillet 2026", "es": "Última actualización: julio de 2026"}'::jsonb,
   '[
  {"type": "heading", "icon": "file-text", "text_translations": {"en": "1. Acceptance of Terms", "de": "1. Annahme der Bedingungen", "fr": "1. Acceptation des conditions", "es": "1. Aceptación de los términos"}},
  {"type": "paragraph", "text_translations": {"en": "These Terms of Service (\"Terms\") govern your access to and use of the Stratifit website and services. By accessing our website or using our services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our website or services.", "de": "Diese Nutzungsbedingungen („Bedingungen“) regeln Ihren Zugriff auf und Ihre Nutzung der Stratifit-Website und -Dienste. Durch den Zugriff auf unsere Website oder die Nutzung unserer Dienste erklären Sie sich mit diesen Bedingungen einverstanden. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, nutzen Sie unsere Website oder Dienste bitte nicht.", "fr": "Ces conditions d''utilisation (« Conditions ») régissent votre accès à et votre utilisation du site web et des services de Stratifit. En accédant à notre site web ou en utilisant nos services, vous acceptez d''être lié par ces Conditions. Si vous n''êtes pas d''accord avec une partie de ces Conditions, veuillez ne pas utiliser notre site web ou nos services.", "es": "Estos Términos del Servicio («Términos») rigen su acceso y uso del sitio web y los servicios de Stratifit. Al acceder a nuestro sitio web o utilizar nuestros servicios, acepta quedar sujeto a estos Términos. Si no está de acuerdo con alguna parte de estos Términos, no utilice nuestro sitio web ni nuestros servicios."}},
  {"type": "heading", "icon": "globe", "text_translations": {"en": "2. Services", "de": "2. Dienstleistungen", "fr": "2. Services", "es": "2. Servicios"}},
  {"type": "paragraph", "text_translations": {"en": "Stratifit provides digital agency services including brand design, website development, AI & automation, and growth marketing. Specific deliverables, timelines, and pricing are defined in individual proposals or agreements.", "de": "Stratifit bietet Digitalagentur-Leistungen an, darunter Markengestaltung, Webentwicklung, KI & Automatisierung und Growth Marketing. Konkrete Leistungen, Zeitpläne und Preise werden in individuellen Angeboten oder Vereinbarungen festgelegt.", "fr": "Stratifit fournit des services d''agence digitale, notamment le design de marque, le développement web, l''IA & l''automatisation et le marketing de croissance. Les livrables, délais et tarifs spécifiques sont définis dans des propositions ou accords individuels.", "es": "Stratifit ofrece servicios de agencia digital, incluidos diseño de marca, desarrollo web, IA y automatización, y marketing de crecimiento. Los entregables, plazos y precios específicos se definen en propuestas o acuerdos individuales."}},
  {"type": "heading", "icon": "scale", "text_translations": {"en": "3. Intellectual Property", "de": "3. Geistiges Eigentum", "fr": "3. Propriété intellectuelle", "es": "3. Propiedad intelectual"}},
  {"type": "paragraph", "text_translations": {"en": "All content, designs, and materials delivered remain the intellectual property of their respective owners unless agreed otherwise in writing. You retain ownership of your content, and Stratifit retains ownership of its methodologies, tools, and pre-existing materials.", "de": "Alle gelieferten Inhalte, Designs und Materialien bleiben Eigentum der jeweiligen Rechteinhaber, sofern nichts anderes schriftlich vereinbart wurde. Sie behalten das Eigentum an Ihren Inhalten, während Stratifit das Eigentum an seinen Methoden, Werkzeugen und vorbestehenden Materialien behält.", "fr": "Tous les contenus, designs et matériels livrés restent la propriété intellectuelle de leurs propriétaires respectifs, sauf accord écrit contraire. Vous conservez la propriété de vos contenus, et Stratifit conserve la propriété de ses méthodologies, outils et matériaux préexistants.", "es": "Todo el contenido, los diseños y los materiales entregados siguen siendo propiedad intelectual de sus respectivos propietarios, salvo acuerdo escrito en contrario. Usted conserva la propiedad de su contenido, y Stratifit conserva la propiedad de sus metodologías, herramientas y materiales preexistentes."}},
  {"type": "heading", "icon": "credit-card", "text_translations": {"en": "4. Payments & Fees", "de": "4. Zahlungen und Gebühren", "fr": "4. Paiements et frais", "es": "4. Pagos y tarifas"}},
  {"type": "paragraph", "text_translations": {"en": "Fees for services are specified in your proposal or agreement. Unless stated otherwise, invoices are due within the agreed payment terms. Late payments may suspend ongoing work until the balance is settled.", "de": "Honorare für Leistungen sind in Ihrem Angebot oder Ihrer Vereinbarung festgelegt. Sofern nicht anders angegeben, sind Rechnungen innerhalb der vereinbarten Zahlungsfristen fällig. Verspätete Zahlungen können laufende Arbeiten bis zum Ausgleich des Saldos aussetzen.", "fr": "Les honoraires des services sont spécifiés dans votre proposition ou accord. Sauf indication contraire, les factures sont dues dans les délais de paiement convenus. Les retards de paiement peuvent suspendre le travail en cours jusqu''à l''apurement du solde.", "es": "Los honorarios de los servicios se especifican en su propuesta o acuerdo. Salvo que se indique lo contrario, las facturas vencen dentro de los plazos de pago acordados. Los pagos atrasados pueden suspender el trabajo en curso hasta que se salde el saldo."}},
  {"type": "heading", "icon": "triangle-alert", "text_translations": {"en": "5. Limitation of Liability", "de": "5. Haftungsbeschränkung", "fr": "5. Limitation de responsabilité", "es": "5. Limitación de responsabilidad"}},
  {"type": "paragraph", "text_translations": {"en": "To the maximum extent permitted by law, Stratifit shall not be liable for indirect, incidental, special, or consequential damages arising from the use of our website or services. Our total liability is limited to the amount paid by you for the specific service giving rise to the claim.", "de": "Im gesetzlich maximal zulässigen Umfang haftet Stratifit nicht für mittelbare, zufällige, besondere oder Folgeschäden, die aus der Nutzung unserer Website oder Dienste entstehen. Unsere Gesamthaftung ist auf den Betrag beschränkt, den Sie für den jeweiligen Anspruch auslösenden Dienst gezahlt haben.", "fr": "Dans la mesure maximale permise par la loi, Stratifit ne sera pas responsable des dommages indirects, accessoires, spéciaux ou consécutifs découlant de l''utilisation de notre site web ou de nos services. Notre responsabilité totale est limitée au montant payé par vous pour le service spécifique à l''origine de la réclamation.", "es": "En la máxima medida permitida por la ley, Stratifit no será responsable de daños indirectos, incidentales, especiales o consecuentes derivados del uso de nuestro sitio web o servicios. Nuestra responsabilidad total se limita al monto pagado por usted por el servicio específico que da lugar a la reclamación."}},
  {"type": "heading", "icon": "refresh", "text_translations": {"en": "6. Changes to These Terms", "de": "6. Änderungen dieser Bedingungen", "fr": "6. Modifications de ces conditions", "es": "6. Cambios en estos términos"}},
  {"type": "paragraph", "text_translations": {"en": "We may update these Terms from time to time. Changes will be posted on this page with an updated revision date. Continued use of our website or services after changes constitutes acceptance of the updated Terms.", "de": "Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Änderungen werden auf dieser Seite mit einem aktualisierten Revisionsdatum veröffentlicht. Die weitere Nutzung unserer Website oder Dienste nach Änderungen gilt als Zustimmung zu den aktualisierten Bedingungen.", "fr": "Nous pouvons mettre à jour ces Conditions de temps à autre. Les modifications seront publiées sur cette page avec une date de révision mise à jour. L''utilisation continue de notre site web ou de nos services après les modifications constitue une acceptation des Conditions mises à jour.", "es": "Podemos actualizar estos Términos de vez en cuando. Los cambios se publicarán en esta página con una fecha de revisión actualizada. El uso continuado de nuestro sitio web o servicios después de los cambios constituye la aceptación de los Términos actualizados."}},
  {"type": "subheading", "divider": true, "text_translations": {"en": "Contact Us", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}},
  {"type": "paragraph", "text_translations": {"en": "If you have any questions about these Terms, please contact us at [hello@stratifit.com](mailto:hello@stratifit.com).", "de": "Wenn Sie Fragen zu diesen Bedingungen haben, kontaktieren Sie uns bitte unter [hello@stratifit.com](mailto:hello@stratifit.com).", "fr": "Si vous avez des questions concernant ces Conditions, veuillez nous contacter à [hello@stratifit.com](mailto:hello@stratifit.com).", "es": "Si tiene alguna pregunta sobre estos Términos, contáctenos en [hello@stratifit.com](mailto:hello@stratifit.com)."}}
]'::jsonb,
   true),
  ('cookie-policy',
   '{"en": "Legal", "de": "Rechtliches", "fr": "Juridique", "es": "Legal"}'::jsonb,
   '{"en": "Cookie Policy", "de": "Cookie-Richtlinie", "fr": "Politique de cookies", "es": "Política de cookies"}'::jsonb,
   '{"en": "Cookies help us deliver a better experience. This policy explains what cookies we use and how you can control them.", "de": "Cookies helfen uns, ein besseres Erlebnis zu bieten. Diese Richtlinie erläutert, welche Cookies wir verwenden und wie Sie sie steuern können.", "fr": "Les cookies nous aident à offrir une meilleure expérience. Cette politique explique quels cookies nous utilisons et comment vous pouvez les contrôler.", "es": "Las cookies nos ayudan a ofrecer una mejor experiencia. Esta política explica qué cookies utilizamos y cómo puede controlarlas."}'::jsonb,
   '{"en": "Last updated: July 2026", "de": "Zuletzt aktualisiert: Juli 2026", "fr": "Dernière mise à jour : juillet 2026", "es": "Última actualización: julio de 2026"}'::jsonb,
   '[
  {"type": "heading", "icon": "cookie", "text_translations": {"en": "1. What Are Cookies", "de": "1. Was sind Cookies", "fr": "1. Que sont les cookies", "es": "1. Qué son las cookies"}},
  {"type": "paragraph", "text_translations": {"en": "Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences, understand how you use the site, and improve your browsing experience.", "de": "Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Gerät gespeichert werden. Sie helfen der Website, Ihre Präferenzen zu speichern, zu verstehen, wie Sie die Seite nutzen, und Ihr Surferlebnis zu verbessern.", "fr": "Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Ils aident le site à mémoriser vos préférences, à comprendre comment vous utilisez le site et à améliorer votre expérience de navigation.", "es": "Las cookies son pequeños archivos de texto almacenados en su dispositivo cuando visita un sitio web. Ayudan al sitio a recordar sus preferencias, comprender cómo utiliza el sitio y mejorar su experiencia de navegación."}},
  {"type": "heading", "icon": "settings", "text_translations": {"en": "2. How We Use Cookies", "de": "2. Wie wir Cookies verwenden", "fr": "2. Comment nous utilisons les cookies", "es": "2. Cómo utilizamos las cookies"}},
  {"type": "paragraph", "text_translations": {"en": "We use cookies and similar technologies for the following purposes:", "de": "Wir verwenden Cookies und ähnliche Technologien für folgende Zwecke:", "fr": "Nous utilisons des cookies et des technologies similaires aux fins suivantes :", "es": "Utilizamos cookies y tecnologías similares para los siguientes fines:"}},
  {"type": "list", "items": [
    {"text_translations": {"en": "Essential functionality, keeping the website secure and usable", "de": "Grundfunktionen, Sicherheit und Nutzbarkeit der Website gewährleisten", "fr": "Fonctionnalités essentielles, maintenir le site sécurisé et utilisable", "es": "Funcionalidad esencial: mantener el sitio seguro y utilizable"}},
    {"text_translations": {"en": "Analytics, understanding how visitors use the site", "de": "Analyse, verstehen, wie Besucher die Website nutzen", "fr": "Analyse, comprendre comment les visiteurs utilisent le site", "es": "Análisis: comprender cómo usan el sitio los visitantes"}},
    {"text_translations": {"en": "Preferences, remembering your language and display settings", "de": "Präferenzen, Sprache und Anzeigeeinstellungen speichern", "fr": "Préférences, mémoriser votre langue et vos paramètres d''affichage", "es": "Preferencias: recordar su idioma y configuración de visualización"}}
  ]},
  {"type": "heading", "icon": "clipboard-check", "text_translations": {"en": "3. Cookie Categories", "de": "3. Cookie-Kategorien", "fr": "3. Catégories de cookies", "es": "3. Categorías de cookies"}},
  {"type": "panel", "title_translations": {"en": "Essential cookies", "de": "Notwendige Cookies", "fr": "Cookies essentiels", "es": "Cookies esenciales"}, "tag_translations": {"en": "Always active", "de": "Immer aktiv", "fr": "Toujours actifs", "es": "Siempre activas"}, "body_translations": {"en": "These cookies are required for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as setting your privacy preferences or filling in forms.", "de": "Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden. Sie werden in der Regel nur als Reaktion auf Ihre Aktionen gesetzt, etwa wenn Sie Datenschutzeinstellungen festlegen oder Formulare ausfüllen.", "fr": "Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés. Ils ne sont généralement définis qu''en réponse à vos actions, comme la définition de vos préférences de confidentialité ou le remplissage de formulaires.", "es": "Estas cookies son necesarias para que el sitio web funcione y no se pueden desactivar. Por lo general, solo se establecen en respuesta a acciones realizadas por usted, como configurar sus preferencias de privacidad o completar formularios."}},
  {"type": "panel", "title_translations": {"en": "Analytics cookies", "de": "Analyse-Cookies", "fr": "Cookies d''analyse", "es": "Cookies de análisis"}, "tag_translations": {"en": "Optional", "de": "Optional", "fr": "Facultatif", "es": "Opcional"}, "body_translations": {"en": "These cookies help us understand how visitors interact with the website by collecting and reporting information anonymously. All data is aggregated and does not identify you personally.", "de": "Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, indem sie Informationen anonym sammeln und melden. Alle Daten werden aggregiert und identifizieren Sie nicht persönlich.", "fr": "Ces cookies nous aident à comprendre comment les visiteurs interagissent avec le site en collectant et en rapportant des informations de manière anonyme. Toutes les données sont agrégées et ne vous identifient pas personnellement.", "es": "Estas cookies nos ayudan a comprender cómo interactúan los visitantes con el sitio mediante la recopilación y el informe anónimo de información. Todos los datos se agregan y no lo identifican personalmente."}},
  {"type": "panel", "title_translations": {"en": "Marketing cookies", "de": "Marketing-Cookies", "fr": "Cookies marketing", "es": "Cookies de marketing"}, "tag_translations": {"en": "Optional", "de": "Optional", "fr": "Facultatif", "es": "Opcional"}, "body_translations": {"en": "These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant advertisements on other sites. We do not currently use marketing cookies unless you consent.", "de": "Diese Cookies können über unsere Website von unseren Werbepartnern gesetzt werden. Sie können verwendet werden, um ein Profil Ihrer Interessen zu erstellen und Ihnen relevante Werbung auf anderen Websites anzuzeigen. Wir verwenden derzeit keine Marketing-Cookies, es sei denn, Sie stimmen zu.", "fr": "Ces cookies peuvent être définis via notre site par nos partenaires publicitaires. Ils peuvent être utilisés pour créer un profil de vos intérêts et vous montrer des publicités pertinentes sur d''autres sites. Nous n''utilisons actuellement pas de cookies marketing, sauf si vous y consentez.", "es": "Estas cookies pueden establecerse a través de nuestro sitio por parte de nuestros socios publicitarios. Pueden utilizarse para crear un perfil de sus intereses y mostrarle anuncios relevantes en otros sitios. Actualmente no utilizamos cookies de marketing a menos que usted dé su consentimiento."}},
  {"type": "heading", "icon": "smartphone", "text_translations": {"en": "4. Managing Cookies", "de": "4. Cookies verwalten", "fr": "4. Gestion des cookies", "es": "4. Gestión de cookies"}},
  {"type": "paragraph", "text_translations": {"en": "You can control and delete cookies through your browser settings at any time. Most browsers allow you to block or remove cookies, and you can set your browser to alert you before a cookie is placed. Disabling essential cookies may affect site functionality.", "de": "Sie können Cookies jederzeit über die Einstellungen Ihres Browsers steuern und löschen. Die meisten Browser ermöglichen es Ihnen, Cookies zu blockieren oder zu entfernen und Ihren Browser so einzustellen, dass er Sie vor dem Setzen eines Cookies warnt. Das Deaktivieren notwendiger Cookies kann die Funktionalität der Website beeinträchtigen.", "fr": "Vous pouvez contrôler et supprimer les cookies via les paramètres de votre navigateur à tout moment. La plupart des navigateurs vous permettent de bloquer ou de supprimer les cookies et de définir des alertes avant qu''un cookie ne soit placé. La désactivation des cookies essentiels peut affecter le fonctionnement du site.", "es": "Puede controlar y eliminar las cookies a través de la configuración de su navegador en cualquier momento. La mayoría de los navegadores le permiten bloquear o eliminar cookies y configurar alertas antes de que se coloque una cookie. Deshabilitar las cookies esenciales puede afectar el funcionamiento del sitio."}},
  {"type": "heading", "icon": "refresh", "text_translations": {"en": "5. Changes to This Policy", "de": "5. Änderungen dieser Richtlinie", "fr": "5. Modifications de cette politique", "es": "5. Cambios en esta política"}},
  {"type": "paragraph", "text_translations": {"en": "We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the updated policy.", "de": "Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren. Änderungen werden auf dieser Seite mit einem aktualisierten Revisionsdatum veröffentlicht. Die weitere Nutzung unserer Website nach Änderungen gilt als Zustimmung zur aktualisierten Richtlinie.", "fr": "Nous pouvons mettre à jour cette politique de cookies de temps à autre. Les modifications seront publiées sur cette page avec une date de révision mise à jour. L''utilisation continue de notre site web après les modifications constitue une acceptation de la politique mise à jour.", "es": "Podemos actualizar esta Política de Cookies de vez en cuando. Los cambios se publicarán en esta página con una fecha de revisión actualizada. El uso continuado de nuestro sitio web después de los cambios constituye la aceptación de la política actualizada."}},
  {"type": "subheading", "divider": true, "text_translations": {"en": "Contact Us", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}},
  {"type": "paragraph", "text_translations": {"en": "If you have any questions about this Cookie Policy, please contact us at [hello@stratifit.com](mailto:hello@stratifit.com).", "de": "Wenn Sie Fragen zu dieser Cookie-Richtlinie haben, kontaktieren Sie uns bitte unter [hello@stratifit.com](mailto:hello@stratifit.com).", "fr": "Si vous avez des questions concernant cette politique de cookies, veuillez nous contacter à [hello@stratifit.com](mailto:hello@stratifit.com).", "es": "Si tiene alguna pregunta sobre esta Política de Cookies, contáctenos en [hello@stratifit.com](mailto:hello@stratifit.com)."}}
]'::jsonb,
   true),
  ('imprint',
   '{"en": "Legal", "de": "Rechtliches", "fr": "Juridique", "es": "Legal"}'::jsonb,
   '{"en": "Imprint", "de": "Impressum", "fr": "Mentions légales", "es": "Aviso legal"}'::jsonb,
   '{"en": "Legal notice / Impressum, company information for Stratifit.", "de": "Rechtliche Hinweise / Impressum, Unternehmensangaben zu Stratifit.", "fr": "Mentions légales / Impressum, informations sur l''entreprise Stratifit.", "es": "Aviso legal / Impressum: información de la empresa Stratifit."}'::jsonb,
   '{"en": "Legal notice / Impressum", "de": "Rechtliche Hinweise / Impressum", "fr": "Mentions légales", "es": "Aviso legal"}'::jsonb,
   '[
  {"type": "heading", "icon": "file-text", "text_translations": {"en": "Company", "de": "Unternehmen", "fr": "Société", "es": "Empresa"}},
  {"type": "paragraph", "text_translations": {"en": "Stratifit\nAddress to be provided", "de": "Stratifit\nAnschrift folgt", "fr": "Stratifit\nAdresse à fournir", "es": "Stratifit\nDirección por confirmar"}},
  {"type": "heading", "icon": "globe", "text_translations": {"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}},
  {"type": "paragraph", "text_translations": {"en": "Email: [hello@stratifit.com](mailto:hello@stratifit.com)", "de": "E-Mail: [hello@stratifit.com](mailto:hello@stratifit.com)", "fr": "E-mail : [hello@stratifit.com](mailto:hello@stratifit.com)", "es": "Correo: [hello@stratifit.com](mailto:hello@stratifit.com)"}},
  {"type": "heading", "icon": "shield-check", "text_translations": {"en": "Represented by", "de": "Vertreten durch", "fr": "Représentée par", "es": "Representada por"}},
  {"type": "paragraph", "text_translations": {"en": "Managing director / owner to be provided.", "de": "Geschäftsführer / Inhaber folgt.", "fr": "Directeur / propriétaire à fournir.", "es": "Director / propietario por confirmar."}},
  {"type": "heading", "icon": "clipboard-check", "text_translations": {"en": "Responsible for content", "de": "Verantwortlich für den Inhalt", "fr": "Responsable du contenu", "es": "Responsable del contenido"}},
  {"type": "paragraph", "text_translations": {"en": "To be provided.", "de": "Folgt.", "fr": "À fournir.", "es": "Por confirmar."}},
  {"type": "note", "text_translations": {"en": "Note: This placeholder must be completed with the legally required company information before launch.", "de": "Hinweis: Dieser Platzhalter muss vor dem Launch mit den gesetzlich vorgeschriebenen Unternehmensangaben vervollständigt werden.", "fr": "Remarque : ce texte provisoire doit être complété avec les informations légales requises avant le lancement.", "es": "Nota: este texto provisional debe completarse con la información legal requerida antes del lanzamiento."}}
]'::jsonb,
   true),
  ('careers',
   '{"en": "Careers", "de": "Karriere", "fr": "Carrières", "es": "Carreras"}'::jsonb,
   '{"en": "Careers", "de": "Karriere", "fr": "Carrières", "es": "Carreras"}'::jsonb,
   '{"en": "Join the Stratifit team, strategists, designers, engineers, and marketers obsessed with craft.", "de": "Werde Teil des Stratifit-Teams, Strategen, Designer, Ingenieure und Marketers, die Handwerkskunst lieben.", "fr": "Rejoignez l''équipe Stratifit, des stratèges, designers, ingénieurs et marketeurs passionnés par leur métier.", "es": "Únete al equipo de Stratifit: estrategas, diseñadores, ingenieros y especialistas en marketing apasionados por el oficio."}'::jsonb,
   '{"en": "Join the Stratifit team", "de": "Werde Teil des Stratifit-Teams", "fr": "Rejoignez l''équipe Stratifit", "es": "Únete al equipo de Stratifit"}'::jsonb,
   '[
  {"type": "heading", "icon": "file-text", "text_translations": {"en": "Why Stratifit", "de": "Warum Stratifit", "fr": "Pourquoi Stratifit", "es": "Por qué Stratifit"}},
  {"type": "paragraph", "text_translations": {"en": "You will work on premium projects with modern technology, collaborate directly with leadership, and see the real impact of your work on client outcomes.", "de": "Sie arbeiten an Premium-Projekten mit moderner Technologie, arbeiten direkt mit der Führungsebene zusammen und sehen die echten Auswirkungen Ihrer Arbeit auf die Ergebnisse unserer Kunden.", "fr": "Vous travaillerez sur des projets premium avec des technologies modernes, collaborerez directement avec la direction et verrez l''impact réel de votre travail sur les résultats des clients.", "es": "Trabajará en proyectos premium con tecnología moderna, colaborará directamente con el liderazgo y verá el impacto real de su trabajo en los resultados de los clientes."}},
  {"type": "heading", "icon": "eye", "text_translations": {"en": "How we work", "de": "Wie wir arbeiten", "fr": "Comment nous travaillons", "es": "Cómo trabajamos"}},
  {"type": "paragraph", "text_translations": {"en": "We are async-first: tight specs, short meetings, and high trust. We hire for seniority, autonomy, and judgment.", "de": "Wir arbeiten asynchron: präzise Spezifikationen, kurze Meetings und hohes Vertrauen. Wir stellen auf Erfahrung, Eigenverantwortung und Urteilsvermögen ein.", "fr": "Nous privilégions l''asynchrone : des spécifications précises, des réunions courtes et une grande confiance. Nous recrutons pour la séniorité, l''autonomie et le jugement.", "es": "Somos async-first: especificaciones precisas, reuniones cortas y alta confianza. Contratamos por seniority, autonomía y criterio."}},
  {"type": "heading", "icon": "clipboard-check", "text_translations": {"en": "Open positions", "de": "Offene Positionen", "fr": "Postes ouverts", "es": "Puestos abiertos"}},
  {"type": "paragraph", "text_translations": {"en": "We hire on a rolling basis for design, engineering, and growth roles. If you are exceptional at what you do, we want to hear from you.", "de": "Wir stellen laufend für Design-, Engineering- und Growth-Positionen ein. Wenn Sie außergewöhnlich gut in dem sind, was Sie tun, möchten wir von Ihnen hören.", "fr": "Nous recrutons en continu pour des postes en design, ingénierie et croissance. Si vous êtes exceptionnel dans ce que vous faites, nous voulons vous connaître.", "es": "Contratamos de forma continua para puestos de diseño, ingeniería y crecimiento. Si eres excepcional en lo que haces, queremos saber de ti."}},
  {"type": "heading", "icon": "refresh", "text_translations": {"en": "Apply", "de": "Bewerben", "fr": "Postuler", "es": "Aplicar"}},
  {"type": "paragraph", "text_translations": {"en": "Send your portfolio or CV through the contact page and we will get back to you within a few days.", "de": "Senden Sie Ihr Portfolio oder Ihren Lebenslauf über die Kontaktseite, wir melden uns innerhalb weniger Tage.", "fr": "Envoyez votre portfolio ou CV via la page contact et nous vous répondrons sous quelques jours.", "es": "Envíe su portafolio o CV a través de la página de contacto y le responderemos en unos días."}}
]'::jsonb,
   true),
  ('hiring',
   '{"en": "Careers", "de": "Karriere", "fr": "Carrières", "es": "Carreras"}'::jsonb,
   '{"en": "We''re Hiring", "de": "Wir stellen ein", "fr": "Nous recrutons", "es": "Estamos contratando"}'::jsonb,
   '{"en": "We''re always looking for exceptional people to join our team. Here''s how we hire and how to apply.", "de": "Wir suchen immer nach außergewöhnlichen Menschen, die unser Team verstärken. So stellen wir ein und so bewerben Sie sich.", "fr": "Nous sommes toujours à la recherche de personnes exceptionnelles pour rejoindre notre équipe. Voici comment nous recrutons et comment postuler.", "es": "Siempre buscamos personas excepcionales para unirse a nuestro equipo. Así contratamos y así puedes postularte."}'::jsonb,
   '{"en": "Open roles & hiring process", "de": "Offene Rollen & Einstellungsprozess", "fr": "Postes ouverts et processus de recrutement", "es": "Roles abiertos y proceso de contratación"}'::jsonb,
   '[
  {"type": "heading", "icon": "file-text", "text_translations": {"en": "We''re Hiring", "de": "Wir stellen ein", "fr": "Nous recrutons", "es": "Estamos contratando"}},
  {"type": "paragraph", "text_translations": {"en": "We grow one role at a time and only hire people we would be proud to work alongside. If you care deeply about your craft, strategy, design, engineering, or growth, we want to hear from you.", "de": "Wir bauen unser Team Rolle für Rolle auf und stellen nur Menschen ein, mit denen wir gerne zusammenarbeiten. Wenn Ihnen Ihr Handwerk wichtig ist, Strategie, Design, Engineering oder Growth, möchten wir von Ihnen hören.", "fr": "Nous grandissons un poste à la fois et n''embauchons que des personnes avec lesquelles nous serions fiers de travailler. Si votre métier vous passionne, stratégie, design, ingénierie ou croissance, nous voulons vous connaître.", "es": "Crecemos un rol a la vez y solo contratamos personas con las que nos enorgullecería trabajar. Si te apasiona tu oficio, estrategia, diseño, ingeniería o crecimiento, queremos saber de ti."}},
  {"type": "heading", "icon": "eye", "text_translations": {"en": "What We Look For", "de": "Was wir suchen", "fr": "Ce que nous recherchons", "es": "Qué buscamos"}},
  {"type": "list", "items": [
    {"text_translations": {"en": "Obsession with craft and attention to detail", "de": "Leidenschaft für Handwerkskunst und Liebe zum Detail", "fr": "Obsession du métier et souci du détail", "es": "Obsesión por el oficio y atención al detalle"}},
    {"text_translations": {"en": "Ownership, autonomy, and sound judgment", "de": "Eigenverantwortung, Selbstständigkeit und Urteilsvermögen", "fr": "Responsabilité, autonomie et bon jugement", "es": "Responsabilidad, autonomía y buen criterio"}},
    {"text_translations": {"en": "Clear, honest, and direct communication", "de": "Klare, ehrliche und direkte Kommunikation", "fr": "Communication claire, honnête et directe", "es": "Comunicación clara, honesta y directa"}},
    {"text_translations": {"en": "Curiosity and a commitment to continuous learning", "de": "Neugier und der Wille zu kontinuierlichem Lernen", "fr": "Curiosité et engagement envers l''apprentissage continu", "es": "Curiosidad y compromiso con el aprendizaje continuo"}}
  ]},
  {"type": "heading", "icon": "clipboard-check", "text_translations": {"en": "Our Hiring Process", "de": "Unser Einstellungsprozess", "fr": "Notre processus de recrutement", "es": "Nuestro proceso de contratación"}},
  {"type": "list", "items": [
    {"text_translations": {"en": "Apply, send your portfolio or CV through the contact page or by email", "de": "Bewerbung, senden Sie Ihr Portfolio oder Ihren Lebenslauf über die Kontaktseite oder per E-Mail", "fr": "Postulez, envoyez votre portfolio ou CV via la page contact ou par e-mail", "es": "Postúlate: envía tu portafolio o CV a través de la página de contacto o por correo"}},
    {"text_translations": {"en": "Intro call, a short conversation about your experience and goals", "de": "Erstgespräch, ein kurzes Gespräch über Ihre Erfahrung und Ziele", "fr": "Entretien découverte, une brève conversation sur votre expérience et vos objectifs", "es": "Llamada inicial: una breve conversación sobre tu experiencia y objetivos"}},
    {"text_translations": {"en": "Deep dive, a portfolio or technical review with the team", "de": "Fachgespräch, Portfolio- oder technische Überprüfung mit dem Team", "fr": "Entretien approfondi, revue de portfolio ou technique avec l''équipe", "es": "Análisis profundo: revisión de portafolio o técnica con el equipo"}},
    {"text_translations": {"en": "Team interview, meet the people you would work with", "de": "Team-Interview, lernen Sie die Menschen kennen, mit denen Sie arbeiten würden", "fr": "Entretien d''équipe, rencontrez les personnes avec lesquelles vous travailleriez", "es": "Entrevista de equipo: conoce a las personas con las que trabajarías"}},
    {"text_translations": {"en": "Offer, a fair, transparent offer with clear next steps", "de": "Angebot, ein faires, transparentes Angebot mit klaren nächsten Schritten", "fr": "Offre, une offre juste et transparente avec des prochaines étapes claires", "es": "Oferta: una oferta justa y transparente con próximos pasos claros"}}
  ]},
  {"type": "heading", "icon": "shield-check", "text_translations": {"en": "What We Offer", "de": "Was wir bieten", "fr": "Ce que nous offrons", "es": "Qué ofrecemos"}},
  {"type": "list", "items": [
    {"text_translations": {"en": "Remote-first culture with flexible working hours", "de": "Remote-first-Kultur mit flexiblen Arbeitszeiten", "fr": "Culture remote-first avec horaires flexibles", "es": "Cultura remota con horarios flexibles"}},
    {"text_translations": {"en": "Modern tools and a personal learning budget", "de": "Moderne Tools und ein persönliches Lernbudget", "fr": "Outils modernes et budget d''apprentissage personnel", "es": "Herramientas modernas y presupuesto personal de aprendizaje"}},
    {"text_translations": {"en": "Premium client projects with real strategic impact", "de": "Premium-Kundenprojekte mit echter strategischer Wirkung", "fr": "Projets clients premium avec un réel impact stratégique", "es": "Proyectos premium de clientes con impacto estratégico real"}},
    {"text_translations": {"en": "Direct collaboration with leadership and zero bureaucracy", "de": "Direkte Zusammenarbeit mit der Führungsebene und null Bürokratie", "fr": "Collaboration directe avec la direction et zéro bureaucratie", "es": "Colaboración directa con el liderazgo y cero burocracia"}}
  ]},
  {"type": "heading", "icon": "globe", "text_translations": {"en": "Open Roles", "de": "Offene Rollen", "fr": "Postes ouverts", "es": "Roles abiertos"}},
  {"type": "list", "items": [
    {"text_translations": {"en": "Senior Brand Designer", "de": "Senior Brand Designer", "fr": "Senior Brand Designer", "es": "Senior Brand Designer"}},
    {"text_translations": {"en": "Frontend Engineer (React / Next.js)", "de": "Frontend-Entwickler (React / Next.js)", "fr": "Ingénieur frontend (React / Next.js)", "es": "Ingeniero frontend (React / Next.js)"}},
    {"text_translations": {"en": "AI & Automation Specialist", "de": "KI- & Automatisierungs-Spezialist", "fr": "Spécialiste IA et automatisation", "es": "Especialista en IA y automatización"}},
    {"text_translations": {"en": "Growth Marketer", "de": "Growth-Marketer", "fr": "Marketeur croissance", "es": "Especialista en growth marketing"}}
  ]},
  {"type": "heading", "icon": "settings", "text_translations": {"en": "How to Apply", "de": "So bewerben Sie sich", "fr": "Comment postuler", "es": "Cómo postularse"}},
  {"type": "paragraph", "text_translations": {"en": "Send your portfolio and CV to [careers@stratifit.com](mailto:careers@stratifit.com) or through the [contact page](/contact). We reply to every application within a few days.", "de": "Senden Sie Ihr Portfolio und Ihren Lebenslauf an [careers@stratifit.com](mailto:careers@stratifit.com) oder über die [Kontaktseite](/contact). Wir antworten auf jede Bewerbung innerhalb weniger Tage.", "fr": "Envoyez votre portfolio et votre CV à [careers@stratifit.com](mailto:careers@stratifit.com) ou via la [page contact](/contact). Nous répondons à chaque candidature sous quelques jours.", "es": "Envía tu portafolio y CV a [careers@stratifit.com](mailto:careers@stratifit.com) o a través de la [página de contacto](/contact). Respondemos a cada solicitud en unos días."}}
]'::jsonb,
   true)
ON CONFLICT (slug) DO UPDATE SET
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  description_translations = EXCLUDED.description_translations,
  subtitle_translations = EXCLUDED.subtitle_translations,
  content_translations = EXCLUDED.content_translations,
  is_visible = EXCLUDED.is_visible;


-- =============================================================================
-- Hero (Singleton)
-- =============================================================================

INSERT INTO public.hero (singleton_key, eyebrow_translations, title_translations, highlight_translations, description_translations, primary_cta_label_translations, primary_cta_url, secondary_cta_label_translations, secondary_cta_url, metrics, trusted_by, variant, is_visible)
VALUES (
  true,
  '{"en": "Premium Digital Agency", "de": "Premium-Digitalagentur", "fr": "Agence Digitale Premium", "es": "Agencia Digital Premium"}'::jsonb,
  '{"en": "We Build Websites, Brands & Systems", "de": "Wir bauen Websites, Marken & Systeme", "fr": "Nous créons des sites web, des marques & des systèmes", "es": "Creamos sitios web, marcas y sistemas"}'::jsonb,
  '{"en": "That Grow Businesses.", "de": "Die Unternehmen wachsen lassen.", "fr": "Qui font grandir les entreprises.", "es": "Que hacen crecer los negocios."}'::jsonb,
  '{"en": "We help startups and growing businesses build websites, brands, and AI-powered systems that turn visitors into customers.", "de": "Wir helfen Startups und wachsenden Unternehmen, Websites, Marken und KI-gestützte Systeme aufzubauen, die Besucher in Kunden verwandeln.", "fr": "Nous aidons les startups et les entreprises en croissance à créer des sites web, des marques et des systèmes alimentés par l''IA qui transforment les visiteurs en clients.", "es": "Ayudamos a startups y empresas en crecimiento a construir sitios web, marcas y sistemas impulsados por IA que convierten visitantes en clientes."}'::jsonb,
  '{"en": "Start Your Project", "de": "Projekt starten", "fr": "Démarrer votre projet", "es": "Iniciar tu proyecto"}'::jsonb,
  '/contact',
  '{"en": "View Our Work", "de": "Unsere Arbeiten ansehen", "fr": "Voir nos réalisations", "es": "Ver nuestro trabajo"}'::jsonb,
  '/work',
  '[{"value": "59+", "label_translations": {"en": "Projects Delivered", "de": "Gelieferte Projekte", "fr": "Projets livrés", "es": "Proyectos entregados"}}, {"value": "7+", "label_translations": {"en": "Years Experience", "de": "Jahre Erfahrung", "fr": "Années d''expérience", "es": "Años de experiencia"}}, {"value": "98%", "label_translations": {"en": "Client Satisfaction", "de": "Kundenzufriedenheit", "fr": "Satisfaction client", "es": "Satisfacción del cliente"}}]'::jsonb,
  '[{"name": "LUMEN", "icon": "lumen"}, {"name": "NOVUS", "icon": "novus"}, {"name": "PULSE", "icon": "pulse"}, {"name": "VERTEX", "icon": "vertex"}, {"name": "ORBIT", "icon": "orbit"}, {"name": "NEXUS", "icon": "nexus"}]'::jsonb,
  'default',
  true
)
ON CONFLICT (singleton_key) DO UPDATE SET
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  description_translations = EXCLUDED.description_translations,
  primary_cta_label_translations = EXCLUDED.primary_cta_label_translations,
  primary_cta_url = EXCLUDED.primary_cta_url,
  secondary_cta_label_translations = EXCLUDED.secondary_cta_label_translations,
  secondary_cta_url = EXCLUDED.secondary_cta_url,
  metrics = EXCLUDED.metrics,
  trusted_by = EXCLUDED.trusted_by;

-- =============================================================================
-- About Page (Singleton)
-- =============================================================================

INSERT INTO public.about_page (singleton_key, eyebrow_translations, title_translations, highlight_translations, intro_translations, stats, mission_translations, story_translations, values, team_translations, cta_title_translations, cta_highlight_translations, cta_description_translations, cta_label_translations, cta_url, is_visible)
VALUES (
  true,
  '{"en": "About", "de": "Über uns", "fr": "À propos", "es": "Nosotros"}'::jsonb,
  '{"en": "About ", "de": "Über ", "fr": "À propos ", "es": "Sobre "}'::jsonb,
  '{"en": "Stratifit", "de": "Stratifit", "fr": "Stratifit", "es": "Stratifit"}'::jsonb,
  '{"en": "We are a premium digital agency that builds brands, scales businesses, and engineers growth through strategy, design, and technology.", "de": "Wir sind eine Premium-Digitalagentur, die Marken aufbaut, Unternehmen skaliert und Wachstum durch Strategie, Design und Technologie vorantreibt.", "fr": "Nous sommes une agence digitale premium qui construit des marques, fait croître les entreprises et génère de la croissance grâce à la stratégie, au design et à la technologie.", "es": "Somos una agencia digital premium que construye marcas, escala negocios e impulsa el crecimiento a través de la estrategia, el diseño y la tecnología."}'::jsonb,
  '[
    {"icon": "bolt", "value": "120+", "label_translations": {"en": "Projects Delivered", "de": "Gelieferte Projekte", "fr": "Projets livrés", "es": "Proyectos entregados"}},
    {"icon": "users", "value": "45+", "label_translations": {"en": "Team Members", "de": "Teammitglieder", "fr": "Membres de l''équipe", "es": "Miembros del equipo"}},
    {"icon": "globe", "value": "18", "label_translations": {"en": "Countries Served", "de": "Bediente Länder", "fr": "Pays desservis", "es": "Países atendidos"}},
    {"icon": "chart", "value": "98%", "label_translations": {"en": "Client Retention", "de": "Kundenbindung", "fr": "Fidélisation client", "es": "Retención de clientes"}}
  ]'::jsonb,
  '{"en": "To empower ambitious brands with the strategy, design, and technology they need to dominate their markets.", "de": "Wir befähigen ambitionierte Marken mit der Strategie, dem Design und der Technologie, die sie brauchen, um ihre Märkte zu dominieren.", "fr": "Donner aux marques ambitieuses la stratégie, le design et la technologie dont elles ont besoin pour dominer leurs marchés.", "es": "Capacitar a las marcas ambiciosas con la estrategia, el diseño y la tecnología que necesitan para dominar sus mercados."}'::jsonb,
  '{"en": "Founded with a vision to bridge the gap between premium branding and technical execution, Stratifit has grown from a boutique design studio into a full-scale digital agency. Today, we partner with startups and enterprises alike, delivering brand identities, web platforms, AI automation systems, and growth engines that transform how businesses operate and scale.", "de": "Gegründet mit der Vision, die Lücke zwischen Premium-Branding und technischer Umsetzung zu schließen, ist Stratifit von einem Boutique-Designstudio zu einer umfassenden Digitalagentur gewachsen. Heute arbeiten wir mit Startups und Unternehmen jeder Größe zusammen, und liefern Markenidentitäten, Web-Plattformen, KI-Automatisierungssysteme und Wachstumsmaschinen, die verändern, wie Unternehmen arbeiten und skalieren.", "fr": "Fondée avec la vision de combler l''écart entre le branding premium et l''exécution technique, Stratifit est passée d''un studio de design boutique à une agence digitale complète. Aujourd''hui, nous travaillons aussi bien avec les startups qu''avec les grandes entreprises, en livrant des identités de marque, des plateformes web, des systèmes d''automatisation IA et des moteurs de croissance qui transforment la façon dont les entreprises opèrent et se développent.", "es": "Fundada con la visión de cerrar la brecha entre el branding premium y la ejecución técnica, Stratifit ha pasado de ser un estudio de diseño boutique a una agencia digital de servicio completo. Hoy trabajamos con startups y empresas por igual, ofreciendo identidades de marca, plataformas web, sistemas de automatización con IA y motores de crecimiento que transforman la forma en que las empresas operan y escalan."}'::jsonb,
  '[
    {"icon": "sparkles", "title_translations": {"en": "Precision", "de": "Präzision", "fr": "Précision", "es": "Precisión"}, "description_translations": {"en": "Every pixel, every line of code, every strategy, executed with meticulous attention to detail.", "de": "Jedes Pixel, jede Codezeile, jede Strategie, umgesetzt mit akribischer Liebe zum Detail.", "fr": "Chaque pixel, chaque ligne de code, chaque stratégie, exécutés avec une attention méticuleuse aux détails.", "es": "Cada píxel, cada línea de código, cada estrategia: ejecutados con una atención meticulosa al detalle."}},
    {"icon": "bolt", "title_translations": {"en": "Innovation", "de": "Innovation", "fr": "Innovation", "es": "Innovación"}, "description_translations": {"en": "We push boundaries with emerging technologies and creative approaches that set you apart.", "de": "Wir erweitern Grenzen mit neuen Technologien und kreativen Ansätzen, die Sie auszeichnen.", "fr": "Nous repoussons les limites grâce aux technologies émergentes et à des approches créatives qui vous distinguent.", "es": "Ampliamos los límites con tecnologías emergentes y enfoques creativos que te hacen destacar."}},
    {"icon": "users", "title_translations": {"en": "Partnership", "de": "Partnerschaft", "fr": "Partenariat", "es": "Asociación"}, "description_translations": {"en": "We integrate as an extension of your team, aligned with your vision and committed to your success.", "de": "Wir integrieren uns als Teil Ihres Teams, ausgerichtet an Ihrer Vision und verpflichtet Ihrem Erfolg.", "fr": "Nous nous intégrons comme une extension de votre équipe, alignés sur votre vision et engagés pour votre réussite.", "es": "Nos integramos como una extensión de tu equipo, alineados con tu visión y comprometidos con tu éxito."}},
    {"icon": "chart", "title_translations": {"en": "Results", "de": "Ergebnisse", "fr": "Résultats", "es": "Resultados"}, "description_translations": {"en": "We measure everything. Every engagement is tied to real KPIs and tangible business outcomes.", "de": "Wir messen alles. Jedes Projekt ist an echte KPIs und greifbare Geschäftsergebnisse gekoppelt.", "fr": "Nous mesurons tout. Chaque mission est liée à de vrais KPI et à des résultats commerciaux tangibles.", "es": "Lo medimos todo. Cada proyecto está vinculado a KPIs reales y resultados comerciales tangibles."}}
  ]'::jsonb,
  '{"en": "We are strategists, designers, engineers, and marketers who share a common obsession: building exceptional digital experiences. Our team brings together decades of combined expertise from top agencies, startups, and Fortune 500 companies, united by a passion for craftsmanship and a commitment to client success.", "de": "Wir sind Strategen, Designer, Ingenieure und Marketer, die eine gemeinsame Leidenschaft teilen: außergewöhnliche digitale Erlebnisse zu schaffen. Unser Team vereint jahrzehntelange kombinierte Expertise aus Top-Agenturen, Startups und Fortune-500-Unternehmen, vereint durch die Leidenschaft für Handwerkskunst und das Engagement für den Erfolg unserer Kunden.", "fr": "Nous sommes des stratèges, designers, ingénieurs et marketers partageant une obsession commune : créer des expériences numériques exceptionnelles. Notre équipe réunit des décennies d''expertise combinée issue des meilleures agences, de startups et d''entreprises du Fortune 500, unie par une passion pour le travail bien fait et un engagement envers la réussite de nos clients.", "es": "Somos estrategas, diseñadores, ingenieros y especialistas en marketing que comparten una obsesión común: crear experiencias digitales excepcionales. Nuestro equipo reúne décadas de experiencia combinada de las mejores agencias, startups y empresas Fortune 500, unidos por la pasión por la artesanía y el compromiso con el éxito de nuestros clientes."}'::jsonb,
  '{"en": "Ready to Work ", "de": "Bereit, gemeinsam ", "fr": "Prêt à travailler ", "es": "¿Listo para trabajar "}'::jsonb,
  '{"en": "Together?", "de": "loszulegen?", "fr": "ensemble ?", "es": "juntos?"}'::jsonb,
  '{"en": "Let''s build something exceptional.", "de": "Lass uns etwas Außergewöhnliches bauen.", "fr": "Construisons ensemble quelque chose d''exceptionnel.", "es": "Construyamos algo excepcional."}'::jsonb,
  '{"en": "Start Your Project", "de": "Projekt starten", "fr": "Démarrer votre projet", "es": "Iniciar tu proyecto"}'::jsonb,
  '/contact',
  true
)
ON CONFLICT (singleton_key) DO UPDATE SET
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  intro_translations = EXCLUDED.intro_translations,
  stats = EXCLUDED.stats,
  mission_translations = EXCLUDED.mission_translations,
  story_translations = EXCLUDED.story_translations,
  values = EXCLUDED.values,
  team_translations = EXCLUDED.team_translations,
  cta_title_translations = EXCLUDED.cta_title_translations,
  cta_highlight_translations = EXCLUDED.cta_highlight_translations,
  cta_description_translations = EXCLUDED.cta_description_translations,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Services (4 Core Services)
-- =============================================================================

INSERT INTO public.services (slug, title_translations, short_description_translations, full_description_translations, deliverables_translations, icon_name, cta_label_translations, cta_url, display_order, is_featured, is_visible, status)
VALUES
  ('brand-design',
   '{"en": "Brand Design", "de": "Markengestaltung", "fr": "Design de Marque", "es": "Diseño de Marca"}'::jsonb,
   '{"en": "Distinctive brand identities that communicate credibility and strategic positioning.", "de": "Einzigartige Markenidentitäten, die Glaubwürdigkeit und strategische Positionierung vermitteln.", "fr": "Identités de marque distinctives qui communiquent crédibilité et positionnement stratégique.", "es": "Identidades de marca distintivas que comunican credibilidad y posicionamiento estratégico."}'::jsonb,
   '{"en": "We create comprehensive brand systems that resonate with your audience and stand out in the market.", "de": "Wir erstellen umfassende Markensysteme, die bei Ihrer Zielgruppe ankommen und sich am Markt abheben.", "fr": "Nous créons des systèmes de marque complets qui résonnent avec votre public et se démarquent sur le marché.", "es": "Creamos sistemas de marca completos que resuenan con tu audiencia y destacan en el mercado."}'::jsonb,
   '{"en": ["Brand Strategy", "Logo Design", "Visual Identity", "Color Systems", "Typography", "Brand Guidelines", "Asset Kits"], "de": ["Markenstrategie", "Logo-Design", "Visuelle Identität", "Farbsysteme", "Typografie", "Markenrichtlinien", "Asset-Kits"], "fr": ["Stratégie de marque", "Design de logo", "Identité visuelle", "Systèmes de couleurs", "Typographie", "Directives de marque", "Kits d assets"], "es": ["Estrategia de marca", "Diseño de logo", "Identidad visual", "Sistemas de colores", "Tipografía", "Directrices de marca", "Kits de recursos"]}'::jsonb,
   'Palette',
   '{"en": "Learn More", "de": "Mehr erfahren", "fr": "En savoir plus", "es": "Saber más"}'::jsonb,
   '/contact',
   1,
   true,
   true,
   'published'
  ),
  ('website-development',
   '{"en": "Website Development", "de": "Webentwicklung", "fr": "Développement Web", "es": "Desarrollo Web"}'::jsonb,
   '{"en": "High-performance websites engineered for speed, scalability, and conversion.", "de": "Leistungsstarke Websites für Geschwindigkeit, Skalierbarkeit und Conversion optimiert.", "fr": "Sites web haute performance conçus pour la vitesse, la scalabilité et la conversion.", "es": "Sitios web de alto rendimiento diseñados para velocidad, escalabilidad y conversión."}'::jsonb,
   '{"en": "From custom business sites to complex web applications, we build digital experiences that perform.", "de": "Von individuellen Business-Websites bis hin zu komplexen Webanwendungen erstellen wir digitale Erlebnisse, die funktionieren.", "fr": "Des sites d entreprises aux applications web complexes, nous créons des expériences numériques performantes.", "es": "Desde sitios empresariales personalizados hasta aplicaciones web complejas, creamos experiencias digitales que funcionan."}'::jsonb,
   '{"en": ["Custom Websites", "E-commerce", "Web Applications", "CMS Integration", "Multilingual Sites", "Performance Optimization", "Maintenance"], "de": ["Individuelle Websites", "E-Commerce", "Webanwendungen", "CMS-Integration", "Mehrsprachige Sites", "Performance-Optimierung", "Wartung"], "fr": ["Sites sur mesure", "E-commerce", "Applications web", "Intégration CMS", "Sites multilingues", "Optimisation des performances", "Maintenance"], "es": ["Sitios web personalizados", "E-commerce", "Aplicaciones web", "Integración CMS", "Sitios multilingües", "Optimización de rendimiento", "Mantenimiento"]}'::jsonb,
   'Code',
   '{"en": "Learn More", "de": "Mehr erfahren", "fr": "En savoir plus", "es": "Saber más"}'::jsonb,
   '/services/website-development',
   2,
   true,
   true,
   'published'
  ),
  ('ai-automation',
   '{"en": "AI & Automation", "de": "KI & Automatisierung", "fr": "IA & Automatisation", "es": "IA y Automatización"}'::jsonb,
   '{"en": "Intelligent systems that reduce repetitive work and improve customer communication.", "de": "Intelligente Systeme, die repetitive Arbeit reduzieren und die Kundenkommunikation verbessern.", "fr": "Systèmes intelligents qui réduisent le travail répétitif et améliorent la communication client.", "es": "Sistemas inteligentes que reducen el trabajo repetitivo y mejoran la comunicación con clientes."}'::jsonb,
   '{"en": "We build AI-powered chatbots, FAQ assistants, workflow automation, and custom integrations that save time and improve efficiency.", "de": "Wir erstellen KI-gestützte Chatbots, FAQ-Assistenten, Workflow-Automatisierung und individuelle Integrationen, die Zeit sparen und die Effizienz verbessern.", "fr": "Nous créons des chatbots IA, des assistants FAQ, l automatisation des workflows et des intégrations sur mesure qui font gagner du temps et améliorent l efficacité.", "es": "Creamos chatbots con IA, asistentes de FAQ, automatización de flujos de trabajo e integraciones personalizadas que ahorran tiempo y mejoran la eficiencia."}'::jsonb,
   '{"en": ["AI Chatbots", "FAQ Assistants", "Lead Qualification", "Workflow Automation", "CRM Integration", "Custom APIs", "Email Automation"], "de": ["KI-Chatbots", "FAQ-Assistenten", "Lead-Qualifizierung", "Workflow-Automatisierung", "CRM-Integration", "Individuelle APIs", "E-Mail-Automatisierung"], "fr": ["Chatbots IA", "Assistants FAQ", "Qualification des leads", "Automatisation des workflows", "Intégration CRM", "APIs sur mesure", "Automatisation email"], "es": ["Chatbots con IA", "Asistentes de FAQ", "Calificación de leads", "Automatización de flujos", "Integración CRM", "APIs personalizadas", "Automatización de email"]}'::jsonb,
   'Brain',
   '{"en": "Learn More", "de": "Mehr erfahren", "fr": "En savoir plus", "es": "Saber más"}'::jsonb,
   '/contact',
   3,
   true,
   true,
   'published'
  ),
  ('growth-marketing',
   '{"en": "Growth & Marketing", "de": "Growth & Marketing", "fr": "Croissance & Marketing", "es": "Crecimiento y Marketing"}'::jsonb,
   '{"en": "Data-driven growth systems that improve visibility and attract qualified audiences.", "de": "Datengetriebene Growth-Systeme, die Sichtbarkeit verbessern und qualifizierte Zielgruppen anziehen.", "fr": "Systèmes de croissance basés sur les données qui améliorent la visibilité et attirent des audiences qualifiées.", "es": "Sistemas de crecimiento basados en datos que mejoran la visibilidad y atraen audiencias cualificadas."}'::jsonb,
   '{"en": "From SEO to performance marketing, we develop strategies that deliver measurable results and sustainable growth.", "de": "Von SEO bis Performance-Marketing entwickeln wir Strategien, die messbare Ergebnisse und nachhaltiges Wachstum liefern.", "fr": "Du SEO au marketing de performance, nous développons des stratégies qui offrent des résultats mesurables et une croissance durable.", "es": "Desde SEO hasta marketing de rendimiento, desarrollamos estrategias que ofrecen resultados medibles y crecimiento sostenible."}'::jsonb,
   '{"en": ["SEO", "SEM", "Performance Marketing", "Content Strategy", "Social Media", "CRO", "Analytics", "Growth Audits"], "de": ["SEO", "SEM", "Performance-Marketing", "Content-Strategie", "Social Media", "CRO", "Analytics", "Growth-Audits"], "fr": ["SEO", "SEM", "Marketing de performance", "Stratégie de contenu", "Réseaux sociaux", "CRO", "Analytique", "Audits de croissance"], "es": ["SEO", "SEM", "Marketing de rendimiento", "Estrategia de contenido", "Redes sociales", "CRO", "Analítica", "Auditorías de crecimiento"]}'::jsonb,
   'TrendingUp',
   '{"en": "Learn More", "de": "Mehr erfahren", "fr": "En savoir plus", "es": "Saber más"}'::jsonb,
   '/contact',
   4,
   true,
   true,
   'published'
  )
ON CONFLICT (slug) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  short_description_translations = EXCLUDED.short_description_translations,
  full_description_translations = EXCLUDED.full_description_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  icon_name = EXCLUDED.icon_name,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status;

-- =============================================================================
-- Process Steps
-- =============================================================================

INSERT INTO public.process_steps (step_key, number, title_translations, description_translations, icon_name, display_order, is_visible)
VALUES
  ('discovery', 1,
   '{"en": "Discovery", "de": "Analyse", "fr": "Découverte", "es": "Descubrimiento"}'::jsonb,
   '{"en": "We dive deep into your business goals, audience, and challenges to build a rock-solid foundation for every decision.", "de": "Wir tauchen tief in Ihre Geschäftsziele, Zielgruppe und Herausforderungen ein, um ein felsenfestes Fundament für jede Entscheidung zu schaffen.", "fr": "Nous plongeons au cœur de vos objectifs, de votre audience et de vos défis pour bâtir une base solide pour chaque décision.", "es": "Nos sumergimos en tus objetivos comerciales, audiencia y desafíos para construir una base sólida para cada decisión."}'::jsonb,
   'search',
   1,
   true
  ),
  ('strategy', 2,
   '{"en": "Strategy", "de": "Strategie", "fr": "Stratégie", "es": "Estrategia"}'::jsonb,
   '{"en": "We design a comprehensive plan covering brand, web, AI, and growth, aligned with your revenue targets.", "de": "Wir entwerfen einen umfassenden Plan für Marke, Web, KI und Wachstum, abgestimmt auf Ihre Umsatzziele.", "fr": "Nous concevons un plan complet couvrant la marque, le web, l''IA et la croissance, aligné sur vos objectifs de revenus.", "es": "Diseñamos un plan integral que cubre marca, web, IA y crecimiento, alineado con tus objetivos de ingresos."}'::jsonb,
   'lightbulb',
   2,
   true
  ),
  ('execution', 3,
   '{"en": "Build", "de": "Umsetzung", "fr": "Création", "es": "Construcción"}'::jsonb,
   '{"en": "Our team implements systems, websites, automations, and campaigns with precision engineering.", "de": "Unser Team setzt Systeme, Websites, Automatisierungen und Kampagnen mit präziser Ingenieurskunst um.", "fr": "Notre équipe met en œuvre des systèmes, des sites web, des automatisations et des campagnes avec une ingénierie de précision.", "es": "Nuestro equipo implementa sistemas, sitios web, automatizaciones y campañas con ingeniería de precisión."}'::jsonb,
   'settings',
   3,
   true
  ),
  ('growth', 4,
   '{"en": "Launch & Grow", "de": "Start & Wachstum", "fr": "Lancement & Croissance", "es": "Lanzamiento y crecimiento"}'::jsonb,
   '{"en": "We optimize, scale, and measure everything. Continuous improvement is built into our DNA.", "de": "Wir optimieren, skalieren und messen alles. Kontinuierliche Verbesserung liegt in unserer DNA.", "fr": "Nous optimisons, développons et mesurons tout. L''amélioration continue fait partie de notre ADN.", "es": "Optimizamos, escalamos y medimos todo. La mejora continua está en nuestro ADN."}'::jsonb,
   'rocket',
   4,
   true
  )
ON CONFLICT (step_key) DO UPDATE SET
  number = EXCLUDED.number,
  title_translations = EXCLUDED.title_translations,
  description_translations = EXCLUDED.description_translations,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Why Choose Us (Singleton)
-- =============================================================================

INSERT INTO public.why_choose_us (singleton_key, eyebrow_translations, title_translations, description_translations, items, variant, is_visible)
VALUES (
  true,
  '{"en": "Why Us", "de": "Warum wir", "fr": "Pourquoi nous", "es": "Por qué nosotros"}'::jsonb,
  '{"en": "Not Just Another Agency", "de": "Nicht nur eine weitere Agentur", "fr": "Pas juste une autre agence", "es": "No solo otra agencia"}'::jsonb,
  '{"en": "We build digital assets that drive valuation and market authority, not just websites.", "de": "Wir bauen digitale Assets, die Bewertung und Marktautorität steigern, nicht nur Websites.", "fr": "Nous créons des actifs numériques qui augmentent la valorisation et l''autorité de marché, pas seulement des sites web.", "es": "Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web."}'::jsonb,
   '[{"icon": "shield", "title": {"en": "Senior-only team", "de": "Nur Senior-Team", "fr": "Équipe senior uniquement", "es": "Equipo solo senior"}, "description": {"en": "Every person shipping work has 7+ years of production experience.", "de": "Jede Person, die an Ihrem Projekt arbeitet, hat 7+ Jahre Produktionserfahrung.", "fr": "Chaque personne livrant du travail a plus de 7 ans d''expérience en production.", "es": "Cada persona que trabaja en su proyecto tiene más de 7 años de experiencia en producción."}, "stat_value": "50+", "stat_label": {"en": "Shipped projects", "de": "Gelieferte Projekte", "fr": "Projets livrés", "es": "Proyectos entregados"}}, {"icon": "check", "title": {"en": "Outcome-priced", "de": "Ergebnisbasiert", "fr": "Facturation au résultat", "es": "Precio por resultados"}, "description": {"en": "We price on shipped value, not hours logged.", "de": "Wir bepreisen gelieferten Wert, nicht abgerechnete Stunden.", "fr": "Nous facturons la valeur livrée, pas les heures passées.", "es": "Cobramos por el valor entregado, no por las horas registradas."}, "stat_value": "98%", "stat_label": {"en": "Client retention", "de": "Kundenbindung", "fr": "Fidélisation client", "es": "Retención de clientes"}}, {"icon": "bolt", "title": {"en": "Async-first", "de": "Asynchron zuerst", "fr": "Async d''abord", "es": "Primero asíncrono"}, "description": {"en": "Tight spec docs, recorded Looms, weekly demos, never a status meeting.", "de": "Präzise Spezifikationen, aufgenommene Looms, wöchentliche Demos, nie ein Status-Meeting.", "fr": "Des specs précises, des Loom enregistrés, des démos hebdomadaires, jamais de réunion de statut.", "es": "Documentos de especificación precisos, Loom grabados, demos semanales: nunca una reunión de estado."}, "stat_value": "12", "stat_label": {"en": "Years experience", "de": "Jahre Erfahrung", "fr": "Années d''expérience", "es": "Años de experiencia"}}, {"icon": "users", "title": {"en": "Full-stack", "de": "Full-Stack", "fr": "Full-stack", "es": "Full-stack"}, "description": {"en": "Brand, engineering, and growth in one team.", "de": "Marke, Entwicklung und Wachstum in einem Team.", "fr": "Marque, ingénierie et croissance dans une seule équipe.", "es": "Marca, ingeniería y crecimiento en un solo equipo."}, "stat_value": "40+", "stat_label": {"en": "Country reach", "de": "Länderabdeckung", "fr": "Portée pays", "es": "Alcance de países"}}]'::jsonb,
  'default',
  true
)
ON CONFLICT (singleton_key) DO UPDATE SET
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  description_translations = EXCLUDED.description_translations,
  items = EXCLUDED.items;

-- =============================================================================
-- Acquisition Section (Singleton)
-- =============================================================================

INSERT INTO public.acquisition_section (singleton_key, title_translations, description_translations, benefits, cta_label_translations, cta_url, variant, is_visible)
VALUES (
  true,
  '{"en": "Buy a Business", "de": "Unternehmen kaufen", "fr": "Acheter une entreprise", "es": "Comprar un negocio"}'::jsonb,
  '{"en": "Looking to acquire a digital business? We help you find and evaluate opportunities.", "de": "Sie möchten ein digitales Unternehmen erwerben? Wir helfen Ihnen, Opportunities zu finden und zu bewerten.", "fr": "Vous cherchez à acquérir une entreprise numérique ? Nous vous aidons à trouver et évaluer les opportunités.", "es": "¿Buscas adquirir un negocio digital? Te ayudamos a encontrar y evaluar oportunidades."}'::jsonb,
   '[{"icon": "Check", "text": {"en": "Curated opportunities", "de": "Kuratierte Möglichkeiten", "fr": "Opportunités sélectionnées", "es": "Oportunidades seleccionadas"}}, {"icon": "Check", "text": {"en": "Due diligence support", "de": "Due-Diligence-Unterstützung", "fr": "Support de due diligence", "es": "Apoyo de debida diligencia"}}, {"icon": "Check", "text": {"en": "Transition guidance", "de": "Übergangsberatung", "fr": "Accompagnement de transition", "es": "Guía de transición"}}]'::jsonb,
  '{"en": "Explore Opportunities", "de": "Möglichkeiten erkunden", "fr": "Explorer les opportunités", "es": "Explorar oportunidades"}'::jsonb,
  '/buy-business',
  'default',
  true
)
ON CONFLICT (singleton_key) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  description_translations = EXCLUDED.description_translations,
  benefits = EXCLUDED.benefits,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url;

-- =============================================================================
-- Pricing Plans
-- =============================================================================

INSERT INTO public.pricing_plans (slug, name_translations, description_translations, price_label_translations, billing_label_translations, features_translations, limitations_translations, cta_label_translations, cta_url, display_order, is_featured, is_visible, status)
VALUES
  ('launch',
   '{"en": "Launch", "de": "Start", "fr": "Lancement", "es": "Lanzamiento"}'::jsonb,
   '{"en": "Perfect for startups needing an MVP and brand foundation.", "de": "Perfekt für Startups, die ein MVP und ein Markenfundament benötigen.", "fr": "Parfait pour les startups ayant besoin d un MVP et de fondations de marque.", "es": "Perfecto para startups que necesitan un MVP y una base de marca."}'::jsonb,
   '{"en": "$5,000", "de": "$5.000", "fr": "5 000 $", "es": "$5,000"}'::jsonb,
   '{"en": "/ project", "de": "/ Projekt", "fr": "/ projet", "es": "/ proyecto"}'::jsonb,
   '{"en": ["Identity & Logo Design", "5-Page Responsive Website", "Basic SEO Setup", "2 Weeks of Support"], "de": ["Identität & Logo-Design", "5-Seiten Responsive Website", "Basis-SEO-Setup", "2 Wochen Support"], "fr": ["Identité & conception de logo", "Site responsive de 5 pages", "Configuration SEO de base", "2 semaines de support"], "es": ["Identidad y diseño de logo", "Sitio web responsive de 5 páginas", "Configuración SEO básica", "2 semanas de soporte"]}'::jsonb,
   '[]'::jsonb,
   '{"en": "Get Started", "de": "Jetzt starten", "fr": "Commencer", "es": "Empezar"}'::jsonb,
   '/contact',
   1,
   false,
   true,
   'published'
  ),
  ('grow',
   '{"en": "Grow", "de": "Wachsen", "fr": "Croissance", "es": "Crecimiento"}'::jsonb,
   '{"en": "For brands ready to capture market share and scale.", "de": "Für Marken, die Marktanteile gewinnen und skalieren möchten.", "fr": "Pour les marques prêtes à conquérir des parts de marché et à se développer.", "es": "Para marcas listas para captar cuota de mercado y escalar."}'::jsonb,
   '{"en": "$12,000", "de": "$12.000", "fr": "12 000 $", "es": "$12,000"}'::jsonb,
   '{"en": "/ project", "de": "/ Projekt", "fr": "/ projet", "es": "/ proyecto"}'::jsonb,
   '{"en": ["Full Brand System", "Custom Web App / E-commerce", "CMS Integration", "3 Months Growth Marketing", "30 Days Post-Launch Support"], "de": ["Vollständiges Markensystem", "Individuelle Web-App / E-Commerce", "CMS-Integration", "3 Monate Growth Marketing", "30 Tage Support nach Launch"], "fr": ["Système de marque complet", "Web App sur mesure / E-commerce", "Intégration CMS", "3 mois de marketing de croissance", "30 jours de support post-lancement"], "es": ["Sistema de marca completo", "Web App personalizada / E-commerce", "Integración CMS", "3 meses de marketing de crecimiento", "30 días de soporte post-lanzamiento"]}'::jsonb,
   '[]'::jsonb,
   '{"en": "Get Started", "de": "Jetzt starten", "fr": "Commencer", "es": "Empezar"}'::jsonb,
   '/contact',
   2,
   true,
   true,
   'published'
  ),
  ('scale',
   '{"en": "Scale", "de": "Skalieren", "fr": "Échelle", "es": "Escala"}'::jsonb,
   '{"en": "Enterprise-grade solutions for established companies.", "de": "Enterprise-Lösungen für etablierte Unternehmen.", "fr": "Solutions de niveau entreprise pour les sociétés établies.", "es": "Soluciones de nivel empresarial para empresas establecidas."}'::jsonb,
   '{"en": "$25,000", "de": "$25.000", "fr": "25 000 $", "es": "$25,000"}'::jsonb,
   '{"en": "/ project", "de": "/ Projekt", "fr": "/ projet", "es": "/ proyecto"}'::jsonb,
   '{"en": ["Complex Systems Architecture", "Dedicated Product Team", "AI & Automation Suite", "Full Growth Engine Setup", "24/7 SLA Support"], "de": ["Komplexe Systemarchitektur", "Dediziertes Produktteam", "KI- & Automatisierungs-Suite", "Vollständiges Growth-Engine-Setup", "24/7 SLA-Support"], "fr": ["Architecture de systèmes complexes", "Équipe produit dédiée", "Suite IA & automatisation", "Configuration complète du moteur de croissance", "Support SLA 24/7"], "es": ["Arquitectura de sistemas complejos", "Equipo de producto dedicado", "Suite de IA y automatización", "Configuración completa del motor de crecimiento", "Soporte SLA 24/7"]}'::jsonb,
   '[]'::jsonb,
   '{"en": "Contact Sales", "de": "Vertrieb kontaktieren", "fr": "Contacter les ventes", "es": "Contactar ventas"}'::jsonb,
   '/contact',
   3,
   false,
   true,
   'published'
  ),
  ('custom',
   '{"en": "Custom", "de": "Individuell", "fr": "Sur mesure", "es": "Personalizado"}'::jsonb,
   '{"en": "Tailored solutions for unique challenges and enterprise scale.", "de": "Maßgeschneiderte Lösungen für einzigartige Herausforderungen und Enterprise-Skalierung.", "fr": "Solutions sur mesure pour des défis uniques et une échelle entreprise.", "es": "Soluciones a medida para desafíos únicos y escala empresarial."}'::jsonb,
   '{"en": "Let''s Talk", "de": "Sprechen wir", "fr": "Discutons", "es": "Hablemos"}'::jsonb,
   '{}'::jsonb,
   '{"en": ["Custom Scope & Timeline", "Multi-Discipline Team", "Unlimited Revisions", "Dedicated Account Manager", "Priority Support"], "de": ["Individueller Umfang & Zeitplan", "Multidisziplinäres Team", "Unbegrenzte Überarbeitungen", "Dedizierter Account-Manager", "Priorisierter Support"], "fr": ["Périmètre et calendrier personnalisés", "Équipe multidisciplinaire", "Révisions illimitées", "Gestionnaire de compte dédié", "Support prioritaire"], "es": ["Alcance y cronograma personalizados", "Equipo multidisciplinario", "Revisiones ilimitadas", "Gerente de cuenta dedicado", "Soporte prioritario"]}'::jsonb,
   '[]'::jsonb,
   '{"en": "Book a Call", "de": "Anruf buchen", "fr": "Réserver un appel", "es": "Reservar llamada"}'::jsonb,
   '/contact',
   4,
   false,
   true,
   'published'
  )
ON CONFLICT (slug) DO UPDATE SET
  name_translations = EXCLUDED.name_translations,
  description_translations = EXCLUDED.description_translations,
  price_label_translations = EXCLUDED.price_label_translations,
  billing_label_translations = EXCLUDED.billing_label_translations,
  features_translations = EXCLUDED.features_translations,
  limitations_translations = EXCLUDED.limitations_translations,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status;

-- =============================================================================
-- FAQs
-- =============================================================================

INSERT INTO public.faqs (id, question_translations, answer_translations, category, display_order, is_featured, is_visible, is_ai_eligible, status)
VALUES
  ('40000000-0000-4000-8000-000000000001', '{"en": "What is the typical timeline for a branding project?", "de": "Wie lange dauert ein typisches Branding-Projekt?", "fr": "Quel est le délai typique d''un projet de branding ?", "es": "¿Cuál es el plazo típico de un proyecto de branding?"}'::jsonb,
   '{"en": "A standard branding project spans 4-6 weeks from discovery to final delivery. Timelines are tailored to scope - brand strategy and identity rollouts may extend to 8 weeks.", "de": "Ein Standard-Branding-Projekt dauert 4–6 Wochen von der Discovery bis zur finalen Auslieferung. Die Zeitpläne werden an den Umfang angepasst, Markenstrategie- und Identitäts-Rollouts können sich auf 8 Wochen verlängern.", "fr": "Un projet de branding standard s''étend sur 4 à 6 semaines, de la découverte à la livraison finale. Les délais sont adaptés au périmètre, les déploiements de stratégie de marque et d''identité peuvent aller jusqu''à 8 semaines.", "es": "Un proyecto de branding estándar dura de 4 a 6 semanas, desde el descubrimiento hasta la entrega final. Los plazos se adaptan al alcance: los despliegues de estrategia e identidad de marca pueden extenderse hasta 8 semanas."}'::jsonb,
   'process',
   1,
   true,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000002', '{"en": "Do you offer post-launch support?", "de": "Bieten Sie Support nach dem Launch an?", "fr": "Proposez-vous un support après le lancement ?", "es": "¿Ofrecen soporte después del lanzamiento?"}'::jsonb,
   '{"en": "Yes. Every engagement includes a post-launch support window, and ongoing care plans are available to keep your systems optimized and updated.", "de": "Ja. Jedes Projekt umfasst ein Support-Fenster nach dem Launch, und laufende Pflegepläne halten Ihre Systeme optimiert und aktuell.", "fr": "Oui. Chaque mission inclut une période de support après le lancement, et des plans de maintenance continue sont disponibles pour garder vos systèmes optimisés et à jour.", "es": "Sí. Cada proyecto incluye una ventana de soporte posterior al lanzamiento, y hay planes de mantenimiento continuo disponibles para mantener sus sistemas optimizados y actualizados."}'::jsonb,
   'general',
   2,
   false,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000003', '{"en": "How are the payments structured?", "de": "Wie sind die Zahlungen strukturiert?", "fr": "Comment les paiements sont-ils structurés ?", "es": "¿Cómo se estructuran los pagos?"}'::jsonb,
   '{"en": "Payments are made on a milestone basis. A down payment starts the project, with further installments following each delivery stage. The final payment is due at launch.", "de": "Zahlungen erfolgen meilensteinbasiert. Eine Anzahlung startet das Projekt, weitere Raten folgen nach jeder Lieferphase. Die Schlusszahlung ist zum Launch fällig.", "fr": "Les paiements sont échelonnés par jalons. Un acompte démarre le projet, puis des versements suivent chaque étape de livraison. Le paiement final est dû au lancement.", "es": "Los pagos se realizan por hitos. Un anticipo inicia el proyecto, y los siguientes plazos se abonan tras cada fase de entrega. El pago final vence en el lanzamiento."}'::jsonb,
   'pricing',
   3,
   false,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000004', '{"en": "Which technology stack do you use?", "de": "Welchen Technologie-Stack verwenden Sie?", "fr": "Quelle stack technologique utilisez-vous ?", "es": "¿Qué stack tecnológico utilizan?"}'::jsonb,
   '{"en": "We develop with Next.js, React, TypeScript, Tailwind CSS and Supabase, hosted on Vercel, a modern, fast and scalable stack.", "de": "Wir entwickeln mit Next.js, React, TypeScript, Tailwind CSS und Supabase, gehostet auf Vercel, ein moderner, schneller und skalierbarer Stack.", "fr": "Nous développons avec Next.js, React, TypeScript, Tailwind CSS et Supabase, hébergés sur Vercel, une stack moderne, rapide et évolutive.", "es": "Desarrollamos con Next.js, React, TypeScript, Tailwind CSS y Supabase, alojado en Vercel: un stack moderno, rápido y escalable."}'::jsonb,
   'services',
   4,
   false,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000005', '{"en": "Can you work with our existing systems and tools?", "de": "Können Sie mit unseren bestehenden Systemen und Tools arbeiten?", "fr": "Pouvez-vous travailler avec nos systèmes et outils existants ?", "es": "¿Pueden trabajar con nuestros sistemas y herramientas existentes?"}'::jsonb,
   '{"en": "Yes. We integrate into your existing stack, whether CMS, CRM or your own systems, and document every integration.", "de": "Ja. Wir integrieren uns in Ihren bestehenden Stack, ob CMS, CRM oder Ihre eigenen Systeme, und dokumentieren jede Integration.", "fr": "Oui. Nous nous intégrons à votre stack existant, CMS, CRM ou vos propres systèmes, et documentons chaque intégration.", "es": "Sí. Nos integramos en su stack existente, ya sea CMS, CRM o sus propios sistemas, y documentamos cada integración."}'::jsonb,
   'services',
   5,
   false,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000006', '{"en": "Do you handle ongoing marketing after the launch?", "de": "Übernehmen Sie das laufende Marketing nach dem Launch?", "fr": "Gérez-vous le marketing continu après le lancement ?", "es": "¿Se encargan del marketing continuo después del lanzamiento?"}'::jsonb,
   '{"en": "Yes. We offer growth retainers for SEO, paid media, and conversion optimization to achieve continuous results even after launch.", "de": "Ja. Wir bieten Growth-Retainer für SEO, Paid Media und Conversion-Optimierung an, um auch nach dem Launch kontinuierliche Ergebnisse zu erzielen.", "fr": "Oui. Nous proposons des formules growth pour le SEO, les médias payants et l''optimisation de la conversion afin d''obtenir des résultats continus même après le lancement.", "es": "Sí. Ofrecemos retainers de growth para SEO, medios de pago y optimización de conversión para lograr resultados continuos incluso después del lanzamiento."}'::jsonb,
   'services',
   6,
   false,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000007', '{"en": "What is your approach to AI and automation?", "de": "Wie gehen Sie mit KI und Automatisierung um?", "fr": "Quelle est votre approche de l''IA et de l''automatisation ?", "es": "¿Cuál es su enfoque hacia la IA y la automatización?"}'::jsonb,
   '{"en": "We identify valuable, repetitive processes and implement AI and automation where they deliver measurable time and cost savings.", "de": "Wir identifizieren wertvolle, wiederkehrende Prozesse und setzen KI und Automatisierung dort ein, wo sie messbare Zeit- und Kostenersparnisse bringen.", "fr": "Nous identifions les processus répétitifs à forte valeur et mettons en œuvre l''IA et l''automatisation là où elles apportent des gains de temps et de coûts mesurables.", "es": "Identificamos procesos valiosos y repetitivos e implementamos IA y automatización donde generan ahorros de tiempo y costes medibles."}'::jsonb,
   'services',
   7,
   false,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000008', '{"en": "How do you measure success?", "de": "Wie messen Sie Erfolg?", "fr": "Comment mesurez-vous le succès ?", "es": "¿Cómo miden el éxito?"}'::jsonb,
   '{"en": "We define success together in advance based on clear KPIs and report on it transparently throughout the entire project.", "de": "Wir definieren den Erfolg vorab gemeinsam anhand klarer KPIs und berichten transparent während des gesamten Projekts darüber.", "fr": "Nous définissons le succès ensemble à l''avance sur la base de KPI clairs et en rendons compte de manière transparente tout au long du projet.", "es": "Definimos el éxito juntos de antemano a partir de KPI claros e informamos de él de forma transparente durante todo el proyecto."}'::jsonb,
   'process',
   8,
   false,
   true,
   true,
   'published'
  )
ON CONFLICT (id) DO UPDATE SET
  question_translations = EXCLUDED.question_translations,
  answer_translations = EXCLUDED.answer_translations,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured,
  is_visible = EXCLUDED.is_visible,
  is_ai_eligible = EXCLUDED.is_ai_eligible,
  status = EXCLUDED.status;

-- =============================================================================
-- Chatbot Settings (Singleton)
-- =============================================================================

INSERT INTO public.chatbot_settings (singleton_key, is_enabled, welcome_message_translations, offline_message_translations, escalation_message_translations, fallback_message_translations, lead_capture_mode, human_support_enabled, allowed_categories, response_style)
VALUES (
  true,
  true,
  '{"en": "Hi! I am the Stratifit assistant. Ask me about our services, pricing, process, or how we can help your business.", "de": "Hallo! Ich bin der Stratifit-Assistent. Fragen Sie mich zu unseren Leistungen, Preisen, Prozessen oder wie wir Ihrem Unternehmen helfen können.", "fr": "Bonjour ! Je suis l''assistant Stratifit. Posez-moi des questions sur nos services, nos tarifs, notre processus ou la façon dont nous pouvons aider votre entreprise.", "es": "¡Hola! Soy el asistente de Stratifit. Pregúntame sobre nuestros servicios, precios, procesos o cómo podemos ayudar a tu negocio."}'::jsonb,
  '{"en": "We are currently offline. Please leave your message and we will get back to you.", "de": "Wir sind derzeit offline. Bitte hinterlassen Sie Ihre Nachricht und wir melden uns bei Ihnen.", "fr": "Nous sommes actuellement hors ligne. Veuillez laisser votre message et nous vous répondrons.", "es": "Estamos fuera de línea actualmente. Por favor deja tu mensaje y te responderemos."}'::jsonb,
  '{"en": "A team member has been notified and will join this chat shortly.", "de": "Ein Teammitglied wurde benachrichtigt und wird sich gleich diesem Chat anschließen.", "fr": "Un membre de l''équipe a été prévenu et rejoindra bientôt cette conversation.", "es": "Se ha notificado a un miembro del equipo y se unirá a este chat en breve."}'::jsonb,
  '{"en": "I could not find a clear answer to that yet. You can ask me about our services, pricing, or process, or leave your email and our team will get back to you.", "de": "Dazu habe ich noch keine klare Antwort. Sie können mich zu unseren Leistungen, Preisen oder Prozessen fragen, oder hinterlassen Sie Ihre E-Mail und unser Team meldet sich bei Ihnen.", "fr": "Je n''ai pas encore trouvé de réponse claire à cela. Vous pouvez me poser des questions sur nos services, nos tarifs ou notre processus, ou laisser votre email et notre équipe vous répondra.", "es": "Aún no encontré una respuesta clara para eso. Puedes preguntarme sobre nuestros servicios, precios o procesos, o dejar tu correo y nuestro equipo te responderá."}'::jsonb,
  'after_resolution',
  true,
  ARRAY['general', 'services', 'pricing', 'process', 'acquisition'],
  'professional'
)
ON CONFLICT (singleton_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  welcome_message_translations = EXCLUDED.welcome_message_translations,
  offline_message_translations = EXCLUDED.offline_message_translations,
  escalation_message_translations = EXCLUDED.escalation_message_translations,
  fallback_message_translations = EXCLUDED.fallback_message_translations,
  allowed_categories = EXCLUDED.allowed_categories,
  response_style = EXCLUDED.response_style;

-- =============================================================================
-- Chatbot Knowledge Base (main chatbot Q&A, all four languages)
-- =============================================================================

INSERT INTO public.chatbot_knowledge
  (slug, title_translations, content_translations, category, source_type, priority, is_enabled, is_ai_eligible)
VALUES
  ('about-stratifit',
   '{"en": "What is Stratifit?", "de": "Was ist Stratifit?", "fr": "Qu''est-ce que Stratifit ?", "es": "¿Qué es Stratifit?"}'::jsonb,
   '{"en": "Stratifit is a premium multilingual digital agency. We deliver brand design, website development, AI automation, and growth marketing. We build digital assets that drive valuation and market authority, not just websites.", "de": "Stratifit ist eine Premium-Digitalagentur mit mehrsprachigem Angebot. Wir liefern Markengestaltung, Webentwicklung, KI-Automatisierung und Growth Marketing. Wir bauen digitale Assets, die Bewertung und Marktautorität steigern, nicht nur Websites.", "fr": "Stratifit est une agence digitale premium multilingue. Nous proposons du design de marque, du développement web, de l''automatisation par IA et du marketing de croissance. Nous créons des actifs numériques qui augmentent la valorisation et l''autorité de marché, pas seulement des sites web.", "es": "Stratifit es una agencia digital premium multilingüe. Ofrecemos diseño de marca, desarrollo web, automatización con IA y marketing de crecimiento. Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web."}'::jsonb,
   'general', 'manual', 100, true, true),
  ('services-overview',
   '{"en": "What services do you offer?", "de": "Welche Leistungen bieten Sie an?", "fr": "Quels services proposez-vous ?", "es": "¿Qué servicios ofrecen?"}'::jsonb,
   '{"en": "We offer four core services: Brand Design, Website Development, AI and Automation, and Growth Marketing. We also help buyers acquire digital businesses. You can see all services at /services.", "de": "Wir bieten vier Kernleistungen: Markengestaltung, Webentwicklung, KI und Automatisierung sowie Growth Marketing. Wir unterstützen außerdem Käufer beim Erwerb digitaler Unternehmen. Alle Leistungen finden Sie unter /services.", "fr": "Nous proposons quatre services principaux : design de marque, développement web, IA et automatisation, et marketing de croissance. Nous aidons aussi les acheteurs à acquérir des entreprises numériques. Tous les services sont listés sur /services.", "es": "Ofrecemos cuatro servicios principales: diseño de marca, desarrollo web, IA y automatización, y marketing de crecimiento. También ayudamos a compradores a adquirir negocios digitales. Puede ver todos los servicios en /services."}'::jsonb,
   'services', 'manual', 100, true, true),
  ('why-choose-us',
   '{"en": "Why should I choose Stratifit?", "de": "Warum sollte ich Stratifit wählen?", "fr": "Pourquoi choisir Stratifit ?", "es": "¿Por qué debería elegir Stratifit?"}'::jsonb,
   '{"en": "We are a senior-only team with 7+ years of production experience, outcome-priced (we charge for shipped value, not hours), and async-first with weekly demos. We have shipped 50+ projects across 40+ countries with 98% client retention.", "de": "Wir sind ein reines Senior-Team mit über 7 Jahren Produktionserfahrung, ergebnisbasiert bepreist (wir berechnen gelieferten Wert, nicht Stunden) und arbeiten asynchron mit wöchentlichen Demos. Wir haben über 50 Projekte in mehr als 40 Ländern geliefert, mit 98 % Kundenbindung.", "fr": "Nous sommes une équipe 100 % senior avec plus de 7 ans d''expérience en production, facturée au résultat (nous facturons la valeur livrée, pas les heures) et async-first avec des démos hebdomadaires. Nous avons livré plus de 50 projets dans plus de 40 pays avec 98 % de fidélisation.", "es": "Somos un equipo solo senior con más de 7 años de experiencia en producción, cobramos por resultados (el valor entregado, no las horas) y trabajamos de forma asíncrona con demos semanales. Hemos entregado más de 50 proyectos en más de 40 países con un 98 % de retención de clientes."}'::jsonb,
   'general', 'manual', 90, true, true),
  ('contact-info',
   '{"en": "How can I contact Stratifit?", "de": "Wie kann ich Stratifit kontaktieren?", "fr": "Comment contacter Stratifit ?", "es": "¿Cómo puedo contactar con Stratifit?"}'::jsonb,
   '{"en": "You can reach us through the contact form on the Contact page (/contact). We typically respond within 24 hours. You can also book a free strategy call through the site.", "de": "Sie erreichen uns über das Kontaktformular auf der Kontaktseite (/contact). Wir antworten in der Regel innerhalb von 24 Stunden. Sie können über die Website auch ein kostenloses Strategiegespräch buchen.", "fr": "Vous pouvez nous joindre via le formulaire de contact sur la page Contact (/contact). Nous répondons généralement sous 24 heures. Vous pouvez aussi réserver un appel stratégie gratuit sur le site.", "es": "Puede contactarnos a través del formulario de la página de Contacto (/contact). Normalmente respondemos en menos de 24 horas. También puede reservar una llamada estratégica gratuita a través del sitio."}'::jsonb,
   'general', 'manual', 90, true, true),
  ('service-brand-design',
   '{"en": "What does Brand Design include?", "de": "Was umfasst die Markengestaltung?", "fr": "Que comprend le design de marque ?", "es": "¿Qué incluye el diseño de marca?"}'::jsonb,
   '{"en": "Brand Design covers brand strategy, logo design, visual identity, color systems, typography, brand guidelines, and asset kits. It creates a distinctive identity that communicates credibility and strategic positioning.", "de": "Markengestaltung umfasst Markenstrategie, Logo-Design, visuelle Identität, Farbsysteme, Typografie, Markenrichtlinien und Asset-Kits. Sie schafft eine unverwechselbare Identität, die Glaubwürdigkeit und strategische Positionierung vermittelt.", "fr": "Le design de marque comprend la stratégie de marque, le design de logo, l''identité visuelle, les systèmes de couleurs, la typographie, les directives de marque et les kits d''assets. Il crée une identité distinctive qui communique crédibilité et positionnement stratégique.", "es": "El diseño de marca incluye estrategia de marca, diseño de logo, identidad visual, sistemas de colores, tipografía, directrices de marca y kits de recursos. Crea una identidad distintiva que comunica credibilidad y posicionamiento estratégico."}'::jsonb,
   'services', 'manual', 80, true, true),
  ('service-website-development',
   '{"en": "What types of websites do you build?", "de": "Welche Arten von Websites bauen Sie?", "fr": "Quels types de sites web construisez-vous ?", "es": "¿Qué tipos de sitios web construyen?"}'::jsonb,
   '{"en": "We build custom websites, e-commerce stores, web applications, and multilingual sites, with CMS integration, performance optimization, and maintenance. Our sites are engineered for speed, scalability, and conversion.", "de": "Wir bauen individuelle Websites, E-Commerce-Shops, Webanwendungen und mehrsprachige Websites, mit CMS-Integration, Performance-Optimierung und Wartung. Unsere Websites sind auf Geschwindigkeit, Skalierbarkeit und Conversion ausgelegt.", "fr": "Nous construisons des sites sur mesure, des boutiques e-commerce, des applications web et des sites multilingues, avec intégration CMS, optimisation des performances et maintenance. Nos sites sont conçus pour la vitesse, la scalabilité et la conversion.", "es": "Construimos sitios web personalizados, tiendas de e-commerce, aplicaciones web y sitios multilingües, con integración de CMS, optimización de rendimiento y mantenimiento. Nuestros sitios están diseñados para velocidad, escalabilidad y conversión."}'::jsonb,
   'services', 'manual', 80, true, true),
  ('service-ai-automation',
   '{"en": "What does AI and Automation include?", "de": "Was umfasst KI und Automatisierung?", "fr": "Que comprend l''IA et l''automatisation ?", "es": "¿Qué incluye la IA y la automatización?"}'::jsonb,
   '{"en": "We build AI chatbots, FAQ assistants, lead qualification, workflow automation, CRM integration, custom APIs, and email automation. These systems reduce repetitive work and improve customer communication.", "de": "Wir erstellen KI-Chatbots, FAQ-Assistenten, Lead-Qualifizierung, Workflow-Automatisierung, CRM-Integration, individuelle APIs und E-Mail-Automatisierung. Diese Systeme reduzieren repetitive Arbeit und verbessern die Kundenkommunikation.", "fr": "Nous créons des chatbots IA, des assistants FAQ, la qualification de leads, l''automatisation des workflows, l''intégration CRM, des APIs sur mesure et l''automatisation des emails. Ces systèmes réduisent le travail répétitif et améliorent la communication client.", "es": "Creamos chatbots con IA, asistentes de FAQ, calificación de leads, automatización de flujos de trabajo, integración con CRM, APIs personalizadas y automatización de correos. Estos sistemas reducen el trabajo repetitivo y mejoran la comunicación con los clientes."}'::jsonb,
   'services', 'manual', 80, true, true),
  ('service-growth-marketing',
   '{"en": "What does Growth Marketing include?", "de": "Was umfasst Growth Marketing?", "fr": "Que comprend le marketing de croissance ?", "es": "¿Qué incluye el marketing de crecimiento?"}'::jsonb,
   '{"en": "Growth Marketing covers SEO, SEM, performance marketing, content strategy, social media, conversion rate optimization, analytics, and growth audits. We build data-driven systems that improve visibility and attract qualified audiences.", "de": "Growth Marketing umfasst SEO, SEM, Performance-Marketing, Content-Strategie, Social Media, Conversion-Optimierung, Analytics und Growth-Audits. Wir bauen datengetriebene Systeme, die Sichtbarkeit verbessern und qualifizierte Zielgruppen anziehen.", "fr": "Le marketing de croissance comprend le SEO, le SEM, le marketing de performance, la stratégie de contenu, les réseaux sociaux, l''optimisation du taux de conversion, l''analytique et les audits de croissance. Nous créons des systèmes basés sur les données qui améliorent la visibilité et attirent des audiences qualifiées.", "es": "El marketing de crecimiento incluye SEO, SEM, marketing de rendimiento, estrategia de contenido, redes sociales, optimización de conversión, analítica y auditorías de crecimiento. Construimos sistemas basados en datos que mejoran la visibilidad y atraen audiencias cualificadas."}'::jsonb,
   'services', 'manual', 80, true, true),
  ('existing-systems',
   '{"en": "Can you work with our existing systems and tools?", "de": "Können Sie mit unseren bestehenden Systemen arbeiten?", "fr": "Pouvez-vous travailler avec nos systèmes existants ?", "es": "¿Pueden trabajar con nuestros sistemas existentes?"}'::jsonb,
   '{"en": "Yes. We integrate with your existing stack, whether it is a CMS, CRM, or your own systems, and we document every integration.", "de": "Ja. Wir integrieren uns in Ihren bestehenden Stack, ob CMS, CRM oder eigene Systeme, und dokumentieren jede Integration.", "fr": "Oui. Nous nous intégrons à votre stack existant, que ce soit un CMS, un CRM ou vos propres systèmes, et nous documentons chaque intégration.", "es": "Sí. Nos integramos con su stack existente, ya sea un CMS, un CRM o sus propios sistemas, y documentamos cada integración."}'::jsonb,
   'services', 'manual', 60, true, true),
  ('pricing-overview',
   '{"en": "How much does a project cost?", "de": "Was kostet ein Projekt?", "fr": "Combien coûte un projet ?", "es": "¿Cuánto cuesta un proyecto?"}'::jsonb,
   '{"en": "Our packages are Launch at $5,000, Grow at $12,000, and Scale at $25,000, with Custom projects quoted individually. Final pricing depends on scope and requirements - contact us for a tailored quote.", "de": "Unsere Pakete sind Launch für 5.000 $, Grow für 12.000 $ und Scale für 25.000 $, individuelle Projekte werden separat angeboten. Der endgültige Preis hängt vom Umfang und den Anforderungen ab - kontaktieren Sie uns für ein individuelles Angebot.", "fr": "Nos forfaits sont Launch à 5 000 $, Grow à 12 000 $ et Scale à 25 000 $, avec des projets sur mesure devisés individuellement. Le prix final dépend du périmètre et des besoins - contactez-nous pour un devis personnalisé.", "es": "Nuestros paquetes son Launch por $5,000, Grow por $12,000 y Scale por $25,000, con proyectos personalizados cotizados individualmente. El precio final depende del alcance y los requisitos: contáctenos para un presupuesto a medida."}'::jsonb,
   'pricing', 'manual', 100, true, true),
  ('pricing-launch',
   '{"en": "What is included in the Launch package?", "de": "Was ist im Launch-Paket enthalten?", "fr": "Que comprend le forfait Launch ?", "es": "¿Qué incluye el paquete Launch?"}'::jsonb,
   '{"en": "The Launch package ($5,000) includes identity and logo design, a 5-page responsive website, basic SEO setup, and 2 weeks of support. It is perfect for startups needing an MVP and brand foundation.", "de": "Das Launch-Paket (5.000 $) umfasst Identität und Logo-Design, eine 5-seitige responsive Website, Basis-SEO-Setup und 2 Wochen Support. Es ist perfekt für Startups, die ein MVP und ein Markenfundament benötigen.", "fr": "Le forfait Launch (5 000 $) comprend l''identité et le design de logo, un site responsive de 5 pages, une configuration SEO de base et 2 semaines de support. Il est parfait pour les startups ayant besoin d''un MVP et de fondations de marque.", "es": "El paquete Launch ($5,000) incluye identidad y diseño de logo, un sitio web responsive de 5 páginas, configuración SEO básica y 2 semanas de soporte. Es perfecto para startups que necesitan un MVP y una base de marca."}'::jsonb,
   'pricing', 'manual', 90, true, true),
  ('pricing-grow',
   '{"en": "What is included in the Grow package?", "de": "Was ist im Grow-Paket enthalten?", "fr": "Que comprend le forfait Grow ?", "es": "¿Qué incluye el paquete Grow?"}'::jsonb,
   '{"en": "The Grow package ($12,000) includes a full brand system, a custom web app or e-commerce site, CMS integration, 3 months of growth marketing, and 30 days of post-launch support. It is for brands ready to capture market share and scale.", "de": "Das Grow-Paket (12.000 $) umfasst ein vollständiges Markensystem, eine individuelle Web-App oder E-Commerce-Seite, CMS-Integration, 3 Monate Growth Marketing und 30 Tage Support nach dem Launch. Es ist für Marken gedacht, die Marktanteile gewinnen und skalieren möchten.", "fr": "Le forfait Grow (12 000 $) comprend un système de marque complet, une web app sur mesure ou un site e-commerce, une intégration CMS, 3 mois de marketing de croissance et 30 jours de support post-lancement. Il est destiné aux marques prêtes à conquérir des parts de marché et à se développer.", "es": "El paquete Grow ($12,000) incluye un sistema de marca completo, una web app personalizada o un sitio de e-commerce, integración de CMS, 3 meses de marketing de crecimiento y 30 días de soporte posterior al lanzamiento. Es para marcas listas para ganar cuota de mercado y escalar."}'::jsonb,
   'pricing', 'manual', 90, true, true),
  ('pricing-scale',
   '{"en": "What is included in the Scale package?", "de": "Was ist im Scale-Paket enthalten?", "fr": "Que comprend le forfait Scale ?", "es": "¿Qué incluye el paquete Scale?"}'::jsonb,
   '{"en": "The Scale package ($25,000) includes complex systems architecture, a dedicated product team, an AI and automation suite, a full growth engine setup, and 24/7 SLA support. It is for established companies.", "de": "Das Scale-Paket (25.000 $) umfasst komplexe Systemarchitektur, ein dediziertes Produktteam, eine KI- und Automatisierungs-Suite, ein vollständiges Growth-Engine-Setup und 24/7-SLA-Support. Es ist für etablierte Unternehmen gedacht.", "fr": "Le forfait Scale (25 000 $) comprend l''architecture de systèmes complexes, une équipe produit dédiée, une suite IA et automatisation, une configuration complète du moteur de croissance et un support SLA 24/7. Il est destiné aux entreprises établies.", "es": "El paquete Scale ($25,000) incluye arquitectura de sistemas complejos, un equipo de producto dedicado, una suite de IA y automatización, una configuración completa del motor de crecimiento y soporte SLA 24/7. Es para empresas establecidas."}'::jsonb,
   'pricing', 'manual', 90, true, true),
  ('pricing-custom',
   '{"en": "Do you offer custom or tailored projects?", "de": "Bieten Sie individuelle Projekte an?", "fr": "Proposez-vous des projets sur mesure ?", "es": "¿Ofrecen proyectos personalizados?"}'::jsonb,
   '{"en": "Yes. The Custom option is for unique challenges and enterprise scale: custom scope and timeline, a multi-discipline team, unlimited revisions, a dedicated account manager, and priority support. Contact us to discuss your project.", "de": "Ja. Die Custom-Option ist für einzigartige Herausforderungen und Enterprise-Skalierung gedacht: individueller Umfang und Zeitplan, ein multidisziplinäres Team, unbegrenzte Überarbeitungen, ein dedizierter Account-Manager und priorisierter Support. Kontaktieren Sie uns, um Ihr Projekt zu besprechen.", "fr": "Oui. L''option Sur mesure est destinée aux défis uniques et à l''échelle entreprise : périmètre et calendrier personnalisés, équipe multidisciplinaire, révisions illimitées, gestionnaire de compte dédié et support prioritaire. Contactez-nous pour discuter de votre projet.", "es": "Sí. La opción Personalizado es para desafíos únicos y escala empresarial: alcance y cronograma personalizados, equipo multidisciplinario, revisiones ilimitadas, gerente de cuenta dedicado y soporte prioritario. Contáctenos para hablar de su proyecto."}'::jsonb,
   'pricing', 'manual', 90, true, true),
  ('payment-terms',
   '{"en": "How are payments structured?", "de": "Wie sind die Zahlungen strukturiert?", "fr": "Comment sont structurés les paiements ?", "es": "¿Cómo se estructuran los pagos?"}'::jsonb,
   '{"en": "Payments are milestone-based. A down payment starts the project, further installments follow each delivery stage, and the final payment is due at launch.", "de": "Zahlungen erfolgen meilensteinbasiert. Eine Anzahlung startet das Projekt, weitere Raten folgen nach jeder Lieferphase, und die Schlusszahlung ist zum Launch fällig.", "fr": "Les paiements sont échelonnés par jalons. Un acompte démarre le projet, des versements suivent chaque étape de livraison, et le paiement final est dû au lancement.", "es": "Los pagos se realizan por hitos. Un anticipo inicia el proyecto, los siguientes pagos se abonan tras cada fase de entrega y el pago final vence en el lanzamiento."}'::jsonb,
   'pricing', 'manual', 80, true, true),
  ('process-overview',
   '{"en": "What is your process?", "de": "Wie läuft Ihr Prozess ab?", "fr": "Quel est votre processus ?", "es": "¿Cuál es su proceso?"}'::jsonb,
   '{"en": "Our process has four steps: Discovery (understanding your goals, audience, and challenges), Strategy (a comprehensive plan covering brand, web, AI, and growth), Build (implementation with precision engineering), and Launch and Grow (optimizing, scaling, and measuring everything).", "de": "Unser Prozess hat vier Schritte: Discovery (Verständnis Ihrer Ziele, Zielgruppe und Herausforderungen), Strategie (ein umfassender Plan für Marke, Web, KI und Wachstum), Umsetzung (Implementierung mit präziser Ingenieurskunst) und Start und Wachstum (Optimierung, Skalierung und Messung von allem).", "fr": "Notre processus comporte quatre étapes : Découverte (comprendre vos objectifs, votre audience et vos défis), Stratégie (un plan complet couvrant la marque, le web, l''IA et la croissance), Création (mise en œuvre avec une ingénierie de précision) et Lancement et croissance (optimiser, développer et mesurer tout).", "es": "Nuestro proceso tiene cuatro pasos: Descubrimiento (entender sus objetivos, audiencia y desafíos), Estrategia (un plan integral que cubre marca, web, IA y crecimiento), Construcción (implementación con ingeniería de precisión) y Lanzamiento y crecimiento (optimizar, escalar y medir todo)."}'::jsonb,
   'process', 'manual', 90, true, true),
  ('project-timeline',
   '{"en": "How long does a typical project take?", "de": "Wie lange dauert ein typisches Projekt?", "fr": "Combien de temps prend un projet typique ?", "es": "¿Cuánto tarda un proyecto típico?"}'::jsonb,
   '{"en": "A standard branding project spans 4-6 weeks from discovery to final delivery. Website projects and larger engagements vary by scope. We define clear timelines together before starting.", "de": "Ein Standard-Branding-Projekt dauert 4-6 Wochen von der Discovery bis zur finalen Auslieferung. Website-Projekte und größere Engagements variieren je nach Umfang. Wir definieren klare Zeitpläne gemeinsam, bevor wir starten.", "fr": "Un projet de branding standard s''étend sur 4 à 6 semaines, de la découverte à la livraison finale. Les projets web et les engagements plus importants varient selon le périmètre. Nous définissons ensemble des délais clairs avant de commencer.", "es": "Un proyecto de branding estándar dura de 4 a 6 semanas, desde el descubrimiento hasta la entrega final. Los proyectos web y los compromisos más grandes varían según el alcance. Definimos plazos claros juntos antes de comenzar."}'::jsonb,
   'process', 'manual', 90, true, true),
  ('tech-stack',
   '{"en": "Which technologies do you use?", "de": "Welche Technologien verwenden Sie?", "fr": "Quelles technologies utilisez-vous ?", "es": "¿Qué tecnologías utilizan?"}'::jsonb,
   '{"en": "We build with Next.js, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL), and GSAP, hosted on Vercel. It is a modern, fast, and scalable stack.", "de": "Wir entwickeln mit Next.js, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL) und GSAP, gehostet auf Vercel. Es ist ein moderner, schneller und skalierbarer Stack.", "fr": "Nous développons avec Next.js, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL) et GSAP, hébergés sur Vercel. C''est une stack moderne, rapide et scalable.", "es": "Desarrollamos con Next.js, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL) y GSAP, alojados en Vercel. Es un stack moderno, rápido y escalable."}'::jsonb,
   'process', 'manual', 70, true, true),
  ('post-launch-support',
   '{"en": "Do you offer post-launch support?", "de": "Bieten Sie Support nach dem Launch an?", "fr": "Proposez-vous un support après le lancement ?", "es": "¿Ofrecen soporte después del lanzamiento?"}'::jsonb,
   '{"en": "Yes. Every engagement includes a post-launch support window, and ongoing care plans are available to keep your systems optimized and updated.", "de": "Ja. Jedes Projekt umfasst ein Support-Fenster nach dem Launch, und laufende Pflegepläne halten Ihre Systeme optimiert und aktuell.", "fr": "Oui. Chaque mission inclut une période de support après le lancement, et des plans de maintenance continue gardent vos systèmes optimisés et à jour.", "es": "Sí. Cada proyecto incluye una ventana de soporte posterior al lanzamiento, y hay planes de mantenimiento continuo disponibles para mantener sus sistemas optimizados y actualizados."}'::jsonb,
   'process', 'manual', 80, true, true),
  ('ongoing-marketing',
   '{"en": "Do you handle marketing after launch?", "de": "Übernehmen Sie das Marketing nach dem Launch?", "fr": "Gérez-vous le marketing après le lancement ?", "es": "¿Se encargan del marketing después del lanzamiento?"}'::jsonb,
   '{"en": "Yes. We offer growth retainers for SEO, paid media, and conversion optimization to achieve continuous results even after launch.", "de": "Ja. Wir bieten Growth-Retainer für SEO, Paid Media und Conversion-Optimierung an, um auch nach dem Launch kontinuierliche Ergebnisse zu erzielen.", "fr": "Oui. Nous proposons des formules de growth pour le SEO, les médias payants et l''optimisation de la conversion afin d''obtenir des résultats continus même après le lancement.", "es": "Sí. Ofrecemos retainer de growth para SEO, medios de pago y optimización de conversión para lograr resultados continuos incluso después del lanzamiento."}'::jsonb,
   'process', 'manual', 70, true, true),
  ('success-measurement',
   '{"en": "How do you measure success?", "de": "Wie messen Sie Erfolg?", "fr": "Comment mesurez-vous le succès ?", "es": "¿Cómo miden el éxito?"}'::jsonb,
   '{"en": "We define success together in advance based on clear KPIs and report on it transparently throughout the entire project.", "de": "Wir definieren den Erfolg vorab gemeinsam anhand klarer KPIs und berichten transparent während des gesamten Projekts darüber.", "fr": "Nous définissons le succès ensemble à l''avance sur la base de KPI clairs et en rendons compte de manière transparente tout au long du projet.", "es": "Definimos el éxito juntos de antemano a partir de KPI claros e informamos de ello de forma transparente durante todo el proyecto."}'::jsonb,
   'process', 'manual', 60, true, true),
  ('ai-approach',
   '{"en": "What is your approach to AI and automation?", "de": "Wie gehen Sie mit KI und Automatisierung um?", "fr": "Quelle est votre approche de l''IA et de l''automatisation ?", "es": "¿Cuál es su enfoque de la IA y la automatización?"}'::jsonb,
   '{"en": "We identify valuable, repetitive processes and implement AI and automation where they deliver measurable time and cost savings.", "de": "Wir identifizieren wertvolle, wiederkehrende Prozesse und setzen KI und Automatisierung dort ein, wo sie messbare Zeit- und Kostenersparnisse bringen.", "fr": "Nous identifions les processus répétitifs à forte valeur et mettons en œuvre l''IA et l''automatisation là où elles apportent des gains de temps et de coûts mesurables.", "es": "Identificamos procesos valiosos y repetitivos e implementamos IA y automatización donde generan ahorros de tiempo y costos medibles."}'::jsonb,
   'services', 'manual', 70, true, true),
  ('multilingual-sites',
   '{"en": "Do you build multilingual websites?", "de": "Bauen Sie mehrsprachige Websites?", "fr": "Construisez-vous des sites multilingues ?", "es": "¿Construyen sitios web multilingües?"}'::jsonb,
   '{"en": "Yes. We build websites in four languages: English, German, French, and Spanish. All content, navigation, and SEO metadata are localized with automatic fallback to English.", "de": "Ja. Wir bauen Websites in vier Sprachen: Englisch, Deutsch, Französisch und Spanisch. Alle Inhalte, Navigation und SEO-Metadaten sind lokalisiert, mit automatischem Fallback auf Englisch.", "fr": "Oui. Nous construisons des sites web en quatre langues : anglais, allemand, français et espagnol. Tout le contenu, la navigation et les métadonnées SEO sont localisés avec repli automatique sur l''anglais.", "es": "Sí. Construimos sitios web en cuatro idiomas: inglés, alemán, francés y español. Todo el contenido, la navegación y los metadatos SEO están localizados con respaldo automático al inglés."}'::jsonb,
   'general', 'manual', 80, true, true),
  ('international',
   '{"en": "Do you work internationally?", "de": "Arbeiten Sie international?", "fr": "Travaillez-vous à l''international ?", "es": "¿Trabajan internacionalmente?"}'::jsonb,
   '{"en": "Yes. We work with clients across 40+ countries. Our platform is fully multilingual and our team is async-first, so we collaborate smoothly across time zones.", "de": "Ja. Wir arbeiten mit Kunden in über 40 Ländern. Unsere Plattform ist vollständig mehrsprachig und unser Team arbeitet asynchron, sodass wir reibungslos über Zeitzonen hinweg zusammenarbeiten.", "fr": "Oui. Nous travaillons avec des clients dans plus de 40 pays. Notre plateforme est entièrement multilingue et notre équipe est async-first, ce qui permet une collaboration fluide entre les fuseaux horaires.", "es": "Sí. Trabajamos con clientes en más de 40 países. Nuestra plataforma es totalmente multilingüe y nuestro equipo trabaja de forma asíncrona, por lo que colaboramos sin problemas entre zonas horarias."}'::jsonb,
   'general', 'manual', 80, true, true),
  ('buy-business',
   '{"en": "Can you help me buy a business?", "de": "Können Sie mir beim Unternehmenskauf helfen?", "fr": "Pouvez-vous m''aider à acheter une entreprise ?", "es": "¿Pueden ayudarme a comprar un negocio?"}'::jsonb,
   '{"en": "Yes. We curate vetted digital businesses for acquisition across niches like e-commerce, SaaS, agencies, AI tools, personal brands, and local businesses. We support due diligence and guide you through the transition. See /buy-business for details.", "de": "Ja. Wir kuratieren geprüfte digitale Unternehmen zur Übernahme in Nischen wie E-Commerce, SaaS, Agenturen, KI-Tools, persönliche Marken und lokale Unternehmen. Wir unterstützen bei der Due Diligence und begleiten Sie durch den Übergang. Details unter /buy-business.", "fr": "Oui. Nous sélectionnons des entreprises numériques vérifiées à acquérir dans des niches comme l''e-commerce, le SaaS, les agences, les outils IA, les marques personnelles et les entreprises locales. Nous accompagnons la due diligence et guidons la transition. Voir /buy-business.", "es": "Sí. Seleccionamos negocios digitales verificados para adquirir en nichos como e-commerce, SaaS, agencias, herramientas de IA, marcas personales y negocios locales. Apoyamos la debida diligencia y guiamos la transición. Consulte /buy-business."}'::jsonb,
   'general', 'manual', 80, true, true)
ON CONFLICT (slug) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  content_translations = EXCLUDED.content_translations,
  category = EXCLUDED.category,
  priority = EXCLUDED.priority,
  is_enabled = EXCLUDED.is_enabled,
  is_ai_eligible = EXCLUDED.is_ai_eligible,
  source_type = EXCLUDED.source_type;

-- =============================================================================
-- AI FAQ Settings (Singleton)
-- =============================================================================

INSERT INTO public.ai_faq_settings (singleton_key, is_enabled, intro_translations, suggested_questions, allowed_categories, fallback_translations, cta_label_translations, cta_url, faq_bot_enabled, welcome_message_translations, suggested_question_translations, faq_bot_fallback_translations, faq_bot_allowed_categories)
VALUES (
  true,
  false,
  '{"en": "Ask me anything about Stratifit!", "de": "Fragen Sie mich alles über Stratifit!", "fr": "Demandez-moi tout sur Stratifit !", "es": "¡Pregúntame cualquier cosa sobre Stratifit!"}'::jsonb,
   '["What services do you offer?", "How much does a website cost?", "How long does a project take?", "Do you work internationally?", "What is your process?"]'::jsonb,
  ARRAY['general', 'services', 'pricing', 'process'],
  '{"en": "I do not have an answer for that. Please contact our team directly.", "de": "Dafür habe ich keine Antwort. Bitte kontaktieren Sie unser Team direkt.", "fr": "Je n ai pas de réponse pour cela. Veuillez contacter directement notre équipe.", "es": "No tengo una respuesta para eso. Por favor contacta a nuestro equipo directamente."}'::jsonb,
  '{"en": "Contact Us", "de": "Kontaktieren Sie uns", "fr": "Contactez-nous", "es": "Contáctanos"}'::jsonb,
  '/contact',
  true,
  '{"en": "👋 Hi! I am the Stratifit FAQ assistant. Ask me anything about our services, pricing, process, or projects.", "de": "👋 Hallo! Ich bin der Stratifit-FAQ-Assistent. Fragen Sie mich alles zu unseren Leistungen, Preisen, Prozessen oder Projekten.", "fr": "👋 Bonjour ! Je suis l''assistant FAQ Stratifit. Posez-moi toutes vos questions sur nos services, tarifs, processus ou projets.", "es": "👋 ¡Hola! Soy el asistente de preguntas frecuentes de Stratifit. Pregúntame cualquier cosa sobre nuestros servicios, precios, procesos o proyectos."}'::jsonb,
  '[
    {"en": "What services do you offer?", "de": "Welche Leistungen bieten Sie an?", "fr": "Quels services proposez-vous ?", "es": "¿Qué servicios ofrecen?"},
    {"en": "How much does a website cost?", "de": "Was kostet eine Website?", "fr": "Combien coûte un site web ?", "es": "¿Cuánto cuesta un sitio web?"},
    {"en": "How long does a project take?", "de": "Wie lange dauert ein Projekt?", "fr": "Combien de temps prend un projet ?", "es": "¿Cuánto tarda un proyecto?"},
    {"en": "Do you work internationally?", "de": "Arbeiten Sie international?", "fr": "Travaillez-vous à l''international ?", "es": "¿Trabajan internacionalmente?"},
    {"en": "What is your process?", "de": "Wie läuft Ihr Prozess ab?", "fr": "Quel est votre processus ?", "es": "¿Cuál es su proceso?"}
  ]'::jsonb,
  '{"en": "I could not find an answer to that yet. You can ask me about our services, pricing, or process, or leave your email and our team will get back to you.", "de": "Dazu habe ich noch keine Antwort gefunden. Sie können mich zu unseren Leistungen, Preisen oder Prozessen fragen, oder hinterlassen Sie Ihre E-Mail und unser Team meldet sich bei Ihnen.", "fr": "Je n''ai pas encore trouvé de réponse à cela. Vous pouvez me poser des questions sur nos services, nos tarifs ou notre processus, ou laisser votre email et notre équipe vous répondra.", "es": "Aún no encontré una respuesta para eso. Puedes preguntarme sobre nuestros servicios, precios o procesos, o dejar tu correo y nuestro equipo te responderá."}'::jsonb,
  ARRAY['general', 'services', 'pricing', 'process']
)
ON CONFLICT (singleton_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  intro_translations = EXCLUDED.intro_translations,
  suggested_questions = EXCLUDED.suggested_questions,
  allowed_categories = EXCLUDED.allowed_categories,
  fallback_translations = EXCLUDED.fallback_translations,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url,
  faq_bot_enabled = EXCLUDED.faq_bot_enabled,
  welcome_message_translations = EXCLUDED.welcome_message_translations,
  suggested_question_translations = EXCLUDED.suggested_question_translations,
  faq_bot_fallback_translations = EXCLUDED.faq_bot_fallback_translations,
  faq_bot_allowed_categories = EXCLUDED.faq_bot_allowed_categories;

-- =============================================================================
-- Acquisition Niches (catalog)
-- =============================================================================

INSERT INTO public.acquisition_niches
  (slug, emoji, accent, label_translations, description_translations, why_title_translations, why_description_translations, stats, is_visible, display_order)
VALUES
  (
    'ecommerce', '🛒', '#F59E0B',
    '{"en":"Ecommerce","de":"E-Commerce","fr":"E-commerce","es":"Ecommerce"}'::jsonb,
    '{"en":"Acquire profitable, turnkey online stores with established traffic, revenue, and brand equity.","de":"Übernehmen Sie profitable, schlüsselfertige Online-Shops mit etabliertem Traffic, Umsatz und Markenwert.","fr":"Acquérez des boutiques en ligne rentables et clés en main, avec un trafic, un chiffre d''affaires et une marque établis.","es":"Adquiera tiendas online rentables y listas para operar, con tráfico, ingresos y valor de marca consolidados."}'::jsonb,
    '{"en":"Why Ecommerce?","de":"Warum E-Commerce?","fr":"Pourquoi l''e-commerce ?","es":"¿Por qué Ecommerce?"}'::jsonb,
    '{"en":"Ecommerce businesses represent one of the most accessible acquisition opportunities in today''s market. With proven product-market fit, established revenue streams, and significant growth potential, these assets offer a faster path to ownership than building from scratch.","de":"E-Commerce-Unternehmen gehören zu den zugänglichsten Übernahmechancen im heutigen Markt. Mit bewährtem Product-Market-Fit, etablierten Einnahmequellen und erheblichem Wachstumspotenzial bieten diese Assets einen schnelleren Weg in die Selbstständigkeit als ein Start von null.","fr":"Les entreprises e-commerce représentent l''une des opportunités d''acquisition les plus accessibles du marché actuel. Avec un produit validé, des revenus établis et un fort potentiel de croissance, ces actifs offrent un chemin plus rapide vers la propriété que de partir de zéro.","es":"Los negocios de ecommerce representan una de las oportunidades de adquisición más accesibles del mercado actual. Con un ajuste producto-mercado demostrado, flujos de ingresos consolidados y un gran potencial de crecimiento, estos activos ofrecen un camino más rápido hacia la propiedad que empezar de cero."}'::jsonb,
    '[
      {"value":"$85K","label_translations":{"en":"Avg. Revenue","de":"Ø-Umsatz","fr":"CA moyen","es":"Ingresos prom."},"hint_translations":{"en":"across our ecommerce portfolio","de":"in unserem E-Commerce-Portfolio","fr":"dans notre portefeuille e-commerce","es":"en nuestro portafolio ecommerce"}},
      {"value":"4.2×","label_translations":{"en":"Multiplier","de":"Multiplikator","fr":"Multiple","es":"Multiplicador"},"hint_translations":{"en":"typical asking price multiple","de":"typisches Preis-Multiple","fr":"multiple de prix typique","es":"múltiplo de precio típico"}},
      {"value":"12+","label_translations":{"en":"Traffic Sources","de":"Traffic-Quellen","fr":"Sources de trafic","es":"Fuentes de tráfico"},"hint_translations":{"en":"diversified acquisition channels","de":"diversifizierte Akquise-Kanäle","fr":"canaux d''acquisition diversifiés","es":"canales de adquisición diversificados"}}
    ]'::jsonb,
    true, 10
  ),
  (
    'saas', '☁️', '#6C5CE7',
    '{"en":"SaaS","de":"SaaS","fr":"SaaS","es":"SaaS"}'::jsonb,
    '{"en":"Own established software businesses with recurring revenue, low churn, and scalable infrastructure.","de":"Übernehmen Sie etablierte Software-Unternehmen mit wiederkehrenden Umsätzen, niedriger Churn-Rate und skalierbarer Infrastruktur.","fr":"Possédez des logiciels établis avec des revenus récurrents, un faible taux de churn et une infrastructure scalable.","es":"Sea dueño de negocios de software consolidados con ingresos recurrentes, baja rotación e infraestructura escalable."}'::jsonb,
    '{"en":"Why SaaS?","de":"Warum SaaS?","fr":"Pourquoi le SaaS ?","es":"¿Por qué SaaS?"}'::jsonb,
    '{"en":"SaaS businesses represent one of the most attractive acquisition opportunities in today''s market. With proven business models, established revenue streams, and significant growth potential, these assets offer a faster path to ownership than building from scratch.","de":"SaaS-Unternehmen gehören zu den attraktivsten Übernahmechancen im heutigen Markt. Mit bewährtem Geschäftsmodell, etablierten Einnahmequellen und erheblichem Wachstumspotenzial bieten diese Assets einen schnelleren Weg in die Selbstständigkeit.","fr":"Les entreprises SaaS représentent l''une des opportunités d''acquisition les plus attractives du marché actuel. Avec un modèle éprouvé, des revenus établis et un fort potentiel de croissance, ces actifs offrent un chemin plus rapide vers la propriété.","es":"Los negocios SaaS representan una de las oportunidades de adquisición más atractivas del mercado actual. Con modelos de negocio probados, ingresos consolidados y un gran potencial de crecimiento, estos activos ofrecen un camino más rápido hacia la propiedad."}'::jsonb,
    '[
      {"value":"$13.2K","label_translations":{"en":"Avg. MRR","de":"Ø-MRR","fr":"MRR moyen","es":"MRR prom."},"hint_translations":{"en":"across our SaaS portfolio","de":"in unserem SaaS-Portfolio","fr":"dans notre portefeuille SaaS","es":"en nuestro portafolio SaaS"}},
      {"value":"92%","label_translations":{"en":"Gross Margin","de":"Bruttomarge","fr":"Marge brute","es":"Margen bruto"},"hint_translations":{"en":"low infrastructure costs","de":"niedrige Infrastrukturkosten","fr":"coûts d''infrastructure faibles","es":"costes de infraestructura bajos"}},
      {"value":"3.2%","label_translations":{"en":"Avg. Churn Rate","de":"Ø-Churn-Rate","fr":"Taux de churn moyen","es":"Tasa de rotación prom."},"hint_translations":{"en":"strong retention","de":"starke Kundenbindung","fr":"forte rétention","es":"fuerte retención"}}
    ]'::jsonb,
    true, 20
  ),
  (
    'agency', '🏢', '#10B981',
    '{"en":"Agency","de":"Agentur","fr":"Agence","es":"Agencia"}'::jsonb,
    '{"en":"Buy a fully operational digital agency with existing clients, team, systems, and recurring revenue.","de":"Kaufen Sie eine voll funktionsfähige Digitalagentur mit bestehenden Kunden, Team, Systemen und wiederkehrendem Umsatz.","fr":"Achetez une agence digitale entièrement opérationnelle, avec clients, équipe, systèmes et revenus récurrents.","es":"Compre una agencia digital totalmente operativa con clientes, equipo, sistemas e ingresos recurrentes."}'::jsonb,
    '{"en":"Why Agency?","de":"Warum eine Agentur?","fr":"Pourquoi une agence ?","es":"¿Por qué una agencia?"}'::jsonb,
    '{"en":"Agencies combine recurring client revenue with a skilled team and established systems. Acquiring one gives you an operating business with pipelines, retainers, and a track record, without the years of client-building.","de":"Agenturen verbinden wiederkehrenden Kundenumsatz mit einem qualifizierten Team und etablierten Systemen. Eine Übernahme verschafft Ihnen ein operatives Geschäft mit Pipeline, Retainern und einer Erfolgsbilanz, ohne jahrelangen Kundenaufbau.","fr":"Les agences combinent des revenus récurrents, une équipe qualifiée et des systèmes éprouvés. En acquérir une, c''est reprendre une entreprise opérationnelle avec un pipeline, des contrats de retenue et un historique, sans des années de prospection.","es":"Las agencias combinan ingresos recurrentes de clientes con un equipo cualificado y sistemas consolidados. Adquirir una le da un negocio en funcionamiento con pipeline, contratos de retención y trayectoria, sin años de captación de clientes."}'::jsonb,
    '[
      {"value":"$22K","label_translations":{"en":"Avg. Monthly Revenue","de":"Ø-Monatsumsatz","fr":"CA mensuel moyen","es":"Ingresos mensuales prom."},"hint_translations":{"en":"across our agency portfolio","de":"in unserem Agentur-Portfolio","fr":"dans notre portefeuille d''agences","es":"en nuestro portafolio de agencias"}},
      {"value":"8+","label_translations":{"en":"Retainer Clients","de":"Retainer-Kunden","fr":"Clients en rétention","es":"Clientes en retención"},"hint_translations":{"en":"average active accounts","de":"durchschnittliche aktive Konten","fr":"comptes actifs moyens","es":"cuentas activas promedio"}},
      {"value":"95%","label_translations":{"en":"Client Retention","de":"Kundenbindung","fr":"Rétention client","es":"Retención de clientes"},"hint_translations":{"en":"strong relationships","de":"starke Beziehungen","fr":"relations solides","es":"relaciones sólidas"}}
    ]'::jsonb,
    true, 30
  ),
  (
    'ai-tools', '🤖', '#3B82F6',
    '{"en":"AI Tools","de":"KI-Tools","fr":"Outils IA","es":"Herramientas IA"}'::jsonb,
    '{"en":"Acquire production AI applications generating real revenue with established user bases.","de":"Übernehmen Sie produktive KI-Anwendungen, die echten Umsatz generieren und etablierte Nutzerbasis besitzen.","fr":"Acquérez des applications IA en production qui génèrent des revenus réels et disposent d''une base d''utilisateurs établie.","es":"Adquiera aplicaciones de IA en producción que generan ingresos reales y cuentan con bases de usuarios consolidadas."}'::jsonb,
    '{"en":"Why AI Tools?","de":"Warum KI-Tools?","fr":"Pourquoi les outils IA ?","es":"¿Por qué herramientas IA?"}'::jsonb,
    '{"en":"AI tool businesses sit at the intersection of high growth and proven demand. These are production applications with paying users, working infrastructure, and a fast-moving market, prime assets for operators who can scale.","de":"KI-Tool-Unternehmen liegen an der Schnittstelle von hohem Wachstum und bewährter Nachfrage. Es handelt sich um produktive Anwendungen mit zahlenden Nutzern, funktionierender Infrastruktur und einem sich schnell bewegenden Markt, erstklassige Assets für skalierende Betreiber.","fr":"Les outils IA se situent à l''intersection de la forte croissance et d''une demande prouvée. Ce sont des applications en production avec des utilisateurs payants, une infrastructure fonctionnelle et un marché en évolution rapide, des actifs de premier choix pour des opérateurs capables de scaler.","es":"Las herramientas de IA se sitúan en la intersección del alto crecimiento y la demanda probada. Son aplicaciones en producción con usuarios de pago, infraestructura funcional y un mercado en rápida evolución: activos de primera para operadores que pueden escalar."}'::jsonb,
    '[
      {"value":"$18.5K","label_translations":{"en":"Avg. MRR","de":"Ø-MRR","fr":"MRR moyen","es":"MRR prom."},"hint_translations":{"en":"across our AI portfolio","de":"in unserem KI-Portfolio","fr":"dans notre portefeuille IA","es":"en nuestro portafolio de IA"}},
      {"value":"40K+","label_translations":{"en":"Active Users","de":"Aktive Nutzer","fr":"Utilisateurs actifs","es":"Usuarios activos"},"hint_translations":{"en":"average user base","de":"durchschnittliche Nutzerbasis","fr":"base d''utilisateurs moyenne","es":"base de usuarios promedio"}},
      {"value":"5×","label_translations":{"en":"Growth Multiple","de":"Wachstums-Multiple","fr":"Multiple de croissance","es":"Múltiplo de crecimiento"},"hint_translations":{"en":"market momentum","de":"Marktdynamik","fr":"dynamique du marché","es":"impulso del mercado"}}
    ]'::jsonb,
    true, 40
  ),
  (
    'personal-brand', '🌟', '#F59E0B',
    '{"en":"Personal Brand","de":"Persönliche Marke","fr":"Marque personnelle","es":"Marca personal"}'::jsonb,
    '{"en":"Acquire established personal brands with engaged audiences and diversified revenue streams.","de":"Übernehmen Sie etablierte persönliche Marken mit engagierter Community und diversifizierten Einnahmequellen.","fr":"Acquérez des marques personnelles établies avec des audiences engagées et des sources de revenus diversifiées.","es":"Adquiera marcas personales consolidadas con audiencias comprometidas y fuentes de ingresos diversificadas."}'::jsonb,
    '{"en":"Why Personal Brand?","de":"Warum eine persönliche Marke?","fr":"Pourquoi une marque personnelle ?","es":"¿Por qué una marca personal?"}'::jsonb,
    '{"en":"Personal brands are attention assets. With a loyal audience and multiple revenue streams, sponsorships, products, community, they compound in value and transfer cleanly to a new owner who keeps the voice.","de":"Persönliche Marken sind Aufmerksamkeits-Assets. Mit einer loyalen Community und mehreren Einnahmequellen, Sponsoring, Produkte, Community, steigern sie ihren Wert und gehen sauber auf einen neuen Eigentümer über, der die Stimme beibehält.","fr":"Les marques personnelles sont des actifs d''attention. Avec une audience fidèle et plusieurs sources de revenus, sponsoring, produits, communauté, elles gagnent de la valeur et se transfèrent proprement à un nouveau propriétaire qui conserve la voix.","es":"Las marcas personales son activos de atención. Con una audiencia leal y múltiples fuentes de ingresos (patrocinios, productos, comunidad), aumentan de valor y se transfieren limpiamente a un nuevo propietario que mantiene la voz."}'::jsonb,
    '[
      {"value":"$14K","label_translations":{"en":"Avg. Monthly Revenue","de":"Ø-Monatsumsatz","fr":"CA mensuel moyen","es":"Ingresos mensuales prom."},"hint_translations":{"en":"diversified income streams","de":"diversifizierte Einnahmen","fr":"sources de revenus diversifiées","es":"flujos de ingresos diversificados"}},
      {"value":"120K+","label_translations":{"en":"Avg. Followers","de":"Ø-Follower","fr":"Followers moyens","es":"Seguidores prom."},"hint_translations":{"en":"across platforms","de":"über alle Plattformen","fr":"toutes plateformes","es":"en todas las plataformas"}},
      {"value":"60%","label_translations":{"en":"Audience Retention","de":"Community-Bindung","fr":"Rétention d''audience","es":"Retención de audiencia"},"hint_translations":{"en":"engaged community","de":"engagierte Community","fr":"communauté engagée","es":"comunidad comprometida"}}
    ]'::jsonb,
    true, 50
  ),
  (
    'local-business', '📍', '#F97316',
    '{"en":"Local Business","de":"Lokales Unternehmen","fr":"Entreprise locale","es":"Negocio local"}'::jsonb,
    '{"en":"Own profitable local businesses with established locations, loyal customers, and strong community presence.","de":"Übernehmen Sie profitable lokale Unternehmen mit etablierten Standorten, treuen Kunden und starker lokaler Präsenz.","fr":"Possédez des entreprises locales rentables avec des emplacements établis, des clients fidèles et une forte présence communautaire.","es":"Sea dueño de negocios locales rentables con ubicaciones consolidadas, clientes leales y fuerte presencia comunitaria."}'::jsonb,
    '{"en":"Why Local Business?","de":"Warum ein lokales Unternehmen?","fr":"Pourquoi une entreprise locale ?","es":"¿Por qué un negocio local?"}'::jsonb,
    '{"en":"Local businesses deliver predictable cash flow with a physical moat. Established locations, loyal customers, and a strong community presence make these resilient, owner-operable assets.","de":"Lokale Unternehmen liefern planbaren Cashflow mit einem physischen Burggraben. Etablierte Standorte, treue Kunden und starke lokale Präsenz machen sie zu widerstandsfähigen, eigentümergeführten Assets.","fr":"Les entreprises locales génèrent un cash-flow prévisible avec un avantage physique. Des emplacements établis, des clients fidèles et une forte présence communautaire en font des actifs résilients, opérables par leur propriétaire.","es":"Los negocios locales generan un flujo de caja predecible con una ventaja física. Las ubicaciones consolidadas, los clientes leales y la fuerte presencia comunitaria los convierten en activos resistentes y operables por su propietario."}'::jsonb,
    '[
      {"value":"4.8★","label_translations":{"en":"Avg. Rating","de":"Ø-Bewertung","fr":"Note moyenne","es":"Calificación prom."},"hint_translations":{"en":"across our local portfolio","de":"in unserem lokalen Portfolio","fr":"dans notre portefeuille local","es":"en nuestro portafolio local"}},
      {"value":"10+","label_translations":{"en":"Years Operating","de":"Jahre im Betrieb","fr":"Années d''activité","es":"Años en operación"},"hint_translations":{"en":"average track record","de":"durchschnittliche Erfolgsbilanz","fr":"historique moyen","es":"trayectoria promedio"}},
      {"value":"82%","label_translations":{"en":"Returning Customers","de":"Wiederkehrende Kunden","fr":"Clients fidèles","es":"Clientes recurrentes"},"hint_translations":{"en":"repeat business","de":"Stammkundschaft","fr":"fidélité client","es":"negocio recurrente"}}
    ]'::jsonb,
    true, 60
  ),
  (
    'digital-products', '📦', '#8B5CF6',
    '{"en":"Digital Products","de":"Digitale Produkte","fr":"Produits numériques","es":"Productos digitales"}'::jsonb,
    '{"en":"Own passive-income digital product businesses with zero inventory, high margins, and global reach.","de":"Übernehmen Sie Digitalprodukt-Unternehmen mit passivem Einkommen, null Lagerbestand, hohen Margen und globaler Reichweite.","fr":"Possédez des entreprises de produits numériques à revenus passifs, sans stock, à marges élevées et à portée mondiale.","es":"Sea dueño de negocios de productos digitales con ingresos pasivos, inventario cero, altos márgenes y alcance global."}'::jsonb,
    '{"en":"Why Digital Products?","de":"Warum digitale Produkte?","fr":"Pourquoi les produits numériques ?","es":"¿Por qué productos digitales?"}'::jsonb,
    '{"en":"Digital products are the purest form of passive income: zero inventory, near-100% margins, and a global market. Acquiring one gives you an asset that sells while you sleep.","de":"Digitale Produkte sind die reinste Form des passiven Einkommens: kein Lagerbestand, fast 100 % Marge und ein globaler Markt. Die Übernahme verschafft Ihnen ein Asset, das verkauft, während Sie schlafen.","fr":"Les produits numériques sont la forme la plus pure de revenu passif : zéro stock, marges proches de 100 % et un marché mondial. En acquérir un, c''est posséder un actif qui vend pendant que vous dormez.","es":"Los productos digitales son la forma más pura de ingresos pasivos: inventario cero, márgenes cercanos al 100% y un mercado global. Adquirir uno le da un activo que vende mientras duerme."}'::jsonb,
    '[
      {"value":"96%","label_translations":{"en":"Avg. Margin","de":"Ø-Marge","fr":"Marge moyenne","es":"Margen prom."},"hint_translations":{"en":"near-zero cost of goods","de":"fast keine Herstellungskosten","fr":"coût des marchandises quasi nul","es":"coste de mercancías casi nulo"}},
      {"value":"$12K","label_translations":{"en":"Avg. Monthly Revenue","de":"Ø-Monatsumsatz","fr":"CA mensuel moyen","es":"Ingresos mensuales prom."},"hint_translations":{"en":"across our portfolio","de":"in unserem Portfolio","fr":"dans notre portefeuille","es":"en nuestro portafolio"}},
      {"value":"40+","label_translations":{"en":"Countries","de":"Länder","fr":"Pays","es":"Países"},"hint_translations":{"en":"global customer reach","de":"globale Kundenreichweite","fr":"portée client mondiale","es":"alcance global de clientes"}}
    ]'::jsonb,
    true, 70
  )
ON CONFLICT (slug) DO UPDATE SET
  emoji = EXCLUDED.emoji,
  accent = EXCLUDED.accent,
  label_translations = EXCLUDED.label_translations,
  description_translations = EXCLUDED.description_translations,
  why_title_translations = EXCLUDED.why_title_translations,
  why_description_translations = EXCLUDED.why_description_translations,
  stats = EXCLUDED.stats,
  is_visible = EXCLUDED.is_visible,
  display_order = EXCLUDED.display_order;

-- =============================================================================
-- Portfolio Projects
-- NOTE: Real case studies, testimonials and trusted logos are seeded by
--       migration 00030_real_business_content.sql. This block keeps the
--       homepage gallery populated for local development before that
--       migration runs, using the same stable ids so both are idempotent.
-- =============================================================================

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111101', 'maison-lumiere-brand-system', 'Maison Lumière', '{"en": "Maison Lumière Brand System", "de": "Markensystem Maison Lumière", "fr": "Système de marque Maison Lumière", "es": "Sistema de marca Maison Lumière"}'::jsonb, '{"en": "A complete luxury brand identity that repositioned a heritage retailer for the digital age.", "de": "Eine komplette Luxus-Markenidentität, die einen Traditionshändler für das digitale Zeitalter neu positioniert hat.", "fr": "Une identité de marque de luxe complète qui a repositionné un détaillant historique pour l ère numérique.", "es": "Una identidad de marca de lujo completa que reposicionó a un minorista tradicional para la era digital."}'::jsonb, '{"en": "A 60-year-old retailer with an iconic name was losing relevance against digitally-native competitors.", "de": "Ein 60 Jahre alter Händler mit ikonischem Namen verlor gegen digital-native Wettbewerber an Relevanz.", "fr": "Un détaillant centenaire au nom emblématique perdait du terrain face à des concurrents nés du numérique.", "es": "Un minorista con 60 años y nombre icónico perdía relevancia frente a competidores nativos digitales."}'::jsonb, '{"en": "We rebuilt the identity from strategy up: positioning, visual language, typography, and a design system applied across packaging, store, and web.", "de": "Wir bauten die Identität von der Strategie an neu auf: Positionierung, visuelle Sprache, Typografie und ein Designsystem für Verpackung, Store und Web.", "fr": "Nous avons reconstruit l identité de la stratégie au détail : positionnement, langage visuel, typographie et système de design appliqué au packaging, au store et au web.", "es": "Reconstruimos la identidad desde la estrategia: posicionamiento, lenguaje visual, tipografía y un sistema de diseño aplicado a empaques, tienda y web."}'::jsonb, '{"en": "A cohesive luxury system with guidelines, asset kits, and templates that keep every touchpoint consistent.", "de": "Ein kohärentes Luxus-System mit Richtlinien, Asset-Kits und Vorlagen für konsistente Touchpoints.", "fr": "Un système de luxe cohérent avec des directives, des kits d actifs et des modèles pour une cohérence sur tous les points de contact.", "es": "Un sistema de lujo coherente con pautas, kits de recursos y plantillas que mantienen la consistencia en cada punto de contacto."}'::jsonb, '{"en": ["Brand Strategy", "Logo & Identity", "Design System", "Packaging", "Guidelines"]}'::jsonb, '{"en": "Online revenue doubled within six months and the brand re-entered premium retail conversations."}'::jsonb, '[{"value": "+112%", "label_translations": {"en": "Online revenue growth", "de": "Online-Umsatzwachstum", "fr": "Croissance du chiffre d affaires en ligne", "es": "Crecimiento de ingresos online"}}]'::jsonb, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&auto=format', '{"en": "Maison Lumière Brand System Stratifit", "de": "Markensystem Maison Lumière Stratifit", "fr": "Système de marque Maison Lumière Stratifit", "es": "Sistema de marca Maison Lumière Stratifit"}'::jsonb, '{"en": "A complete luxury brand identity delivered by Stratifit.", "de": "Eine komplette Luxus-Markenidentität von Stratifit.", "fr": "Une identité de marque de luxe complète réalisée par Stratifit.", "es": "Una identidad de marca de lujo completa creada por Stratifit."}'::jsonb, true, 'published', '2026-01-15T09:00:00Z'),
  ('11111111-1111-4111-8111-111111111102', 'nordlicht-logistics-website', 'Nordlicht Logistics', '{"en": "Multilingual Platform for Nordlicht Logistics", "de": "Mehrsprachige Plattform für Nordlicht Logistics", "fr": "Plateforme multilingue pour Nordlicht Logistics", "es": "Plataforma multilingüe para Nordlicht Logistics"}'::jsonb, '{"en": "A high-performance, four-language web platform that turned international enquiries into pipeline.", "de": "Eine leistungsstarke viersprachige Webplattform, die internationale Anfragen in Pipeline verwandelte.", "fr": "Une plateforme web haute performance en quatre langues qui a transformé les demandes internationales en pipeline.", "es": "Una plataforma web de alto rendimiento en cuatro idiomas que convirtió las consultas internacionales en pipeline."}'::jsonb, '{"en": "Serving customers across four languages with an outdated site that hurt trust and conversions.", "de": "Ein veralteter Auftritt schadete Vertrauen und Conversions bei Kunden in vier Sprachen.", "fr": "Un site obsolète nuisait à la confiance et aux conversions auprès de clients dans quatre langues.", "es": "Un sitio desactualizado perjudicaba la confianza y las conversiones con clientes en cuatro idiomas."}'::jsonb, '{"en": "We rebuilt the platform with a centralized multilingual content system, sub-second performance, and conversion-focused journeys per market.", "de": "Wir bauten die Plattform mit zentralisiertem mehrsprachigem Content-System, Subsekunden-Performance und conversion-orientierten Journeys pro Markt neu.", "fr": "Nous avons reconstruit la plateforme avec un système de contenu multilingue centralisé, des performances sous la seconde et des parcours orientés conversion par marché.", "es": "Reconstruimos la plataforma con un sistema de contenido multilingüe centralizado, rendimiento inferior al segundo y recorridos orientados a la conversión por mercado."}'::jsonb, '{"en": "A scalable site that adapts to every locale.", "de": "Eine skalierbare Website, die sich jeder Sprache anpasst.", "fr": "Un site évolutif qui s adapte à chaque langue.", "es": "Un sitio escalable que se adapta a cada idioma."}'::jsonb, '{"en": ["Custom Development", "Multilingual CMS", "Performance", "Lead Funnels"]}'::jsonb, '{"en": "International enquiries doubled within months and organic traffic grew across all four locales."}'::jsonb, '[{"value": "+96%", "label_translations": {"en": "International enquiries", "de": "Internationale Anfragen", "fr": "Demandes internationales", "es": "Consultas internacionales"}}]'::jsonb, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format', '{"en": "Nordlicht Logistics Website Stratifit", "de": "Nordlicht Logistics Website Stratifit", "fr": "Site web Nordlicht Logistics Stratifit", "es": "Sitio web de Nordlicht Logistics Stratifit"}'::jsonb, '{"en": "A multilingual logistics platform built by Stratifit.", "de": "Eine mehrsprachige Logistikplattform von Stratifit.", "fr": "Une plateforme logistique multilingue créée par Stratifit.", "es": "Una plataforma logística multilingüe creada por Stratifit."}'::jsonb, false, 'published', '2026-02-20T09:00:00Z'),
  ('11111111-1111-4111-8111-111111111103', 'helios-health-ai-support', 'Helios Health', '{"en": "AI Support Assistant for Helios Health", "de": "KI-Support-Assistent für Helios Health", "fr": "Assistant de support IA pour Helios Health", "es": "Asistente de soporte con IA para Helios Health"}'::jsonb, '{"en": "A knowledge-grounded AI assistant that resolves 78% of support tickets end-to-end.", "de": "Ein wissensbasierter KI-Assistent, der 78 % der Support-Tickets vollständig löst.", "fr": "Un assistant IA fondé sur la connaissance qui résout 78 % des tickets de support de bout en bout.", "es": "Un asistente de IA basado en conocimiento que resuelve el 78 % de los tickets de soporte."}'::jsonb, '{"en": "A support team drowning in repetitive questions while response times stretched past 48 hours.", "de": "Ein Support-Team, das in Routinefragen ertrank, während die Antwortzeiten auf über 48 Stunden stiegen.", "fr": "Une équipe support submergée de questions répétitives avec des délais de réponse dépassant 48 heures.", "es": "Un equipo de soporte ahogado en preguntas repetitivas con tiempos de respuesta superiores a 48 horas."}'::jsonb, '{"en": "We built a secure, knowledge-grounded assistant that answers from approved content and escalates to humans when certainty drops.", "de": "Wir bauten einen sicheren, wissensbasierten Assistenten, der aus genehmigten Inhalten antwortet und bei Unsicherheit an Menschen eskaliert.", "fr": "Nous avons créé un assistant sécurisé fondé sur la connaissance qui répond à partir de contenus approuvés et escalade aux humains en cas de doute.", "es": "Creamos un asistente seguro basado en conocimiento que responde desde contenido aprobado y escala a humanos cuando baja la certeza."}'::jsonb, '{"en": "A support assistant that knows when to escalate to a human.", "de": "Ein Support-Assistent, der weiß, wann er an einen Menschen eskalieren muss.", "fr": "Un assistant de support qui sait quand passer à un humain.", "es": "Un asistente de soporte que sabe cuándo escalar a un humano."}'::jsonb, '{"en": ["AI Chatbot", "Knowledge Base", "Human Handover", "Analytics"]}'::jsonb, '{"en": "First-response time dropped to seconds, and the team now focuses on complex cases."}'::jsonb, '[{"value": "78%", "label_translations": {"en": "Tickets resolved automatically", "de": "Automatisch gelöste Tickets", "fr": "Tickets résolus automatiquement", "es": "Tickets resueltos automáticamente"}}]'::jsonb, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', '{"en": "AI Support Assistant for Helios Health Stratifit", "de": "KI-Support-Assistent für Helios Health Stratifit", "fr": "Assistant de support IA pour Helios Health Stratifit", "es": "Asistente de soporte con IA para Helios Health Stratifit"}'::jsonb, '{"en": "An AI support assistant built by Stratifit for Helios Health.", "de": "Ein KI-Support-Assistent von Stratifit für Helios Health.", "fr": "Un assistant de support IA créé par Stratifit pour Helios Health.", "es": "Un asistente de soporte con IA creado por Stratifit para Helios Health."}'::jsonb, true, 'published', '2026-03-10T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  metrics = EXCLUDED.metrics,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- Link the seed projects to their services (idempotent).
INSERT INTO public.portfolio_service_links (portfolio_id, service_id)
SELECT p.id, s.id
FROM (VALUES
  ('11111111-1111-4111-8111-111111111101'::uuid, 'brand-design'),
  ('11111111-1111-4111-8111-111111111102'::uuid, 'website-development'),
  ('11111111-1111-4111-8111-111111111103'::uuid, 'ai-automation')
) AS x(portfolio_id, service_slug)
JOIN public.services s ON s.slug = x.service_slug
JOIN public.portfolio_projects p ON p.id = x.portfolio_id
ON CONFLICT DO NOTHING;

-- Seed gallery rows for the work detail pages (direct image_url pattern from
-- migration 00041; idempotent via stable UUIDs).
INSERT INTO public.portfolio_media (id, portfolio_id, image_url, caption_translations, display_order, is_featured)
SELECT g.id, p.id, g.image_url, '{}'::jsonb, g.display_order, g.is_featured
FROM (VALUES
  -- Maison Lumière Brand System
  ('55555555-5555-4555-8555-555555555501'::uuid, '11111111-1111-4111-8111-111111111101'::uuid, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555502'::uuid, '11111111-1111-4111-8111-111111111101'::uuid, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555503'::uuid, '11111111-1111-4111-8111-111111111101'::uuid, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Nordlicht Logistics Website
  ('55555555-5555-4555-8555-555555555504'::uuid, '11111111-1111-4111-8111-111111111102'::uuid, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555505'::uuid, '11111111-1111-4111-8111-111111111102'::uuid, 'https://images.unsplash.com/photo-1567449303078-57ad995bd17b?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555506'::uuid, '11111111-1111-4111-8111-111111111102'::uuid, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Helios Health AI Support
  ('55555555-5555-4555-8555-555555555507'::uuid, '11111111-1111-4111-8111-111111111103'::uuid, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555508'::uuid, '11111111-1111-4111-8111-111111111103'::uuid, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555509'::uuid, '11111111-1111-4111-8111-111111111103'::uuid, 'https://images.unsplash.com/photo-1567449303078-57ad995bd17b?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Aura Cosmetics Rebrand
  ('55555555-5555-4555-8555-555555555510'::uuid, '11111111-1111-4111-8111-111111111104'::uuid, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555511'::uuid, '11111111-1111-4111-8111-111111111104'::uuid, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555512'::uuid, '11111111-1111-4111-8111-111111111104'::uuid, 'https://images.unsplash.com/photo-1567449303078-57ad995bd17b?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Nova Fintech Platform
  ('55555555-5555-4555-8555-555555555513'::uuid, '11111111-1111-4111-8111-111111111105'::uuid, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555514'::uuid, '11111111-1111-4111-8111-111111111105'::uuid, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555515'::uuid, '11111111-1111-4111-8111-111111111105'::uuid, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Atlas Commerce Platform
  ('55555555-5555-4555-8555-555555555516'::uuid, '11111111-1111-4111-8111-111111111106'::uuid, 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555517'::uuid, '11111111-1111-4111-8111-111111111106'::uuid, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555518'::uuid, '11111111-1111-4111-8111-111111111106'::uuid, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- SmartFlow AI Pipeline
  ('55555555-5555-4555-8555-555555555519'::uuid, '11111111-1111-4111-8111-111111111107'::uuid, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555520'::uuid, '11111111-1111-4111-8111-111111111107'::uuid, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555521'::uuid, '11111111-1111-4111-8111-111111111107'::uuid, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- GrowthStack Campaign
  ('55555555-5555-4555-8555-555555555522'::uuid, '11111111-1111-4111-8111-111111111108'::uuid, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555523'::uuid, '11111111-1111-4111-8111-111111111108'::uuid, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555524'::uuid, '11111111-1111-4111-8111-111111111108'::uuid, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&auto=format', 3, false),
  -- Vertex SaaS Landing
  ('55555555-5555-4555-8555-555555555525'::uuid, '11111111-1111-4111-8111-111111111109'::uuid, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop&auto=format', 1, true),
  ('55555555-5555-4555-8555-555555555526'::uuid, '11111111-1111-4111-8111-111111111109'::uuid, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', 2, false),
  ('55555555-5555-4555-8555-555555555527'::uuid, '11111111-1111-4111-8111-111111111109'::uuid, 'https://images.unsplash.com/photo-1567449303078-57ad995bd17b?w=1200&h=800&fit=crop&auto=format', 3, false)
) AS g(id, portfolio_id, image_url, display_order, is_featured)
JOIN public.portfolio_projects p ON p.id = g.portfolio_id
ON CONFLICT (id) DO UPDATE SET
  portfolio_id = EXCLUDED.portfolio_id,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured;


-- =============================================================================
-- =============================================================================
-- Development-Only Insight Categories
-- NOTE: Development placeholders. Replace with approved editorial content before launch.
-- =============================================================================

INSERT INTO public.insight_categories (id, slug, name_translations, description_translations)
VALUES
  ('44444444-4444-4444-8444-444444444401', 'strategy', '{"en": "Strategy", "de": "Strategie", "fr": "Stratégie", "es": "Estrategia"}'::jsonb, '{"en": "Positioning, planning, and strategic direction for digital growth.", "de": "Positionierung, Planung und strategische Ausrichtung für digitales Wachstum.", "fr": "Positionnement, planification et direction stratégique pour la croissance digitale.", "es": "Posicionamiento, planificación y dirección estratégica para el crecimiento digital."}'::jsonb),
  ('44444444-4444-4444-8444-444444444402', 'design', '{"en": "Design", "de": "Design", "fr": "Design", "es": "Diseño"}'::jsonb, '{"en": "Visual systems, UX, and interaction design that elevate brands.", "de": "Visuelle Systeme, UX und Interaktionsdesign, die Marken aufwerten.", "fr": "Systèmes visuels, UX et design d''interaction qui élèvent les marques.", "es": "Sistemas visuales, UX y diseño de interacción que elevan las marcas."}'::jsonb),
  ('44444444-4444-4444-8444-444444444403', 'tech', '{"en": "Tech", "de": "Tech", "fr": "Tech", "es": "Tech"}'::jsonb, '{"en": "Engineering, architecture, and AI applied to real business problems.", "de": "Engineering, Architektur und KI für reale Geschäftsprobleme.", "fr": "Ingénierie, architecture et IA appliquées à de vrais problèmes métier.", "es": "Ingeniería, arquitectura e IA aplicadas a problemas reales de negocio."}'::jsonb),
  ('44444444-4444-4444-8444-444444444404', 'growth', '{"en": "Growth", "de": "Growth", "fr": "Croissance", "es": "Crecimiento"}'::jsonb, '{"en": "Acquisition, retention, and the systems that scale revenue.", "de": "Akquise, Bindung und Systeme, die Umsatz skalieren.", "fr": "Acquisition, rétention et systèmes qui font croître le revenu.", "es": "Adquisición, retención y sistemas que escalan los ingresos."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  name_translations = EXCLUDED.name_translations,
  description_translations = EXCLUDED.description_translations;

-- =============================================================================
-- Development-Only Insights
-- NOTE: Development placeholders. Replace with approved editorial content before launch.
-- =============================================================================

-- Remove the original placeholders so the grid matches the reference set.
DELETE FROM public.insights
WHERE slug IN ('dev-why-multilingual-matters', 'dev-ai-in-customer-support', 'dev-website-performance-seo');

INSERT INTO public.insights (id, slug, title_translations, excerpt_translations, content_translations, reading_time_minutes, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('22222222-2222-4222-8222-222222222201', 'the-future-of-digital-scalability', '{"en": "The Future of Digital Scalability", "de": "Die Zukunft der digitalen Skalierbarkeit", "fr": "L''avenir de l''évolutivité numérique", "es": "El futuro de la escalabilidad digital"}'::jsonb, '{"en": "How modern infrastructure enables startups to compete with enterprise incumbents from day one.", "de": "Wie moderne Infrastruktur Startups befähigt, von Tag eins an mit etablierten Unternehmen zu konkurrieren.", "fr": "Comment l''infrastructure moderne permet aux startups de concurrencer les géants dès le premier jour.", "es": "Cómo la infraestructura moderna permite a las startups competir con las empresas establecidas desde el primer día."}'::jsonb, '{"en": "Cloud-native architecture has turned scalability from a competitive advantage into a baseline expectation. Startups can now provision infrastructure that once required enterprise budgets, global capacity in minutes, not quarters.\n\nThe brands that win design for scale from day one: clean data models, stateless services, and observability baked in. Scale is not an afterthought; it is an architecture decision you make before you need it.", "de": "Cloud-native Architekturen haben Skalierbarkeit von einem Wettbewerbsvorteil zu einer Grundanforderung gemacht. Startups können heute Infrastruktur bereitstellen, die früher Unternehmensbudgets erforderte, globale Kapazität in Minuten statt in Quartalen.\n\nDie Marken, die gewinnen, planen Skalierung von Tag eins: saubere Datenmodelle, zustandslose Dienste und integrierte Observability. Skalierung ist kein nachträglicher Gedanke, sondern eine Architekturentscheidung, die man trifft, bevor man sie braucht.", "fr": "L''architecture cloud-native a transformé la scalabilité d''un avantage concurrentiel en une exigence de base. Les startups peuvent désormais provisionner une infrastructure qui exigeait autrefois des budgets d''entreprise, une capacité mondiale en minutes, pas en trimestres.\n\nLes marques gagnantes conçoivent l''échelle dès le premier jour : modèles de données propres, services sans état et observabilité intégrée. L''échelle n''est pas une réflexion après coup ; c''est une décision d''architecture que l''on prend avant d''en avoir besoin.", "es": "La arquitectura cloud-native ha convertido la escalabilidad de una ventaja competitiva en una expectativa básica. Las startups pueden aprovisionar hoy infraestructura que antes requería presupuestos empresariales: capacidad global en minutos, no en trimestres.\n\nLas marcas que ganan diseñan para escalar desde el primer día: modelos de datos limpios, servicios sin estado y observabilidad integrada. Escalar no es una ocurrencia tardía; es una decisión de arquitectura que se toma antes de necesitarla."}'::jsonb, 6, '{"en": "The Future of Digital Scalability", "de": "Die Zukunft der digitalen Skalierbarkeit", "fr": "L''avenir de l''évolutivité numérique", "es": "El futuro de la escalabilidad digital"}'::jsonb, '{"en": "How modern infrastructure enables startups to compete with enterprise incumbents from day one.", "de": "Wie moderne Infrastruktur Startups befähigt, von Tag eins an mit etablierten Unternehmen zu konkurrieren.", "fr": "Comment l''infrastructure moderne permet aux startups de concurrencer les géants dès le premier jour.", "es": "Cómo la infraestructura moderna permite a las startups competir con las empresas establecidas desde el primer día."}'::jsonb, false, 'published', '2026-06-28T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222202', 'mastering-minimalist-ux-for-luxury-brands', '{"en": "Mastering Minimalist UX for Luxury Brands", "de": "Minimalistische UX für Luxusmarken meistern", "fr": "Maîtriser l''UX minimaliste pour les marques de luxe", "es": "Dominar la UX minimalista para marcas de lujo"}'::jsonb, '{"en": "Why simplicity drives premium perception and how to execute it flawlessly.", "de": "Warum Einfachheit eine Premium-Wahrnehmung erzeugt und wie man sie makellos umsetzt.", "fr": "Pourquoi la simplicité crée une perception premium et comment l''exécuter sans faille.", "es": "Por qué la simplicidad impulsa la percepción premium y cómo ejecutarla sin fisuras."}'::jsonb, '{"en": "Luxury is felt in what is absent. Minimalist interfaces signal confidence: generous whitespace, restrained palettes, and interactions that never compete with the product.\n\nExecuting minimalism flawlessly requires ruthless editing. Every element must earn its place, and every motion must feel intentional, because in premium products, restraint is the loudest statement.", "de": "Luxus spürt man in dem, was fehlt. Minimalistische Oberflächen signalisieren Selbstvertrauen: großzügiger Weißraum, zurückhaltende Paletten und Interaktionen, die nie mit dem Produkt konkurrieren.\n\nMinimalismus makellos umzusetzen erfordert kompromissloses Redigieren. Jedes Element muss seinen Platz verdienen, und jede Bewegung muss absichtsvoll wirken, denn in Premiumprodukten ist Zurückhaltung die lauteste Aussage.", "fr": "Le luxe se ressent dans ce qui est absent. Les interfaces minimalistes signalent la confiance : espaces généreux, palettes retenues et interactions qui ne rivalisent jamais avec le produit.\n\nExécuter le minimalisme sans faille exige une édition impitoyable. Chaque élément doit mériter sa place, et chaque mouvement doit sembler intentionnel, car dans les produits premium, la retenue est la déclaration la plus forte.", "es": "El lujo se siente en lo que está ausente. Las interfaces minimalistas transmiten confianza: espacios en blanco generosos, paletas contenidas e interacciones que nunca compiten con el producto.\n\nEjecutar el minimalismo sin fisuras exige una edición implacable. Cada elemento debe ganarse su lugar y cada movimiento debe sentirse intencional, porque en los productos premium la contención es la declaración más rotunda."}'::jsonb, 8, '{"en": "Mastering Minimalist UX for Luxury Brands", "de": "Minimalistische UX für Luxusmarken meistern", "fr": "Maîtriser l''UX minimaliste pour les marques de luxe", "es": "Dominar la UX minimalista para marcas de lujo"}'::jsonb, '{"en": "Why simplicity drives premium perception and how to execute it flawlessly.", "de": "Warum Einfachheit eine Premium-Wahrnehmung erzeugt und wie man sie makellos umsetzt.", "fr": "Pourquoi la simplicité crée une perception premium et comment l''exécuter sans faille.", "es": "Por qué la simplicidad impulsa la percepción premium y cómo ejecutarla sin fisuras."}'::jsonb, false, 'published', '2026-06-22T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222203', 'how-ai-is-revolutionizing-custom-automation', '{"en": "How AI is Revolutionizing Custom Automation", "de": "Wie KI die individuelle Automatisierung revolutioniert", "fr": "Comment l''IA révolutionne l''automatisation sur mesure", "es": "Cómo la IA está revolucionando la automatización personalizada"}'::jsonb, '{"en": "Practical applications of AI that deliver immediate ROI for growing businesses.", "de": "Praktische KI-Anwendungen mit sofortigem ROI für wachsende Unternehmen.", "fr": "Des applications pratiques de l''IA qui génèrent un ROI immédiat pour les entreprises en croissance.", "es": "Aplicaciones prácticas de la IA que generan un ROI inmediato para empresas en crecimiento."}'::jsonb, '{"en": "AI is no longer a novelty bolted onto products. Applied to internal workflows, it removes the repetitive tasks that quietly consume teams, triaging requests, drafting replies, and summarizing documents.\n\nThe highest-ROI automations are narrow and measurable. Start with one workflow, define the success metric, and let the model prove itself before scaling it across the organization.", "de": "KI ist längst keine Neuheit mehr, die an Produkte angehängt wird. In internen Workflows beseitigt sie die repetitiven Aufgaben, die Teams stillschweigend aufbrauchen, Anfragen sortieren, Antworten entwerfen und Dokumente zusammenfassen.\n\nDie Automatisierungen mit dem höchsten ROI sind eng begrenzt und messbar. Beginnen Sie mit einem Workflow, definieren Sie die Erfolgskennzahl und lassen Sie das Modell sich beweisen, bevor Sie es in der gesamten Organisation skalieren.", "fr": "L''IA n''est plus une nouveauté greffée sur les produits. Appliquée aux workflows internes, elle élimine les tâches répétitives qui épuisent silencieusement les équipes, trier les demandes, rédiger des réponses et résumer des documents.\n\nLes automatisations au meilleur ROI sont étroites et mesurables. Commencez par un workflow, définissez la métrique de succès et laissez le modèle faire ses preuves avant de l''étendre à toute l''organisation.", "es": "La IA ya no es una novedad añadida a los productos. Aplicada a los flujos de trabajo internos, elimina las tareas repetitivas que consumen silenciosamente a los equipos: clasificar solicitudes, redactar respuestas y resumir documentos.\n\nLas automatizaciones de mayor ROI son acotadas y medibles. Empieza con un flujo de trabajo, define la métrica de éxito y deja que el modelo demuestre su valor antes de escalarlo en toda la organización."}'::jsonb, 5, '{"en": "How AI is Revolutionizing Custom Automation", "de": "Wie KI die individuelle Automatisierung revolutioniert", "fr": "Comment l''IA révolutionne l''automatisation sur mesure", "es": "Cómo la IA está revolucionando la automatización personalizada"}'::jsonb, '{"en": "Practical applications of AI that deliver immediate ROI for growing businesses.", "de": "Praktische KI-Anwendungen mit sofortigem ROI für wachsende Unternehmen.", "fr": "Des applications pratiques de l''IA qui génèrent un ROI immédiat pour les entreprises en croissance.", "es": "Aplicaciones prácticas de la IA que generan un ROI inmediato para empresas en crecimiento."}'::jsonb, false, 'published', '2026-06-18T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222204', 'building-funnels-that-convert-at-3x-industry-average', '{"en": "Building Funnels That Convert at 3x Industry Average", "de": "Funnels mit dreifacher Branchen-Conversion aufbauen", "fr": "Construire des tunnels qui convertissent 3x mieux que la moyenne", "es": "Embudos que convierten 3 veces por encima del promedio"}'::jsonb, '{"en": "The data-backed framework we use to design high-conversion marketing systems.", "de": "Das datengestützte Framework, mit dem wir hochkonvertierende Marketingsysteme entwerfen.", "fr": "Le cadre fondé sur les données que nous utilisons pour concevoir des systèmes marketing à forte conversion.", "es": "El marco basado en datos que usamos para diseñar sistemas de marketing de alta conversión."}'::jsonb, '{"en": "High-conversion funnels are not built on guesswork. They are the product of structured experiments: clear hypotheses, disciplined testing, and ruthless measurement of every step.\n\nWe share the framework we use with clients, from first-touch messaging to post-purchase loops, and the metrics that tell you where the funnel is actually leaking.", "de": "Funnels mit hoher Conversion entstehen nicht durch Raten. Sie sind das Ergebnis strukturierter Experimente: klare Hypothesen, disziplinierte Tests und kompromisslose Messung jedes Schritts.\n\nWir teilen das Framework, das wir mit Kunden verwenden, von der Erstansprache bis zu Post-Purchase-Schleifen, und die Kennzahlen, die zeigen, wo der Funnel tatsächlich verliert.", "fr": "Les tunnels à forte conversion ne reposent pas sur la supposition. Ils sont le fruit d''expérimentations structurées : hypothèses claires, tests disciplinés et mesure impitoyable de chaque étape.\n\nNous partageons le cadre que nous utilisons avec nos clients, du premier message aux boucles post-achat, et les métriques qui révèlent où le tunnel fuit réellement.", "es": "Los embudos de alta conversión no se construyen con suposiciones. Son el resultado de experimentos estructurados: hipótesis claras, pruebas disciplinadas y medición rigurosa de cada paso.\n\nCompartimos el marco que usamos con los clientes, desde la primera impresión hasta los bucles poscompra, y las métricas que revelan dónde pierde realmente el embudo."}'::jsonb, 7, '{"en": "Building Funnels That Convert at 3x Industry Average", "de": "Funnels mit dreifacher Branchen-Conversion aufbauen", "fr": "Construire des tunnels qui convertissent 3x mieux que la moyenne", "es": "Embudos que convierten 3 veces por encima del promedio"}'::jsonb, '{"en": "The data-backed framework we use to design high-conversion marketing systems.", "de": "Das datengestützte Framework, mit dem wir hochkonvertierende Marketingsysteme entwerfen.", "fr": "Le cadre fondé sur les données que nous utilisons pour concevoir des systèmes marketing à forte conversion.", "es": "El marco basado en datos que usamos para diseñar sistemas de marketing de alta conversión."}'::jsonb, false, 'published', '2026-06-14T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222205', 'why-brand-positioning-matters-more-than-ever-in-2026', '{"en": "Why Brand Positioning Matters More Than Ever in 2026", "de": "Warum Markenpositionierung 2026 wichtiger ist denn je", "fr": "Pourquoi le positionnement de marque importe plus que jamais en 2026", "es": "Por qué el posicionamiento de marca importa más que nunca en 2026"}'::jsonb, '{"en": "In a saturated market, strategic positioning is the difference between being seen and being chosen.", "de": "In einem gesättigten Markt entscheidet strategische Positionierung zwischen gesehen und gewählt werden.", "fr": "Sur un marché saturé, le positionnement stratégique fait la différence entre être vu et être choisi.", "es": "En un mercado saturado, el posicionamiento estratégico marca la diferencia entre ser visto y ser elegido."}'::jsonb, '{"en": "In a market saturated with lookalike products, price alone is a race to the bottom. Positioning is the decision about who you serve and why you are the only credible choice for them.\n\nGreat positioning compounds. It makes marketing more efficient, sales conversations shorter, and pricing power stronger, the quiet moat behind every category leader.", "de": "In einem Markt voller austauschbarer Produkte ist der Preis allein ein Wettlauf nach unten. Positionierung ist die Entscheidung, wem man dient und warum man für diese Zielgruppe die einzig glaubwürdige Wahl ist.\n\nGroße Positionierung wirkt kumulativ. Sie macht Marketing effizienter, Verkaufsgespräche kürzer und die Preissetzungsmacht stärker, der stille Burggraben hinter jedem Kategorieführer.", "fr": "Sur un marché saturé de produits similaires, le prix seul est une course vers le bas. Le positionnement, c''est la décision de savoir qui vous servez et pourquoi vous êtes le seul choix crédible pour eux.\n\nUn grand positionnement se cumule. Il rend le marketing plus efficace, les conversations commerciales plus courtes et le pouvoir de fixation des prix plus fort, les douves silencieuses derrière chaque leader de catégorie.", "es": "En un mercado saturado de productos similares, el precio por sí solo es una carrera hacia abajo. El posicionamiento es la decisión sobre a quién sirves y por qué eres la única opción creíble para ellos.\n\nUn gran posicionamiento se acumula. Hace el marketing más eficiente, las conversaciones de venta más cortas y el poder de fijación de precios más fuerte: el foso silencioso detrás de cada líder de categoría."}'::jsonb, 9, '{"en": "Why Brand Positioning Matters More Than Ever in 2026", "de": "Warum Markenpositionierung 2026 wichtiger ist denn je", "fr": "Pourquoi le positionnement de marque importe plus que jamais en 2026", "es": "Por qué el posicionamiento de marca importa más que nunca en 2026"}'::jsonb, '{"en": "In a saturated market, strategic positioning is the difference between being seen and being chosen.", "de": "In einem gesättigten Markt entscheidet strategische Positionierung zwischen gesehen und gewählt werden.", "fr": "Sur un marché saturé, le positionnement stratégique fait la différence entre être vu et être choisi.", "es": "En un mercado saturado, el posicionamiento estratégico marca la diferencia entre ser visto y ser elegido."}'::jsonb, false, 'published', '2026-06-10T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222206', 'serverless-architecture-scaling-without-the-headaches', '{"en": "Serverless Architecture: Scaling Without the Headaches", "de": "Serverless-Architektur: Skalieren ohne Kopfschmerzen", "fr": "Architecture serverless : passer à l''échelle sans maux de tête", "es": "Arquitectura serverless: escalar sin dolores de cabeza"}'::jsonb, '{"en": "A practical guide to building resilient, auto-scaling applications with zero server management.", "de": "Ein praktischer Leitfaden für widerstandsfähige, automatisch skalierende Anwendungen ohne Serververwaltung.", "fr": "Un guide pratique pour créer des applications résilientes à mise à l''échelle automatique, sans gestion de serveurs.", "es": "Una guía práctica para crear aplicaciones resilientes y autoescalables sin gestión de servidores."}'::jsonb, '{"en": "Serverless shifts the burden of infrastructure from your team to the platform. You deploy functions, not servers, and scale happens automatically, even when traffic spikes overnight.\n\nThe trade-offs are real: cold starts, vendor coupling, and cost discipline. This guide covers the patterns that make serverless resilient and the mistakes that quietly inflate your bill.", "de": "Serverless verlagert die Infrastrukturlast vom Team auf die Plattform. Sie deployen Funktionen, keine Server, und die Skalierung erfolgt automatisch, selbst wenn der Traffic über Nacht ansteigt.\n\nDie Kompromisse sind real: Cold Starts, Anbieterbindung und Kostendisziplin. Dieser Leitfaden behandelt die Muster, die Serverless widerstandsfähig machen, und die Fehler, die Ihre Rechnung stillschweigend aufblähen.", "fr": "Le serverless transfère la charge de l''infrastructure de votre équipe vers la plateforme. Vous déployez des fonctions, pas des serveurs, et la mise à l''échelle se fait automatiquement, même lorsque le trafic explose pendant la nuit.\n\nLes compromis sont réels : démarrages à froid, couplage au fournisseur et discipline des coûts. Ce guide couvre les modèles qui rendent le serverless résilient et les erreurs qui gonflent silencieusement votre facture.", "es": "Serverless traslada la carga de la infraestructura de tu equipo a la plataforma. Despliegas funciones, no servidores, y la escala ocurre automáticamente, incluso cuando el tráfico se dispara de la noche a la mañana.\n\nLas contrapartidas son reales: arranques en frío, acoplamiento al proveedor y disciplina de costes. Esta guía cubre los patrones que hacen resiliente serverless y los errores que inflan silenciosamente tu factura."}'::jsonb, 10, '{"en": "Serverless Architecture: Scaling Without the Headaches", "de": "Serverless-Architektur: Skalieren ohne Kopfschmerzen", "fr": "Architecture serverless : passer à l''échelle sans maux de tête", "es": "Arquitectura serverless: escalar sin dolores de cabeza"}'::jsonb, '{"en": "A practical guide to building resilient, auto-scaling applications with zero server management.", "de": "Ein praktischer Leitfaden für widerstandsfähige, automatisch skalierende Anwendungen ohne Serververwaltung.", "fr": "Un guide pratique pour créer des applications résilientes à mise à l''échelle automatique, sans gestion de serveurs.", "es": "Una guía práctica para crear aplicaciones resilientes y autoescalables sin gestión de servidores."}'::jsonb, false, 'published', '2026-06-05T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222207', 'typography-systems-that-elevate-brand-perception', '{"en": "Typography Systems That Elevate Brand Perception", "de": "Schriftsysteme, die die Markenwahrnehmung steigern", "fr": "Des systèmes typographiques qui élèvent la perception de la marque", "es": "Sistemas tipográficos que elevan la percepción de marca"}'::jsonb, '{"en": "How intentional type choices create hierarchy, emotion, and unforgettable brand experiences.", "de": "Wie bewusste Schriftwahl Hierarchie, Emotion und unvergessliche Markenerlebnisse schafft.", "fr": "Comment des choix typographiques intentionnels créent hiérarchie, émotion et expériences de marque inoubliables.", "es": "Cómo las elecciones tipográficas intencionales crean jerarquía, emoción y experiencias de marca inolvidables."}'::jsonb, '{"en": "Typography is the voice of your brand. Before a single word is read, type establishes tone, hierarchy, and trust, or quietly erodes it.\n\nWe break down how to build a type system: pairing display and text faces, setting a modular scale, and choosing weights that communicate the personality you want customers to feel.", "de": "Typografie ist die Stimme Ihrer Marke. Bevor ein einziges Wort gelesen wird, etabliert die Schrift Ton, Hierarchie und Vertrauen, oder untergräbt sie stillschweigend.\n\nWir zeigen, wie man ein Schriftsystem aufbaut: Display- und Textschriften kombinieren, einen modularen Maßstab festlegen und Schriftschnitte wählen, die die Persönlichkeit vermitteln, die Kunden spüren sollen.", "fr": "La typographie est la voix de votre marque. Avant même qu''un seul mot ne soit lu, la typographie établit le ton, la hiérarchie et la confiance, ou les érode silencieusement.\n\nNous expliquons comment construire un système typographique : associer des polices display et textes, définir une échelle modulaire et choisir des graisses qui communiquent la personnalité que vous voulez que les clients ressentent.", "es": "La tipografía es la voz de tu marca. Antes de que se lea una sola palabra, la tipografía establece tono, jerarquía y confianza, o la erosiona silenciosamente.\n\nDesglosamos cómo construir un sistema tipográfico: combinar familias display y de texto, fijar una escala modular y elegir pesos que comuniquen la personalidad que quieres que sientan los clientes."}'::jsonb, 6, '{"en": "Typography Systems That Elevate Brand Perception", "de": "Schriftsysteme, die die Markenwahrnehmung steigern", "fr": "Des systèmes typographiques qui élèvent la perception de la marque", "es": "Sistemas tipográficos que elevan la percepción de marca"}'::jsonb, '{"en": "How intentional type choices create hierarchy, emotion, and unforgettable brand experiences.", "de": "Wie bewusste Schriftwahl Hierarchie, Emotion und unvergessliche Markenerlebnisse schafft.", "fr": "Comment des choix typographiques intentionnels créent hiérarchie, émotion et expériences de marque inoubliables.", "es": "Cómo las elecciones tipográficas intencionales crean jerarquía, emoción y experiencias de marca inolvidables."}'::jsonb, false, 'published', '2026-05-30T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222208', 'retention-over-acquisition-the-new-growth-playbook', '{"en": "Retention Over Acquisition: The New Growth Playbook", "de": "Bindung vor Akquise: Das neue Growth-Playbook", "fr": "La rétention avant l''acquisition : le nouveau playbook de croissance", "es": "Retención frente a adquisición: el nuevo manual de crecimiento"}'::jsonb, '{"en": "Why keeping customers is the most underrated strategy, and how to do it at scale.", "de": "Warum Kundenbindung die am meisten unterschätzte Strategie ist, und wie man sie skalieren kann.", "fr": "Pourquoi la fidélisation est la stratégie la plus sous-estimée, et comment la mettre à l''échelle.", "es": "Por qué retener clientes es la estrategia más infravalorada y cómo hacerlo a escala."}'::jsonb, '{"en": "Acquiring customers is expensive; keeping them is a choice. Retention programs compound, turning one-time buyers into predictable revenue.\n\nFrom onboarding flows to win-back campaigns, we look at the interventions with the highest leverage, and why measuring cohort retention beats watching vanity metrics.", "de": "Kundenakquise ist teuer; Kunden zu halten ist eine Entscheidung. Bindungsprogramme wirken kumulativ und verwandeln Einmalkäufer in planbare Umsätze.\n\nVon Onboarding-Flows bis zu Rückgewinnungskampagnen betrachten wir die Interventionen mit der höchsten Hebelwirkung, und warum die Messung der Kohortenbindung besser ist als das Beobachten von Vanity-Metriken.", "fr": "Acquérir des clients coûte cher ; les conserver est un choix. Les programmes de rétention se cumulent, transformant les acheteurs ponctuels en revenus prévisibles.\n\nDes parcours d''onboarding aux campagnes de reconquête, nous examinons les interventions à plus fort levier, et pourquoi mesurer la rétention par cohorte vaut mieux que surveiller des métriques de vanité.", "es": "Adquirir clientes es caro; retenerlos es una decisión. Los programas de retención se acumulan y convierten compradores únicos en ingresos predecibles.\n\nDesde los flujos de incorporación hasta las campañas de recuperación, analizamos las intervenciones de mayor apalancamiento y por qué medir la retención por cohortes supera a observar métricas de vanidad."}'::jsonb, 7, '{"en": "Retention Over Acquisition: The New Growth Playbook", "de": "Bindung vor Akquise: Das neue Growth-Playbook", "fr": "La rétention avant l''acquisition : le nouveau playbook de croissance", "es": "Retención frente a adquisición: el nuevo manual de crecimiento"}'::jsonb, '{"en": "Why keeping customers is the most underrated strategy, and how to do it at scale.", "de": "Warum Kundenbindung die am meisten unterschätzte Strategie ist, und wie man sie skalieren kann.", "fr": "Pourquoi la fidélisation est la stratégie la plus sous-estimée, et comment la mettre à l''échelle.", "es": "Por qué retener clientes es la estrategia más infravalorada y cómo hacerlo a escala."}'::jsonb, false, 'published', '2026-05-24T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222209', 'the-art-of-digital-transformation-a-ceos-guide', '{"en": "The Art of Digital Transformation: A CEO''s Guide", "de": "Die Kunst der digitalen Transformation: Ein Leitfaden für CEOs", "fr": "L''art de la transformation numérique : le guide du CEO", "es": "El arte de la transformación digital: guía para CEOs"}'::jsonb, '{"en": "Leading organizational change through technology adoption without losing your culture.", "de": "Organisatorischen Wandel durch Technologieeinführung führen, ohne die Kultur zu verlieren.", "fr": "Mener le changement organisationnel grâce à l''adoption technologique sans perdre votre culture.", "es": "Liderar el cambio organizativo mediante la adopción tecnológica sin perder la cultura."}'::jsonb, '{"en": "Digital transformation fails when it is treated as an IT project. It succeeds when leadership aligns technology with culture, incentives, and the way work actually happens.\n\nA practical guide for leaders: how to sequence change, communicate the why, and protect the culture that makes new tools stick.", "de": "Digitale Transformation scheitert, wenn sie als IT-Projekt behandelt wird. Sie gelingt, wenn Führung Technologie mit Kultur, Anreizen und der tatsächlichen Arbeitsweise in Einklang bringt.\n\nEin praktischer Leitfaden für Führungskräfte: Veränderungen richtig sequenzieren, das Warum kommunizieren und die Kultur schützen, die neue Werkzeuge nachhaltig verankert.", "fr": "La transformation numérique échoue lorsqu''elle est traitée comme un projet IT. Elle réussit lorsque le leadership aligne la technologie avec la culture, les incitations et la manière dont le travail se fait réellement.\n\nUn guide pratique pour les dirigeants : séquencer le changement, communiquer le pourquoi et protéger la culture qui fait adopter durablement les nouveaux outils.", "es": "La transformación digital fracasa cuando se trata como un proyecto de TI. Triunfa cuando el liderazgo alinea la tecnología con la cultura, los incentivos y la forma real en que se trabaja.\n\nUna guía práctica para líderes: cómo secuenciar el cambio, comunicar el porqué y proteger la cultura que hace que las nuevas herramientas perduren."}'::jsonb, 12, '{"en": "The Art of Digital Transformation: A CEO''s Guide", "de": "Die Kunst der digitalen Transformation: Ein Leitfaden für CEOs", "fr": "L''art de la transformation numérique : le guide du CEO", "es": "El arte de la transformación digital: guía para CEOs"}'::jsonb, '{"en": "Leading organizational change through technology adoption without losing your culture.", "de": "Organisatorischen Wandel durch Technologieeinführung führen, ohne die Kultur zu verlieren.", "fr": "Mener le changement organisationnel grâce à l''adoption technologique sans perdre votre culture.", "es": "Liderar el cambio organizativo mediante la adopción tecnológica sin perder la cultura."}'::jsonb, false, 'published', '2026-05-18T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222210', 'headless-cms-vs-traditional-making-the-right-choice', '{"en": "Headless CMS vs Traditional: Making the Right Choice", "de": "Headless-CMS vs. traditionell: Die richtige Wahl", "fr": "CMS headless vs traditionnel : faire le bon choix", "es": "CMS headless vs. tradicional: la elección correcta"}'::jsonb, '{"en": "A decision framework for selecting the content architecture that fits your team and goals.", "de": "Ein Entscheidungsrahmen für die Content-Architektur, die zu Team und Zielen passt.", "fr": "Un cadre de décision pour choisir l''architecture de contenu qui convient à votre équipe et à vos objectifs.", "es": "Un marco de decisión para elegir la arquitectura de contenido que encaja con tu equipo y tus objetivos."}'::jsonb, '{"en": "Headless CMS gives developers freedom and marketers speed, but it is not the right answer for every team. The choice depends on your content model, your publishing cadence, and your team''s skills.\n\nWe compare the two architectures across the decisions that matter: content modeling, previewing, performance, and the total cost of ownership over three years.", "de": "Headless-CMS gibt Entwicklern Freiheit und Marketern Geschwindigkeit, aber es ist nicht für jedes Team die richtige Antwort. Die Wahl hängt vom Content-Modell, der Veröffentlichungsfrequenz und den Fähigkeiten des Teams ab.\n\nWir vergleichen die beiden Architekturen anhand der entscheidenden Fragen: Content-Modellierung, Vorschau, Performance und die Gesamtbetriebskosten über drei Jahre.", "fr": "Le CMS headless donne aux développeurs la liberté et aux marketeurs la vitesse, mais ce n''est pas la bonne réponse pour chaque équipe. Le choix dépend de votre modèle de contenu, de votre rythme de publication et des compétences de votre équipe.\n\nNous comparons les deux architectures sur les décisions qui comptent : modélisation du contenu, aperçu, performance et coût total de possession sur trois ans.", "es": "El CMS headless da libertad a los desarrolladores y velocidad a los especialistas en marketing, pero no es la respuesta correcta para todos los equipos. La elección depende de tu modelo de contenido, tu ritmo de publicación y las habilidades de tu equipo.\n\nComparamos las dos arquitecturas en las decisiones que importan: modelado de contenido, previsualización, rendimiento y coste total de propiedad a tres años."}'::jsonb, 6, '{"en": "Headless CMS vs Traditional: Making the Right Choice", "de": "Headless-CMS vs. traditionell: Die richtige Wahl", "fr": "CMS headless vs traditionnel : faire le bon choix", "es": "CMS headless vs. tradicional: la elección correcta"}'::jsonb, '{"en": "A decision framework for selecting the content architecture that fits your team and goals.", "de": "Ein Entscheidungsrahmen für die Content-Architektur, die zu Team und Zielen passt.", "fr": "Un cadre de décision pour choisir l''architecture de contenu qui convient à votre équipe et à vos objectifs.", "es": "Un marco de decisión para elegir la arquitectura de contenido que encaja con tu equipo y tus objetivos."}'::jsonb, false, 'published', '2026-05-12T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222211', 'motion-design-principles-for-digital-products', '{"en": "Motion Design Principles for Digital Products", "de": "Motion-Design-Prinzipien für digitale Produkte", "fr": "Principes de motion design pour les produits numériques", "es": "Principios de motion design para productos digitales"}'::jsonb, '{"en": "How subtle animations create delight, guide attention, and make interfaces feel alive.", "de": "Wie subtile Animationen Freude erzeugen, Aufmerksamkeit lenken und Oberflächen lebendig machen.", "fr": "Comment des animations subtiles créent du plaisir, guident l''attention et donnent vie aux interfaces.", "es": "Cómo las animaciones sutiles crean deleite, guían la atención y hacen que las interfaces se sientan vivas."}'::jsonb, '{"en": "Motion is how interfaces explain themselves. A well-timed transition guides attention, communicates state, and makes a product feel alive without asking for attention.\n\nWe cover the principles behind great motion, duration, easing, and hierarchy, and the restraint that keeps animation delightful instead of distracting.", "de": "Motion ist die Art, wie Oberflächen sich selbst erklären. Ein gut getimter Übergang lenkt Aufmerksamkeit, kommuniziert Zustände und macht ein Produkt lebendig, ohne um Aufmerksamkeit zu bitten.\n\nWir behandeln die Prinzipien hinter großartiger Bewegung, Dauer, Easing und Hierarchie, und die Zurückhaltung, die Animation reizvoll statt ablenkend macht.", "fr": "Le mouvement, c''est ainsi que les interfaces s''expliquent. Une transition bien rythmée guide l''attention, communique l''état et rend un produit vivant sans demander d''attention.\n\nNous couvrons les principes d''un grand mouvement, durée, easing et hiérarchie, et la retenue qui rend l''animation agréable au lieu de distraire.", "es": "El movimiento es como las interfaces se explican a sí mismas. Una transición bien sincronizada guía la atención, comunica el estado y hace que un producto se sienta vivo sin pedir atención.\n\nCubrimos los principios detrás del gran movimiento: duración, easing y jerarquía, y la contención que mantiene la animación encantadora en lugar de distractora."}'::jsonb, 8, '{"en": "Motion Design Principles for Digital Products", "de": "Motion-Design-Prinzipien für digitale Produkte", "fr": "Principes de motion design pour les produits numériques", "es": "Principios de motion design para productos digitales"}'::jsonb, '{"en": "How subtle animations create delight, guide attention, and make interfaces feel alive.", "de": "Wie subtile Animationen Freude erzeugen, Aufmerksamkeit lenken und Oberflächen lebendig machen.", "fr": "Comment des animations subtiles créent du plaisir, guident l''attention et donnent vie aux interfaces.", "es": "Cómo las animaciones sutiles crean deleite, guían la atención y hacen que las interfaces se sientan vivas."}'::jsonb, false, 'published', '2026-05-06T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222212', 'seo-in-the-age-of-ai-what-actually-works-now', '{"en": "SEO in the Age of AI: What Actually Works Now", "de": "SEO im Zeitalter der KI: Was jetzt wirklich funktioniert", "fr": "Le SEO à l''ère de l''IA : ce qui fonctionne vraiment", "es": "SEO en la era de la IA: lo que realmente funciona"}'::jsonb, '{"en": "Adapting your organic strategy for AI-powered search engines and zero-click results.", "de": "Die organische Strategie für KI-gestützte Suchmaschinen und Zero-Click-Ergebnisse anpassen.", "fr": "Adapter votre stratégie organique aux moteurs de recherche IA et aux résultats zéro clic.", "es": "Adaptar tu estrategia orgánica a los buscadores con IA y a los resultados de cero clics."}'::jsonb, '{"en": "AI search is reshaping how people discover content. Answer engines summarize, compare, and cite, changing what it means to rank at all.\n\nWe share what still works: entity clarity, genuinely useful content, structured data, and building the kind of authority that machines and people both trust.", "de": "KI-Suche verändert, wie Menschen Inhalte entdecken. Antwortmaschinen fassen zusammen, vergleichen und zitieren, und verändern, was es überhaupt bedeutet, zu ranken.\n\nWir teilen, was weiterhin funktioniert: klare Entitäten, wirklich nützliche Inhalte, strukturierte Daten und der Aufbau einer Autorität, der Maschinen und Menschen gleichermaßen vertrauen.", "fr": "La recherche IA transforme la façon dont les gens découvrent le contenu. Les moteurs de réponse résument, comparent et citent, changeant ce que signifie réellement se classer.\n\nNous partageons ce qui fonctionne encore : clarté des entités, contenu réellement utile, données structurées et construction du type d''autorité auquel machines et humains font tous deux confiance.", "es": "La búsqueda con IA está cambiando cómo las personas descubren contenido. Los motores de respuesta resumen, comparan y citan, lo que cambia lo que significa posicionarse.\n\nCompartimos lo que sigue funcionando: claridad de entidades, contenido genuinamente útil, datos estructurados y construir el tipo de autoridad en la que confían tanto las máquinas como las personas."}'::jsonb, 5, '{"en": "SEO in the Age of AI: What Actually Works Now", "de": "SEO im Zeitalter der KI: Was jetzt wirklich funktioniert", "fr": "Le SEO à l''ère de l''IA : ce qui fonctionne vraiment", "es": "SEO en la era de la IA: lo que realmente funciona"}'::jsonb, '{"en": "Adapting your organic strategy for AI-powered search engines and zero-click results.", "de": "Die organische Strategie für KI-gestützte Suchmaschinen und Zero-Click-Ergebnisse anpassen.", "fr": "Adapter votre stratégie organique aux moteurs de recherche IA et aux résultats zéro clic.", "es": "Adaptar tu estrategia orgánica a los buscadores con IA y a los resultados de cero clics."}'::jsonb, false, 'published', '2026-04-28T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  excerpt_translations = EXCLUDED.excerpt_translations,
  content_translations = EXCLUDED.content_translations,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title_translations = EXCLUDED.seo_title_translations,
  seo_description_translations = EXCLUDED.seo_description_translations,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- =============================================================================
-- Development-Only Insight Category Links
-- =============================================================================

INSERT INTO public.insight_category_links (insight_id, category_id)
VALUES
  ('22222222-2222-4222-8222-222222222201', '44444444-4444-4444-8444-444444444401'),
  ('22222222-2222-4222-8222-222222222202', '44444444-4444-4444-8444-444444444402'),
  ('22222222-2222-4222-8222-222222222203', '44444444-4444-4444-8444-444444444403'),
  ('22222222-2222-4222-8222-222222222204', '44444444-4444-4444-8444-444444444404'),
  ('22222222-2222-4222-8222-222222222205', '44444444-4444-4444-8444-444444444401'),
  ('22222222-2222-4222-8222-222222222206', '44444444-4444-4444-8444-444444444403'),
  ('22222222-2222-4222-8222-222222222207', '44444444-4444-4444-8444-444444444402'),
  ('22222222-2222-4222-8222-222222222208', '44444444-4444-4444-8444-444444444404'),
  ('22222222-2222-4222-8222-222222222209', '44444444-4444-4444-8444-444444444401'),
  ('22222222-2222-4222-8222-222222222210', '44444444-4444-4444-8444-444444444403'),
  ('22222222-2222-4222-8222-222222222211', '44444444-4444-4444-8444-444444444402'),
  ('22222222-2222-4222-8222-222222222212', '44444444-4444-4444-8444-444444444404')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- Development-Only Testimonials
-- NOTE: Development placeholders. Replace with verified real client quotes before launch.
-- =============================================================================

INSERT INTO public.testimonials (id, quote_translations, person_name, person_role_translations, company_name, display_order, is_featured, is_visible, is_verified, source)
VALUES
  ('33333333-3333-4333-8333-333333333311', '{"en": "Stratifit rebuilt our entire digital presence. Within six months we doubled online revenue and our brand finally looks the part.", "de": "Stratifit hat unsere gesamte digitale Präsenz neu aufgebaut. Innerhalb von sechs Monaten haben wir den Online-Umsatz verdoppelt und unsere Marke sieht endlich danach aus.", "fr": "Stratifit a reconstruit toute notre présence numérique. En six mois, nous avons doublé notre chiffre d affaires en ligne et notre marque a enfin l allure qu elle mérite.", "es": "Stratifit reconstruyó toda nuestra presencia digital. En seis meses duplicamos los ingresos online y nuestra marca por fin tiene la imagen que merece."}'::jsonb, 'Claire Fontaine', '{"en": "CEO", "de": "CEO", "fr": "PDG", "es": "CEO"}'::jsonb, 'Maison Lumière', 1, true, true, true, 'website'),
  ('33333333-3333-4333-8333-333333333312', '{"en": "The website Stratifit delivered converts beautifully. Our demo requests grew 340% in the first quarter after launch.", "de": "Die Website, die Stratifit geliefert hat, konvertiert hervorragend. Unsere Demo-Anfragen stiegen im ersten Quartal nach dem Start um 340 %.", "fr": "Le site livré par Stratifit convertit magnifiquement. Nos demandes de démo ont augmenté de 340 % au premier trimestre après le lancement.", "es": "El sitio web que Stratifit entregó convierte de maravilla. Nuestras solicitudes de demo crecieron un 340 % en el primer trimestre tras el lanzamiento."}'::jsonb, 'Marcus Weber', '{"en": "Co-Founder & CTO", "de": "Mitgründer & CTO", "fr": "Co-fondateur & CTO", "es": "Co-fundador y CTO"}'::jsonb, 'Nova Fintech', 2, true, true, true, 'google'),
  ('33333333-3333-4333-8333-333333333313', '{"en": "Their AI assistant handles 78% of our support tickets end-to-end. Our team finally focuses on complex cases instead of repetitive ones.", "de": "Ihr KI-Assistent bearbeitet 78 % unserer Support-Tickets vollständig. Unser Team konzentriert sich endlich auf komplexe Fälle statt auf Routineaufgaben.", "fr": "Leur assistant IA traite 78 % de nos tickets de support de bout en bout. Notre équipe se concentre enfin sur les cas complexes plutôt que répétitifs.", "es": "Su asistente de IA gestiona el 78 % de nuestros tickets de soporte de principio a fin. Nuestro equipo por fin se centra en casos complejos en lugar de repetitivos."}'::jsonb, 'Sofia Rossi', '{"en": "Head of Customer Experience", "de": "Leiterin Kundenerlebnis", "fr": "Responsable de l expérience client", "es": "Directora de Experiencia del Cliente"}'::jsonb, 'Helios Health', 3, true, true, true, 'website')
ON CONFLICT (id) DO UPDATE SET
  quote_translations = EXCLUDED.quote_translations,
  person_name = EXCLUDED.person_name,
  person_role_translations = EXCLUDED.person_role_translations,
  company_name = EXCLUDED.company_name,
  is_visible = EXCLUDED.is_visible,
  is_verified = EXCLUDED.is_verified,
  source = EXCLUDED.source;



-- =============================================================================
-- Email Inbox Sections
-- NOTE: Defaults mirror migration 00060; safe to rerun.
-- =============================================================================

INSERT INTO public.email_inbox_sections (slug, name_translations, enabled, routing_addresses, form_source_key, from_address, display_order)
VALUES
  ('contact',
   '{"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}'::jsonb,
   true,
   '{"contact@stratifit.com", "hello@stratifit.com"}'::text[],
   'contact_form',
   'hello@stratifit.com',
   1),
  ('brand-design',
   '{"en": "Brand Design", "de": "Markengestaltung", "fr": "Design de marque", "es": "Diseño de marca"}'::jsonb,
   true,
   '{"branding@stratifit.com"}'::text[],
   null,
   'hello@stratifit.com',
   2),
  ('website-development',
   '{"en": "Website Development", "de": "Webentwicklung", "fr": "Développement web", "es": "Desarrollo web"}'::jsonb,
   true,
   '{"web@stratifit.com"}'::text[],
   null,
   'hello@stratifit.com',
   3),
  ('ai-automation',
   '{"en": "AI & Automation", "de": "KI & Automatisierung", "fr": "IA & Automatisation", "es": "IA y automatización"}'::jsonb,
   true,
   '{"ai@stratifit.com"}'::text[],
   null,
   'hello@stratifit.com',
   4),
  ('acquisition',
   '{"en": "Acquisition", "de": "Unternehmenskauf", "fr": "Acquisition", "es": "Adquisición"}'::jsonb,
   true,
   '{"acquisition@stratifit.com"}'::text[],
   'acquisition_form',
   'hello@stratifit.com',
   5),
  ('support',
   '{"en": "Support", "de": "Support", "fr": "Support", "es": "Soporte"}'::jsonb,
   true,
   '{"support@stratifit.com"}'::text[],
   null,
   'hello@stratifit.com',
   6),
  ('other',
   '{"en": "Other", "de": "Sonstiges", "fr": "Autre", "es": "Otro"}'::jsonb,
   true,
   '{}'::text[],
   null,
   'hello@stratifit.com',
   99)
ON CONFLICT (slug) DO NOTHING;
