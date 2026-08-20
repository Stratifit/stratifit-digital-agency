import type { SupportedLanguage } from "../types";

/**
 * Shared, language-aware email shell content. Every rendered email composes
 * these partials with the template body. Kept in code (not CMS-editable)
 * because they are brand chrome — the CMS edits template subject/body only.
 */
export interface EmailPartials {
  /** Small uppercase label above the subject (brand eyebrow). */
  eyebrow: string;
  /** Brand mark shown next to the wordmark in the dark header. */
  tagline: string;
  /** Sign-off prompt above the signature at the end of the body. */
  questionsNote: string;
  footerNote: string;
  /** Copyright line without the "© year" prefix (added by the renderer). */
  legalDisclaimer: string;
}

export const EMAIL_PARTIALS: Record<SupportedLanguage, EmailPartials> = {
  en: {
    eyebrow: "Stratifit Digital Agency",
    tagline: "Fit for Digital Excellence",
    questionsNote: "Questions? Simply reply to this email.",
    footerNote:
      "This is an automated message from Stratifit Digital Agency. Reply to this email and it lands directly in our inbox.",
    legalDisclaimer: "Stratifit Digital Agency. All rights reserved.",
  },
  de: {
    eyebrow: "Stratifit Digitalagentur",
    tagline: "Fit für digitale Exzellenz",
    questionsNote: "Fragen? Antworten Sie einfach auf diese E-Mail.",
    footerNote:
      "Dies ist eine automatische Nachricht von Stratifit Digital Agency. Antworten Sie auf diese E-Mail, sie landet direkt in unserem Posteingang.",
    legalDisclaimer: "Stratifit Digital Agency. Alle Rechte vorbehalten.",
  },
  fr: {
    eyebrow: "Agence digitale Stratifit",
    tagline: "Conçu pour l'excellence digitale",
    questionsNote: "Des questions ? Répondez simplement à cet e-mail.",
    footerNote:
      "Ceci est un message automatique de Stratifit Digital Agency. Répondez à cet e-mail et il arrivera directement dans notre boîte de réception.",
    legalDisclaimer: "Stratifit Digital Agency. Tous droits réservés.",
  },
  es: {
    eyebrow: "Agencia digital Stratifit",
    tagline: "Hecho para la excelencia digital",
    questionsNote: "¿Preguntas? Simplemente responde a este correo.",
    footerNote:
      "Este es un mensaje automático de Stratifit Digital Agency. Responde a este correo y llegará directamente a nuestra bandeja de entrada.",
    legalDisclaimer: "Stratifit Digital Agency. Todos los derechos reservados.",
  },
};
