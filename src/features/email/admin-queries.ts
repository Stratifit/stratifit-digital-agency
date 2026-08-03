import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminEmailEvent {
  id: string;
  template_key: string;
  recipient_email: string;
  status: string;
  created_at: string;
  sent_at: string | null;
  error_message: string | null;
}

export async function getAdminEmailEvents(
  limit = 100
): Promise<AdminEmailEvent[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("email_events")
    .select(
      "id, template_key, recipient_email, status, created_at, sent_at, error_message"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return data as AdminEmailEvent[];
}
