-- ============================================================================
-- Stratifit Digital Agency — Portfolio Section Seed
-- Inserts the default Portfolio / Our Work section and its project items.
-- Idempotent: safe to run multiple times.
-- ============================================================================

insert into portfolio_section (
    id,
    display_order,
    subtitle_translations,
    title_translations,
    description_translations,
    view_all_url,
    view_all_label_translations,
    view_case_study_label_translations,
    filters
)
values (
    '91b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    0,
    '{
        "en": "Portfolio",
        "fr": "Portfolio",
        "de": "Portfolio",
        "es": "Portafolio"
    }'::jsonb,
    '{
        "en": "Our Work",
        "fr": "Nos Réalisations",
        "de": "Unsere Arbeiten",
        "es": "Nuestro Trabajo"
    }'::jsonb,
    '{
        "en": "We craft digital experiences that define industries and elevate brands through precision and creativity.",
        "fr": "Nous créons des expériences numériques qui définissent les industries et élèvent les marques grâce à la précision et à la créativité.",
        "de": "Wir gestalten digitale Erlebnisse, die Branchen definieren und Marken durch Präzision und Kreativität aufwerten.",
        "es": "Creamos experiencias digitales que definen industrias y elevan marcas a través de la precisión y la creatividad."
    }'::jsonb,
    '/portfolio',
    '{
        "en": "View All Projects",
        "fr": "Voir Tous les Projets",
        "de": "Alle Projekte Ansehen",
        "es": "Ver Todos los Proyectos"
    }'::jsonb,
    '{
        "en": "View Case Study",
        "fr": "Voir l''Étude de Cas",
        "de": "Fallstudie Ansehen",
        "es": "Ver Estudio de Caso"
    }'::jsonb,
    '["All", "Brand Design", "Website Development", "AI & Automation", "Growth & Marketing"]'::jsonb
)
on conflict (id) do update set
    display_order = excluded.display_order,
    subtitle_translations = excluded.subtitle_translations,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    view_all_url = excluded.view_all_url,
    view_all_label_translations = excluded.view_all_label_translations,
    view_case_study_label_translations = excluded.view_case_study_label_translations,
    filters = excluded.filters;

-- Portfolio Item 1: Luxe Retail App (Brand Design)
insert into portfolio_items (
    id,
    parent_section,
    image_url,
    category,
    title_translations,
    description_translations,
    link_url,
    display_order,
    active
)
values (
    '92b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '91b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format',
    'Brand Design',
    '{
        "en": "Luxe Retail App",
        "fr": "App Luxe Retail",
        "de": "Luxe Retail App",
        "es": "App Luxe Retail"
    }'::jsonb,
    '{
        "en": "A seamless mobile shopping experience designed for the modern luxury consumer.",
        "fr": "Une expérience d''achat mobile fluide conçue pour le consommateur de luxe moderne.",
        "de": "Ein nahtloses mobiles Einkaufserlebnis, das für den modernen Luxuskonsumenten entwickelt wurde.",
        "es": "Una experiencia de compra móvil sin problemas diseñada para el consumidor moderno de lujo."
    }'::jsonb,
    '/portfolio/luxe-retail-app',
    0,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    image_url = excluded.image_url,
    category = excluded.category,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    link_url = excluded.link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Portfolio Item 2: Aura Cosmetics (Brand Design)
insert into portfolio_items (
    id,
    parent_section,
    image_url,
    category,
    title_translations,
    description_translations,
    link_url,
    display_order,
    active
)
values (
    '93b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '91b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=600&fit=crop&auto=format',
    'Brand Design',
    '{
        "en": "Aura Cosmetics",
        "fr": "Aura Cosmetics",
        "de": "Aura Cosmetics",
        "es": "Aura Cosmetics"
    }'::jsonb,
    '{
        "en": "Redefining natural beauty with a minimalist identity and sustainable packaging.",
        "fr": "Redéfinir la beauté naturelle avec une identité minimaliste et un emballage durable.",
        "de": "Neudefinition natürlicher Schönheit mit minimalistischer Identität und nachhaltiger Verpackung.",
        "es": "Redefiniendo la belleza natural con una identidad minimalista y empaques sostenibles."
    }'::jsonb,
    '/portfolio/aura-cosmetics',
    1,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    image_url = excluded.image_url,
    category = excluded.category,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    link_url = excluded.link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Portfolio Item 3: Zenith Bank Rebrand (Brand Design)
insert into portfolio_items (
    id,
    parent_section,
    image_url,
    category,
    title_translations,
    description_translations,
    link_url,
    display_order,
    active
)
values (
    '94b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '91b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop&auto=format',
    'Brand Design',
    '{
        "en": "Zenith Bank Rebrand",
        "fr": "Rebranding Zenith Bank",
        "de": "Zenith Bank Rebrand",
        "es": "Rebranding de Zenith Bank"
    }'::jsonb,
    '{
        "en": "Modernizing heritage banking for the digital age with a refreshed visual language.",
        "fr": "Moderniser la banque traditionnelle pour l''ère numérique avec un langage visuel rafraîchi.",
        "de": "Modernisierung traditioneller Banken für das digitale Zeitalter mit einer erfrischten visuellen Sprache.",
        "es": "Modernizando la banca tradicional para la era digital con un lenguaje visual renovado."
    }'::jsonb,
    '/portfolio/zenith-bank-rebrand',
    2,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    image_url = excluded.image_url,
    category = excluded.category,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    link_url = excluded.link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Portfolio Item 4: Nova Fintech Platform (Website Development)
