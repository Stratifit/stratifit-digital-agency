import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface DashboardStats {
  services: number;
  portfolio: number;
  insights: number;
  testimonials: number;
  pricing: number;
  faqs: number;
  leads: number;
  conversations: number;
  waitingForAdmin: number;
  openConversations: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();

  const [
    services,
    portfolio,
    insights,
    testimonials,
    pricing,
    faqs,
    leads,
    conversations,
    waitingForAdmin,
    openConversations,
  ] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase
      .from("portfolio_projects")
      .select("id", { count: "exact", head: true }),
    supabase.from("insights").select("id", { count: "exact", head: true }),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
    supabase.from("pricing_plans").select("id", { count: "exact", head: true }),
    supabase.from("faqs").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("chat_conversations")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("chat_conversations")
      .select("id", { count: "exact", head: true })
      .eq("status", "waiting_for_admin"),
    supabase
      .from("chat_conversations")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
  ]);

  return {
    services: services.count ?? 0,
    portfolio: portfolio.count ?? 0,
    insights: insights.count ?? 0,
    testimonials: testimonials.count ?? 0,
    pricing: pricing.count ?? 0,
    faqs: faqs.count ?? 0,
    leads: leads.count ?? 0,
    conversations: conversations.count ?? 0,
    waitingForAdmin: waitingForAdmin.count ?? 0,
    openConversations: openConversations.count ?? 0,
  };
}
