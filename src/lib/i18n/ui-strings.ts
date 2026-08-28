import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./resolve-translation";

export type UiStringKey =
  | "skipToContent"
  | "startAProject"
  | "yourName"
  | "namePlaceholder"
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
  | "backToInsights"
  | "noInsightsInCategory"
  | "noInsightsYet"
  | "viewAll"
  | "viewAllInsights"
  | "viewAllProjects"
  | "viewAllBusinesses"
  | "viewAllTestimonials"
  | "viewAllStories"
  | "getStarted"
  | "verifiedClientReviews"
  | "verifiedClient"
  | "verified"
  | "reviewsCount"
  | "seeAllReviewsOnGoogle"
  | "starsOutOfFive"
  | "viewCaseStudy"
  | "viewFullDetail"
  | "browserNavHome"
  | "browserNavAbout"
  | "browserNavProducts"
  | "browserNavContact"
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
  | "alwaysActive"
  | "back"
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
  | "chatAdminTyping"
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
  | "workApplications"
  | "workAudience"
  | "workAudienceInsights"
  | "workBefore"
  | "workBrandIdentity"
  | "workDigitalPresence"
  | "workBrandInAction"
  | "workBrandInUse"
  | "workBrandChallenges"
  | "workBrandGuidelines"
  | "workCtaSubtitle"
  | "workCtaTitle"
  | "workBrandPositioning"
  | "workIdentityAssets"
  | "workIdentityDirection"
  | "workIdentitySystem"
  | "workGuidelinesIntro"
  | "workContents"
  | "workPrimaryLogo"
  | "workProblemCaption"
  | "workProjectProblem"
  | "workLogoSuite"
  | "workLogoVariations"
  | "workColourPalette"
  | "workColourUsage"
  | "workTypography"
  | "workTypeHierarchy"
  | "workHeading"
  | "workBody"
  | "workBold"
  | "workClearspace"
  | "workLogoVariants"
  | "workMinimumSize"
  | "workOurLogo"
  | "workRegular"
  | "workTypeface"
  | "workUiComponents"
  | "workVariant"
  | "workThankYou"
  | "workCaseStudy"
  | "workCaseStudies"
  | "workChallenge"
  | "workClientPerspective"
  | "workConcept"
  | "workConceptCaption"
  | "workClient"
  | "workCoreMessage"
  | "workGallery"
  | "workHowWeBuilt"
  | "workImpactA"
  | "workImpactB"
  | "workIndustry"
  | "workMoreWork"
  | "workMoved"
  | "workNumbersThat"
  | "workObjective"
  | "workOurMethod"
  | "workOurProcess"
  | "workOurSolution"
  | "workOverview"
  | "workOverviewA"
  | "workOverviewB"
  | "workPhaseDiscovery"
  | "workPhaseLaunch"
  | "workPhaseStrategy"
  | "workPhysicalTouchpoint"
  | "workPhysicalTouchpoints"
  | "workProcessA"
  | "workProcessB"
  | "workPositioning"
  | "workProcessIntro"
  | "workProcessKicker"
  | "workResults"
  | "workResultsKicker"
  | "workSameRigor"
  | "workSelected"
  | "workSelectedWork"
  | "workServices"
  | "workSimilar"
  | "workSolution"
  | "workSolutionCaption"
  | "workMark"
  | "workMessagingDirection"
  | "workNewIdentity"
  | "workStrategy"
  | "workStrategyFoundation"
  | "workValueProposition"
  | "workViewCaseStudies"
  | "workWhyThisMark"
  | "workStartCta"
  | "workTheProblem"
  | "workVisual"
  | "workVisualApplications"
  | "workVisuals"
  | "workWantOutcome"
  | "workWhatNeededToChange"
  | "workWhatWasBroken"
  | "workWhatWeDid"
  | "workWhoTheyAre"
  | "workYear"
  | "workYourProjectNext"
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
  yourName: "Your Name *",
  namePlaceholder: "Full name",
  yourEmail: "you@company.com *",
  emailLabel: "Email Address *",
  selectServices: "Select services",
  servicesSelected: "{n} services selected",
  tellUsProject: "Tell Us About Your Project *",
  messagePlaceholder: "Tell us what you would like to build, improve, or automate.",
  sending: "Sending your request...",
  thankYou: "Message Sent!",
  messageReceived:
    "Your request has been sent. We'll respond within one business day.",
  sendAnotherMessage: "Send another message",
  nameRequired: "This field is required.",
  validEmail: "Please enter a valid email address.",
  messageMinLength: "This field is required.",
  readInsight: "Read Article",
  readArticle: "Read Article",
  minRead: "{n} min read",
  filterAll: "All",
  goBack: "Go back",
  backToInsights: "Back to Insights",
  noInsightsInCategory: "No articles in this category yet.",
  noInsightsYet: "Articles will appear here soon.",
  viewAll: "View All",
  viewAllInsights: "View All Insights",
  viewAllProjects: "View All Projects",
  viewAllBusinesses: "View All Businesses",
  viewAllTestimonials: "View All Testimonials",
  viewAllStories: "View All",
  getStarted: "Get Started",
  verifiedClientReviews: "{n} verified reviews",
  verifiedClient: "Verified client",
  verified: "Verified",
  reviewsCount: "{n} reviews",
  seeAllReviewsOnGoogle: "See all reviews on Google",
  starsOutOfFive: "{n} out of 5 stars",
  viewCaseStudy: "View Case Study",
  viewFullDetail: "View Full Detail",
  browserNavHome: "Home",
  browserNavAbout: "About",
  browserNavProducts: "Products",
  browserNavContact: "Contact",
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
  alwaysActive: "Always active",
  back: "Back",
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
    "Welcome to Stratifit, your digital agency for growth. What's your name? It helps me personalize your chat. Email is optional and only used for follow-ups.",
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
    "Welcome to Stratifit, your digital agency for growth. What would you like to know?",
  chatYourNamePlaceholder: "Your name...",
  chatYourEmailPlaceholder: "you@company.com",
  chatEditName: "Edit name",
  chatTyping: "Stratifit AI is typing…",
  chatTypingStatus: "Typing…",
  chatAdminTyping: "Stratifit team is typing…",
  chatShowEarlier: "Earlier messages",
  chatAskAbout: "Ask about this",
  chatLearnMore: "Learn more",
  chatInterestedIn: "I'm interested in {service}.",
  chatTellMeMore: "Tell me more about {service}.",
  chatPricingTitle: "Pricing & Packages",
  chatPricingBody:
    "Packages for every stage, from landing pages to full platforms. Tell us about your project for a tailored quote.",
  chatAskAboutPricing: "Ask about pricing",
  chatPricingQuestion: "I'd like to know more about pricing.",
  chatServicesQuestion: "I'd like to know more about your services.",
  chatAskAboutServices: "Ask about services",
  chatFaqTitle: "Common Questions",
  chatFaqMoreQuestions: "Have more questions?",
  faqHelpCardTitle: "Still have more questions?",
  faqHelpCardSubtitle:
    "Chat with our FAQ AI bot, instant answers, 24/7.",
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
  workApplications: "Applications",
  workAudience: "Audience",
  workBefore: "Before",
  workBrandIdentity: "Brand Identity",
  workBrandInAction: "Brand in Action",
  workBrandInUse: "The Brand in Use",
  workBrandGuidelines: "Brand Guidelines",
  workDigitalPresence: "Digital Presence",
  workCtaTitle: "Make your brand stand out.",
  workCtaSubtitle:
    "Build a distinctive identity that works beautifully everywhere.",
  workIdentitySystem: "The identity system.",
  workGuidelinesIntro:
    "One coherent system, logo, colour, typography, and application, carried across every touchpoint.",
  workContents: "Contents",
  workPrimaryLogo: "Primary Logo",
  workProblemCaption: "Fragmented look & weak contrast",
  workProjectProblem: "Project Problem",
  workLogoSuite: "Logo Suite",
  workLogoVariations: "Logo Variations",
  workColourPalette: "Colour Palette",
  workColourUsage: "Colour Usage",
  workTypography: "Typography",
  workIdentityAssets: "Identity Assets",
  workPhysicalTouchpoint: "Physical Touchpoint",
  workPhysicalTouchpoints: "Physical Touchpoints",
  workVisualApplications: "Visual Applications",
  workTypeHierarchy: "Type Hierarchy",
  workHeading: "Heading",
  workBody: "Body",
  workBold: "Bold",
  workClearspace: "Clearspace",
  workLogoVariants: "Logo Variants",
  workMinimumSize: "Minimum Size",
  workOurLogo: "Our Logo",
  workRegular: "Regular",
  workTypeface: "Primary Typeface",
  workUiComponents: "Cards & UI Components",
  workVariant: "Variant",
  workThankYou: "Thank You",
  workCaseStudy: "Case Study",
  workCaseStudies: "Case Studies",
  workChallenge: "Challenge",
  workClientPerspective: "Client Perspective",
  workConcept: "The Concept",
  workConceptCaption: "C + Q custom icon geometry",
  workClient: "Client",
  workCoreMessage: "Core Message",
  workGallery: "Gallery",
  workHowWeBuilt: "How we built this brand.",
  workImpactA: "Impact &",
  workImpactB: "Results",
  workProcessKicker: "How We Work",
  workResultsKicker: "Outcomes",
  workIndustry: "Industry",
  workMoreWork: "More Work",
  workMoved: "Moved",
  workNumbersThat: "Numbers That",
  workObjective: "Objective",
  workOurMethod: "Our Method",
  workOurProcess: "Our Process",
  workOurSolution: "Our Solution",
  workOverview: "Project Overview",
  workOverviewA: "Project",
  workOverviewB: "Overview",
  workProcessA: "Our",
  workProcessB: "Process",
  workPositioning: "Positioning",
  workProcessIntro:
    "A refined process that creates clarity and transforms it into real-world impact.",
  workAudienceInsights: "Audience Insights",
  workBrandChallenges: "Brand Challenges",
  workBrandPositioning: "Brand Positioning",
  workIdentityDirection: "Identity Direction",
  workMessagingDirection: "Messaging Direction",
  workPhaseDiscovery: "Discovery",
  workPhaseLaunch: "Launch",
  workPhaseStrategy: "Strategy",
  workResults: "Results",
  workSameRigor:
    "The same playbook, applied to your goals and your metrics.",
  workSelected: "Selected",
  workSelectedWork: "Selected Work",
  workServices: "Services",
  workSimilar: "Similar",
  workStrategy: "Strategy",
  workStrategyFoundation: "Brand strategy foundation.",
  workMark: "The Mark",
  workNewIdentity: "New Identity",
  workSolution: "Solution",
  workSolutionCaption: "Unified brand systems grid",
  workStartCta: "Start your project with Stratifit",
  workValueProposition: "Value Proposition",
  workViewCaseStudies: "View case studies",
  workVisual: "visual",
  workVisuals: "Visuals",
  workWantOutcome: "Want an outcome like this?",
  workWhatNeededToChange: "What needed to change",
  workWhatWasBroken: "What was broken",
  workWhatWeDid: "What We Did",
  workWhoTheyAre: "Who they are",
  workWhyThisMark: "Why This Mark",
  workTheProblem: "The Problem",
  workYear: "Year",
  workYourProjectNext: "Your project could be next",
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
    "Real outcomes from real projects, measured by the metrics that matter to your business.",
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
    "Don't take our word for it. Hear from the brands we've helped scale.",
  insightsEyebrow: "Insights",
  insightsTitleFallback: "Ideas for Smarter",
  insightsHighlightFallback: "Digital Growth",
  insightsDescriptionFallback:
    "Thought leadership, industry perspectives, and actionable strategies from our team of strategists, designers, and engineers.",
};

