import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Admin session check for API route handlers. Route handlers cannot call the
 * server-action `requireAdmin()` (which redirects); this returns the
 * user-session Supabase client when the request is an active admin, or null
 * so the route can answer 401.
 */
export async function getAdminSupabase() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: admin } = await supabase
    .from("admin_users")
    .select("role, status")
    .eq("user_id", user.id)
    .single();
  if (!admin || admin.status !== "active") return null;
  return supabase;
}
