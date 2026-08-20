"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/action-result";
import { sendLeadEmails } from "@/features/communication/lead-notifications";
import { syncLeadToEmailThread } from "@/features/email-inbox/forms";
import {
  getSectionTemplateForSource,
  sendTemplateEmail,
} from "@/features/email-inbox/template-sends";
import { leadSchema, type LeadFormValues } from "./schemas";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_EMAIL = 5;
const MAX_SUBMISSIONS_PER_IP = 20;

const submissionLog = new Map<string, number[]>();

function isRateLimited(key: string, max: number): boolean {
  const now = Date.now();
  // Bound memory growth: if the log has grown very large, reset it. Combined
  // with the time-window filter below this keeps rate limiting effective for a
  // single-instance V1 deployment without unbounded key accumulation.
  if (submissionLog.size > 10_000) {
    submissionLog.clear();
  }
  const recent = (submissionLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS
  );
  if (recent.length >= max) {
    return true;
  }
  recent.push(now);
  submissionLog.set(key, recent);
  return false;
}

interface LeadRecord {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  requested_service_ids?: string[];
  budget_range?: string;
  message: string;
  preferred_locale: string;
  source: string;
}

async function recordLead(values: LeadRecord): Promise<ActionResult> {
  const forwarded = (await headers()).get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  const emailKey = values.email.toLowerCase();

  if (
    isRateLimited(`email:${emailKey}`, MAX_SUBMISSIONS_PER_EMAIL) ||
    isRateLimited(`ip:${ip}`, MAX_SUBMISSIONS_PER_IP)
  ) {
    return {
      success: false,
      error: "Too many submissions. Please try again later.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const leadId = crypto.randomUUID();

  const { error } = await supabase.from("leads").insert({
    id: leadId,
    name: values.name,
    email: values.email,
    phone: values.phone || null,
    company: values.company || null,
    requested_service_id: values.requested_service_ids?.[0] ?? null,
    requested_service_ids: values.requested_service_ids?.length
      ? values.requested_service_ids
      : null,
    budget_range: values.budget_range || null,
    message: values.message,
    preferred_locale: values.preferred_locale,
    source: values.source,
    consent_data: {},
  });

  if (error) {
    console.error("Lead insert error:", error.message);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  // Language-matched acknowledgement from the email template library when
  // the mapped section has an auto-reply template; otherwise the built-in
  // English acknowledgement is sent. Best-effort — never fails the lead.
  let templateSent = false;
  try {
    const sectionInfo = await getSectionTemplateForSource(
      values.source,
      values.preferred_locale
    );
    if (sectionInfo?.autoReplyTemplate) {
      const { sent } = await sendTemplateEmail({
        template: sectionInfo.autoReplyTemplate,
        language: values.preferred_locale,
        toEmail: values.email,
        context: {
          name: values.name,
          section_name: sectionInfo.sectionName,
        },
        fromAddress: sectionInfo.fromAddress ?? undefined,
        idempotencyKey: `email_inbox_template:lead:${leadId}`,
      });
      templateSent = sent;
    }
  } catch (error) {
    console.error(
      "Template acknowledgement error:",
      error instanceof Error ? error.message : error
    );
  }

  await sendLeadEmails(
    {
      leadId,
      name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      requestedServiceIds: values.requested_service_ids,
      budgetRange: values.budget_range,
      message: values.message,
      locale: values.preferred_locale,
    },
    { skipAcknowledgement: templateSent }
  );

  // Unified inbox: mirror the enquiry as a conversation in the mapped
  // section. Best-effort — never fails the lead submission.
  await syncLeadToEmailThread({
    leadId,
    name: values.name,
    email: values.email,
    message: values.message,
    source: values.source,
    language: values.preferred_locale,
  });

  return { success: true };
}

export async function submitLead(input: LeadFormValues): Promise<ActionResult> {
  const parsed = leadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.honeypot) {
    return { success: true };
  }

  return recordLead({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    company: parsed.data.company,
    requested_service_ids: parsed.data.requested_service_ids,
    budget_range: parsed.data.custom_budget || parsed.data.budget_range,
    message: parsed.data.message,
    preferred_locale: parsed.data.preferred_locale,
    source: parsed.data.source,
  });
}