const de: UiStrings = {
  skipToContent: "Zum Inhalt springen",
  startAProject: "Projekt starten",
  yourName: "Ihr Name *",
  namePlaceholder: "Vollständiger Name",
  yourEmail: "sie@firma.com *",
  emailLabel: "E-Mail-Adresse *",
  selectServices: "Leistungen auswählen",
  servicesSelected: "{n} Leistungen ausgewählt",
  tellUsProject: "Erzählen Sie uns von Ihrem Projekt *",
  messagePlaceholder: "Beschreiben Sie, was Sie entwickeln, verbessern oder automatisieren möchten.",
  sending: "Ihre Anfrage wird gesendet...",
  thankYou: "Nachricht gesendet!",
  messageReceived:
    "Ihre Anfrage wurde gesendet. Wir antworten innerhalb eines Werktages.",
  sendAnotherMessage: "Weitere Nachricht senden",
  nameRequired: "Dieses Feld ist erforderlich.",
  validEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  messageMinLength: "Dieses Feld ist erforderlich.",
  readInsight: "Artikel lesen",
  readArticle: "Artikel lesen",
  minRead: "{n} Min. Lesezeit",
  filterAll: "Alle",
  goBack: "Zurück",
  backToInsights: "Zurück zu den Beiträgen",
  noInsightsInCategory: "Noch keine Artikel in dieser Kategorie.",
  noInsightsYet: "Artikel erscheinen hier bald.",
  viewAll: "Alle ansehen",
  viewAllInsights: "Alle Beiträge ansehen",
  viewAllProjects: "Alle Projekte ansehen",
  viewAllBusinesses: "Alle Unternehmen ansehen",
  viewAllTestimonials: "Alle Testimonials ansehen",
  viewAllStories: "Alle ansehen",
  getStarted: "Loslegen",
  verifiedClientReviews: "{n} bestätigte Bewertungen",
  verifiedClient: "Verifizierter Kunde",
  verified: "Verifiziert",
  reviewsCount: "{n} Bewertungen",
  seeAllReviewsOnGoogle: "Alle Bewertungen auf Google ansehen",
  starsOutOfFive: "{n} von 5 Sternen",
  viewCaseStudy: "Fallstudie ansehen",
  viewFullDetail: "Alle Details ansehen",
  browserNavHome: "Start",
  browserNavAbout: "Über uns",
  browserNavProducts: "Produkte",
  browserNavContact: "Kontakt",
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
    "Geprüfte, schlüsselfertige Listings, bereit für neue Eigentümer.",
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
  howWeWork: "Unsere Arbeitsweise",
  followUs: "Folgen Sie uns",
  backToTop: "Nach oben",
  allRightsReserved: "Alle Rechte vorbehalten.",
  privacyPolicy: "Datenschutzerklärung",
  termsOfService: "Nutzungsbedingungen",
  cookiePolicy: "Cookie-Richtlinie",
  alwaysActive: "Immer aktiv",
  back: "Zurück",
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
    "Willkommen bei Stratifit, Ihre Digitalagentur für Wachstum. Wie heißen Sie? So kann ich den Chat personalisieren. Die E-Mail ist optional und wird nur für Follow-ups verwendet.",
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
    "Willkommen bei Stratifit, Ihre Digitalagentur für Wachstum. Was möchten Sie wissen?",
  chatYourNamePlaceholder: "Ihr Name...",
  chatYourEmailPlaceholder: "sie@firma.com",
  chatEditName: "Namen bearbeiten",
  chatTyping: "Stratifit AI schreibt…",
  chatTypingStatus: "Schreibt…",
  chatAdminTyping: "Das Stratifit-Team schreibt…",
  chatShowEarlier: "Frühere Nachrichten",
  chatAskAbout: "Danach fragen",
  chatLearnMore: "Mehr erfahren",
  chatInterestedIn: "Ich interessiere mich für {service}.",
  chatTellMeMore: "Erzähl mir mehr über {service}.",
  chatPricingTitle: "Preise & Pakete",
  chatPricingBody:
    "Pakete für jede Phase, von Landingpages bis zu vollständigen Plattformen. Teilen Sie uns Ihr Projekt für ein individuelles Angebot mit.",
  chatAskAboutPricing: "Nach Preisen fragen",
  chatPricingQuestion: "Ich möchte mehr über die Preise wissen.",
  chatServicesQuestion: "Ich möchte mehr über Ihre Leistungen erfahren.",
  chatAskAboutServices: "Nach Leistungen fragen",
  chatFaqTitle: "Häufige Fragen",
  chatFaqMoreQuestions: "Haben Sie weitere Fragen?",
  faqHelpCardTitle: "Haben Sie noch mehr Fragen?",
  faqHelpCardSubtitle:
    "Chatten Sie mit unserem FAQ-KI-Bot, sofortige Antworten, rund um die Uhr.",
  faqAskMoreQuestions: "Mehr Fragen stellen",
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
  notSureYet: "Noch nicht sicher",
  trustNoSpam: "Kein Spam",
  trustNoSpamDesc: "Wir respektieren Ihren Posteingang.",
  trustPrivate: "100% privat",
  trustPrivateDesc: "Ihre Daten bleiben sicher.",
  trustQuickResponse: "Schnelle Antwort",
  trustQuickResponseDesc: "Wir antworten innerhalb von 24 Std.",
  workApplications: "Anwendungen",
  workAudience: "Zielgruppe",
  workBefore: "Vorher",
  workBrandIdentity: "Markenidentität",
  workBrandInAction: "Marke in Aktion",
  workBrandInUse: "Die Marke im Einsatz",
  workBrandGuidelines: "Markenrichtlinien",
  workDigitalPresence: "Digitale Präsenz",
  workCtaTitle: "Lassen Sie Ihre Marke herausstechen.",
  workCtaSubtitle:
    "Bauen Sie eine unverwechselbare Identität, die überall überzeugt.",
  workIdentitySystem: "Das Identitätssystem.",
  workGuidelinesIntro:
    "Ein kohärentes System aus Logo, Farbe, Typografie und Anwendung, konsistent an jedem Berührungspunkt.",
  workContents: "Inhalt",
  workPrimaryLogo: "Primärlogo",
  workProblemCaption: "Fragmentierter Look & schwacher Kontrast",
  workProjectProblem: "Projektproblem",
  workLogoSuite: "Logo-Suite",
  workLogoVariations: "Logo-Varianten",
  workColourPalette: "Farbpalette",
  workColourUsage: "Farbeinsatz",
  workTypography: "Typografie",
  workIdentityAssets: "Identitäts-Assets",
  workPhysicalTouchpoint: "Physischer Touchpoint",
  workPhysicalTouchpoints: "Physische Touchpoints",
  workVisualApplications: "Visuelle Anwendungen",
  workTypeHierarchy: "Typografische Hierarchie",
  workHeading: "Überschrift",
  workBody: "Fließtext",
  workBold: "Fett",
  workClearspace: "Schutzraum",
  workLogoVariants: "Logo-Varianten",
  workMinimumSize: "Mindestgröße",
  workOurLogo: "Unser Logo",
  workRegular: "Regular",
  workTypeface: "Primäre Schriftart",
  workUiComponents: "Karten & UI-Komponenten",
  workVariant: "Variante",
  workThankYou: "Vielen Dank",
  workCaseStudy: "Fallstudie",
  workCaseStudies: "Fallstudien",
  workChallenge: "Herausforderung",
  workClientPerspective: "Kundenperspektive",
  workConcept: "Das Konzept",
  workConceptCaption: "C + Q individuelle Icon-Geometrie",
  workClient: "Kunde",
  workCoreMessage: "Kernbotschaft",
  workGallery: "Galerie",
  workHowWeBuilt: "So haben wir diese Marke aufgebaut.",
  workImpactA: "Impact &",
  workImpactB: "Ergebnisse",
  workProcessKicker: "So arbeiten wir",
  workResultsKicker: "Ergebnisse",
  workIndustry: "Branche",
  workMoreWork: "Weitere Arbeiten",
  workMoved: "bewegen",
  workNumbersThat: "Zahlen, die",
  workObjective: "Ziel",
  workOurMethod: "Unsere Methode",
  workOurProcess: "Unser Prozess",
  workOurSolution: "Unsere Lösung",
  workOverview: "Projektübersicht",
  workOverviewA: "Projekt",
  workOverviewB: "Übersicht",
  workProcessA: "Unser",
  workProcessB: "Prozess",
  workPositioning: "Positionierung",
  workProcessIntro:
    "Ein durchdachter Prozess, der Klarheit schafft und sie in echte Wirkung verwandelt.",
  workAudienceInsights: "Zielgruppen-Einblicke",
  workBrandChallenges: "Marken-Herausforderungen",
  workBrandPositioning: "Markenpositionierung",
  workIdentityDirection: "Identitätsrichtung",
  workMessagingDirection: "Messaging-Richtung",
  workPhaseDiscovery: "Analyse",
  workPhaseLaunch: "Launch",
  workPhaseStrategy: "Strategie",
  workResults: "Ergebnisse",
  workSameRigor:
    "Dasselbe Vorgehen, angewendet auf Ihre Ziele und Kennzahlen.",
  workSelected: "Ausgewählte",
  workSelectedWork: "Ausgewählte Arbeiten",
  workServices: "Leistungen",
  workSimilar: "Ähnliche",
  workStrategy: "Strategie",
  workStrategyFoundation: "Fundament der Markenstrategie.",
  workMark: "Das Zeichen",
  workNewIdentity: "Neue Identität",
  workSolution: "Lösung",
  workSolutionCaption: "Einheitliches Marken-Raster",
  workStartCta: "Starten Sie Ihr Projekt mit Stratifit",
  workValueProposition: "Nutzenversprechen",
  workViewCaseStudies: "Weitere Fallstudien ansehen",
  workVisual: "Visual",
  workVisuals: "Visuals",
  workWantOutcome: "Möchten Sie ein solches Ergebnis?",
  workWhatNeededToChange: "Was sich ändern musste",
  workWhatWasBroken: "Was nicht funktionierte",
  workWhatWeDid: "Was wir getan haben",
  workWhoTheyAre: "Wer sie sind",
  workWhyThisMark: "Warum dieses Zeichen",
  workTheProblem: "Das Problem",
  workYear: "Jahr",
  workYourProjectNext: "Ihr Projekt könnte das nächste sein",
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
    "Echte Ergebnisse aus echten Projekten, gemessen an den Kennzahlen, die für Ihr Unternehmen zählen.",
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
  testimonialsEyebrow: "Kundenstimmen",
  testimonialsTitle: "Das sagen unsere Kunden",
  testimonialsDescription:
    "Erfahren Sie direkt von unseren Kunden, wie sie die Zusammenarbeit mit STRATIFIT erlebt haben.",
  insightsEyebrow: "Einblicke",
  insightsTitleFallback: "Impulse für intelligentes",
  insightsHighlightFallback: "digitales Wachstum",
  insightsDescriptionFallback:
    "Thought Leadership, Branchenperspektiven und umsetzbare Strategien von unserem Team aus Strategen, Designern und Ingenieuren.",
};

