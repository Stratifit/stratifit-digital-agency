import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminServiceRow {
  id: string;
  slug: string;
  title_translations: Record<string, string> | null;
  status: string;
  is_visible: boolean;
  display_order: number;
}

export async function getAdminServices(): Promise<AdminServiceRow[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("services")
    .select("id, slug, title_translations, status, is_visible, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as AdminServiceRow[];
}
