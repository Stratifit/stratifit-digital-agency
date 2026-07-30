-- ============================================================================
-- Stratifit Digital Agency — Seed Data
-- Demonstrates fully dynamic CMS-driven home page with multilingual support.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 0. Settings
-- --------------------------------------------------------------------------
insert into settings (id, site_name, primary_language, available_languages, social_links)
values (
    gen_random_uuid(),
    'Stratifit Digital Agency',
    'en',
    array['en', 'fr', 'de', 'es'],
    '{
        "linkedin": "https://linkedin.com/company/stratifit",
        "twitter":   "https://twitter.com/stratifit",
        "github":    "https://github.com/stratifit"
    }'::jsonb
);

-- --------------------------------------------------------------------------
-- 1. Home Page (English base)
-- --------------------------------------------------------------------------
with home_page as (
    insert into pages (id, slug, title, language, meta_title, meta_description, published)
    values (
        gen_random_uuid(),
        'home',
        'Home',
        'en',
        'Stratifit — Digital Agency for Modern Brands',
        'Stratifit helps brands scale with modern design, engineering, and strategy.',
        true
    )
    returning id
)
-- --------------------------------------------------------------------------
-- 2. Sections (ordered by display_order)
-- --------------------------------------------------------------------------
-- 2a. Hero Section
-- The hero content lives in the dedicated hero_section table.
-- The generic sections row only points to it via heroSectionId.
, hero_content as (
    insert into hero_section (
        id,        display_order, sticky,
        subtitle_translations, title_translations, title_highlight_translations, description_translations,
        ctas, trust_badges, tech_stack, url
    )
    select
        'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        0,
        false,
        '{
            "en": "Premium Digital Agency",
            "fr": "Agence Digitale Premium",
            "de": "Premium Digitalagentur",
            "es": "Agencia Digital Premium"
        }'::jsonb,
        '{
            "en": "We Build Websites, Brands & Systems",
            "fr": "Nous Construisons des Sites Web, des Marques & des Systèmes",
            "de": "Wir Bauen Websites, Marken & Systeme",
            "es": "Construimos Sitios Web, Marcas y Sistemas"
        }'::jsonb,
        '{
            "en": "That Grow Businesses.",
            "fr": "qui Fait Croître les Entreprises.",
            "de": "die Unternehmen Wachsen Lassen.",
            "es": "que Hacen Crecer los Negocios."
        }'::jsonb,
        '{
            "en": "We help startups and growing businesses build websites, brands, and AI-powered systems that turn visitors into customers.",
            "fr": "Nous aidons les startups et les entreprises en croissance à construire des sites web, des marques et des systèmes alimentés par l''IA qui transforment les visiteurs en clients.",
            "de": "Wir helfen Startups und wachsenden Unternehmen, Websites, Marken und KI-gestützte Systeme zu entwickeln, die Besucher in Kunden verwandeln.",
            "es": "Ayudamos a startups y empresas en crecimiento a crear sitios web, marcas y sistemas impulsados por IA que convierten visitantes en clientes."
        }'::jsonb,
        '[
            {
                "id": "primary",
                "labelTranslations": {
                    "en": "Start Your Project",
                    "fr": "Démarrez Votre Projet",
                    "de": "Starten Sie Ihr Projekt",
                    "es": "Inicia Tu Proyecto"
                },
                "href": "/contact",
                "variant": "primary"
            },
            {
                "id": "secondary",
                "labelTranslations": {
                    "en": "Book a Strategy Call",
                    "fr": "Réserver un Appel Stratégique",
                    "de": "Strategiegespräch Buchen",
                    "es": "Reserva una Llamada Estratégica"
                },
                "href": "/strategy-call",
                "variant": "secondary"
            }
        ]'::jsonb,
        '[
            {
                "id": "projects",
                "value": "59+",
                "labelTranslations": {
                    "en": "Projects Delivered",
                    "fr": "Projets Livrés",
                    "de": "Projekte Geliefert",
                    "es": "Proyectos Entregados"
                }
            },
            {
                "id": "experience",
                "value": "7+",
                "labelTranslations": {
                    "en": "Years Experience",
                    "fr": "Années d''Expérience",
                    "de": "Jahre Erfahrung",
                    "es": "Años de Experiencia"
                }
            },
            {
                "id": "satisfaction",
                "value": "98%",
                "labelTranslations": {
                    "en": "Client Satisfaction",
                    "fr": "Satisfaction Client",
                    "de": "Kundenzufriedenheit",
                    "es": "Satisfacción del Cliente"
                }
            }
        ]'::jsonb,
        '{
            "titleTranslations": {
                "en": "Our Tech Stack",
                "fr": "Notre Stack Technologique",
                "de": "Unser Tech Stack",
                "es": "Nuestro Stack Tecnológico"
            },
            "descriptionTranslations": {
                "en": "We build with trusted, modern technologies.",
                "fr": "Nous construisons avec des technologies modernes et fiables.",
                "de": "Wir bauen mit vertrauenswürdigen, modernen Technologien.",
                "es": "Construimos con tecnologías modernas y confiables."
            },
            "items": [
                { "name": "Tailwind CSS", "iconId": "brush" },
                { "name": "Framer Motion", "iconId": "zap" },
                { "name": "GSAP", "iconId": "zap" },
                { "name": "Next.js", "iconId": "code" },
                { "name": "React", "iconId": "atom" },
                { "name": "TypeScript", "iconId": "code" }
            ]
        }'::jsonb,
        ''
    from home_page
    returning id
)
, hero_section as (
    insert into sections (id, page_id, component_type, display_order, payload)
    select
        gen_random_uuid(),
        home_page.id,
        'HeroSection',
        0,
        '{"heroSectionId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"}'::jsonb
    from home_page
    returning id
)
-- 2b. Announcement Bar Section (renders before hero at position -1)
, announcement_bar_section as (
    insert into sections (id, page_id, component_type, display_order, payload)
    select
        gen_random_uuid(),
        home_page.id,
        'AnnouncementBarSection',
        -1,
        '{
            "autoSlideInterval": 5000
        }'::jsonb
    from home_page
    returning id
)
-- 2c. Services Section (dedicated table)
, services_section_data as (
    insert into services_section (id, display_order, subtitle_translations, title_translations, description_translations)
    values (
        'b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        0,
        '{
            "en": "Services",
            "fr": "Services",
            "de": "Services",
            "es": "Servicios"
        }'::jsonb,
        '{
            "en": "Our Services",
            "fr": "Nos Services",
            "de": "Unsere Leistungen",
            "es": "Nuestros Servicios"
        }'::jsonb,
        '{
            "en": "Websites, branding, and AI systems designed to help your business grow.",
            "fr": "Des sites web, du branding et des systèmes IA conçus pour faire croître votre entreprise.",
            "de": "Websites, Branding und KI-Systeme, die Ihr Unternehmen wachsen lassen.",
            "es": "Sitios web, branding y sistemas de IA diseñados para hacer crecer tu negocio."
        }'::jsonb
    )
    returning id
)
-- Service cards
, service_card_1 as (
    insert into service_cards (id, parent_section, icon, title_translations, description_translations, deliverables, url, display_order, active)
    values (
        gen_random_uuid(),
        (select id from services_section_data),
        'diamond',
        '{"en":"Brand Design","fr":"Design de Marque","de":"Markendesign","es":"Diseño de Marca"}'::jsonb,
        '{"en":"Crafting unique identities that resonate and leave a lasting impression on your market.","fr":"Création d''identités uniques qui résonnent et laissent une impression durable sur votre marché.","de":"Entwicklung einzigartiger Identitäten, die resonieren und einen bleibenden Eindruck auf Ihrem Markt hinterlassen.","es":"Creación de identidades únicas que resuenen y dejen una impresión duradera en su mercado."}'::jsonb,
        '[{"en":"Brand Strategy","fr":"Stratégie de Marque","de":"Markenstrategie","es":"Estrategia de Marca"},{"en":"Logo Design","fr":"Conception de Logo","de":"Logo-Design","es":"Diseño de Logo"},{"en":"Visual Identity","fr":"Identité Visuelle","de":"Visuelle Identität","es":"Identidad Visual"},{"en":"Brand Guidelines","fr":"Guide de Marque","de":"Markenrichtlinien","es":"Guías de Marca"}]'::jsonb,
        '/brand-design',
        0,
        true
    )
    returning id
)
, service_card_2 as (
    insert into service_cards (id, parent_section, icon, title_translations, description_translations, deliverables, url, display_order, active)
    values (
        gen_random_uuid(),
        (select id from services_section_data),
        'code',
        '{"en":"Website Development","fr":"Développement Web","de":"Webentwicklung","es":"Desarrollo Web"}'::jsonb,
        '{"en":"High-performance websites and web apps engineered for speed, scale, and conversion.","fr":"Des sites web et applications web performants conçus pour la vitesse, l''échelle et la conversion.","de":"Hochleistungsfähige Websites und Web-Apps, die für Geschwindigkeit, Skalierung und Konversion entwickelt wurden.","es":"Sitios web y aplicaciones web de alto rendimiento diseñados para la velocidad, la escala y la conversión."}'::jsonb,
        '[{"en":"Custom Websites","fr":"Sites Web Sur Mesure","de":"Individuelle Websites","es":"Sitios Web Personalizados"},{"en":"E-commerce","fr":"E-commerce","de":"E-Commerce","es":"Comercio Electrónico"},{"en":"Web Applications","fr":"Applications Web","de":"Webanwendungen","es":"Aplicaciones Web"},{"en":"CMS Integration","fr":"Intégration CMS","de":"CMS-Integration","es":"Integración CMS"}]'::jsonb,
        '/website-development',
        1,
        true
    )
    returning id
)
, service_card_3 as (
    insert into service_cards (id, parent_section, icon, title_translations, description_translations, deliverables, url, display_order, active)
    values (
        gen_random_uuid(),
        (select id from services_section_data),
        'smart_toy',
        '{"en":"AI & Automation","fr":"IA & Automatisation","de":"KI & Automatisierung","es":"IA y Automatización"}'::jsonb,
        '{"en":"Intelligent automation that streamlines operations, qualifies leads, and scales support 24/7.","fr":"Une automatisation intelligente qui rationalise les opérations, qualifie les leads et met à l''échelle le support 24/7.","de":"Intelligente Automatisierung, die Abläufe optimiert, Leads qualifiziert und den Support 24/7 skaliert.","es":"Automatización inteligente que optimiza operaciones, califica leads y escala el soporte 24/7."}'::jsonb,
        '[{"en":"AI Lead Qualification","fr":"Qualification de Leads IA","de":"KI-Lead-Qualifizierung","es":"Calificación de Leads con IA"},{"en":"AI Chatbots","fr":"Chatbots IA","de":"KI-Chatbots","es":"Chatbots de IA"},{"en":"Workflow Automation","fr":"Automatisation des Flux","de":"Workflow-Automatisierung","es":"Automatización de Flujos"},{"en":"Custom APIs","fr":"APIs Sur Mesure","de":"Individuelle APIs","es":"APIs Personalizadas"}]'::jsonb,
        '/ai-automation',
        2,
        true
    )
    returning id
)
, service_card_4 as (
    insert into service_cards (id, parent_section, icon, title_translations, description_translations, deliverables, url, display_order, active)
    values (
        gen_random_uuid(),
        (select id from services_section_data),
        'rocket_launch',
        '{"en":"Growth & Marketing","fr":"Croissance & Marketing","de":"Wachstum & Marketing","es":"Crecimiento y Marketing"}'::jsonb,
        '{"en":"Data-driven campaigns that amplify your brand and drive measurable revenue growth.","fr":"Des campagnes basées sur les données qui amplifient votre marque et génèrent une croissance des revenus mesurable.","de":"Datengesteuerte Kampagnen, die Ihre Marke verstärken und messbares Umsatzwachstum vorantreiben.","es":"Campañas basadas en datos que amplifican su marca e impulsan un crecimiento de ingresos medible."}'::jsonb,
        '[{"en":"Performance Marketing","fr":"Marketing de Performance","de":"Performance-Marketing","es":"Marketing de Rendimiento"},{"en":"SEO & SEM","fr":"SEO & SEM","de":"SEO & SEM","es":"SEO y SEM"},{"en":"Content Strategy","fr":"Stratégie de Contenu","de":"Content-Strategie","es":"Estrategia de Contenido"},{"en":"Social Media","fr":"Réseaux Sociaux","de":"Social Media","es":"Redes Sociales"}]'::jsonb,
        '/growth-marketing',
        3,
        true
    )
    returning id
)
-- 2d. How We Work Section
, how_we_work_section_data as (
    insert into how_we_work_section (id, display_order, subtitle_translations, title_translations, description_translations)
    values (
        'c1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        0,
        '{
            "en": "Process",
            "fr": "Processus",
            "de": "Prozess",
            "es": "Proceso"
        }'::jsonb,
        '{
            "en": "How We Work",
            "fr": "Comment Nous Travaillons",
            "de": "Wir Wir Arbeiten",
            "es": "Cómo Trabajamos"
        }'::jsonb,
        '{
            "en": "A proven framework that takes you from idea to scale — predictably and efficiently.",
            "fr": "Un cadre éprouvé qui vous conduit de l''idée à l''échelle — de manière prévisible et efficace.",
            "de": "Ein bewährter Rahmen, der Sie von der Idee zur Skalierung führt — vorhersehbar und effizient.",
            "es": "Un marco probado que lo lleva de la idea a la escala — de manera predecible y eficiente."
        }'::jsonb
    )
    returning id
)
, how_we_work_step_1 as (
    insert into how_we_work_steps (id, parent_section, step_number, icon, title_translations, description_translations, display_order)
    values (
        gen_random_uuid(),
        (select id from how_we_work_section_data),
        1,
        'discovery',
        '{"en":"Discovery","fr":"Découverte","de":"Entdeckung","es":"Descubrimiento"}'::jsonb,
        '{"en":"We dive deep into your business goals, audience, and challenges to build a rock-solid foundation for every decision.","fr":"Nous explorons en profondeur vos objectifs commerciaux, votre audience et vos défis pour bâtir une base solide pour chaque décision.","de":"Wir tief in Ihre Geschäftsziele, Zielgruppe und Herausforderungen ein, um ein solides Fundament für jede Entscheidung zu schaffen.","es":"Nos sumergimos en sus objetivos comerciales, audiencia y desafíos para construir una base sólida para cada decisión."}'::jsonb,
        0
    )
    returning id
)
, how_we_work_step_2 as (
    insert into how_we_work_steps (id, parent_section, step_number, icon, title_translations, description_translations, display_order)
    values (
        gen_random_uuid(),
        (select id from how_we_work_section_data),
        2,
        'strategy',
        '{"en":"Strategy","fr":"Stratégie","de":"Strategie","es":"Estrategia"}'::jsonb,
        '{"en":"We design a comprehensive plan covering brand, web, AI, and growth — aligned with your revenue targets.","fr":"Nous concevons un plan complet couvrant la marque, le web, l''IA et la croissance — aligné sur vos objectifs de revenus.","de":"Wir entwickeln einen umfassenden Plan für Marke, Web, KI und Wachstum — abgestimmt auf Ihre Umsatzziele.","es":"Diseñamos un plan integral que cubre marca, web, IA y crecimiento — alineado con sus objetivos de ingresos."}'::jsonb,
        1
    )
    returning id
)
, how_we_work_step_3 as (
    insert into how_we_work_steps (id, parent_section, step_number, icon, title_translations, description_translations, display_order)
    values (
        gen_random_uuid(),
        (select id from how_we_work_section_data),
        3,
        'build',
        '{"en":"Build","fr":"Construction","de":"Aufbau","es":"Construcción"}'::jsonb,
        '{"en":"Our team implements systems, websites, automations, and campaigns with precision engineering.","fr":"Notre équipe implémente des systèmes, des sites web, des automatisations et des campagnes avec une ingénierie de précision.","de":"Unser Team implementiert Systeme, Websites, Automatisierungen und Kampagnen mit präziser Engineering-Qualität.","es":"Nuestro equipo implementa sistemas, sitios web, automatizaciones y campañas con ingeniería de precisión."}'::jsonb,
        2
    )
    returning id
)
, how_we_work_step_4 as (
    insert into how_we_work_steps (id, parent_section, step_number, icon, title_translations, description_translations, display_order)
    values (
        gen_random_uuid(),
        (select id from how_we_work_section_data),
        4,
        'launch',
        '{"en":"Launch & Grow","fr":"Lancer & Croître","de":"Starten & Wachsen","es":"Lanzar & Crecer"}'::jsonb,
        '{"en":"We optimize, scale, and measure everything. Continuous improvement is built into our DNA.","fr":"Nous optimisons, mettons à l''échelle et mesurons tout. L''amélioration continue est inscrite dans notre ADN.","de":"Wir optimieren, skalieren und messen alles. Kontinuierliche Verbesserung ist in unserer DNA verankert.","es":"Optimizamos, escalamos y medimos todo. La mejora continua está en nuestro ADN."}'::jsonb,
        3
    )
    returning id
)
-- 2e. Stats Section
, stats_section as (
    insert into sections (id, page_id, component_type, display_order, payload)
    select
        gen_random_uuid(),
        home_page.id,
        'StatsSection',
        3,
        '{
            "heading": "By the Numbers"
        }'::jsonb
    from home_page
    returning id
)
-- 2f. Testimonials Section
, testimonials_section as (
    insert into sections (id, page_id, component_type, display_order, payload)
    select
        gen_random_uuid(),
        home_page.id,
        'TestimonialsSection',
        4,
        '{
            "heading":    "Client Stories",
            "description": "Hear from the teams we have partnered with."
        }'::jsonb
    from home_page
    returning id
)
-- 2g. CTA Section
, cta_section as (
    insert into sections (id, page_id, component_type, display_order, payload)
    select
        gen_random_uuid(),
        home_page.id,
        'CtaSection',
        5,
        '{
            "heading":    "Ready to Start?",
            "description": "Let''s build something great together.",
            "cta_text":   "Contact Us",
            "cta_href":   "/contact"
        }'::jsonb
    from home_page
    returning id
)
-- --------------------------------------------------------------------------
-- 3. Content Blocks
-- --------------------------------------------------------------------------
-- Stats blocks
, stat_block_1 as (
    insert into content_blocks (id, section_id, block_type, display_order, payload)
    select
        gen_random_uuid(),
        stats_section.id,
        'stat',
        0,
        '{
            "label": "Projects Delivered",
            "value": "150+"
        }'::jsonb
    from stats_section
    returning id
)
, stat_block_2 as (
    insert into content_blocks (id, section_id, block_type, display_order, payload)
    select
        gen_random_uuid(),
        stats_section.id,
        'stat',
        1,
        '{
            "label": "Happy Clients",
            "value": "98%"
        }'::jsonb
    from stats_section
    returning id
)
, stat_block_3 as (
    insert into content_blocks (id, section_id, block_type, display_order, payload)
    select
        gen_random_uuid(),
        stats_section.id,
        'stat',
        2,
        '{
            "label": "Team Members",
            "value": "40+"
        }'::jsonb
    from stats_section
    returning id
)
, stat_block_4 as (
    insert into content_blocks (id, section_id, block_type, display_order, payload)
    select
        gen_random_uuid(),
        stats_section.id,
        'stat',
        3,
        '{
            "label": "Years in Business",
            "value": "8"
        }'::jsonb
    from stats_section
    returning id
)
-- Testimonials blocks
, testimonial_block_1 as (
    insert into content_blocks (id, section_id, block_type, display_order, payload)
    select
        gen_random_uuid(),
        testimonials_section.id,
        'testimonial',
        0,
        '{
            "quote":      "Stratifit transformed our digital presence. The team is creative, responsive, and truly cares about the product.",
            "attribution": "Sarah Chen",
            "role":       "CTO, Lumina Health",
            "avatar_url": null
        }'::jsonb
    from testimonials_section
    returning id
)
, testimonial_block_2 as (
    insert into content_blocks (id, section_id, block_type, display_order, payload)
    select
        gen_random_uuid(),
        testimonials_section.id,
        'testimonial',
        1,
        '{
            "quote":      "Working with Stratifit was the best decision we made this year. They delivered ahead of schedule and exceeded expectations.",
            "attribution": "Marcus Rivera",
            "role":       "Founder, Orbit Commerce",
            "avatar_url": null
        }'::jsonb
    from testimonials_section
    returning id
)
, testimonial_block_3 as (
    insert into content_blocks (id, section_id, block_type, display_order, payload)
    select
        gen_random_uuid(),
        testimonials_section.id,
        'testimonial',
        2,
        '{
            "quote":      "Their design thinking and technical execution are world-class. We saw a 3x increase in engagement post-launch.",
            "attribution": "Elena Voss",
            "role":       "VP Product, Relay Financial",
            "avatar_url": null
        }'::jsonb
    from testimonials_section
    returning id
)
-- --------------------------------------------------------------------------
-- 4. Translations (fr, de, es)
-- --------------------------------------------------------------------------
-- We need the section and block IDs. Since they were generated above, we
-- reference them via the CTE output. For clarity, we insert translations
-- for each language in separate statements below.

