import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./resolve-translation";

export type UiStringKey =
  | "skipToContent"
  | "startAProject"
  | "yourName"
  | "yourEmail"
  | "emailLabel"
  | "selectServices"
  | "servicesSelected"
  | "tellUsProject"
  | "messagePlaceholder"
  | "sending"
  | "thankYou"
  | "messageReceived"
  | "sendAnotherMessage"
  | "nameRequired"
  | "validEmail"
  | "messageMinLength"
  | "readInsight"
  | "readArticle"
  | "minRead"
  | "filterAll"
  | "goBack"
  | "noInsightsInCategory"
  | "noInsightsYet"
  | "viewAll"
  | "viewAllInsights"
  | "viewAllProjects"
  | "viewAllBusinesses"
  | "viewAllTestimonials"
  | "getStarted"
  | "verifiedClientReviews"
  | "googleReviewsLabel"
  | "seeAllReviewsOnGoogle"
  | "starsOutOfFive"
  | "viewCaseStudy"
  | "viewFullDetail"
  | "visitSite"
  | "buyBusiness"
  | "buyABusiness"
  | "buyBusinessFallback"
  | "acquisition"
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
  | "privacyPolicy"
  | "termsOfService"
  | "cookiePolicy"
  | "imprint"
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
  | "chatError"
  | "chatName"
  | "chatOnline"
  | "chatChat"
  | "chatFaq"
  | "chatServices"
  | "chatPricing"
  | "chatSupport"
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
  | "faqHelpCardTitle"
  | "faqHelpCardSubtitle"
  | "faqAskMoreQuestions"
  | "faqBotSuggestionsTitle"
  | "faqBotWelcomeFallback"
  | "faqBotFallbackFallback"
  | "chatSave"
  | "chatCancel"
  | "chatLanguage"
  | "chatRestart"
  | "chatVisitor"
  | "chatUploadFile"
  | "chatStatusLine"
  | "chatBuiltBy"
  | "contactEyebrow"
  | "getInTouch"
  | "popupHeadingA"
  | "popupHeadingB"
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
  | "workWord"
  | "workEyebrowFallback"
  | "workTitleFallback"
  | "workHighlightFallback"
  | "workEmptyProjects"
  | "workDescriptionFallback"
  | "servicesEyebrow"
  | "servicesTitle"
  | "servicesDescription"
  | "servicesCapabilities"
  | "servicesHowWeDoIt"
  | "servicesDeliverables"
  | "servicesWhatsIncluded"
  | "servicesWhyTitle"
  | "servicesHowItWorks"
  | "servicesToolkit"
  | "servicesToolsTech"
  | "servicesCaseStudies"
  | "servicesSelectedWorkDesc"
  | "servicesReadyWhenYouAre"
  | "servicesStartProject"
  | "ctaStartService"
  | "ctaExploreNiche"
  | "aboutEyebrowFallback"
  | "aboutTitleFallback"
  | "aboutHighlightFallback"
  | "aboutMission"
  | "aboutStory"
  | "aboutValues"
  | "aboutTeam"
  | "aboutCtaTitle"
  | "aboutCtaHighlight"
  | "aboutCtaDescription"
  | "testimonialsEyebrow"
  | "testimonialsTitle"
  | "testimonialsDescription"
  | "insightsEyebrow"
  | "insightsTitleFallback"
  | "insightsHighlightFallback"
  | "insightsDescriptionFallback";

type UiStrings = Record<UiStringKey, string>;
type UiDictionary = Record<(typeof SUPPORTED_LOCALES)[number], UiStrings>;

