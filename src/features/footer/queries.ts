import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicFooterLink {
  id: string;
  label_translations: Record<string, string> | null;
  href: string;
  is_external: boolean;
  display_order: number;
}

export interface PublicFooterGroup {
  id: string;
  title_translations: Record<string, string> | null;
  display_order: number;
  links: PublicFooterLink[];
}

export async function getPublicFooterGroups(): Promise<PublicFooterGroup[]> {
  const supabase = await createSupabaseServerClient();

  const { data: groups, error: groupsError } = await supabase
    .from("footer_groups")
    .select("id, title_translations, display_order")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (groupsError || !groups) {
    return [];
  }

  const { data: links, error: linksError } = await supabase
    .from("footer_links")
    .select("id, group_id, label_translations, href, is_external, display_order")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (linksError) {
    return (groups ?? []).map((g) => ({
      ...(g as Omit<PublicFooterGroup, "links">),
      links: [],
    }));
  }

  return (groups ?? []).map((group) => {
    const groupId = (group as { id: string }).id;
    const groupLinks = (links ?? [])
      .filter((link) => (link as { group_id: string }).group_id === groupId)
      .map((link) => {
        const rest = { ...(link as PublicFooterLink) };
        delete (rest as Record<string, unknown>).group_id;
        return rest;
      });

    return {
      ...(group as Omit<PublicFooterGroup, "links">),
      links: groupLinks,
    };
  });
}
