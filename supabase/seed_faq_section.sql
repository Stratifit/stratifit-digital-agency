-- ============================================================================
-- Stratifit Digital Agency — FAQ Section Seed
-- Inserts the default FAQ / Frequently Asked Questions section and items.
-- Idempotent: safe to run multiple times.
-- ============================================================================

insert into faq_section (
    id,
    display_order,
    subtitle_translations,
    title_translations,
    description_translations
)
values (
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c8e',
    0,
    '{
        "en": "Support",
        "fr": "Support",
        "de": "Support",
        "es": "Soporte"
    }'::jsonb,
    '{
        "en": "Frequently Asked Questions",
        "fr": "Questions Fréquemment Posées",
        "de": "Häufig Gestellte Fragen",
        "es": "Preguntas Frecuentes"
    }'::jsonb,
    '{
        "en": "Clear answers to the most common questions we hear from clients.",
        "fr": "Des réponses claires aux questions les plus courantes que nous entendons de la part de nos clients.",
        "de": "Klare Antworten auf die häufigsten Fragen, die wir von Kunden hören.",
        "es": "Respuestas claras a las preguntas más comunes que escuchamos de los clientes."
    }'::jsonb
)
on conflict (id) do update set
    display_order = excluded.display_order,
    subtitle_translations = excluded.subtitle_translations,
    title_translations = excluded.title_translations,
    description_translations = excluded.description_translations,
    updated_at = now();

-- ============================================================================
-- FAQ Items
-- ============================================================================

-- Clear existing items for this section to avoid duplicates on re-seed
delete from faq_items
where parent_section = 'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c8e';

