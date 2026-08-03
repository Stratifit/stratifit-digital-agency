import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isValidDisplayName, ANONYMOUS_DISPLAY_NAME } from "@/lib/validate-display-name";
import type { AdminVisitorSummary } from "./admin-shared";
import { paddedVisitorNumber } from "./admin-shared";

export { paddedVisitorNumber };
export type { AdminVisitorSummary };

export interface AdminConversationRow {
  id: string;
  status: string;
  mode: string;
  source_page: string | null;
  last_message_at: string;
  created_at: string;
  visitor_id: string;
  visitor: AdminVisitorSummary;
  last_message: string | null;
}

interface ConversationRow {
  id: string;
  status: string;
  mode: string;
  source_page: string | null;
  last_message_at: string;
  created_at: string;
  visitor_id: string;
}

interface VisitorRow {
  id: string;
  visitor_number: number | null;
  metadata: unknown;
  preferred_locale: string;
  first_seen_at: string;
  last_seen_at: string;
}

function visitorSummary(v: VisitorRow | undefined, fallbackCreatedAt: string): AdminVisitorSummary {
  const meta = (v?.metadata as Record<string, unknown> | undefined) ?? {};
  const raw =
    typeof meta.name === "string" && meta.name.trim()
      ? meta.name.trim()
      : "";
  return {
    visitor_number: v?.visitor_number ?? null,
    name: isValidDisplayName(raw) ? raw : ANONYMOUS_DISPLAY_NAME,
    raw_name: raw,
    email: typeof meta.email === "string" ? meta.email : "",
    preferred_locale: v?.preferred_locale ?? "en",
    first_seen_at: v?.first_seen_at ?? fallbackCreatedAt,
    last_seen_at: v?.last_seen_at ?? fallbackCreatedAt,
  };
}

async function enrichConversations(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  rows: ConversationRow[]
): Promise<AdminConversationRow[]> {
  if (rows.length === 0) return [];

  const visitorIds = [...new Set(rows.map((c) => c.visitor_id))];
  const { data: visitors } = visitorIds.length
    ? await supabase
        .from("chat_visitors")
        .select("id, visitor_number, metadata, preferred_locale, first_seen_at, last_seen_at")
        .in("id", visitorIds)
    : { data: [] as never[] };
  const visitorMap = new Map((visitors ?? []).map((v) => [v.id as string, v as VisitorRow]));

  // Latest message preview per conversation (single query, deduped in memory).
  const conversationIds = rows.map((c) => c.id);
  const lastByConversation = new Map<string, string>();
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("conversation_id, content, created_at")
    .eq("is_internal", false)
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false });
  const seen = new Set<string>();
  for (const m of messages ?? []) {
    if (!seen.has(m.conversation_id as string)) {
      seen.add(m.conversation_id as string);
      lastByConversation.set(
        m.conversation_id as string,
        ((m.content as string) ?? "").slice(0, 120)
      );
    }
  }

  return rows.map((c) => ({
    ...c,
    visitor: visitorSummary(visitorMap.get(c.visitor_id), c.created_at),
    last_message: lastByConversation.get(c.id) ?? null,
  }));
}

export async function getAdminConversations(): Promise<AdminConversationRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("chat_conversations")
    .select("id, status, mode, source_page, last_message_at, created_at, visitor_id")
    .order("last_message_at", { ascending: false });
  if (error) return [];
  return enrichConversations(supabase, (data ?? []) as ConversationRow[]);
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

  const enriched = await enrichConversations(supabase, [conversation as ConversationRow]);

  return {
    ...enriched[0],
    messages: (messages ?? []) as AdminConversationDetail["messages"],
  };
}
