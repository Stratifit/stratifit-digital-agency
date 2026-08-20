/**
 * Rich card-style fallback content for CMS detail pages.
 *
 * These blocks mirror the content seeded by migrations 00040 / 00047 so the
 * public pages render the icon-card design even when the `detail_pages` row
 * is missing or empty (e.g. before migrations are applied). Once the row
 * exists in Supabase, the database content always wins.
 */
import type { DetailPageBlock } from "@/features/detail-pages/queries";

const tr = (en: string, de: string, fr: string, es: string) => ({
  en,
  de,
  fr,
  es,
});

// =============================================================================
// Privacy Policy
// =============================================================================

export const PRIVACY_FALLBACK_BLOCKS: DetailPageBlock[] = [
  {
    type: "heading",
    icon: "file-text",
    text_translations: tr(
      "1. Introduction",
      "1. Einleitung",
      "1. Introduction",
      "1. Introducción"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Stratifit (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [stratifit.com](https://stratifit.com) or use any of our digital services. Please read this policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy.",
      "Stratifit („wir“ oder „uns“) verpflichtet sich zum Schutz Ihrer Privatsphäre. Diese Datenschutzerklärung erläutert, wie wir Ihre Informationen erfassen, verwenden, offenlegen und schützen, wenn Sie unsere Website [stratifit.com](https://stratifit.com) besuchen oder unsere digitalen Dienste nutzen. Bitte lesen Sie diese Richtlinie sorgfältig. Durch den Zugriff auf oder die Nutzung unserer Dienste bestätigen Sie, dass Sie diese Datenschutzerklärung gelesen, verstanden und ihr zugestimmt haben.",
      "Stratifit (« nous », « notre » ou « nos ») s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web [stratifit.com](https://stratifit.com) ou utilisez l'un de nos services numériques. Veuillez lire cette politique attentivement. En accédant à nos services ou en les utilisant, vous reconnaissez avoir lu, compris et accepté les termes de cette politique de confidentialité.",
      "Stratifit («nosotros», «nuestro» o «nos») se compromete a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos su información cuando visita nuestro sitio web [stratifit.com](https://stratifit.com) o utiliza cualquiera de nuestros servicios digitales. Lea esta política atentamente. Al acceder o utilizar nuestros servicios, reconoce que ha leído, comprendido y aceptado los términos de esta Política de Privacidad."
    ),
  },
  {
    type: "heading",
    icon: "eye",
    text_translations: tr(
      "2. Information We Collect",
      "2. Welche Informationen wir erfassen",
      "2. Informations que nous collectons",
      "2. Información que recopilamos"
    ),
  },
  {
    type: "subheading",
    text_translations: tr(
      "Personal Information",
      "Persönliche Informationen",
      "Informations personnelles",
      "Información personal"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "When you contact us through our website forms, we may collect your name, email address, phone number, company name, and any other information you voluntarily provide in your message.",
      "Wenn Sie uns über die Formulare auf unserer Website kontaktieren, können wir Ihren Namen, Ihre E-Mail-Adresse, Ihre Telefonnummer, Ihren Firmennamen und alle anderen Informationen erfassen, die Sie in Ihrer Nachricht freiwillig angeben.",
      "Lorsque vous nous contactez via les formulaires de notre site web, nous pouvons collecter votre nom, votre adresse e-mail, votre numéro de téléphone, le nom de votre entreprise et toute autre information que vous fournissez volontairement dans votre message.",
      "Cuando nos contacta a través de los formularios de nuestro sitio web, podemos recopilar su nombre, dirección de correo electrónico, número de teléfono, nombre de la empresa y cualquier otra información que proporcione voluntariamente en su mensaje."
    ),
  },
  {
    type: "subheading",
    text_translations: tr(
      "Automatically Collected Information",
      "Automatisch erfasste Informationen",
      "Informations collectées automatiquement",
      "Información recopilada automáticamente"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "When you visit our website, we automatically collect certain information including your IP address, browser type, operating system, referring URLs, device information, and browsing behavior. This is collected through cookies and similar tracking technologies.",
      "Wenn Sie unsere Website besuchen, erfassen wir automatisch bestimmte Informationen, darunter Ihre IP-Adresse, den Browsertyp, das Betriebssystem, Referrer-URLs, Geräteinformationen und Ihr Surfverhalten. Dies erfolgt über Cookies und ähnliche Tracking-Technologien.",
      "Lorsque vous visitez notre site web, nous collectons automatiquement certaines informations, notamment votre adresse IP, le type de navigateur, le système d'exploitation, les URL de référence, les informations sur l'appareil et le comportement de navigation. Ces informations sont collectées via des cookies et des technologies de suivi similaires.",
      "Cuando visita nuestro sitio web, recopilamos automáticamente cierta información, incluida su dirección IP, tipo de navegador, sistema operativo, URL de referencia, información del dispositivo y comportamiento de navegación. Esto se recopila mediante cookies y tecnologías de seguimiento similares."
    ),
  },
  {
    type: "subheading",
    text_translations: tr(
      "Analytics Data",
      "Analysedaten",
      "Données d'analyse",
      "Datos analíticos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We use analytics tools to understand how visitors interact with our website. This includes page views, time spent on pages, click patterns, and navigation paths. This data is anonymized and aggregated.",
      "Wir verwenden Analysetools, um zu verstehen, wie Besucher mit unserer Website interagieren. Dazu gehören Seitenaufrufe, Verweildauer, Klickmuster und Navigationspfade. Diese Daten werden anonymisiert und aggregiert.",
      "Nous utilisons des outils d'analyse pour comprendre comment les visiteurs interagissent avec notre site web. Cela comprend les pages vues, le temps passé sur les pages, les schémas de clics et les parcours de navigation. Ces données sont anonymisées et agrégées.",
      "Utilizamos herramientas de análisis para comprender cómo interactúan los visitantes con nuestro sitio web. Esto incluye vistas de página, tiempo en las páginas, patrones de clics y rutas de navegación. Estos datos se anonimizan y agregan."
    ),
  },
  {
    type: "heading",
    icon: "shield-check",
    text_translations: tr(
      "3. How We Use Your Information",
      "3. Wie wir Ihre Informationen verwenden",
      "3. Comment nous utilisons vos informations",
      "3. Cómo utilizamos su información"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We use the information we collect for the following purposes:",
      "Wir verwenden die erfassten Informationen für folgende Zwecke:",
      "Nous utilisons les informations que nous collectons aux fins suivantes :",
      "Utilizamos la información que recopilamos para los siguientes fines:"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "To respond to your inquiries and provide services you request",
          "Um auf Ihre Anfragen zu antworten und die von Ihnen angeforderten Dienste bereitzustellen",
          "Pour répondre à vos demandes et fournir les services que vous demandez",
          "Para responder a sus consultas y proporcionar los servicios que solicita"
        ),
      },
      {
        text_translations: tr(
          "To improve our website, services, and user experience",
          "Um unsere Website, Dienste und das Nutzererlebnis zu verbessern",
          "Pour améliorer notre site web, nos services et l'expérience utilisateur",
          "Para mejorar nuestro sitio web, nuestros servicios y la experiencia del usuario"
        ),
      },
      {
        text_translations: tr(
          "To send relevant marketing communications (with your consent)",
          "Um relevante Marketingmitteilungen zu senden (mit Ihrer Einwilligung)",
          "Pour envoyer des communications marketing pertinentes (avec votre consentement)",
          "Para enviar comunicaciones de marketing relevantes (con su consentimiento)"
        ),
      },
      {
        text_translations: tr(
          "To analyze website traffic and usage patterns",
          "Um Website-Traffic und Nutzungsmuster zu analysieren",
          "Pour analyser le trafic du site web et les modèles d'utilisation",
          "Para analizar el tráfico del sitio web y los patrones de uso"
        ),
      },
      {
        text_translations: tr(
          "To protect against fraudulent or unauthorized activity",
          "Um vor betrügerischen oder unbefugten Aktivitäten zu schützen",
          "Pour vous protéger contre les activités frauduleuses ou non autorisées",
          "Para proteger contra actividades fraudulentas o no autorizadas"
        ),
      },
      {
        text_translations: tr(
          "To comply with legal obligations and enforce our terms",
          "Um gesetzlichen Verpflichtungen nachzukommen und unsere Bedingungen durchzusetzen",
          "Pour respecter les obligations légales et faire appliquer nos conditions",
          "Para cumplir con las obligaciones legales y hacer cumplir nuestros términos"
        ),
      },
    ],
  },
  {
    type: "heading",
    icon: "lock",
    text_translations: tr(
      "4. Data Protection & Security",
      "4. Datenschutz & Sicherheit",
      "4. Protection des données et sécurité",
      "4. Protección de datos y seguridad"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, firewalls, secure server infrastructure, and regular security assessments. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
      "Wir implementieren angemessene technische und organisatorische Sicherheitsmaßnahmen, um Ihre persönlichen Informationen vor unbefugtem Zugriff, Veränderung, Offenlegung oder Zerstörung zu schützen. Dazu gehören Verschlüsselung, Firewalls, sichere Serverinfrastruktur und regelmäßige Sicherheitsüberprüfungen. Keine Übertragung über das Internet oder elektronische Speicherung ist jedoch zu 100 % sicher, und wir können keine absolute Sicherheit garantieren.",
      "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos informations personnelles contre tout accès, modification, divulgation ou destruction non autorisés. Ces mesures comprennent le chiffrement, les pare-feu, une infrastructure de serveurs sécurisée et des évaluations de sécurité régulières. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sécurisée à 100 %, et nous ne pouvons pas garantir une sécurité absolue.",
      "Implementamos medidas de seguridad técnicas y organizativas adecuadas para proteger su información personal contra accesos, alteraciones, divulgaciones o destrucciones no autorizadas. Estas medidas incluyen cifrado, cortafuegos, infraestructura de servidores segura y evaluaciones de seguridad periódicas. Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100 % seguro, y no podemos garantizar una seguridad absoluta."
    ),
  },
  {
    type: "heading",
    icon: "cookie",
    text_translations: tr(
      "5. Cookies & Tracking Technologies",
      "5. Cookies & Tracking-Technologien",
      "5. Cookies et technologies de suivi",
      "5. Cookies y tecnologías de seguimiento"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and deliver personalized content. For detailed information about the cookies we use and how you can manage your preferences, please see our [Cookie Policy](/cookie-policy).",
      "Unsere Website verwendet Cookies und ähnliche Tracking-Technologien, um Ihr Surferlebnis zu verbessern, Website-Traffic zu analysieren und personalisierte Inhalte bereitzustellen. Detaillierte Informationen zu den von uns verwendeten Cookies und zur Verwaltung Ihrer Präferenzen finden Sie in unserer [Cookie-Richtlinie](/cookie-policy).",
      "Notre site web utilise des cookies et des technologies de suivi similaires pour améliorer votre expérience de navigation, analyser le trafic du site et fournir un contenu personnalisé. Pour plus d'informations sur les cookies que nous utilisons et sur la gestion de vos préférences, veuillez consulter notre [politique de cookies](/cookie-policy).",
      "Nuestro sitio web utiliza cookies y tecnologías de seguimiento similares para mejorar su experiencia de navegación, analizar el tráfico del sitio y ofrecer contenido personalizado. Para obtener información detallada sobre las cookies que utilizamos y cómo gestionar sus preferencias, consulte nuestra [Política de Cookies](/cookie-policy)."
    ),
  },
  {
    type: "heading",
    icon: "globe",
    text_translations: tr(
      "6. Third-Party Sharing",
      "6. Weitergabe an Dritte",
      "6. Partage avec des tiers",
      "6. Compartir con terceros"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential. We may also disclose information when required by law or to protect our rights.",
      "Wir verkaufen, handeln oder vermieten Ihre persönlichen Informationen nicht an Dritte. Wir können Informationen mit vertrauenswürdigen Dienstleistern teilen, die uns beim Betrieb unserer Website und unseres Geschäfts unterstützen, sofern diese sich zur Vertraulichkeit verpflichten. Wir können Informationen auch offenlegen, wenn dies gesetzlich vorgeschrieben ist oder zum Schutz unserer Rechte erforderlich ist.",
      "Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager des informations avec des prestataires de services de confiance qui nous aident à exploiter notre site web et à mener nos activités, à condition qu'ils acceptent de garder ces informations confidentielles. Nous pouvons également divulguer des informations lorsque la loi l'exige ou pour protéger nos droits.",
      "No vendemos, intercambiamos ni alquilamos su información personal a terceros. Podemos compartir información con proveedores de servicios de confianza que nos ayudan a operar nuestro sitio web y a realizar nuestro negocio, siempre que acepten mantener esta información confidencial. También podemos divulgar información cuando lo exija la ley o para proteger nuestros derechos."
    ),
  },
  {
    type: "heading",
    icon: "clipboard-check",
    text_translations: tr(
      "7. Your Rights",
      "7. Ihre Rechte",
      "7. Vos droits",
      "7. Sus derechos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Depending on your location, you may have the following rights regarding your personal data:",
      "Je nach Ihrem Standort haben Sie möglicherweise die folgenden Rechte in Bezug auf Ihre personenbezogenen Daten:",
      "Selon votre lieu de résidence, vous pouvez disposer des droits suivants concernant vos données personnelles :",
      "Según su ubicación, es posible que tenga los siguientes derechos con respecto a sus datos personales:"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "The right to access your personal data",
          "Das Recht auf Zugriff auf Ihre personenbezogenen Daten",
          "Le droit d'accéder à vos données personnelles",
          "El derecho a acceder a sus datos personales"
        ),
      },
      {
        text_translations: tr(
          "The right to rectify inaccurate or incomplete data",
          "Das Recht auf Berichtigung unrichtiger oder unvollständiger Daten",
          "Le droit de rectifier des données inexactes ou incomplètes",
          "El derecho a rectificar datos inexactos o incompletos"
        ),
      },
      {
        text_translations: tr(
          "The right to request deletion of your data",
          "Das Recht auf Löschung Ihrer Daten",
          "Le droit de demander la suppression de vos données",
          "El derecho a solicitar la eliminación de sus datos"
        ),
      },
      {
        text_translations: tr(
          "The right to restrict or object to processing",
          "Das Recht auf Einschränkung der Verarbeitung oder Widerspruch",
          "Le droit de restreindre ou de vous opposer au traitement",
          "El derecho a restringir u oponerse al procesamiento"
        ),
      },
      {
        text_translations: tr(
          "The right to data portability",
          "Das Recht auf Datenübertragbarkeit",
          "Le droit à la portabilité des données",
          "El derecho a la portabilidad de los datos"
        ),
      },
      {
        text_translations: tr(
          "The right to withdraw consent at any time",
          "Das Recht, Ihre Einwilligung jederzeit zu widerrufen",
          "Le droit de retirer votre consentement à tout moment",
          "El derecho a retirar el consentimiento en cualquier momento"
        ),
      },
    ],
  },
  {
    type: "paragraph",
    text_translations: tr(
      "To exercise any of these rights, please contact us at [privacy@stratifit.com](mailto:privacy@stratifit.com).",
      "Um eines dieser Rechte auszuüben, kontaktieren Sie uns bitte unter [privacy@stratifit.com](mailto:privacy@stratifit.com).",
      "Pour exercer l'un de ces droits, veuillez nous contacter à [privacy@stratifit.com](mailto:privacy@stratifit.com).",
      "Para ejercer cualquiera de estos derechos, contáctenos en [privacy@stratifit.com](mailto:privacy@stratifit.com)."
    ),
  },
  {
    type: "heading",
    icon: "refresh",
    text_translations: tr(
      "8. Changes to This Policy",
      "8. Änderungen dieser Richtlinie",
      "8. Modifications de cette politique",
      "8. Cambios en esta política"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically. Continued use of our services after changes constitutes acceptance of the updated policy.",
      "Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Änderungen werden auf dieser Seite mit einem aktualisierten Revisionsdatum veröffentlicht. Wir empfehlen Ihnen, diese Richtlinie regelmäßig zu überprüfen. Die weitere Nutzung unserer Dienste nach Änderungen gilt als Zustimmung zur aktualisierten Richtlinie.",
      "Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Les modifications seront publiées sur cette page avec une date de révision mise à jour. Nous vous encourageons à consulter cette politique périodiquement. L'utilisation continue de nos services après les modifications constitue une acceptation de la politique mise à jour.",
      "Podemos actualizar esta Política de Privacidad de vez en cuando. Los cambios se publicarán en esta página con una fecha de revisión actualizada. Le recomendamos revisar esta política periódicamente. El uso continuado de nuestros servicios después de los cambios constituye la aceptación de la política actualizada."
    ),
  },
  {
    type: "subheading",
    divider: true,
    text_translations: tr(
      "Contact Us",
      "Kontakt",
      "Contact",
      "Contacto"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "If you have any questions about this Privacy Policy, please contact us at [privacy@stratifit.com](mailto:privacy@stratifit.com).",
      "Wenn Sie Fragen zu dieser Datenschutzerklärung haben, kontaktieren Sie uns bitte unter [privacy@stratifit.com](mailto:privacy@stratifit.com).",
      "Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à [privacy@stratifit.com](mailto:privacy@stratifit.com).",
      "Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos en [privacy@stratifit.com](mailto:privacy@stratifit.com)."
    ),
  },
];

