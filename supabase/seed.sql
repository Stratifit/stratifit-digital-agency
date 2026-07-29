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
, hero_section as (
    insert into sections (id, page_id, component_type, display_order, payload)
    select
        gen_random_uuid(),
        home_page.id,
        'HeroSection',
        0,
        '{
            "heading":       "We Build Digital Experiences",
            "subheading":    "Stratifit helps brands scale with modern design and engineering.",
            "cta_primary":   { "text": "Get Started", "href": "/contact" },
            "cta_secondary": { "text": "Our Work",    "href": "/work" },
            "background_image": null
        }'::jsonb
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
-- 2c. Services Section
, services_section as (
    insert into sections (id, page_id, component_type, display_order, payload)
    select
        gen_random_uuid(),
        home_page.id,
        'ServicesSection',
        1,
        '{
            "heading":    "What We Do",
            "description": "Full-service capabilities to take your product from concept to scale."
        }'::jsonb
    from home_page
    returning id
)
-- 2d. Stats Section
, stats_section as (
    insert into sections (id, page_id, component_type, display_order, payload)
    select
        gen_random_uuid(),
        home_page.id,
        'StatsSection',
        2,
        '{
            "heading": "By the Numbers"
        }'::jsonb
    from home_page
    returning id
)
-- 2e. Testimonials Section
, testimonials_section as (
    insert into sections (id, page_id, component_type, display_order, payload)
    select
        gen_random_uuid(),
        home_page.id,
        'TestimonialsSection',
        3,
        '{
            "heading":    "Client Stories",
            "description": "Hear from the teams we have partnered with."
        }'::jsonb
    from home_page
    returning id
)
-- 2f. CTA Section
, cta_section as (
    insert into sections (id, page_id, component_type, display_order, payload)
    select
        gen_random_uuid(),
        home_page.id,
        'CtaSection',
        4,
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
-- Services blocks
, service_block_1 as (
    insert into content_blocks (id, section_id, block_type, display_order, payload)
    select
        gen_random_uuid(),
        services_section.id,
        'service',
        0,
        '{
            "title":       "Web Development",
            "description": "Scalable, performant web applications using modern frameworks.",
            "icon":        "code"
        }'::jsonb
    from services_section
    returning id
)
, service_block_2 as (
    insert into content_blocks (id, section_id, block_type, display_order, payload)
    select
        gen_random_uuid(),
        services_section.id,
        'service',
        1,
        '{
            "title":       "UI / UX Design",
            "description": "Human-centered design that delights users and drives conversion.",
            "icon":        "palette"
        }'::jsonb
    from services_section
    returning id
)
, service_block_3 as (
    insert into content_blocks (id, section_id, block_type, display_order, payload)
    select
        gen_random_uuid(),
        services_section.id,
        'service',
        2,
        '{
            "title":       "Brand Strategy",
            "description": "Positioning, messaging, and visual identity for modern brands.",
            "icon":        "strategy"
        }'::jsonb
    from services_section
    returning id
)
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
, section_ids (hero_id, services_id, stats_id, testimonials_id, cta_id) as (
    select
        (select id from hero_section),
        (select id from services_section),
        (select id from stats_section),
        (select id from testimonials_section),
        (select id from cta_section)
)
, block_ids_services (s1_id, s2_id, s3_id) as (
    select
        (select id from service_block_1),
        (select id from service_block_2),
        (select id from service_block_3)
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

    -- Services section
    ('section', (select services_id from section_ids), 'fr', 'payload.heading',    'Notre Expertise'),
    ('section', (select services_id from section_ids), 'fr', 'payload.description', 'Des services complets pour propulser votre produit du concept à l''échelle.'),

    -- Service blocks
    ('content_block', (select s1_id from block_ids_services), 'fr', 'payload.title',       'Développement Web'),
    ('content_block', (select s1_id from block_ids_services), 'fr', 'payload.description', 'Applications web performantes et évolutives avec les frameworks modernes.'),
    ('content_block', (select s2_id from block_ids_services), 'fr', 'payload.title',       'Design UI / UX'),
    ('content_block', (select s2_id from block_ids_services), 'fr', 'payload.description', 'Un design centré sur l''humain qui séduit les utilisateurs et booste les conversions.'),
    ('content_block', (select s3_id from block_ids_services), 'fr', 'payload.title',       'Stratégie de Marque'),
    ('content_block', (select s3_id from block_ids_services), 'fr', 'payload.description', 'Positionnement, message et identité visuelle pour les marques modernes.'),

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

    -- Services section
    ('section', (select services_id from section_ids), 'de', 'payload.heading',    'Unser Angebot'),
    ('section', (select services_id from section_ids), 'de', 'payload.description', 'Komplettdienstleistungen, um Ihr Produkt vom Konzept zur Skalierung zu bringen.'),

    -- Service blocks
    ('content_block', (select s1_id from block_ids_services), 'de', 'payload.title',       'Webentwicklung'),
    ('content_block', (select s1_id from block_ids_services), 'de', 'payload.description', 'Skalierbare, leistungsstarke Webanwendungen mit modernen Frameworks.'),
    ('content_block', (select s2_id from block_ids_services), 'de', 'payload.title',       'UI / UX Design'),
    ('content_block', (select s2_id from block_ids_services), 'de', 'payload.description', 'Menschzentriertes Design, das begeistert und Konversionen steigert.'),
    ('content_block', (select s3_id from block_ids_services), 'de', 'payload.title',       'Markenstrategie'),
    ('content_block', (select s3_id from block_ids_services), 'de', 'payload.description', 'Positionierung, Botschaften und visuelle Identität für moderne Marken.'),

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

    -- Services section
    ('section', (select services_id from section_ids), 'es', 'payload.heading',    'Nuestros Servicios'),
    ('section', (select services_id from section_ids), 'es', 'payload.description', 'Capacidades integrales para llevar tu producto del concepto a la escala.'),

    -- Service blocks
    ('content_block', (select s1_id from block_ids_services), 'es', 'payload.title',       'Desarrollo Web'),
    ('content_block', (select s1_id from block_ids_services), 'es', 'payload.description', 'Aplicaciones web escalables y de alto rendimiento usando frameworks modernos.'),
    ('content_block', (select s2_id from block_ids_services), 'es', 'payload.title',       'Diseño UI / UX'),
    ('content_block', (select s2_id from block_ids_services), 'es', 'payload.description', 'Diseño centrado en el ser humano que deleita a los usuarios e impulsa la conversión.'),
    ('content_block', (select s3_id from block_ids_services), 'es', 'payload.title',       'Estrategia de Marca'),
    ('content_block', (select s3_id from block_ids_services), 'es', 'payload.description', 'Posicionamiento, mensajes e identidad visual para marcas modernas.'),

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
