-- Migration: 00045_restore_section_headers
-- Description: Restores section header copy (eyebrow, title, highlight,
--              description) for ALL section_settings rows when their stored
--              translations are empty. The section headers (and page heroes
--              that read the same rows) were rendering with blank titles and
--              missing descriptions. Each UPDATE only fills fields that have no
--              usable value, so manually-overridden translations are preserved.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- services
-- =============================================================================

UPDATE public.section_settings
SET
  eyebrow_translations = CASE
    WHEN eyebrow_translations IS NULL OR eyebrow_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(eyebrow_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Services","de":"Leistungen","fr":"Services","es":"Servicios"}'::jsonb
    ELSE eyebrow_translations END,
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Our Core","de":"Unsere Kernleistungen","fr":"Nos Services Principaux","es":"Nuestros Servicios Principales"}'::jsonb
    ELSE title_translations END,
  highlight_translations = CASE
    WHEN highlight_translations IS NULL OR highlight_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(highlight_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Services","de":"","fr":"","es":""}'::jsonb
    ELSE highlight_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Strategic solutions engineered to scale your digital presence with precision and luxury.","de":"Strategische Lösungen, die Ihre digitale Präsenz präzise und hochwertig skalieren.","fr":"Des solutions stratégiques conçues pour développer votre présence numérique avec précision et luxe.","es":"Soluciones estratégicas diseñadas para escalar su presencia digital con precisión y lujo."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'services';

-- =============================================================================
-- process
-- =============================================================================

UPDATE public.section_settings
SET
  eyebrow_translations = CASE
    WHEN eyebrow_translations IS NULL OR eyebrow_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(eyebrow_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Process","de":"Prozess","fr":"Processus","es":"Proceso"}'::jsonb
    ELSE eyebrow_translations END,
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"How We","de":"Wie wir","fr":"Comment nous","es":"Cómo"}'::jsonb
    ELSE title_translations END,
  highlight_translations = CASE
    WHEN highlight_translations IS NULL OR highlight_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(highlight_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Work","de":"arbeiten","fr":"travaillons","es":"trabajamos"}'::jsonb
    ELSE highlight_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"A proven framework that takes you from idea to scale — predictably and efficiently.","de":"Ein bewährtes Rahmenwerk, das Sie von der Idee bis zur Skalierung führt – vorhersehbar und effizient.","fr":"Un cadre éprouvé qui vous mène de l''idée à l''échelle, de manière prévisible et efficace.","es":"Un marco probado que le lleva de la idea a la escala, de forma predecible y eficiente."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'process';

-- =============================================================================
-- why-choose-us
-- =============================================================================

UPDATE public.section_settings
SET
  eyebrow_translations = CASE
    WHEN eyebrow_translations IS NULL OR eyebrow_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(eyebrow_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Why Us","de":"Warum wir","fr":"Pourquoi nous","es":"Por qué nosotros"}'::jsonb
    ELSE eyebrow_translations END,
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Not Just Another","de":"Nicht nur eine weitere","fr":"Pas juste une autre","es":"No solo otra"}'::jsonb
    ELSE title_translations END,
  highlight_translations = CASE
    WHEN highlight_translations IS NULL OR highlight_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(highlight_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Agency","de":"Agentur","fr":"agence","es":"agencia"}'::jsonb
    ELSE highlight_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"We build digital assets that drive valuation and market authority — not just websites.","de":"Wir bauen digitale Assets, die Bewertung und Marktautorität steigern – nicht nur Websites.","fr":"Nous créons des actifs numériques qui augmentent la valorisation et l''autorité de marché – pas seulement des sites web.","es":"Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'why-choose-us';

-- =============================================================================
-- insights
-- =============================================================================

UPDATE public.section_settings
SET
  eyebrow_translations = CASE
    WHEN eyebrow_translations IS NULL OR eyebrow_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(eyebrow_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Knowledge","de":"Wissen","fr":"Savoir","es":"Conocimiento"}'::jsonb
    ELSE eyebrow_translations END,
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Insights &","de":"Einblicke &","fr":"Insights &","es":"Perspectivas y"}'::jsonb
    ELSE title_translations END,
  highlight_translations = CASE
    WHEN highlight_translations IS NULL OR highlight_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(highlight_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Expertise","de":"Expertise","fr":"Expertise","es":"Expertise"}'::jsonb
    ELSE highlight_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Thought leadership, industry perspectives, and actionable strategies from our team of strategists, designers, and engineers.","de":"Thought Leadership, Branchenperspektiven und umsetzbare Strategien von unserem Team aus Strategen, Designern und Ingenieuren.","fr":"Leadership éclairé, perspectives sectorielles et stratégies concrètes de notre équipe de stratèges, designers et ingénieurs.","es":"Liderazgo de pensamiento, perspectivas de la industria y estrategias accionables de nuestro equipo de estrategas, diseñadores e ingenieros."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'insights';

-- =============================================================================
-- portfolio
-- =============================================================================

UPDATE public.section_settings
SET
  eyebrow_translations = CASE
    WHEN eyebrow_translations IS NULL OR eyebrow_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(eyebrow_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Portfolio","de":"Portfolio","fr":"Portfolio","es":"Portafolio"}'::jsonb
    ELSE eyebrow_translations END,
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Our","de":"Unsere","fr":"Nos","es":"Nuestros"}'::jsonb
    ELSE title_translations END,
  highlight_translations = CASE
    WHEN highlight_translations IS NULL OR highlight_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(highlight_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Work","de":"Arbeiten","fr":"Réalisations","es":"Proyectos"}'::jsonb
    ELSE highlight_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"We craft digital experiences that define industries and elevate brands through precision and creativity.","de":"Wir gestalten digitale Erlebnisse, die Branchen definieren und Marken durch Präzision und Kreativität aufwerten.","fr":"Nous créons des expériences numériques qui définissent les industries et élèvent les marques grâce à la précision et la créativité.","es":"Creamos experiencias digitales que definen industrias y elevan marcas a través de la precisión y la creatividad."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'portfolio';

-- =============================================================================
-- acquisition
-- =============================================================================

UPDATE public.section_settings
SET
  eyebrow_translations = CASE
    WHEN eyebrow_translations IS NULL OR eyebrow_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(eyebrow_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Acquisition","de":"Akquisition","fr":"Acquisition","es":"Adquisición"}'::jsonb
    ELSE eyebrow_translations END,
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Buy a","de":"Kaufen Sie ein","fr":"Achetez une","es":"Compre un"}'::jsonb
    ELSE title_translations END,
  highlight_translations = CASE
    WHEN highlight_translations IS NULL OR highlight_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(highlight_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Business","de":"Unternehmen","fr":"entreprise","es":"negocio"}'::jsonb
    ELSE highlight_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Skip the startup grind. Browse turnkey businesses with real revenue, existing customers, and systems already in place.","de":"Überspringen Sie den Startup-Marathon. Stöbern Sie durch schlüsselfertige Unternehmen mit echten Einnahmen, bestehenden Kunden und vorhandenen Systemen.","fr":"Sautez l''étape startup. Parcourez des entreprises clés en main avec un vrai chiffre d''affaires, des clients existants et des systèmes déjà en place.","es":"Omita la rutina de las startups. Explore negocios llave en mano con ingresos reales, clientes existentes y sistemas ya implementados."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'acquisition';

-- =============================================================================
-- testimonials
-- =============================================================================

UPDATE public.section_settings
SET
  eyebrow_translations = CASE
    WHEN eyebrow_translations IS NULL OR eyebrow_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(eyebrow_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Testimonials","de":"Referenzen","fr":"Témoignages","es":"Testimonios"}'::jsonb
    ELSE eyebrow_translations END,
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"What Our Clients","de":"Was unsere Kunden","fr":"Ce que disent nos clients","es":"Lo que dicen nuestros clientes"}'::jsonb
    ELSE title_translations END,
  highlight_translations = CASE
    WHEN highlight_translations IS NULL OR highlight_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(highlight_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Say","de":"sagen","fr":"","es":""}'::jsonb
    ELSE highlight_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Don''t take our word for it — hear from the brands we''ve helped scale.","de":"Verlassen Sie sich nicht nur auf unser Wort – hören Sie, was die Marken sagen, denen wir zum Wachstum verholfen haben.","fr":"Ne nous croyez pas sur parole – écoutez les marques que nous avons aidées à se développer.","es":"No confíe solo en nuestra palabra: escuche a las marcas que hemos ayudado a escalar."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'testimonials';

-- =============================================================================
-- pricing
-- =============================================================================

UPDATE public.section_settings
SET
  eyebrow_translations = CASE
    WHEN eyebrow_translations IS NULL OR eyebrow_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(eyebrow_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Pricing","de":"Preise","fr":"Tarifs","es":"Precios"}'::jsonb
    ELSE eyebrow_translations END,
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Service","de":"Service","fr":"Forfaits de","es":"Paquetes de"}'::jsonb
    ELSE title_translations END,
  highlight_translations = CASE
    WHEN highlight_translations IS NULL OR highlight_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(highlight_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Packages","de":"Pakete","fr":"services","es":"servicios"}'::jsonb
    ELSE highlight_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Transparent pricing for every stage of growth. Start where you are and scale with confidence.","de":"Transparente Preise für jede Wachstumsphase. Starten Sie dort, wo Sie sind, und skalieren Sie mit Zuversicht.","fr":"Des tarifs transparents pour chaque étape de croissance. Commencez là où vous êtes et développez-vous en confiance.","es":"Precios transparentes para cada etapa de crecimiento. Empiece donde está y escale con confianza."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'pricing';

-- =============================================================================
-- faq
-- =============================================================================

UPDATE public.section_settings
SET
  eyebrow_translations = CASE
    WHEN eyebrow_translations IS NULL OR eyebrow_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(eyebrow_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Support","de":"Support","fr":"Support","es":"Soporte"}'::jsonb
    ELSE eyebrow_translations END,
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Frequently Asked","de":"Häufig gestellte","fr":"Questions","es":"Preguntas"}'::jsonb
    ELSE title_translations END,
  highlight_translations = CASE
    WHEN highlight_translations IS NULL OR highlight_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(highlight_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Questions","de":"Fragen","fr":"fréquentes","es":"frecuentes"}'::jsonb
    ELSE highlight_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Clear answers to the most common questions we hear from clients.","de":"Klare Antworten auf die häufigsten Fragen, die wir von Kunden hören.","fr":"Des réponses claires aux questions les plus courantes que nous recevons de nos clients.","es":"Respuestas claras a las preguntas más comunes que recibimos de los clientes."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'faq';

-- =============================================================================
-- contact (supersedes 00044; kept idempotent)
-- =============================================================================

UPDATE public.section_settings
SET
  eyebrow_translations = CASE
    WHEN eyebrow_translations IS NULL OR eyebrow_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(eyebrow_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Contact","de":"Kontakt","fr":"Contact","es":"Contacto"}'::jsonb
    ELSE eyebrow_translations END,
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Let''s Talk","de":"Sprechen wir","fr":"Parlons-en","es":"Hablemos"}'::jsonb
    ELSE title_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Ready to start your project? Fill out the form and we''ll get back to you within 24 hours.","de":"Bereit, Ihr Projekt zu starten? Füllen Sie das Formular aus – wir melden uns innerhalb von 24 Stunden.","fr":"Prêt à lancer votre projet ? Remplissez le formulaire et nous vous répondrons sous 24 heures.","es":"¿Listo para empezar su proyecto? Complete el formulario y le responderemos en 24 horas."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'contact';

-- =============================================================================
-- acquisition-niches ("Explore by Niche")
-- =============================================================================

UPDATE public.section_settings
SET
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Explore by","de":"Stöbern nach","fr":"Explorer par","es":"Explorar por"}'::jsonb
    ELSE title_translations END,
  highlight_translations = CASE
    WHEN highlight_translations IS NULL OR highlight_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(highlight_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Niche","de":"Nische","fr":"Niche","es":"Nicho"}'::jsonb
    ELSE highlight_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Select a niche to see available businesses for acquisition.","de":"Wählen Sie eine Nische, um verfügbare Unternehmen zur Übernahme zu sehen.","fr":"Sélectionnez une niche pour voir les sociétés disponibles à l''acquisition.","es":"Selecciona un nicho para ver los negocios disponibles para adquisición."}'::jsonb
    ELSE description_translations END
WHERE section_key = 'acquisition-niches';

-- =============================================================================
-- acquisition-cta (closing call-to-action)
-- =============================================================================

UPDATE public.section_settings
SET
  title_translations = CASE
    WHEN title_translations IS NULL OR title_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Ready to Own a Business?","de":"Bereit, ein Unternehmen zu kaufen?","fr":"Prêt à posséder une entreprise ?","es":"¿Listo para ser dueño de un negocio?"}'::jsonb
    ELSE title_translations END,
  description_translations = CASE
    WHEN description_translations IS NULL OR description_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Our team will guide you through every step of the acquisition process — from due diligence to transition.","de":"Unser Team begleitet Sie durch jeden Schritt des Übernahmeprozesses — von der Due Diligence bis zum Übergang.","fr":"Notre équipe vous accompagne à chaque étape du processus d''acquisition — de la due diligence à la transition.","es":"Nuestro equipo te guiará en cada paso del proceso de adquisición: desde la debida diligencia hasta la transición."}'::jsonb
    ELSE description_translations END,
  cta_label_translations = CASE
    WHEN cta_label_translations IS NULL OR cta_label_translations = '{}'::jsonb OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(cta_label_translations) WHERE btrim(value) <> '')
    THEN '{"en":"Schedule a Consultation","de":"Beratung vereinbaren","fr":"Planifier une consultation","es":"Programar una consulta"}'::jsonb
    ELSE cta_label_translations END
WHERE section_key = 'acquisition-cta';

-- =============================================================================
-- Rollback
-- =============================================================================
-- No destructive change is made (only empty translations are replaced), so no
-- rollback is required.