// =============================================================================
// Terms of Service
// =============================================================================

export const TERMS_FALLBACK_BLOCKS: DetailPageBlock[] = [
  {
    type: "heading",
    icon: "file-text",
    text_translations: tr(
      "1. Acceptance of Terms",
      "1. Annahme der Bedingungen",
      "1. Acceptation des conditions",
      "1. Aceptación de los términos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "These Terms of Service (\"Terms\") govern your access to and use of the Stratifit website and services. By accessing our website or using our services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our website or services.",
      "Diese Nutzungsbedingungen („Bedingungen“) regeln Ihren Zugriff auf und Ihre Nutzung der Stratifit-Website und -Dienste. Durch den Zugriff auf unsere Website oder die Nutzung unserer Dienste erklären Sie sich mit diesen Bedingungen einverstanden. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, nutzen Sie unsere Website oder Dienste bitte nicht.",
      "Ces conditions d'utilisation (« Conditions ») régissent votre accès à et votre utilisation du site web et des services de Stratifit. En accédant à notre site web ou en utilisant nos services, vous acceptez d'être lié par ces Conditions. Si vous n'êtes pas d'accord avec une partie de ces Conditions, veuillez ne pas utiliser notre site web ou nos services.",
      "Estos Términos del Servicio («Términos») rigen su acceso y uso del sitio web y los servicios de Stratifit. Al acceder a nuestro sitio web o utilizar nuestros servicios, acepta quedar sujeto a estos Términos. Si no está de acuerdo con alguna parte de estos Términos, no utilice nuestro sitio web ni nuestros servicios."
    ),
  },
  {
    type: "heading",
    icon: "globe",
    text_translations: tr(
      "2. Services",
      "2. Dienstleistungen",
      "2. Services",
      "2. Servicios"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Stratifit provides digital agency services including brand design, website development, AI & automation, and growth marketing. Specific deliverables, timelines, and pricing are defined in individual proposals or agreements.",
      "Stratifit bietet Digitalagentur-Leistungen an, darunter Markengestaltung, Webentwicklung, KI & Automatisierung und Growth Marketing. Konkrete Leistungen, Zeitpläne und Preise werden in individuellen Angeboten oder Vereinbarungen festgelegt.",
      "Stratifit fournit des services d'agence digitale, notamment le design de marque, le développement web, l'IA & l'automatisation et le marketing de croissance. Les livrables, délais et tarifs spécifiques sont définis dans des propositions ou accords individuels.",
      "Stratifit ofrece servicios de agencia digital, incluidos diseño de marca, desarrollo web, IA y automatización, y marketing de crecimiento. Los entregables, plazos y precios específicos se definen en propuestas o acuerdos individuales."
    ),
  },
  {
    type: "heading",
    icon: "scale",
    text_translations: tr(
      "3. Intellectual Property",
      "3. Geistiges Eigentum",
      "3. Propriété intellectuelle",
      "3. Propiedad intelectual"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "All content, designs, and materials delivered remain the intellectual property of their respective owners unless agreed otherwise in writing. You retain ownership of your content, and Stratifit retains ownership of its methodologies, tools, and pre-existing materials.",
      "Alle gelieferten Inhalte, Designs und Materialien bleiben Eigentum der jeweiligen Rechteinhaber, sofern nichts anderes schriftlich vereinbart wurde. Sie behalten das Eigentum an Ihren Inhalten, während Stratifit das Eigentum an seinen Methoden, Werkzeugen und vorbestehenden Materialien behält.",
      "Tous les contenus, designs et matériels livrés restent la propriété intellectuelle de leurs propriétaires respectifs, sauf accord écrit contraire. Vous conservez la propriété de vos contenus, et Stratifit conserve la propriété de ses méthodologies, outils et matériaux préexistants.",
      "Todo el contenido, los diseños y los materiales entregados siguen siendo propiedad intelectual de sus respectivos propietarios, salvo acuerdo escrito en contrario. Usted conserva la propiedad de su contenido, y Stratifit conserva la propiedad de sus metodologías, herramientas y materiales preexistentes."
    ),
  },
  {
    type: "heading",
    icon: "credit-card",
    text_translations: tr(
      "4. Payments & Fees",
      "4. Zahlungen und Gebühren",
      "4. Paiements et frais",
      "4. Pagos y tarifas"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Fees for services are specified in your proposal or agreement. Unless stated otherwise, invoices are due within the agreed payment terms. Late payments may suspend ongoing work until the balance is settled.",
      "Honorare für Leistungen sind in Ihrem Angebot oder Ihrer Vereinbarung festgelegt. Sofern nicht anders angegeben, sind Rechnungen innerhalb der vereinbarten Zahlungsfristen fällig. Verspätete Zahlungen können laufende Arbeiten bis zum Ausgleich des Saldos aussetzen.",
      "Les honoraires des services sont spécifiés dans votre proposition ou accord. Sauf indication contraire, les factures sont dues dans les délais de paiement convenus. Les retards de paiement peuvent suspendre le travail en cours jusqu'à l'apurement du solde.",
      "Los honorarios de los servicios se especifican en su propuesta o acuerdo. Salvo que se indique lo contrario, las facturas vencen dentro de los plazos de pago acordados. Los pagos atrasados pueden suspender el trabajo en curso hasta que se salde el saldo."
    ),
  },
  {
    type: "heading",
    icon: "triangle-alert",
    text_translations: tr(
      "5. Limitation of Liability",
      "5. Haftungsbeschränkung",
      "5. Limitation de responsabilité",
      "5. Limitación de responsabilidad"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "To the maximum extent permitted by law, Stratifit shall not be liable for indirect, incidental, special, or consequential damages arising from the use of our website or services. Our total liability is limited to the amount paid by you for the specific service giving rise to the claim.",
      "Im gesetzlich maximal zulässigen Umfang haftet Stratifit nicht für mittelbare, zufällige, besondere oder Folgeschäden, die aus der Nutzung unserer Website oder Dienste entstehen. Unsere Gesamthaftung ist auf den Betrag beschränkt, den Sie für den jeweiligen Anspruch auslösenden Dienst gezahlt haben.",
      "Dans la mesure maximale permise par la loi, Stratifit ne sera pas responsable des dommages indirects, accessoires, spéciaux ou consécutifs découlant de l'utilisation de notre site web ou de nos services. Notre responsabilité totale est limitée au montant payé par vous pour le service spécifique à l'origine de la réclamation.",
      "En la máxima medida permitida por la ley, Stratifit no será responsable de daños indirectos, incidentales, especiales o consecuentes derivados del uso de nuestro sitio web o servicios. Nuestra responsabilidad total se limita al monto pagado por usted por el servicio específico que da lugar a la reclamación."
    ),
  },
  {
    type: "heading",
    icon: "refresh",
    text_translations: tr(
      "6. Changes to These Terms",
      "6. Änderungen dieser Bedingungen",
      "6. Modifications de ces conditions",
      "6. Cambios en estos términos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We may update these Terms from time to time. Changes will be posted on this page with an updated revision date. Continued use of our website or services after changes constitutes acceptance of the updated Terms.",
      "Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Änderungen werden auf dieser Seite mit einem aktualisierten Revisionsdatum veröffentlicht. Die weitere Nutzung unserer Website oder Dienste nach Änderungen gilt als Zustimmung zu den aktualisierten Bedingungen.",
      "Nous pouvons mettre à jour ces Conditions de temps à autre. Les modifications seront publiées sur cette page avec une date de révision mise à jour. L'utilisation continue de notre site web ou de nos services après les modifications constitue une acceptation des Conditions mises à jour.",
      "Podemos actualizar estos Términos de vez en cuando. Los cambios se publicarán en esta página con una fecha de revisión actualizada. El uso continuado de nuestro sitio web o servicios después de los cambios constituye la aceptación de los Términos actualizados."
    ),
  },
  {
    type: "subheading",
    divider: true,
    text_translations: tr("Contact Us", "Kontakt", "Contact", "Contacto"),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "If you have any questions about these Terms, please contact us at [hello@stratifit.com](mailto:hello@stratifit.com).",
      "Wenn Sie Fragen zu diesen Bedingungen haben, kontaktieren Sie uns bitte unter [hello@stratifit.com](mailto:hello@stratifit.com).",
      "Si vous avez des questions concernant ces Conditions, veuillez nous contacter à [hello@stratifit.com](mailto:hello@stratifit.com).",
      "Si tiene alguna pregunta sobre estos Términos, contáctenos en [hello@stratifit.com](mailto:hello@stratifit.com)."
    ),
  },
];

