-- ============================================================================
-- Stratifit Digital Agency — Acquisition / Buy a Business Section Seed
-- Inserts the default acquisition section and sample business cards.
-- Idempotent: safe to run multiple times.
-- ============================================================================

insert into acquisition_section (
    id,
    display_order,
    subtitle_translations,
    title_translations,
    description_translations,
    view_all_url,
    view_all_label_translations,
    view_detail_label_translations,
    visit_site_label_translations,
    buy_business_label_translations,
    filters
)
values (
    '11b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    0,
    '{
        "en": "Acquisition",
        "fr": "Acquisition",
        "de": "Akquisition",
        "es": "Adquisición"
    }'::jsonb,
    '{
        "en": "Buy a Business",
        "fr": "Acheter une Entreprise",
        "de": "Ein Unternehmen Kaufen",
        "es": "Comprar un Negocio"
    }'::jsonb,
    '{
        "en": "Verified online businesses, SaaS, agencies, and local assets available for acquisition with secure escrow.",
        "fr": "Entreprises en ligne vérifiées, SaaS, agences et actifs locaux disponibles à l''acquisition avec escrow sécurisé.",
        "de": "Verifizierte Online-Unternehmen, SaaS, Agenturen und lokale Vermögenswerte stehen mit sicherer Treuhand zum Kauf bereit.",
        "es": "Negocios en línea verificados, SaaS, agencias y activos locales disponibles para adquisición con escrow seguro."
    }'::jsonb,
    '/buy-business',
    '{
        "en": "View All Businesses",
        "fr": "Voir Toutes les Entreprises",
        "de": "Alle Unternehmen Ansehen",
        "es": "Ver Todos los Negocios"
    }'::jsonb,
    '{
        "en": "View Full Detail",
        "fr": "Voir les Détails",
        "de": "Alle Details Ansehen",
        "es": "Ver Detalles Completos"
    }'::jsonb,
    '{
        "en": "Visit Site",
        "fr": "Visiter le Site",
        "de": "Seite Besuchen",
        "es": "Visitar Sitio"
    }'::jsonb,
    '{
        "en": "Buy Business",
        "fr": "Acheter l''Entreprise",
        "de": "Unternehmen Kaufen",
        "es": "Comprar Negocio"
    }'::jsonb,
    '["All", "Ecommerce", "SaaS", "Agency", "AI Tools", "Personal Brand", "Local Business", "Digital Products"]'::jsonb
)
on conflict (id) do update set
    display_order = excluded.display_order,
    subtitle_translations = excluded.subtitle_translations,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    view_all_url = excluded.view_all_url,
    view_all_label_translations = excluded.view_all_label_translations,
    view_detail_label_translations = excluded.view_detail_label_translations,
    visit_site_label_translations = excluded.visit_site_label_translations,
    buy_business_label_translations = excluded.buy_business_label_translations,
    filters = excluded.filters;

