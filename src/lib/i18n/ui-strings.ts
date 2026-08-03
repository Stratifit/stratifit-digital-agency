import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./resolve-translation";

export type UiStringKey =
  | "skipToContent"
  | "startAProject"
  | "startYourProject"
  | "yourName"
  | "yourEmail"
  | "companyName"
  | "phoneOptional"
  | "selectServices"
  | "servicesSelected"
  | "projectBudget"
  | "selectRange"
  | "customBudget"
  | "customBudgetOptional"
  | "budgetRangeOptional"
  | "whichBusiness"
  | "otherNotListed"
  | "tellUsProject"
  | "tellUsAcquisition"
  | "sendMessage"
  | "sendEnquiry"
  | "sending"
  | "thankYou"
  | "messageReceived"
  | "enquiryReceived"
  | "sendAnotherMessage"
  | "sendAnotherEnquiry"
  | "nameRequired"
  | "validEmail"
  | "messageMinLength"
  | "readMore"
  | "readInsight"
  | "viewAll"
  | "viewAllInsights"
  | "viewAllProjects"
  | "viewAllBusinesses"
  | "viewCaseStudy"
  | "viewFullDetail"
  | "visitSite"
  | "buyBusiness"
  | "mostPopular"
  | "keyDeliverables"
  | "learnMore"
  | "howWeWork"
  | "followUs"
  | "backToTop"
  | "allRightsReserved"
  | "scrollLeft"
  | "scrollRight"
  | "categoryEcommerce"
  | "categorySaaS"
  | "categoryAgency"
  | "categoryAiTools"
  | "categoryPersonalBrand"
  | "categoryLocalBusiness"
  | "categoryDigitalProducts"
  | "chatOpen"
  | "chatClose"
  | "chatPlaceholder"
  | "chatSend"
  | "chatEscalated"
  | "chatOffline"
  | "chatError"
  | "heroEyebrowFallback"
  | "viewSite";

type UiStrings = Record<UiStringKey, string>;
type UiDictionary = Record<(typeof SUPPORTED_LOCALES)[number], UiStrings>;

const en: UiStrings = {
  skipToContent: "Skip to content",
  startAProject: "Start a Project",
  startYourProject: "Start Your Project",
  yourName: "Your name *",
  yourEmail: "you@company.com *",
  companyName: "Company name",
  phoneOptional: "Phone (optional)",
  selectServices: "Select services you're interested in",
  servicesSelected: "{n} services selected",
  projectBudget: "Project Budget",
  selectRange: "Select a range",
  customBudget: "Custom budget",
  customBudgetOptional: "Custom budget (optional)",
  budgetRangeOptional: "Budget range (optional)",
  whichBusiness: "Which business are you interested in?",
  otherNotListed: "Other / not listed",
  tellUsProject: "Tell us about your project *",
  tellUsAcquisition: "Tell us about the acquisition you have in mind *",
  sendMessage: "Send Message",
  sendEnquiry: "Send Enquiry",
  sending: "Sending…",
  thankYou: "Thank you!",
  messageReceived:
    "Your message has been received. We will get back to you shortly.",
  enquiryReceived:
    "Your acquisition enquiry has been received. We will get back to you shortly.",
  sendAnotherMessage: "Send another message",
  sendAnotherEnquiry: "Send another enquiry",
  nameRequired: "Name is required",
  validEmail: "Enter a valid email address",
  messageMinLength: "Message must be at least 10 characters",
  readMore: "Read more",
  readInsight: "Read Insight",
  viewAll: "View All",
  viewAllInsights: "View All Insights",
  viewAllProjects: "View All Projects",
  viewAllBusinesses: "View All Businesses",
  viewCaseStudy: "View Case Study",
  viewFullDetail: "View Full Detail",
  visitSite: "Visit Site",
  buyBusiness: "Buy Business",
  mostPopular: "Most Popular",
  keyDeliverables: "Key Deliverables",
  learnMore: "Learn More",
  howWeWork: "How We Work",
  followUs: "Follow Us",
  backToTop: "Back to Top",
  allRightsReserved: "All rights reserved.",
  scrollLeft: "Scroll left",
  scrollRight: "Scroll right",
  categoryEcommerce: "Ecommerce",
  categorySaaS: "SaaS",
  categoryAgency: "Agency",
  categoryAiTools: "AI Tools",
  categoryPersonalBrand: "Personal Brand",
  categoryLocalBusiness: "Local Business",
  categoryDigitalProducts: "Digital Products",
  chatOpen: "Open chat",
  chatClose: "Close chat",
  chatPlaceholder: "Type a message…",
  chatSend: "Send",
  chatEscalated: "A team member has been notified and will help shortly.",
  chatOffline: "We're offline right now. Leave a message and we'll get back to you.",
  chatError: "Something went wrong. Please try again.",
  heroEyebrowFallback: "Premium Digital Agency",
  viewSite: "View site",
};