// =============================================================================
// Cookie Policy
// =============================================================================

export const COOKIE_FALLBACK_BLOCKS: DetailPageBlock[] = [
  {
    type: "heading",
    icon: "cookie",
    text_translations: tr(
      "1. What Are Cookies",
      "1. Was sind Cookies",
      "1. Que sont les cookies",
      "1. Qué son las cookies"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences, understand how you use the site, and improve your browsing experience.",
      "Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Gerät gespeichert werden. Sie helfen der Website, Ihre Präferenzen zu speichern, zu verstehen, wie Sie die Seite nutzen, und Ihr Surferlebnis zu verbessern.",
      "Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Ils aident le site à mémoriser vos préférences, à comprendre comment vous utilisez le site et à améliorer votre expérience de navigation.",
      "Las cookies son pequeños archivos de texto almacenados en su dispositivo cuando visita un sitio web. Ayudan al sitio a recordar sus preferencias, comprender cómo utiliza el sitio y mejorar su experiencia de navegación."
    ),
  },
  {
    type: "heading",
    icon: "settings",
    text_translations: tr(
      "2. How We Use Cookies",
      "2. Wie wir Cookies verwenden",
      "2. Comment nous utilisons les cookies",
      "2. Cómo utilizamos las cookies"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We use cookies and similar technologies for the following purposes:",
      "Wir verwenden Cookies und ähnliche Technologien für folgende Zwecke:",
      "Nous utilisons des cookies et des technologies similaires aux fins suivantes :",
      "Utilizamos cookies y tecnologías similares para los siguientes fines:"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "Essential functionality, keeping the website secure and usable",
          "Grundfunktionen, Sicherheit und Nutzbarkeit der Website gewährleisten",
          "Fonctionnalités essentielles, maintenir le site sécurisé et utilisable",
          "Funcionalidad esencial: mantener el sitio seguro y utilizable"
        ),
      },
      {
        text_translations: tr(
          "Analytics, understanding how visitors use the site",
          "Analyse, verstehen, wie Besucher die Website nutzen",
          "Analyse, comprendre comment les visiteurs utilisent le site",
          "Análisis: comprender cómo usan el sitio los visitantes"
        ),
      },
      {
        text_translations: tr(
          "Preferences, remembering your language and display settings",
          "Präferenzen, Sprache und Anzeigeeinstellungen speichern",
          "Préférences, mémoriser votre langue et vos paramètres d'affichage",
          "Preferencias: recordar su idioma y configuración de visualización"
        ),
      },
    ],
  },
  {
    type: "heading",
    icon: "clipboard-check",
    text_translations: tr(
      "3. Cookie Categories",
      "3. Cookie-Kategorien",
      "3. Catégories de cookies",
      "3. Categorías de cookies"
    ),
  },
  {
    type: "panel",
    title_translations: tr(
      "Essential cookies",
      "Notwendige Cookies",
      "Cookies essentiels",
      "Cookies esenciales"
    ),
    tag_translations: tr(
      "Always active",
      "Immer aktiv",
      "Toujours actifs",
      "Siempre activas"
    ),
    body_translations: tr(
      "These cookies are required for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as setting your privacy preferences or filling in forms.",
      "Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden. Sie werden in der Regel nur als Reaktion auf Ihre Aktionen gesetzt, etwa wenn Sie Datenschutzeinstellungen festlegen oder Formulare ausfüllen.",
      "Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés. Ils ne sont généralement définis qu'en réponse à vos actions, comme la définition de vos préférences de confidentialité ou le remplissage de formulaires.",
      "Estas cookies son necesarias para que el sitio web funcione y no se pueden desactivar. Por lo general, solo se establecen en respuesta a acciones realizadas por usted, como configurar sus preferencias de privacidad o completar formularios."
    ),
  },
  {
    type: "panel",
    title_translations: tr(
      "Analytics cookies",
      "Analyse-Cookies",
      "Cookies d'analyse",
      "Cookies de análisis"
    ),
    tag_translations: tr("Optional", "Optional", "Facultatif", "Opcional"),
    body_translations: tr(
      "These cookies help us understand how visitors interact with the website by collecting and reporting information anonymously. All data is aggregated and does not identify you personally.",
      "Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, indem sie Informationen anonym sammeln und melden. Alle Daten werden aggregiert und identifizieren Sie nicht persönlich.",
      "Ces cookies nous aident à comprendre comment les visiteurs interagissent avec le site en collectant et en rapportant des informations de manière anonyme. Toutes les données sont agrégées et ne vous identifient pas personnellement.",
      "Estas cookies nos ayudan a comprender cómo interactúan los visitantes con el sitio mediante la recopilación y el informe anónimo de información. Todos los datos se agregan y no lo identifican personalmente."
    ),
  },
  {
    type: "panel",
    title_translations: tr(
      "Marketing cookies",
      "Marketing-Cookies",
      "Cookies marketing",
      "Cookies de marketing"
    ),
    tag_translations: tr("Optional", "Optional", "Facultatif", "Opcional"),
    body_translations: tr(
      "These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant advertisements on other sites. We do not currently use marketing cookies unless you consent.",
      "Diese Cookies können über unsere Website von unseren Werbepartnern gesetzt werden. Sie können verwendet werden, um ein Profil Ihrer Interessen zu erstellen und Ihnen relevante Werbung auf anderen Websites anzuzeigen. Wir verwenden derzeit keine Marketing-Cookies, es sei denn, Sie stimmen zu.",
      "Ces cookies peuvent être définis via notre site par nos partenaires publicitaires. Ils peuvent être utilisés pour créer un profil de vos intérêts et vous montrer des publicités pertinentes sur d'autres sites. Nous n'utilisons actuellement pas de cookies marketing, sauf si vous y consentez.",
      "Estas cookies pueden establecerse a través de nuestro sitio por parte de nuestros socios publicitarios. Pueden utilizarse para crear un perfil de sus intereses y mostrarle anuncios relevantes en otros sitios. Actualmente no utilizamos cookies de marketing a menos que usted dé su consentimiento."
    ),
  },
  {
    type: "heading",
    icon: "smartphone",
    text_translations: tr(
      "4. Managing Cookies",
      "4. Cookies verwalten",
      "4. Gestion des cookies",
      "4. Gestión de cookies"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "You can control and delete cookies through your browser settings at any time. Most browsers allow you to block or remove cookies, and you can set your browser to alert you before a cookie is placed. Disabling essential cookies may affect site functionality.",
      "Sie können Cookies jederzeit über die Einstellungen Ihres Browsers steuern und löschen. Die meisten Browser ermöglichen es Ihnen, Cookies zu blockieren oder zu entfernen und Ihren Browser so einzustellen, dass er Sie vor dem Setzen eines Cookies warnt. Das Deaktivieren notwendiger Cookies kann die Funktionalität der Website beeinträchtigen.",
      "Vous pouvez contrôler et supprimer les cookies via les paramètres de votre navigateur à tout moment. La plupart des navigateurs vous permettent de bloquer ou de supprimer les cookies et de définir des alertes avant qu'un cookie ne soit placé. La désactivation des cookies essentiels peut affecter le fonctionnement du site.",
      "Puede controlar y eliminar las cookies a través de la configuración de su navegador en cualquier momento. La mayoría de los navegadores le permiten bloquear o eliminar cookies y configurar alertas antes de que se coloque una cookie. Deshabilitar las cookies esenciales puede afectar el funcionamiento del sitio."
    ),
  },
  {
    type: "heading",
    icon: "refresh",
    text_translations: tr(
      "5. Changes to This Policy",
      "5. Änderungen dieser Richtlinie",
      "5. Modifications de cette politique",
      "5. Cambios en esta política"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the updated policy.",
      "Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren. Änderungen werden auf dieser Seite mit einem aktualisierten Revisionsdatum veröffentlicht. Die weitere Nutzung unserer Website nach Änderungen gilt als Zustimmung zur aktualisierten Richtlinie.",
      "Nous pouvons mettre à jour cette politique de cookies de temps à autre. Les modifications seront publiées sur cette page avec une date de révision mise à jour. L'utilisation continue de notre site web après les modifications constitue une acceptation de la politique mise à jour.",
      "Podemos actualizar esta Política de Cookies de vez en cuando. Los cambios se publicarán en esta página con una fecha de revisión actualizada. El uso continuado de nuestro sitio web después de los cambios constituye la aceptación de la política actualizada."
    ),
  },
  {
    type: "subheading",
    divider: true,
    text_translations: tr("Contact Us", "Kontakt", "Contact", "Contacto"),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "If you have any questions about this Cookie Policy, please contact us at [hello@stratifit.com](mailto:hello@stratifit.com).",
      "Wenn Sie Fragen zu dieser Cookie-Richtlinie haben, kontaktieren Sie uns bitte unter [hello@stratifit.com](mailto:hello@stratifit.com).",
      "Si vous avez des questions concernant cette politique de cookies, veuillez nous contacter à [hello@stratifit.com](mailto:hello@stratifit.com).",
      "Si tiene alguna pregunta sobre esta Política de Cookies, contáctenos en [hello@stratifit.com](mailto:hello@stratifit.com)."
    ),
  },
];

