-- Seed Data: Stratifit Digital Agency Platform
-- Description: Predictable development content for all major content types.
-- Safe to rerun: Uses ON CONFLICT for idempotency.
-- No production secrets included.

-- =============================================================================
-- Site Settings (Singleton)
-- =============================================================================

INSERT INTO public.site_settings (singleton_key, site_name, site_description_translations, contact_email, default_locale, supported_locales, default_seo)
VALUES (
  true,
  'Stratifit',
  '{"en": "Premium digital agency specializing in brand design, website development, AI automation, and growth marketing.", "de": "Premium-Digitalagentur spezialisiert auf Branding, Webentwicklung, KI-Automatisierung und Growth Marketing.", "fr": "Agence digitale premium spécialisée en design de marque, développement web, automatisation IA et marketing de croissance.", "es": "Agencia digital premium especializada en diseño de marca, desarrollo web, automatización de IA y marketing de crecimiento."}'::jsonb,
  'hello@stratifit.com',
  'en',
  ARRAY['en', 'de', 'fr', 'es'],
  '{"en": {"title": "Stratifit | Premium Digital Agency", "description": "We build premium digital experiences that drive growth."}}'::jsonb
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
  ('process', 'Process', '{"en": "Process", "de": "Prozess", "fr": "Processus", "es": "Proceso"}'::jsonb, '{"en": "How We", "de": "Wie wir", "fr": "Comment nous", "es": "Cómo"}'::jsonb, '{"en": "Work", "de": "arbeiten", "fr": "travaillons", "es": "trabajamos"}'::jsonb, '{"en": "A proven framework that takes you from idea to scale — predictably and efficiently.", "de": "Ein bewährtes Rahmenwerk, das Sie von der Idee bis zur Skalierung führt – vorhersehbar und effizient.", "fr": "Un cadre éprouvé qui vous mène de l''idée à l''échelle, de manière prévisible et efficace.", "es": "Un marco probado que le lleva de la idea a la escala, de forma predecible y eficiente."}'::jsonb, true, 20),
  ('why-choose-us', 'Why Choose Us', '{"en": "Why Us", "de": "Warum wir", "fr": "Pourquoi nous", "es": "Por qué nosotros"}'::jsonb, '{"en": "Not Just Another", "de": "Nicht nur eine weitere", "fr": "Pas juste une autre", "es": "No solo otra"}'::jsonb, '{"en": "Agency", "de": "Agentur", "fr": "agence", "es": "agencia"}'::jsonb, '{"en": "We build digital assets that drive valuation and market authority — not just websites.", "de": "Wir bauen digitale Assets, die Bewertung und Marktautorität steigern – nicht nur Websites.", "fr": "Nous créons des actifs numériques qui augmentent la valorisation et l''autorité de marché – pas seulement des sites web.", "es": "Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web."}'::jsonb, true, 30),
  ('insights', 'Insights & Expertise', '{"en": "Knowledge", "de": "Wissen", "fr": "Savoir", "es": "Conocimiento"}'::jsonb, '{"en": "Insights &", "de": "Einblicke &", "fr": "Insights &", "es": "Perspectivas y"}'::jsonb, '{"en": "Expertise", "de": "Expertise", "fr": "Expertise", "es": "Expertise"}'::jsonb, '{"en": "Thought leadership, industry perspectives, and actionable strategies from our team of strategists, designers, and engineers.", "de": "Thought Leadership, Branchenperspektiven und umsetzbare Strategien von unserem Team aus Strategen, Designern und Ingenieuren.", "fr": "Leadership éclairé, perspectives sectorielles et stratégies concrètes de notre équipe de stratèges, designers et ingénieurs.", "es": "Liderazgo de pensamiento, perspectivas de la industria y estrategias accionables de nuestro equipo de estrategas, diseñadores e ingenieros."}'::jsonb, true, 40),
  ('portfolio', 'Portfolio', '{"en": "Portfolio", "de": "Portfolio", "fr": "Portfolio", "es": "Portafolio"}'::jsonb, '{"en": "Our", "de": "Unsere", "fr": "Nos", "es": "Nuestros"}'::jsonb, '{"en": "Work", "de": "Arbeiten", "fr": "Réalisations", "es": "Proyectos"}'::jsonb, '{"en": "We craft digital experiences that define industries and elevate brands through precision and creativity.", "de": "Wir gestalten digitale Erlebnisse, die Branchen definieren und Marken durch Präzision und Kreativität aufwerten.", "fr": "Nous créons des expériences numériques qui définissent les industries et élèvent les marques grâce à la précision et la créativité.", "es": "Creamos experiencias digitales que definen industrias y elevan marcas a través de la precisión y la creatividad."}'::jsonb, true, 50),
  ('testimonials', 'Testimonials', '{"en": "Testimonials", "de": "Referenzen", "fr": "Témoignages", "es": "Testimonios"}'::jsonb, '{"en": "What Our Clients", "de": "Was unsere Kunden", "fr": "Ce que disent nos clients", "es": "Lo que dicen nuestros clientes"}'::jsonb, '{"en": "Say", "de": "sagen", "fr": "", "es": ""}'::jsonb, '{"en": "Don''t take our word for it — hear from the brands we''ve helped scale.", "de": "Verlassen Sie sich nicht nur auf unser Wort – hören Sie, was die Marken sagen, denen wir zum Wachstum verholfen haben.", "fr": "Ne nous croyez pas sur parole – écoutez les marques que nous avons aidées à se développer.", "es": "No confíe solo en nuestra palabra: escuche a las marcas que hemos ayudado a escalar."}'::jsonb, true, 60),
  ('pricing', 'Pricing', '{"en": "Pricing", "de": "Preise", "fr": "Tarifs", "es": "Precios"}'::jsonb, '{"en": "Service", "de": "Service", "fr": "Forfaits de", "es": "Paquetes de"}'::jsonb, '{"en": "Packages", "de": "Pakete", "fr": "services", "es": "servicios"}'::jsonb, '{"en": "Transparent pricing for every stage of growth. Start where you are and scale with confidence.", "de": "Transparente Preise für jede Wachstumsphase. Starten Sie dort, wo Sie sind, und skalieren Sie mit Zuversicht.", "fr": "Des tarifs transparents pour chaque étape de croissance. Commencez là où vous êtes et développez-vous en confiance.", "es": "Precios transparentes para cada etapa de crecimiento. Empiece donde está y escale con confianza."}'::jsonb, true, 70),
  ('faq', 'FAQ', '{"en": "Support", "de": "Support", "fr": "Support", "es": "Soporte"}'::jsonb, '{"en": "Frequently Asked", "de": "Häufig gestellte", "fr": "Questions", "es": "Preguntas"}'::jsonb, '{"en": "Questions", "de": "Fragen", "fr": "fréquentes", "es": "frecuentes"}'::jsonb, '{"en": "Clear answers to the most common questions we hear from clients.", "de": "Klare Antworten auf die häufigsten Fragen, die wir von Kunden hören.", "fr": "Des réponses claires aux questions les plus courantes que nous recevons de nos clients.", "es": "Respuestas claras a las preguntas más comunes que recibimos de los clientes."}'::jsonb, true, 80),
  ('contact', 'Contact', '{"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}'::jsonb, '{"en": "Let''s Talk", "de": "Sprechen wir", "fr": "Parlons-en", "es": "Hablemos"}'::jsonb, '{}'::jsonb, '{"en": "Ready to start your project? Fill out the form and we''ll get back to you within 24 hours.", "de": "Bereit, Ihr Projekt zu starten? Füllen Sie das Formular aus – wir melden uns innerhalb von 24 Stunden.", "fr": "Prêt à lancer votre projet ? Remplissez le formulaire et nous vous répondrons sous 24 heures.", "es": "¿Listo para empezar su proyecto? Complete el formulario y le responderemos en 24 horas."}'::jsonb, true, 95)
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
-- Detail Pages (Privacy, Terms, Cookie Policy, Imprint, Careers)
-- Structured blocks: heading | paragraph | note, each with 4-language text.
-- =============================================================================

INSERT INTO public.detail_pages (slug, title_translations, subtitle_translations, content_translations, is_visible)
VALUES
  ('privacy',
   '{"en": "Privacy Policy", "de": "Datenschutzerklärung", "fr": "Politique de confidentialité", "es": "Política de privacidad"}'::jsonb,
   '{"en": "Last updated: August 2026", "de": "Zuletzt aktualisiert: August 2026", "fr": "Dernière mise à jour : août 2026", "es": "Última actualización: agosto de 2026"}'::jsonb,
   '[
     {"type": "paragraph", "text_translations": {"en": "This privacy policy explains how Stratifit collects, uses, and protects personal information submitted through this website.", "de": "Diese Datenschutzerklärung erläutert, wie Stratifit personenbezogene Daten erhebt, verwendet und schützt, die über diese Website übermittelt werden.", "fr": "Cette politique de confidentialité explique comment Stratifit collecte, utilise et protège les informations personnelles soumises via ce site web.", "es": "Esta política de privacidad explica cómo Stratifit recopila, utiliza y protege la información personal enviada a través de este sitio web."}},
     {"type": "heading", "text_translations": {"en": "1. Data we collect", "de": "1. Welche Daten wir erheben", "fr": "1. Données que nous collectons", "es": "1. Datos que recopilamos"}},
     {"type": "paragraph", "text_translations": {"en": "When you contact us, we collect the details you provide: name, email, phone, company, and message content. We also collect basic technical data such as the pages you visit.", "de": "Wenn Sie uns kontaktieren, erheben wir die von Ihnen angegebenen Daten: Name, E-Mail, Telefon, Unternehmen und Nachrichteninhalt. Wir erheben außerdem grundlegende technische Daten wie die von Ihnen besuchten Seiten.", "fr": "Lorsque vous nous contactez, nous collectons les informations que vous fournissez : nom, e-mail, téléphone, entreprise et contenu du message. Nous collectons également des données techniques de base telles que les pages que vous visitez.", "es": "Cuando nos contacta, recopilamos los datos que nos proporciona: nombre, correo electrónico, teléfono, empresa y contenido del mensaje. También recopilamos datos técnicos básicos como las páginas que visita."}},
     {"type": "heading", "text_translations": {"en": "2. How we use data", "de": "2. Wie wir Daten verwenden", "fr": "2. Comment nous utilisons les données", "es": "2. Cómo utilizamos los datos"}},
     {"type": "paragraph", "text_translations": {"en": "We use your information to respond to enquiries, qualify leads, and improve our services. We do not sell your personal data.", "de": "Wir verwenden Ihre Daten, um Anfragen zu beantworten, Leads zu qualifizieren und unsere Dienste zu verbessern. Wir verkaufen Ihre personenbezogenen Daten nicht.", "fr": "Nous utilisons vos informations pour répondre aux demandes, qualifier les prospects et améliorer nos services. Nous ne vendons pas vos données personnelles.", "es": "Utilizamos su información para responder consultas, calificar clientes potenciales y mejorar nuestros servicios. No vendemos sus datos personales."}},
     {"type": "heading", "text_translations": {"en": "3. Legal basis", "de": "3. Rechtsgrundlage", "fr": "3. Base juridique", "es": "3. Base legal"}},
     {"type": "paragraph", "text_translations": {"en": "We process personal data based on your consent and on our legitimate interest in operating our business and responding to enquiries.", "de": "Wir verarbeiten personenbezogene Daten auf Grundlage Ihrer Einwilligung und unseres berechtigten Interesses am Betrieb unseres Unternehmens und an der Beantwortung von Anfragen.", "fr": "Nous traitons les données personnelles sur la base de votre consentement et de notre intérêt légitime à exploiter notre entreprise et à répondre aux demandes.", "es": "Procesamos datos personales basándonos en su consentimiento y en nuestro interés legítimo de operar nuestro negocio y responder consultas."}},
     {"type": "heading", "text_translations": {"en": "4. Your rights", "de": "4. Ihre Rechte", "fr": "4. Vos droits", "es": "4. Sus derechos"}},
     {"type": "paragraph", "text_translations": {"en": "You may request access to, correction of, or deletion of your personal data at any time. Contact us to exercise these rights.", "de": "Sie können jederzeit Zugriff auf Ihre personenbezogenen Daten, deren Berichtigung oder Löschung verlangen. Kontaktieren Sie uns, um diese Rechte auszuüben.", "fr": "Vous pouvez demander l''accès à vos données personnelles, leur correction ou leur suppression à tout moment. Contactez-nous pour exercer ces droits.", "es": "Puede solicitar el acceso, la corrección o la eliminación de sus datos personales en cualquier momento. Contáctenos para ejercer estos derechos."}},
     {"type": "heading", "text_translations": {"en": "5. Contact", "de": "5. Kontakt", "fr": "5. Contact", "es": "5. Contacto"}},
     {"type": "paragraph", "text_translations": {"en": "For privacy questions, contact us through the contact page or email the address listed on this website.", "de": "Bei Datenschutzfragen kontaktieren Sie uns über die Kontaktseite oder per E-Mail an die auf dieser Website angegebene Adresse.", "fr": "Pour toute question relative à la confidentialité, contactez-nous via la page contact ou par e-mail à l''adresse indiquée sur ce site.", "es": "Para preguntas sobre privacidad, contáctenos a través de la página de contacto o por correo a la dirección indicada en este sitio web."}},
     {"type": "note", "text_translations": {"en": "Note: This placeholder must be reviewed and finalized by qualified legal counsel before launch.", "de": "Hinweis: Dieser Platzhalter muss vor dem Launch von qualifiziertem Rechtsbeistand geprüft und finalisiert werden.", "fr": "Remarque : ce texte provisoire doit être révisé et finalisé par un conseiller juridique qualifié avant le lancement.", "es": "Nota: este texto provisional debe ser revisado y finalizado por un asesor legal cualificado antes del lanzamiento."}}
   ]'::jsonb,
   true),
  ('terms-conditions',
   '{"en": "Terms of Service", "de": "Nutzungsbedingungen", "fr": "Conditions d''utilisation", "es": "Términos del servicio"}'::jsonb,
   '{"en": "Last updated: August 2026", "de": "Zuletzt aktualisiert: August 2026", "fr": "Dernière mise à jour : août 2026", "es": "Última actualización: agosto de 2026"}'::jsonb,
   '[
     {"type": "paragraph", "text_translations": {"en": "These terms govern the use of the Stratifit website and its services. By accessing this website, you agree to these terms.", "de": "Diese Bedingungen regeln die Nutzung der Stratifit-Website und ihrer Dienste. Mit dem Zugriff auf diese Website stimmen Sie diesen Bedingungen zu.", "fr": "Ces conditions régissent l''utilisation du site web Stratifit et de ses services. En accédant à ce site, vous acceptez ces conditions.", "es": "Estos términos rigen el uso del sitio web de Stratifit y sus servicios. Al acceder a este sitio web, acepta estos términos."}},
     {"type": "heading", "text_translations": {"en": "1. Services", "de": "1. Dienstleistungen", "fr": "1. Services", "es": "1. Servicios"}},
     {"type": "paragraph", "text_translations": {"en": "Stratifit provides digital agency services including brand design, website development, AI & automation, and growth marketing.", "de": "Stratifit bietet Digitalagentur-Leistungen an, darunter Markengestaltung, Webentwicklung, KI & Automatisierung und Growth Marketing.", "fr": "Stratifit fournit des services d''agence digitale, notamment le design de marque, le développement web, l''IA & l''automatisation et le marketing de croissance.", "es": "Stratifit ofrece servicios de agencia digital, incluidos diseño de marca, desarrollo web, IA y automatización, y marketing de crecimiento."}},
     {"type": "heading", "text_translations": {"en": "2. Intellectual property", "de": "2. Geistiges Eigentum", "fr": "2. Propriété intellectuelle", "es": "2. Propiedad intelectual"}},
     {"type": "paragraph", "text_translations": {"en": "All content, designs, and materials delivered remain the intellectual property of their respective owners unless agreed otherwise in writing.", "de": "Alle gelieferten Inhalte, Designs und Materialien bleiben Eigentum der jeweiligen Rechteinhaber, sofern nichts anderes schriftlich vereinbart wurde.", "fr": "Tous les contenus, designs et matériels livrés restent la propriété intellectuelle de leurs propriétaires respectifs, sauf accord écrit contraire.", "es": "Todo el contenido, los diseños y los materiales entregados siguen siendo propiedad intelectual de sus respectivos propietarios, salvo acuerdo escrito en contrario."}},
     {"type": "heading", "text_translations": {"en": "3. Limitation of liability", "de": "3. Haftungsbeschränkung", "fr": "3. Limitation de responsabilité", "es": "3. Limitación de responsabilidad"}},
     {"type": "paragraph", "text_translations": {"en": "Stratifit is not liable for indirect or consequential damages arising from the use of this website or its services.", "de": "Stratifit haftet nicht für mittelbare oder Folgeschäden, die aus der Nutzung dieser Website oder ihrer Dienste entstehen.", "fr": "Stratifit n''est pas responsable des dommages indirects ou consécutifs résultant de l''utilisation de ce site web ou de ses services.", "es": "Stratifit no es responsable de los daños indirectos o consecuentes derivados del uso de este sitio web o de sus servicios."}},
     {"type": "heading", "text_translations": {"en": "4. Contact", "de": "4. Kontakt", "fr": "4. Contact", "es": "4. Contacto"}},
     {"type": "paragraph", "text_translations": {"en": "For questions about these terms, contact us through the contact page.", "de": "Bei Fragen zu diesen Bedingungen kontaktieren Sie uns über die Kontaktseite.", "fr": "Pour toute question concernant ces conditions, contactez-nous via la page contact.", "es": "Para preguntas sobre estos términos, contáctenos a través de la página de contacto."}},
     {"type": "note", "text_translations": {"en": "Note: This placeholder must be reviewed and finalized by qualified legal counsel before launch.", "de": "Hinweis: Dieser Platzhalter muss vor dem Launch von qualifiziertem Rechtsbeistand geprüft und finalisiert werden.", "fr": "Remarque : ce texte provisoire doit être révisé et finalisé par un conseiller juridique qualifié avant le lancement.", "es": "Nota: este texto provisional debe ser revisado y finalizado por un asesor legal cualificado antes del lanzamiento."}}
   ]'::jsonb,
   true),
  ('cookie-policy',
   '{"en": "Cookie Policy", "de": "Cookie-Richtlinie", "fr": "Politique de cookies", "es": "Política de cookies"}'::jsonb,
   '{"en": "Last updated: August 2026", "de": "Zuletzt aktualisiert: August 2026", "fr": "Dernière mise à jour : août 2026", "es": "Última actualización: agosto de 2026"}'::jsonb,
   '[
     {"type": "paragraph", "text_translations": {"en": "This cookie policy explains how Stratifit uses cookies and similar technologies on this website.", "de": "Diese Cookie-Richtlinie erläutert, wie Stratifit Cookies und ähnliche Technologien auf dieser Website verwendet.", "fr": "Cette politique de cookies explique comment Stratifit utilise les cookies et technologies similaires sur ce site web.", "es": "Esta política de cookies explica cómo Stratifit utiliza cookies y tecnologías similares en este sitio web."}},
     {"type": "heading", "text_translations": {"en": "1. What are cookies", "de": "1. Was sind Cookies", "fr": "1. Que sont les cookies", "es": "1. Qué son las cookies"}},
     {"type": "paragraph", "text_translations": {"en": "Cookies are small text files stored on your device that help websites function and improve your browsing experience.", "de": "Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden und Websites helfen, zu funktionieren und Ihr Surferlebnis zu verbessern.", "fr": "Les cookies sont de petits fichiers texte stockés sur votre appareil qui aident les sites web à fonctionner et à améliorer votre expérience de navigation.", "es": "Las cookies son pequeños archivos de texto almacenados en su dispositivo que ayudan a que los sitios web funcionen y mejoran su experiencia de navegación."}},
     {"type": "heading", "text_translations": {"en": "2. How we use cookies", "de": "2. Wie wir Cookies verwenden", "fr": "2. Comment nous utilisons les cookies", "es": "2. Cómo utilizamos las cookies"}},
     {"type": "paragraph", "text_translations": {"en": "We use essential cookies for basic site functionality and, where enabled, analytics cookies to understand how visitors use the site.", "de": "Wir verwenden notwendige Cookies für die grundlegende Funktionalität der Website und, sofern aktiviert, Analyse-Cookies, um zu verstehen, wie Besucher die Website nutzen.", "fr": "Nous utilisons des cookies essentiels pour le fonctionnement de base du site et, lorsqu''ils sont activés, des cookies d''analyse pour comprendre comment les visiteurs utilisent le site.", "es": "Utilizamos cookies esenciales para el funcionamiento básico del sitio y, cuando están habilitadas, cookies de análisis para entender cómo usan el sitio los visitantes."}},
     {"type": "heading", "text_translations": {"en": "3. Managing cookies", "de": "3. Cookies verwalten", "fr": "3. Gestion des cookies", "es": "3. Gestión de cookies"}},
     {"type": "paragraph", "text_translations": {"en": "You can control or delete cookies through your browser settings at any time. Disabling cookies may affect site functionality.", "de": "Sie können Cookies jederzeit über die Einstellungen Ihres Browsers steuern oder löschen. Das Deaktivieren von Cookies kann die Funktionalität der Website beeinträchtigen.", "fr": "Vous pouvez contrôler ou supprimer les cookies via les paramètres de votre navigateur à tout moment. La désactivation des cookies peut affecter le fonctionnement du site.", "es": "Puede controlar o eliminar las cookies a través de la configuración de su navegador en cualquier momento. Deshabilitar las cookies puede afectar el funcionamiento del sitio."}},
     {"type": "heading", "text_translations": {"en": "4. Contact", "de": "4. Kontakt", "fr": "4. Contact", "es": "4. Contacto"}},
     {"type": "paragraph", "text_translations": {"en": "For questions about this cookie policy, contact us through the contact page.", "de": "Bei Fragen zu dieser Cookie-Richtlinie kontaktieren Sie uns über die Kontaktseite.", "fr": "Pour toute question concernant cette politique de cookies, contactez-nous via la page contact.", "es": "Para preguntas sobre esta política de cookies, contáctenos a través de la página de contacto."}},
     {"type": "note", "text_translations": {"en": "Note: This placeholder must be reviewed and finalized by qualified legal counsel before launch.", "de": "Hinweis: Dieser Platzhalter muss vor dem Launch von qualifiziertem Rechtsbeistand geprüft und finalisiert werden.", "fr": "Remarque : ce texte provisoire doit être révisé et finalisé par un conseiller juridique qualifié avant le lancement.", "es": "Nota: este texto provisional debe ser revisado y finalizado por un asesor legal cualificado antes del lanzamiento."}}
   ]'::jsonb,
   true),
  ('imprint',
   '{"en": "Imprint", "de": "Impressum", "fr": "Mentions légales", "es": "Aviso legal"}'::jsonb,
   '{"en": "Legal notice / Impressum", "de": "Rechtliche Hinweise / Impressum", "fr": "Mentions légales", "es": "Aviso legal"}'::jsonb,
   '[
     {"type": "heading", "text_translations": {"en": "Company", "de": "Unternehmen", "fr": "Société", "es": "Empresa"}},
     {"type": "paragraph", "text_translations": {"en": "Stratifit\nAddress to be provided", "de": "Stratifit\nAnschrift folgt", "fr": "Stratifit\nAdresse à fournir", "es": "Stratifit\nDirección por confirmar"}},
     {"type": "heading", "text_translations": {"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}},
     {"type": "paragraph", "text_translations": {"en": "Email: hello@stratifit.com", "de": "E-Mail: hello@stratifit.com", "fr": "E-mail : hello@stratifit.com", "es": "Correo: hello@stratifit.com"}},
     {"type": "heading", "text_translations": {"en": "Represented by", "de": "Vertreten durch", "fr": "Représentée par", "es": "Representada por"}},
     {"type": "paragraph", "text_translations": {"en": "Managing director / owner to be provided.", "de": "Geschäftsführer / Inhaber folgt.", "fr": "Directeur / propriétaire à fournir.", "es": "Director / propietario por confirmar."}},
     {"type": "heading", "text_translations": {"en": "Responsible for content", "de": "Verantwortlich für den Inhalt", "fr": "Responsable du contenu", "es": "Responsable del contenido"}},
     {"type": "paragraph", "text_translations": {"en": "To be provided.", "de": "Folgt.", "fr": "À fournir.", "es": "Por confirmar."}},
     {"type": "note", "text_translations": {"en": "Note: This placeholder must be completed with the legally required company information before launch.", "de": "Hinweis: Dieser Platzhalter muss vor dem Launch mit den gesetzlich vorgeschriebenen Unternehmensangaben vervollständigt werden.", "fr": "Remarque : ce texte provisoire doit être complété avec les informations légales requises avant le lancement.", "es": "Nota: este texto provisional debe completarse con la información legal requerida antes del lanzamiento."}}
   ]'::jsonb,
   true),
  ('careers',
   '{"en": "Careers", "de": "Karriere", "fr": "Carrières", "es": "Carreras"}'::jsonb,
   '{"en": "Join the Stratifit team", "de": "Werde Teil des Stratifit-Teams", "fr": "Rejoignez l''équipe Stratifit", "es": "Únete al equipo de Stratifit"}'::jsonb,
   '[
     {"type": "paragraph", "text_translations": {"en": "We are building a team of strategists, designers, engineers, and marketers obsessed with craft — people who want to build digital experiences that move businesses forward.", "de": "Wir bauen ein Team aus Strategen, Designern, Ingenieuren und Marketers auf, die Handwerkskunst lieben – Menschen, die digitale Erlebnisse schaffen wollen, die Unternehmen voranbringen.", "fr": "Nous constituons une équipe de stratèges, designers, ingénieurs et marketeurs passionnés par leur métier — des personnes qui veulent créer des expériences numériques qui font avancer les entreprises.", "es": "Estamos construyendo un equipo de estrategas, diseñadores, ingenieros y especialistas en marketing apasionados por el oficio: personas que quieren crear experiencias digitales que impulsen los negocios."}},
     {"type": "heading", "text_translations": {"en": "Why Stratifit", "de": "Warum Stratifit", "fr": "Pourquoi Stratifit", "es": "Por qué Stratifit"}},
     {"type": "paragraph", "text_translations": {"en": "You will work on premium projects with modern technology, collaborate directly with leadership, and see the real impact of your work on client outcomes.", "de": "Sie arbeiten an Premium-Projekten mit moderner Technologie, arbeiten direkt mit der Führungsebene zusammen und sehen die echten Auswirkungen Ihrer Arbeit auf die Ergebnisse unserer Kunden.", "fr": "Vous travaillerez sur des projets premium avec des technologies modernes, collaborerez directement avec la direction et verrez l''impact réel de votre travail sur les résultats des clients.", "es": "Trabajará en proyectos premium con tecnología moderna, colaborará directamente con el liderazgo y verá el impacto real de su trabajo en los resultados de los clientes."}},
     {"type": "heading", "text_translations": {"en": "How we work", "de": "Wie wir arbeiten", "fr": "Comment nous travaillons", "es": "Cómo trabajamos"}},
     {"type": "paragraph", "text_translations": {"en": "We are async-first: tight specs, short meetings, and high trust. We hire for seniority, autonomy, and judgment.", "de": "Wir arbeiten asynchron: präzise Spezifikationen, kurze Meetings und hohes Vertrauen. Wir stellen auf Erfahrung, Eigenverantwortung und Urteilsvermögen ein.", "fr": "Nous privilégions l''asynchrone : des spécifications précises, des réunions courtes et une grande confiance. Nous recrutons pour la séniorité, l''autonomie et le jugement.", "es": "Somos async-first: especificaciones precisas, reuniones cortas y alta confianza. Contratamos por seniority, autonomía y criterio."}},
     {"type": "heading", "text_translations": {"en": "Open positions", "de": "Offene Positionen", "fr": "Postes ouverts", "es": "Puestos abiertos"}},
     {"type": "paragraph", "text_translations": {"en": "We hire on a rolling basis for design, engineering, and growth roles. If you are exceptional at what you do, we want to hear from you.", "de": "Wir stellen laufend für Design-, Engineering- und Growth-Positionen ein. Wenn Sie außergewöhnlich gut in dem sind, was Sie tun, möchten wir von Ihnen hören.", "fr": "Nous recrutons en continu pour des postes en design, ingénierie et croissance. Si vous êtes exceptionnel dans ce que vous faites, nous voulons vous connaître.", "es": "Contratamos de forma continua para puestos de diseño, ingeniería y crecimiento. Si eres excepcional en lo que haces, queremos saber de ti."}},
     {"type": "heading", "text_translations": {"en": "Apply", "de": "Bewerben", "fr": "Postuler", "es": "Aplicar"}},
     {"type": "paragraph", "text_translations": {"en": "Send your portfolio or CV through the contact page and we will get back to you within a few days.", "de": "Senden Sie Ihr Portfolio oder Ihren Lebenslauf über die Kontaktseite – wir melden uns innerhalb weniger Tage.", "fr": "Envoyez votre portfolio ou CV via la page contact et nous vous répondrons sous quelques jours.", "es": "Envíe su portafolio o CV a través de la página de contacto y le responderemos en unos días."}}
   ]'::jsonb,
   true)