const en: UiStrings = {
  skipToContent: "Skip to content",
  startAProject: "Start a Project",
  yourName: "Your name *",
  yourEmail: "you@company.com *",
  emailLabel: "Email *",
  selectServices: "Select services",
  servicesSelected: "{n} services selected",
  tellUsProject: "Tell us about your project *",
  messagePlaceholder: "How can we help?",
  sending: "Sending…",
  thankYou: "Thank you!",
  messageReceived:
    "Your message has been received. We will get back to you shortly.",
  sendAnotherMessage: "Send another message",
  nameRequired: "Name is required",
  validEmail: "Enter a valid email address",
  messageMinLength: "Message must be at least 10 characters",
  readInsight: "Read Insight",
  readArticle: "Read Article",
  minRead: "{n} min read",
  filterAll: "All",
  goBack: "Go back",
  noInsightsInCategory: "No articles in this category yet.",
  noInsightsYet: "Articles will appear here soon.",
  viewAll: "View All",
  viewAllInsights: "View All Insights",
  viewAllProjects: "View All Projects",
  viewAllBusinesses: "View All Businesses",
  viewAllTestimonials: "View All Testimonials",
  getStarted: "Get Started",
  verifiedClientReviews: "{n} verified client reviews",
  googleReviewsLabel: "{n} Google reviews",
  seeAllReviewsOnGoogle: "See all reviews on Google",
  starsOutOfFive: "{n} out of 5 stars",
  viewCaseStudy: "View Case Study",
  viewFullDetail: "View Full Detail",
  visitSite: "Visit Site",
  buyBusiness: "Buy Business",
  buyABusiness: "Buy a Business",
  buyBusinessFallback:
    "Skip the startup grind. Browse our curated marketplace of profitable, turnkey businesses across high-demand niches.",
  acquisition: "Acquisition",
  businessesCount: "{n} businesses",
  avgShort: "avg.",
  viewListings: "View Listings",
  viewNicheBusinesses: "View {value} Businesses",
  readyToOwnBusiness: "Ready to Own a Business?",
  readyToOwnBusinessA: "Ready to Own a",
  readyToOwnBusinessQ: "Business?",
  acquisitionGuideDescription:
    "We'll guide you from due diligence to transition.",
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
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  cookiePolicy: "Cookie Policy",
  imprint: "Imprint",
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
  chatError: "Something went wrong. Please try again.",
  chatName: "Stratifit AI",
  chatOnline: "Online",
  chatChat: "Chat",
  chatFaq: "FAQ",
  chatServices: "Services",
  chatPricing: "Pricing",
  chatSupport: "Support",
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
  faqHelpCardTitle: "Still have more questions?",
  faqHelpCardSubtitle: "Chat with our FAQ AI bot — instant answers, 24/7.",
  faqAskMoreQuestions: "Ask More Questions",
  faqBotSuggestionsTitle: "Suggested questions",
  faqBotWelcomeFallback:
    "👋 Hi! I'm the Stratifit FAQ assistant. Ask me anything about our services, pricing, or process.",
  faqBotFallbackFallback:
    "I couldn't find an answer to that. A team member has been notified and will help you shortly.",
  chatSave: "Save",
  chatCancel: "Cancel",
  chatLanguage: "Select language",
  chatRestart: "Restart chat",
  chatVisitor: "User",
  chatUploadFile: "Upload file",
  chatStatusLine: "AI assistant · Human support available",
  chatBuiltBy: "Built by STRATIFIT team",
  contactEyebrow: "Contact",
  getInTouch: "Get in Touch",
  popupHeadingA: "Tell us about your",
  popupHeadingB: "project",
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
    "The same playbook, applied to your goals and your metrics.",
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
  workWord: "Work",
  workEyebrowFallback: "Portfolio",
  workTitleFallback: "Our",
  workHighlightFallback: "Work",
  workEmptyProjects: "Projects will appear here soon.",
  workDescriptionFallback:
    "We craft digital experiences that define industries and elevate brands through precision and creativity.",
  servicesEyebrow: "Services",
  servicesTitle: "What we do",
  servicesDescription:
    "Four core disciplines, one integrated approach to digital growth.",
  servicesCapabilities: "Capabilities",
  servicesHowWeDoIt: "How We Do It",
  servicesDeliverables: "Deliverables",
  servicesWhatsIncluded: "What's Included",
  servicesWhyTitle: "Why It Matters",
  servicesHowItWorks: "How It Works",
  servicesToolkit: "Toolkit",
  servicesToolsTech: "Tools & Technologies",
  servicesCaseStudies: "Case Studies",
  servicesSelectedWorkDesc:
    "Real outcomes from real projects — measured by the metrics that matter to your business.",
  servicesReadyWhenYouAre: "Ready When You Are",
  servicesStartProject: "Start Your Project",
  ctaStartService: "Start Your {value} Project",
  ctaExploreNiche: "Explore {value} Opportunities",
  aboutEyebrowFallback: "About",
  aboutTitleFallback: "About ",
  aboutHighlightFallback: "Stratifit",
  aboutMission: "Our Mission",
  aboutStory: "Our Story",
  aboutValues: "What We Stand For",
  aboutTeam: "Our Team",
  aboutCtaTitle: "Ready to Work ",
  aboutCtaHighlight: "Together?",
  aboutCtaDescription: "Let's build something exceptional.",
  testimonialsEyebrow: "Testimonials",
  testimonialsTitle: "What Our Clients",
  testimonialsDescription:
    "Don't take our word for it — hear from the brands we've helped scale.",
  insightsEyebrow: "Knowledge",
  insightsTitleFallback: "Insights &",
  insightsHighlightFallback: "Expertise",
  insightsDescriptionFallback:
    "Thought leadership, industry perspectives, and actionable strategies from our team of strategists, designers, and engineers.",
};