// =============================================================================
// Imprint / Impressum
// =============================================================================

export const IMPRINT_FALLBACK_BLOCKS: DetailPageBlock[] = [
  {
    type: "heading",
    icon: "file-text",
    text_translations: tr("Company", "Unternehmen", "Société", "Empresa"),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Stratifit\nAddress to be provided",
      "Stratifit\nAnschrift folgt",
      "Stratifit\nAdresse à fournir",
      "Stratifit\nDirección por confirmar"
    ),
  },
  {
    type: "heading",
    icon: "globe",
    text_translations: tr("Contact", "Kontakt", "Contact", "Contacto"),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Email: [hello@stratifit.com](mailto:hello@stratifit.com)",
      "E-Mail: [hello@stratifit.com](mailto:hello@stratifit.com)",
      "E-mail : [hello@stratifit.com](mailto:hello@stratifit.com)",
      "Correo: [hello@stratifit.com](mailto:hello@stratifit.com)"
    ),
  },
  {
    type: "heading",
    icon: "shield-check",
    text_translations: tr(
      "Represented by",
      "Vertreten durch",
      "Représentée par",
      "Representada por"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Managing director / owner to be provided.",
      "Geschäftsführer / Inhaber folgt.",
      "Directeur / propriétaire à fournir.",
      "Director / propietario por confirmar."
    ),
  },
  {
    type: "heading",
    icon: "clipboard-check",
    text_translations: tr(
      "Responsible for content",
      "Verantwortlich für den Inhalt",
      "Responsable du contenu",
      "Responsable del contenido"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "To be provided.",
      "Folgt.",
      "À fournir.",
      "Por confirmar."
    ),
  },
  {
    type: "note",
    text_translations: tr(
      "Note: This placeholder must be completed with the legally required company information before launch.",
      "Hinweis: Dieser Platzhalter muss vor dem Launch mit den gesetzlich vorgeschriebenen Unternehmensangaben vervollständigt werden.",
      "Remarque : ce texte provisoire doit être complété avec les informations légales requises avant le lancement.",
      "Nota: este texto provisional debe completarse con la información legal requerida antes del lanzamiento."
    ),
  },
];

