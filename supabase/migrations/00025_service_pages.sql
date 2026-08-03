-- Migration: 00025_service_pages
-- Description: Dedicated service landing pages (e.g. Brand Design), fully
--              editable from the admin CMS. Each row belongs to a service and
--              stores structured, translated content for every section.
-- Stratifit Digital Agency Platform

CREATE TABLE public.service_pages (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id                      uuid REFERENCES public.services(id) ON DELETE CASCADE,
  slug                            text NOT NULL UNIQUE,
  is_visible                      boolean NOT NULL DEFAULT true,

  -- Hero
  hero_eyebrow_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  hero_title_translations         jsonb NOT NULL DEFAULT '{}'::jsonb,
  hero_highlight_translations     jsonb NOT NULL DEFAULT '{}'::jsonb,
  hero_description_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  hero_stats                      jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Why it matters
  why_title_translations          jsonb NOT NULL DEFAULT '{}'::jsonb,
  why_description_translations    jsonb NOT NULL DEFAULT '{}'::jsonb,
  why_badges                      jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Capabilities
  capabilities_title_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  capabilities                    jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Deliverables
  deliverables_title_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  deliverables                    jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Process
  process_title_translations      jsonb NOT NULL DEFAULT '{}'::jsonb,
  process                         jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Toolkit
  toolkit_title_translations      jsonb NOT NULL DEFAULT '{}'::jsonb,
  toolkit                         jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Final CTA
  cta_title_translations          jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_subtitle_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_button_label_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.service_pages IS 'Dedicated service landing page content, fully CMS-editable.';

CREATE TRIGGER set_service_pages_updated_at
  BEFORE UPDATE ON public.service_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- RLS
-- =============================================================================
ALTER TABLE public.service_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read visible service_pages"
  ON public.service_pages FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "admins can manage service_pages"
  ON public.service_pages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- Seed — Brand Design service page
-- =============================================================================
INSERT INTO public.service_pages (
  service_id, slug, is_visible,
  hero_eyebrow_translations,
  hero_title_translations,
  hero_highlight_translations,
  hero_description_translations,
  hero_stats,
  why_title_translations,
  why_description_translations,
  why_badges,
  capabilities_title_translations,
  capabilities,
  deliverables_title_translations,
  deliverables,
  process_title_translations,
  process,
  toolkit_title_translations,
  toolkit,
  cta_title_translations,
  cta_subtitle_translations,
  cta_button_label_translations
)
SELECT
  s.id, 'brand-design', true,
  '{"en": "Brand Design Services", "de": "Brand-Design-Services", "fr": "Services de design de marque", "es": "Servicios de diseño de marca"}'::jsonb,
  '{"en": "Build a brand that feels", "de": "Baue eine Marke, die sich anfühlt wie", "fr": "Construisez une marque qui semble", "es": "Construye una marca que se sienta"}'::jsonb,
  '{"en": "inevitable.", "de": "unvermeidlich.", "fr": "inévitable.", "es": "inevitable."}'::jsonb,
  '{"en": "We craft strategic visual identities designed to drive valuation and establish market authority from day one.", "de": "Wir entwickeln strategische visuelle Identitäten, die den Wert steigern und von Anfang an Marktautorität aufbauen.", "fr": "Nous créons des identités visuelles stratégiques conçues pour accroître la valorisation et établir l''autorité du marché dès le premier jour.", "es": "Creamos identidades visuales estratégicas diseñadas para impulsar la valoración y establecer autoridad de mercado desde el primer día."}'::jsonb,
  '[
    {"value": "120+", "label_translations": {"en": "Brands Launched", "de": "Gelaunchte Marken", "fr": "Marques lancées", "es": "Marcas lanzadas"}},
    {"value": "4.8", "label_translations": {"en": "Avg. Rating on Clutch", "de": "Ø-Bewertung auf Clutch", "fr": "Note moyenne sur Clutch", "es": "Calificación media en Clutch"}},
    {"value": "96%", "label_translations": {"en": "Client Satisfaction", "de": "Kundenzufriedenheit", "fr": "Satisfaction client", "es": "Satisfacción del cliente"}}
  ]'::jsonb,
  '{"en": "Why It Matters", "de": "Warum es zählt", "fr": "Pourquoi c''est important", "es": "Por qué importa"}'::jsonb,
  '{"en": "Strategic branding is the architectural foundation of market authority. Beyond aesthetics, it drives business valuation, secures investor trust, and builds long-term equity by creating an emotionally memorable connection that scales with your vision.", "de": "Strategisches Branding ist das architektonische Fundament der Marktautorität. Über Ästhetik hinaus steigert es den Unternehmenswert, sichert das Vertrauen von Investoren und schafft langfristiges Eigenkapital durch eine emotional einprägsame Verbindung, die mit Ihrer Vision skaliert.", "fr": "Le branding stratégique est le fondement architectural de l''autorité du marché. Au-delà de l''esthétique, il stimule la valorisation de l''entreprise, sécurise la confiance des investisseurs et crée une équité à long terme grâce à une connexion émotionnelle mémorable qui évolue avec votre vision.", "es": "El branding estratégico es el fundamento arquitectónico de la autoridad del mercado. Más allá de la estética, impulsa la valoración empresarial, asegura la confianza de los inversores y crea un valor a largo plazo mediante una conexión emocional memorable que escala con su visión."}'::jsonb,
  '[
    {"value": "2x", "label_translations": {"en": "Faster Growth", "de": "Schnelleres Wachstum", "fr": "Croissance plus rapide", "es": "Crecimiento más rápido"}, "hint_translations": {"en": "vs. unbranded competitors", "de": "vs. Markenlose Wettbewerber", "fr": "vs concurrents sans marque", "es": "vs competidores sin marca"}},
    {"value": "77%", "label_translations": {"en": "Consumer Trust", "de": "Verbrauchervertrauen", "fr": "Confiance des consommateurs", "es": "Confianza del consumidor"}, "hint_translations": {"en": "driven by brand consistency", "de": "durch Markenkonsistenz", "fr": "grâce à la cohérence de la marque", "es": "impulsada por la coherencia de marca"}},
    {"value": "89%", "label_translations": {"en": "Revenue Impact", "de": "Umsatzwirkung", "fr": "Impact sur le chiffre d''affaires", "es": "Impacto en ingresos"}, "hint_translations": {"en": "from strategic positioning", "de": "durch strategische Positionierung", "fr": "de la positionnement stratégique", "es": "del posicionamiento estratégico"}}
  ]'::jsonb,
  '{"en": "Branding Services", "de": "Branding-Leistungen", "fr": "Services de branding", "es": "Servicios de branding"}'::jsonb,
  '[
    {
      "title_translations": {"en": "Brand Strategy", "de": "Markenstrategie", "fr": "Stratégie de marque", "es": "Estrategia de marca"},
      "description_translations": {"en": "A deep dive into your market, audience, and goals to build a roadmap for long-term success and distinct positioning.", "de": "Eine tiefgehende Analyse von Markt, Zielgruppe und Zielen für eine langfristige Erfolgsroadmap und klare Positionierung.", "fr": "Une plongée dans votre marché, votre audience et vos objectifs pour construire une feuille de route de succès à long terme et un positionnement distinct.", "es": "Un análisis profundo de su mercado, audiencia y objetivos para construir una hoja de ruta de éxito a largo plazo y un posicionamiento distinto."},
      "steps": [
        {"label_translations": {"en": "Audit"}, "icon": "audit"},
        {"label_translations": {"en": "Workshop"}, "icon": "workshop"},
        {"label_translations": {"en": "Positioning"}, "icon": "positioning"},
        {"label_translations": {"en": "Roadmap"}, "icon": "roadmap"}
      ]
    },
    {
      "title_translations": {"en": "Logo Design", "de": "Logo-Design", "fr": "Conception de logo", "es": "Diseño de logotipo"},
      "description_translations": {"en": "Crafting a memorable, scalable, and timeless mark that serves as the cornerstone of your brand''s visual presence.", "de": "Einprägsame, skalierbare und zeitlose Zeichen, die als Eckpfeiler der visuellen Präsenz Ihrer Marke dienen.", "fr": "Création d''une marque mémorable, évolutive et intemporelle qui sert de pierre angulaire à la présence visuelle de votre marque.", "es": "Creamos un símbolo memorable, escalable y atemporal que sirve como piedra angular de la presencia visual de su marca."},
      "steps": [
        {"label_translations": {"en": "Discovery"}, "icon": "discovery"},
        {"label_translations": {"en": "Sketching"}, "icon": "sketch"},
        {"label_translations": {"en": "Refinement"}, "icon": "refine"},
        {"label_translations": {"en": "Finalization"}, "icon": "final"}
      ]
    },
    {
      "title_translations": {"en": "Visual Identity", "de": "Visuelle Identität", "fr": "Identité visuelle", "es": "Identidad visual"},
      "description_translations": {"en": "Full color palettes, typography, and asset libraries designed for absolute cohesion across every touchpoint.", "de": "Vollständige Farbpaletten, Typografie und Asset-Bibliotheken für absolute Kohärenz über alle Berührungspunkte.", "fr": "Palettes de couleurs complètes, typographie et bibliothèques d''actifs conçus pour une cohésion absolue sur chaque point de contact.", "es": "Paletas de color completas, tipografía y bibliotecas de activos diseñadas para una cohesión absoluta en cada punto de contacto."},
      "steps": [
        {"label_translations": {"en": "Typography"}, "icon": "type"},
        {"label_translations": {"en": "Color Theory"}, "icon": "color"},
        {"label_translations": {"en": "Imagery"}, "icon": "image"},
        {"label_translations": {"en": "Patterns"}, "icon": "pattern"}
      ]
    },
    {
      "title_translations": {"en": "Brand Guidelines", "de": "Markenrichtlinien", "fr": "Lignes directrices de marque", "es": "Directrices de marca"},
      "description_translations": {"en": "A comprehensive manual ensuring your team and partners use your brand assets correctly and consistently forever.", "de": "Ein umfassendes Handbuch, das sicherstellt, dass Ihr Team und Partner Ihre Marken-Assets dauerhaft korrekt und konsistent nutzen.", "fr": "Un manuel complet garantissant que votre équipe et vos partenaires utilisent correctement et de manière cohérente vos actifs de marque.", "es": "Un manual completo que garantiza que su equipo y socios utilicen sus activos de marca de forma correcta y coherente para siempre."},
      "steps": [
        {"label_translations": {"en": "Usage Rules"}, "icon": "rules"},
        {"label_translations": {"en": "Assets"}, "icon": "assets"},
        {"label_translations": {"en": "Typefaces"}, "icon": "type"},
        {"label_translations": {"en": "Layouts"}, "icon": "layout"}
      ]
    }
  ]'::jsonb,
  '{"en": "What''s Included", "de": "Was enthalten ist", "fr": "Ce qui est inclus", "es": "Qué incluye"}'::jsonb,
  '[
    {"title_translations": {"en": "Master Files", "de": "Master-Dateien", "fr": "Fichiers maîtres", "es": "Archivos maestros"}, "description_translations": {"en": "Vector Suite & Raster Files for all applications.", "de": "Vektor- und Rasterdateien für alle Anwendungen.", "fr": "Suite vectorielle et fichiers raster pour toutes les applications.", "es": "Suite vectorial y archivos raster para todas las aplicaciones."}, "icon": "folder"},
    {"title_translations": {"en": "System", "de": "System", "fr": "Système", "es": "Sistema"}, "description_translations": {"en": "Comprehensive Color Palettes & Type hierarchy.", "de": "Umfassende Farbpaletten und Typografie-Hierarchie.", "fr": "Palettes de couleurs complètes et hiérarchie typographique.", "es": "Paletas de color integrales y jerarquía tipográfica."}, "icon": "tag"},
    {"title_translations": {"en": "Kits", "de": "Kits", "fr": "Kits", "es": "Kits"}, "description_translations": {"en": "Ready-to-use Social Kit & Presentation Templates.", "de": "Einsatzbereite Social-Kits und Präsentationsvorlagen.", "fr": "Kit social prêt à l''emploi et modèles de présentation.", "es": "Kit social listo para usar y plantillas de presentación."}, "icon": "box"},
    {"title_translations": {"en": "Docs", "de": "Dokumente", "fr": "Documents", "es": "Documentos"}, "description_translations": {"en": "Full Brand Book & Rules of usage manual.", "de": "Vollständiges Markenbuch und Nutzungsregeln.", "fr": "Brand book complet et manuel d''utilisation.", "es": "Brand book completo y manual de reglas de uso."}, "icon": "book"}
  ]'::jsonb,
  '{"en": "How It Works", "de": "So funktioniert es", "fr": "Comment ça marche", "es": "Cómo funciona"}'::jsonb,
  '[
    {"number": 1, "title_translations": {"en": "Discovery", "de": "Entdeckung", "fr": "Découverte", "es": "Descubrimiento"}, "description_translations": {"en": "Researching brand DNA & market positioning.", "de": "Erforschung der Marken-DNA und Marktpositionierung.", "fr": "Recherche de l''ADN de la marque et positionnement sur le marché.", "es": "Investigación del ADN de la marca y posicionamiento de mercado."}, "icon": "search"},
    {"number": 2, "title_translations": {"en": "Strategy", "de": "Strategie", "fr": "Stratégie", "es": "Estrategia"}, "description_translations": {"en": "Defining core values & target audience.", "de": "Festlegung der Kernwerte und Zielgruppe.", "fr": "Définition des valeurs fondamentales et de l''audience cible.", "es": "Definición de los valores fundamentales y la audiencia objetivo."}, "icon": "spark"},
    {"number": 3, "title_translations": {"en": "Design", "de": "Design", "fr": "Design", "es": "Diseño"}, "description_translations": {"en": "Crafting visual identity & logo systems.", "de": "Gestaltung der visuellen Identität und Logosysteme.", "fr": "Création de l''identité visuelle et des systèmes de logo.", "es": "Creación de la identidad visual y los sistemas de logotipo."}, "icon": "pen"},
    {"number": 4, "title_translations": {"en": "Delivery", "de": "Lieferung", "fr": "Livraison", "es": "Entrega"}, "description_translations": {"en": "Launching assets & ongoing brand support.", "de": "Launch der Assets und fortlaufende Markenunterstützung.", "fr": "Lancement des actifs et soutien continu de la marque.", "es": "Lanzamiento de activos y soporte continuo de marca."}, "icon": "rocket"}
  ]'::jsonb,
  '{"en": "Tools & Technologies", "de": "Tools & Technologien", "fr": "Outils & technologies", "es": "Herramientas y tecnologías"}'::jsonb,
  '["Figma", "Illustrator", "Photoshop", "InDesign", "After Effects", "Cinema 4D", "Framer", "Webflow", "Sketch", "Lottie"]'::jsonb,
  '{"en": "Let''s craft your brand story.", "de": "Lass uns deine Markengeschichte gestalten.", "fr": "Créons l''histoire de votre marque.", "es": "Diseñemos la historia de su marca."}'::jsonb,
  '{"en": "Ready when you are. Get a free consultation and a clear roadmap for your brand.", "de": "Bereit, wenn du es bist. Hol dir eine kostenlose Beratung und eine klare Roadmap für deine Marke.", "fr": "Prêt quand vous l''êtes. Obtenez une consultation gratuite et une feuille de route claire pour votre marque.", "es": "Listo cuando lo estés. Obtén una consulta gratuita y una hoja de ruta clara para tu marca."}'::jsonb,
  '{"en": "Start Your Brand Project", "de": "Starte dein Markenprojekt", "fr": "Démarrez votre projet de marque", "es": "Inicia tu proyecto de marca"}'::jsonb
FROM public.services s
WHERE s.slug = 'brand-design'
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- Rollback
-- =============================================================================
-- DROP TABLE IF EXISTS public.service_pages;
