-- ============================================================================
-- Stratifit Digital Agency — Testimonials Section Seed
-- Inserts the default Testimonials / What Our Clients Say section and cards.
-- Idempotent: safe to run multiple times.
-- ============================================================================

insert into testimonials_section (
    id,
    display_order,
    subtitle_translations,
    title_translations,
    description_translations,
    view_all_url,
    view_all_label_translations
)
values (
    ''b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'',
    0,
    ''{
        "en": "Testimonials",
        "fr": "Témoignages",
        "de": "Testimonials",
        "es": "Testimonios"
    }''::jsonb,
    ''{
        "en": "What Our Clients Say",
        "fr": "Ce Que Disent Nos Clients",
        "de": "Was Unsere Kunden Sagen",
        "es": "Lo Que Dicen Nuestros Clientes"
    }''::jsonb,
    ''{
        "en": "Don\''t take our word for it — hear from the brands we\''ve helped scale.",
        "fr": "Ne nous croyez pas sur parole — écoutez les marques que nous avons aidées à grandir.",
        "de": "Vertrauen Sie nicht nur unserem Wort — hören Sie von den Marken, die wir beim Skalieren unterstützt haben.",
        "es": "No se fíe solo de nuestra palabra — escuche a las marcas que hemos ayudado a escalar."
    }''::jsonb,
    ''/testimonials'',
    ''{
        "en": "View All Testimonials",
        "fr": "Voir Tous Les Témoignages",
        "de": "Alle Testimonials Ansehen",
        "es": "Ver Todos Los Testimonios"
    }''::jsonb
)
on conflict (id) do update set
    display_order = excluded.display_order,
    subtitle_translations = excluded.subtitle_translations,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    view_all_url = excluded.view_all_url,
    view_all_label_translations = excluded.view_all_label_translations,
    updated_at = now();

-- ============================================================================
-- Testimonial Cards
-- ============================================================================

-- Clear existing cards for this section to avoid duplicates on re-seed
delete from testimonial_cards
where parent_section = ''b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'';

