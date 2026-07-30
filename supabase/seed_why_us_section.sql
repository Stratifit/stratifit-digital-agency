-- ============================================================================
-- Stratifit Digital Agency — Why Us Section Seed
-- Inserts the default Why Us section and its 4 feature cards.
-- Idempotent: safe to run multiple times.
-- ============================================================================

insert into why_us_section (id, display_order, subtitle_translations, title_translations, description_translations)
values (
    'd1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    3,
    '{
        "en": "Why Us",
        "fr": "Pourquoi Nous",
        "de": "Warum Wir",
        "es": "Por Qué Nosotros"
    }'::jsonb,
    '{
        "en": "Not Just Another Agency",
        "fr": "Pas Juste Une Autre Agence",
        "de": "Nicht Nur Eine Andere Agentur",
        "es": "No Solo Otra Agencia"
    }'::jsonb,
    '{
        "en": "We build digital assets that drive valuation and market authority — not just websites.",
        "fr": "Nous créons des actifs numériques qui augmentent la valorisation et l''autorité du marché — pas seulement des sites web.",
        "de": "Wir entwickeln digitale Assets, die Bewertung und Marktautorität steigern – nicht nur Websites.",
        "es": "Creamos activos digitales que impulsan la valoración y la autoridad del mercado, no solo sitios web."
    }'::jsonb
)
on conflict (id) do update set
    display_order = excluded.display_order,
    subtitle_translations = excluded.subtitle_translations,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations;

-- Feature 1: Senior-only team
insert into why_us_features (
    id,
    parent_section,
    icon,
    title_translations,
    description_translations,
    stat,
    stat_label_translations,
    display_order,
    active
)
values (
    'e1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
    'd1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'shield',
    '{"en":"Senior-only team","fr":"Équipe senior","de":"Nur Senior-Team","es":"Equipo solo senior"}'::jsonb,
    '{"en":"Every person shipping work has 7+ years of production experience.","fr":"Chaque personne qui livre du travail a plus de 7 ans d''expérience en production.","de":"Jede Person, die Arbeit ausliefert, hat mehr als 7 Jahre Produktionserfahrung.","es":"Cada persona que entrega trabajo tiene más de 7 años de experiencia en producción."}'::jsonb,
    '50+',
    '{"en":"Shipped projects","fr":"Projets livrés","de":"Ausgelieferte Projekte","es":"Proyectos entregados"}'::jsonb,
    0,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    icon = excluded.icon,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    stat = excluded.stat,
    stat_label_translations = excluded.stat_label_translations,
    display_order = excluded.display_order,
    active = excluded.active;

-- Feature 2: Outcome-priced
insert into why_us_features (
    id,
    parent_section,
    icon,
    title_translations,
    description_translations,
    stat,
    stat_label_translations,
    display_order,
    active
)
values (
    'e2b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
    'd1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'shield',
    '{"en":"Outcome-priced","fr":"Prix basé sur les résultats","de":"Ergebnisbasierte Preisgestaltung","es":"Precios basados en resultados"}'::jsonb,
    '{"en":"We price on shipped value, not hours logged.","fr":"Nous facturons selon la valeur livrée, pas les heures facturées.","de":"Wir berechnen nach geliefertem Wert, nicht nach Stunden.","es":"Cobramos por el valor entregado, no por las horas registradas."}'::jsonb,
    '98%',
    '{"en":"Client retention","fr":"Rétention client","de":"Kundenbindung","es":"Retención de clientes"}'::jsonb,
    1,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    icon = excluded.icon,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    stat = excluded.stat,
    stat_label_translations = excluded.stat_label_translations,
    display_order = excluded.display_order,
    active = excluded.active;

-- Feature 3: Async-first
insert into why_us_features (
    id,
    parent_section,
    icon,
    title_translations,
    description_translations,
    stat,
    stat_label_translations,
    display_order,
    active
)
values (
    'e3b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
    'd1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'shield',
    '{"en":"Async-first","fr":"Async-first","de":"Async-First","es":"Async-first"}'::jsonb,
    '{"en":"Tight spec docs, recorded Looms, weekly demos — never a status meeting.","fr":"Documents de spécification précis, Looms enregistrés, démos hebdomadaires — jamais de réunion de statut.","de":"Präzise Spezifikationsdokumente, aufgezeichnete Looms, wöchentliche Demos – nie ein Statusmeeting.","es":"Documentos de especificaciones precisos, Looms grabados, demostraciones semanales, nunca una reunión de estado."}'::jsonb,
    '12',
    '{"en":"Years experience","fr":"Années d''expérience","de":"Jahre Erfahrung","es":"Años de experiencia"}'::jsonb,
    2,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    icon = excluded.icon,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    stat = excluded.stat,
    stat_label_translations = excluded.stat_label_translations,
    display_order = excluded.display_order,
    active = excluded.active;

-- Feature 4: Full-stack
insert into why_us_features (
    id,
    parent_section,
    icon,
    title_translations,
    description_translations,
    stat,
    stat_label_translations,
    display_order,
    active
)
values (
    'e4b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
    'd1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'shield',
    '{"en":"Full-stack","fr":"Full-stack","de":"Full-Stack","es":"Full-stack"}'::jsonb,
    '{"en":"Brand, engineering, and growth in one team.","fr":"Marque, ingénierie et croissance dans une seule équipe.","de":"Marke, Engineering und Wachstum in einem Team.","es":"Marca, ingeniería y crecimiento en un solo equipo."}'::jsonb,
    '40+',
    '{"en":"Country reach","fr":"Présence pays","de":"Länderreichweite","es":"Alcance país"}'::jsonb,
    3,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    icon = excluded.icon,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    stat = excluded.stat,
    stat_label_translations = excluded.stat_label_translations,
    display_order = excluded.display_order,
    active = excluded.active;
