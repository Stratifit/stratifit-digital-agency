"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { leadSchema, type LeadFormValues } from "./schemas";

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitLead(input: LeadFormValues): Promise<ActionResult> {
  const parsed = leadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
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