const de: UiStrings = {
  skipToContent: "Zum Inhalt springen",
  startAProject: "Projekt starten",
  yourName: "Ihr Name *",
  yourEmail: "sie@firma.com *",
  emailLabel: "E-Mail *",
  selectServices: "Leistungen auswählen",
  servicesSelected: "{n} Leistungen ausgewählt",
  tellUsProject: "Erzählen Sie uns von Ihrem Projekt *",
  messagePlaceholder: "Wie können wir helfen?",
  sending: "Wird gesendet…",
  thankYou: "Vielen Dank!",
  messageReceived:
    "Ihre Nachricht ist eingegangen. Wir melden uns in Kürze bei Ihnen.",
  sendAnotherMessage: "Weitere Nachricht senden",
  nameRequired: "Name erforderlich",
  validEmail: "Geben Sie eine gültige E-Mail-Adresse ein",
  messageMinLength: "Die Nachricht muss mindestens 10 Zeichen enthalten",
  readInsight: "Einblick lesen",
  readArticle: "Artikel lesen",
  minRead: "{n} Min. Lesezeit",
  filterAll: "Alle",
  goBack: "Zurück",
  noInsightsInCategory: "Noch keine Artikel in dieser Kategorie.",
  noInsightsYet: "Artikel erscheinen hier bald.",
  viewAll: "Alle ansehen",
  viewAllInsights: "Alle Einblicke ansehen",
  viewAllProjects: "Alle Projekte ansehen",
  viewAllBusinesses: "Alle Unternehmen ansehen",
  viewAllTestimonials: "Alle Testimonials ansehen",
  getStarted: "Loslegen",
  verifiedClientReviews: "{n} bestätigte Kundenbewertungen",
  googleReviewsLabel: "{n} Google-Bewertungen",
  seeAllReviewsOnGoogle: "Alle Bewertungen auf Google ansehen",
  starsOutOfFive: "{n} von 5 Sternen",
  viewCaseStudy: "Fallstudie ansehen",
  viewFullDetail: "Alle Details ansehen",
  visitSite: "Website besuchen",
  buyBusiness: "Unternehmen kaufen",
  buyABusiness: "Ein Unternehmen kaufen",
  buyBusinessFallback:
    "Überspringen Sie den Start-up-Dschungel. Stöbern Sie in unserem kuratierten Marktplatz für profitable, schlüsselfertige Unternehmen aus stark nachgefragten Nischen.",
  acquisition: "Akquisition",
  businessesCount: "{n} Unternehmen",
  avgShort: "Ø",
  viewListings: "Listings ansehen",
  viewNicheBusinesses: "{value}-Unternehmen ansehen",
  readyToOwnBusiness: "Bereit, ein Unternehmen zu kaufen?",
  readyToOwnBusinessA: "Bereit, ein Unternehmen zu",
  readyToOwnBusinessQ: "kaufen?",
  acquisitionGuideDescription:
    "Wir begleiten Sie von der Due Diligence bis zum Übergang.",
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
  privacyPolicy: "Datenschutzerklärung",
  termsOfService: "Nutzungsbedingungen",
  cookiePolicy: "Cookie-Richtlinie",
  imprint: "Impressum",
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
  chatError: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  chatName: "Stratifit AI",
  chatOnline: "Online",
  chatChat: "Chat",
  chatFaq: "FAQ",
  chatServices: "Leistungen",
  chatPricing: "Preise",
  chatSupport: "Support",
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
  faqHelpCardTitle: "Haben Sie noch mehr Fragen?",
  faqHelpCardSubtitle: "Chatten Sie mit unserem FAQ-KI-Bot – sofortige Antworten, rund um die Uhr.",
  faqAskMoreQuestions: "Weitere Fragen stellen",
  faqBotSuggestionsTitle: "Vorgeschlagene Fragen",
  faqBotWelcomeFallback:
    "👋 Hallo! Ich bin der Stratifit-FAQ-Assistent. Fragen Sie mich alles zu unseren Leistungen, Preisen oder unserem Prozess.",
  faqBotFallbackFallback:
    "Dafür habe ich keine Antwort gefunden. Ein Teammitglied wurde benachrichtigt und hilft Ihnen gleich weiter.",
  chatSave: "Speichern",
  chatCancel: "Abbrechen",
  chatLanguage: "Sprache auswählen",
  chatRestart: "Chat neu starten",
  chatVisitor: "Benutzer",
  chatUploadFile: "Datei hochladen",
  chatStatusLine: "KI-Assistent · Menschlicher Support verfügbar",
  chatBuiltBy: "Erstellt vom STRATIFIT-Team",
  contactEyebrow: "Kontakt",
  getInTouch: "Kontakt aufnehmen",
  popupHeadingA: "Erzählen Sie uns von Ihrem",
  popupHeadingB: "Projekt",
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
    "Dasselbe Vorgehen — angewendet auf Ihre Ziele und Kennzahlen.",
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
  workWord: "Arbeiten",
  workEyebrowFallback: "Portfolio",
  workTitleFallback: "Unsere",
  workHighlightFallback: "Arbeiten",
  workEmptyProjects: "Projekte erscheinen hier bald.",
  workDescriptionFallback:
    "Wir gestalten digitale Erlebnisse, die Branchen definieren und Marken mit Präzision und Kreativität aufwerten.",
  servicesEyebrow: "Leistungen",
  servicesTitle: "Was wir tun",
  servicesDescription:
    "Vier Kerndisziplinen, ein integrierter Ansatz für digitales Wachstum.",
  servicesCapabilities: "Fähigkeiten",
  servicesHowWeDoIt: "So setzen wir es um",
  servicesDeliverables: "Leistungen",
  servicesWhatsIncluded: "Was enthalten ist",
  servicesWhyTitle: "Warum es zählt",
  servicesHowItWorks: "So funktioniert es",
  servicesToolkit: "Toolkit",
  servicesToolsTech: "Tools & Technologien",
  servicesCaseStudies: "Fallstudien",
  servicesSelectedWorkDesc:
    "Echte Ergebnisse aus echten Projekten — gemessen an den Kennzahlen, die für Ihr Unternehmen zählen.",
  servicesReadyWhenYouAre: "Bereit, wenn Sie es sind",
  servicesStartProject: "Projekt starten",
  ctaStartService: "{value}-Projekt starten",
  ctaExploreNiche: "Chancen in {value} entdecken",
  aboutEyebrowFallback: "Über uns",
  aboutTitleFallback: "Über ",
  aboutHighlightFallback: "Stratifit",
  aboutMission: "Unsere Mission",
  aboutStory: "Unsere Geschichte",
  aboutValues: "Wofür wir stehen",
  aboutTeam: "Unser Team",
  aboutCtaTitle: "Bereit, gemeinsam zu",
  aboutCtaHighlight: "arbeiten?",
  aboutCtaDescription: "Lassen Sie uns etwas Außergewöhnliches schaffen.",
  testimonialsEyebrow: "Referenzen",
  testimonialsTitle: "Was unsere Kunden",
  testimonialsDescription:
    "Verlassen Sie sich nicht nur auf unser Wort — hören Sie von den Marken, die wir beim Wachstum begleitet haben.",
  insightsEyebrow: "Wissen",
  insightsTitleFallback: "Einblicke &",
  insightsHighlightFallback: "Expertise",
  insightsDescriptionFallback:
    "Thought Leadership, Branchenperspektiven und umsetzbare Strategien von unserem Team aus Strategen, Designern und Ingenieuren.",
};

