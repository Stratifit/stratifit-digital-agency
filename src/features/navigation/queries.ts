import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicNavigationItem {
  id: string;
  label_translations: Record<string, string> | null;
  href: string;
  is_external: boolean;
  open_in_new_tab: boolean;
  display_order: number;
}

export type NavigationLocation = "header" | "footer";

export async function getPublicNavigation(
  location: NavigationLocation
): Promise<PublicNavigationItem[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("navigation_items")
    .select(
      "id, label_translations, href, is_external, open_in_new_tab, display_order"
    )
    .eq("location", location)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as PublicNavigationItem[];
}
