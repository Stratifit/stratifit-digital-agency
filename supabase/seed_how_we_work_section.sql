-- ============================================================================
-- Stratifit Digital Agency — How We Work Section Seed
-- Inserts the default How We Work section and its 4 process steps.
-- Idempotent: safe to run multiple times.
-- ============================================================================

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
        "de": "Wie Wir Arbeiten",
        "es": "Cómo Trabajamos"
    }'::jsonb,
    '{
        "en": "A proven framework that takes you from idea to scale — predictably and efficiently.",
        "fr": "Un cadre éprouvé qui vous conduit de l''idée à l''échelle — de manière prévisible et efficace.",
        "de": "Ein bewährter Rahmen, der Sie von der Idee zur Skalierung führt — vorhersehbar und effizient.",
        "es": "Un marco probado que lo lleva de la idea a la escala — de manera predecible y eficiente."
    }'::jsonb
)
on conflict (id) do update set
    display_order = excluded.display_order,
    subtitle_translations = excluded.subtitle_translations,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations;

-- Step 1: Discovery
insert into how_we_work_steps (id, parent_section, step_number, icon, title_translations, description_translations, display_order)
values (
    'd0010000-0000-0000-0000-000000000001',
    'c1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    1,
    'discovery',
    '{"en":"Discovery","fr":"Découverte","de":"Entdeckung","es":"Descubrimiento"}'::jsonb,
    '{"en":"We dive deep into your business goals, audience, and challenges to build a rock-solid foundation for every decision.","fr":"Nous explorons en profondeur vos objectifs commerciaux, votre audience et vos défis pour bâtir une base solide pour chaque décision.","de":"Wir tief in Ihre Geschäftsziele, Zielgruppe und Herausforderungen ein, um ein solides Fundament für jede Entscheidung zu schaffen.","es":"Nos sumergimos en sus objetivos comerciales, audiencia y desafíos para construir una base sólida para cada decisión."}'::jsonb,
    0
);

-- Step 2: Strategy
insert into how_we_work_steps (id, parent_section, step_number, icon, title_translations, description_translations, display_order)
values (
    'd0010000-0000-0000-0000-000000000002',
    'c1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    2,
    'strategy',
    '{"en":"Strategy","fr":"Stratégie","de":"Strategie","es":"Estrategia"}'::jsonb,
    '{"en":"We design a comprehensive plan covering brand, web, AI, and growth — aligned with your revenue targets.","fr":"Nous concevons un plan complet couvrant la marque, le web, l''IA et la croissance — aligné sur vos objectifs de revenus.","de":"Wir entwickeln einen umfassenden Plan für Marke, Web, KI und Wachstum — abgestimmt auf Ihre Umsatzziele.","es":"Diseñamos un plan integral que cubre marca, web, IA y crecimiento — alineado con sus objetivos de ingresos."}'::jsonb,
    1
);

-- Step 3: Build
insert into how_we_work_steps (id, parent_section, step_number, icon, title_translations, description_translations, display_order)
values (
    'd0010000-0000-0000-0000-000000000003',
    'c1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    3,
    'build',
    '{"en":"Build","fr":"Construction","de":"Aufbau","es":"Construcción"}'::jsonb,
    '{"en":"Our team implements systems, websites, automations, and campaigns with precision engineering.","fr":"Notre équipe implémente des systèmes, des sites web, des automatisations et des campagnes avec une ingénierie de précision.","de":"Unser Team implementiert Systeme, Websites, Automatisierungen und Kampagnen mit präziser Engineering-Qualität.","es":"Nuestro equipo implementa sistemas, sitios web, automatizaciones y campañas con ingeniería de precisión."}'::jsonb,
    2
);

-- Step 4: Launch & Grow
insert into how_we_work_steps (id, parent_section, step_number, icon, title_translations, description_translations, display_order)
values (
    'd0010000-0000-0000-0000-000000000004',
    'c1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    4,
    'launch',
    '{"en":"Launch & Grow","fr":"Lancer & Croître","de":"Starten & Wachsen","es":"Lanzar & Crecer"}'::jsonb,
    '{"en":"We optimize, scale, and measure everything. Continuous improvement is built into our DNA.","fr":"Nous optimisons, mettons à l''échelle et mesurons tout. L''amélioration continue est inscrite dans notre ADN.","de":"Wir optimieren, skalieren und messen alles. Kontinuierliche Verbesserung ist in unserer DNA verankert.","es":"Optimizamos, escalamos y medimos todo. La mejora continua está en nuestro ADN."}'::jsonb,
    3
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    step_number = excluded.step_number,
    icon = excluded.icon,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    display_order = excluded.display_order;
