import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./resolve-translation";

export type UiStringKey =
  | "skipToContent"
  | "startAProject"
  | "startYourProject"
  | "yourName"
  | "yourEmail"
  | "emailLabel"
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
  | "messagePlaceholder"
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
  | "readArticle"
  | "minRead"
  | "filterAll"
  | "goBack"
  | "noInsightsInCategory"
  | "noInsightsYet"
  | "insightFallback"
  | "viewAll"
  | "viewAllInsights"
  | "viewAllProjects"
  | "viewAllBusinesses"
  | "viewCaseStudy"
  | "viewFullDetail"
  | "visitSite"
  | "buyBusiness"
  | "buyABusiness"
  | "buyBusinessFallback"
  | "acquisition"
  | "exploreBy"
  | "niche"
  | "exploreByNicheDescription"
  | "businessesCount"
  | "avgShort"
  | "viewListings"
  | "viewNicheBusinesses"
  | "readyToOwnBusiness"
  | "readyToOwnBusinessA"
  | "readyToOwnBusinessQ"
  | "acquisitionGuideDescription"
  | "scheduleConsultation"
  | "businesses"
  | "avgAskingPrice"
  | "available"
  | "vettedListingsDescription"
  | "notFindingWhatYouNeed"
  | "newListingsComingSoon"
  | "activelyVettingDescription"
  | "getNotified"
  | "exploreOther"
  | "niches"
  | "browseMoreOpportunities"
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
  | "chatName"
  | "chatOnline"
  | "chatGreeting"
  | "chatChat"
  | "chatFaq"
  | "chatServices"
  | "chatPricing"
  | "chatSupport"
  | "chatHelp"
  | "chatContact"
  | "chatWelcomeTitle"
  | "chatWelcome"
  | "chatDataSafe"
  | "chatReadMore"
  | "chatPrivacyNote"
  | "chatEmailQuestion"
  | "chatYes"
  | "chatMaybeLater"
  | "chatYesReply"
  | "chatYesReadMore"
  | "chatLaterReply"
  | "chatYourNamePlaceholder"
  | "chatYourEmailPlaceholder"
  | "chatEditName"
  | "chatTyping"
  | "chatTypingStatus"
  | "chatShowEarlier"
  | "chatAskAbout"
  | "chatLearnMore"
  | "chatInterestedIn"
  | "chatTellMeMore"
  | "chatPricingTitle"
  | "chatPricingBody"
  | "chatAskAboutPricing"
  | "chatPricingQuestion"
  | "chatServicesQuestion"
  | "chatAskAboutServices"
  | "chatFaqTitle"
  | "chatFaqMoreQuestions"
  | "chatSave"
  | "chatCancel"
  | "chatLanguage"
  | "chatRestart"
  | "chatVisitor"
  | "chatUploadFile"
  | "chatStatusLine"
  | "chatBuiltBy"
  | "heroEyebrowFallback"
  | "viewSite"
  | "contactEyebrow"
  | "getInTouch"
  | "popupHeadingA"
  | "popupHeadingB"
  | "noSpamNote"
  | "closePopup"
  | "popupSubheading"
  | "sendProjectRequest"
  | "serviceNeeded"
  | "estimatedBudget"
  | "selectService"
  | "notSureYet"
  | "trustNoSpam"
  | "trustNoSpamDesc"
  | "trustPrivate"
  | "trustPrivateDesc"
  | "trustQuickResponse"
  | "trustQuickResponseDesc"
  | "workCaseStudy"
  | "workCaseStudies"
  | "workChallenge"
  | "workClient"
  | "workGallery"
  | "workIndustry"
  | "workMoreWork"
  | "workMoved"
  | "workNumbersThat"
  | "workOurProcess"
  | "workResults"
  | "workSameRigor"
  | "workSelected"
  | "workServices"
  | "workSimilar"
  | "workSolution"
  | "workStartCta"
  | "workTheProblem"
  | "workVisual"
  | "workVisuals"
  | "workWantOutcome"
  | "workWhatWeDid"
  | "workYear"
  | "workYear";

type UiStrings = Record<UiStringKey, string>;
type UiDictionary = Record<(typeof SUPPORTED_LOCALES)[number], UiStrings>;

