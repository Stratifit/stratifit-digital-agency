-- ============================================================================
-- Stratifit — Navigation Header Seed
-- 4-language content + 3 demo service blocks + 3 chat quick actions
-- ============================================================================

insert into section_navigation_header (display_order, sticky, content, translations, url)
values (
    0,
    false,
    '{
      "logo": "Stratifit",
      "links": [
        {"id": "services", "label": "Services", "href": "/services"},
        {"id": "portfolio", "label": "Portfolio", "href": "/portfolio"},
        {"id": "insights", "label": "Insights", "href": "/insights"},
        {"id": "about", "label": "About", "href": "/about"},
        {"id": "faq", "label": "FAQ", "href": "/faq"},
        {"id": "contact", "label": "Contact", "href": "/contact"}
      ],
      "cta": {"label": "Start a Project", "href": "/contact"},
      "languages": [
        {"id": "en", "flag": "🇺🇸", "code": "EN", "name": "English"},
        {"id": "es", "flag": "🇪🇸", "code": "ES", "name": "Español"},
        {"id": "fr", "flag": "🇫🇷", "code": "FR", "name": "Français"},
        {"id": "de", "flag": "🇩🇪", "code": "DE", "name": "Deutsch"}
      ],
      "services": [
        {"id": "brand", "title": "Brand Design", "description": "Unique identity systems and visual guidelines.", "href": "/services/brand-design", "iconId": "brand"},
        {"id": "web", "title": "Web Development", "description": "Fast, responsive, and scalable modern web apps.", "href": "/services/web-development", "iconId": "web"},
        {"id": "marketing", "title": "Marketing", "description": "Data-driven growth strategies to elevate your business.", "href": "/services/marketing", "iconId": "marketing"}
      ],
      "footerLinks": [
        {"id": "privacy", "label": "Privacy", "href": "/privacy"},
        {"id": "terms", "label": "Terms", "href": "/terms"},
        {"id": "cookies", "label": "Cookies", "href": "/cookies"}
      ],
      "chat": {
        "title": "Stratifit AI",
        "subtitle": "Online",
        "welcomeMessage": "Welcome to Stratifit — your digital agency for growth. What''s your name? Email is optional and only used for follow-ups.",
        "inputPlaceholder": "Your name...",
        "userMessage": "Hi Stratifit! I''m ready to grow my business.",
        "quickActions": [
          {"id": "demo", "label": "Book a Demo"},
          {"id": "quote", "label": "Get a Quote"},
          {"id": "contact", "label": "Contact Us"}
        ]
      },
      "chatLanguages": [
        {"flag": "🇬🇧", "code": "EN", "name": "English"},
        {"flag": "🇪🇸", "code": "ES", "name": "Spanish"},
        {"flag": "🇫🇷", "code": "FR", "name": "French"},
        {"flag": "🇩🇪", "code": "DE", "name": "German"}
      ],
      "desktopChatPill": "Chat with us",
      "builtBy": "Built by STRATIFIT team",
      "copyright": "© 2026 Stratifit Agency"
    }'::jsonb,
    '{
      "fr": {
        "logo": "Stratifit",
        "links.services.label": "Services",
        "links.portfolio.label": "Portfolio",
        "links.insights.label": "Perspectives",
        "links.about.label": "À propos",
        "links.faq.label": "FAQ",
        "links.contact.label": "Contact",
        "cta.label": "Lancer un projet",
        "languages.en.name": "English",
        "languages.es.name": "Español",
        "languages.fr.name": "Français",
        "languages.de.name": "Deutsch",
        "services.brand.title": "Identité de marque",
        "services.brand.description": "Des systèmes d''identité uniques et des directives visuelles.",
        "services.web.title": "Développement Web",
        "services.web.description": "Des applications web modernes, rapides et évolutives.",
        "services.marketing.title": "Marketing",
        "services.marketing.description": "Des stratégies de croissance pilotées par les données pour développer votre activité.",
        "footerLinks.privacy.label": "Confidentialité",
        "footerLinks.terms.label": "Conditions",
        "footerLinks.cookies.label": "Cookies",
        "chat.title": "Stratifit AI",
        "chat.subtitle": "En ligne",
        "chat.welcomeMessage": "Bienvenue chez Stratifit — votre agence digitale pour la croissance. Quel est votre nom ? L''e-mail est optionnel et uniquement utilisé pour les suivis.",
        "chat.inputPlaceholder": "Votre nom...",
        "chat.userMessage": "Bonjour Stratifit ! Je suis prêt à faire croître mon entreprise.",
        "chat.quickActions.demo.label": "Réserver une démo",
        "chat.quickActions.quote.label": "Obtenir un devis",
        "chat.quickActions.contact.label": "Contactez-nous",
        "desktopChatPill": "Discutez avec nous",
        "builtBy": "Conçu par l''équipe STRATIFIT",
        "copyright": "© 2026 Stratifit Agency"
      },
      "de": {
        "logo": "Stratifit",
        "links.services.label": "Leistungen",
        "links.portfolio.label": "Portfolio",
        "links.insights.label": "Insights",
        "links.about.label": "Über uns",
        "links.faq.label": "FAQ",
        "links.contact.label": "Kontakt",
        "cta.label": "Projekt starten",
        "languages.en.name": "English",
        "languages.es.name": "Español",
        "languages.fr.name": "Français",
        "languages.de.name": "Deutsch",
        "services.brand.title": "Markendesign",
        "services.brand.description": "Einzigartige Identitätssysteme und visuelle Richtlinien.",
        "services.web.title": "Webentwicklung",
        "services.web.description": "Schnelle, responsive und skalierbare moderne Web-Apps.",
        "services.marketing.title": "Marketing",
        "services.marketing.description": "Datengesteuerte Wachstumsstrategien, um Ihr Unternehmen zu stärken.",
        "footerLinks.privacy.label": "Datenschutz",
        "footerLinks.terms.label": "AGB",
        "footerLinks.cookies.label": "Cookies",
        "chat.title": "Stratifit AI",
        "chat.subtitle": "Online",
        "chat.welcomeMessage": "Willkommen bei Stratifit — Ihrer Digitalagentur für Wachstum. Wie heißen Sie? E-Mail ist optional und nur für Follow-ups gedacht.",
        "chat.inputPlaceholder": "Dein Name...",
        "chat.userMessage": "Hallo Stratifit! Ich bin bereit, mein Unternehmen zu wachsen.",
        "chat.quickActions.demo.label": "Demo buchen",
        "chat.quickActions.quote.label": "Angebot anfordern",
        "chat.quickActions.contact.label": "Kontakt",
        "desktopChatPill": "Chatte mit uns",
        "builtBy": "Entwickelt vom STRATIFIT-Team",
        "copyright": "© 2026 Stratifit Agency"
      },
      "es": {
        "logo": "Stratifit",
        "links.services.label": "Servicios",
        "links.portfolio.label": "Portafolio",
        "links.insights.label": "Perspectivas",
        "links.about.label": "Nosotros",
        "links.faq.label": "FAQ",
        "links.contact.label": "Contacto",
        "cta.label": "Iniciar un proyecto",
        "languages.en.name": "English",
        "languages.es.name": "Español",
        "languages.fr.name": "Français",
        "languages.de.name": "Deutsch",
        "services.brand.title": "Diseño de Marca",
        "services.brand.description": "Sistemas de identidad únicos y guías visuales.",
        "services.web.title": "Desarrollo Web",
        "services.web.description": "Aplicaciones web modernas, rápidas y escalables.",
        "services.marketing.title": "Marketing",
        "services.marketing.description": "Estrategias de crecimiento basadas en datos para impulsar tu negocio.",
        "footerLinks.privacy.label": "Privacidad",
        "footerLinks.terms.label": "Términos",
        "footerLinks.cookies.label": "Cookies",
        "chat.title": "Stratifit AI",
        "chat.subtitle": "En línea",
        "chat.welcomeMessage": "Bienvenido a Stratifit — tu agencia digital para el crecimiento. ¿Cuál es tu nombre? El correo es opcional y solo se usará para seguimientos.",
        "chat.inputPlaceholder": "Tu nombre...",
        "chat.userMessage": "¡Hola Stratifit! Estoy listo para hacer crecer mi negocio.",
        "chat.quickActions.demo.label": "Reservar demo",
        "chat.quickActions.quote.label": "Cotizar",
        "chat.quickActions.contact.label": "Contáctanos",
        "desktopChatPill": "Chatea con nosotros",
        "builtBy": "Hecho por el equipo STRATIFIT",
        "copyright": "© 2026 Stratifit Agency"
      }
    }'::jsonb,
    ''
);
