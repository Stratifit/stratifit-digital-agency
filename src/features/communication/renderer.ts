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
        `<p style="margin:0 0 12px 0;line-height:1.7;">${escapeHtml(line)}</p>`
    )
    .join("");
}

/**
 * Branded HTML shell: header with logo wordmark, template content, and a
 * footer with language-aware legal/social partials. Inline styles only —
 * safe for every major email client.
 */
export function renderEmailHtml(input: {
  subject: string;
  body: string;
  language: SupportedLanguage;
  adminName?: string | null;
}): string {
  const p = EMAIL_PARTIALS[input.language] ?? EMAIL_PARTIALS.en;
  const signatureName = input.adminName?.trim() || "The Stratifit Team";

  return `<!DOCTYPE html>
<html lang="${input.language}">
  <body style="margin:0;padding:0;background:#0A0A0A;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111827;border:1px solid #1F2937;border-radius:12px;padding:32px;">
            <!-- Header -->
            <tr>
              <td style="padding-bottom:20px;border-bottom:1px solid #1F2937;">
                <span style="font-family:Inter,Arial,sans-serif;font-size:18px;font-weight:700;color:#F59E0B;">Stratifit</span>
                <span style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#6B7280;">Digital Agency</span>
              </td>
            </tr>
            <!-- Brand intro -->
            <tr>
              <td style="padding:16px 0 4px 0;">
                <p style="font-family:Inter,Arial,sans-serif;font-size:12px;color:#9CA3AF;margin:0;">${escapeHtml(p.brandIntro)}</p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:12px 0 8px 0;">
                <h1 style="font-family:Inter,Arial,sans-serif;font-size:22px;font-weight:700;color:#FFFFFF;margin:0 0 16px 0;">${escapeHtml(input.subject)}</h1>
                ${paragraphLines(input.body)}
                <p style="margin:16px 0 0 0;line-height:1.6;color:#B8C0CC;">${escapeHtml(signatureName)}</p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding-top:20px;border-top:1px solid #1F2937;">
                <p style="font-family:Inter,Arial,sans-serif;font-size:12px;color:#6B7280;margin:0 0 8px 0;">${escapeHtml(p.footerNote)}</p>
                <p style="font-family:Inter,Arial,sans-serif;font-size:11px;color:#4B5563;margin:0;">${escapeHtml(p.legalDisclaimer)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
