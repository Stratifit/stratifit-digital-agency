import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentType } from "@/components/admin/content/content-form";

export async function getContentItem(
  type: ContentType,
  key: string
): Promise<Record<string, unknown> | null> {
  const supabase = await createSupabaseServerClient();

  switch (type) {
    case "portfolio": {
      const { data } = await supabase.from("portfolio_projects").select("*").eq("slug", key).single();
      return (data as Record<string, unknown>) ?? null;
    }
    case "insights": {
      const { data } = await supabase.from("insights").select("*").eq("slug", key).single();
      return (data as Record<string, unknown>) ?? null;
    }
    case "testimonials": {
      const { data } = await supabase.from("testimonials").select("*").eq("id", key).single();
      return (data as Record<string, unknown>) ?? null;
    }
    case "pricing": {
      const { data } = await supabase.from("pricing_plans").select("*").eq("slug", key).single();
      return (data as Record<string, unknown>) ?? null;
    }
    case "faq": {
      const { data } = await supabase.from("faqs").select("*").eq("id", key).single();
      return (data as Record<string, unknown>) ?? null;
    }
  }
}
