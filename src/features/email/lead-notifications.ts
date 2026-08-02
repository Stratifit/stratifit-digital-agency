import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { sendEmail } from "./send";

export interface LeadNotificationInput {
  leadId: string;
  source: "contact_form" | "acquisition";
  name?: string | null;
  email?: string | null;
  company?: string | null;
  requestedServiceId?: string | null;
  budgetRange?: string | null;
  businessInterest?: string | null;
  message?: string | null;
  locale: string;
}

async function resolveServiceName(serviceId?: string | null): Promise<string | null> {
  if (!serviceId) {
    return null;
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("title_translations")
    .eq("id", serviceId)
    .single();
  if (error || !data?.title_translations) {
    return null;
  }
  return resolveTranslation(
    data.title_translations as Record<string, string>,
    "en"
  );
}

export async function sendLeadEmails(input: LeadNotificationInput) {
  const siteSettings = await getPublicSiteSettings();
  const adminEmail = siteSettings?.contact_email ?? null;
  const serviceName = await resolveServiceName(input.requestedServiceId);
  const tasks: Promise<unknown>[] = [];

  if (input.email) {
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

  if (adminEmail && input.source === "acquisition") {
    tasks.push(
      sendEmail({
        templateKey: "acquisition_notification",
        to: adminEmail,
        data: {
          lead_id: input.leadId,
          name: input.name,
          email: input.email,
          company: input.company,
          budget_range: input.budgetRange,
          business_interest: input.businessInterest,
          message: input.message,
          locale: input.locale,
        },
        relatedType: "lead",
        relatedId: input.leadId,
      })
    );
  } else if (adminEmail) {
    tasks.push(
      sendEmail({
        templateKey: "lead_notification",
        to: adminEmail,
        data: {
          lead_id: input.leadId,
          name: input.name,
          email: input.email,
          company: input.company,
          requested_service: serviceName,
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
