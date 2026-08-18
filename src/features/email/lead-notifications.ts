import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { sendEmail } from "./send";

export interface LeadNotificationInput {
  leadId: string;
  name?: string | null;
  email?: string | null;
  company?: string | null;
  requestedServiceIds?: string[];
  budgetRange?: string | null;
  message?: string | null;
  locale: string;
}

async function resolveServiceNames(serviceIds?: string[]): Promise<string | null> {
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

export async function sendLeadEmails(
  input: LeadNotificationInput,
  options?: { skipAcknowledgement?: boolean }
) {
  const siteSettings = await getPublicSiteSettings();
  const adminEmail = siteSettings?.contact_email ?? null;
  const serviceNames = await resolveServiceNames(input.requestedServiceIds);
  const tasks: Promise<unknown>[] = [];

  // The visitor acknowledgement is skipped when a language-matched template
  // from the email template library was already sent instead.
  if (input.email && !options?.skipAcknowledgement) {
    tasks.push(
      sendEmail({
        templateKey: "contact_acknowledgement",
        to: input.email,
        data: { name: input.name ?? "there", locale: input.locale },
        relatedType: "lead",
        relatedId: input.leadId,
      })
    );
  }

  if (adminEmail) {
    tasks.push(
      sendEmail({
        templateKey: "lead_notification",
        to: adminEmail,
        data: {
          lead_id: input.leadId,
          name: input.name,
          email: input.email,
          company: input.company,
          requested_service: serviceNames,
          budget_range: input.budgetRange,
          message: input.message,
          locale: input.locale,
        },
        relatedType: "lead",
        relatedId: input.leadId,
      })
    );
  }

  await Promise.allSettled(tasks);
}