const en: UiStrings = {
  skipToContent: "Skip to content",
  startAProject: "Start a Project",
  startYourProject: "Start Your Project",
  yourName: "Your name *",
  yourEmail: "you@company.com *",
  emailLabel: "Email *",
  companyName: "Company name",
  phoneOptional: "Phone (optional)",
  selectServices: "Select services",
  servicesSelected: "{n} services selected",
  projectBudget: "Project Budget",
  selectRange: "Select a range",
  customBudget: "Custom budget",
  customBudgetOptional: "Custom budget (optional)",
  budgetRangeOptional: "Budget range (optional)",
  whichBusiness: "Which business are you interested in?",
  otherNotListed: "Other / not listed",
  tellUsProject: "Tell us about your project *",
  messagePlaceholder: "How can we help?",
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
  readArticle: "Read Article",
  minRead: "{n} min read",
  filterAll: "All",
  goBack: "Go back",
  noInsightsInCategory: "No articles in this category yet.",
  noInsightsYet: "Articles will appear here soon.",
  insightFallback: "Insight",
  viewAll: "View All",
  viewAllInsights: "View All Insights",
  viewAllProjects: "View All Projects",
  viewAllBusinesses: "View All Businesses",
  viewCaseStudy: "View Case Study",
  viewFullDetail: "View Full Detail",
  visitSite: "Visit Site",
  buyBusiness: "Buy Business",
  buyABusiness: "Buy a Business",
  buyBusinessFallback:
    "Skip the startup grind. Browse our curated marketplace of profitable, turnkey businesses across high-demand niches.",
  acquisition: "Acquisition",
  exploreBy: "Explore by",
  niche: "Niche",
  exploreByNicheDescription:
    "Select a niche to see available businesses for acquisition.",
  businessesCount: "{n} businesses",
  avgShort: "avg.",
  viewListings: "View Listings",
  viewNicheBusinesses: "View {value} Businesses",
  readyToOwnBusiness: "Ready to Own a Business?",
  readyToOwnBusinessA: "Ready to Own a",
  readyToOwnBusinessQ: "Business?",
  acquisitionGuideDescription:
    "Our team will guide you through every step of the acquisition process — from due diligence to transition.",
  scheduleConsultation: "Schedule a Consultation",
  businesses: "Businesses",
  avgAskingPrice: "{value} avg. asking price",
  available: "Available",
  vettedListingsDescription: "Vetted, turnkey listings ready for a new owner.",
  notFindingWhatYouNeed: "Not finding what you need?",
  newListingsComingSoon: "New {value} listings coming soon",
  activelyVettingDescription:
    "We're actively vetting businesses in this niche. Tell us what you're looking for and we'll alert you the moment a match lands.",
  getNotified: "Get Notified",
  exploreOther: "Explore Other",
  niches: "Niches",
  browseMoreOpportunities:
    "Browse more acquisition opportunities across the marketplace.",
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
  chatName: "Stratifit AI",
  chatOnline: "Online",
  chatGreeting:
    "👋 Hi! I'm Stratifit AI — here to help. What would you like to know?",
  chatChat: "Chat",
  chatFaq: "FAQ",
  chatServices: "Services",
  chatPricing: "Pricing",
  chatSupport: "Support",
  chatHelp: "Help",
  chatContact: "Contact",
  chatWelcomeTitle: "Welcome to Stratifit",
  chatWelcome:
    "Welcome to Stratifit — your digital agency for growth. What's your name? It helps me personalize your chat. Email is optional and only used for follow-ups.",
  chatDataSafe: "Your data is safe",
  chatReadMore: "Read more",
  chatPrivacyNote:
    "We only use your details to respond to your enquiry. We never share them with third parties.",
  chatEmailQuestion:
    "Great, {name}! Would you like to share your email for follow-ups? It's only used for business communication.",
  chatYes: "Yes",
  chatMaybeLater: "Maybe later",
  chatYesReply:
    "Welcome to Stratifit! Your email will only be used to contact you about important details. What would you like me to help you with today?",
  chatYesReadMore:
    "Your email is stored securely and used only for business follow-ups. We never share your details and never send marketing emails.",
  chatLaterReply:
    "Welcome to Stratifit — your digital agency for growth. What would you like to know?",
  chatYourNamePlaceholder: "Your name...",
  chatYourEmailPlaceholder: "you@company.com",
  chatEditName: "Edit name",
  chatTyping: "Stratifit AI is typing…",
  chatTypingStatus: "Typing…",
  chatShowEarlier: "Earlier messages",
  chatAskAbout: "Ask about this",
  chatLearnMore: "Learn more",
  chatInterestedIn: "I'm interested in {service}.",
  chatTellMeMore: "Tell me more about {service}.",
  chatPricingTitle: "Pricing & Packages",
  chatPricingBody:
    "Packages for every stage — from landing pages to full platforms. Tell us about your project for a tailored quote.",
  chatAskAboutPricing: "Ask about pricing",
  chatPricingQuestion: "I'd like to know more about pricing.",
  chatServicesQuestion: "I'd like to know more about your services.",
  chatAskAboutServices: "Ask about services",
  chatFaqTitle: "Common Questions",
  chatFaqMoreQuestions: "Have more questions?",
  chatSave: "Save",
  chatCancel: "Cancel",
  chatLanguage: "Select language",
  chatRestart: "Restart chat",
  chatVisitor: "User",
  chatUploadFile: "Upload file",
  chatStatusLine: "AI assistant · Human support available",
  chatBuiltBy: "Built by STRATIFIT team",
  heroEyebrowFallback: "Premium Digital Agency",
  viewSite: "View site",
  contactEyebrow: "Contact",
  getInTouch: "Get in Touch",
  popupHeadingA: "Tell us about your",
  popupHeadingB: "project",
  noSpamNote: "No spam. Your data stays private.",
  closePopup: "Close",
  popupSubheading:
    "Share what you're building and where you need help. We'll review it and recommend the right approach.",
  sendProjectRequest: "Send Project Request",
  serviceNeeded: "Services",
  estimatedBudget: "Estimated budget",
  selectService: "Services",
  notSureYet: "Not sure yet",
  trustNoSpam: "No spam",
  trustNoSpamDesc: "We respect your inbox.",
  trustPrivate: "100% private",
  trustPrivateDesc: "Your data stays secure.",
  trustQuickResponse: "Quick response",
  trustQuickResponseDesc: "We reply within 24h.",
  workCaseStudy: "Case Study",
  workCaseStudies: "Case Studies",
  workChallenge: "Challenge",
  workClient: "Client",
  workGallery: "Gallery",
  workIndustry: "Industry",
  workMoreWork: "More Work",
  workMoved: "Moved",
  workNumbersThat: "Numbers That",
  workOurProcess: "Our Process",
  workResults: "Results",
  workSameRigor:
    "Same rigor, same playbook — applied to your business and measured by your metrics.",
  workSelected: "Selected",
  workServices: "Services",
  workSimilar: "Similar",
  workSolution: "Solution",
  workStartCta: "Start your project with Stratifit",
  workTheProblem: "The Problem",
  workVisual: "visual",
  workVisuals: "Visuals",
  workWantOutcome: "Want an outcome like this?",
  workWhatWeDid: "What We Did",
  workYear: "Year",
};