const fr: UiStrings = {
  skipToContent: "Aller au contenu",
  startAProject: "Démarrer un projet",
  yourName: "Votre nom *",
  namePlaceholder: "Nom complet",
  yourEmail: "vous@entreprise.com *",
  emailLabel: "Adresse e-mail *",
  selectServices: "Sélectionnez les services",
  servicesSelected: "{n} services sélectionnés",
  tellUsProject: "Parlez-nous de votre projet *",
  messagePlaceholder: "Présentez-nous ce que vous souhaitez créer, améliorer ou automatiser.",
  sending: "Envoi de votre demande...",
  thankYou: "Message envoyé !",
  messageReceived:
    "Votre demande a bien été envoyée. Nous vous répondrons sous un jour ouvré.",
  sendAnotherMessage: "Envoyer un autre message",
  nameRequired: "Ce champ est obligatoire.",
  validEmail: "Veuillez saisir une adresse e-mail valide.",
  messageMinLength: "Ce champ est obligatoire.",
  readInsight: "Lire l'article",
  readArticle: "Lire l'article",
  minRead: "{n} min de lecture",
  filterAll: "Tout",
  goBack: "Retour",
  backToInsights: "Retour aux analyses",
  noInsightsInCategory: "Aucun article dans cette catégorie pour le moment.",
  noInsightsYet: "Les articles apparaîtront bientôt ici.",
  viewAll: "Voir tout",
  viewAllInsights: "Voir toutes les analyses",
  viewAllProjects: "Voir tous les projets",
  viewAllBusinesses: "Voir toutes les entreprises",
  viewAllTestimonials: "Voir tous les témoignages",
  viewAllStories: "Tout voir",
  getStarted: "Commencer",
  verifiedClientReviews: "{n} avis vérifiés",
  verifiedClient: "Client vérifié",
  verified: "Vérifié",
  reviewsCount: "{n} avis",
  seeAllReviewsOnGoogle: "Voir tous les avis sur Google",
  starsOutOfFive: "{n} étoiles sur 5",
  viewCaseStudy: "Voir l'étude de cas",
  viewFullDetail: "Voir le détail complet",
  browserNavHome: "Accueil",
  browserNavAbout: "À propos",
  browserNavProducts: "Produits",
  browserNavContact: "Contact",
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
  howWeWork: "Découvrir notre méthode",
  followUs: "Suivez-nous",
  backToTop: "Haut de page",
  allRightsReserved: "Tous droits réservés.",
  privacyPolicy: "Politique de confidentialité",
  termsOfService: "Conditions d'utilisation",
  cookiePolicy: "Politique de cookies",
  alwaysActive: "Toujours actifs",
  back: "Retour",
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
    "Bienvenue chez Stratifit, votre agence digitale pour la croissance. Quel est votre prénom ? Cela m'aide à personnaliser le chat. L'e-mail est facultatif et sert uniquement aux relances.",
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
    "Bienvenue chez Stratifit, votre agence digitale pour la croissance. Que souhaitez-vous savoir ?",
  chatYourNamePlaceholder: "Votre prénom...",
  chatYourEmailPlaceholder: "vous@entreprise.com",
  chatEditName: "Modifier le nom",
  chatTyping: "Stratifit AI écrit…",
  chatTypingStatus: "Écrit…",
  chatAdminTyping: "L'équipe Stratifit écrit…",
  chatShowEarlier: "Messages précédents",
  chatAskAbout: "Demander",
  chatLearnMore: "En savoir plus",
  chatInterestedIn: "Je suis intéressé par {service}.",
  chatTellMeMore: "Parlez-moi davantage de {service}.",
  chatPricingTitle: "Tarifs & formules",
  chatPricingBody:
    "Des formules pour chaque étape, des landing pages aux plateformes complètes. Parlez-nous de votre projet pour un devis personnalisé.",
  chatAskAboutPricing: "Demander les tarifs",
  chatPricingQuestion: "J'aimerais en savoir plus sur les tarifs.",
  chatServicesQuestion: "J'aimerais en savoir plus sur vos services.",
  chatAskAboutServices: "Demander des services",
  chatFaqTitle: "Questions fréquentes",
  chatFaqMoreQuestions: "D'autres questions ?",
  faqHelpCardTitle: "Encore plus de questions ?",
  faqHelpCardSubtitle:
    "Discutez avec notre bot FAQ IA, réponses instantanées, 24h/24 et 7j/7.",
  faqAskMoreQuestions: "Poser plus de questions",
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
  sendProjectRequest: "Envoyer votre demande",
  serviceNeeded: "Services",
  estimatedBudget: "Budget estimé",
  selectService: "Services",
  notSureYet: "Je ne sais pas encore",
  trustNoSpam: "Pas de spam",
  trustNoSpamDesc: "Nous respectons votre boîte de réception.",
  trustPrivate: "100% privé",
  trustPrivateDesc: "Vos données restent sécurisées.",
  trustQuickResponse: "Réponse rapide",
  trustQuickResponseDesc: "Nous répondons sous 24h.",
  workApplications: "Applications",
  workAudience: "Audience",
  workBefore: "Avant",
  workBrandIdentity: "Identité de marque",
  workBrandInAction: "La marque en action",
  workBrandInUse: "La marque en usage",
  workBrandGuidelines: "Charte graphique",
  workDigitalPresence: "Présence digitale",
  workCtaTitle: "Faites ressortir votre marque.",
  workCtaSubtitle:
    "Créez une identité distinctive qui s'impose partout avec élégance.",
  workIdentitySystem: "Le système d'identité.",
  workGuidelinesIntro:
    "Un système cohérent, logo, couleur, typographie et application, décliné sur chaque point de contact.",
  workContents: "Sommaire",
  workPrimaryLogo: "Logo principal",
  workProblemCaption: "Image fragmentée & faible contraste",
  workProjectProblem: "Problème du projet",
  workLogoSuite: "Suite de logos",
  workLogoVariations: "Déclinaisons du logo",
  workColourPalette: "Palette de couleurs",
  workColourUsage: "Usage des couleurs",
  workTypography: "Typographie",
  workIdentityAssets: "Actifs d'identité",
  workPhysicalTouchpoint: "Point de contact physique",
  workPhysicalTouchpoints: "Points de contact physiques",
  workVisualApplications: "Applications visuelles",
  workTypeHierarchy: "Hiérarchie typographique",
  workHeading: "Titre",
  workBody: "Texte courant",
  workBold: "Gras",
  workClearspace: "Zone de sécurité",
  workLogoVariants: "Variantes du logo",
  workMinimumSize: "Taille minimale",
  workOurLogo: "Notre logo",
  workRegular: "Regular",
  workTypeface: "Police principale",
  workUiComponents: "Cartes & composants d'interface",
  workVariant: "Variante",
  workThankYou: "Merci",
  workCaseStudy: "Étude de cas",
  workCaseStudies: "similaires",
  workChallenge: "Défi",
  workClientPerspective: "Point de vue du client",
  workConcept: "Le concept",
  workConceptCaption: "Géométrie d'icône sur mesure C + Q",
  workClient: "Client",
  workCoreMessage: "Message clé",
  workGallery: "Galerie",
  workHowWeBuilt: "Comment nous avons construit cette marque.",
  workImpactA: "Impact &",
  workImpactB: "Résultats",
  workProcessKicker: "Notre méthode",
  workResultsKicker: "Résultats",
  workIndustry: "Secteur",
  workMoreWork: "Autres projets",
  workMoved: "parlent",
  workNumbersThat: "Des chiffres qui",
  workObjective: "Objectif",
  workOurMethod: "Notre méthode",
  workOurProcess: "Notre processus",
  workOurSolution: "Notre solution",
  workOverview: "Aperçu du projet",
  workOverviewA: "Aperçu",
  workOverviewB: "du projet",
  workProcessA: "Notre",
  workProcessB: "processus",
  workPositioning: "Positionnement",
  workProcessIntro:
    "Un processus raffiné qui crée de la clarté et la transforme en impact concret.",
  workAudienceInsights: "Aperçus de l'audience",
  workBrandChallenges: "Défis de marque",
  workBrandPositioning: "Positionnement de marque",
  workIdentityDirection: "Direction de l'identité",
  workMessagingDirection: "Direction du message",
  workPhaseDiscovery: "Découverte",
  workPhaseLaunch: "Lancement",
  workPhaseStrategy: "Stratégie",
  workResults: "Résultats",
  workSameRigor:
    "La même méthode, appliquée à vos objectifs et vos indicateurs.",
  workSelected: "Visuels",
  workSelectedWork: "Travaux sélectionnés",
  workServices: "Services",
  workSimilar: "Études de cas",
  workStrategy: "Stratégie",
  workStrategyFoundation: "Fondement de la stratégie de marque.",
  workMark: "Le signe",
  workNewIdentity: "Nouvelle identité",
  workSolution: "Solution",
  workSolutionCaption: "Grille unifiée des systèmes de marque",
  workStartCta: "Lancez votre projet avec Stratifit",
  workValueProposition: "Proposition de valeur",
  workViewCaseStudies: "Voir d'autres études de cas",
  workVisual: "visuel",
  workVisuals: "sélectionnés",
  workWantOutcome: "Vous voulez un résultat similaire ?",
  workWhatNeededToChange: "Ce qui devait changer",
  workWhatWasBroken: "Ce qui était cassé",
  workWhatWeDid: "Ce que nous avons fait",
  workWhoTheyAre: "Qui ils sont",
  workWhyThisMark: "Pourquoi ce signe",
  workTheProblem: "Le problème",
  workYear: "Année",
  workYourProjectNext: "Votre projet pourrait être le prochain",
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
    "De vrais résultats issus de vrais projets, mesurés par les indicateurs qui comptent pour votre entreprise.",
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
  testimonialsTitle: "Ce que disent nos clients",
  testimonialsDescription:
    "Découvrez directement l'expérience des clients qui ont travaillé avec STRATIFIT.",
  insightsEyebrow: "Analyses",
  insightsTitleFallback: "Des idées pour accélérer votre",
  insightsHighlightFallback: "croissance numérique",
  insightsDescriptionFallback:
    "Leadership éclairé, perspectives sectorielles et stratégies concrètes de notre équipe de stratèges, designers et ingénieurs.",
};

