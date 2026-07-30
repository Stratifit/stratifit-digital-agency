-- ============================================================================
-- Stratifit Digital Agency — Services Section Seed
-- Inserts the default services section and its 4 service cards.
-- Idempotent: safe to run multiple times.
-- ============================================================================

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
on conflict (id) do update set
    display_order = excluded.display_order,
    subtitle_translations = excluded.subtitle_translations,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations;

-- Brand Design
insert into service_cards (id, parent_section, icon, title_translations, description_translations, deliverables, url, display_order, active)
values (
    'c0010000-0000-0000-0000-000000000001',
    'b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'diamond',
    '{"en":"Brand Design","fr":"Design de Marque","de":"Markendesign","es":"Diseño de Marca"}'::jsonb,
    '{"en":"Crafting unique identities that resonate and leave a lasting impression on your market.","fr":"Création d''identités uniques qui résonnent et laissent une impression durable sur votre marché.","de":"Entwicklung einzigartiger Identitäten, die resonieren und einen bleibenden Eindruck auf Ihrem Markt hinterlassen.","es":"Creación de identidades únicas que resuenen y dejen una impresión duradera en su mercado."}'::jsonb,
    '[{"en":"Brand Strategy","fr":"Stratégie de Marque","de":"Markenstrategie","es":"Estrategia de Marca"},{"en":"Logo Design","fr":"Conception de Logo","de":"Logo-Design","es":"Diseño de Logo"},{"en":"Visual Identity","fr":"Identité Visuelle","de":"Visuelle Identität","es":"Identidad Visual"},{"en":"Brand Guidelines","fr":"Guide de Marque","de":"Markenrichtlinien","es":"Guías de Marca"}]'::jsonb,
    '/brand-design',
    0,
    true
);

-- Website Development
insert into service_cards (id, parent_section, icon, title_translations, description_translations, deliverables, url, display_order, active)
values (
    'c0010000-0000-0000-0000-000000000002',
    'b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'code',
    '{"en":"Website Development","fr":"Développement Web","de":"Webentwicklung","es":"Desarrollo Web"}'::jsonb,
    '{"en":"High-performance websites and web apps engineered for speed, scale, and conversion.","fr":"Des sites web et applications web performants conçus pour la vitesse, l''échelle et la conversion.","de":"Hochleistungsfähige Websites und Web-Apps, die für Geschwindigkeit, Skalierung und Konversion entwickelt wurden.","es":"Sitios web y aplicaciones web de alto rendimiento diseñados para la velocidad, la escala y la conversión."}'::jsonb,
    '[{"en":"Custom Websites","fr":"Sites Web Sur Mesure","de":"Individuelle Websites","es":"Sitios Web Personalizados"},{"en":"E-commerce","fr":"E-commerce","de":"E-Commerce","es":"Comercio Electrónico"},{"en":"Web Applications","fr":"Applications Web","de":"Webanwendungen","es":"Aplicaciones Web"},{"en":"CMS Integration","fr":"Intégration CMS","de":"CMS-Integration","es":"Integración CMS"}]'::jsonb,
    '/website-development',
    1,
    true
);

-- AI & Automation
insert into service_cards (id, parent_section, icon, title_translations, description_translations, deliverables, url, display_order, active)
values (
    'c0010000-0000-0000-0000-000000000003',
    'b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'smart_toy',
    '{"en":"AI & Automation","fr":"IA & Automatisation","de":"KI & Automatisierung","es":"IA y Automatización"}'::jsonb,
    '{"en":"Intelligent automation that streamlines operations, qualifies leads, and scales support 24/7.","fr":"Une automatisation intelligente qui rationalise les opérations, qualifie les leads et met à l''échelle le support 24/7.","de":"Intelligente Automatisierung, die Abläufe optimiert, Leads qualifiziert und den Support 24/7 skaliert.","es":"Automatización inteligente que optimiza operaciones, califica leads y escala el soporte 24/7."}'::jsonb,
    '[{"en":"AI Lead Qualification","fr":"Qualification de Leads IA","de":"KI-Lead-Qualifizierung","es":"Calificación de Leads con IA"},{"en":"AI Chatbots","fr":"Chatbots IA","de":"KI-Chatbots","es":"Chatbots de IA"},{"en":"Workflow Automation","fr":"Automatisation des Flux","de":"Workflow-Automatisierung","es":"Automatización de Flujos"},{"en":"Custom APIs","fr":"APIs Sur Mesure","de":"Individuelle APIs","es":"APIs Personalizadas"}]'::jsonb,
    '/ai-automation',
    2,
    true
);

-- Growth & Marketing
insert into service_cards (id, parent_section, icon, title_translations, description_translations, deliverables, url, display_order, active)
values (
    'c0010000-0000-0000-0000-000000000004',
    'b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'rocket_launch',
    '{"en":"Growth & Marketing","fr":"Croissance & Marketing","de":"Wachstum & Marketing","es":"Crecimiento y Marketing"}'::jsonb,
    '{"en":"Data-driven campaigns that amplify your brand and drive measurable revenue growth.","fr":"Des campagnes basées sur les données qui amplifient votre marque et génèrent une croissance des revenus mesurable.","de":"Datengesteuerte Kampagnen, die Ihre Marke verstärken und messbares Umsatzwachstum vorantreiben.","es":"Campañas basadas en datos que amplifican su marca e impulsan un crecimiento de ingresos medible."}'::jsonb,
    '[{"en":"Performance Marketing","fr":"Marketing de Performance","de":"Performance-Marketing","es":"Marketing de Rendimiento"},{"en":"SEO & SEM","fr":"SEO & SEM","de":"SEO & SEM","es":"SEO y SEM"},{"en":"Content Strategy","fr":"Stratégie de Contenu","de":"Content-Strategie","es":"Estrategia de Contenido"},{"en":"Social Media","fr":"Réseaux Sociaux","de":"Social Media","es":"Redes Sociales"}]'::jsonb,
    '/growth-marketing',
    3,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    icon = excluded.icon,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    deliverables = excluded.deliverables,
    url = excluded.url,
    display_order = excluded.display_order,
    active = excluded.active;
