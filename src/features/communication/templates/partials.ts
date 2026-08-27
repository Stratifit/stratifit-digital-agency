import type { SupportedLanguage } from "../types";

/**
 * Shared, language-aware email shell content. Every rendered email composes
 * these partials with the template body. Kept in code (not CMS-editable)
 * because they are brand chrome — the CMS edits template subject/body only.
 */
export interface EmailPartials {
  /** Small uppercase label above the subject (brand eyebrow). */
  eyebrow: string;
  /** Office location shown in the footer. */
  location: string;
  /** Label for the amber CTA button below the body copy. */
  ctaLabel: string;
  /** Copyright line without the "© year" prefix (added by the renderer). */
  legalDisclaimer: string;
}

export const EMAIL_PARTIALS: Record<SupportedLanguage, EmailPartials> = {
  en: {
    eyebrow: "Stratifit Digital Agency",
    location: "Leipzig, Germany",
    ctaLabel: "Ask a Question",
    legalDisclaimer: "Stratifit Digital Agency. All rights reserved.",
  },
  de: {
    eyebrow: "Stratifit Digitalagentur",
    location: "Leipzig, Deutschland",
    ctaLabel: "Fragen stellen",
    legalDisclaimer: "Stratifit Digital Agency. Alle Rechte vorbehalten.",
  },
  fr: {
    eyebrow: "Agence digitale Stratifit",
    location: "Leipzig, Allemagne",
    ctaLabel: "Poser une question",
    legalDisclaimer: "Stratifit Digital Agency. Tous droits réservés.",
  },
  es: {
    eyebrow: "Agencia digital Stratifit",
    location: "Leipzig, Alemania",
    ctaLabel: "Haz una pregunta",
    legalDisclaimer: "Stratifit Digital Agency. Todos los derechos reservados.",
  },
};
