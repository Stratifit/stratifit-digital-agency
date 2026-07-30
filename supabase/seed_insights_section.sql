-- ============================================================================
-- Stratifit Digital Agency — Insights Section Seed
-- Inserts the default Insights section and its 4 insight cards.
-- Idempotent: safe to run multiple times.
-- ============================================================================

insert into insights_section (
    id,
    display_order,
    subtitle_translations,
    title_translations,
    description_translations,
    view_all_url,
    view_all_label_translations,
    read_more_label_translations
)
values (
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    4,
    '{
        "en": "Knowledge",
        "fr": "Connaissances",
        "de": "Wissen",
        "es": "Conocimiento"
    }'::jsonb,
    '{
        "en": "Insights & Expertise",
        "fr": "Perspectives & Expertise",
        "de": "Einblicke & Expertise",
        "es": "Perspectivas y Experiencia"
    }'::jsonb,
    '{
        "en": "Thought leadership and industry perspectives from our team of strategists and engineers.",
        "fr": "Réflexions et perspectives sectorielles de notre équipe de stratèges et d''ingénieurs.",
        "de": "Thought-Leadership und Branchenperspektiven von unserem Team aus Strategen und Ingenieuren.",
        "es": "Liderazgo intelectual y perspectivas sectoriales de nuestro equipo de estrategas e ingenieros."
    }'::jsonb,
    '/insights',
    '{
        "en": "View All Insights",
        "fr": "Voir Tous les Articles",
        "de": "Alle Einblicke Anzeigen",
        "es": "Ver Todas las Perspectivas"
    }'::jsonb,
    '{
        "en": "Read Insight",
        "fr": "Lire l''Article",
        "de": "Einblick Lesen",
        "es": "Leer Perspectiva"
    }'::jsonb
)
on conflict (id) do update set
    display_order = excluded.display_order,
    subtitle_translations = excluded.subtitle_translations,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    view_all_url = excluded.view_all_url,
    view_all_label_translations = excluded.view_all_label_translations,
    read_more_label_translations = excluded.read_more_label_translations;

-- Insight 1: Strategy
insert into insight_cards (
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
    'f2b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&auto=format',
    'Strategy',
    '{"en":"The Future of Digital Scalability","fr":"L''Avenir de l''Évolutivité Numérique","de":"Die Zukunft der digitalen Skalierbarkeit","es":"El Futuro de la Escalabilidad Digital"}'::jsonb,
    '{"en":"How modern infrastructure enables startups to compete with enterprise incumbents from day one.","fr":"Comment l''infrastructure moderne permet aux startups de rivaliser avec les entreprises établies dès le premier jour.","de":"Wie moderne Infrastruktur Startups ermöglicht, von Tag eins mit etablierten Unternehmen zu konkurrieren.","es":"Cómo la infraestructura moderna permite a las startups competir con las empresas establecidas desde el primer día."}'::jsonb,
    '/insights/the-future-of-digital-scalability',
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

-- Insight 2: Design
insert into insight_cards (
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
    'f3b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=600&fit=crop&auto=format',
    'Design',
    '{"en":"Mastering Minimalist UX for Luxury Brands","fr":"Maîtriser l''UX Minimaliste pour les Marques de Luxe","de":"Minimalistisches UX-Meistern für Luxusmarken","es":"Dominando la UX Minimalista para Marcas de Lujo"}'::jsonb,
    '{"en":"Why simplicity drives premium perception and how to execute it flawlessly.","fr":"Pourquoi la simplicité favorise la perception premium et comment l''exécuter sans faille.","de":"Warum Einfachheit die Premium-Wahrnehmung fördert und wie man sie fehlerfrei umsetzt.","es":"Por qué la simplicidad impulsa la percepción premium y cómo ejecutarla a la perfección."}'::jsonb,
    '/insights/mastering-minimalist-ux-for-luxury-brands',
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

-- Insight 3: Tech
insert into insight_cards (
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
    'f4b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&auto=format',
    'Tech',
    '{"en":"How AI is Revolutionizing Custom Automation","fr":"Comment l''IA Révolutionne l''Automatisation Personnalisée","de":"Wie KI die maßgeschneiderte Automatisierung revolutioniert","es":"Cómo la IA está Revolucionando la Automatización Personalizada"}'::jsonb,
    '{"en":"Practical applications of AI that deliver immediate ROI for growing businesses.","fr":"Applications pratiques de l''IA qui génèrent un ROI immédiat pour les entreprises en croissance.","de":"Praktische KI-Anwendungen, die wachsenden Unternehmen sofortige ROI liefern.","es":"Aplicaciones prácticas de IA que brindan ROI inmediato a empresas en crecimiento."}'::jsonb,
    '/insights/how-ai-is-revolutionizing-custom-automation',
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

-- Insight 4: Growth
insert into insight_cards (
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
    'f5b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&auto=format',
    'Growth',
    '{"en":"Building Funnels That Convert at 3x Industry Average","fr":"Construire des Entonnoirs qui Convertissent 3x la Moyenne du Secteur","de":"Trichter bauen, die dreimal so gut konvertieren wie der Branchendurchschnitt","es":"Construyendo Embudos que Convierten al Triple que el Promedio de la Industria"}'::jsonb,
    '{"en":"The data-backed framework we use to design high-conversion marketing systems.","fr":"Le cadre basé sur les données que nous utilisons pour concevoir des systèmes marketing à forte conversion.","de":"Das datengestützte Framework, das wir verwenden, um hochkonvertierende Marketing-Systeme zu entwerfen.","es":"El marco basado en datos que usamos para diseñar sistemas de marketing de alta conversión."}'::jsonb,
    '/insights/building-funnels-that-convert-at-3x-industry-average',
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
