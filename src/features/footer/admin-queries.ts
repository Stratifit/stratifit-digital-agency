import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminFooterLink {
  id: string;
  group_id: string;
  label_translations: Record<string, string> | null;
  href: string;
  is_external: boolean;
  display_order: number;
  is_visible: boolean;
}

export interface AdminFooterGroup {
  id: string;
  title_translations: Record<string, string> | null;
  display_order: number;
  is_visible: boolean;
  links: AdminFooterLink[];
}

export async function getAdminFooterGroups(): Promise<AdminFooterGroup[]> {
  const supabase = await createSupabaseServerClient();

  const { data: groups, error: groupsError } = await supabase
    .from("footer_groups")
    .select("id, title_translations, display_order, is_visible")
    .order("display_order", { ascending: true });

  if (groupsError || !groups) {
    return [];
  }

  const { data: links, error: linksError } = await supabase
    .from("footer_links")
    .select("id, group_id, label_translations, href, is_external, display_order, is_visible")
    .order("display_order", { ascending: true });

  if (linksError || !links) {
    return (groups as AdminFooterGroup[]).map((g) => ({ ...g, links: [] }));
  }

  return (groups as Omit<AdminFooterGroup, "links">[]).map((group) => ({
    ...group,
    links: (links as AdminFooterLink[]).filter((l) => l.group_id === group.id),
  }));
}
