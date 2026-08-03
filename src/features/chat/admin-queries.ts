import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminConversationRow {
  id: string;
  status: string;
  mode: string;
  source_page: string | null;
  last_message_at: string;
  created_at: string;
  visitor_id: string;
}

export async function getAdminConversations(): Promise<AdminConversationRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("chat_conversations")
    .select("id, status, mode, source_page, last_message_at, created_at, visitor_id")
    .order("last_message_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as AdminConversationRow[];
}

export interface AdminConversationDetail extends AdminConversationRow {
  messages: {
    id: string;
    sender_type: string;
    content: string;
    content_format: string;
    is_internal: boolean;
    created_at: string;
  }[];
}

export async function getAdminConversation(
  id: string
): Promise<AdminConversationDetail | null> {
  const supabase = await createSupabaseServerClient();

  const { data: conversation, error } = await supabase
    .from("chat_conversations")
    .select("id, status, mode, source_page, last_message_at, created_at, visitor_id")
    .eq("id", id)
    .single();

  if (error || !conversation) return null;

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("id, sender_type, content, content_format, is_internal, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  return { ...(conversation as AdminConversationRow), messages: (messages ?? []) as AdminConversationDetail["messages"] };
}