const fr: UiStrings = {
  skipToContent: "Aller au contenu",
  startAProject: "Démarrer un projet",
  yourName: "Votre nom *",
  yourEmail: "vous@entreprise.com *",
  emailLabel: "E-mail *",
  selectServices: "Sélectionnez les services",
  servicesSelected: "{n} services sélectionnés",
  tellUsProject: "Parlez-nous de votre projet *",
  messagePlaceholder: "Comment pouvons-nous aider ?",
  sending: "Envoi…",
  thankYou: "Merci !",
  messageReceived:
    "Votre message a bien été reçu. Nous vous répondrons rapidement.",
  sendAnotherMessage: "Envoyer un autre message",
  nameRequired: "Le nom est requis",
  validEmail: "Saisissez une adresse e-mail valide",
  messageMinLength: "Le message doit contenir au moins 10 caractères",
  readInsight: "Lire l'article",
  readArticle: "Lire l'article",
  minRead: "{n} min de lecture",
  filterAll: "Tous",
  goBack: "Retour",
  noInsightsInCategory: "Aucun article dans cette catégorie pour le moment.",
  noInsightsYet: "Les articles apparaîtront bientôt ici.",
  viewAll: "Voir tout",
  viewAllInsights: "Voir tous les articles",
  viewAllProjects: "Voir tous les projets",
  viewAllBusinesses: "Voir toutes les entreprises",
  viewAllTestimonials: "Voir tous les témoignages",
  getStarted: "Commencer",
  verifiedClientReviews: "{n} avis clients vérifiés",
  googleReviewsLabel: "{n} avis Google",
  seeAllReviewsOnGoogle: "Voir tous les avis sur Google",
  starsOutOfFive: "{n} étoiles sur 5",
  viewCaseStudy: "Voir l'étude de cas",
  viewFullDetail: "Voir le détail complet",
  visitSite: "Visiter le site",
  buyBusiness: "Acheter l'entreprise",
  buyABusiness: "Acheter une entreprise",
  buyBusinessFallback:
    "Évitez la galère du démarrage. Parcourez notre marketplace de sociétés rentables et clés en main dans sept niches très demandées.",
  acquisition: "Acquisition",
  businessesCount: "{n} sociétés",
  avgShort: "moy.",
  viewListings: "Voir les annonces",
  viewNicheBusinesses: "Voir les sociétés {value}",
  readyToOwnBusiness: "Prêt à posséder une entreprise ?",
  readyToOwnBusinessA: "Prêt à posséder une",
  readyToOwnBusinessQ: "entreprise ?",
  acquisitionGuideDescription:
    "Nous vous accompagnons de la due diligence à la transition.",
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
  privacyPolicy: "Politique de confidentialité",
  termsOfService: "Conditions d'utilisation",
  cookiePolicy: "Politique de cookies",
  imprint: "Mentions légales",
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
  chatError: "Une erreur est survenue. Veuillez réessayer.",
  chatName: "Stratifit AI",
  chatOnline: "En ligne",
  chatChat: "Chat",
  chatFaq: "FAQ",
  chatServices: "Services",
  chatPricing: "Tarifs",
  chatSupport: "Support",
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
  faqHelpCardTitle: "Encore des questions ?",
  faqHelpCardSubtitle: "Discutez avec notre bot IA FAQ – réponses instantanées, 24h/24.",
  faqAskMoreQuestions: "Poser d'autres questions",
  faqBotSuggestionsTitle: "Questions suggérées",
  faqBotWelcomeFallback:
    "👋 Bonjour ! Je suis l'assistant FAQ Stratifit. Posez-moi toutes vos questions sur nos services, tarifs ou notre processus.",
  faqBotFallbackFallback:
    "Je n'ai pas trouvé de réponse à cela. Un membre de l'équipe a été prévenu et vous aidera bientôt.",
  chatSave: "Enregistrer",
  chatCancel: "Annuler",
  chatLanguage: "Choisir la langue",
  chatRestart: "Redémarrer le chat",
  chatVisitor: "Utilisateur",
  chatUploadFile: "Téléverser un fichier",
  chatStatusLine: "Assistant IA · Support humain disponible",
  chatBuiltBy: "Créé par l'équipe STRATIFIT",
  contactEyebrow: "Contact",
  getInTouch: "Prenez contact",
  popupHeadingA: "Parlez-nous de votre",
  popupHeadingB: "projet",
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
    "La même méthode — appliquée à vos objectifs et vos indicateurs.",
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
  workWord: "Projets",
  workEyebrowFallback: "Portfolio",
  workTitleFallback: "Nos",
  workHighlightFallback: "Projets",
  workEmptyProjects: "Les projets apparaîtront bientôt ici.",
  workDescriptionFallback:
    "Nous créons des expériences numériques qui définissent les industries et élèvent les marques avec précision et créativité.",
  servicesEyebrow: "Services",
  servicesTitle: "Ce que nous faisons",
  servicesDescription:
    "Quatre disciplines clés, une approche intégrée de la croissance digitale.",
  servicesCapabilities: "Capacités",
  servicesHowWeDoIt: "Comment nous procédons",
  servicesDeliverables: "Livrables",
  servicesWhatsIncluded: "Ce qui est inclus",
  servicesWhyTitle: "Pourquoi c'est important",
  servicesHowItWorks: "Comment ça marche",
  servicesToolkit: "Boîte à outils",
  servicesToolsTech: "Outils & technologies",
  servicesCaseStudies: "Études de cas",
  servicesSelectedWorkDesc:
    "De vrais résultats issus de vrais projets — mesurés par les indicateurs qui comptent pour votre entreprise.",
  servicesReadyWhenYouAre: "Prêt quand vous l'êtes",
  servicesStartProject: "Démarrer votre projet",
  ctaStartService: "Démarrer votre projet {value}",
  ctaExploreNiche: "Découvrir les opportunités {value}",
  aboutEyebrowFallback: "À propos",
  aboutTitleFallback: "À propos de ",
  aboutHighlightFallback: "Stratifit",
  aboutMission: "Notre mission",
  aboutStory: "Notre histoire",
  aboutValues: "Ce que nous défendons",
  aboutTeam: "Notre équipe",
  aboutCtaTitle: "Prêt à travailler ",
  aboutCtaHighlight: "ensemble ?",
  aboutCtaDescription: "Construisons quelque chose d'exceptionnel.",
  testimonialsEyebrow: "Témoignages",
  testimonialsTitle: "Ce que disent nos",
  testimonialsDescription:
    "Ne nous croyez pas sur parole — écoutez les marques que nous avons aidées à grandir.",
  insightsEyebrow: "Savoir",
  insightsTitleFallback: "Connaissances &",
  insightsHighlightFallback: "Expertise",
  insightsDescriptionFallback:
    "Leadership éclairé, perspectives sectorielles et stratégies concrètes de notre équipe de stratèges, designers et ingénieurs.",
};

