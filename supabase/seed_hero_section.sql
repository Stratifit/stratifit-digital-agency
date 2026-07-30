-- ============================================================================
-- Stratifit Digital Agency — Hero Section Seed
-- ============================================================================

insert into hero_section (
    id,
    display_order,
    sticky,
    subtitle_translations,
    title_translations,
    title_highlight_translations,
    description_translations,
    ctas,
    trust_badges,
    tech_stack,
    url
) values (
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
)
on conflict (id) do update set
    display_order = excluded.display_order,
    sticky = excluded.sticky,
    subtitle_translations = excluded.subtitle_translations,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    ctas = excluded.ctas,
    trust_badges = excluded.trust_badges,
    tech_stack = excluded.tech_stack,
    url = excluded.url;