const de: UiStrings = {
  skipToContent: "Zum Inhalt springen",
  startAProject: "Projekt starten",
  startYourProject: "Projekt starten",
  yourName: "Ihr Name *",
  yourEmail: "sie@firma.com *",
  companyName: "Firmenname",
  phoneOptional: "Telefon (optional)",
  selectServices: "Wählen Sie die gewünschten Leistungen",
  servicesSelected: "{n} Leistungen ausgewählt",
  projectBudget: "Projektbudget",
  selectRange: "Bereich auswählen",
  customBudget: "Eigenes Budget",
  customBudgetOptional: "Eigenes Budget (optional)",
  budgetRangeOptional: "Budgetbereich (optional)",
  whichBusiness: "An welchem Unternehmen sind Sie interessiert?",
  otherNotListed: "Andere / nicht gelistet",
  tellUsProject: "Erzählen Sie uns von Ihrem Projekt *",
  tellUsAcquisition:
    "Erzählen Sie uns von der Akquisition, die Sie im Sinn haben *",
  sendMessage: "Nachricht senden",
  sendEnquiry: "Anfrage senden",
  sending: "Wird gesendet…",
  thankYou: "Vielen Dank!",
  messageReceived:
    "Ihre Nachricht ist eingegangen. Wir melden uns in Kürze bei Ihnen.",
  enquiryReceived:
    "Ihre Akquisitionsanfrage ist eingegangen. Wir melden uns in Kürze bei Ihnen.",
  sendAnotherMessage: "Weitere Nachricht senden",
  sendAnotherEnquiry: "Weitere Anfrage senden",
  nameRequired: "Name erforderlich",
  validEmail: "Geben Sie eine gültige E-Mail-Adresse ein",
  messageMinLength: "Die Nachricht muss mindestens 10 Zeichen enthalten",
  readMore: "Weiterlesen",
  readInsight: "Einblick lesen",
  viewAll: "Alle ansehen",
  viewAllInsights: "Alle Einblicke ansehen",
  viewAllProjects: "Alle Projekte ansehen",
  viewAllBusinesses: "Alle Unternehmen ansehen",
  viewCaseStudy: "Fallstudie ansehen",
  viewFullDetail: "Alle Details ansehen",
  visitSite: "Website besuchen",
  buyBusiness: "Unternehmen kaufen",
  mostPopular: "Am beliebtesten",
  keyDeliverables: "Wichtigste Leistungen",
  learnMore: "Mehr erfahren",
  howWeWork: "So arbeiten wir",
  followUs: "Folgen Sie uns",
  backToTop: "Nach oben",
  allRightsReserved: "Alle Rechte vorbehalten.",
  scrollLeft: "Nach links scrollen",
  scrollRight: "Nach rechts scrollen",
  categoryEcommerce: "E-Commerce",
  categorySaaS: "SaaS",
  categoryAgency: "Agentur",
  categoryAiTools: "KI-Tools",
  categoryPersonalBrand: "Persönliche Marke",
  categoryLocalBusiness: "Lokales Unternehmen",
  categoryDigitalProducts: "Digitale Produkte",
  chatOpen: "Chat öffnen",
  chatClose: "Chat schließen",
  chatPlaceholder: "Nachricht eingeben…",
  chatSend: "Senden",
  chatEscalated: "Ein Teammitglied wurde benachrichtigt und hilft Ihnen gleich.",
  chatOffline:
    "Wir sind gerade offline. Hinterlassen Sie eine Nachricht, wir melden uns.",
  chatError: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  heroEyebrowFallback: "Premium-Digitalagentur",
  viewSite: "Website ansehen",
};