ON CONFLICT (slug) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  subtitle_translations = EXCLUDED.subtitle_translations,
  content_translations = EXCLUDED.content_translations,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Hero (Singleton)
-- =============================================================================

INSERT INTO public.hero (singleton_key, eyebrow_translations, title_translations, highlight_translations, description_translations, primary_cta_label_translations, primary_cta_url, secondary_cta_label_translations, secondary_cta_url, metrics, variant, is_visible)
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
  metrics = EXCLUDED.metrics;

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
  '{"en": "Founded with a vision to bridge the gap between premium branding and technical execution, Stratifit has grown from a boutique design studio into a full-scale digital agency. Today, we partner with startups and enterprises alike — delivering brand identities, web platforms, AI automation systems, and growth engines that transform how businesses operate and scale.", "de": "Gegründet mit der Vision, die Lücke zwischen Premium-Branding und technischer Umsetzung zu schließen, ist Stratifit von einem Boutique-Designstudio zu einer umfassenden Digitalagentur gewachsen. Heute arbeiten wir mit Startups und Unternehmen jeder Größe zusammen – und liefern Markenidentitäten, Web-Plattformen, KI-Automatisierungssysteme und Wachstumsmaschinen, die verändern, wie Unternehmen arbeiten und skalieren.", "fr": "Fondée avec la vision de combler l''écart entre le branding premium et l''exécution technique, Stratifit est passée d''un studio de design boutique à une agence digitale complète. Aujourd''hui, nous travaillons aussi bien avec les startups qu''avec les grandes entreprises – en livrant des identités de marque, des plateformes web, des systèmes d''automatisation IA et des moteurs de croissance qui transforment la façon dont les entreprises opèrent et se développent.", "es": "Fundada con la visión de cerrar la brecha entre el branding premium y la ejecución técnica, Stratifit ha pasado de ser un estudio de diseño boutique a una agencia digital de servicio completo. Hoy trabajamos con startups y empresas por igual, ofreciendo identidades de marca, plataformas web, sistemas de automatización con IA y motores de crecimiento que transforman la forma en que las empresas operan y escalan."}'::jsonb,
  '[
    {"icon": "sparkles", "title_translations": {"en": "Precision", "de": "Präzision", "fr": "Précision", "es": "Precisión"}, "description_translations": {"en": "Every pixel, every line of code, every strategy — executed with meticulous attention to detail.", "de": "Jedes Pixel, jede Codezeile, jede Strategie – umgesetzt mit akribischer Liebe zum Detail.", "fr": "Chaque pixel, chaque ligne de code, chaque stratégie – exécutés avec une attention méticuleuse aux détails.", "es": "Cada píxel, cada línea de código, cada estrategia: ejecutados con una atención meticulosa al detalle."}},
    {"icon": "bolt", "title_translations": {"en": "Innovation", "de": "Innovation", "fr": "Innovation", "es": "Innovación"}, "description_translations": {"en": "We push boundaries with emerging technologies and creative approaches that set you apart.", "de": "Wir erweitern Grenzen mit neuen Technologien und kreativen Ansätzen, die Sie auszeichnen.", "fr": "Nous repoussons les limites grâce aux technologies émergentes et à des approches créatives qui vous distinguent.", "es": "Ampliamos los límites con tecnologías emergentes y enfoques creativos que te hacen destacar."}},
    {"icon": "users", "title_translations": {"en": "Partnership", "de": "Partnerschaft", "fr": "Partenariat", "es": "Asociación"}, "description_translations": {"en": "We integrate as an extension of your team, aligned with your vision and committed to your success.", "de": "Wir integrieren uns als Teil Ihres Teams – ausgerichtet an Ihrer Vision und verpflichtet Ihrem Erfolg.", "fr": "Nous nous intégrons comme une extension de votre équipe, alignés sur votre vision et engagés pour votre réussite.", "es": "Nos integramos como una extensión de tu equipo, alineados con tu visión y comprometidos con tu éxito."}},
    {"icon": "chart", "title_translations": {"en": "Results", "de": "Ergebnisse", "fr": "Résultats", "es": "Resultados"}, "description_translations": {"en": "We measure everything. Every engagement is tied to real KPIs and tangible business outcomes.", "de": "Wir messen alles. Jedes Projekt ist an echte KPIs und greifbare Geschäftsergebnisse gekoppelt.", "fr": "Nous mesurons tout. Chaque mission est liée à de vrais KPI et à des résultats commerciaux tangibles.", "es": "Lo medimos todo. Cada proyecto está vinculado a KPIs reales y resultados comerciales tangibles."}}
  ]'::jsonb,
  '{"en": "We are strategists, designers, engineers, and marketers who share a common obsession: building exceptional digital experiences. Our team brings together decades of combined expertise from top agencies, startups, and Fortune 500 companies — united by a passion for craftsmanship and a commitment to client success.", "de": "Wir sind Strategen, Designer, Ingenieure und Marketer, die eine gemeinsame Leidenschaft teilen: außergewöhnliche digitale Erlebnisse zu schaffen. Unser Team vereint jahrzehntelange kombinierte Expertise aus Top-Agenturen, Startups und Fortune-500-Unternehmen – vereint durch die Leidenschaft für Handwerkskunst und das Engagement für den Erfolg unserer Kunden.", "fr": "Nous sommes des stratèges, designers, ingénieurs et marketers partageant une obsession commune : créer des expériences numériques exceptionnelles. Notre équipe réunit des décennies d''expertise combinée issue des meilleures agences, de startups et d''entreprises du Fortune 500 – unie par une passion pour le travail bien fait et un engagement envers la réussite de nos clients.", "es": "Somos estrategas, diseñadores, ingenieros y especialistas en marketing que comparten una obsesión común: crear experiencias digitales excepcionales. Nuestro equipo reúne décadas de experiencia combinada de las mejores agencias, startups y empresas Fortune 500, unidos por la pasión por la artesanía y el compromiso con el éxito de nuestros clientes."}'::jsonb,
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
   '{"en": "We design a comprehensive plan covering brand, web, AI, and growth — aligned with your revenue targets.", "de": "Wir entwerfen einen umfassenden Plan für Marke, Web, KI und Wachstum – abgestimmt auf Ihre Umsatzziele.", "fr": "Nous concevons un plan complet couvrant la marque, le web, l''IA et la croissance – aligné sur vos objectifs de revenus.", "es": "Diseñamos un plan integral que cubre marca, web, IA y crecimiento, alineado con tus objetivos de ingresos."}'::jsonb,
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
  '{"en": "We build digital assets that drive valuation and market authority — not just websites.", "de": "Wir bauen digitale Assets, die Bewertung und Marktautorität steigern – nicht nur Websites.", "fr": "Nous créons des actifs numériques qui augmentent la valorisation et l''autorité de marché – pas seulement des sites web.", "es": "Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web."}'::jsonb,
   '[{"icon": "shield", "title": {"en": "Senior-only team", "de": "Nur Senior-Team", "fr": "Équipe senior uniquement", "es": "Equipo solo senior"}, "description": {"en": "Every person shipping work has 7+ years of production experience.", "de": "Jede Person, die an Ihrem Projekt arbeitet, hat 7+ Jahre Produktionserfahrung.", "fr": "Chaque personne livrant du travail a plus de 7 ans d''expérience en production.", "es": "Cada persona que trabaja en su proyecto tiene más de 7 años de experiencia en producción."}, "stat_value": "50+", "stat_label": {"en": "Shipped projects", "de": "Gelieferte Projekte", "fr": "Projets livrés", "es": "Proyectos entregados"}}, {"icon": "check", "title": {"en": "Outcome-priced", "de": "Ergebnisbasiert", "fr": "Facturation au résultat", "es": "Precio por resultados"}, "description": {"en": "We price on shipped value, not hours logged.", "de": "Wir bepreisen gelieferten Wert, nicht abgerechnete Stunden.", "fr": "Nous facturons la valeur livrée, pas les heures passées.", "es": "Cobramos por el valor entregado, no por las horas registradas."}, "stat_value": "98%", "stat_label": {"en": "Client retention", "de": "Kundenbindung", "fr": "Fidélisation client", "es": "Retención de clientes"}}, {"icon": "bolt", "title": {"en": "Async-first", "de": "Asynchron zuerst", "fr": "Async d''abord", "es": "Primero asíncrono"}, "description": {"en": "Tight spec docs, recorded Looms, weekly demos — never a status meeting.", "de": "Präzise Spezifikationen, aufgenommene Looms, wöchentliche Demos – nie ein Status-Meeting.", "fr": "Des specs précises, des Loom enregistrés, des démos hebdomadaires – jamais de réunion de statut.", "es": "Documentos de especificación precisos, Loom grabados, demos semanales: nunca una reunión de estado."}, "stat_value": "12", "stat_label": {"en": "Years experience", "de": "Jahre Erfahrung", "fr": "Années d''expérience", "es": "Años de experiencia"}}, {"icon": "users", "title": {"en": "Full-stack", "de": "Full-Stack", "fr": "Full-stack", "es": "Full-stack"}, "description": {"en": "Brand, engineering, and growth in one team.", "de": "Marke, Entwicklung und Wachstum in einem Team.", "fr": "Marque, ingénierie et croissance dans une seule équipe.", "es": "Marca, ingeniería y crecimiento en un solo equipo."}, "stat_value": "40+", "stat_label": {"en": "Country reach", "de": "Länderabdeckung", "fr": "Portée pays", "es": "Alcance de países"}}]'::jsonb,
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
   NULL,
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
  ('40000000-0000-4000-8000-000000000001', '{"en": "What services does Stratifit offer?", "de": "Welche Dienstleistungen bietet Stratifit an?", "fr": "Quels services offre Stratifit ?", "es": "¿Qué servicios ofrece Stratifit?"}'::jsonb,
   '{"en": "We offer brand design, website development, AI & automation, and growth marketing services.", "de": "Wir bieten Markengestaltung, Webentwicklung, KI & Automatisierung und Growth Marketing an.", "fr": "Nous offrons design de marque, développement web, IA & automatisation et marketing de croissance.", "es": "Ofrecemos diseño de marca, desarrollo web, IA y automatización, y marketing de crecimiento."}'::jsonb,
   'general',
   1,
   true,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000002', '{"en": "How long does a typical project take?", "de": "Wie lange dauert ein typisches Projekt?", "fr": "Combien de temps dure un projet typique ?", "es": "¿Cuánto tiempo dura un proyecto típico?"}'::jsonb,
   '{"en": "Project timelines vary based on scope. A typical website project takes 4-8 weeks.", "de": "Projektzeitpläne variieren je nach Umfang. Ein typisches Website-Projekt dauert 4-8 Wochen.", "fr": "Les délais varient selon la portée. Un projet de site web typique prend 4 à 8 semaines.", "es": "Los plazos varían según el alcance. Un proyecto de sitio web típico toma 4-8 semanas."}'::jsonb,
   'general',
   2,
   false,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000003', '{"en": "Do you work with international clients?", "de": "Arbeiten Sie mit internationalen Kunden?", "fr": "Travaillez-vous avec des clients internationaux ?", "es": "¿Trabajan con clientes internacionales?"}'::jsonb,
   '{"en": "Yes, we work with clients worldwide and support multilingual projects in English, German, French, and Spanish.", "de": "Ja, wir arbeiten mit Kunden weltweit und unterstützen mehrsprachige Projekte in Englisch, Deutsch, Französisch und Spanisch.", "fr": "Oui, nous travaillons avec des clients du monde entier et supportons les projets multilingues en anglais, allemand, français et espagnol.", "es": "Sí, trabajamos con clientes de todo el mundo y apoyamos proyectos multilingües en inglés, alemán, francés y español."}'::jsonb,
   'general',
   3,
   false,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000004', '{"en": "What is your pricing structure?", "de": "Wie ist Ihre Preisstruktur?", "fr": "Quelle est votre structure de prix ?", "es": "¿Cuál es su estructura de precios?"}'::jsonb,
   '{"en": "We offer project-based pricing starting from $2,990. Contact us for a custom quote.", "de": "Wir bieten projektbasierte Preise ab $2.990. Kontaktieren Sie uns für ein individuelles Angebot.", "fr": "Nous proposons des tarifs basés sur les projets à partir de 2 990 $. Contactez-nous pour un devis personnalisé.", "es": "Ofrecemos precios por proyecto desde $2,990. Contáctanos para una cotización personalizada."}'::jsonb,
   'pricing',
   4,
   true,
   true,
   true,
   'published'
  ),
    ('40000000-0000-4000-8000-000000000005', '{"en": "Do you provide ongoing support?", "de": "Bieten Sie laufenden Support an?", "fr": "Offrez-vous un support continu ?", "es": "¿Ofrecen soporte continuo?"}'::jsonb,
   '{"en": "Yes, all projects include support periods. We also offer ongoing maintenance plans.", "de": "Ja, alle Projekte beinhalten Support-Zeiträume. Wir bieten auch laufende Wartungspläne an.", "fr": "Oui, tous les projets incluent des périodes de support. Nous offrons aussi des plans de maintenance continue.", "es": "Sí, todos los proyectos incluyen períodos de soporte. También ofrecemos planes de mantenimiento continuo."}'::jsonb,
   'general',
   5,
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
  false,
  '{"en": "Hi! How can I help you today?", "de": "Hallo! Wie kann ich Ihnen heute helfen?", "fr": "Bonjour ! Comment puis-je vous aider ?", "es": "¡Hola! ¿Cómo puedo ayudarte hoy?"}'::jsonb,
  '{"en": "We are currently offline. Please leave your message and we will get back to you.", "de": "Wir sind derzeit offline. Bitte hinterlassen Sie Ihre Nachricht und wir melden uns bei Ihnen.", "fr": "Nous sommes actuellement hors ligne. Veuillez laisser votre message et nous vous répondrons.", "es": "Estamos fuera de línea actualmente. Por favor deja tu mensaje y te responderemos."}'::jsonb,
  '{"en": "Let me connect you with a team member.", "de": "Ich verbinde Sie mit einem Teammitglied.", "fr": "Je vous connecte avec un membre de l équipe.", "es": "Te conecto con un miembro del equipo."}'::jsonb,
  '{"en": "I am not sure about that. Let me connect you with a team member.", "de": "Das bin ich mir nicht sicher. Ich verbinde Sie mit einem Teammitglied.", "fr": "Je ne suis pas sûr de cela. Laissez-moi vous connecter avec un membre de l équipe.", "es": "No estoy seguro sobre eso. Déjame conectarte con un miembro del equipo."}'::jsonb,
  'after_resolution',
  true,
  ARRAY['general', 'services', 'pricing'],
  'professional'
)
ON CONFLICT (singleton_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  welcome_message_translations = EXCLUDED.welcome_message_translations,
  offline_message_translations = EXCLUDED.offline_message_translations,
  escalation_message_translations = EXCLUDED.escalation_message_translations,
  fallback_message_translations = EXCLUDED.fallback_message_translations;

-- =============================================================================
-- AI FAQ Settings (Singleton)
-- =============================================================================

INSERT INTO public.ai_faq_settings (singleton_key, is_enabled, intro_translations, suggested_questions, allowed_categories, fallback_translations, cta_label_translations, cta_url)
VALUES (
  true,
  false,
  '{"en": "Ask me anything about Stratifit!", "de": "Fragen Sie mich alles über Stratifit!", "fr": "Demandez-moi tout sur Stratifit !", "es": "¡Pregúntame cualquier cosa sobre Stratifit!"}'::jsonb,
   '["What services do you offer?", "How much does a website cost?", "How long does a project take?", "Do you work internationally?", "What is your process?"]'::jsonb,
  ARRAY['general', 'services', 'pricing', 'process'],
  '{"en": "I do not have an answer for that. Please contact our team directly.", "de": "Dafür habe ich keine Antwort. Bitte kontaktieren Sie unser Team direkt.", "fr": "Je n ai pas de réponse pour cela. Veuillez contacter directement notre équipe.", "es": "No tengo una respuesta para eso. Por favor contacta a nuestro equipo directamente."}'::jsonb,
  '{"en": "Contact Us", "de": "Kontaktieren Sie uns", "fr": "Contactez-nous", "es": "Contáctanos"}'::jsonb,
  '/contact'
)
ON CONFLICT (singleton_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  intro_translations = EXCLUDED.intro_translations,
  suggested_questions = EXCLUDED.suggested_questions,
  allowed_categories = EXCLUDED.allowed_categories,
  fallback_translations = EXCLUDED.fallback_translations,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url;

-- =============================================================================
-- Final CTA (Singleton)
-- =============================================================================

INSERT INTO public.final_cta (singleton_key, title_translations, description_translations, primary_cta_label_translations, primary_cta_url, secondary_cta_label_translations, secondary_cta_url, variant, is_visible)
VALUES (
  true,
  '{"en": "Ready to Transform Your Digital Presence?", "de": "Bereit, Ihre digitale Präsenz zu transformieren?", "fr": "Prêt à transformer votre présence numérique ?", "es": "¿Listo para transformar tu presencia digital?"}'::jsonb,
  '{"en": "Let us help you build something extraordinary. Start with a free consultation.", "de": "Lassen Sie uns Ihnen helfen, etwas Außergewöhnliches zu schaffen. Beginnen Sie mit einer kostenlosen Beratung.", "fr": "Laissez-nous vous aider à créer quelque chose d extraordinaire. Commencez par une consultation gratuite.", "es": "Permítenos ayudarte a construir algo extraordinario. Comienza con una consulta gratuita."}'::jsonb,
  '{"en": "Get Free Consultation", "de": "Kostenlose Beratung erhalten", "fr": "Obtenir une consultation gratuite", "es": "Obtener consulta gratuita"}'::jsonb,
  '/contact',
  '{"en": "View Our Work", "de": "Unsere Arbeiten ansehen", "fr": "Voir nos réalisations", "es": "Ver nuestro trabajo"}'::jsonb,
  '/work',
  'default',
  true
)
ON CONFLICT (singleton_key) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  description_translations = EXCLUDED.description_translations,
  primary_cta_label_translations = EXCLUDED.primary_cta_label_translations,
  primary_cta_url = EXCLUDED.primary_cta_url,
  secondary_cta_label_translations = EXCLUDED.secondary_cta_label_translations,
  secondary_cta_url = EXCLUDED.secondary_cta_url;

-- =============================================================================
-- Portfolio Projects
-- NOTE: Real case studies, testimonials and trusted logos are seeded by
--       migration 00030_real_business_content.sql. This block keeps the
--       homepage gallery populated for local development before that
--       migration runs, using the same stable ids so both are idempotent.
-- =============================================================================

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111101', 'maison-lumiere-brand-system', 'Maison Lumière', '{"en": "Maison Lumière Brand System", "de": "Markensystem Maison Lumière", "fr": "Système de marque Maison Lumière", "es": "Sistema de marca Maison Lumière"}'::jsonb, '{"en": "A complete luxury brand identity that repositioned a heritage retailer for the digital age.", "de": "Eine komplette Luxus-Markenidentität, die einen Traditionshändler für das digitale Zeitalter neu positioniert hat.", "fr": "Une identité de marque de luxe complète qui a repositionné un détaillant historique pour l ère numérique.", "es": "Una identidad de marca de lujo completa que reposicionó a un minorista tradicional para la era digital."}'::jsonb, '{"en": "A 60-year-old retailer with an iconic name was losing relevance against digitally-native competitors.", "de": "Ein 60 Jahre alter Händler mit ikonischem Namen verlor gegen digital-native Wettbewerber an Relevanz.", "fr": "Un détaillant centenaire au nom emblématique perdait du terrain face à des concurrents nés du numérique.", "es": "Un minorista con 60 años y nombre icónico perdía relevancia frente a competidores nativos digitales."}'::jsonb, '{"en": "We rebuilt the identity from strategy up: positioning, visual language, typography, and a design system applied across packaging, store, and web.", "de": "Wir bauten die Identität von der Strategie an neu auf: Positionierung, visuelle Sprache, Typografie und ein Designsystem für Verpackung, Store und Web.", "fr": "Nous avons reconstruit l identité de la stratégie au détail : positionnement, langage visuel, typographie et système de design appliqué au packaging, au store et au web.", "es": "Reconstruimos la identidad desde la estrategia: posicionamiento, lenguaje visual, tipografía y un sistema de diseño aplicado a empaques, tienda y web."}'::jsonb, '{"en": "A cohesive luxury system with guidelines, asset kits, and templates that keep every touchpoint consistent.", "de": "Ein kohärentes Luxus-System mit Richtlinien, Asset-Kits und Vorlagen für konsistente Touchpoints.", "fr": "Un système de luxe cohérent avec des directives, des kits d actifs et des modèles pour une cohérence sur tous les points de contact.", "es": "Un sistema de lujo coherente con pautas, kits de recursos y plantillas que mantienen la consistencia en cada punto de contacto."}'::jsonb, '{"en": ["Brand Strategy", "Logo & Identity", "Design System", "Packaging", "Guidelines"]}'::jsonb, '{"en": "Online revenue doubled within six months and the brand re-entered premium retail conversations."}'::jsonb, '[{"value": "+112%", "label_translations": {"en": "Online revenue growth", "de": "Online-Umsatzwachstum", "fr": "Croissance du chiffre d affaires en ligne", "es": "Crecimiento de ingresos online"}}]'::jsonb, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&auto=format', '{"en": "Maison Lumière Brand System — Stratifit", "de": "Markensystem Maison Lumière — Stratifit", "fr": "Système de marque Maison Lumière — Stratifit", "es": "Sistema de marca Maison Lumière — Stratifit"}'::jsonb, '{"en": "A complete luxury brand identity delivered by Stratifit.", "de": "Eine komplette Luxus-Markenidentität von Stratifit.", "fr": "Une identité de marque de luxe complète réalisée par Stratifit.", "es": "Una identidad de marca de lujo completa creada por Stratifit."}'::jsonb, true, 'published', '2026-01-15T09:00:00Z'),
  ('11111111-1111-4111-8111-111111111102', 'nordlicht-logistics-website', 'Nordlicht Logistics', '{"en": "Multilingual Platform for Nordlicht Logistics", "de": "Mehrsprachige Plattform für Nordlicht Logistics", "fr": "Plateforme multilingue pour Nordlicht Logistics", "es": "Plataforma multilingüe para Nordlicht Logistics"}'::jsonb, '{"en": "A high-performance, four-language web platform that turned international enquiries into pipeline.", "de": "Eine leistungsstarke viersprachige Webplattform, die internationale Anfragen in Pipeline verwandelte.", "fr": "Une plateforme web haute performance en quatre langues qui a transformé les demandes internationales en pipeline.", "es": "Una plataforma web de alto rendimiento en cuatro idiomas que convirtió las consultas internacionales en pipeline."}'::jsonb, '{"en": "Serving customers across four languages with an outdated site that hurt trust and conversions.", "de": "Ein veralteter Auftritt schadete Vertrauen und Conversions bei Kunden in vier Sprachen.", "fr": "Un site obsolète nuisait à la confiance et aux conversions auprès de clients dans quatre langues.", "es": "Un sitio desactualizado perjudicaba la confianza y las conversiones con clientes en cuatro idiomas."}'::jsonb, '{"en": "We rebuilt the platform with a centralized multilingual content system, sub-second performance, and conversion-focused journeys per market.", "de": "Wir bauten die Plattform mit zentralisiertem mehrsprachigem Content-System, Subsekunden-Performance und conversion-orientierten Journeys pro Markt neu.", "fr": "Nous avons reconstruit la plateforme avec un système de contenu multilingue centralisé, des performances sous la seconde et des parcours orientés conversion par marché.", "es": "Reconstruimos la plataforma con un sistema de contenido multilingüe centralizado, rendimiento inferior al segundo y recorridos orientados a la conversión por mercado."}'::jsonb, '{"en": "A scalable site that adapts to every locale.", "de": "Eine skalierbare Website, die sich jeder Sprache anpasst.", "fr": "Un site évolutif qui s adapte à chaque langue.", "es": "Un sitio escalable que se adapta a cada idioma."}'::jsonb, '{"en": ["Custom Development", "Multilingual CMS", "Performance", "Lead Funnels"]}'::jsonb, '{"en": "International enquiries doubled within months and organic traffic grew across all four locales."}'::jsonb, '[{"value": "+96%", "label_translations": {"en": "International enquiries", "de": "Internationale Anfragen", "fr": "Demandes internationales", "es": "Consultas internacionales"}}]'::jsonb, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format', '{"en": "Nordlicht Logistics Website — Stratifit", "de": "Nordlicht Logistics Website — Stratifit", "fr": "Site web Nordlicht Logistics — Stratifit", "es": "Sitio web de Nordlicht Logistics — Stratifit"}'::jsonb, '{"en": "A multilingual logistics platform built by Stratifit.", "de": "Eine mehrsprachige Logistikplattform von Stratifit.", "fr": "Une plateforme logistique multilingue créée par Stratifit.", "es": "Una plataforma logística multilingüe creada por Stratifit."}'::jsonb, false, 'published', '2026-02-20T09:00:00Z'),
  ('11111111-1111-4111-8111-111111111103', 'helios-health-ai-support', 'Helios Health', '{"en": "AI Support Assistant for Helios Health", "de": "KI-Support-Assistent für Helios Health", "fr": "Assistant de support IA pour Helios Health", "es": "Asistente de soporte con IA para Helios Health"}'::jsonb, '{"en": "A knowledge-grounded AI assistant that resolves 78% of support tickets end-to-end.", "de": "Ein wissensbasierter KI-Assistent, der 78 % der Support-Tickets vollständig löst.", "fr": "Un assistant IA fondé sur la connaissance qui résout 78 % des tickets de support de bout en bout.", "es": "Un asistente de IA basado en conocimiento que resuelve el 78 % de los tickets de soporte."}'::jsonb, '{"en": "A support team drowning in repetitive questions while response times stretched past 48 hours.", "de": "Ein Support-Team, das in Routinefragen ertrank, während die Antwortzeiten auf über 48 Stunden stiegen.", "fr": "Une équipe support submergée de questions répétitives avec des délais de réponse dépassant 48 heures.", "es": "Un equipo de soporte ahogado en preguntas repetitivas con tiempos de respuesta superiores a 48 horas."}'::jsonb, '{"en": "We built a secure, knowledge-grounded assistant that answers from approved content and escalates to humans when certainty drops.", "de": "Wir bauten einen sicheren, wissensbasierten Assistenten, der aus genehmigten Inhalten antwortet und bei Unsicherheit an Menschen eskaliert.", "fr": "Nous avons créé un assistant sécurisé fondé sur la connaissance qui répond à partir de contenus approuvés et escalade aux humains en cas de doute.", "es": "Creamos un asistente seguro basado en conocimiento que responde desde contenido aprobado y escala a humanos cuando baja la certeza."}'::jsonb, '{"en": "A support assistant that knows when to escalate to a human.", "de": "Ein Support-Assistent, der weiß, wann er an einen Menschen eskalieren muss.", "fr": "Un assistant de support qui sait quand passer à un humain.", "es": "Un asistente de soporte que sabe cuándo escalar a un humano."}'::jsonb, '{"en": ["AI Chatbot", "Knowledge Base", "Human Handover", "Analytics"]}'::jsonb, '{"en": "First-response time dropped to seconds, and the team now focuses on complex cases."}'::jsonb, '[{"value": "78%", "label_translations": {"en": "Tickets resolved automatically", "de": "Automatisch gelöste Tickets", "fr": "Tickets résolus automatiquement", "es": "Tickets resueltos automáticamente"}}]'::jsonb, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', '{"en": "AI Support Assistant for Helios Health — Stratifit", "de": "KI-Support-Assistent für Helios Health — Stratifit", "fr": "Assistant de support IA pour Helios Health — Stratifit", "es": "Asistente de soporte con IA para Helios Health — Stratifit"}'::jsonb, '{"en": "An AI support assistant built by Stratifit for Helios Health.", "de": "Ein KI-Support-Assistent von Stratifit für Helios Health.", "fr": "Un assistant de support IA créé par Stratifit pour Helios Health.", "es": "Un asistente de soporte con IA creado por Stratifit para Helios Health."}'::jsonb, true, 'published', '2026-03-10T09:00:00Z')
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
  ('22222222-2222-4222-8222-222222222201', 'the-future-of-digital-scalability', '{"en": "The Future of Digital Scalability", "de": "Die Zukunft der digitalen Skalierbarkeit", "fr": "L''avenir de l''évolutivité numérique", "es": "El futuro de la escalabilidad digital"}'::jsonb, '{"en": "How modern infrastructure enables startups to compete with enterprise incumbents from day one.", "de": "Wie moderne Infrastruktur Startups befähigt, von Tag eins an mit etablierten Unternehmen zu konkurrieren.", "fr": "Comment l''infrastructure moderne permet aux startups de concurrencer les géants dès le premier jour.", "es": "Cómo la infraestructura moderna permite a las startups competir con las empresas establecidas desde el primer día."}'::jsonb, '{"en": "Cloud-native architecture has turned scalability from a competitive advantage into a baseline expectation. Startups can now provision infrastructure that once required enterprise budgets — global capacity in minutes, not quarters.\n\nThe brands that win design for scale from day one: clean data models, stateless services, and observability baked in. Scale is not an afterthought; it is an architecture decision you make before you need it.", "de": "Cloud-native Architekturen haben Skalierbarkeit von einem Wettbewerbsvorteil zu einer Grundanforderung gemacht. Startups können heute Infrastruktur bereitstellen, die früher Unternehmensbudgets erforderte – globale Kapazität in Minuten statt in Quartalen.\n\nDie Marken, die gewinnen, planen Skalierung von Tag eins: saubere Datenmodelle, zustandslose Dienste und integrierte Observability. Skalierung ist kein nachträglicher Gedanke, sondern eine Architekturentscheidung, die man trifft, bevor man sie braucht.", "fr": "L''architecture cloud-native a transformé la scalabilité d''un avantage concurrentiel en une exigence de base. Les startups peuvent désormais provisionner une infrastructure qui exigeait autrefois des budgets d''entreprise – une capacité mondiale en minutes, pas en trimestres.\n\nLes marques gagnantes conçoivent l''échelle dès le premier jour : modèles de données propres, services sans état et observabilité intégrée. L''échelle n''est pas une réflexion après coup ; c''est une décision d''architecture que l''on prend avant d''en avoir besoin.", "es": "La arquitectura cloud-native ha convertido la escalabilidad de una ventaja competitiva en una expectativa básica. Las startups pueden aprovisionar hoy infraestructura que antes requería presupuestos empresariales: capacidad global en minutos, no en trimestres.\n\nLas marcas que ganan diseñan para escalar desde el primer día: modelos de datos limpios, servicios sin estado y observabilidad integrada. Escalar no es una ocurrencia tardía; es una decisión de arquitectura que se toma antes de necesitarla."}'::jsonb, 6, '{"en": "The Future of Digital Scalability", "de": "Die Zukunft der digitalen Skalierbarkeit", "fr": "L''avenir de l''évolutivité numérique", "es": "El futuro de la escalabilidad digital"}'::jsonb, '{"en": "How modern infrastructure enables startups to compete with enterprise incumbents from day one.", "de": "Wie moderne Infrastruktur Startups befähigt, von Tag eins an mit etablierten Unternehmen zu konkurrieren.", "fr": "Comment l''infrastructure moderne permet aux startups de concurrencer les géants dès le premier jour.", "es": "Cómo la infraestructura moderna permite a las startups competir con las empresas establecidas desde el primer día."}'::jsonb, false, 'published', '2026-06-28T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222202', 'mastering-minimalist-ux-for-luxury-brands', '{"en": "Mastering Minimalist UX for Luxury Brands", "de": "Minimalistische UX für Luxusmarken meistern", "fr": "Maîtriser l''UX minimaliste pour les marques de luxe", "es": "Dominar la UX minimalista para marcas de lujo"}'::jsonb, '{"en": "Why simplicity drives premium perception and how to execute it flawlessly.", "de": "Warum Einfachheit eine Premium-Wahrnehmung erzeugt und wie man sie makellos umsetzt.", "fr": "Pourquoi la simplicité crée une perception premium et comment l''exécuter sans faille.", "es": "Por qué la simplicidad impulsa la percepción premium y cómo ejecutarla sin fisuras."}'::jsonb, '{"en": "Luxury is felt in what is absent. Minimalist interfaces signal confidence: generous whitespace, restrained palettes, and interactions that never compete with the product.\n\nExecuting minimalism flawlessly requires ruthless editing. Every element must earn its place, and every motion must feel intentional — because in premium products, restraint is the loudest statement.", "de": "Luxus spürt man in dem, was fehlt. Minimalistische Oberflächen signalisieren Selbstvertrauen: großzügiger Weißraum, zurückhaltende Paletten und Interaktionen, die nie mit dem Produkt konkurrieren.\n\nMinimalismus makellos umzusetzen erfordert kompromissloses Redigieren. Jedes Element muss seinen Platz verdienen, und jede Bewegung muss absichtsvoll wirken – denn in Premiumprodukten ist Zurückhaltung die lauteste Aussage.", "fr": "Le luxe se ressent dans ce qui est absent. Les interfaces minimalistes signalent la confiance : espaces généreux, palettes retenues et interactions qui ne rivalisent jamais avec le produit.\n\nExécuter le minimalisme sans faille exige une édition impitoyable. Chaque élément doit mériter sa place, et chaque mouvement doit sembler intentionnel – car dans les produits premium, la retenue est la déclaration la plus forte.", "es": "El lujo se siente en lo que está ausente. Las interfaces minimalistas transmiten confianza: espacios en blanco generosos, paletas contenidas e interacciones que nunca compiten con el producto.\n\nEjecutar el minimalismo sin fisuras exige una edición implacable. Cada elemento debe ganarse su lugar y cada movimiento debe sentirse intencional, porque en los productos premium la contención es la declaración más rotunda."}'::jsonb, 8, '{"en": "Mastering Minimalist UX for Luxury Brands", "de": "Minimalistische UX für Luxusmarken meistern", "fr": "Maîtriser l''UX minimaliste pour les marques de luxe", "es": "Dominar la UX minimalista para marcas de lujo"}'::jsonb, '{"en": "Why simplicity drives premium perception and how to execute it flawlessly.", "de": "Warum Einfachheit eine Premium-Wahrnehmung erzeugt und wie man sie makellos umsetzt.", "fr": "Pourquoi la simplicité crée une perception premium et comment l''exécuter sans faille.", "es": "Por qué la simplicidad impulsa la percepción premium y cómo ejecutarla sin fisuras."}'::jsonb, false, 'published', '2026-06-22T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222203', 'how-ai-is-revolutionizing-custom-automation', '{"en": "How AI is Revolutionizing Custom Automation", "de": "Wie KI die individuelle Automatisierung revolutioniert", "fr": "Comment l''IA révolutionne l''automatisation sur mesure", "es": "Cómo la IA está revolucionando la automatización personalizada"}'::jsonb, '{"en": "Practical applications of AI that deliver immediate ROI for growing businesses.", "de": "Praktische KI-Anwendungen mit sofortigem ROI für wachsende Unternehmen.", "fr": "Des applications pratiques de l''IA qui génèrent un ROI immédiat pour les entreprises en croissance.", "es": "Aplicaciones prácticas de la IA que generan un ROI inmediato para empresas en crecimiento."}'::jsonb, '{"en": "AI is no longer a novelty bolted onto products. Applied to internal workflows, it removes the repetitive tasks that quietly consume teams — triaging requests, drafting replies, and summarizing documents.\n\nThe highest-ROI automations are narrow and measurable. Start with one workflow, define the success metric, and let the model prove itself before scaling it across the organization.", "de": "KI ist längst keine Neuheit mehr, die an Produkte angehängt wird. In internen Workflows beseitigt sie die repetitiven Aufgaben, die Teams stillschweigend aufbrauchen – Anfragen sortieren, Antworten entwerfen und Dokumente zusammenfassen.\n\nDie Automatisierungen mit dem höchsten ROI sind eng begrenzt und messbar. Beginnen Sie mit einem Workflow, definieren Sie die Erfolgskennzahl und lassen Sie das Modell sich beweisen, bevor Sie es in der gesamten Organisation skalieren.", "fr": "L''IA n''est plus une nouveauté greffée sur les produits. Appliquée aux workflows internes, elle élimine les tâches répétitives qui épuisent silencieusement les équipes – trier les demandes, rédiger des réponses et résumer des documents.\n\nLes automatisations au meilleur ROI sont étroites et mesurables. Commencez par un workflow, définissez la métrique de succès et laissez le modèle faire ses preuves avant de l''étendre à toute l''organisation.", "es": "La IA ya no es una novedad añadida a los productos. Aplicada a los flujos de trabajo internos, elimina las tareas repetitivas que consumen silenciosamente a los equipos: clasificar solicitudes, redactar respuestas y resumir documentos.\n\nLas automatizaciones de mayor ROI son acotadas y medibles. Empieza con un flujo de trabajo, define la métrica de éxito y deja que el modelo demuestre su valor antes de escalarlo en toda la organización."}'::jsonb, 5, '{"en": "How AI is Revolutionizing Custom Automation", "de": "Wie KI die individuelle Automatisierung revolutioniert", "fr": "Comment l''IA révolutionne l''automatisation sur mesure", "es": "Cómo la IA está revolucionando la automatización personalizada"}'::jsonb, '{"en": "Practical applications of AI that deliver immediate ROI for growing businesses.", "de": "Praktische KI-Anwendungen mit sofortigem ROI für wachsende Unternehmen.", "fr": "Des applications pratiques de l''IA qui génèrent un ROI immédiat pour les entreprises en croissance.", "es": "Aplicaciones prácticas de la IA que generan un ROI inmediato para empresas en crecimiento."}'::jsonb, false, 'published', '2026-06-18T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222204', 'building-funnels-that-convert-at-3x-industry-average', '{"en": "Building Funnels That Convert at 3x Industry Average", "de": "Funnels mit dreifacher Branchen-Conversion aufbauen", "fr": "Construire des tunnels qui convertissent 3x mieux que la moyenne", "es": "Embudos que convierten 3 veces por encima del promedio"}'::jsonb, '{"en": "The data-backed framework we use to design high-conversion marketing systems.", "de": "Das datengestützte Framework, mit dem wir hochkonvertierende Marketingsysteme entwerfen.", "fr": "Le cadre fondé sur les données que nous utilisons pour concevoir des systèmes marketing à forte conversion.", "es": "El marco basado en datos que usamos para diseñar sistemas de marketing de alta conversión."}'::jsonb, '{"en": "High-conversion funnels are not built on guesswork. They are the product of structured experiments: clear hypotheses, disciplined testing, and ruthless measurement of every step.\n\nWe share the framework we use with clients — from first-touch messaging to post-purchase loops — and the metrics that tell you where the funnel is actually leaking.", "de": "Funnels mit hoher Conversion entstehen nicht durch Raten. Sie sind das Ergebnis strukturierter Experimente: klare Hypothesen, disziplinierte Tests und kompromisslose Messung jedes Schritts.\n\nWir teilen das Framework, das wir mit Kunden verwenden – von der Erstansprache bis zu Post-Purchase-Schleifen – und die Kennzahlen, die zeigen, wo der Funnel tatsächlich verliert.", "fr": "Les tunnels à forte conversion ne reposent pas sur la supposition. Ils sont le fruit d''expérimentations structurées : hypothèses claires, tests disciplinés et mesure impitoyable de chaque étape.\n\nNous partageons le cadre que nous utilisons avec nos clients – du premier message aux boucles post-achat – et les métriques qui révèlent où le tunnel fuit réellement.", "es": "Los embudos de alta conversión no se construyen con suposiciones. Son el resultado de experimentos estructurados: hipótesis claras, pruebas disciplinadas y medición rigurosa de cada paso.\n\nCompartimos el marco que usamos con los clientes, desde la primera impresión hasta los bucles poscompra, y las métricas que revelan dónde pierde realmente el embudo."}'::jsonb, 7, '{"en": "Building Funnels That Convert at 3x Industry Average", "de": "Funnels mit dreifacher Branchen-Conversion aufbauen", "fr": "Construire des tunnels qui convertissent 3x mieux que la moyenne", "es": "Embudos que convierten 3 veces por encima del promedio"}'::jsonb, '{"en": "The data-backed framework we use to design high-conversion marketing systems.", "de": "Das datengestützte Framework, mit dem wir hochkonvertierende Marketingsysteme entwerfen.", "fr": "Le cadre fondé sur les données que nous utilisons pour concevoir des systèmes marketing à forte conversion.", "es": "El marco basado en datos que usamos para diseñar sistemas de marketing de alta conversión."}'::jsonb, false, 'published', '2026-06-14T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222205', 'why-brand-positioning-matters-more-than-ever-in-2026', '{"en": "Why Brand Positioning Matters More Than Ever in 2026", "de": "Warum Markenpositionierung 2026 wichtiger ist denn je", "fr": "Pourquoi le positionnement de marque importe plus que jamais en 2026", "es": "Por qué el posicionamiento de marca importa más que nunca en 2026"}'::jsonb, '{"en": "In a saturated market, strategic positioning is the difference between being seen and being chosen.", "de": "In einem gesättigten Markt entscheidet strategische Positionierung zwischen gesehen und gewählt werden.", "fr": "Sur un marché saturé, le positionnement stratégique fait la différence entre être vu et être choisi.", "es": "En un mercado saturado, el posicionamiento estratégico marca la diferencia entre ser visto y ser elegido."}'::jsonb, '{"en": "In a market saturated with lookalike products, price alone is a race to the bottom. Positioning is the decision about who you serve and why you are the only credible choice for them.\n\nGreat positioning compounds. It makes marketing more efficient, sales conversations shorter, and pricing power stronger — the quiet moat behind every category leader.", "de": "In einem Markt voller austauschbarer Produkte ist der Preis allein ein Wettlauf nach unten. Positionierung ist die Entscheidung, wem man dient und warum man für diese Zielgruppe die einzig glaubwürdige Wahl ist.\n\nGroße Positionierung wirkt kumulativ. Sie macht Marketing effizienter, Verkaufsgespräche kürzer und die Preissetzungsmacht stärker – der stille Burggraben hinter jedem Kategorieführer.", "fr": "Sur un marché saturé de produits similaires, le prix seul est une course vers le bas. Le positionnement, c''est la décision de savoir qui vous servez et pourquoi vous êtes le seul choix crédible pour eux.\n\nUn grand positionnement se cumule. Il rend le marketing plus efficace, les conversations commerciales plus courtes et le pouvoir de fixation des prix plus fort – les douves silencieuses derrière chaque leader de catégorie.", "es": "En un mercado saturado de productos similares, el precio por sí solo es una carrera hacia abajo. El posicionamiento es la decisión sobre a quién sirves y por qué eres la única opción creíble para ellos.\n\nUn gran posicionamiento se acumula. Hace el marketing más eficiente, las conversaciones de venta más cortas y el poder de fijación de precios más fuerte: el foso silencioso detrás de cada líder de categoría."}'::jsonb, 9, '{"en": "Why Brand Positioning Matters More Than Ever in 2026", "de": "Warum Markenpositionierung 2026 wichtiger ist denn je", "fr": "Pourquoi le positionnement de marque importe plus que jamais en 2026", "es": "Por qué el posicionamiento de marca importa más que nunca en 2026"}'::jsonb, '{"en": "In a saturated market, strategic positioning is the difference between being seen and being chosen.", "de": "In einem gesättigten Markt entscheidet strategische Positionierung zwischen gesehen und gewählt werden.", "fr": "Sur un marché saturé, le positionnement stratégique fait la différence entre être vu et être choisi.", "es": "En un mercado saturado, el posicionamiento estratégico marca la diferencia entre ser visto y ser elegido."}'::jsonb, false, 'published', '2026-06-10T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222206', 'serverless-architecture-scaling-without-the-headaches', '{"en": "Serverless Architecture: Scaling Without the Headaches", "de": "Serverless-Architektur: Skalieren ohne Kopfschmerzen", "fr": "Architecture serverless : passer à l''échelle sans maux de tête", "es": "Arquitectura serverless: escalar sin dolores de cabeza"}'::jsonb, '{"en": "A practical guide to building resilient, auto-scaling applications with zero server management.", "de": "Ein praktischer Leitfaden für widerstandsfähige, automatisch skalierende Anwendungen ohne Serververwaltung.", "fr": "Un guide pratique pour créer des applications résilientes à mise à l''échelle automatique, sans gestion de serveurs.", "es": "Una guía práctica para crear aplicaciones resilientes y autoescalables sin gestión de servidores."}'::jsonb, '{"en": "Serverless shifts the burden of infrastructure from your team to the platform. You deploy functions, not servers, and scale happens automatically — even when traffic spikes overnight.\n\nThe trade-offs are real: cold starts, vendor coupling, and cost discipline. This guide covers the patterns that make serverless resilient and the mistakes that quietly inflate your bill.", "de": "Serverless verlagert die Infrastrukturlast vom Team auf die Plattform. Sie deployen Funktionen, keine Server, und die Skalierung erfolgt automatisch – selbst wenn der Traffic über Nacht ansteigt.\n\nDie Kompromisse sind real: Cold Starts, Anbieterbindung und Kostendisziplin. Dieser Leitfaden behandelt die Muster, die Serverless widerstandsfähig machen, und die Fehler, die Ihre Rechnung stillschweigend aufblähen.", "fr": "Le serverless transfère la charge de l''infrastructure de votre équipe vers la plateforme. Vous déployez des fonctions, pas des serveurs, et la mise à l''échelle se fait automatiquement – même lorsque le trafic explose pendant la nuit.\n\nLes compromis sont réels : démarrages à froid, couplage au fournisseur et discipline des coûts. Ce guide couvre les modèles qui rendent le serverless résilient et les erreurs qui gonflent silencieusement votre facture.", "es": "Serverless traslada la carga de la infraestructura de tu equipo a la plataforma. Despliegas funciones, no servidores, y la escala ocurre automáticamente, incluso cuando el tráfico se dispara de la noche a la mañana.\n\nLas contrapartidas son reales: arranques en frío, acoplamiento al proveedor y disciplina de costes. Esta guía cubre los patrones que hacen resiliente serverless y los errores que inflan silenciosamente tu factura."}'::jsonb, 10, '{"en": "Serverless Architecture: Scaling Without the Headaches", "de": "Serverless-Architektur: Skalieren ohne Kopfschmerzen", "fr": "Architecture serverless : passer à l''échelle sans maux de tête", "es": "Arquitectura serverless: escalar sin dolores de cabeza"}'::jsonb, '{"en": "A practical guide to building resilient, auto-scaling applications with zero server management.", "de": "Ein praktischer Leitfaden für widerstandsfähige, automatisch skalierende Anwendungen ohne Serververwaltung.", "fr": "Un guide pratique pour créer des applications résilientes à mise à l''échelle automatique, sans gestion de serveurs.", "es": "Una guía práctica para crear aplicaciones resilientes y autoescalables sin gestión de servidores."}'::jsonb, false, 'published', '2026-06-05T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222207', 'typography-systems-that-elevate-brand-perception', '{"en": "Typography Systems That Elevate Brand Perception", "de": "Schriftsysteme, die die Markenwahrnehmung steigern", "fr": "Des systèmes typographiques qui élèvent la perception de la marque", "es": "Sistemas tipográficos que elevan la percepción de marca"}'::jsonb, '{"en": "How intentional type choices create hierarchy, emotion, and unforgettable brand experiences.", "de": "Wie bewusste Schriftwahl Hierarchie, Emotion und unvergessliche Markenerlebnisse schafft.", "fr": "Comment des choix typographiques intentionnels créent hiérarchie, émotion et expériences de marque inoubliables.", "es": "Cómo las elecciones tipográficas intencionales crean jerarquía, emoción y experiencias de marca inolvidables."}'::jsonb, '{"en": "Typography is the voice of your brand. Before a single word is read, type establishes tone, hierarchy, and trust — or quietly erodes it.\n\nWe break down how to build a type system: pairing display and text faces, setting a modular scale, and choosing weights that communicate the personality you want customers to feel.", "de": "Typografie ist die Stimme Ihrer Marke. Bevor ein einziges Wort gelesen wird, etabliert die Schrift Ton, Hierarchie und Vertrauen – oder untergräbt sie stillschweigend.\n\nWir zeigen, wie man ein Schriftsystem aufbaut: Display- und Textschriften kombinieren, einen modularen Maßstab festlegen und Schriftschnitte wählen, die die Persönlichkeit vermitteln, die Kunden spüren sollen.", "fr": "La typographie est la voix de votre marque. Avant même qu''un seul mot ne soit lu, la typographie établit le ton, la hiérarchie et la confiance – ou les érode silencieusement.\n\nNous expliquons comment construire un système typographique : associer des polices display et textes, définir une échelle modulaire et choisir des graisses qui communiquent la personnalité que vous voulez que les clients ressentent.", "es": "La tipografía es la voz de tu marca. Antes de que se lea una sola palabra, la tipografía establece tono, jerarquía y confianza, o la erosiona silenciosamente.\n\nDesglosamos cómo construir un sistema tipográfico: combinar familias display y de texto, fijar una escala modular y elegir pesos que comuniquen la personalidad que quieres que sientan los clientes."}'::jsonb, 6, '{"en": "Typography Systems That Elevate Brand Perception", "de": "Schriftsysteme, die die Markenwahrnehmung steigern", "fr": "Des systèmes typographiques qui élèvent la perception de la marque", "es": "Sistemas tipográficos que elevan la percepción de marca"}'::jsonb, '{"en": "How intentional type choices create hierarchy, emotion, and unforgettable brand experiences.", "de": "Wie bewusste Schriftwahl Hierarchie, Emotion und unvergessliche Markenerlebnisse schafft.", "fr": "Comment des choix typographiques intentionnels créent hiérarchie, émotion et expériences de marque inoubliables.", "es": "Cómo las elecciones tipográficas intencionales crean jerarquía, emoción y experiencias de marca inolvidables."}'::jsonb, false, 'published', '2026-05-30T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222208', 'retention-over-acquisition-the-new-growth-playbook', '{"en": "Retention Over Acquisition: The New Growth Playbook", "de": "Bindung vor Akquise: Das neue Growth-Playbook", "fr": "La rétention avant l''acquisition : le nouveau playbook de croissance", "es": "Retención frente a adquisición: el nuevo manual de crecimiento"}'::jsonb, '{"en": "Why keeping customers is the most underrated strategy — and how to do it at scale.", "de": "Warum Kundenbindung die am meisten unterschätzte Strategie ist – und wie man sie skalieren kann.", "fr": "Pourquoi la fidélisation est la stratégie la plus sous-estimée – et comment la mettre à l''échelle.", "es": "Por qué retener clientes es la estrategia más infravalorada y cómo hacerlo a escala."}'::jsonb, '{"en": "Acquiring customers is expensive; keeping them is a choice. Retention programs compound, turning one-time buyers into predictable revenue.\n\nFrom onboarding flows to win-back campaigns, we look at the interventions with the highest leverage — and why measuring cohort retention beats watching vanity metrics.", "de": "Kundenakquise ist teuer; Kunden zu halten ist eine Entscheidung. Bindungsprogramme wirken kumulativ und verwandeln Einmalkäufer in planbare Umsätze.\n\nVon Onboarding-Flows bis zu Rückgewinnungskampagnen betrachten wir die Interventionen mit der höchsten Hebelwirkung – und warum die Messung der Kohortenbindung besser ist als das Beobachten von Vanity-Metriken.", "fr": "Acquérir des clients coûte cher ; les conserver est un choix. Les programmes de rétention se cumulent, transformant les acheteurs ponctuels en revenus prévisibles.\n\nDes parcours d''onboarding aux campagnes de reconquête, nous examinons les interventions à plus fort levier – et pourquoi mesurer la rétention par cohorte vaut mieux que surveiller des métriques de vanité.", "es": "Adquirir clientes es caro; retenerlos es una decisión. Los programas de retención se acumulan y convierten compradores únicos en ingresos predecibles.\n\nDesde los flujos de incorporación hasta las campañas de recuperación, analizamos las intervenciones de mayor apalancamiento y por qué medir la retención por cohortes supera a observar métricas de vanidad."}'::jsonb, 7, '{"en": "Retention Over Acquisition: The New Growth Playbook", "de": "Bindung vor Akquise: Das neue Growth-Playbook", "fr": "La rétention avant l''acquisition : le nouveau playbook de croissance", "es": "Retención frente a adquisición: el nuevo manual de crecimiento"}'::jsonb, '{"en": "Why keeping customers is the most underrated strategy — and how to do it at scale.", "de": "Warum Kundenbindung die am meisten unterschätzte Strategie ist – und wie man sie skalieren kann.", "fr": "Pourquoi la fidélisation est la stratégie la plus sous-estimée – et comment la mettre à l''échelle.", "es": "Por qué retener clientes es la estrategia más infravalorada y cómo hacerlo a escala."}'::jsonb, false, 'published', '2026-05-24T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222209', 'the-art-of-digital-transformation-a-ceos-guide', '{"en": "The Art of Digital Transformation: A CEO''s Guide", "de": "Die Kunst der digitalen Transformation: Ein Leitfaden für CEOs", "fr": "L''art de la transformation numérique : le guide du CEO", "es": "El arte de la transformación digital: guía para CEOs"}'::jsonb, '{"en": "Leading organizational change through technology adoption without losing your culture.", "de": "Organisatorischen Wandel durch Technologieeinführung führen, ohne die Kultur zu verlieren.", "fr": "Mener le changement organisationnel grâce à l''adoption technologique sans perdre votre culture.", "es": "Liderar el cambio organizativo mediante la adopción tecnológica sin perder la cultura."}'::jsonb, '{"en": "Digital transformation fails when it is treated as an IT project. It succeeds when leadership aligns technology with culture, incentives, and the way work actually happens.\n\nA practical guide for leaders: how to sequence change, communicate the why, and protect the culture that makes new tools stick.", "de": "Digitale Transformation scheitert, wenn sie als IT-Projekt behandelt wird. Sie gelingt, wenn Führung Technologie mit Kultur, Anreizen und der tatsächlichen Arbeitsweise in Einklang bringt.\n\nEin praktischer Leitfaden für Führungskräfte: Veränderungen richtig sequenzieren, das Warum kommunizieren und die Kultur schützen, die neue Werkzeuge nachhaltig verankert.", "fr": "La transformation numérique échoue lorsqu''elle est traitée comme un projet IT. Elle réussit lorsque le leadership aligne la technologie avec la culture, les incitations et la manière dont le travail se fait réellement.\n\nUn guide pratique pour les dirigeants : séquencer le changement, communiquer le pourquoi et protéger la culture qui fait adopter durablement les nouveaux outils.", "es": "La transformación digital fracasa cuando se trata como un proyecto de TI. Triunfa cuando el liderazgo alinea la tecnología con la cultura, los incentivos y la forma real en que se trabaja.\n\nUna guía práctica para líderes: cómo secuenciar el cambio, comunicar el porqué y proteger la cultura que hace que las nuevas herramientas perduren."}'::jsonb, 12, '{"en": "The Art of Digital Transformation: A CEO''s Guide", "de": "Die Kunst der digitalen Transformation: Ein Leitfaden für CEOs", "fr": "L''art de la transformation numérique : le guide du CEO", "es": "El arte de la transformación digital: guía para CEOs"}'::jsonb, '{"en": "Leading organizational change through technology adoption without losing your culture.", "de": "Organisatorischen Wandel durch Technologieeinführung führen, ohne die Kultur zu verlieren.", "fr": "Mener le changement organisationnel grâce à l''adoption technologique sans perdre votre culture.", "es": "Liderar el cambio organizativo mediante la adopción tecnológica sin perder la cultura."}'::jsonb, false, 'published', '2026-05-18T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222210', 'headless-cms-vs-traditional-making-the-right-choice', '{"en": "Headless CMS vs Traditional: Making the Right Choice", "de": "Headless-CMS vs. traditionell: Die richtige Wahl", "fr": "CMS headless vs traditionnel : faire le bon choix", "es": "CMS headless vs. tradicional: la elección correcta"}'::jsonb, '{"en": "A decision framework for selecting the content architecture that fits your team and goals.", "de": "Ein Entscheidungsrahmen für die Content-Architektur, die zu Team und Zielen passt.", "fr": "Un cadre de décision pour choisir l''architecture de contenu qui convient à votre équipe et à vos objectifs.", "es": "Un marco de decisión para elegir la arquitectura de contenido que encaja con tu equipo y tus objetivos."}'::jsonb, '{"en": "Headless CMS gives developers freedom and marketers speed — but it is not the right answer for every team. The choice depends on your content model, your publishing cadence, and your team''s skills.\n\nWe compare the two architectures across the decisions that matter: content modeling, previewing, performance, and the total cost of ownership over three years.", "de": "Headless-CMS gibt Entwicklern Freiheit und Marketern Geschwindigkeit – aber es ist nicht für jedes Team die richtige Antwort. Die Wahl hängt vom Content-Modell, der Veröffentlichungsfrequenz und den Fähigkeiten des Teams ab.\n\nWir vergleichen die beiden Architekturen anhand der entscheidenden Fragen: Content-Modellierung, Vorschau, Performance und die Gesamtbetriebskosten über drei Jahre.", "fr": "Le CMS headless donne aux développeurs la liberté et aux marketeurs la vitesse – mais ce n''est pas la bonne réponse pour chaque équipe. Le choix dépend de votre modèle de contenu, de votre rythme de publication et des compétences de votre équipe.\n\nNous comparons les deux architectures sur les décisions qui comptent : modélisation du contenu, aperçu, performance et coût total de possession sur trois ans.", "es": "El CMS headless da libertad a los desarrolladores y velocidad a los especialistas en marketing, pero no es la respuesta correcta para todos los equipos. La elección depende de tu modelo de contenido, tu ritmo de publicación y las habilidades de tu equipo.\n\nComparamos las dos arquitecturas en las decisiones que importan: modelado de contenido, previsualización, rendimiento y coste total de propiedad a tres años."}'::jsonb, 6, '{"en": "Headless CMS vs Traditional: Making the Right Choice", "de": "Headless-CMS vs. traditionell: Die richtige Wahl", "fr": "CMS headless vs traditionnel : faire le bon choix", "es": "CMS headless vs. tradicional: la elección correcta"}'::jsonb, '{"en": "A decision framework for selecting the content architecture that fits your team and goals.", "de": "Ein Entscheidungsrahmen für die Content-Architektur, die zu Team und Zielen passt.", "fr": "Un cadre de décision pour choisir l''architecture de contenu qui convient à votre équipe et à vos objectifs.", "es": "Un marco de decisión para elegir la arquitectura de contenido que encaja con tu equipo y tus objetivos."}'::jsonb, false, 'published', '2026-05-12T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222211', 'motion-design-principles-for-digital-products', '{"en": "Motion Design Principles for Digital Products", "de": "Motion-Design-Prinzipien für digitale Produkte", "fr": "Principes de motion design pour les produits numériques", "es": "Principios de motion design para productos digitales"}'::jsonb, '{"en": "How subtle animations create delight, guide attention, and make interfaces feel alive.", "de": "Wie subtile Animationen Freude erzeugen, Aufmerksamkeit lenken und Oberflächen lebendig machen.", "fr": "Comment des animations subtiles créent du plaisir, guident l''attention et donnent vie aux interfaces.", "es": "Cómo las animaciones sutiles crean deleite, guían la atención y hacen que las interfaces se sientan vivas."}'::jsonb, '{"en": "Motion is how interfaces explain themselves. A well-timed transition guides attention, communicates state, and makes a product feel alive without asking for attention.\n\nWe cover the principles behind great motion — duration, easing, and hierarchy — and the restraint that keeps animation delightful instead of distracting.", "de": "Motion ist die Art, wie Oberflächen sich selbst erklären. Ein gut getimter Übergang lenkt Aufmerksamkeit, kommuniziert Zustände und macht ein Produkt lebendig, ohne um Aufmerksamkeit zu bitten.\n\nWir behandeln die Prinzipien hinter großartiger Bewegung – Dauer, Easing und Hierarchie – und die Zurückhaltung, die Animation reizvoll statt ablenkend macht.", "fr": "Le mouvement, c''est ainsi que les interfaces s''expliquent. Une transition bien rythmée guide l''attention, communique l''état et rend un produit vivant sans demander d''attention.\n\nNous couvrons les principes d''un grand mouvement – durée, easing et hiérarchie – et la retenue qui rend l''animation agréable au lieu de distraire.", "es": "El movimiento es como las interfaces se explican a sí mismas. Una transición bien sincronizada guía la atención, comunica el estado y hace que un producto se sienta vivo sin pedir atención.\n\nCubrimos los principios detrás del gran movimiento: duración, easing y jerarquía, y la contención que mantiene la animación encantadora en lugar de distractora."}'::jsonb, 8, '{"en": "Motion Design Principles for Digital Products", "de": "Motion-Design-Prinzipien für digitale Produkte", "fr": "Principes de motion design pour les produits numériques", "es": "Principios de motion design para productos digitales"}'::jsonb, '{"en": "How subtle animations create delight, guide attention, and make interfaces feel alive.", "de": "Wie subtile Animationen Freude erzeugen, Aufmerksamkeit lenken und Oberflächen lebendig machen.", "fr": "Comment des animations subtiles créent du plaisir, guident l''attention et donnent vie aux interfaces.", "es": "Cómo las animaciones sutiles crean deleite, guían la atención y hacen que las interfaces se sientan vivas."}'::jsonb, false, 'published', '2026-05-06T09:00:00Z'),
  ('22222222-2222-4222-8222-222222222212', 'seo-in-the-age-of-ai-what-actually-works-now', '{"en": "SEO in the Age of AI: What Actually Works Now", "de": "SEO im Zeitalter der KI: Was jetzt wirklich funktioniert", "fr": "Le SEO à l''ère de l''IA : ce qui fonctionne vraiment", "es": "SEO en la era de la IA: lo que realmente funciona"}'::jsonb, '{"en": "Adapting your organic strategy for AI-powered search engines and zero-click results.", "de": "Die organische Strategie für KI-gestützte Suchmaschinen und Zero-Click-Ergebnisse anpassen.", "fr": "Adapter votre stratégie organique aux moteurs de recherche IA et aux résultats zéro clic.", "es": "Adaptar tu estrategia orgánica a los buscadores con IA y a los resultados de cero clics."}'::jsonb, '{"en": "AI search is reshaping how people discover content. Answer engines summarize, compare, and cite — changing what it means to rank at all.\n\nWe share what still works: entity clarity, genuinely useful content, structured data, and building the kind of authority that machines and people both trust.", "de": "KI-Suche verändert, wie Menschen Inhalte entdecken. Antwortmaschinen fassen zusammen, vergleichen und zitieren – und verändern, was es überhaupt bedeutet, zu ranken.\n\nWir teilen, was weiterhin funktioniert: klare Entitäten, wirklich nützliche Inhalte, strukturierte Daten und der Aufbau einer Autorität, der Maschinen und Menschen gleichermaßen vertrauen.", "fr": "La recherche IA transforme la façon dont les gens découvrent le contenu. Les moteurs de réponse résument, comparent et citent – changeant ce que signifie réellement se classer.\n\nNous partageons ce qui fonctionne encore : clarté des entités, contenu réellement utile, données structurées et construction du type d''autorité auquel machines et humains font tous deux confiance.", "es": "La búsqueda con IA está cambiando cómo las personas descubren contenido. Los motores de respuesta resumen, comparan y citan, lo que cambia lo que significa posicionarse.\n\nCompartimos lo que sigue funcionando: claridad de entidades, contenido genuinamente útil, datos estructurados y construir el tipo de autoridad en la que confían tanto las máquinas como las personas."}'::jsonb, 5, '{"en": "SEO in the Age of AI: What Actually Works Now", "de": "SEO im Zeitalter der KI: Was jetzt wirklich funktioniert", "fr": "Le SEO à l''ère de l''IA : ce qui fonctionne vraiment", "es": "SEO en la era de la IA: lo que realmente funciona"}'::jsonb, '{"en": "Adapting your organic strategy for AI-powered search engines and zero-click results.", "de": "Die organische Strategie für KI-gestützte Suchmaschinen und Zero-Click-Ergebnisse anpassen.", "fr": "Adapter votre stratégie organique aux moteurs de recherche IA et aux résultats zéro clic.", "es": "Adaptar tu estrategia orgánica a los buscadores con IA y a los resultados de cero clics."}'::jsonb, false, 'published', '2026-04-28T09:00:00Z')
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

INSERT INTO public.testimonials (id, quote_translations, person_name, person_role_translations, company_name, display_order, is_featured, is_visible, is_verified)
VALUES
  ('33333333-3333-4333-8333-333333333311', '{"en": "Stratifit rebuilt our entire digital presence. Within six months we doubled online revenue and our brand finally looks the part.", "de": "Stratifit hat unsere gesamte digitale Präsenz neu aufgebaut. Innerhalb von sechs Monaten haben wir den Online-Umsatz verdoppelt und unsere Marke sieht endlich danach aus.", "fr": "Stratifit a reconstruit toute notre présence numérique. En six mois, nous avons doublé notre chiffre d affaires en ligne et notre marque a enfin l allure qu elle mérite.", "es": "Stratifit reconstruyó toda nuestra presencia digital. En seis meses duplicamos los ingresos online y nuestra marca por fin tiene la imagen que merece."}'::jsonb, 'Claire Fontaine', '{"en": "CEO", "de": "CEO", "fr": "PDG", "es": "CEO"}'::jsonb, 'Maison Lumière', 1, true, true, true),
  ('33333333-3333-4333-8333-333333333312', '{"en": "The website Stratifit delivered converts beautifully. Our demo requests grew 340% in the first quarter after launch.", "de": "Die Website, die Stratifit geliefert hat, konvertiert hervorragend. Unsere Demo-Anfragen stiegen im ersten Quartal nach dem Start um 340 %.", "fr": "Le site livré par Stratifit convertit magnifiquement. Nos demandes de démo ont augmenté de 340 % au premier trimestre après le lancement.", "es": "El sitio web que Stratifit entregó convierte de maravilla. Nuestras solicitudes de demo crecieron un 340 % en el primer trimestre tras el lanzamiento."}'::jsonb, 'Marcus Weber', '{"en": "Co-Founder & CTO", "de": "Mitgründer & CTO", "fr": "Co-fondateur & CTO", "es": "Co-fundador y CTO"}'::jsonb, 'Nova Fintech', 2, true, true, true),
  ('33333333-3333-4333-8333-333333333313', '{"en": "Their AI assistant handles 78% of our support tickets end-to-end. Our team finally focuses on complex cases instead of repetitive ones.", "de": "Ihr KI-Assistent bearbeitet 78 % unserer Support-Tickets vollständig. Unser Team konzentriert sich endlich auf komplexe Fälle statt auf Routineaufgaben.", "fr": "Leur assistant IA traite 78 % de nos tickets de support de bout en bout. Notre équipe se concentre enfin sur les cas complexes plutôt que répétitifs.", "es": "Su asistente de IA gestiona el 78 % de nuestros tickets de soporte de principio a fin. Nuestro equipo por fin se centra en casos complejos en lugar de repetitivos."}'::jsonb, 'Sofia Rossi', '{"en": "Head of Customer Experience", "de": "Leiterin Kundenerlebnis", "fr": "Responsable de l expérience client", "es": "Directora de Experiencia del Cliente"}'::jsonb, 'Helios Health', 3, true, true, true)
ON CONFLICT (id) DO UPDATE SET
  quote_translations = EXCLUDED.quote_translations,
  person_name = EXCLUDED.person_name,
  person_role_translations = EXCLUDED.person_role_translations,
  company_name = EXCLUDED.company_name,
  is_visible = EXCLUDED.is_visible,
  is_verified = EXCLUDED.is_verified;


