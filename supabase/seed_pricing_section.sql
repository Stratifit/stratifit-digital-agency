-- ============================================================================
-- Stratifit Digital Agency — Pricing Section Seed
-- Inserts the default Pricing / Service Packages section and packages.
-- Idempotent: safe to run multiple times.
-- ============================================================================

insert into pricing_section (
    id,
    display_order,
    subtitle_translations,
    title_translations,
    description_translations
)
values (
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c7e',
    0,
    '{
        "en": "Pricing",
        "fr": "Tarification",
        "de": "Preise",
        "es": "Precios"
    }'::jsonb,
    '{
        "en": "Service Packages",
        "fr": "Forfaits de Services",
        "de": "Servicepakete",
        "es": "Paquetes de Servicios"
    }'::jsonb,
    '{
        "en": "Transparent pricing for every stage of growth. Start where you are and scale with confidence.",
        "fr": "Une tarification transparente pour chaque étape de la croissance. Commencez où vous en êtes et évoluez en toute confiance.",
        "de": "Transparente Preise für jede Wachstumsphase. Starten Sie, wo Sie sind, und skalieren Sie mit Zuversicht.",
        "es": "Precios transparentes para cada etapa de crecimiento. Comience donde está y escale con confianza."
    }'::jsonb
)
on conflict (id) do update set
    display_order = excluded.display_order,
    subtitle_translations = excluded.subtitle_translations,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    updated_at = now();

-- ============================================================================
-- Pricing Packages
-- ============================================================================

-- Clear existing packages for this section to avoid duplicates on re-seed
delete from pricing_packages
where parent_section = 'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c7e';

