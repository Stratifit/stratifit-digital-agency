import { autoFill, type AutoFillContext } from "./auto-fill";
import { pickTranslation } from "./language";
import { EMAIL_PARTIALS } from "./templates/partials";
import type { RenderableTemplate, SupportedLanguage } from "./types";

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

function paragraphLines(body: string): string {
  return body
    .split(/\n+/)
    .filter(Boolean)
    .map(
      (line) =>
        `<p style="margin:0 0 12px 0;line-height:1.7;color:#2D333C;font-size:15px;">${escapeHtml(line)}</p>`
    )
    .join("");
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/** Strip the protocol for display (https://www.stratifit.com → www.stratifit.com). */
function websiteLabel(website: string): string {
  return website.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

/**
 * Branded HTML shell matching the Stratifit email design: light paper document
 * on a subtle canvas, dark brand header with an amber accent bar, an eyebrow
 * above the subject, the template body, a sign-off block, and a dark footer
 * with contact details. Inline styles only — safe for every major email
 * client.
 */
export function renderEmailHtml(input: {
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
}): string {
  const p = EMAIL_PARTIALS[input.language] ?? EMAIL_PARTIALS.en;
  const signatureName = input.adminName?.trim() || "The Stratifit Team";

  const contact = {
    email: input.contact?.email || "hello@stratifit.com",
    phone: input.contact?.phone || "+49 152 1743 6830",
    website: input.contact?.website || "https://www.stratifit.com",
  };
  const websiteDisplay = websiteLabel(contact.website);
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="${input.language}">
  <body style="margin:0;padding:0;background-color:#EEF0F3;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:radial-gradient(circle at 50% -15%,rgba(245,158,11,.08),transparent 34rem),#EEF0F3;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#FFFFFF;border:1px solid #E1E3E6;border-radius:16px;overflow:hidden;">
            <!-- Brand header -->
            <tr>
              <td style="background:#080B10;padding:26px 34px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <span style="font-family:Inter,Arial,sans-serif;font-size:20px;font-weight:800;letter-spacing:.02em;color:#FFFFFF;">Stratifit</span>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="font-family:Inter,Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#F59E0B;">${escapeHtml(p.tagline)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Amber accent bar -->
            <tr>
              <td style="height:2px;font-size:0;line-height:0;background:#FF9D00;">&nbsp;</td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:34px 46px 26px;">
                <p style="margin:0 0 10px 0;color:#717986;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;">${escapeHtml(p.eyebrow)}</p>
                <h2 style="margin:0;font-size:28px;line-height:1.15;letter-spacing:-.02em;color:#080B10;">${escapeHtml(input.subject)}</h2>
                <div style="margin-top:20px;">
                  ${paragraphLines(input.body)}
                </div>
                <p style="margin:20px 0 0 0;color:#303741;font-size:13px;line-height:1.5;">${escapeHtml(p.questionsNote)}</p>
                <p style="margin:4px 0 0 0;color:#080B10;font-size:14px;font-weight:700;">${escapeHtml(signatureName)}</p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#080B10;padding:20px 28px;">
                <p style="margin:0 0 12px 0;text-align:center;color:rgba(255,255,255,.72);font-size:11px;line-height:1.5;">${escapeHtml(p.footerNote)}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="font-size:0;">
                      <a href="mailto:${escapeHtml(contact.email)}" style="font-family:Inter,Arial,sans-serif;font-size:11px;color:#FFFFFF;text-decoration:none;display:inline-block;padding:0 10px;">${escapeHtml(contact.email)}</a>
                      <span style="font-family:Inter,Arial,sans-serif;font-size:11px;color:#F59E0B;display:inline-block;padding:0 0;">·</span>
                      <a href="${escapeHtml(telHref(contact.phone))}" style="font-family:Inter,Arial,sans-serif;font-size:11px;color:#FFFFFF;text-decoration:none;display:inline-block;padding:0 10px;">${escapeHtml(contact.phone)}</a>
                      <span style="font-family:Inter,Arial,sans-serif;font-size:11px;color:#F59E0B;display:inline-block;padding:0 0;">·</span>
                      <a href="${escapeHtml(contact.website)}" style="font-family:Inter,Arial,sans-serif;font-size:11px;color:#FFFFFF;text-decoration:none;display:inline-block;padding:0 10px;">${escapeHtml(websiteDisplay)}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:14px 0 0 0;text-align:center;color:rgba(255,255,255,.5);font-size:11px;">© ${year} ${escapeHtml(p.legalDisclaimer)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
