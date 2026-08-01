-- Migration: 00018_section_settings
-- Description: Centralized editable settings (eyebrow, title, highlight, description)
--              for every homepage section, editable from the CMS admin.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Section Settings
-- =============================================================================

CREATE TABLE public.section_settings (
  section_key              text PRIMARY KEY CHECK (section_key IN (
    'services',
    'process',
    'why-choose-us',
    'insights',
    'portfolio',
    'testimonials',
    'pricing',
    'faq',
    'final-cta',
    'trusted-by'
  )),
  label                    text NOT NULL,
  eyebrow_translations     jsonb NOT NULL DEFAULT '{}'::jsonb,
  title_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  highlight_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  description_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_visible               boolean NOT NULL DEFAULT true,
  display_order            integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.section_settings IS 'Editable headings for homepage sections.';
COMMENT ON COLUMN public.section_settings.highlight_translations IS 'Substring of the title rendered in the amber brand accent.';

CREATE TRIGGER set_section_settings_updated_at
  BEFORE UPDATE ON public.section_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE public.section_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read visible section_settings"
  ON public.section_settings FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "admins can manage section_settings"
  ON public.section_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- Seed Data (idempotent)
-- =============================================================================

INSERT INTO public.section_settings
  (section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, is_visible, display_order)
VALUES
  (
    'services',
    'Services',
    '{"en": "Services", "de": "Leistungen", "fr": "Services", "es": "Servicios"}'::jsonb,
    '{"en": "Our Core", "de": "Unsere Kernleistungen", "fr": "Nos Services Principaux", "es": "Nuestros Servicios Principales"}'::jsonb,
    '{"en": "Services", "de": "", "fr": "", "es": ""}'::jsonb,
    '{"en": "Strategic solutions engineered to scale your digital presence with precision and luxury.", "de": "Strategische Lösungen, die Ihre digitale Präsenz präzise und hochwertig skalieren.", "fr": "Des solutions stratégiques conçues pour développer votre présence numérique avec précision et luxe.", "es": "Soluciones estratégicas diseñadas para escalar su presencia digital con precisión y lujo."}'::jsonb,
    true,
    10
  ),
  (
    'process',
    'Process',
    '{"en": "Process", "de": "Prozess", "fr": "Processus", "es": "Proceso"}'::jsonb,
    '{"en": "How We", "de": "Wie wir", "fr": "Comment nous", "es": "Cómo"}'::jsonb,
    '{"en": "Work", "de": "arbeiten", "fr": "travaillons", "es": "trabajamos"}'::jsonb,
    '{"en": "A proven framework that takes you from idea to scale — predictably and efficiently.", "de": "Ein bewährtes Rahmenwerk, das Sie von der Idee bis zur Skalierung führt – vorhersehbar und effizient.", "fr": "Un cadre éprouvé qui vous mène de l''idée à l''échelle, de manière prévisible et efficace.", "es": "Un marco probado que le lleva de la idea a la escala, de forma predecible y eficiente."}'::jsonb,
    true,
    20
  ),
  (
    'why-choose-us',
    'Why Choose Us',
    '{"en": "Why Us", "de": "Warum wir", "fr": "Pourquoi nous", "es": "Por qué nosotros"}'::jsonb,
    '{"en": "Not Just Another", "de": "Nicht nur eine weitere", "fr": "Pas juste une autre", "es": "No solo otra"}'::jsonb,
    '{"en": "Agency", "de": "Agentur", "fr": "agence", "es": "agencia"}'::jsonb,
    '{"en": "We build digital assets that drive valuation and market authority — not just websites.", "de": "Wir bauen digitale Assets, die Bewertung und Marktautorität steigern – nicht nur Websites.", "fr": "Nous créons des actifs numériques qui augmentent la valorisation et l''autorité de marché – pas seulement des sites web.", "es": "Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web."}'::jsonb,
    true,
    30
  ),
  (
    'insights',
    'Insights & Expertise',
    '{"en": "Knowledge", "de": "Wissen", "fr": "Savoir", "es": "Conocimiento"}'::jsonb,
    '{"en": "Insights &", "de": "Einblicke &", "fr": "Insights &", "es": "Perspectivas y"}'::jsonb,
    '{"en": "Expertise", "de": "Expertise", "fr": "Expertise", "es": "experiencia"}'::jsonb,
    '{"en": "Thought leadership and industry perspectives from our team of strategists and engineers.", "de": "Gedankenführung und Branchenperspektiven von unserem Team aus Strategen und Ingenieuren.", "fr": "Leadership éclairé et perspectives sectorielles de notre équipe de stratèges et d''ingénieurs.", "es": "Liderazgo de pensamiento y perspectivas de la industria de nuestro equipo de estrategas e ingenieros."}'::jsonb,
    true,
    40
  ),
  (
    'portfolio',
    'Portfolio',
    '{"en": "Portfolio", "de": "Portfolio", "fr": "Portfolio", "es": "Portafolio"}'::jsonb,
    '{"en": "Our", "de": "Unsere", "fr": "Nos", "es": "Nuestros"}'::jsonb,
    '{"en": "Work", "de": "Arbeiten", "fr": "Réalisations", "es": "Proyectos"}'::jsonb,
    '{"en": "We craft digital experiences that define industries and elevate brands through precision and creativity.", "de": "Wir gestalten digitale Erlebnisse, die Branchen definieren und Marken durch Präzision und Kreativität aufwerten.", "fr": "Nous créons des expériences numériques qui définissent les industries et élèvent les marques grâce à la précision et la créativité.", "es": "Creamos experiencias digitales que definen industrias y elevan marcas a través de la precisión y la creatividad."}'::jsonb,
    true,
    50
  ),
  (
    'testimonials',
    'Testimonials',
    '{"en": "Testimonials", "de": "Referenzen", "fr": "Témoignages", "es": "Testimonios"}'::jsonb,
    '{"en": "What Our Clients", "de": "Was unsere Kunden", "fr": "Ce que disent nos clients", "es": "Lo que dicen nuestros clientes"}'::jsonb,
    '{"en": "Say", "de": "sagen", "fr": "", "es": ""}'::jsonb,
    '{"en": "Don''t take our word for it — hear from the brands we''ve helped scale.", "de": "Verlassen Sie sich nicht nur auf unser Wort – hören Sie, was die Marken sagen, denen wir zum Wachstum verholfen haben.", "fr": "Ne nous croyez pas sur parole – écoutez les marques que nous avons aidées à se développer.", "es": "No confíe solo en nuestra palabra: escuche a las marcas que hemos ayudado a escalar."}'::jsonb,
    true,
    60
  ),
  (
    'pricing',
    'Pricing',
    '{"en": "Pricing", "de": "Preise", "fr": "Tarifs", "es": "Precios"}'::jsonb,
    '{"en": "Service", "de": "Service", "fr": "Forfaits de", "es": "Paquetes de"}'::jsonb,
    '{"en": "Packages", "de": "Pakete", "fr": "services", "es": "servicios"}'::jsonb,
    '{"en": "Transparent pricing for every stage of growth. Start where you are and scale with confidence.", "de": "Transparente Preise für jede Wachstumsphase. Starten Sie dort, wo Sie sind, und skalieren Sie mit Zuversicht.", "fr": "Des tarifs transparents pour chaque étape de croissance. Commencez là où vous êtes et développez-vous en confiance.", "es": "Precios transparentes para cada etapa de crecimiento. Empiece donde está y escale con confianza."}'::jsonb,
    true,
    70
  ),
  (
    'faq',
    'FAQ',
    '{"en": "Support", "de": "Support", "fr": "Support", "es": "Soporte"}'::jsonb,
    '{"en": "Frequently Asked", "de": "Häufig gestellte", "fr": "Questions", "es": "Preguntas"}'::jsonb,
    '{"en": "Questions", "de": "Fragen", "fr": "fréquentes", "es": "frecuentes"}'::jsonb,
    '{"en": "Clear answers to the most common questions we hear from clients.", "de": "Klare Antworten auf die häufigsten Fragen, die wir von Kunden hören.", "fr": "Des réponses claires aux questions les plus courantes que nous recevons de nos clients.", "es": "Respuestas claras a las preguntas más comunes que recibimos de los clientes."}'::jsonb,
    true,
    80
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
-- Rollback
-- =============================================================================
-- DROP POLICY IF EXISTS "admins can manage section_settings" ON public.section_settings;
-- DROP POLICY IF EXISTS "public can read visible section_settings" ON public.section_settings;
-- DROP TABLE IF EXISTS public.section_settings;