-- Card 1: Luxe Pet Co.
insert into acquisition_cards (
    id, parent_section, url, category, category_color, category_border_radius,
    nav_emoji, nav_title, bg_image_url, overlay_color, icon_radius, icon_border, icon_shadow,
    main_emoji, title_translations, description_translations, tags, grid_emojis,
    button_text_translations, trust_badges, price, link_url, visit_link_url,
    display_order, active
)
values (
    '12b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '11b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'luxepetco.com',
    'Ecommerce',
    'rgba(212, 165, 116, 0.19)',
    '9999px',
    '🐾',
    'Luxe Pet Co.',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format',
    'rgba(212, 165, 116, 0.25)',
    '9999px',
    'rgba(212, 165, 116, 0.314)',
    'rgba(212, 165, 116, 0.082) 0px 0px 25px',
    '🐾',
    '{"en":"Luxe Pet Co.","fr":"Luxe Pet Co.","de":"Luxe Pet Co.","es":"Luxe Pet Co."}'::jsonb,
    '{"en":"Premium pet accessories brand with 14 SKUs, 23K Instagram followers, and 4,200 email subscribers.","fr":"Marque d''accessoires pour animaux de compagnie premium avec 14 SKU, 23 000 abonnés Instagram et 4 200 abonnés email.","de":"Premium-Marke für Haustierzubehör mit 14 SKUs, 23.000 Instagram-Followern und 4.200 E-Mail-Abonnenten.","es":"Marca de accesorios para mascotas premium con 14 SKU, 23.000 seguidores en Instagram y 4.200 suscriptores de correo."}'::jsonb,
    '["Pet", "Shopify", "DTC"]'::jsonb,
    '["🛍️", "📦", "🏷️"]'::jsonb,
    '{"en":"Shop Now →","fr":"Acheter →","de":"Jetzt Kaufen →","es":"Comprar →"}'::jsonb,
    '["Verified Financials", "Secure Escrow", "30-Day Support"]'::jsonb,
    '$45,000',
    '/buy-business/niches/ecommerce/luxe-pet-co',
    'https://luxepetco.com',
    0,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    url = excluded.url,
    category = excluded.category,
    category_color = excluded.category_color,
    category_border_radius = excluded.category_border_radius,
    nav_emoji = excluded.nav_emoji,
    nav_title = excluded.nav_title,
    bg_image_url = excluded.bg_image_url,
    overlay_color = excluded.overlay_color,
    icon_radius = excluded.icon_radius,
    icon_border = excluded.icon_border,
    icon_shadow = excluded.icon_shadow,
    main_emoji = excluded.main_emoji,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    tags = excluded.tags,
    grid_emojis = excluded.grid_emojis,
    button_text_translations = excluded.button_text_translations,
    trust_badges = excluded.trust_badges,
    price = excluded.price,
    link_url = excluded.link_url,
    visit_link_url = excluded.visit_link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Card 2: ReviewPilot
insert into acquisition_cards (
    id, parent_section, url, category, category_color, category_border_radius,
    nav_emoji, nav_title, bg_image_url, overlay_color, icon_radius, icon_border, icon_shadow,
    main_emoji, title_translations, description_translations, tags, grid_emojis,
    button_text_translations, trust_badges, price, link_url, visit_link_url,
    display_order, active
)
values (
    '13b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '11b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'reviewpilot.io',
    'SaaS',
    'rgba(255, 217, 61, 0.19)',
    '9999px',
    '⭐',
    'ReviewPilot',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&auto=format',
    'rgba(255, 217, 61, 0.25)',
    '9999px',
    'rgba(255, 217, 61, 0.314)',
    'rgba(255, 217, 61, 0.082) 0px 0px 25px',
    '⭐',
    '{"en":"ReviewPilot","fr":"ReviewPilot","de":"ReviewPilot","es":"ReviewPilot"}'::jsonb,
    '{"en":"Automated review management platform serving 280+ Shopify merchants with 94% gross margins and <2% monthly churn.","fr":"Plateforme automatisée de gestion des avis desservant plus de 280 marchands Shopify avec une marge brute de 94% et un churn mensuel <2%.","de":"Automatisierte Review-Management-Plattform für über 280 Shopify-Händler mit 94% Bruttomarge und <2% monatlicher Abwanderung.","es":"Plataforma automatizada de gestión de reseñas que atiende a más de 280 comerciantes de Shopify con márgenes brutos del 94% y churn mensual <2%."}'::jsonb,
    '["Martech", "Shopify App", "B2B"]'::jsonb,
    '["📊", "⚙️", "🔌"]'::jsonb,
    '{"en":"Get Started →","fr":"Commencer →","de":"Starten →","es":"Empezar →"}'::jsonb,
    '["Code Audit Ready", "Secure Escrow", "60-Day Support"]'::jsonb,
    '$160,000',
    '/buy-business/niches/saas/reviewpilot',
    'https://reviewpilot.io',
    1,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    url = excluded.url,
    category = excluded.category,
    category_color = excluded.category_color,
    category_border_radius = excluded.category_border_radius,
    nav_emoji = excluded.nav_emoji,
    nav_title = excluded.nav_title,
    bg_image_url = excluded.bg_image_url,
    overlay_color = excluded.overlay_color,
    icon_radius = excluded.icon_radius,
    icon_border = excluded.icon_border,
    icon_shadow = excluded.icon_shadow,
    main_emoji = excluded.main_emoji,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    tags = excluded.tags,
    grid_emojis = excluded.grid_emojis,
    button_text_translations = excluded.button_text_translations,
    trust_badges = excluded.trust_badges,
    price = excluded.price,
    link_url = excluded.link_url,
    visit_link_url = excluded.visit_link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Card 3: Digital Hive Studio
insert into acquisition_cards (
    id, parent_section, url, category, category_color, category_border_radius,
    nav_emoji, nav_title, bg_image_url, overlay_color, icon_radius, icon_border, icon_shadow,
    main_emoji, title_translations, description_translations, tags, grid_emojis,
    button_text_translations, trust_badges, price, link_url, visit_link_url,
    display_order, active
)
values (
    '14b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '11b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'digitalhive.studio',
    'Agency',
    'rgba(248, 181, 0, 0.19)',
    '4px',
    '🐝',
    'Digital Hive Studio',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop&auto=format',
    'rgba(248, 181, 0, 0.25)',
    '4px',
    'rgba(248, 181, 0, 0.314)',
    'rgba(248, 181, 0, 0.082) 0px 0px 25px',
    '🐝',
    '{"en":"Digital Hive Studio","fr":"Digital Hive Studio","de":"Digital Hive Studio","es":"Digital Hive Studio"}'::jsonb,
    '{"en":"Full-service digital agency specializing in ecommerce brands. 12 retainer clients, 7 team members, and $370K ARR.","fr":"Agence digitale full-service spécialisée dans les marques ecommerce. 12 clients en rétainer, 7 membres d''équipe et 370 000 $ d''ARR.","de":"Full-Service-Digitalagentur mit Spezialisierung auf E-Commerce-Marken. 12 Retainer-Kunden, 7 Teammitglieder und 370.000 $ ARR.","es":"Agencia digital full-service especializada en marcas de ecommerce. 12 clientes retainer, 7 miembros del equipo y 370.000 $ ARR."}'::jsonb,
    '["Ecommerce", "Full-Service", "12 Clients"]'::jsonb,
    '["🎨", "📈", "💼"]'::jsonb,
    '{"en":"View Services →","fr":"Voir les Services →","de":"Services Ansehen →","es":"Ver Servicios →"}'::jsonb,
    '["Contracts Verified", "Secure Escrow", "90-Day Support"]'::jsonb,
    '$180,000',
    '/buy-business/niches/agency/digital-hive-studio',
    'https://digitalhive.studio',
    2,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    url = excluded.url,
    category = excluded.category,
    category_color = excluded.category_color,
    category_border_radius = excluded.category_border_radius,
    nav_emoji = excluded.nav_emoji,
    nav_title = excluded.nav_title,
    bg_image_url = excluded.bg_image_url,
    overlay_color = excluded.overlay_color,
    icon_radius = excluded.icon_radius,
    icon_border = excluded.icon_border,
    icon_shadow = excluded.icon_shadow,
    main_emoji = excluded.main_emoji,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    tags = excluded.tags,
    grid_emojis = excluded.grid_emojis,
    button_text_translations = excluded.button_text_translations,
    trust_badges = excluded.trust_badges,
    price = excluded.price,
    link_url = excluded.link_url,
    visit_link_url = excluded.visit_link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Card 4: ContentForge AI
insert into acquisition_cards (
    id, parent_section, url, category, category_color, category_border_radius,
    nav_emoji, nav_title, bg_image_url, overlay_color, icon_radius, icon_border, icon_shadow,
    main_emoji, title_translations, description_translations, tags, grid_emojis,
    button_text_translations, trust_badges, price, link_url, visit_link_url,
    display_order, active
)
values (
    '15b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '11b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'contentforge.ai',
    'AI Tools',
    'rgba(232, 67, 147, 0.19)',
    '9999px',
    '✍️',
    'ContentForge AI',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&auto=format',
    'rgba(232, 67, 147, 0.25)',
    '9999px',
    'rgba(232, 67, 147, 0.314)',
    'rgba(232, 67, 147, 0.082) 0px 0px 25px',
    '✍️',
    '{"en":"ContentForge AI","fr":"ContentForge AI","de":"ContentForge AI","es":"ContentForge AI"}'::jsonb,
    '{"en":"AI content creation platform serving 3,200+ marketers. Multi-model pipeline, custom fine-tuned models, strong organic growth.","fr":"Plateforme de création de contenu IA pour plus de 3 200 marketeurs. Pipeline multi-modèles, modèles fine-tuned et croissance organique forte.","de":"KI-Content-Erstellungsplattform für über 3.200 Marketer. Multi-Model-Pipeline, individualisierte Fine-Tuned-Modelle und starkes organisches Wachstum.","es":"Plataforma de creación de contenido con IA para más de 3.200 marketers. Pipeline multimodelo, modelos fine-tuned y fuerte crecimiento orgánico."}'::jsonb,
    '["Content Gen", "B2B", "Subscription"]'::jsonb,
    '["🤖", "🧠", "✨"]'::jsonb,
    '{"en":"Try Demo →","fr":"Essayer la Démo →","de":"Demo Testen →","es":"Probar Demo →"}'::jsonb,
    '["Model Verified", "Secure Escrow", "45-Day Support"]'::jsonb,
    '$220,000',
    '/buy-business/niches/ai-tools/contentforge-ai',
    'https://contentforge.ai',
    3,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    url = excluded.url,
    category = excluded.category,
    category_color = excluded.category_color,
    category_border_radius = excluded.category_border_radius,
    nav_emoji = excluded.nav_emoji,
    nav_title = excluded.nav_title,
    bg_image_url = excluded.bg_image_url,
    overlay_color = excluded.overlay_color,
    icon_radius = excluded.icon_radius,
    icon_border = excluded.icon_border,
    icon_shadow = excluded.icon_shadow,
    main_emoji = excluded.main_emoji,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    tags = excluded.tags,
    grid_emojis = excluded.grid_emojis,
    button_text_translations = excluded.button_text_translations,
    trust_badges = excluded.trust_badges,
    price = excluded.price,
    link_url = excluded.link_url,
    visit_link_url = excluded.visit_link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Card 5: The Design Thinker
insert into acquisition_cards (
    id, parent_section, url, category, category_color, category_border_radius,
    nav_emoji, nav_title, bg_image_url, overlay_color, icon_radius, icon_border, icon_shadow,
    main_emoji, title_translations, description_translations, tags, grid_emojis,
    button_text_translations, trust_badges, price, link_url, visit_link_url,
    display_order, active
)
values (
    '16b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '11b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'thedesignthinker.co',
    'Personal Brand',
    'rgba(255, 99, 72, 0.19)',
    '4px',
    '🎯',
    'The Design Thinker',
    'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&h=600&fit=crop&auto=format',
    'rgba(255, 99, 72, 0.25)',
    '4px',
    'rgba(255, 99, 72, 0.314)',
    'rgba(255, 99, 72, 0.082) 0px 0px 25px',
    '🎯',
    '{"en":"The Design Thinker","fr":"The Design Thinker","de":"The Design Thinker","es":"The Design Thinker"}'::jsonb,
    '{"en":"Design & creativity newsletter with 42K subscribers, a $49K course business, and 3-4 brand sponsorships monthly.","fr":"Newsletter design et créativité avec 42 000 abonnés, un business de cours à 49 000 $ et 3 à 4 sponsoring de marques par mois.","de":"Design- und Kreativität-Newsletter mit 42.000 Abonnenten, einem 49.000 $-Kursgeschäft und 3-4 Markensponsoring pro Monat.","es":"Newsletter de diseño y creatividad con 42.000 suscriptores, un negocio de cursos de 49.000 $ y 3-4 patrocinios de marca al mes."}'::jsonb,
    '["Design", "Newsletter", "Courses"]'::jsonb,
    '["📱", "🎙️", "📧"]'::jsonb,
    '{"en":"Explore →","fr":"Explorer →","de":"Entdecken →","es":"Explorar →"}'::jsonb,
    '["Audience Verified", "Secure Escrow", "60-Day Support"]'::jsonb,
    '$95,000',
    '/buy-business/niches/personal-brand/the-design-thinker',
    'https://thedesignthinker.co',
    4,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    url = excluded.url,
    category = excluded.category,
    category_color = excluded.category_color,
    category_border_radius = excluded.category_border_radius,
    nav_emoji = excluded.nav_emoji,
    nav_title = excluded.nav_title,
    bg_image_url = excluded.bg_image_url,
    overlay_color = excluded.overlay_color,
    icon_radius = excluded.icon_radius,
    icon_border = excluded.icon_border,
    icon_shadow = excluded.icon_shadow,
    main_emoji = excluded.main_emoji,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    tags = excluded.tags,
    grid_emojis = excluded.grid_emojis,
    button_text_translations = excluded.button_text_translations,
    trust_badges = excluded.trust_badges,
    price = excluded.price,
    link_url = excluded.link_url,
    visit_link_url = excluded.visit_link_url,
    display_order = excluded.display_order,
    active = excluded.active;

-- Card 6: Brew & Bean Coffee
insert into acquisition_cards (
    id, parent_section, url, category, category_color, category_border_radius,
    nav_emoji, nav_title, bg_image_url, overlay_color, icon_radius, icon_border, icon_shadow,
    main_emoji, title_translations, description_translations, tags, grid_emojis,
    button_text_translations, trust_badges, price, link_url, visit_link_url,
    display_order, active
)
values (
    '17b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '11b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'brewbean.coffee',
    'Local Business',
    'rgba(192, 57, 43, 0.19)',
    '4px',
    '☕',
    'Brew & Bean Coffee',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop&auto=format',
    'rgba(192, 57, 43, 0.25)',
    '4px',
    'rgba(192, 57, 43, 0.314)',
    'rgba(192, 57, 43, 0.082) 0px 0px 25px',
    '☕',
    '{"en":"Brew & Bean Coffee","fr":"Brew & Bean Coffee","de":"Brew & Bean Coffee","es":"Brew & Bean Coffee"}'::jsonb,
    '{"en":"Popular specialty coffee shop in a high-foot-traffic downtown location. 4.9★ (340+ reviews), loyal regulars, and strong catering side business.","fr":"Café de spécialité populaire dans un centre-ville à fort passage. 4,9★ (340+ avis), clientèle fidèle et activité traiteur solide.","de":"Beliebte Spezialitätenkaffee-Bar in einer Fußgängerzone mit hohem Traffic. 4,9★ (340+ Bewertungen), treue Stammkunden und florierendes Catering-Geschäft.","es":"Cafetería de especialidad popular en el centro con gran afluencia de tráfico peatonal. 4,9★ (340+ reseñas), clientes fieles y negocio de catering sólido."}'::jsonb,
    '["Coffee Shop", "Food & Beverage", "High Traffic"]'::jsonb,
    '["📍", "⭐", "🏪"]'::jsonb,
    '{"en":"Visit Us →","fr":"Visiter →","de":"Besuchen →","es":"Visitar →"}'::jsonb,
    '["Physical Assets Verified", "Secure Escrow", "90-Day Support"]'::jsonb,
    '$195,000',
    '/buy-business/niches/local-business/brew-bean-coffee',
    'https://brewbean.coffee',
    5,
    true
)
on conflict (id) do update set
    parent_section = excluded.parent_section,
    url = excluded.url,
    category = excluded.category,
    category_color = excluded.category_color,
    category_border_radius = excluded.category_border_radius,
    nav_emoji = excluded.nav_emoji,
    nav_title = excluded.nav_title,
    bg_image_url = excluded.bg_image_url,
    overlay_color = excluded.overlay_color,
    icon_radius = excluded.icon_radius,
    icon_border = excluded.icon_border,
    icon_shadow = excluded.icon_shadow,
    main_emoji = excluded.main_emoji,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    tags = excluded.tags,
    grid_emojis = excluded.grid_emojis,
    button_text_translations = excluded.button_text_translations,
    trust_badges = excluded.trust_badges,
    price = excluded.price,
    link_url = excluded.link_url,
    visit_link_url = excluded.visit_link_url,
    display_order = excluded.display_order,
    active = excluded.active;