insert into testimonial_cards (
    parent_section,
    initials,
    name_translations,
    role_translations,
    quote_translations,
    rating,
    display_order,
    active
)
values (
    ''b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'',
    ''JD'',
    ''{
        "en": "James Dalton",
        "fr": "James Dalton",
        "de": "James Dalton",
        "es": "James Dalton"
    }''::jsonb,
    ''{
        "en": "CEO, Luxe Retail",
        "fr": "PDG, Luxe Retail",
        "de": "CEO, Luxe Retail",
        "es": "CEO, Luxe Retail"
    }''::jsonb,
    ''{
        "en": "Stratifit transformed our digital presence. Their strategic approach and luxury design language elevated our brand to a completely new level.",
        "fr": "Stratifit a transformé notre présence numérique. Leur approche stratégique et leur langage de design de luxe ont élevé notre marque à un niveau complètement nouveau.",
        "de": "Stratifit hat unsere digitale Präsenz transformiert. Ihr strategischer Ansatz und ihre Luxus-Designsprache haben unsere Marke auf eine völlig neue Ebene gehoben.",
        "es": "Stratifit transformó nuestra presencia digital. Su enfoque estratégico y lenguaje de diseño de lujo elevaron nuestra marca a un nivel completamente nuevo."
    }''::jsonb,
    5,
    0,
    true
),
(
    ''b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'',
    ''ES'',
    ''{
        "en": "Elena Silva",
        "fr": "Elena Silva",
        "de": "Elena Silva",
        "es": "Elena Silva"
    }''::jsonb,
    ''{
        "en": "CTO, AeroFlow",
        "fr": "CTO, AeroFlow",
        "de": "CTO, AeroFlow",
        "es": "CTO, AeroFlow"
    }''::jsonb,
    ''{
        "en": "The automation solutions provided by the team saved us countless hours. Efficient, scalable, and beautifully executed.",
        "fr": "Les solutions d\''automatisation fournies par l\''équipe nous ont fait gagner d\''innombrables heures. Efficace, évolutive et magnifiquement exécutée.",
        "de": "Die von dem Team bereitgestellten Automatisierungslösungen sparten uns unzählige Stunden. Effizient, skalierbar und wunderschön umgesetzt.",
        "es": "Las soluciones de automatización proporcionadas por el equipo nos ahorraron innumerables horas. Eficiente, escalable y bellamente ejecutada."
    }''::jsonb,
    5,
    1,
    true
),
(
    ''b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'',
    ''MC'',
    ''{
        "en": "Marcus Chen",
        "fr": "Marcus Chen",
        "de": "Marcus Chen",
        "es": "Marcus Chen"
    }''::jsonb,
    ''{
        "en": "Director, Zenith Bank",
        "fr": "Directeur, Zenith Bank",
        "de": "Direktor, Zenith Bank",
        "es": "Director, Zenith Bank"
    }''::jsonb,
    ''{
        "en": "A partner that truly understands the intersection of technology and premium aesthetics. The results speak for themselves.",
        "fr": "Un partenaire qui comprend véritablement l\''intersection entre la technologie et l\''esthétique premium. Les résultats parlent d\''eux-mêmes.",
        "de": "Ein Partner, der die Schnittstelle von Technologie und Premium-Ästhetik wirklich versteht. Die Ergebnisse sprechen für sich.",
        "es": "Un socio que realmente entiende la intersección entre tecnología y estética premium. Los resultados hablan por sí solos."
    }''::jsonb,
    5,
    2,
    true
),
(
    ''b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'',
    ''SO'',
    ''{
        "en": "Sarah Okonkwo",
        "fr": "Sarah Okonkwo",
        "de": "Sarah Okonkwo",
        "es": "Sarah Okonkwo"
    }''::jsonb,
    ''{
        "en": "Founder, Aura Cosmetics",
        "fr": "Fondatrice, Aura Cosmetics",
        "de": "Gründerin, Aura Cosmetics",
        "es": "Fundadora, Aura Cosmetics"
    }''::jsonb,
    ''{
        "en": "From brand identity to e-commerce, Stratifit delivered beyond expectations. Our conversion rate tripled in 90 days.",
        "fr": "De l\''identité de marque au commerce électronique, Stratifit a dépassé les attentes. Notre taux de conversion a triplé en 90 jours.",
        "de": "Von der Markenidentität bis zum E-Commerce hat Stratifit die Erwartungen übertroffen. Unsere Conversion-Rate verdreifachte sich in 90 Tagen.",
        "es": "Desde la identidad de marca hasta el comercio electrónico, Stratifit superó las expectativas. Nuestra tasa de conversión se triplicó en 90 días."
    }''::jsonb,
    5,
    3,
    true
),
(
    ''b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'',
    ''DP'',
    ''{
        "en": "David Park",
        "fr": "David Park",
        "de": "David Park",
        "es": "David Park"
    }''::jsonb,
    ''{
        "en": "VP Marketing, Nova Fintech",
        "fr": "VP Marketing, Nova Fintech",
        "de": "VP Marketing, Nova Fintech",
        "es": "VP de Marketing, Nova Fintech"
    }''::jsonb,
    ''{
        "en": "The growth engine they built for us is a revenue machine. Predictable, measurable, and scalable.",
        "fr": "Le moteur de croissance qu\''ils ont construit pour nous est une machine à revenus. Prévisible, mesurable et évolutif.",
        "de": "Die von ihnen für uns gebaute Wachstumsmschine ist eine Einnahmenmaschine. Vorhersehbar, messbar und skalierbar.",
        "es": "El motor de crecimiento que construyeron para nosotros es una máquina de ingresos. Predecible, medible y escalable."
    }''::jsonb,
    5,
    4,
    true
),
(
    ''b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'',
    ''AO'',
    ''{
        "en": "Amara Obi",
        "fr": "Amara Obi",
        "de": "Amara Obi",
        "es": "Amara Obi"
    }''::jsonb,
    ''{
        "en": "Creative Director, Atlas Media",
        "fr": "Directrice Créative, Atlas Media",
        "de": "Creative Director, Atlas Media",
        "es": "Directora Creativa, Atlas Media"
    }''::jsonb,
    ''{
        "en": "Working with Stratifit feels like an extension of our team. Their design sensibility is unmatched in the industry.",
        "fr": "Travailler avec Stratifit est comme avoir une extension de notre équipe. Leur sensibilité au design est inégalée dans l\''industrie.",
        "de": "Die Zusammenarbeit mit Stratifit fühlt sich wie eine Erweiterung unseres Teams an. Ihr Designempfinden ist in der Branche unübertroffen.",
        "es": "Trabajar con Stratifit se siente como una extensión de nuestro equipo. Su sensibilidad de diseño es inigualable en la industria."
    }''::jsonb,
    5,
    5,
    true
);
