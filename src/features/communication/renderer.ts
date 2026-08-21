import "server-only";
import { render } from "@react-email/render";
import { autoFill, type AutoFillContext } from "./auto-fill";
import { pickTranslation } from "./language";
import { StratifitEmail } from "./templates/stratifit-email";
import type { RenderableTemplate, SupportedLanguage } from "./types";

/**
 * Renderer: turns a template's subject + body (CMS-editable, per language)
 * into the final email. The HTML shell is a React Email template
 * (`templates/stratifit-email.tsx`) rendered with `render()` from
 * `@react-email/render` — the Resend renderer — which produces the
 * inline-styled, email-client-safe markup that is sent over SES SMTP.
 */

/** Escape HTML special characters (kept for any plain-HTML consumers). */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Render a template's subject and body for a language (English fallback),
 * with {{placeholders}} auto-filled.
 */
export function renderTemplateContent(
  template: RenderableTemplate,
  language: string,
  context: AutoFillContext
): { subject: string; body: string } {
  const subject = autoFill(
    pickTranslation(template.subject_translations, language),
    context
  );
  const body = autoFill(
    pickTranslation(template.body_translations, language),
    context
  );
  return { subject, body };
}

/** Plain-text version of an email. */
export function renderEmailText(subject: string, body: string): string {
  return `${subject}\n\n${body}`;
}

/**
 * Branded HTML shell for an email, rendered from the React Email template via
 * `@react-email/render`. Content is escaped by React automatically, and the
 * layout matches the admin preview in the CMS.
 */
export async function renderEmailHtml(input: {
  subject: string;
  body: string;
  language: SupportedLanguage;
  adminName?: string | null;
  /** Footer contact details; falls back to the Stratifit brand values. */
  contact?: {
    email?: string | null;
    phone?: string | null;
    website?: string | null;
  };
}): Promise<string> {
  return render(
    StratifitEmail({
      subject: input.subject,
      body: input.body,
      language: input.language,
      adminName: input.adminName,
      contact: input.contact,
    }),
    { pretty: true }
  );
}
