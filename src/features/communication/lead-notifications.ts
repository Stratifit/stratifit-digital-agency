import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { resolveTriggerTemplateKey } from "./triggers";
import { renderEmailHtml, renderEmailText } from "./renderer";
import { getDefaultFrom, sendEmail } from "./sender";
import { recordEmailLog, sendTemplateEmail } from "./send-template";
import type { SupportedLanguage } from "./types";

export interface LeadNotificationInput {
  leadId: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  requestedServiceIds?: string[];
  budgetRange?: string | null;
  message?: string | null;
  locale: string;
}

async function resolveServiceNames(
  serviceIds?: string[]
): Promise<string | null> {
  if (!serviceIds || serviceIds.length === 0) {
    return null;
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("title_translations")
    .in("id", serviceIds);
  if (error || !data) {
    return null;
  }
  const names = data
    .map((service) =>
      resolveTranslation(
        service.title_translations as Record<string, string>,
        "en"
      )
    )
    .filter(Boolean);
  return names.length > 0 ? names.join(", ") : null;
}

/** Normalize a locale to a supported template language (English fallback). */
function toLanguage(locale: string): SupportedLanguage {
  const base = locale.toLowerCase().split("-")[0];
  return (["en", "de", "fr", "es"] as const).includes(base as never)
    ? (base as SupportedLanguage)
    : "en";
}

/**
 * Lead emails for the Communication Engine:
 * 1. Language-matched visitor acknowledgement via the `form_submission`
 *    template (skipped when a section auto-reply template was already sent).
 * 2. Internal admin lead notification with the enquiry details.
 *
 * Best-effort — failures are logged and never fail the lead submission.
 */
export async function sendLeadEmails(
  input: LeadNotificationInput,
  options?: { skipAcknowledgement?: boolean }
): Promise<void> {
  const siteSettings = await getPublicSiteSettings();
  const adminEmail = siteSettings?.contact_email ?? null;
  const serviceNames = await resolveServiceNames(input.requestedServiceIds);
  const language = toLanguage(input.locale);

  // Visitor acknowledgement from the multilingual template library. The
  // template key comes from the `lead_created` automation trigger (admin-
  // configurable, seeded to `form_submission`). When the trigger row is
  // missing, the seed default is used; when the admin disables it, the
  // automatic acknowledgement is suppressed.
  if (input.email && !options?.skipAcknowledgement) {
    const templateKey = await resolveTriggerTemplateKey("lead_created");
    if (!templateKey) {
      return;
    }
    const result = await sendTemplateEmail({
      templateKey,
      language,
      toEmail: input.email,
      context: {
        name: input.name ?? null,
        customer_email: input.email,
        phone: input.phone ?? null,
        company: input.company ?? null,
        service_name: serviceNames ?? null,
        lead_id: input.leadId,
        date: new Date().toISOString().slice(0, 10),
      },
      idempotencyKey: `communication:lead:${input.leadId}`,
      relatedType: "lead",
      relatedId: input.leadId,
    });
    if (!result.sent) {
      console.error(
        "Lead acknowledgement error:",
        result.error ?? "send failed"
      );
    }
  }

  // Internal admin notification with the enquiry details (not a template).
  if (adminEmail) {
    const lines = [
      `New lead ${input.leadId}`,
      "",
      `Name: ${input.name ?? "—"}`,
      `Email: ${input.email ?? "—"}`,
      `Company: ${input.company ?? "—"}`,
      `Requested services: ${serviceNames ?? "—"}`,
      `Budget range: ${input.budgetRange ?? "—"}`,
      "",
      "Message:",
      input.message ?? "(no message)",
    ].join("\n");
    const subject = `New Stratifit lead — ${input.name ?? "website enquiry"}`;

    const from = getDefaultFrom();
    if (from) {
      const result = await sendEmail({
        to: adminEmail,
        from,
        subject,
        html: await renderEmailHtml({
          subject,
          body: lines,
          language: "en",
          contact: {
            email: siteSettings?.contact_email ?? null,
            phone: siteSettings?.contact_phone ?? null,
          },
        }),
        text: renderEmailText(subject, lines),
      });
      await recordEmailLog({
        templateKey: null,
        toEmail: adminEmail,
        fromEmail: from,
        subject,
        language: "en",
        status: result.ok ? "sent" : "failed",
        providerMessageId: result.messageId,
        errorMessage: result.error,
        relatedType: "lead",
        relatedId: input.leadId,
        idempotencyKey: `communication:lead:admin:${input.leadId}`,
      });
      if (!result.ok) {
        console.error(
          "Lead admin notification error:",
          result.error ?? "send failed"
        );
      }
    } else {
      console.error(
        "Lead admin notification error: no from-address configured."
      );
    }
  }}
