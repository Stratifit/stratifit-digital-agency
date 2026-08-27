import type { SupportedLanguage } from "../types";

/**
 * Shared, language-aware email shell content. Every rendered email composes
 * these partials with the template body. Kept in code (not CMS-editable)
 * because they are brand chrome — the CMS edits template subject/body only.
 */
export interface EmailPartials {
  /** Office location shown in the footer. */
  location: string;
  /** Label for the amber CTA button below the body copy. */
  ctaLabel: string;
  /** Company name for the copyright line (prefixed with "© year" by the template). */
  legalDisclaimer: string;
}

export const EMAIL_PARTIALS: Record<SupportedLanguage, EmailPartials> = {
  en: {
    location: "Leipzig, Germany",
    ctaLabel: "Ask a Question",
    legalDisclaimer: "Stratifit Digital Agency.",
  },
  de: {
    location: "Leipzig, Deutschland",
    ctaLabel: "Fragen stellen",
    legalDisclaimer: "Stratifit Digital Agency.",
  },
  fr: {
    location: "Leipzig, Allemagne",
    ctaLabel: "Poser une question",
    legalDisclaimer: "Stratifit Digital Agency.",
  },
  es: {
    location: "Leipzig, Alemania",
    ctaLabel: "Haz una pregunta",
    legalDisclaimer: "Stratifit Digital Agency.",
  },
};