// =============================================================================
// Careers
// =============================================================================

export const CAREERS_FALLBACK_BLOCKS: DetailPageBlock[] = [
  {
    type: "heading",
    icon: "file-text",
    text_translations: tr(
      "Why Stratifit",
      "Warum Stratifit",
      "Pourquoi Stratifit",
      "Por qué Stratifit"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "You will work on premium projects with modern technology, collaborate directly with leadership, and see the real impact of your work on client outcomes.",
      "Sie arbeiten an Premium-Projekten mit moderner Technologie, arbeiten direkt mit der Führungsebene zusammen und sehen die echten Auswirkungen Ihrer Arbeit auf die Ergebnisse unserer Kunden.",
      "Vous travaillerez sur des projets premium avec des technologies modernes, collaborerez directement avec la direction et verrez l'impact réel de votre travail sur les résultats des clients.",
      "Trabajará en proyectos premium con tecnología moderna, colaborará directamente con el liderazgo y verá el impacto real de su trabajo en los resultados de los clientes."
    ),
  },
  {
    type: "heading",
    icon: "eye",
    text_translations: tr(
      "How we work",
      "Wie wir arbeiten",
      "Comment nous travaillons",
      "Cómo trabajamos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We are async-first: tight specs, short meetings, and high trust. We hire for seniority, autonomy, and judgment.",
      "Wir arbeiten asynchron: präzise Spezifikationen, kurze Meetings und hohes Vertrauen. Wir stellen auf Erfahrung, Eigenverantwortung und Urteilsvermögen ein.",
      "Nous privilégions l'asynchrone : des spécifications précises, des réunions courtes et une grande confiance. Nous recrutons pour la séniorité, l'autonomie et le jugement.",
      "Somos async-first: especificaciones precisas, reuniones cortas y alta confianza. Contratamos por seniority, autonomía y criterio."
    ),
  },
  {
    type: "heading",
    icon: "clipboard-check",
    text_translations: tr(
      "Open positions",
      "Offene Positionen",
      "Postes ouverts",
      "Puestos abiertos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We hire on a rolling basis for design, engineering, and growth roles. If you are exceptional at what you do, we want to hear from you.",
      "Wir stellen laufend für Design-, Engineering- und Growth-Positionen ein. Wenn Sie außergewöhnlich gut in dem sind, was Sie tun, möchten wir von Ihnen hören.",
      "Nous recrutons en continu pour des postes en design, ingénierie et croissance. Si vous êtes exceptionnel dans ce que vous faites, nous voulons vous connaître.",
      "Contratamos de forma continua para puestos de diseño, ingeniería y crecimiento. Si eres excepcional en lo que haces, queremos saber de ti."
    ),
  },
  {
    type: "heading",
    icon: "refresh",
    text_translations: tr("Apply", "Bewerben", "Postuler", "Aplicar"),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Send your portfolio or CV through the contact page and we will get back to you within a few days.",
      "Senden Sie Ihr Portfolio oder Ihren Lebenslauf über die Kontaktseite, wir melden uns innerhalb weniger Tage.",
      "Envoyez votre portfolio ou CV via la page contact et nous vous répondrons sous quelques jours.",
      "Envíe su portafolio o CV a través de la página de contacto y le responderemos en unos días."
    ),
  },
];