-- We'll capture all section and block IDs into variables.
-- Use a second CTE chain to insert translations.
, section_ids (hero_id, stats_id, testimonials_id, cta_id) as (
    select
        (select id from hero_section),
        (select id from stats_section),
        (select id from testimonials_section),
        (select id from cta_section)
)

, block_ids_stats (st1_id, st2_id, st3_id, st4_id) as (
    select
        (select id from stat_block_1),
        (select id from stat_block_2),
        (select id from stat_block_3),
        (select id from stat_block_4)
)
, block_ids_testimonials (t1_id, t2_id, t3_id) as (
    select
        (select id from testimonial_block_1),
        (select id from testimonial_block_2),
        (select id from testimonial_block_3)
)
-- ========================
-- FRENCH TRANSLATIONS (fr)
-- ========================
, fr_translations as (
    insert into translations (entity_type, entity_id, language, field_path, translated_text) values

    -- Hero section
    ('section', (select hero_id from section_ids), 'fr', 'payload.heading',    'Nous créons des expériences numériques'),
    ('section', (select hero_id from section_ids), 'fr', 'payload.subheading', 'Stratifit aide les marques à se développer grâce au design et à la technologie.'),
    ('section', (select hero_id from section_ids), 'fr', 'payload.cta_primary.text', 'Commencer'),
    ('section', (select hero_id from section_ids), 'fr', 'payload.cta_secondary.text', 'Nos Réalisations'),

    -- Stats section
    ('section', (select stats_id from section_ids), 'fr', 'payload.heading', 'Chiffres Clés'),

    -- Testimonials section
    ('section', (select testimonials_id from section_ids), 'fr', 'payload.heading',    'Témoignages'),
    ('section', (select testimonials_id from section_ids), 'fr', 'payload.description', 'Découvrez ce que nos partenaires disent de nous.'),

    -- Testimonial blocks
    ('content_block', (select t1_id from block_ids_testimonials), 'fr', 'payload.quote',       'Stratifit a transformé notre présence numérique. Leur équipe est créative, réactive et véritablement investie dans le produit.'),
    ('content_block', (select t1_id from block_ids_testimonials), 'fr', 'payload.attribution', 'Sarah Chen'),
    ('content_block', (select t1_id from block_ids_testimonials), 'fr', 'payload.role',        'CTO, Lumina Health'),
    ('content_block', (select t2_id from block_ids_testimonials), 'fr', 'payload.quote',       'Travailler avec Stratifit a été la meilleure décision de l''année. Ils ont livré en avance et dépassé nos attentes.'),
    ('content_block', (select t2_id from block_ids_testimonials), 'fr', 'payload.attribution', 'Marcus Rivera'),
    ('content_block', (select t2_id from block_ids_testimonials), 'fr', 'payload.role',        'Fondateur, Orbit Commerce'),
    ('content_block', (select t3_id from block_ids_testimonials), 'fr', 'payload.quote',       'Leur réflexion design et leur exécution technique sont de classe mondiale. Nous avons constaté une multiplication par 3 de l''engagement après le lancement.'),
    ('content_block', (select t3_id from block_ids_testimonials), 'fr', 'payload.attribution', 'Elena Voss'),
    ('content_block', (select t3_id from block_ids_testimonials), 'fr', 'payload.role',        'VP Produit, Relay Financial'),

    -- CTA section
    ('section', (select cta_id from section_ids), 'fr', 'payload.heading',    'Prêt à démarrer ?'),
    ('section', (select cta_id from section_ids), 'fr', 'payload.description', 'Construisons ensemble quelque chose de grand.'),
    ('section', (select cta_id from section_ids), 'fr', 'payload.cta_text',   'Contactez-nous')
)
-- ========================
-- GERMAN TRANSLATIONS (de)
-- ========================
, de_translations as (
    insert into translations (entity_type, entity_id, language, field_path, translated_text) values

    -- Hero section
    ('section', (select hero_id from section_ids), 'de', 'payload.heading',    'Wir entwickeln digitale Erlebnisse'),
    ('section', (select hero_id from section_ids), 'de', 'payload.subheading', 'Stratifit hilft Marken mit modernem Design und Engineering zu wachsen.'),
    ('section', (select hero_id from section_ids), 'de', 'payload.cta_primary.text',   'Loslegen'),
    ('section', (select hero_id from section_ids), 'de', 'payload.cta_secondary.text', 'Unsere Arbeiten'),

    -- Stats section
    ('section', (select stats_id from section_ids), 'de', 'payload.heading', 'Zahlen & Fakten'),

    -- Testimonials section
    ('section', (select testimonials_id from section_ids), 'de', 'payload.heading',    'Stimmen unserer Kunden'),
    ('section', (select testimonials_id from section_ids), 'de', 'payload.description', 'Erfahren Sie, was unsere Partner über uns sagen.'),

    -- Testimonial blocks
    ('content_block', (select t1_id from block_ids_testimonials), 'de', 'payload.quote',       'Stratifit hat unsere digitale Präsenz transformiert. Das Team ist kreativ, reaktionsschnell und kümmert sich wirklich um das Produkt.'),
    ('content_block', (select t1_id from block_ids_testimonials), 'de', 'payload.attribution', 'Sarah Chen'),
    ('content_block', (select t1_id from block_ids_testimonials), 'de', 'payload.role',        'CTO, Lumina Health'),
    ('content_block', (select t2_id from block_ids_testimonials), 'de', 'payload.quote',       'Die Zusammenarbeit mit Stratifit war die beste Entscheidung dieses Jahres. Sie haben früher geliefert und unsere Erwartungen übertroffen.'),
    ('content_block', (select t2_id from block_ids_testimonials), 'de', 'payload.attribution', 'Marcus Rivera'),
    ('content_block', (select t2_id from block_ids_testimonials), 'de', 'payload.role',        'Gründer, Orbit Commerce'),
    ('content_block', (select t3_id from block_ids_testimonials), 'de', 'payload.quote',       'Ihr Design-Denken und ihre technische Umsetzung sind weltklasse. Nach dem Launch haben wir eine Verdreifachung des Engagements gesehen.'),
    ('content_block', (select t3_id from block_ids_testimonials), 'de', 'payload.attribution', 'Elena Voss'),
    ('content_block', (select t3_id from block_ids_testimonials), 'de', 'payload.role',        'VP Produkt, Relay Financial'),

    -- CTA section
    ('section', (select cta_id from section_ids), 'de', 'payload.heading',    'Bereit zu starten?'),
    ('section', (select cta_id from section_ids), 'de', 'payload.description', 'Lassen Sie uns gemeinsam etwas Großartiges aufbauen.'),
    ('section', (select cta_id from section_ids), 'de', 'payload.cta_text',   'Kontaktieren Sie uns')
)
-- ========================
-- SPANISH TRANSLATIONS (es)
-- ========================
, es_translations as (
    insert into translations (entity_type, entity_id, language, field_path, translated_text) values

    -- Hero section
    ('section', (select hero_id from section_ids), 'es', 'payload.heading',    'Creamos experiencias digitales'),
    ('section', (select hero_id from section_ids), 'es', 'payload.subheading', 'Stratifit ayuda a las marcas a escalar con diseño e ingeniería modernos.'),
    ('section', (select hero_id from section_ids), 'es', 'payload.cta_primary.text',   'Comenzar'),
    ('section', (select hero_id from section_ids), 'es', 'payload.cta_secondary.text', 'Nuestro Trabajo'),

    -- Stats section
    ('section', (select stats_id from section_ids), 'es', 'payload.heading', 'Números Clave'),

    -- Testimonials section
    ('section', (select testimonials_id from section_ids), 'es', 'payload.heading',    'Testimonios'),
    ('section', (select testimonials_id from section_ids), 'es', 'payload.description', 'Escucha lo que dicen nuestros socios sobre nosotros.'),

    -- Testimonial blocks
    ('content_block', (select t1_id from block_ids_testimonials), 'es', 'payload.quote',       'Stratifit transformó nuestra presencia digital. El equipo es creativo, receptivo y realmente se preocupa por el producto.'),
    ('content_block', (select t1_id from block_ids_testimonials), 'es', 'payload.attribution', 'Sarah Chen'),
    ('content_block', (select t1_id from block_ids_testimonials), 'es', 'payload.role',        'CTO, Lumina Health'),
    ('content_block', (select t2_id from block_ids_testimonials), 'es', 'payload.quote',       'Trabajar con Stratifit fue la mejor decisión que tomamos este año. Entregaron antes de lo previsto y superaron las expectativas.'),
    ('content_block', (select t2_id from block_ids_testimonials), 'es', 'payload.attribution', 'Marcus Rivera'),
    ('content_block', (select t2_id from block_ids_testimonials), 'es', 'payload.role',        'Fundador, Orbit Commerce'),
    ('content_block', (select t3_id from block_ids_testimonials), 'es', 'payload.quote',       'Su pensamiento de diseño y ejecución técnica son de clase mundial. Vimos un aumento de 3x en el compromiso después del lanzamiento.'),
    ('content_block', (select t3_id from block_ids_testimonials), 'es', 'payload.attribution', 'Elena Voss'),
    ('content_block', (select t3_id from block_ids_testimonials), 'es', 'payload.role',        'VP de Producto, Relay Financial'),

    -- CTA section
    ('section', (select cta_id from section_ids), 'es', 'payload.heading',    '¿Listo para empezar?'),
    ('section', (select cta_id from section_ids), 'es', 'payload.description', 'Construyamos algo grandioso juntos.'),
    ('section', (select cta_id from section_ids), 'es', 'payload.cta_text',   'Contáctenos')
)
) -- ============================================================================
-- 5. Announcement Slides
-- ============================================================================
, announcement_slides_seed as (
    insert into announcement_slides (display_order, sticky, url, message_translations) values
    (0, false, '/announcement/launch',
      jsonb_build_object(
        'en', '🚀 We just launched our new platform! Check it out.',
        'fr', '🚀 Nous venons de lancer notre nouvelle plateforme ! Découvrez-la.',
        'de', '🚀 Wir haben gerade unsere neue Plattform gestartet! Schauen Sie vorbei.',
        'es', '🚀 ¡Acabamos de lanzar nuestra nueva plataforma! Échale un vistazo.'
      )
    ),
    (1, false, '/announcement/webinar',
      jsonb_build_object(
        'en', '📅 Join our free webinar on digital transformation — March 15th.',
        'fr', '📅 Participez à notre webinaire gratuit sur la transformation numérique — 15 mars.',
        'de', '📅 Nehmen Sie an unserem kostenlosen Webinar zur digitalen Transformation teil — 15. März.',
        'es', '📅 Únase a nuestro seminario web gratuito sobre transformación digital — 15 de marzo.'
      )
    ),
    (2, false, '/announcement/hiring',
      jsonb_build_object(
        'en', '💼 We are hiring! Join the Stratifit team.',
        'fr', '💼 Nous recrutons ! Rejoignez l''équipe Stratifit.',
        'de', '💼 Wir stellen ein! Werden Sie Teil des Stratifit-Teams.',
        'es', '💼 ¡Estamos contratando! Únete al equipo de Stratifit.'
      )
    )
)
select 'Seed complete' as result;

-- ============================================================================
-- 6. Additional dedicated sections (Why Us, Insights) and homepage linkage
-- ============================================================================
-- These files use fixed UUIDs and ON CONFLICT DO UPDATE so they are safe
-- to run after the main seed above.
\ir seed_why_us_section.sql
\ir seed_insights_section.sql
\ir seed_portfolio_section.sql
\ir seed_acquisition_section.sql
\ir seed_testimonials_section.sql
\ir seed_home_sections_linkage.sql
