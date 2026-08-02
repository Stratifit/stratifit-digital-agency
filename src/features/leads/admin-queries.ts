import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminLeadRow {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  source: string;
  status: string;
  preferred_locale: string;
  created_at: string;
  message: string | null;
  business_interest: string | null;
}

export async function getAdminLeads(): Promise<AdminLeadRow[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("leads")
    .select("id, name, email, company, source, status, preferred_locale, created_at, message, business_interest")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []) as AdminLeadRow[];
}

export async function getAdminLead(id: string): Promise<AdminLeadRow | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("leads")
    .select("id, name, email, company, source, status, preferred_locale, created_at, message, business_interest")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as AdminLeadRow;
}

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
  "archived",
] as const;
