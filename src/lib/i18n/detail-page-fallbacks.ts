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
      "Stratifit (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy and handling personal information responsibly.",
      "Stratifit („wir“, „uns“ oder „unser“) verpflichtet sich zum Schutz Ihrer Privatsphäre und zu einem verantwortungsvollen Umgang mit personenbezogenen Daten.",
      "Stratifit (« nous », « notre » ou « nos ») s'engage à protéger votre vie privée et à traiter vos informations personnelles de manière responsable.",
      "Stratifit («nosotros», «nuestro» o «nos») se compromete a proteger su privacidad y a tratar la información personal de forma responsable."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "This Privacy Policy explains how we collect, use, disclose, and protect information when you visit [https://stratifit.com](https://stratifit.com) or use our digital services.",
      "Diese Datenschutzerklärung erläutert, wie wir Informationen erheben, verwenden, offenlegen und schützen, wenn Sie [https://stratifit.com](https://stratifit.com) besuchen oder unsere digitalen Dienstleistungen nutzen.",
      "Cette Politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons les informations lorsque vous visitez [https://stratifit.com](https://stratifit.com) ou utilisez nos services numériques.",
      "Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos la información cuando visita [https://stratifit.com](https://stratifit.com) o utiliza nuestros servicios digitales."
    ),
  },
  {
    type: "heading",
    icon: "eye",
    text_translations: tr(
      "2. Information We Collect",
      "2. Welche Informationen wir erheben",
      "2. Informations que nous collectons",
      "2. Información que recopilamos"
    ),
  },
  {
    type: "subheading",
    text_translations: tr(
      "Personal Information",
      "Personenbezogene Daten",
      "Informations personnelles",
      "Información personal"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "When you contact us through our website, we may collect information that you voluntarily provide, including:",
      "Wenn Sie uns über unsere Website kontaktieren, können wir die von Ihnen freiwillig bereitgestellten Informationen erfassen, darunter:",
      "Lorsque vous nous contactez via notre site web, nous pouvons collecter les informations que vous fournissez volontairement, notamment :",
      "Cuando se pone en contacto con nosotros a través de nuestro sitio web, podemos recopilar la información que proporciona voluntariamente, incluyendo:"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "Name",
          "Name",
          "Nom",
          "Nombre"
        ),
      },
      {
        text_translations: tr(
          "Email address",
          "E-Mail-Adresse",
          "Adresse e-mail",
          "Dirección de correo electrónico"
        ),
      },
      {
        text_translations: tr(
          "Phone number",
          "Telefonnummer",
          "Numéro de téléphone",
          "Número de teléfono"
        ),
      },
      {
        text_translations: tr(
          "Company or organization name",
          "Name des Unternehmens oder der Organisation",
          "Nom de l'entreprise ou de l'organisation",
          "Nombre de la empresa u organización"
        ),
      },
      {
        text_translations: tr(
          "Information included in your message",
          "Angaben in Ihrer Nachricht",
          "Informations incluses dans votre message",
          "Información incluida en su mensaje"
        ),
      },
      {
        text_translations: tr(
          "Other information you choose to provide",
          "Weitere Informationen, die Sie freiwillig bereitstellen",
          "Toute autre information que vous choisissez de fournir",
          "Cualquier otra información que decida proporcionar"
        ),
      },
    ],
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We use this information to respond to your inquiries, provide requested services, communicate with you, and manage our business relationship.",
      "Wir verwenden diese Informationen, um Ihre Anfragen zu beantworten, angeforderte Dienstleistungen bereitzustellen, mit Ihnen zu kommunizieren und unsere Geschäftsbeziehung zu verwalten.",
      "Nous utilisons ces informations pour répondre à vos demandes, fournir les services demandés, communiquer avec vous et gérer notre relation commerciale.",
      "Utilizamos esta información para responder a sus consultas, proporcionar los servicios solicitados, comunicarnos con usted y gestionar nuestra relación comercial."
    ),
  },
  {
    type: "subheading",
    text_translations: tr(
      "Technical Information",
      "Technische Informationen",
      "Informations techniques",
      "Información técnica"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "When you access our website, certain technical information may be processed as part of operating, securing, and maintaining the website. This may include:",
      "Beim Besuch unserer Website können bestimmte technische Informationen verarbeitet werden, die für den Betrieb, die Sicherheit und die Wartung der Website erforderlich sind. Dazu können gehören:",
      "Lorsque vous accédez à notre site web, certaines informations techniques peuvent être traitées afin d'assurer son fonctionnement, sa sécurité et sa maintenance. Il peut notamment s'agir de :",
      "Cuando accede a nuestro sitio web, cierta información técnica puede ser procesada como parte del funcionamiento, la seguridad y el mantenimiento del sitio. Esto puede incluir:"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "IP address",
          "IP-Adresse",
          "Adresse IP",
          "Dirección IP"
        ),
      },
      {
        text_translations: tr(
          "Browser and device information",
          "Browser- und Geräteinformationen",
          "Informations relatives au navigateur et à l'appareil",
          "Información del navegador y dispositivo"
        ),
      },
      {
        text_translations: tr(
          "Operating system",
          "Betriebssystem",
          "Système d'exploitation",
          "Sistema operativo"
        ),
      },
      {
        text_translations: tr(
          "Referring URL",
          "Verweisende URL",
          "URL de provenance",
          "URL de referencia"
        ),
      },
      {
        text_translations: tr(
          "Date and time of access",
          "Datum und Uhrzeit des Zugriffs",
          "Date et heure d'accès",
          "Fecha y hora de acceso"
        ),
      },
      {
        text_translations: tr(
          "Technical information relating to your visit",
          "Technische Informationen über Ihren Besuch",
          "Informations techniques relatives à votre visite",
          "Información técnica relacionada con su visita"
        ),
      },
    ],
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Some technical information may be processed by our hosting and infrastructure providers where necessary to operate and secure the website.",
      "Bestimmte technische Informationen können von unseren Hosting- und Infrastruktur-Anbietern verarbeitet werden, soweit dies für den Betrieb und die Sicherheit der Website erforderlich ist.",
      "Certaines informations techniques peuvent être traitées par nos fournisseurs d'hébergement et d'infrastructure lorsque cela est nécessaire au fonctionnement et à la sécurité du site.",
      "Parte de esta información técnica puede ser procesada por nuestros proveedores de alojamiento e infraestructura cuando sea necesario para operar y proteger el sitio web."
    ),
  },
  {
    type: "subheading",
    text_translations: tr(
      "Analytics Information",
      "Analyseinformationen",
      "Informations analytiques",
      "Información analítica"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "With your consent where required, we use analytics technologies to understand how visitors use our website and to measure website traffic and performance.",
      "Soweit Ihre Einwilligung erforderlich ist, verwenden wir Analysetechnologien, um zu verstehen, wie Besucher unsere Website nutzen und um den Website-Traffic sowie die Leistung zu messen.",
      "Lorsque votre consentement est requis, nous utilisons des technologies d'analyse pour comprendre comment les visiteurs utilisent notre site web et mesurer son trafic et ses performances.",
      "Cuando sea necesario obtener su consentimiento, utilizamos tecnologías de análisis para comprender cómo los visitantes utilizan nuestro sitio web y medir el tráfico y el rendimiento."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We use Google Analytics 4 (GA4) for detailed website analytics. Depending on your consent and settings, GA4 may process information such as pages viewed, interactions, device and browser information, approximate geographic information, and other usage data.",
      "Wir verwenden Google Analytics 4 (GA4) für detaillierte Website-Analysen. Abhängig von Ihrer Einwilligung und Ihren Einstellungen kann GA4 Informationen wie aufgerufene Seiten, Interaktionen, Geräte- und Browserinformationen, ungefähre geografische Informationen und weitere Nutzungsdaten verarbeiten.",
      "Nous utilisons Google Analytics 4 (GA4) pour les analyses détaillées du site. Selon votre consentement et vos paramètres, GA4 peut traiter des informations telles que les pages consultées, les interactions, les informations relatives à l'appareil et au navigateur, des informations géographiques approximatives et d'autres données d'utilisation.",
      "Utilizamos Google Analytics 4 (GA4) para realizar análisis detallados del sitio web. Dependiendo de su consentimiento y configuración, GA4 puede procesar información como páginas visitadas, interacciones, información del dispositivo y navegador, información geográfica aproximada y otros datos de uso."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "If you reject Analytics consent, our GA4 tracking is not activated for your visit.",
      "Wenn Sie der Analyse nicht zustimmen, wird das GA4-Tracking für Ihren Besuch nicht aktiviert.",
      "Si vous refusez le consentement aux analyses, le suivi GA4 n'est pas activé lors de votre visite.",
      "Si rechaza el consentimiento para Analytics, el seguimiento de GA4 no se activa durante su visita."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We also use Vercel Web Analytics to obtain aggregated and privacy-focused information about website usage and performance.",
      "Wir verwenden außerdem Vercel Web Analytics, um aggregierte und datenschutzorientierte Informationen über die Nutzung und Leistung unserer Website zu erhalten.",
      "Nous utilisons également Vercel Web Analytics pour obtenir des informations agrégées et respectueuses de la vie privée sur l'utilisation et les performances du site.",
      "También utilizamos Vercel Web Analytics para obtener información agregada y orientada a la privacidad sobre el uso y el rendimiento del sitio web."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "For more information about cookies and analytics technologies, please see our [Cookie Policy](/cookie-policy).",
      "Weitere Informationen zu Cookies und Analysetechnologien finden Sie in unserer [Cookie-Richtlinie](/cookie-policy).",
      "Pour plus d'informations sur les cookies et les technologies d'analyse, veuillez consulter notre [Politique de cookies](/cookie-policy).",
      "Para obtener más información sobre las cookies y las tecnologías de análisis, consulte nuestra [Política de Cookies](/cookie-policy)."
    ),
  },
  {
    type: "heading",
    icon: "clipboard-check",
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
      "We may use information for the following purposes:",
      "Wir können Informationen für folgende Zwecke verwenden:",
      "Nous pouvons utiliser les informations pour :",
      "Podemos utilizar la información para:"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "To respond to inquiries and contact requests",
          "Beantwortung von Anfragen und Kontaktanfragen",
          "Répondre aux demandes et aux messages de contact",
          "Responder a consultas y solicitudes de contacto"
        ),
      },
      {
        text_translations: tr(
          "To provide and manage our services",
          "Bereitstellung und Verwaltung unserer Dienstleistungen",
          "Fournir et gérer nos services",
          "Proporcionar y gestionar nuestros servicios"
        ),
      },
      {
        text_translations: tr(
          "To communicate with you about our services",
          "Kommunikation über unsere Dienstleistungen",
          "Communiquer avec vous concernant nos services",
          "Comunicarnos con usted sobre nuestros servicios"
        ),
      },
      {
        text_translations: tr(
          "To improve our website, services, and user experience",
          "Verbesserung unserer Website, Dienstleistungen und Nutzererfahrung",
          "Améliorer notre site web, nos services et l'expérience utilisateur",
          "Mejorar nuestro sitio web, servicios y experiencia del usuario"
        ),
      },
      {
        text_translations: tr(
          "To understand website traffic and usage",
          "Analyse des Website-Traffics und der Nutzung",
          "Comprendre le trafic et l'utilisation du site",
          "Comprender el tráfico y el uso del sitio web"
        ),
      },
      {
        text_translations: tr(
          "To maintain the security and functionality of our website",
          "Aufrechterhaltung der Sicherheit und Funktionsfähigkeit unserer Website",
          "Maintenir la sécurité et le fonctionnement du site",
          "Mantener la seguridad y funcionalidad del sitio"
        ),
      },
      {
        text_translations: tr(
          "To prevent fraud, abuse, or unauthorized activity",
          "Verhinderung von Betrug, Missbrauch oder unbefugten Aktivitäten",
          "Prévenir la fraude, les abus ou les activités non autorisées",
          "Prevenir fraudes, abusos o actividades no autorizadas"
        ),
      },
      {
        text_translations: tr(
          "To comply with legal obligations",
          "Erfüllung gesetzlicher Verpflichtungen",
          "Respecter nos obligations légales",
          "Cumplir obligaciones legales"
        ),
      },
      {
        text_translations: tr(
          "To establish, exercise, or defend legal claims",
          "Geltendmachung, Ausübung oder Verteidigung rechtlicher Ansprüche",
          "Établir, exercer ou défendre des droits en justice",
          "Establecer, ejercer o defender reclamaciones legales"
        ),
      },
    ],
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Where processing is based on your consent, you may withdraw that consent at any time.",
      "Wenn die Verarbeitung auf Ihrer Einwilligung beruht, können Sie diese jederzeit widerrufen.",
      "Lorsque le traitement repose sur votre consentement, vous pouvez retirer ce consentement à tout moment.",
      "Cuando el tratamiento se base en su consentimiento, puede retirar dicho consentimiento en cualquier momento."
    ),
  },
  {
    type: "heading",
    icon: "shield-check",
    text_translations: tr(
      "4. Legal Bases for Processing",
      "4. Rechtsgrundlagen der Verarbeitung",
      "4. Bases légales du traitement",
      "4. Bases legales para el tratamiento"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Depending on the circumstances, we process personal information on the following legal bases under applicable data protection law, including the EU General Data Protection Regulation (GDPR):",
      "Je nach Situation verarbeiten wir personenbezogene Daten auf Grundlage der geltenden Datenschutzgesetze, einschließlich der Datenschutz-Grundverordnung (DSGVO):",
      "Selon les circonstances, nous traitons les informations personnelles sur les bases juridiques prévues par la législation applicable en matière de protection des données, notamment le Règlement général sur la protection des données (RGPD) :",
      "Dependiendo de las circunstancias, tratamos la información personal sobre las siguientes bases legales previstas por la legislación aplicable en materia de protección de datos, incluido el Reglamento General de Protección de Datos (RGPD):"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "Consent — for optional analytics or other processing where consent is required.",
          "Einwilligung — für optionale Analysen oder andere Verarbeitungsvorgänge, für die eine Einwilligung erforderlich ist.",
          "Consentement — pour les analyses facultatives ou tout autre traitement nécessitant un consentement.",
          "Consentimiento — para análisis opcionales u otros tratamientos que requieran consentimiento."
        ),
      },
      {
        text_translations: tr(
          "Contract or steps prior to entering into a contract — when necessary to provide requested services or respond to a service request.",
          "Vertrag oder vorvertragliche Maßnahmen — wenn dies zur Erbringung angeforderter Dienstleistungen erforderlich ist.",
          "Contrat ou mesures précontractuelles — lorsque cela est nécessaire pour fournir les services demandés.",
          "Contrato o medidas precontractuales — cuando sea necesario para proporcionar servicios solicitados."
        ),
      },
      {
        text_translations: tr(
          "Legitimate interests — where necessary to operate, secure, maintain, and improve our services, provided that these interests do not override your rights and freedoms.",
          "Berechtigte Interessen — wenn dies für den Betrieb, die Sicherheit, die Wartung und Verbesserung unserer Dienstleistungen erforderlich ist und Ihre Rechte und Freiheiten nicht überwiegen.",
          "Intérêts légitimes — lorsque cela est nécessaire pour exploiter, sécuriser, maintenir et améliorer nos services, sous réserve que ces intérêts ne prévalent pas sur vos droits et libertés.",
          "Intereses legítimos — cuando sea necesario para operar, proteger, mantener y mejorar nuestros servicios, siempre que dichos intereses no prevalezcan sobre sus derechos y libertades."
        ),
      },
      {
        text_translations: tr(
          "Legal obligation — where processing is required by applicable law.",
          "Gesetzliche Verpflichtung — wenn die Verarbeitung gesetzlich vorgeschrieben ist.",
          "Obligation légale — lorsque le traitement est requis par la loi.",
          "Obligación legal — cuando el tratamiento sea exigido por la legislación aplicable."
        ),
      },
    ],
  },
  {
    type: "heading",
    icon: "cookie",
    text_translations: tr(
      "5. Cookies and Tracking Technologies",
      "5. Cookies und Tracking-Technologien",
      "5. Cookies et technologies de suivi",
      "5. Cookies y tecnologías de seguimiento"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Our website uses cookies and similar technologies for essential functionality, preferences, and, where you provide the appropriate consent, analytics.",
      "Unsere Website verwendet Cookies und ähnliche Technologien für wesentliche Funktionen, Präferenzen und, sofern Sie die erforderliche Einwilligung erteilen, für Analysezwecke.",
      "Notre site utilise des cookies et des technologies similaires pour assurer les fonctionnalités essentielles, mémoriser certaines préférences et, lorsque vous donnez votre consentement approprié, effectuer des analyses.",
      "Nuestro sitio web utiliza cookies y tecnologías similares para funciones esenciales, preferencias y, cuando proporciona el consentimiento correspondiente, análisis."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Optional analytics tracking is not activated before the required consent is provided.",
      "Optionales Analytics-Tracking wird nicht aktiviert, bevor die erforderliche Einwilligung erteilt wurde.",
      "Le suivi analytique facultatif n'est pas activé avant l'obtention du consentement requis.",
      "El seguimiento analítico opcional no se activa antes de obtener el consentimiento requerido."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "You can change or withdraw your optional cookie preferences at any time through Cookie Settings in the website footer.",
      "Sie können Ihre optionalen Cookie-Einstellungen jederzeit über Cookie Settings in der Fußzeile unserer Website ändern oder widerrufen.",
      "Vous pouvez modifier ou retirer vos préférences à tout moment en sélectionnant Cookie Settings dans le pied de page du site.",
      "Puede cambiar o retirar sus preferencias de cookies opcionales en cualquier momento seleccionando Cookie Settings en el pie de página del sitio web."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "For detailed information about the technologies we use and how to manage your choices, please see our [Cookie Policy](/cookie-policy).",
      "Weitere Informationen finden Sie in unserer [Cookie-Richtlinie](/cookie-policy).",
      "Pour plus d'informations, veuillez consulter notre [Politique de cookies](/cookie-policy).",
      "Para obtener información detallada, consulte nuestra [Política de Cookies](/cookie-policy)."
    ),
  },
  {
    type: "heading",
    icon: "settings",
    text_translations: tr(
      "6. Google Analytics 4",
      "6. Google Analytics 4",
      "6. Google Analytics 4",
      "6. Google Analytics 4"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We use Google Analytics 4 (GA4) to understand website traffic and how visitors interact with our website.",
      "Wir verwenden Google Analytics 4 (GA4), um den Website-Traffic zu verstehen und zu analysieren, wie Besucher mit unserer Website interagieren.",
      "Nous utilisons Google Analytics 4 (GA4) afin de comprendre le trafic du site et la manière dont les visiteurs interagissent avec celui-ci.",
      "Utilizamos Google Analytics 4 (GA4) para comprender el tráfico del sitio web y cómo interactúan los visitantes con nuestro sitio."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "GA4 analytics tracking is activated only when the appropriate Analytics consent has been provided through our consent mechanism.",
      "Das GA4-Tracking wird nur aktiviert, wenn die entsprechende Einwilligung für Analytics erteilt wurde.",
      "Le suivi GA4 n'est activé qu'après l'obtention du consentement analytique approprié.",
      "El seguimiento de GA4 solo se activa cuando se ha proporcionado el consentimiento correspondiente para Analytics."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "GA4 may process information relating to website interactions, device and browser characteristics, approximate geographic information, and other measurement data.",
      "GA4 kann Informationen über Website-Interaktionen, Geräte- und Browsereigenschaften, ungefähre geografische Informationen und andere Messdaten verarbeiten.",
      "GA4 peut traiter des informations relatives aux interactions avec le site, aux caractéristiques de l'appareil et du navigateur, à la localisation géographique approximative et à d'autres données de mesure.",
      "GA4 puede procesar información relacionada con las interacciones con el sitio, las características del dispositivo y navegador, información geográfica aproximada y otros datos de medición."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "For users in the European Union, Google states that individual IP addresses are not logged or stored by Google Analytics. IP information may be used to derive coarse geographic information before being discarded.",
      "Für Nutzer in der Europäischen Union gibt Google an, dass individuelle IP-Adressen von Google Analytics nicht protokolliert oder gespeichert werden. IP-Informationen können verwendet werden, um ungefähre geografische Informationen abzuleiten, bevor sie verworfen werden.",
      "Pour les utilisateurs situés dans l'Union européenne, Google indique que les adresses IP individuelles ne sont pas enregistrées ni stockées par Google Analytics. Les informations IP peuvent être utilisées pour déterminer une localisation géographique approximative avant d'être supprimées.",
      "Para los usuarios de la Unión Europea, Google indica que las direcciones IP individuales no se registran ni almacenan en Google Analytics. La información de IP puede utilizarse para obtener información geográfica aproximada antes de ser descartada."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "For further information about Google's privacy practices, please refer to Google's privacy documentation.",
      "Weitere Informationen zu den Datenschutzpraktiken von Google finden Sie in der Datenschutzdokumentation von Google.",
      "Pour plus d'informations sur les pratiques de confidentialité de Google, veuillez consulter sa documentation relative à la confidentialité.",
      "Para obtener más información sobre las prácticas de privacidad de Google, consulte su documentación de privacidad."
    ),
  },
  {
    type: "heading",
    icon: "globe",
    text_translations: tr(
      "7. Vercel Analytics",
      "7. Vercel Analytics",
      "7. Vercel Analytics",
      "7. Vercel Analytics"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We use Vercel Web Analytics to understand aggregated website usage and performance.",
      "Wir verwenden Vercel Web Analytics, um aggregierte Informationen über die Nutzung und Leistung unserer Website zu erhalten.",
      "Nous utilisons Vercel Web Analytics pour comprendre de manière agrégée l'utilisation et les performances du site.",
      "Utilizamos Vercel Web Analytics para comprender de forma agregada el uso y el rendimiento del sitio web."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Vercel describes its analytics information as anonymized, statistical, aggregated, and de-identified in its privacy documentation.",
      "Vercel beschreibt seine Analytics-Informationen in seiner Datenschutzerklärung als anonymisiert, statistisch, aggregiert und de-identifiziert.",
      "Vercel décrit les informations analytiques comme anonymisées, statistiques, agrégées et désidentifiées dans sa documentation relative à la confidentialité.",
      "Vercel describe la información analítica en su documentación de privacidad como anonimizada, estadística, agregada y desidentificada."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Vercel Web Analytics does not rely on traditional cookies for its analytics measurement.",
      "Vercel Web Analytics verwendet keine herkömmlichen Cookies für seine Web-Analytics-Messungen.",
      "Vercel Web Analytics ne repose pas sur des cookies traditionnels pour ses mesures analytiques.",
      "Vercel Web Analytics no utiliza cookies tradicionales para sus mediciones analíticas."
    ),
  },
  {
    type: "heading",
    icon: "globe",
    text_translations: tr(
      "8. Third-Party Service Providers",
      "8. Drittanbieter",
      "8. Fournisseurs de services tiers",
      "8. Proveedores de servicios externos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We may use trusted third-party providers to help operate our website and business.",
      "Wir können vertrauenswürdige Drittanbieter einsetzen, die uns beim Betrieb unserer Website und unseres Unternehmens unterstützen.",
      "Nous pouvons utiliser des prestataires tiers de confiance pour exploiter notre site web et nos activités.",
      "Podemos utilizar proveedores externos de confianza para ayudarnos a operar nuestro sitio web y nuestro negocio."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "These may include:",
      "Dazu gehören unter anderem:",
      "Ils peuvent notamment inclure :",
      "Estos pueden incluir:"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "Vercel — website hosting, infrastructure, and analytics services.",
          "Vercel — Hosting, Infrastruktur und Analytics-Dienste.",
          "Vercel — hébergement, infrastructure et services d'analyse.",
          "Vercel — alojamiento, infraestructura y servicios de análisis."
        ),
      },
      {
        text_translations: tr(
          "Google — Google Analytics 4 analytics services.",
          "Google — Google-Analytics-4-Dienste.",
          "Google — services Google Analytics 4.",
          "Google — servicios de Google Analytics 4."
        ),
      },
      {
        text_translations: tr(
          "Other service providers necessary to operate our website, communicate with customers, process forms, or provide requested services.",
          "Weitere Dienstleister, die für den Betrieb unserer Website, die Kommunikation, die Verarbeitung von Formularen oder die Erbringung angeforderter Dienstleistungen erforderlich sind.",
          "D'autres prestataires nécessaires au fonctionnement du site, aux communications, au traitement des formulaires ou à la fourniture des services demandés.",
          "Otros proveedores necesarios para operar nuestro sitio web, comunicarnos con los clientes, procesar formularios o proporcionar los servicios solicitados."
        ),
      },
    ],
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We do not sell your personal information.",
      "Wir verkaufen Ihre personenbezogenen Daten nicht.",
      "Nous ne vendons pas vos informations personnelles.",
      "No vendemos su información personal."
    ),
  },
  {
    type: "heading",
    icon: "refresh",
    text_translations: tr(
      "9. Data Retention",
      "9. Speicherung und Aufbewahrung",
      "9. Conservation des données",
      "9. Conservación de datos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, to provide our services, maintain appropriate business records, resolve disputes, enforce agreements, or comply with legal obligations.",
      "Wir speichern personenbezogene Daten nur so lange, wie dies für die in dieser Datenschutzerklärung beschriebenen Zwecke, die Erbringung unserer Dienstleistungen, geschäftliche Aufzeichnungen, die Beilegung von Streitigkeiten, die Durchsetzung von Vereinbarungen oder die Erfüllung gesetzlicher Verpflichtungen angemessen erforderlich ist.",
      "Nous conservons les informations personnelles uniquement pendant la durée raisonnablement nécessaire aux finalités décrites dans cette Politique de confidentialité, à la fourniture de nos services, à la tenue de documents commerciaux, au règlement des litiges, à l'application de nos accords ou au respect des obligations légales.",
      "Conservamos la información personal únicamente durante el tiempo razonablemente necesario para los fines descritos en esta Política de Privacidad, proporcionar nuestros servicios, mantener registros comerciales, resolver disputas, hacer cumplir acuerdos o cumplir obligaciones legales."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Analytics data may be retained according to the retention settings configured in our analytics services.",
      "Analytics-Daten können entsprechend den in unseren Analytics-Diensten konfigurierten Aufbewahrungseinstellungen gespeichert werden.",
      "Les données analytiques peuvent être conservées conformément aux paramètres de conservation configurés dans nos services d'analyse.",
      "Los datos analíticos pueden conservarse de acuerdo con la configuración de conservación establecida en nuestros servicios de análisis."
    ),
  },
  {
    type: "heading",
    icon: "lock",
    text_translations: tr(
      "10. Data Security",
      "10. Datensicherheit",
      "10. Sécurité des données",
      "10. Seguridad de los datos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We implement appropriate technical and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure.",
      "Wir setzen angemessene technische und organisatorische Maßnahmen ein, um personenbezogene Daten vor unbefugtem Zugriff, Verlust, Missbrauch, Veränderung oder Offenlegung zu schützen.",
      "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées destinées à protéger les informations personnelles contre tout accès non autorisé, perte, utilisation abusive, modification ou divulgation.",
      "Implementamos medidas técnicas y organizativas apropiadas destinadas a proteger la información personal contra el acceso no autorizado, pérdida, uso indebido, modificación o divulgación."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "However, no method of transmission or electronic storage is completely secure, and we cannot guarantee absolute security.",
      "Keine Übertragung über das Internet und keine elektronische Speicherung kann jedoch vollständig sicher garantiert werden.",
      "Toutefois, aucune transmission sur Internet ou aucun stockage électronique n'est totalement sécurisé.",
      "Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es completamente seguro."
    ),
  },
  {
    type: "heading",
    icon: "clipboard-check",
    text_translations: tr(
      "11. Your Privacy Rights",
      "11. Ihre Rechte",
      "11. Vos droits",
      "11. Sus derechos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Depending on applicable law, including the GDPR where applicable, you may have rights including:",
      "Je nach geltendem Recht, insbesondere nach der DSGVO, können Sie folgende Rechte haben:",
      "Selon la législation applicable, notamment le RGPD, vous pouvez disposer des droits suivants :",
      "Dependiendo de la legislación aplicable, incluido el RGPD, puede tener los siguientes derechos:"
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "The right to access your personal data",
          "Recht auf Auskunft",
          "Droit d'accès à vos données personnelles",
          "Derecho de acceso a sus datos personales"
        ),
      },
      {
        text_translations: tr(
          "The right to correct inaccurate or incomplete data",
          "Recht auf Berichtigung",
          "Droit de rectification",
          "Derecho de rectificación"
        ),
      },
      {
        text_translations: tr(
          "The right to request deletion of your personal data",
          "Recht auf Löschung",
          "Droit à l'effacement",
          "Derecho de supresión"
        ),
      },
      {
        text_translations: tr(
          "The right to restrict certain processing",
          "Recht auf Einschränkung der Verarbeitung",
          "Droit à la limitation du traitement",
          "Derecho a limitar el tratamiento"
        ),
      },
      {
        text_translations: tr(
          "The right to object to certain processing",
          "Recht auf Widerspruch",
          "Droit d'opposition",
          "Derecho de oposición"
        ),
      },
      {
        text_translations: tr(
          "The right to data portability",
          "Recht auf Datenübertragbarkeit",
          "Droit à la portabilité des données",
          "Derecho a la portabilidad de los datos"
        ),
      },
      {
        text_translations: tr(
          "The right to withdraw consent where processing is based on consent",
          "Recht auf Widerruf einer Einwilligung, wenn die Verarbeitung darauf beruht",
          "Droit de retirer votre consentement lorsque le traitement repose sur celui-ci",
          "Derecho a retirar el consentimiento cuando el tratamiento se base en este"
        ),
      },
    ],
  },
  {
    type: "paragraph",
    text_translations: tr(
      "You can exercise applicable rights by contacting us at [privacy@stratifit.com](mailto:privacy@stratifit.com).",
      "Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter [privacy@stratifit.com](mailto:privacy@stratifit.com).",
      "Pour exercer vos droits, contactez-nous à [privacy@stratifit.com](mailto:privacy@stratifit.com).",
      "Para ejercer sus derechos, puede ponerse en contacto con nosotros en [privacy@stratifit.com](mailto:privacy@stratifit.com)."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "You also have the right to lodge a complaint with a competent data protection supervisory authority.",
      "Sie haben außerdem das Recht, sich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren.",
      "Vous avez également le droit d'introduire une réclamation auprès d'une autorité de contrôle compétente.",
      "También tiene derecho a presentar una reclamación ante una autoridad de protección de datos competente."
    ),
  },
  {
    type: "heading",
    icon: "shield-check",
    text_translations: tr(
      "12. Children's Privacy",
      "12. Datenschutz von Kindern",
      "12. Protection des enfants",
      "12. Privacidad de los menores"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Our website and services are not specifically directed at children. We do not knowingly collect personal information from children where such collection is prohibited by applicable law.",
      "Unsere Website und Dienstleistungen richten sich nicht speziell an Kinder. Wir erheben nicht wissentlich personenbezogene Daten von Kindern, soweit deren Erhebung nach geltendem Recht unzulässig ist.",
      "Notre site et nos services ne sont pas spécifiquement destinés aux enfants. Nous ne collectons pas sciemment de données personnelles d'enfants lorsque leur collecte est interdite par la législation applicable.",
      "Nuestro sitio web y nuestros servicios no están dirigidos específicamente a menores. No recopilamos conscientemente información personal de menores cuando dicha recopilación esté prohibida por la legislación aplicable."
    ),
  },
  {
    type: "heading",
    icon: "globe",
    text_translations: tr(
      "13. International Data Transfers",
      "13. Internationale Datenübermittlungen",
      "13. Transferts internationaux de données",
      "13. Transferencias internacionales de datos"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Some of our service providers may process information in countries outside your country of residence.",
      "Einige unserer Dienstleister können Informationen in Ländern außerhalb Ihres Wohnsitzlandes verarbeiten.",
      "Certains de nos prestataires peuvent traiter des informations dans des pays situés en dehors de votre pays de résidence.",
      "Algunos de nuestros proveedores de servicios pueden procesar información en países situados fuera de su país de residencia."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Where personal information is transferred internationally, we rely on appropriate safeguards required by applicable data protection law.",
      "Bei internationalen Übermittlungen personenbezogener Daten verwenden wir die nach geltendem Datenschutzrecht erforderlichen geeigneten Schutzmaßnahmen.",
      "Lorsque des données personnelles sont transférées à l'international, nous mettons en place les garanties appropriées requises par la législation applicable.",
      "Cuando se transfieren datos personales internacionalmente, utilizamos las garantías adecuadas exigidas por la legislación aplicable en materia de protección de datos."
    ),
  },
  {
    type: "heading",
    icon: "refresh",
    text_translations: tr(
      "14. Changes to This Privacy Policy",
      "14. Änderungen dieser Datenschutzerklärung",
      "14. Modifications de cette Politique de confidentialité",
      "14. Cambios en esta Política de Privacidad"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We may update this Privacy Policy from time to time to reflect changes to our services, technologies, data practices, or legal requirements.",
      "Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren, um Änderungen unserer Dienstleistungen, Technologien, Datenverarbeitungspraktiken oder gesetzlichen Anforderungen zu berücksichtigen.",
      "Nous pouvons mettre à jour cette Politique de confidentialité afin de refléter les changements concernant nos services, technologies, pratiques de traitement des données ou obligations légales.",
      "Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestros servicios, tecnologías, prácticas de tratamiento de datos o requisitos legales."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "When we make changes, we will update the Last updated date on this page.",
      "Bei Änderungen wird das Datum der letzten Aktualisierung angepasst.",
      "La date de mise à jour sera modifiée lorsque des changements seront apportés.",
      "Cuando realicemos cambios, actualizaremos la fecha de Última actualización de esta página."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We encourage you to review this Privacy Policy periodically.",
      "Wir empfehlen Ihnen, diese Datenschutzerklärung regelmäßig zu überprüfen.",
      "Nous vous encourageons à consulter régulièrement cette Politique de confidentialité.",
      "Le recomendamos revisar periódicamente esta Política de Privacidad."
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
      "Stratifit",
      "Stratifit",
      "Stratifit",
      "Stratifit"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Email: [privacy@stratifit.com](mailto:privacy@stratifit.com)",
      "E-Mail: [privacy@stratifit.com](mailto:privacy@stratifit.com)",
      "E-mail : [privacy@stratifit.com](mailto:privacy@stratifit.com)",
      "Correo electrónico: [privacy@stratifit.com](mailto:privacy@stratifit.com)"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Website: [https://stratifit.com](https://stratifit.com)",
      "Website: [https://stratifit.com](https://stratifit.com)",
      "Site web : [https://stratifit.com](https://stratifit.com)",
      "Sitio web: [https://stratifit.com](https://stratifit.com)"
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
    type: "paragraph",
    text_translations: tr(
      "These Terms work together with our [Privacy Policy](/privacy) and [Cookie Policy](/cookie-policy). Please read them alongside these Terms to understand how we handle your information.",
      "Diese Bedingungen gelten zusammen mit unserer [Datenschutzerklärung](/privacy) und [Cookie-Richtlinie](/cookie-policy). Bitte lesen Sie diese zusammen mit diesen Bedingungen, um zu verstehen, wie wir mit Ihren Informationen umgehen.",
      "Ces Conditions s'appliquent conjointement avec notre [Politique de confidentialité](/privacy) et notre [Politique de cookies](/cookie-policy). Veuillez les lire parallèlement à ces Conditions pour comprendre comment nous traitons vos informations.",
      "Estos Términos se aplican conjuntamente con nuestra [Política de Privacidad](/privacy) y [Política de Cookies](/cookie-policy). Léalas junto con estos Términos para entender cómo tratamos su información."
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
      "1. Que sont les cookies ?",
      "1. Qué son las cookies"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Cookies are small text files and similar technologies used by websites to store information on your device. They help websites function properly, remember preferences, and understand how visitors use the site.",
      "Cookies sind kleine Textdateien und ähnliche Technologien, die von Websites verwendet werden, um Informationen auf Ihrem Gerät zu speichern. Sie ermöglichen den ordnungsgemäßen Betrieb der Website, speichern bestimmte Einstellungen und helfen uns zu verstehen, wie Besucher die Website nutzen.",
      "Les cookies sont de petits fichiers texte et des technologies similaires utilisés par les sites web pour stocker des informations sur votre appareil. Ils permettent au site de fonctionner correctement, de mémoriser certaines préférences et de comprendre comment les visiteurs utilisent le site.",
      "Las cookies son pequeños archivos de texto y tecnologías similares que utilizan los sitios web para almacenar información en su dispositivo. Ayudan a que el sitio web funcione correctamente, recuerdan determinadas preferencias y permiten comprender cómo los visitantes utilizan el sitio."
    ),
  },
  {
    type: "heading",
    icon: "settings",
    text_translations: tr(
      "2. How We Use Cookies",
      "2. Wie verwenden wir Cookies?",
      "2. Comment utilisons-nous les cookies ?",
      "2. ¿Cómo utilizamos las cookies?"
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
          "Essential functionality — to keep the website secure, functional, and usable.",
          "Erforderliche Funktionen — um die Website sicher, funktionsfähig und nutzbar zu halten.",
          "Fonctionnalités essentielles — pour assurer la sécurité, le fonctionnement et l'utilisation correcte du site.",
          "Funcionalidad esencial — para mantener el sitio web seguro, funcional y utilizable."
        ),
      },
      {
        text_translations: tr(
          "Analytics — to understand website traffic and how visitors interact with our website.",
          "Analyse — um den Website-Traffic und die Nutzung unserer Website zu verstehen.",
          "Analyse — pour comprendre le trafic du site et la manière dont les visiteurs l'utilisent.",
          "Análisis — para comprender el tráfico del sitio web y cómo interactúan los visitantes con él."
        ),
      },
      {
        text_translations: tr(
          "Preferences — to remember settings such as language and display preferences.",
          "Präferenzen — um Einstellungen wie Sprache und Anzeigeoptionen zu speichern.",
          "Préférences — pour mémoriser certains paramètres, tels que la langue et les préférences d'affichage.",
          "Preferencias — para recordar configuraciones como el idioma y las preferencias de visualización."
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
      "Erforderliche Cookies",
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
      "These cookies are necessary for the website to function properly. They may be used for essential features such as security, consent preferences, and other functions you request. Because these cookies are necessary for the operation of the website, they cannot be disabled through our cookie settings.",
      "Diese Cookies sind für den ordnungsgemäßen Betrieb der Website erforderlich. Sie können für wesentliche Funktionen wie Sicherheit, die Speicherung Ihrer Einwilligungspräferenzen und von Ihnen angeforderte Funktionen verwendet werden. Da diese Cookies für den Betrieb der Website erforderlich sind, können sie über unsere Cookie-Einstellungen nicht deaktiviert werden.",
      "Ces cookies sont nécessaires au bon fonctionnement du site. Ils peuvent être utilisés pour des fonctions essentielles telles que la sécurité, la gestion de vos préférences de consentement et les fonctionnalités que vous demandez. Comme ces cookies sont nécessaires au fonctionnement du site, ils ne peuvent pas être désactivés dans les paramètres de cookies.",
      "Estas cookies son necesarias para que el sitio web funcione correctamente. Pueden utilizarse para funciones esenciales como la seguridad, el almacenamiento de sus preferencias de consentimiento y otras funciones que usted solicite. Dado que estas cookies son necesarias para el funcionamiento del sitio web, no pueden desactivarse mediante nuestra configuración de cookies."
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
    tag_translations: tr("Optional", "Optional", "Facultatif", "Opcionales"),
    body_translations: tr(
      "With your consent, we use analytics technologies to understand how visitors use our website, measure traffic, and improve our services. We use Google Analytics 4 (GA4) for detailed website analytics. Analytics tracking is only activated when you give the appropriate consent. If you reject Analytics cookies, we do not activate GA4 analytics tracking for your visit.",
      "Mit Ihrer Einwilligung verwenden wir Analysetechnologien, um zu verstehen, wie Besucher unsere Website nutzen, den Website-Traffic zu messen und unsere Dienstleistungen zu verbessern. Wir verwenden Google Analytics 4 (GA4) für detaillierte Website-Analysen. Die Analyse wird nur aktiviert, wenn Sie die entsprechende Einwilligung erteilen. Wenn Sie Analyse-Cookies ablehnen, aktivieren wir Google Analytics 4 nicht für Ihren Besuch.",
      "Avec votre consentement, nous utilisons des technologies d'analyse afin de comprendre comment les visiteurs utilisent notre site, de mesurer le trafic et d'améliorer nos services. Nous utilisons Google Analytics 4 (GA4) pour les analyses détaillées du site. Le suivi analytique n'est activé qu'après l'obtention de votre consentement approprié. Si vous refusez les cookies analytiques, nous n'activons pas le suivi Google Analytics 4 pour votre visite.",
      "Con su consentimiento, utilizamos tecnologías de análisis para comprender cómo los visitantes utilizan nuestro sitio web, medir el tráfico y mejorar nuestros servicios. Utilizamos Google Analytics 4 (GA4) para realizar análisis detallados del sitio web. El seguimiento analítico solo se activa cuando usted proporciona el consentimiento correspondiente. Si rechaza las cookies de análisis, no activamos el seguimiento de Google Analytics 4 durante su visita."
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
    tag_translations: tr(
      "Not currently used",
      "Derzeit nicht verwendet",
      "Non utilisés actuellement",
      "Actualmente no utilizadas"
    ),
    body_translations: tr(
      "We do not currently use marketing or advertising cookies to track visitors for targeted advertising. If this changes in the future, we will update this Cookie Policy and request the appropriate consent before using optional marketing technologies.",
      "Wir verwenden derzeit keine Marketing- oder Werbe-Cookies, um Besucher für gezielte Werbung zu verfolgen. Sollte sich dies ändern, werden wir diese Cookie-Richtlinie aktualisieren und die erforderliche Einwilligung einholen, bevor optionale Marketing-Technologien eingesetzt werden.",
      "Nous n'utilisons actuellement pas de cookies marketing ou publicitaires pour suivre les visiteurs à des fins de publicité ciblée. Si cette situation change, nous mettrons à jour la présente Politique de cookies et demanderons le consentement approprié avant d'utiliser des technologies marketing facultatives.",
      "Actualmente no utilizamos cookies de marketing o publicidad para realizar un seguimiento de los visitantes con fines de publicidad personalizada. Si esto cambia en el futuro, actualizaremos esta Política de Cookies y solicitaremos el consentimiento correspondiente antes de utilizar tecnologías de marketing opcionales."
    ),
  },
  {
    type: "heading",
    icon: "smartphone",
    text_translations: tr(
      "4. Managing Your Cookie Preferences",
      "4. Verwaltung Ihrer Cookie-Einstellungen",
      "4. Gestion de vos préférences en matière de cookies",
      "4. Gestión de sus preferencias de cookies"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "You can change or withdraw your optional cookie preferences at any time by selecting Cookie Settings in the website footer.",
      "Sie können Ihre Einstellungen für optionale Cookies jederzeit ändern oder widerrufen, indem Sie Cookie Settings in der Fußzeile der Website auswählen.",
      "Vous pouvez modifier ou retirer vos préférences concernant les cookies facultatifs à tout moment en sélectionnant Cookie Settings dans le pied de page du site.",
      "Puede cambiar o retirar sus preferencias sobre las cookies opcionales en cualquier momento seleccionando Cookie Settings en el pie de página del sitio web."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "You can also manage or delete cookies through your browser settings. Most browsers allow you to block or remove cookies and may allow you to choose whether to accept cookies.",
      "Sie können Cookies außerdem über die Einstellungen Ihres Browsers verwalten oder löschen.",
      "Vous pouvez également gérer ou supprimer les cookies via les paramètres de votre navigateur.",
      "También puede administrar o eliminar las cookies mediante la configuración de su navegador."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Please note that disabling essential cookies or certain browser storage technologies may affect the functionality of the website.",
      "Bitte beachten Sie, dass die Deaktivierung erforderlicher Cookies oder bestimmter Browser-Speichertechnologien die Funktionalität der Website beeinträchtigen kann.",
      "Veuillez noter que la désactivation des cookies essentiels ou de certaines technologies de stockage du navigateur peut affecter le fonctionnement du site.",
      "Tenga en cuenta que desactivar las cookies esenciales o determinadas tecnologías de almacenamiento del navegador puede afectar al funcionamiento del sitio web."
    ),
  },
  {
    type: "heading",
    icon: "globe",
    text_translations: tr(
      "5. Third-Party Services",
      "5. Dienste von Drittanbietern",
      "5. Services tiers",
      "5. Servicios de terceros"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We use third-party services that may process information when you interact with our website.",
      "Wir verwenden Dienste von Drittanbietern, die Informationen verarbeiten können, wenn Sie unsere Website nutzen.",
      "Nous utilisons certains services tiers susceptibles de traiter des informations lorsque vous utilisez notre site.",
      "Utilizamos servicios de terceros que pueden procesar información cuando interactúa con nuestro sitio web."
    ),
  },
  {
    type: "list",
    items: [
      {
        text_translations: tr(
          "Google Analytics 4: Used to measure website traffic and understand how visitors use our website. GA4 analytics tracking is subject to your consent.",
          "Google Analytics 4: Wird verwendet, um den Website-Traffic zu messen und zu verstehen, wie Besucher unsere Website nutzen. Die Nutzung von GA4 unterliegt Ihrer Einwilligung.",
          "Google Analytics 4 : utilisé pour mesurer le trafic et comprendre comment les visiteurs utilisent notre site. Le suivi GA4 est soumis à votre consentement.",
          "Google Analytics 4: Se utiliza para medir el tráfico del sitio web y comprender cómo lo utilizan los visitantes. El seguimiento de GA4 está sujeto a su consentimiento."
        ),
      },
      {
        text_translations: tr(
          "Vercel Analytics: Used to provide privacy-focused, aggregated information about website usage and performance. Vercel Analytics Web Analytics does not rely on cookies.",
          "Vercel Analytics: Wird verwendet, um datenschutzfreundliche, aggregierte Informationen über die Nutzung und Leistung der Website bereitzustellen. Vercel Analytics Web Analytics verwendet keine Cookies.",
          "Vercel Analytics : utilisé pour obtenir des informations agrégées et respectueuses de la vie privée sur l'utilisation et les performances du site. Vercel Analytics Web Analytics n'utilise pas de cookies.",
          "Vercel Analytics: Se utiliza para proporcionar información agregada y orientada a la privacidad sobre el uso y el rendimiento del sitio web. Vercel Analytics Web Analytics no utiliza cookies."
        ),
      },
    ],
  },
  {
    type: "paragraph",
    text_translations: tr(
      "For more information about how these services process information, please refer to their respective privacy documentation.",
      "Weitere Informationen zur Verarbeitung von Daten durch diese Dienste finden Sie in den jeweiligen Datenschutzerklärungen.",
      "Pour plus d'informations sur le traitement des données par ces services, veuillez consulter leurs politiques de confidentialité respectives.",
      "Para obtener más información sobre cómo estos servicios procesan la información, consulte sus respectivas políticas de privacidad."
    ),
  },
  {
    type: "heading",
    icon: "refresh",
    text_translations: tr(
      "6. Changes to This Cookie Policy",
      "6. Änderungen dieser Cookie-Richtlinie",
      "6. Modifications de cette Politique de cookies",
      "6. Cambios en esta Política de Cookies"
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "We may update this Cookie Policy from time to time to reflect changes to our website, technologies, services, or legal requirements.",
      "Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren, um Änderungen an unserer Website, unseren Technologien, Dienstleistungen oder gesetzlichen Anforderungen zu berücksichtigen.",
      "Nous pouvons modifier cette Politique de cookies afin de tenir compte des évolutions de notre site, de nos technologies, de nos services ou des exigences légales.",
      "Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en nuestro sitio web, tecnologías, servicios o requisitos legales."
    ),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "Any changes will be posted on this page with an updated Last updated date.",
      "Änderungen werden auf dieser Seite mit einem aktualisierten Datum veröffentlicht.",
      "Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.",
      "Cualquier cambio se publicará en esta página con una fecha de actualización modificada."
    ),
  },
  {
    type: "subheading",
    divider: true,
    text_translations: tr("Contact Us", "Kontakt", "Nous contacter", "Contacto"),
  },
  {
    type: "paragraph",
    text_translations: tr(
      "If you have any questions about this Cookie Policy, please contact us at [hello@stratifit.com](mailto:hello@stratifit.com).",
      "Wenn Sie Fragen zu dieser Cookie-Richtlinie haben, kontaktieren Sie uns bitte unter [hello@stratifit.com](mailto:hello@stratifit.com).",
      "Si vous avez des questions concernant cette Politique de cookies, veuillez nous contacter à [hello@stratifit.com](mailto:hello@stratifit.com).",
      "Si tiene alguna pregunta sobre esta Política de Cookies, puede ponerse en contacto con nosotros en [hello@stratifit.com](mailto:hello@stratifit.com)."
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
