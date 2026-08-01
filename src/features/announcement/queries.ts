import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicAnnouncement {
  message_translations: Record<string, string> | null;
  link_label_translations: Record<string, string> | null;
  link_url: string | null;
}

export async function getPublicAnnouncement(): Promise<PublicAnnouncement | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("announcement_bar")
    .select(
      "message_translations, link_label_translations, link_url, is_enabled, starts_at, ends_at"
    )
    .single();

  if (error || !data) {
    return null;
  }

  const announcement = data as PublicAnnouncement & {
    is_enabled: boolean;
    starts_at: string | null;
    ends_at: string | null;
  };

  if (!announcement.is_enabled) {
    return null;
  }

  const now = Date.now();
  if (announcement.starts_at && new Date(announcement.starts_at).getTime() > now) {
    return null;
  }
  if (announcement.ends_at && new Date(announcement.ends_at).getTime() < now) {
    return null;
  }

  return {
    message_translations: announcement.message_translations,
    link_label_translations: announcement.link_label_translations,
    link_url: announcement.link_url,
  };
}
