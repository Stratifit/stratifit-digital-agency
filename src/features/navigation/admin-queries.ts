import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminNavigationItem {
  id: string;
  location: "header" | "footer";
  label_translations: Record<string, string> | null;
  href: string;
  is_external: boolean;
  open_in_new_tab: boolean;
  display_order: number;
  is_visible: boolean;
}

export async function getAdminNavigationItems(): Promise<AdminNavigationItem[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("navigation_items")
    .select(
      "id, location, label_translations, href, is_external, open_in_new_tab, display_order, is_visible"
    )
    .order("location", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as AdminNavigationItem[];
}
