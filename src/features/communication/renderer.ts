import "server-only";
import { render } from "@react-email/render";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
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
/** Absolute URL of the light logo used in the email header. */
export function getEmailLogoUrl(): string {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  return `${siteUrl || "https://www.stratifit.com"}/stratifit-main-logo.png`;
}

/** Absolute URL of the round favicon mark used in the email header. */
export function getEmailFaviconUrl(): string {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  return `${siteUrl || "https://www.stratifit.com"}/icon.png`;
}

/**
 * Social profile URLs for the email footer, keyed like the site footer
 * (linkedin, instagram, facebook, tiktok). Read from site settings with the
 * service-role client because emails can be sent outside a request context
 * (cron, webhooks); the site footer uses the same keys.
 */
async function getEmailSocialLinks(): Promise<Record<string, string>> {
  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data } = await supabase
      .from("site_settings")
      .select("social_links")
      .single();
    const links = (data as { social_links?: Record<string, string> | null })
      ?.social_links;
    return links ?? {};
  } catch {
    return {};
  }
}

export async function renderEmailHtml(input: {
  subject: string;
  body: string;
  language: SupportedLanguage;
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
      contact: input.contact,
      logoUrl: getEmailLogoUrl(),
      faviconUrl: getEmailFaviconUrl(),
      socialLinks: await getEmailSocialLinks(),
    }),
    { pretty: true }
  );
}
