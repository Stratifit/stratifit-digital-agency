import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminUserRow {
  user_id: string;
  role: string;
  status: string;
  display_name: string | null;
  created_at: string;
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id, role, status, display_name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data as AdminUserRow[];
}