const es: UiStrings = {
  skipToContent: "Saltar al contenido",
  startAProject: "Iniciar un proyecto",
  yourName: "Su nombre *",
  yourEmail: "usted@empresa.com *",
  emailLabel: "Correo electrónico *",
  selectServices: "Selecciona los servicios",
  servicesSelected: "{n} servicios seleccionados",
  tellUsProject: "Cuéntanos sobre tu proyecto *",
  messagePlaceholder: "¿Cómo podemos ayudarte?",
  sending: "Enviando…",
  thankYou: "¡Gracias!",
  messageReceived:
    "Hemos recibido su mensaje. Le responderemos en breve.",
  sendAnotherMessage: "Enviar otro mensaje",
  nameRequired: "El nombre es obligatorio",
  validEmail: "Introduzca una dirección de correo válida",
  messageMinLength: "El mensaje debe tener al menos 10 caracteres",
  readInsight: "Leer artículo",
  readArticle: "Leer artículo",
  minRead: "{n} min de lectura",
  filterAll: "Todos",
  goBack: "Atrás",
  noInsightsInCategory: "Aún no hay artículos en esta categoría.",
  noInsightsYet: "Los artículos aparecerán pronto aquí.",
  viewAll: "Ver todo",
  viewAllInsights: "Ver todos los artículos",
  viewAllProjects: "Ver todos los proyectos",
  viewAllBusinesses: "Ver todas las empresas",
  viewAllTestimonials: "Ver todos los testimonios",
  getStarted: "Empezar",
  verifiedClientReviews: "{n} reseñas verificadas de clientes",
  googleReviewsLabel: "{n} reseñas de Google",
  seeAllReviewsOnGoogle: "Ver todas las reseñas en Google",
  starsOutOfFive: "{n} de 5 estrellas",
  viewCaseStudy: "Ver estudio de caso",
  viewFullDetail: "Ver detalle completo",
  visitSite: "Visitar sitio",
  buyBusiness: "Comprar negocio",
  buyABusiness: "Comprar un negocio",
  buyBusinessFallback:
    "Olvídate de empezar de cero. Explora nuestro mercado seleccionado de negocios rentables y listos para operar en nichos de alta demanda.",
  acquisition: "Adquisición",
  businessesCount: "{n} negocios",
  avgShort: "prom.",
  viewListings: "Ver anuncios",
  viewNicheBusinesses: "Ver negocios {value}",
  readyToOwnBusiness: "¿Listo para ser dueño de un negocio?",
  readyToOwnBusinessA: "¿Listo para ser dueño de un",
  readyToOwnBusinessQ: "negocio?",
  acquisitionGuideDescription:
    "Te guiamos desde la debida diligencia hasta la transición.",
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
  privacyPolicy: "Política de privacidad",
  termsOfService: "Términos del servicio",
  cookiePolicy: "Política de cookies",
  imprint: "Aviso legal",
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
  chatError: "Algo salió mal. Inténtalo de nuevo.",
  chatName: "Stratifit AI",
  chatOnline: "En línea",
  chatChat: "Chat",
  chatFaq: "FAQ",
  chatServices: "Servicios",
  chatPricing: "Precios",
  chatSupport: "Soporte",
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
  faqHelpCardTitle: "¿Aún tiene más preguntas?",
  faqHelpCardSubtitle: "Chatea con nuestro bot de IA de preguntas frecuentes: respuestas instantáneas, 24/7.",
  faqAskMoreQuestions: "Hacer más preguntas",
  faqBotSuggestionsTitle: "Preguntas sugeridas",
  faqBotWelcomeFallback:
    "👋 ¡Hola! Soy el asistente de preguntas frecuentes de Stratifit. Pregúntame cualquier cosa sobre nuestros servicios, precios o proceso.",
  faqBotFallbackFallback:
    "No encontré una respuesta para eso. Se ha notificado a un miembro del equipo y le ayudará pronto.",
  chatSave: "Guardar",
  chatCancel: "Cancelar",
  chatLanguage: "Seleccionar idioma",
  chatRestart: "Reiniciar chat",
  chatVisitor: "Usuario",
  chatUploadFile: "Subir archivo",
  chatStatusLine: "Asistente de IA · Soporte humano disponible",
  chatBuiltBy: "Creado por el equipo de STRATIFIT",
  contactEyebrow: "Contacto",
  getInTouch: "Ponte en contacto",
  popupHeadingA: "Cuéntanos sobre tu",
  popupHeadingB: "proyecto",
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
    "El mismo plan de juego — aplicado a tus objetivos y tus métricas.",
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
  workWord: "Trabajo",
  workEyebrowFallback: "Portafolio",
  workTitleFallback: "Nuestro",
  workHighlightFallback: "Trabajo",
  workEmptyProjects: "Los proyectos aparecerán pronto aquí.",
  workDescriptionFallback:
    "Creamos experiencias digitales que definen industrias y elevan marcas con precisión y creatividad.",
  servicesEyebrow: "Servicios",
  servicesTitle: "Lo que hacemos",
  servicesDescription:
    "Cuatro disciplinas clave, un enfoque integrado para el crecimiento digital.",
  servicesCapabilities: "Capacidades",
  servicesHowWeDoIt: "Cómo lo hacemos",
  servicesDeliverables: "Entregables",
  servicesWhatsIncluded: "Qué incluye",
  servicesWhyTitle: "Por qué importa",
  servicesHowItWorks: "Cómo funciona",
  servicesToolkit: "Kit de herramientas",
  servicesToolsTech: "Herramientas y tecnologías",
  servicesCaseStudies: "Estudios de caso",
  servicesSelectedWorkDesc:
    "Resultados reales de proyectos reales, medidos por las métricas que importan para tu negocio.",
  servicesReadyWhenYouAre: "Listos cuando tú lo estés",
  servicesStartProject: "Inicia tu proyecto",
  ctaStartService: "Inicia tu proyecto de {value}",
  ctaExploreNiche: "Explorar oportunidades de {value}",
  aboutEyebrowFallback: "Nosotros",
  aboutTitleFallback: "Sobre ",
  aboutHighlightFallback: "Stratifit",
  aboutMission: "Nuestra misión",
  aboutStory: "Nuestra historia",
  aboutValues: "En lo que creemos",
  aboutTeam: "Nuestro equipo",
  aboutCtaTitle: "¿Listo para trabajar ",
  aboutCtaHighlight: "juntos?",
  aboutCtaDescription: "Construyamos algo excepcional.",
  testimonialsEyebrow: "Testimonios",
  testimonialsTitle: "Lo que dicen nuestros",
  testimonialsDescription:
    "No confíes solo en nuestra palabra: escucha a las marcas que hemos ayudado a crecer.",
  insightsEyebrow: "Conocimiento",
  insightsTitleFallback: "Conocimiento &",
  insightsHighlightFallback: "Experiencia",
  insightsDescriptionFallback:
    "Liderazgo de pensamiento, perspectivas del sector y estrategias accionables de nuestro equipo de estrategas, diseñadores e ingenieros.",
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