insert into faq_items (
    parent_section,
    question_translations,
    answer_translations,
    display_order,
    active
)
values (
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c8e',
    '{
        "en": "What is the typical timeline for a branding project?",
        "fr": "Quel est le délai typique d''un projet de branding ?",
        "de": "Wie lange dauert ein typisches Branding-Projekt?",
        "es": "¿Cuál es el tiempo típico de un proyecto de branding?"
    }'::jsonb,
    '{
        "en": "A standard branding project spans 4-6 weeks from discovery to final delivery. Timelines are tailored to scope — brand strategy and identity rollouts may extend to 8 weeks.",
        "fr": "Un projet de branding standard s''étend sur 4 à 6 semaines de la découverte à la livraison finale. Les délais sont adaptés à la portée — les stratégies de marque et les déploiements d''identité peuvent s''étendre jusqu''à 8 semaines.",
        "de": "Ein standard Branding-Projekt erstreckt sich über 4-6 Wochen von der Entdeckung bis zur finalen Lieferung. Zeitpläne werden auf den Umfang zugeschnitten — Markenstrategie und Identity-Rollouts können bis zu 8 Wochen dauern.",
        "es": "Un proyecto de branding estándar abarca de 4 a 6 semanas desde el descubrimiento hasta la entrega final. Los plazos se adaptan al alcance — las estrategias de marca y los despliegues de identidad pueden extenderse hasta 8 semanas."
    }'::jsonb,
    0,
    true
),
(
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c8e',
    '{
        "en": "Do you offer post-launch support?",
        "fr": "Proposez-vous un support post-lancement ?",
        "de": "Bieten Sie Support nach dem Launch an?",
        "es": "¿Ofrecen soporte post-lanzamiento?"
    }'::jsonb,
    '{
        "en": "Yes. Every project includes a defined support window, and we offer ongoing retainer agreements for maintenance, optimization, and continuous improvements.",
        "fr": "Oui. Chaque projet inclut une période de support définie, et nous proposons des contrats de maintenance pour l''optimisation et les améliorations continues.",
        "de": "Ja. Jedes Projekt beinhaltet ein definiertes Support-Fenster, und wir bieten laufende Wartungsvereinbarungen für Wartung, Optimierung und kontinuierliche Verbesserungen an.",
        "es": "Sí. Cada proyecto incluye una ventana de soporte definida, y ofrecemos acuerdos de retención continua para mantenimiento, optimización y mejoras continuas."
    }'::jsonb,
    1,
    true
),
(
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c8e',
    '{
        "en": "How are payments structured?",
        "fr": "Comment sont structurés les paiements ?",
        "de": "Wie sind die Zahlungen strukturiert?",
        "es": "¿Cómo se estructuran los pagos?"
    }'::jsonb,
    '{
        "en": "We typically invoice in milestones — a deposit to kick off work, followed by progress payments tied to deliverables. Custom terms are available for enterprise engagements.",
        "fr": "Nous facturons généralement par jalons — un acompte pour lancer les travaux, suivi de paiements d''avancement liés aux livrables. Des conditions personnalisées sont disponibles pour les entreprises.",
        "de": "Wir berechnen typischerweise in Meilensteinen — eine Anzahlung, um die Arbeit zu beginnen, gefolgt von Fortschrittszahlungen, die an Lieferobjekte gebunden sind. Für Unternehmensprojekte sind individuelle Konditionen verfügbar.",
        "es": "Típicamente facturamos por hitos — un depósito para comenzar el trabajo, seguido de pagos de progreso vinculados a entregables. Términos personalizados están disponibles para compromisos empresariales."
    }'::jsonb,
    2,
    true
),
(
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c8e',
    '{
        "en": "What technology stack do you use?",
        "fr": "Quelle stack technologique utilisez-vous ?",
        "de": "Welchen Technologie-Stack verwenden Sie?",
        "es": "¿Qué stack tecnológico utilizan?"
    }'::jsonb,
    '{
        "en": "We specialize in modern, scalable stacks: Next.js, React, TypeScript, Tailwind CSS, Supabase, and AI tooling. We pick the right tools for your specific goals.",
        "fr": "Nous sommes spécialisés dans les stacks modernes et scalables : Next.js, React, TypeScript, Tailwind CSS, Supabase et outils d''IA. Nous choisissons les bons outils pour vos objectifs spécifiques.",
        "de": "Wir spezialisieren uns auf moderne, skalierbare Stacks: Next.js, React, TypeScript, Tailwind CSS, Supabase und KI-Tools. Wir wählen die richtigen Tools für Ihre spezifischen Ziele.",
        "es": "Nos especializamos en stacks modernos y escalables: Next.js, React, TypeScript, Tailwind CSS, Supabase y herramientas de IA. Elegimos las herramientas adecuadas para sus objetivos específicos."
    }'::jsonb,
    3,
    true
),
(
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c8e',
    '{
        "en": "Can you work with our existing systems and tools?",
        "fr": "Pouvez-vous travailler avec nos systèmes et outils existants ?",
        "de": "Können Sie mit unseren bestehenden Systemen und Tools arbeiten?",
        "es": "¿Pueden trabajar con nuestros sistemas y herramientas existentes?"
    }'::jsonb,
    '{
        "en": "Absolutely. We integrate with existing CMS, CRM, marketing automation, and analytics platforms to preserve your workflows and maximize ROI.",
        "fr": "Absolument. Nous intégrons les CMS, CRM, automatisation marketing et plateformes d''analyse existants pour préserver vos flux de travail et maximiser le ROI.",
        "de": "Absolut. Wir integrieren uns in bestehende CMS-, CRM-, Marketing-Automation- und Analytics-Plattformen, um Ihre Arbeitsabläufe zu bewahren und den ROI zu maximieren.",
        "es": "Absolutamente. Nos integramos con plataformas existentes de CMS, CRM, automatización de marketing y análisis para preservar sus flujos de trabajo y maximizar el ROI."
    }'::jsonb,
    4,
    true
),
(
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c8e',
    '{
        "en": "Do you handle ongoing marketing after launch?",
        "fr": "Gérez-vous le marketing continu après le lancement ?",
        "de": "Kümmern Sie sich nach dem Launch um laufendes Marketing?",
        "es": "¿Manejan el marketing continuo después del lanzamiento?"
    }'::jsonb,
    '{
        "en": "Yes. We offer growth marketing retainers that cover performance marketing, SEO, content strategy, and conversion rate optimization after launch.",
        "fr": "Oui. Nous proposons des contrats de marketing de croissance couvrant le marketing de performance, le SEO, la stratégie de contenu et l''optimisation du taux de conversion après le lancement.",
        "de": "Ja. Wir bieten Growth-Marketing-Wartungsverträge an, die Performance-Marketing, SEO, Content-Strategie und Conversion-Rate-Optimierung nach dem Launch abdecken.",
        "es": "Sí. Ofrecemos contratos de marketing de crecimiento que cubren marketing de rendimiento, SEO, estrategia de contenido y optimización de tasas de conversión después del lanzamiento."
    }'::jsonb,
    5,
    true
),
(
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c8e',
    '{
        "en": "What is your approach to AI and automation?",
        "fr": "Quelle est votre approche de l''IA et de l''automatisation ?",
        "de": "Wie ist Ihr Ansatz für KI und Automatisierung?",
        "es": "¿Cuál es su enfoque de la IA y la automatización?"
    }'::jsonb,
    '{
        "en": "We identify high-value, repeatable workflows and augment them with AI — from lead qualification chatbots to automated reporting — always keeping humans in the loop.",
        "fr": "Nous identifions les flux de travail à forte valeur ajoutée et répétables et les augmentons avec l''IA — des chatbots de qualification de leads aux rapports automatisés — tout en gardant les humains dans la boucle.",
        "de": "Wir identifizieren hochwertige, wiederholbare Workflows und erweitern sie mit KI — von Lead-Qualifikations-Chatbots bis hin zu automatisierten Berichten — wobei wir Menschen immer in der Schleife halten.",
        "es": "Identificamos flujos de trabajo de alto valor y repetibles y los aumentamos con IA — desde chatbots de calificación de leads hasta informes automatizados — manteniendo siempre a los humanos en el circuito."
    }'::jsonb,
    6,
    true
),
(
    'f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c8e',
    '{
        "en": "How do you measure success?",
        "fr": "Comment mesurez-vous le succès ?",
        "de": "Wie messen Sie Erfolg?",
        "es": "¿Cómo miden el éxito?"
    }'::jsonb,
    '{
        "en": "We define KPIs at the start of every engagement — traffic, conversions, revenue, retention, or efficiency gains — and report against them monthly.",
        "fr": "Nous définissons des KPI au début de chaque engagement — trafic, conversions, revenus, rétention ou gains d''efficacité — et nous rapportons mensuellement.",
        "de": "Wir definieren KPIs zu Beginn jeder Zusammenarbeit — Traffic, Conversions, Umsatz, Retention oder Effizienzgewinne — und berichten monatlich darüber.",
        "es": "Definimos KPIs al inicio de cada compromiso — tráfico, conversiones, ingresos, retención o ganancias de eficiencia — e informamos sobre ellos mensualmente."
    }'::jsonb,
    7,
    true
);
