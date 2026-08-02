"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/action-result";
import { leadSchema, type LeadFormValues } from "./schemas";


const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_EMAIL = 5;
const MAX_SUBMISSIONS_PER_IP = 20;

const submissionLog = new Map<string, number[]>();

function isRateLimited(key: string, max: number): boolean {
  const now = Date.now();
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

  const forwarded = (await headers()).get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  const emailKey = parsed.data.email.toLowerCase();

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

  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    company: parsed.data.company || null,
    requested_service_id: parsed.data.requested_service_id || null,
    budget_range: parsed.data.custom_budget || parsed.data.budget_range || null,
    message: parsed.data.message,
    preferred_locale: parsed.data.preferred_locale,
    source: parsed.data.source,
    consent_data: {},
  });

  if (error) {
    console.error("Lead insert error:", error.message);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