insert into portfolio_items (
    id,
    parent_section,
    image_url,
    category,
    title_translations,
    description_translations,
    link_url,
    display_order,
    active
)
values (
    '95b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '91b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&auto=format',
    'Website Development',
    '{
        "en": "Nova Fintech Platform",
        "fr": "Plateforme Fintech Nova",
        "de": "Nova Fintech Plattform",
        "es": "Plataforma Fintech Nova"
    }'::jsonb,
    '{
        "en": "A blazing-fast fintech dashboard built with Next.js and real-time data.",
        "fr": "Un tableau de bord fintech ultra-rapide construit avec Next.js et des données en temps réel.",
        "de": "Ein blitzschnelles Fintech-Dashboard, das mit Next.js und Echtzeitdaten gebaut wurde.",
        "es": "Un panel fintech ultrarrápido construido con Next.js y datos en tiempo real."
    }'::jsonb,
    '/portfolio/nova-fintech-platform',
    3,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    image_url = excluded.image_url,
    category = excluded.category,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    link_url = excluded.link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Portfolio Item 5: Atlas E-commerce (Website Development)
insert into portfolio_items (
    id,
    parent_section,
    image_url,
    category,
    title_translations,
    description_translations,
    link_url,
    display_order,
    active
)
values (
    '96b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '91b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format',
    'Website Development',
    '{
        "en": "Atlas E-commerce",
        "fr": "E-commerce Atlas",
        "de": "Atlas E-commerce",
        "es": "E-commerce Atlas"
    }'::jsonb,
    '{
        "en": "Headless commerce solution that scaled from 100 to 100,000 daily orders.",
        "fr": "Solution de commerce headless qui est passée de 100 à 100 000 commandes quotidiennes.",
        "de": "Headless-Commerce-Lösung, die von 100 auf 100.000 Bestellungen pro Tag skalierte.",
        "es": "Solución de comercio headless que escaló de 100 a 100,000 pedidos diarios."
    }'::jsonb,
    '/portfolio/atlas-e-commerce',
    4,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    image_url = excluded.image_url,
    category = excluded.category,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    link_url = excluded.link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Portfolio Item 6: SmartFlow AI Pipeline (AI & Automation)
insert into portfolio_items (
    id,
    parent_section,
    image_url,
    category,
    title_translations,
    description_translations,
    link_url,
    display_order,
    active
)
values (
    '97b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '91b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&auto=format',
    'AI & Automation',
    '{
        "en": "SmartFlow AI Pipeline",
        "fr": "Pipeline IA SmartFlow",
        "de": "SmartFlow AI Pipeline",
        "es": "Pipeline de IA SmartFlow"
    }'::jsonb,
    '{
        "en": "End-to-end lead qualification system that reduced manual work by 85%.",
        "fr": "Système de qualification de leads de bout en bout qui a réduit le travail manuel de 85%.",
        "de": "End-to-End-Lead-Qualifizierungssystem, das manuelle Arbeit um 85% reduzierte.",
        "es": "Sistema de calificación de leads de extremo a extremo que redujo el trabajo manual en un 85%."
    }'::jsonb,
    '/portfolio/smartflow-ai-pipeline',
    5,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    image_url = excluded.image_url,
    category = excluded.category,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    link_url = excluded.link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Portfolio Item 7: GrowthStack Campaign (Growth & Marketing)
insert into portfolio_items (
    id,
    parent_section,
    image_url,
    category,
    title_translations,
    description_translations,
    link_url,
    display_order,
    active
)
values (
    '98b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '91b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&auto=format',
    'Growth & Marketing',
    '{
        "en": "GrowthStack Campaign",
        "fr": "Campagne GrowthStack",
        "de": "GrowthStack Kampagne",
        "es": "Campaña GrowthStack"
    }'::jsonb,
    '{
        "en": "Multi-channel campaign generating 340% ROAS across Meta, Google, and TikTok.",
        "fr": "Campagne multicanal générant 340% de ROAS sur Meta, Google et TikTok.",
        "de": "Multichannel-Kampagne mit 340% ROAS über Meta, Google und TikTok.",
        "es": "Campaña multicanal que generó un ROAS del 340% en Meta, Google y TikTok."
    }'::jsonb,
    '/portfolio/growthstack-campaign',
    6,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    image_url = excluded.image_url,
    category = excluded.category,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    link_url = excluded.link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Portfolio Item 8: Vertex SaaS Landing (Website Development)
insert into portfolio_items (
    id,
    parent_section,
    image_url,
    category,
    title_translations,
    description_translations,
    link_url,
    display_order,
    active
)
values (
    '99b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '91b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1467232004584-a241de8a7c0d?w=1200&h=600&fit=crop&auto=format',
    'Website Development',
    '{
        "en": "Vertex SaaS Landing",
        "fr": "Landing Vertex SaaS",
        "de": "Vertex SaaS Landing",
        "es": "Landing Vertex SaaS"
    }'::jsonb,
    '{
        "en": "Conversion-optimized landing page that achieved 12% demo request rate.",
        "fr": "Page d''atterrissage optimisée pour la conversion qui a atteint un taux de demande de démo de 12%.",
        "de": "Konversionsoptimierte Landing Page mit einer Demo-Anforderungsrate von 12%.",
        "es": "Página de aterrizaje optimizada para la conversión que logró una tasa de solicitud de demo del 12%."
    }'::jsonb,
    '/portfolio/vertex-saas-landing',
    7,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    image_url = excluded.image_url,
    category = excluded.category,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    link_url = excluded.link_url,
    display_order = excluded.display_order,
    active = excluded.active;