const de: UiStrings = {
  skipToContent: "Zum Inhalt springen",
  startAProject: "Projekt starten",
  startYourProject: "Projekt starten",
  yourName: "Ihr Name *",
  yourEmail: "sie@firma.com *",
  emailLabel: "E-Mail *",
  companyName: "Firmenname",
  phoneOptional: "Telefon (optional)",
  selectServices: "Leistungen auswählen",
  servicesSelected: "{n} Leistungen ausgewählt",
  projectBudget: "Projektbudget",
  selectRange: "Bereich auswählen",
  customBudget: "Eigenes Budget",
  customBudgetOptional: "Eigenes Budget (optional)",
  budgetRangeOptional: "Budgetbereich (optional)",
  whichBusiness: "An welchem Unternehmen sind Sie interessiert?",
  otherNotListed: "Andere / nicht gelistet",
  tellUsProject: "Erzählen Sie uns von Ihrem Projekt *",
  messagePlaceholder: "Wie können wir helfen?",
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
  readArticle: "Artikel lesen",
  minRead: "{n} Min. Lesezeit",
  filterAll: "Alle",
  goBack: "Zurück",
  noInsightsInCategory: "Noch keine Artikel in dieser Kategorie.",
  noInsightsYet: "Artikel erscheinen hier bald.",
  insightFallback: "Einblick",
  viewAll: "Alle ansehen",
  viewAllInsights: "Alle Einblicke ansehen",
  viewAllProjects: "Alle Projekte ansehen",
  viewAllBusinesses: "Alle Unternehmen ansehen",
  viewCaseStudy: "Fallstudie ansehen",
  viewFullDetail: "Alle Details ansehen",
  visitSite: "Website besuchen",
  buyBusiness: "Unternehmen kaufen",
  buyABusiness: "Ein Unternehmen kaufen",
  buyBusinessFallback:
    "Überspringen Sie den Start-up-Dschungel. Stöbern Sie in unserem kuratierten Marktplatz für profitable, schlüsselfertige Unternehmen aus stark nachgefragten Nischen.",
  acquisition: "Akquisition",
  exploreBy: "Stöbern nach",
  niche: "Nische",
  exploreByNicheDescription:
    "Wählen Sie eine Nische, um verfügbare Unternehmen zur Übernahme zu sehen.",
  businessesCount: "{n} Unternehmen",
  avgShort: "Ø",
  viewListings: "Listings ansehen",
  viewNicheBusinesses: "{value}-Unternehmen ansehen",
  readyToOwnBusiness: "Bereit, ein Unternehmen zu kaufen?",
  readyToOwnBusinessA: "Bereit, ein Unternehmen zu",
  readyToOwnBusinessQ: "kaufen?",
  acquisitionGuideDescription:
    "Unser Team begleitet Sie durch jeden Schritt des Übernahmeprozesses — von der Due Diligence bis zum Übergang.",
  scheduleConsultation: "Beratung vereinbaren",
  businesses: "Unternehmen",
  avgAskingPrice: "Ø-Kaufpreis {value}",
  available: "Verfügbare",
  vettedListingsDescription:
    "Geprüfte, schlüsselfertige Listings – bereit für neue Eigentümer.",
  notFindingWhatYouNeed: "Finden Sie nicht, was Sie suchen?",
  newListingsComingSoon: "Neue {value}-Listings in Kürze",
  activelyVettingDescription:
    "Wir prüfen derzeit aktiv Unternehmen in dieser Nische. Erzählen Sie uns, wonach Sie suchen, und wir benachrichtigen Sie, sobald ein Treffer vorliegt.",
  getNotified: "Benachrichtigen lassen",
  exploreOther: "Weitere",
  niches: "Nischen",
  browseMoreOpportunities:
    "Entdecken Sie weitere Übernahmemöglichkeiten auf dem Marktplatz.",
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
  chatName: "Stratifit AI",
  chatOnline: "Online",
  chatGreeting:
    "👋 Hallo! Ich bin Stratifit AI — wie kann ich Ihnen helfen?",
  chatChat: "Chat",
  chatFaq: "FAQ",
  chatServices: "Leistungen",
  chatPricing: "Preise",
  chatSupport: "Support",
  chatHelp: "Hilfe",
  chatContact: "Kontakt",
  chatWelcomeTitle: "Willkommen bei Stratifit",
  chatWelcome:
    "Willkommen bei Stratifit — Ihre Digitalagentur für Wachstum. Wie heißen Sie? So kann ich den Chat personalisieren. Die E-Mail ist optional und wird nur für Follow-ups verwendet.",
  chatDataSafe: "Ihre Daten sind sicher",
  chatReadMore: "Mehr erfahren",
  chatPrivacyNote:
    "Wir verwenden Ihre Daten nur zur Beantwortung Ihrer Anfrage. Wir geben sie niemals an Dritte weiter.",
  chatEmailQuestion:
    "Großartig, {name}! Möchten Sie Ihre E-Mail für Follow-ups hinterlassen? Sie wird nur für geschäftliche Kommunikation verwendet.",
  chatYes: "Ja",
  chatMaybeLater: "Vielleicht später",
  chatYesReply:
    "Willkommen bei Stratifit! Ihre E-Mail wird nur verwendet, um Sie bei wichtigen Details zu kontaktieren. Womit kann ich Ihnen heute helfen?",
  chatYesReadMore:
    "Ihre E-Mail wird sicher gespeichert und nur für geschäftliche Follow-ups verwendet. Wir geben Ihre Daten niemals weiter und senden keine Werbung.",
  chatLaterReply:
    "Willkommen bei Stratifit — Ihre Digitalagentur für Wachstum. Was möchten Sie wissen?",
  chatYourNamePlaceholder: "Ihr Name...",
  chatYourEmailPlaceholder: "sie@firma.com",
  chatEditName: "Namen bearbeiten",
  chatTyping: "Stratifit AI schreibt…",
  chatTypingStatus: "Schreibt…",
  chatShowEarlier: "Frühere Nachrichten",
  chatAskAbout: "Danach fragen",
  chatLearnMore: "Mehr erfahren",
  chatInterestedIn: "Ich interessiere mich für {service}.",
  chatTellMeMore: "Erzähl mir mehr über {service}.",
  chatPricingTitle: "Preise & Pakete",
  chatPricingBody:
    "Pakete für jede Phase – von Landingpages bis zu vollständigen Plattformen. Teilen Sie uns Ihr Projekt für ein individuelles Angebot mit.",
  chatAskAboutPricing: "Nach Preisen fragen",
  chatPricingQuestion: "Ich möchte mehr über die Preise wissen.",
  chatServicesQuestion: "Ich möchte mehr über Ihre Leistungen erfahren.",
  chatAskAboutServices: "Nach Leistungen fragen",
  chatFaqTitle: "Häufige Fragen",
  chatFaqMoreQuestions: "Haben Sie weitere Fragen?",
  chatSave: "Speichern",
  chatCancel: "Abbrechen",
  chatLanguage: "Sprache auswählen",
  chatRestart: "Chat neu starten",
  chatVisitor: "Benutzer",
  chatUploadFile: "Datei hochladen",
  chatStatusLine: "KI-Assistent · Menschlicher Support verfügbar",
  chatBuiltBy: "Erstellt vom STRATIFIT-Team",
  heroEyebrowFallback: "Premium-Digitalagentur",
  viewSite: "Website ansehen",
  contactEyebrow: "Kontakt",
  getInTouch: "Kontakt aufnehmen",
  popupHeadingA: "Erzählen Sie uns von Ihrem",
  popupHeadingB: "Projekt",
  noSpamNote: "Kein Spam. Ihre Daten bleiben privat.",
  closePopup: "Schließen",
  popupSubheading:
    "Teilen Sie uns mit, was Sie bauen und wo Sie Hilfe benötigen. Wir prüfen es und empfehlen den richtigen Ansatz.",
  sendProjectRequest: "Projektanfrage senden",
  serviceNeeded: "Leistungen",
  estimatedBudget: "Geschätztes Budget",
  selectService: "Leistungen",
  notSureYet: "Noch unsicher",
  trustNoSpam: "Kein Spam",
  trustNoSpamDesc: "Wir respektieren Ihren Posteingang.",
  trustPrivate: "100% privat",
  trustPrivateDesc: "Ihre Daten bleiben sicher.",
  trustQuickResponse: "Schnelle Antwort",
  trustQuickResponseDesc: "Wir antworten innerhalb von 24 Std.",
  workCaseStudy: "Fallstudie",
  workCaseStudies: "Fallstudien",
  workChallenge: "Herausforderung",
  workClient: "Kunde",
  workGallery: "Galerie",
  workIndustry: "Branche",
  workMoreWork: "Weitere Arbeiten",
  workMoved: "bewegen",
  workNumbersThat: "Zahlen, die",
  workOurProcess: "Unser Prozess",
  workResults: "Ergebnisse",
  workSameRigor:
    "Dieselbe Gründlichkeit, dasselbe Vorgehen — angewendet auf Ihr Unternehmen und gemessen an Ihren Kennzahlen.",
  workSelected: "Ausgewählte",
  workServices: "Leistungen",
  workSimilar: "Ähnliche",
  workSolution: "Lösung",
  workStartCta: "Starten Sie Ihr Projekt mit Stratifit",
  workTheProblem: "Das Problem",
  workVisual: "Visual",
  workVisuals: "Visuals",
  workWantOutcome: "Möchten Sie ein solches Ergebnis?",
  workWhatWeDid: "Was wir getan haben",
  workYear: "Jahr",
};