insert into pricing_packages (
    parent_section,
    name_translations,
    description_translations,
    price,
    price_label_translations,
    is_popular,
    button_label_translations,
    button_action,
    features,
    display_order,
    active
)
values (
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c7e',
    '{
        "en": "Launch",
        "fr": "Lancement",
        "de": "Launch",
        "es": "Lanzamiento"
    }'::jsonb,
    '{
        "en": "Perfect for startups needing an MVP and brand foundation.",
        "fr": "Parfait pour les startups ayant besoin d''un MVP et d''une fondation de marque.",
        "de": "Perfekt für Startups, die ein MVP und eine Markengrundlage benötigen.",
        "es": "Perfecto para startups que necesitan un MVP y una base de marca."
    }'::jsonb,
    '$5,000',
    '{
        "en": "/ project",
        "fr": "/ projet",
        "de": "/ Projekt",
        "es": "/ proyecto"
    }'::jsonb,
    false,
    '{
        "en": "Get Started",
        "fr": "Commencer",
        "de": "Loslegen",
        "es": "Empezar"
    }'::jsonb,
    '/contact',
    '[
        {"en": "Identity & Logo Design", "fr": "Identité & Conception de Logo", "de": "Identität & Logo-Design", "es": "Identidad y Diseño de Logo"},
        {"en": "5-Page Responsive Website", "fr": "Site Web Responsive de 5 Pages", "de": "5-Seitige Responsive Website", "es": "Sitio Web Responsivo de 5 Páginas"},
        {"en": "Basic SEO Setup", "fr": "Configuration SEO de Base", "de": "Basis-SEO-Setup", "es": "Configuración SEO Básica"},
        {"en": "2 Weeks of Support", "fr": "2 Semaines de Support", "de": "2 Wochen Support", "es": "2 Semanas de Soporte"}
    ]'::jsonb,
    0,
    true
),
(
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c7e',
    '{
        "en": "Grow",
        "fr": "Croître",
        "de": "Wachsen",
        "es": "Crecer"
    }'::jsonb,
    '{
        "en": "For brands ready to capture market share and scale.",
        "fr": "Pour les marques prêtes à capturer des parts de marché et à évoluer.",
        "de": "Für Marken, die bereit sind, Marktanteile zu erobern und zu skalieren.",
        "es": "Para marcas listas para capturar cuota de mercado y escalar."
    }'::jsonb,
    '$12,000',
    '{
        "en": "/ project",
        "fr": "/ projet",
        "de": "/ Projekt",
        "es": "/ proyecto"
    }'::jsonb,
    true,
    '{
        "en": "Get Started",
        "fr": "Commencer",
        "de": "Loslegen",
        "es": "Empezar"
    }'::jsonb,
    '/contact',
    '[
        {"en": "Full Brand System", "fr": "Système de Marque Complet", "de": "Vollständiges Markensystem", "es": "Sistema de Marca Completo"},
        {"en": "Custom Web App / E-commerce", "fr": "Application Web / E-commerce Sur Mesure", "de": "Individuelle Web-App / E-Commerce", "es": "Aplicación Web / E-commerce Personalizada"},
        {"en": "CMS Integration", "fr": "Intégration CMS", "de": "CMS-Integration", "es": "Integración CMS"},
        {"en": "3 Months Growth Marketing", "fr": "3 Mois de Marketing de Croissance", "de": "3 Monate Growth Marketing", "es": "3 Meses de Marketing de Crecimiento"},
        {"en": "30 Days Post-Launch Support", "fr": "30 Jours de Support Post-Lancement", "de": "30 Tage Support nach dem Launch", "es": "30 Días de Soporte Post-Lanzamiento"}
    ]'::jsonb,
    1,
    true
),
(
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c7e',
    '{
        "en": "Scale",
        "fr": "Échelle",
        "de": "Skalieren",
        "es": "Escala"
    }'::jsonb,
    '{
        "en": "Enterprise-grade solutions for established companies.",
        "fr": "Des solutions de niveau entreprise pour les entreprises établies.",
        "de": "Enterprise-Grade-Lösungen für etablierte Unternehmen.",
        "es": "Soluciones de nivel empresarial para empresas consolidadas."
    }'::jsonb,
    '$25,000',
    '{
        "en": "/ project",
        "fr": "/ projet",
        "de": "/ Projekt",
        "es": "/ proyecto"
    }'::jsonb,
    false,
    '{
        "en": "Contact Sales",
        "fr": "Contacter les Ventes",
        "de": "Vertrieb Kontaktieren",
        "es": "Contactar a Ventas"
    }'::jsonb,
    '/contact',
    '[
        {"en": "Complex Systems Architecture", "fr": "Architecture de Systèmes Complexes", "de": "Komplexe Systemarchitektur", "es": "Arquitectura de Sistemas Complejos"},
        {"en": "Dedicated Product Team", "fr": "Équipe Produit Dédiée", "de": "Dediziertes Produktteam", "es": "Equipo de Producto Dedicado"},
        {"en": "AI & Automation Suite", "fr": "Suite IA & Automatisation", "de": "KI- & Automatisierungssuite", "es": "Suite de IA y Automatización"},
        {"en": "Full Growth Engine Setup", "fr": "Configuration Complète du Moteur de Croissance", "de": "Vollständiges Growth-Engine-Setup", "es": "Configuración Completa del Motor de Crecimiento"},
        {"en": "24/7 SLA Support", "fr": "Support SLA 24/7", "de": "24/7 SLA-Support", "es": "Soporte SLA 24/7"}
    ]'::jsonb,
    2,
    true
),
(
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c7e',
    '{
        "en": "Custom",
        "fr": "Sur Mesure",
        "de": "Individuell",
        "es": "Personalizado"
    }'::jsonb,
    '{
        "en": "Tailored solutions for unique challenges and enterprise scale.",
        "fr": "Des solutions sur mesure pour les défis uniques et l''échelle entreprise.",
        "de": "Maßgeschneiderte Lösungen für einzigartige Herausforderungen und Unternehmensgröße.",
        "es": "Soluciones a medida para desafíos únicos y escala empresarial."
    }'::jsonb,
    "Let's Talk",
    '{
        "en": "",
        "fr": "",
        "de": "",
        "es": ""
    }'::jsonb,
    false,
    '{
        "en": "Book a Call",
        "fr": "Réserver un Appel",
        "de": "Gespräch Buchen",
        "es": "Reservar una Llamada"
    }'::jsonb,
    '/contact',
    '[
        {"en": "Custom Scope & Timeline", "fr": "Scope & Calendrier Sur Mesure", "de": "Individueller Scope & Zeitplan", "es": "Alcance y Cronograma Personalizados"},
        {"en": "Multi-Discipline Team", "fr": "Équipe Pluridisciplinaire", "de": "Multidisziplinäres Team", "es": "Equipo Multidisciplinario"},
        {"en": "Unlimited Revisions", "fr": "Révisions Illimitées", "de": "Unbegrenzte Überarbeitungen", "es": "Revisiones Ilimitadas"},
        {"en": "Dedicated Account Manager", "fr": "Account Manager Dédié", "de": "Dedizierter Account Manager", "es": "Gerente de Cuenta Dedicado"},
        {"en": "Priority Support", "fr": "Support Prioritaire", "de": "Prioritätsupport", "es": "Soporte Prioritario"}
    ]'::jsonb,
    3,
    true
);