const fr: UiStrings = {
  skipToContent: "Aller au contenu",
  startAProject: "Démarrer un projet",
  startYourProject: "Démarrer votre projet",
  yourName: "Votre nom *",
  yourEmail: "vous@entreprise.com *",
  companyName: "Nom de l'entreprise",
  phoneOptional: "Téléphone (facultatif)",
  selectServices: "Sélectionnez les services qui vous intéressent",
  servicesSelected: "{n} services sélectionnés",
  projectBudget: "Budget du projet",
  selectRange: "Sélectionner une fourchette",
  customBudget: "Budget personnalisé",
  customBudgetOptional: "Budget personnalisé (facultatif)",
  budgetRangeOptional: "Fourchette de budget (facultatif)",
  whichBusiness: "Quelle entreprise vous intéresse ?",
  otherNotListed: "Autre / non répertorié",
  tellUsProject: "Parlez-nous de votre projet *",
  tellUsAcquisition:
    "Parlez-nous de l'acquisition que vous envisagez *",
  sendMessage: "Envoyer le message",
  sendEnquiry: "Envoyer la demande",
  sending: "Envoi…",
  thankYou: "Merci !",
  messageReceived:
    "Votre message a bien été reçu. Nous vous répondrons rapidement.",
  enquiryReceived:
    "Votre demande d'acquisition a bien été reçue. Nous vous répondrons rapidement.",
  sendAnotherMessage: "Envoyer un autre message",
  sendAnotherEnquiry: "Envoyer une autre demande",
  nameRequired: "Le nom est requis",
  validEmail: "Saisissez une adresse e-mail valide",
  messageMinLength: "Le message doit contenir au moins 10 caractères",
  readMore: "Lire la suite",
  readInsight: "Lire l'article",
  viewAll: "Voir tout",
  viewAllInsights: "Voir tous les articles",
  viewAllProjects: "Voir tous les projets",
  viewAllBusinesses: "Voir toutes les entreprises",
  viewCaseStudy: "Voir l'étude de cas",
  viewFullDetail: "Voir le détail complet",
  visitSite: "Visiter le site",
  buyBusiness: "Acheter l'entreprise",
  mostPopular: "Le plus populaire",
  keyDeliverables: "Livrables clés",
  learnMore: "En savoir plus",
  howWeWork: "Comment nous travaillons",
  followUs: "Suivez-nous",
  backToTop: "Haut de page",
  allRightsReserved: "Tous droits réservés.",
  scrollLeft: "Faire défiler à gauche",
  scrollRight: "Faire défiler à droite",
  categoryEcommerce: "E-commerce",
  categorySaaS: "SaaS",
  categoryAgency: "Agence",
  categoryAiTools: "Outils IA",
  categoryPersonalBrand: "Marque personnelle",
  categoryLocalBusiness: "Entreprise locale",
  categoryDigitalProducts: "Produits numériques",
  chatOpen: "Ouvrir le chat",
  chatClose: "Fermer le chat",
  chatPlaceholder: "Écrivez un message…",
  chatSend: "Envoyer",
  chatEscalated: "Un membre de l'équipe a été prévenu et vous aidera bientôt.",
  chatOffline:
    "Nous sommes hors ligne. Laissez un message, nous vous répondrons.",
  chatError: "Une erreur est survenue. Veuillez réessayer.",
  heroEyebrowFallback: "Agence digitale premium",
  viewSite: "Voir le site",
};