const es: UiStrings = {
  skipToContent: "Saltar al contenido",
  startAProject: "Iniciar un proyecto",
  yourName: "Su nombre *",
  namePlaceholder: "Nombre completo",
  yourEmail: "usted@empresa.com *",
  emailLabel: "Dirección de correo electrónico *",
  selectServices: "Selecciona los servicios",
  servicesSelected: "{n} servicios seleccionados",
  tellUsProject: "Cuéntenos sobre su proyecto *",
  messagePlaceholder: "Describa lo que desea crear, mejorar o automatizar.",
  sending: "Enviando su solicitud...",
  thankYou: "¡Mensaje enviado!",
  messageReceived:
    "Su solicitud se ha enviado correctamente. Responderemos en un día laborable.",
  sendAnotherMessage: "Enviar otro mensaje",
  nameRequired: "Este campo es obligatorio.",
  validEmail: "Introduzca una dirección de correo electrónico válida.",
  messageMinLength: "Este campo es obligatorio.",
  readInsight: "Leer artículo",
  readArticle: "Leer artículo",
  minRead: "{n} min de lectura",
  filterAll: "Todo",
  goBack: "Atrás",
  backToInsights: "Volver a los artículos",
  noInsightsInCategory: "Aún no hay artículos en esta categoría.",
  noInsightsYet: "Los artículos aparecerán pronto aquí.",
  viewAll: "Ver todo",
  viewAllInsights: "Ver todos los artículos",
  viewAllProjects: "Ver todos los proyectos",
  viewAllBusinesses: "Ver todas las empresas",
  viewAllTestimonials: "Ver todos los testimonios",
  viewAllStories: "Ver todo",
  getStarted: "Empezar",
  verifiedClientReviews: "{n} reseñas verificadas",
  verifiedClient: "Cliente verificado",
  verified: "Verificado",
  reviewsCount: "{n} reseñas",
  seeAllReviewsOnGoogle: "Ver todas las reseñas en Google",
  starsOutOfFive: "{n} de 5 estrellas",
  viewCaseStudy: "Ver estudio de caso",
  viewFullDetail: "Ver detalle completo",
  browserNavHome: "Inicio",
  browserNavAbout: "Nosotros",
  browserNavProducts: "Productos",
  browserNavContact: "Contacto",
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
  howWeWork: "Conocer nuestro proceso",
  followUs: "Síguenos",
  backToTop: "Volver arriba",
  allRightsReserved: "Todos los derechos reservados.",
  privacyPolicy: "Política de privacidad",
  termsOfService: "Términos del servicio",
  cookiePolicy: "Política de cookies",
  alwaysActive: "Siempre activas",
  back: "Volver",
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
    "Bienvenido a Stratifit, tu agencia digital para el crecimiento. ¿Cómo te llamas? Me ayuda a personalizar el chat. El correo es opcional y solo se usa para seguimiento.",
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
    "Bienvenido a Stratifit, tu agencia digital para el crecimiento. ¿Qué te gustaría saber?",
  chatYourNamePlaceholder: "Tu nombre...",
  chatYourEmailPlaceholder: "usted@empresa.com",
  chatEditName: "Editar nombre",
  chatTyping: "Stratifit AI está escribiendo…",
  chatTypingStatus: "Escribiendo…",
  chatAdminTyping: "El equipo de Stratifit está escribiendo…",
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
  faqHelpCardTitle: "¿Tiene más preguntas?",
  faqHelpCardSubtitle:
    "Chatee con nuestro bot de IA de preguntas frecuentes, respuestas instantáneas, 24/7.",
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
  sendProjectRequest: "Enviar solicitud de proyecto",
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
  workApplications: "Aplicaciones",
  workAudience: "Público",
  workBefore: "Antes",
  workBrandIdentity: "Identidad de marca",
  workBrandInAction: "La marca en acción",
  workBrandInUse: "La marca en uso",
  workBrandGuidelines: "Manual de marca",
  workDigitalPresence: "Presencia digital",
  workCtaTitle: "Haga que su marca destaque.",
  workCtaSubtitle:
    "Cree una identidad distintiva que funcione bellamente en todas partes.",
  workIdentitySystem: "El sistema de identidad.",
  workGuidelinesIntro:
    "Un sistema coherente, logotipo, color, tipografía y aplicación, presente en cada punto de contacto.",
  workContents: "Contenido",
  workPrimaryLogo: "Logotipo principal",
  workProblemCaption: "Aspecto fragmentado y contraste débil",
  workProjectProblem: "El problema del proyecto",
  workLogoSuite: "Suite de logo",
  workLogoVariations: "Variaciones del logo",
  workColourPalette: "Paleta de colores",
  workColourUsage: "Uso del color",
  workTypography: "Tipografía",
  workIdentityAssets: "Activos de identidad",
  workPhysicalTouchpoint: "Punto de contacto físico",
  workPhysicalTouchpoints: "Puntos de contacto físicos",
  workVisualApplications: "Aplicaciones visuales",
  workTypeHierarchy: "Jerarquía tipográfica",
  workHeading: "Encabezado",
  workBody: "Cuerpo",
  workBold: "Negrita",
  workClearspace: "Espacio libre",
  workLogoVariants: "Variantes del logotipo",
  workMinimumSize: "Tamaño mínimo",
  workOurLogo: "Nuestro logotipo",
  workRegular: "Regular",
  workTypeface: "Tipografía principal",
  workUiComponents: "Tarjetas & componentes de interfaz",
  workVariant: "Variante",
  workThankYou: "Gracias",
  workCaseStudy: "Estudio de caso",
  workCaseStudies: "similares",
  workChallenge: "Reto",
  workClientPerspective: "Perspectiva del cliente",
  workConcept: "El concepto",
  workConceptCaption: "Geometría de icono C + Q",
  workClient: "Cliente",
  workCoreMessage: "Mensaje central",
  workGallery: "Galería",
  workHowWeBuilt: "Así construimos esta marca.",
  workImpactA: "Impacto y",
  workImpactB: "resultados",
  workProcessKicker: "Cómo trabajamos",
  workResultsKicker: "Resultados",
  workIndustry: "Sector",
  workMoreWork: "Más trabajos",
  workMoved: "hablan",
  workNumbersThat: "Números que",
  workObjective: "Objetivo",
  workOurMethod: "Nuestro método",
  workOurProcess: "Nuestro proceso",
  workOurSolution: "Nuestra solución",
  workOverview: "Resumen del proyecto",
  workOverviewA: "Resumen",
  workOverviewB: "del proyecto",
  workProcessA: "Nuestro",
  workProcessB: "proceso",
  workPositioning: "Posicionamiento",
  workProcessIntro:
    "Un proceso refinado que crea claridad y la convierte en un impacto real.",
  workAudienceInsights: "Perspectivas de la audiencia",
  workBrandChallenges: "Desafíos de marca",
  workBrandPositioning: "Posicionamiento de marca",
  workIdentityDirection: "Dirección de identidad",
  workMessagingDirection: "Dirección del mensaje",
  workPhaseDiscovery: "Descubrimiento",
  workPhaseLaunch: "Lanzamiento",
  workPhaseStrategy: "Estrategia",
  workResults: "Resultados",
  workSameRigor:
    "El mismo plan de juego, aplicado a tus objetivos y tus métricas.",
  workSelected: "Visuales",
  workSelectedWork: "Trabajos seleccionados",
  workServices: "Servicios",
  workSimilar: "Estudios de caso",
  workStrategy: "Estrategia",
  workStrategyFoundation: "Fundamento de la estrategia de marca.",
  workMark: "El símbolo",
  workNewIdentity: "Nueva identidad",
  workSolution: "Solución",
  workSolutionCaption: "Cuadrícula de sistemas de marca unificada",
  workStartCta: "Comienza tu proyecto con Stratifit",
  workValueProposition: "Propuesta de valor",
  workViewCaseStudies: "Ver más casos de éxito",
  workVisual: "visual",
  workVisuals: "seleccionados",
  workWantOutcome: "¿Quieres un resultado así?",
  workWhatNeededToChange: "Lo que debía cambiar",
  workWhatWasBroken: "Lo que estaba roto",
  workWhatWeDid: "Lo que hicimos",
  workWhoTheyAre: "Quiénes son",
  workWhyThisMark: "Por qué este símbolo",
  workTheProblem: "El problema",
  workYear: "Año",
  workYourProjectNext: "Su proyecto podría ser el próximo",
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
  testimonialsTitle: "Lo que dicen nuestros clientes",
  testimonialsDescription:
    "Conozca directamente la experiencia de los clientes que han trabajado con STRATIFIT.",
  insightsEyebrow: "Perspectivas",
  insightsTitleFallback: "Ideas para un crecimiento",
  insightsHighlightFallback: "digital más inteligente",
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