const fr: UiStrings = {
  skipToContent: "Aller au contenu",
  startAProject: "Démarrer un projet",
  startYourProject: "Démarrer votre projet",
  yourName: "Votre nom *",
  yourEmail: "vous@entreprise.com *",
  emailLabel: "E-mail *",
  companyName: "Nom de l'entreprise",
  phoneOptional: "Téléphone (facultatif)",
  selectServices: "Sélectionnez les services",
  servicesSelected: "{n} services sélectionnés",
  projectBudget: "Budget du projet",
  selectRange: "Sélectionner une fourchette",
  customBudget: "Budget personnalisé",
  customBudgetOptional: "Budget personnalisé (facultatif)",
  budgetRangeOptional: "Fourchette de budget (facultatif)",
  whichBusiness: "Quelle entreprise vous intéresse ?",
  otherNotListed: "Autre / non répertorié",
  tellUsProject: "Parlez-nous de votre projet *",
  messagePlaceholder: "Comment pouvons-nous aider ?",
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
  readArticle: "Lire l'article",
  minRead: "{n} min de lecture",
  filterAll: "Tous",
  goBack: "Retour",
  noInsightsInCategory: "Aucun article dans cette catégorie pour le moment.",
  noInsightsYet: "Les articles apparaîtront bientôt ici.",
  insightFallback: "Article",
  viewAll: "Voir tout",
  viewAllInsights: "Voir tous les articles",
  viewAllProjects: "Voir tous les projets",
  viewAllBusinesses: "Voir toutes les entreprises",
  viewCaseStudy: "Voir l'étude de cas",
  viewFullDetail: "Voir le détail complet",
  visitSite: "Visiter le site",
  buyBusiness: "Acheter l'entreprise",
  buyABusiness: "Acheter une entreprise",
  buyBusinessFallback:
    "Évitez la galère du démarrage. Parcourez notre marketplace de sociétés rentables et clés en main dans sept niches très demandées.",
  acquisition: "Acquisition",
  exploreBy: "Explorer par",
  niche: "Niche",
  exploreByNicheDescription:
    "Sélectionnez une niche pour voir les sociétés disponibles à l'acquisition.",
  businessesCount: "{n} sociétés",
  avgShort: "moy.",
  viewListings: "Voir les annonces",
  viewNicheBusinesses: "Voir les sociétés {value}",
  readyToOwnBusiness: "Prêt à posséder une entreprise ?",
  readyToOwnBusinessA: "Prêt à posséder une",
  readyToOwnBusinessQ: "entreprise ?",
  acquisitionGuideDescription:
    "Notre équipe vous accompagne à chaque étape du processus d'acquisition — de la due diligence à la transition.",
  scheduleConsultation: "Planifier une consultation",
  businesses: "Entreprises",
  avgAskingPrice: "{value} prix moyen demandé",
  available: "Disponibles",
  vettedListingsDescription:
    "Des annonces vérifiées et clés en main, prêtes pour un nouveau propriétaire.",
  notFindingWhatYouNeed: "Vous ne trouvez pas ce qu'il vous faut ?",
  newListingsComingSoon: "De nouvelles annonces {value} arrivent bientôt",
  activelyVettingDescription:
    "Nous évaluons activement des entreprises dans cette niche. Dites-nous ce que vous cherchez et nous vous alerterons dès qu'une opportunité correspond.",
  getNotified: "Être prévenu",
  exploreOther: "Explorer d'autres",
  niches: "Niches",
  browseMoreOpportunities:
    "Parcourez d'autres opportunités d'acquisition sur le marché.",
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
  chatName: "Stratifit AI",
  chatOnline: "En ligne",
  chatGreeting:
    "👋 Bonjour ! Je suis Stratifit AI — comment puis-je vous aider ?",
  chatChat: "Chat",
  chatFaq: "FAQ",
  chatServices: "Services",
  chatPricing: "Tarifs",
  chatSupport: "Support",
  chatHelp: "Aide",
  chatContact: "Contact",
  chatWelcomeTitle: "Bienvenue chez Stratifit",
  chatWelcome:
    "Bienvenue chez Stratifit — votre agence digitale pour la croissance. Quel est votre prénom ? Cela m'aide à personnaliser le chat. L'e-mail est facultatif et sert uniquement aux relances.",
  chatDataSafe: "Vos données sont en sécurité",
  chatReadMore: "En savoir plus",
  chatPrivacyNote:
    "Nous n'utilisons vos informations que pour répondre à votre demande. Nous ne les partageons jamais avec des tiers.",
  chatEmailQuestion:
    "Parfait, {name} ! Souhaitez-vous partager votre e-mail pour les relances ? Il n'est utilisé que pour la communication professionnelle.",
  chatYes: "Oui",
  chatMaybeLater: "Peut-être plus tard",
  chatYesReply:
    "Bienvenue chez Stratifit ! Votre e-mail ne servira qu'à vous contacter pour des informations importantes. En quoi puis-je vous aider aujourd'hui ?",
  chatYesReadMore:
    "Votre e-mail est stocké en toute sécurité et utilisé uniquement pour les relances professionnelles. Nous ne partageons jamais vos données et n'envoyons jamais de publicité.",
  chatLaterReply:
    "Bienvenue chez Stratifit — votre agence digitale pour la croissance. Que souhaitez-vous savoir ?",
  chatYourNamePlaceholder: "Votre prénom...",
  chatYourEmailPlaceholder: "vous@entreprise.com",
  chatEditName: "Modifier le nom",
  chatTyping: "Stratifit AI écrit…",
  chatTypingStatus: "Écrit…",
  chatShowEarlier: "Messages précédents",
  chatAskAbout: "Demander",
  chatLearnMore: "En savoir plus",
  chatInterestedIn: "Je suis intéressé par {service}.",
  chatTellMeMore: "Parlez-moi davantage de {service}.",
  chatPricingTitle: "Tarifs & formules",
  chatPricingBody:
    "Des formules pour chaque étape – des landing pages aux plateformes complètes. Parlez-nous de votre projet pour un devis personnalisé.",
  chatAskAboutPricing: "Demander les tarifs",
  chatPricingQuestion: "J'aimerais en savoir plus sur les tarifs.",
  chatServicesQuestion: "J'aimerais en savoir plus sur vos services.",
  chatAskAboutServices: "Demander des services",
  chatFaqTitle: "Questions fréquentes",
  chatFaqMoreQuestions: "D'autres questions ?",
  chatSave: "Enregistrer",
  chatCancel: "Annuler",
  chatLanguage: "Choisir la langue",
  chatRestart: "Redémarrer le chat",
  chatVisitor: "Utilisateur",
  chatUploadFile: "Téléverser un fichier",
  chatStatusLine: "Assistant IA · Support humain disponible",
  chatBuiltBy: "Créé par l'équipe STRATIFIT",
  heroEyebrowFallback: "Agence digitale premium",
  viewSite: "Voir le site",
  contactEyebrow: "Contact",
  getInTouch: "Prenez contact",
  popupHeadingA: "Parlez-nous de votre",
  popupHeadingB: "projet",
  noSpamNote: "Pas de spam. Vos données restent privées.",
  closePopup: "Fermer",
  popupSubheading:
    "Partagez ce que vous construisez et où vous avez besoin d'aide. Nous l'examinerons et recommanderons la bonne approche.",
  sendProjectRequest: "Envoyer la demande",
  serviceNeeded: "Services",
  estimatedBudget: "Budget estimé",
  selectService: "Services",
  notSureYet: "Pas encore sûr",
  trustNoSpam: "Pas de spam",
  trustNoSpamDesc: "Nous respectons votre boîte de réception.",
  trustPrivate: "100% privé",
  trustPrivateDesc: "Vos données restent sécurisées.",
  trustQuickResponse: "Réponse rapide",
  trustQuickResponseDesc: "Nous répondons sous 24h.",
  workCaseStudy: "Étude de cas",
  workCaseStudies: "similaires",
  workChallenge: "Défi",
  workClient: "Client",
  workGallery: "Galerie",
  workIndustry: "Secteur",
  workMoreWork: "Autres projets",
  workMoved: "parlent",
  workNumbersThat: "Des chiffres qui",
  workOurProcess: "Notre processus",
  workResults: "Résultats",
  workSameRigor:
    "Même rigueur, même méthode — appliquées à votre entreprise et mesurées à vos indicateurs.",
  workSelected: "Visuels",
  workServices: "Services",
  workSimilar: "Études de cas",
  workSolution: "Solution",
  workStartCta: "Lancez votre projet avec Stratifit",
  workTheProblem: "Le problème",
  workVisual: "visuel",
  workVisuals: "sélectionnés",
  workWantOutcome: "Vous voulez un résultat similaire ?",
  workWhatWeDid: "Ce que nous avons fait",
  workYear: "Année",
};