const es: UiStrings = {
  skipToContent: "Saltar al contenido",
  startAProject: "Iniciar un proyecto",
  startYourProject: "Inicia tu proyecto",
  yourName: "Su nombre *",
  yourEmail: "usted@empresa.com *",
  companyName: "Nombre de la empresa",
  phoneOptional: "Teléfono (opcional)",
  selectServices: "Selecciona los servicios que te interesan",
  servicesSelected: "{n} servicios seleccionados",
  projectBudget: "Presupuesto del proyecto",
  selectRange: "Seleccionar un rango",
  customBudget: "Presupuesto personalizado",
  customBudgetOptional: "Presupuesto personalizado (opcional)",
  budgetRangeOptional: "Rango de presupuesto (opcional)",
  whichBusiness: "¿Qué empresa le interesa?",
  otherNotListed: "Otro / no listado",
  tellUsProject: "Cuéntanos sobre tu proyecto *",
  tellUsAcquisition:
    "Cuéntanos sobre la adquisición que tienes en mente *",
  sendMessage: "Enviar mensaje",
  sendEnquiry: "Enviar consulta",
  sending: "Enviando…",
  thankYou: "¡Gracias!",
  messageReceived:
    "Hemos recibido su mensaje. Le responderemos en breve.",
  enquiryReceived:
    "Hemos recibido su consulta de adquisición. Le responderemos en breve.",
  sendAnotherMessage: "Enviar otro mensaje",
  sendAnotherEnquiry: "Enviar otra consulta",
  nameRequired: "El nombre es obligatorio",
  validEmail: "Introduzca una dirección de correo válida",
  messageMinLength: "El mensaje debe tener al menos 10 caracteres",
  readMore: "Leer más",
  readInsight: "Leer artículo",
  viewAll: "Ver todo",
  viewAllInsights: "Ver todos los artículos",
  viewAllProjects: "Ver todos los proyectos",
  viewAllBusinesses: "Ver todas las empresas",
  viewCaseStudy: "Ver estudio de caso",
  viewFullDetail: "Ver detalle completo",
  visitSite: "Visitar sitio",
  buyBusiness: "Comprar negocio",
  mostPopular: "Más popular",
  keyDeliverables: "Entregables clave",
  learnMore: "Saber más",
  howWeWork: "Cómo trabajamos",
  followUs: "Síguenos",
  backToTop: "Volver arriba",
  allRightsReserved: "Todos los derechos reservados.",
  scrollLeft: "Desplazarse a la izquierda",
  scrollRight: "Desplazarse a la derecha",
  categoryEcommerce: "Ecommerce",
  categorySaaS: "SaaS",
  categoryAgency: "Agencia",
  categoryAiTools: "Herramientas IA",
  categoryPersonalBrand: "Marca personal",
  categoryLocalBusiness: "Negocio local",
  categoryDigitalProducts: "Productos digitales",
  chatOpen: "Abrir chat",
  chatClose: "Cerrar chat",
  chatPlaceholder: "Escribe un mensaje…",
  chatSend: "Enviar",
  chatEscalated: "Se ha notificado a un miembro del equipo y le ayudará pronto.",
  chatOffline:
    "Estamos fuera de línea. Deja un mensaje y te responderemos.",
  chatError: "Algo salió mal. Inténtalo de nuevo.",
  heroEyebrowFallback: "Agencia digital premium",
  viewSite: "Ver sitio",
};

const dictionary: UiDictionary = { en, de, fr, es };

export function t(locale: string, key: UiStringKey): string {
  const table =
    dictionary[(locale as (typeof SUPPORTED_LOCALES)[number])] ?? dictionary[DEFAULT_LOCALE];
  return table[key] ?? en[key];
}

export function tWithNumber(
  locale: string,
  key: UiStringKey,
  n: number
): string {
  return t(locale, key).replace("{n}", String(n));
}

const VALIDATION_MAP: Record<string, UiStringKey> = {
  "Name is required": "nameRequired",
  "Enter a valid email address": "validEmail",
  "Message must be at least 10 characters": "messageMinLength",
};

/** Translates known Zod validation messages; passes through anything else. */
export function translateValidation(
  locale: string,
  message?: string
): string {
  if (!message) return "";
  const key = VALIDATION_MAP[message];
  return key ? t(locale, key) : message;
}