// =============================================================================
// Hiring — open roles & process
// =============================================================================

export const HIRING_FALLBACK_BLOCKS: DetailPageBlock[] = [
  {
    type: "heading",
    icon: "file-text",
    text_translations: tr(
      "We're Hiring",
      "Wir stellen ein",
      "Nous recrutons",
      "Estamos contratando"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We grow one role at a time and only hire people we would be proud to work alongside. If you care deeply about your craft, strategy, design, engineering, or growth, we want to hear from you.",
      "Wir bauen unser Team Rolle für Rolle auf und stellen nur Menschen ein, mit denen wir gerne zusammenarbeiten. Wenn Ihnen Ihr Handwerk wichtig ist, Strategie, Design, Engineering oder Growth, möchten wir von Ihnen hören.",
      "Nous grandissons un poste à la fois et n'embauchons que des personnes avec lesquelles nous serions fiers de travailler. Si votre métier vous passionne, stratégie, design, ingénierie ou croissance, nous voulons vous connaître.",
      "Crecemos un rol a la vez y solo contratamos personas con las que nos enorgullecería trabajar. Si te apasiona tu oficio, estrategia, diseño, ingeniería o crecimiento, queremos saber de ti."
    ),
  },
  {
    type: "heading",
    icon: "eye",
    text_translations: tr(
      "What We Look For",
      "Was wir suchen",
      "Ce que nous recherchons",
      "Qué buscamos"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "Obsession with craft and attention to detail",
          "Leidenschaft für Handwerkskunst und Liebe zum Detail",
          "Obsession du métier et souci du détail",
          "Obsesión por el oficio y atención al detalle"
        ),
      },
      {
        text_translations: tr(
          "Ownership, autonomy, and sound judgment",
          "Eigenverantwortung, Selbstständigkeit und Urteilsvermögen",
          "Responsabilité, autonomie et bon jugement",
          "Responsabilidad, autonomía y buen criterio"
        ),
      },
      {
        text_translations: tr(
          "Clear, honest, and direct communication",
          "Klare, ehrliche und direkte Kommunikation",
          "Communication claire, honnête et directe",
          "Comunicación clara, honesta y directa"
        ),
      },
      {
        text_translations: tr(
          "Curiosity and a commitment to continuous learning",
          "Neugier und der Wille zu kontinuierlichem Lernen",
          "Curiosité et engagement envers l'apprentissage continu",
          "Curiosidad y compromiso con el aprendizaje continuo"
        ),
      },
    ],
  },
  {
    type: "heading",
    icon: "clipboard-check",
    text_translations: tr(
      "Our Hiring Process",
      "Unser Einstellungsprozess",
      "Notre processus de recrutement",
      "Nuestro proceso de contratación"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "Apply, send your portfolio or CV through the contact page or by email",
          "Bewerbung, senden Sie Ihr Portfolio oder Ihren Lebenslauf über die Kontaktseite oder per E-Mail",
          "Postulez, envoyez votre portfolio ou CV via la page contact ou par e-mail",
          "Postúlate: envía tu portafolio o CV a través de la página de contacto o por correo"
        ),
      },
      {
        text_translations: tr(
          "Intro call, a short conversation about your experience and goals",
          "Erstgespräch, ein kurzes Gespräch über Ihre Erfahrung und Ziele",
          "Entretien découverte, une brève conversation sur votre expérience et vos objectifs",
          "Llamada inicial: una breve conversación sobre tu experiencia y objetivos"
        ),
      },
      {
        text_translations: tr(
          "Deep dive, a portfolio or technical review with the team",
          "Fachgespräch, Portfolio- oder technische Überprüfung mit dem Team",
          "Entretien approfondi, revue de portfolio ou technique avec l'équipe",
          "Análisis profundo: revisión de portafolio o técnica con el equipo"
        ),
      },
      {
        text_translations: tr(
          "Team interview, meet the people you would work with",
          "Team-Interview, lernen Sie die Menschen kennen, mit denen Sie arbeiten würden",
          "Entretien d'équipe, rencontrez les personnes avec lesquelles vous travailleriez",
          "Entrevista de equipo: conoce a las personas con las que trabajarías"
        ),
      },
      {
        text_translations: tr(
          "Offer, a fair, transparent offer with clear next steps",
          "Angebot, ein faires, transparentes Angebot mit klaren nächsten Schritten",
          "Offre, une offre juste et transparente avec des prochaines étapes claires",
          "Oferta: una oferta justa y transparente con próximos pasos claros"
        ),
      },
    ],
  },
  {
    type: "heading",
    icon: "shield-check",
    text_translations: tr(
      "What We Offer",
      "Was wir bieten",
      "Ce que nous offrons",
      "Qué ofrecemos"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "Remote-first culture with flexible working hours",
          "Remote-first-Kultur mit flexiblen Arbeitszeiten",
          "Culture remote-first avec horaires flexibles",
          "Cultura remota con horarios flexibles"
        ),
      },
      {
        text_translations: tr(
          "Modern tools and a personal learning budget",
          "Moderne Tools und ein persönliches Lernbudget",
          "Outils modernes et budget d'apprentissage personnel",
          "Herramientas modernas y presupuesto personal de aprendizaje"
        ),
      },
      {
        text_translations: tr(
          "Premium client projects with real strategic impact",
          "Premium-Kundenprojekte mit echter strategischer Wirkung",
          "Projets clients premium avec un réel impact stratégique",
          "Proyectos premium de clientes con impacto estratégico real"
        ),
      },
      {
        text_translations: tr(
          "Direct collaboration with leadership and zero bureaucracy",
          "Direkte Zusammenarbeit mit der Führungsebene und null Bürokratie",
          "Collaboration directe avec la direction et zéro bureaucratie",
          "Colaboración directa con el liderazgo y cero burocracia"
        ),
      },
    ],
  },
  {
    type: "heading",
    icon: "globe",
    text_translations: tr(
      "Open Roles",
      "Offene Rollen",
      "Postes ouverts",
      "Roles abiertos"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "Senior Brand Designer",
          "Senior Brand Designer",
          "Senior Brand Designer",
          "Senior Brand Designer"
        ),
      },
      {
        text_translations: tr(
          "Frontend Engineer (React / Next.js)",
          "Frontend-Entwickler (React / Next.js)",
          "Ingénieur frontend (React / Next.js)",
          "Ingeniero frontend (React / Next.js)"
        ),
      },
      {
        text_translations: tr(
          "AI & Automation Specialist",
          "KI- & Automatisierungs-Spezialist",
          "Spécialiste IA et automatisation",
          "Especialista en IA y automatización"
        ),
      },
      {
        text_translations: tr(
          "Growth Marketer",
          "Growth-Marketer",
          "Marketeur croissance",
          "Especialista en growth marketing"
        ),
      },
    ],
  },
  {
    type: "heading",
    icon: "settings",
    text_translations: tr(
      "How to Apply",
      "So bewerben Sie sich",
      "Comment postuler",
      "Cómo postularse"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Send your portfolio and CV to [careers@stratifit.com](mailto:careers@stratifit.com) or through the [contact page](/contact). We reply to every application within a few days.",
      "Senden Sie Ihr Portfolio und Ihren Lebenslauf an [careers@stratifit.com](mailto:careers@stratifit.com) oder über die [Kontaktseite](/contact). Wir antworten auf jede Bewerbung innerhalb weniger Tage.",
      "Envoyez votre portfolio et votre CV à [careers@stratifit.com](mailto:careers@stratifit.com) ou via la [page contact](/contact). Nous répondons à chaque candidature sous quelques jours.",
      "Envía tu portafolio y CV a [careers@stratifit.com](mailto:careers@stratifit.com) o a través de la [página de contacto](/contact). Respondemos a cada solicitud en unos días."
    ),
  },
];