const es: UiStrings = {
  skipToContent: "Saltar al contenido",
  startAProject: "Iniciar un proyecto",
  startYourProject: "Inicia tu proyecto",
  yourName: "Su nombre *",
  yourEmail: "usted@empresa.com *",
  emailLabel: "Correo electrónico *",
  companyName: "Nombre de la empresa",
  phoneOptional: "Teléfono (opcional)",
  selectServices: "Selecciona los servicios",
  servicesSelected: "{n} servicios seleccionados",
  projectBudget: "Presupuesto del proyecto",
  selectRange: "Seleccionar un rango",
  customBudget: "Presupuesto personalizado",
  customBudgetOptional: "Presupuesto personalizado (opcional)",
  budgetRangeOptional: "Rango de presupuesto (opcional)",
  whichBusiness: "¿Qué empresa le interesa?",
  otherNotListed: "Otro / no listado",
  tellUsProject: "Cuéntanos sobre tu proyecto *",
  messagePlaceholder: "¿Cómo podemos ayudarte?",
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
  readArticle: "Leer artículo",
  minRead: "{n} min de lectura",
  filterAll: "Todos",
  goBack: "Atrás",
  noInsightsInCategory: "Aún no hay artículos en esta categoría.",
  noInsightsYet: "Los artículos aparecerán pronto aquí.",
  insightFallback: "Artículo",
  viewAll: "Ver todo",
  viewAllInsights: "Ver todos los artículos",
  viewAllProjects: "Ver todos los proyectos",
  viewAllBusinesses: "Ver todas las empresas",
  viewCaseStudy: "Ver estudio de caso",
  viewFullDetail: "Ver detalle completo",
  visitSite: "Visitar sitio",
  buyBusiness: "Comprar negocio",
  buyABusiness: "Comprar un negocio",
  buyBusinessFallback:
    "Olvídate de empezar de cero. Explora nuestro mercado seleccionado de negocios rentables y listos para operar en nichos de alta demanda.",
  acquisition: "Adquisición",
  exploreBy: "Explorar por",
  niche: "Nicho",
  exploreByNicheDescription:
    "Selecciona un nicho para ver los negocios disponibles para adquisición.",
  businessesCount: "{n} negocios",
  avgShort: "prom.",
  viewListings: "Ver anuncios",
  viewNicheBusinesses: "Ver negocios {value}",
  readyToOwnBusiness: "¿Listo para ser dueño de un negocio?",
  readyToOwnBusinessA: "¿Listo para ser dueño de un",
  readyToOwnBusinessQ: "negocio?",
  acquisitionGuideDescription:
    "Nuestro equipo te guiará en cada paso del proceso de adquisición: desde la debida diligencia hasta la transición.",
  scheduleConsultation: "Programar una consulta",
  businesses: "Negocios",
  avgAskingPrice: "precio de venta prom. {value}",
  available: "Disponibles",
  vettedListingsDescription:
    "Anuncios verificados y listos para operar, preparados para un nuevo propietario.",
  notFindingWhatYouNeed: "¿No encuentras lo que necesitas?",
  newListingsComingSoon: "Próximamente nuevos anuncios de {value}",
  activelyVettingDescription:
    "Estamos evaluando activamente negocios en este nicho. Cuéntanos qué buscas y te avisaremos en cuanto surja una oportunidad.",
  getNotified: "Recibir aviso",
  exploreOther: "Explorar otros",
  niches: "Nichos",
  browseMoreOpportunities:
    "Explora más oportunidades de adquisición en el mercado.",
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
  chatName: "Stratifit AI",
  chatOnline: "En línea",
  chatGreeting:
    "👋 ¡Hola! Soy Stratifit AI — ¿en qué puedo ayudarte?",
  chatChat: "Chat",
  chatFaq: "FAQ",
  chatServices: "Servicios",
  chatPricing: "Precios",
  chatSupport: "Soporte",
  chatHelp: "Ayuda",
  chatContact: "Contacto",
  chatWelcomeTitle: "Bienvenido a Stratifit",
  chatWelcome:
    "Bienvenido a Stratifit — tu agencia digital para el crecimiento. ¿Cómo te llamas? Me ayuda a personalizar el chat. El correo es opcional y solo se usa para seguimiento.",
  chatDataSafe: "Tus datos están seguros",
  chatReadMore: "Leer más",
  chatPrivacyNote:
    "Solo usamos tus datos para responder a tu consulta. Nunca los compartimos con terceros.",
  chatEmailQuestion:
    "¡Genial, {name}! ¿Te gustaría compartir tu correo para seguimiento? Solo se usa para comunicación comercial.",
  chatYes: "Sí",
  chatMaybeLater: "Quizás más tarde",
  chatYesReply:
    "¡Bienvenido a Stratifit! Tu correo solo se usará para contactarte por detalles importantes. ¿En qué puedo ayudarte hoy?",
  chatYesReadMore:
    "Tu correo se almacena de forma segura y solo se usa para seguimientos comerciales. Nunca compartimos tus datos ni enviamos publicidad.",
  chatLaterReply:
    "Bienvenido a Stratifit — tu agencia digital para el crecimiento. ¿Qué te gustaría saber?",
  chatYourNamePlaceholder: "Tu nombre...",
  chatYourEmailPlaceholder: "usted@empresa.com",
  chatEditName: "Editar nombre",
  chatTyping: "Stratifit AI está escribiendo…",
  chatTypingStatus: "Escribiendo…",
  chatShowEarlier: "Mensajes anteriores",
  chatAskAbout: "Preguntar",
  chatLearnMore: "Saber más",
  chatInterestedIn: "Me interesa {service}.",
  chatTellMeMore: "Cuéntame más sobre {service}.",
  chatPricingTitle: "Precios y paquetes",
  chatPricingBody:
    "Paquetes para cada etapa: desde landing pages hasta plataformas completas. Cuéntanos tu proyecto para un presupuesto personalizado.",
  chatAskAboutPricing: "Preguntar por precios",
  chatPricingQuestion: "Me gustaría saber más sobre los precios.",
  chatServicesQuestion: "Me gustaría saber más sobre sus servicios.",
  chatAskAboutServices: "Preguntar por servicios",
  chatFaqTitle: "Preguntas frecuentes",
  chatFaqMoreQuestions: "¿Tiene más preguntas?",
  chatSave: "Guardar",
  chatCancel: "Cancelar",
  chatLanguage: "Seleccionar idioma",
  chatRestart: "Reiniciar chat",
  chatVisitor: "Usuario",
  chatUploadFile: "Subir archivo",
  chatStatusLine: "Asistente de IA · Soporte humano disponible",
  chatBuiltBy: "Creado por el equipo de STRATIFIT",
  heroEyebrowFallback: "Agencia digital premium",
  viewSite: "Ver sitio",
  contactEyebrow: "Contacto",
  getInTouch: "Ponte en contacto",
  popupHeadingA: "Cuéntanos sobre tu",
  popupHeadingB: "proyecto",
  noSpamNote: "Sin spam. Tus datos permanecen privados.",
  closePopup: "Cerrar",
  popupSubheading:
    "Comparte lo que estás construyendo y dónde necesitas ayuda. Lo revisaremos y recomendaremos el enfoque adecuado.",
  sendProjectRequest: "Enviar solicitud",
  serviceNeeded: "Servicios",
  estimatedBudget: "Presupuesto estimado",
  selectService: "Servicios",
  notSureYet: "Aún no lo sé",
  trustNoSpam: "Sin spam",
  trustNoSpamDesc: "Respetamos tu bandeja de entrada.",
  trustPrivate: "100% privado",
  trustPrivateDesc: "Tus datos están seguros.",
  trustQuickResponse: "Respuesta rápida",
  trustQuickResponseDesc: "Respondemos en 24h.",
  workCaseStudy: "Estudio de caso",
  workCaseStudies: "similares",
  workChallenge: "Reto",
  workClient: "Cliente",
  workGallery: "Galería",
  workIndustry: "Sector",
  workMoreWork: "Más trabajos",
  workMoved: "hablan",
  workNumbersThat: "Números que",
  workOurProcess: "Nuestro proceso",
  workResults: "Resultados",
  workSameRigor:
    "El mismo rigor, el mismo plan de juego: aplicado a tu negocio y medido con tus métricas.",
  workSelected: "Visuales",
  workServices: "Servicios",
  workSimilar: "Estudios de caso",
  workSolution: "Solución",
  workStartCta: "Comienza tu proyecto con Stratifit",
  workTheProblem: "El problema",
  workVisual: "visual",
  workVisuals: "seleccionados",
  workWantOutcome: "¿Quieres un resultado así?",
  workWhatWeDid: "Lo que hicimos",
  workYear: "Año",
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

export function tWithValue(
  locale: string,
  key: UiStringKey,
  value: string
): string {
  return t(locale, key).replace("{value}", value);
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
