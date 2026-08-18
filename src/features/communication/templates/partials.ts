import type { SupportedLanguage } from "../types";

/**
 * Shared, language-aware email shell content. Every rendered email composes
 * these partials with the template body. Kept in code (not CMS-editable)
 * because they are brand chrome — the CMS edits template subject/body only.
 */
export interface EmailPartials {
  brandIntro: string;
  footerNote: string;
  legalDisclaimer: string;
  socialLabel: string;
}

export const EMAIL_PARTIALS: Record<SupportedLanguage, EmailPartials> = {
  en: {
    brandIntro:
      "Stratifit Digital Agency — premium websites, brand design, and AI automation.",
    footerNote:
      "This is an automated message from Stratifit Digital Agency. Reply to this email and it lands directly in our inbox.",
    legalDisclaimer:
      "© Stratifit Digital Agency. All rights reserved.",
    socialLabel: "Follow us",
  },
  de: {
    brandIntro:
      "Stratifit Digital Agency — Premium-Websites, Brand Design und KI-Automatisierung.",
    footerNote:
      "Dies ist eine automatische Nachricht von Stratifit Digital Agency. Antworten Sie auf diese E-Mail — sie landet direkt in unserem Posteingang.",
    legalDisclaimer:
      "© Stratifit Digital Agency. Alle Rechte vorbehalten.",
    socialLabel: "Folgen Sie uns",
  },
  fr: {
    brandIntro:
      "Stratifit Digital Agency — sites web premium, design de marque et automatisation IA.",
    footerNote:
      "Ceci est un message automatique de Stratifit Digital Agency. Répondez à cet e-mail et il arrivera directement dans notre boîte de réception.",
    legalDisclaimer:
      "© Stratifit Digital Agency. Tous droits réservés.",
    socialLabel: "Suivez-nous",
  },
  es: {
    brandIntro:
      "Stratifit Digital Agency — sitios web premium, diseño de marca y automatización con IA.",
    footerNote:
      "Este es un mensaje automático de Stratifit Digital Agency. Responde a este correo y llegará directamente a nuestra bandeja de entrada.",
    legalDisclaimer:
      "© Stratifit Digital Agency. Todos los derechos reservados.",
    socialLabel: "Síguenos",
  },
};
