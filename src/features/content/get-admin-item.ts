import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentType } from "@/components/admin/content/content-form";

export async function getContentItem(
  type: ContentType,
  key: string
): Promise<Record<string, unknown> | null> {
  const supabase = await createSupabaseServerClient();

  switch (type) {
    case "portfolio": {
      const { data } = await supabase
        .from("portfolio_projects")
        .select("*")
        .eq("slug", key)
        .single();
      if (!data) return null;

      const project = data as Record<string, unknown>;
      const projectId = project.id as string;

      // Primary category = first linked service (matches the public card badge).
      const { data: linkRows } = await supabase
        .from("portfolio_service_links")
        .select("service_id")
        .eq("portfolio_id", projectId)
        .limit(1);
      let serviceSlug: string | null = null;
      const firstServiceId = linkRows?.[0]?.service_id as string | undefined;
      if (firstServiceId) {
        const { data: service } = await supabase
          .from("services")
          .select("slug")
          .eq("id", firstServiceId)
          .single();
        serviceSlug = (service?.slug as string | undefined) ?? null;
      }

      // Gallery rows in display order (up to 6, matching the card grid).
      const { data: galleryRows } = await supabase
        .from("portfolio_media")
        .select("media_id, image_url")
        .eq("portfolio_id", projectId)
        .order("display_order", { ascending: true })
        .limit(6);
      const gallery = (galleryRows ?? []).map((row) => ({
        media_id: (row.media_id as string | null) ?? "",
        image_url: (row.image_url as string | null) ?? "",
      }));

      return { ...project, service_slug: serviceSlug ?? "", gallery };
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
