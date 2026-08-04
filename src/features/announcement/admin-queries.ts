import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminAnnouncement {
  message_translations: Record<string, string> | null;
  link_label_translations: Record<string, string> | null;
  link_url: string | null;
  is_enabled: boolean;
  starts_at: string | null;
  ends_at: string | null;
  variant: string;
}

export async function getAdminAnnouncement(): Promise<AdminAnnouncement | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("announcement_bar")
    .select(
      "message_translations, link_label_translations, link_url, is_enabled, starts_at, ends_at, variant"
    )
    .eq("singleton_key", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as AdminAnnouncement;
}
