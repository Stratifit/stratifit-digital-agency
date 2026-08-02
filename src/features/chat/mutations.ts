"use server";
import type { ActionResult } from "@/types/action-result";

import { createHash } from "crypto";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getChatbotSettings, getApprovedKnowledge } from "./knowledge";
import { getChatProvider } from "./ai";

const messageSchema = z.object({
  visitor_token: z.string().min(16),
  message: z.string().min(1).max(1000),
  locale: z.string().default("en"),
  source_page: z.string().max(300).optional(),
});

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

export async function sendVisitorMessage(
  input: z.infer<typeof messageSchema>
): Promise<
  ActionResult<{ conversation_id: string; ai_reply?: string; escalated: boolean; mode: string }>
> {
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid message." };
  }

  const settings = await getChatbotSettings();
  if (!settings?.is_enabled) {
    return { success: false, error: "Chat is currently offline." };
  }

  const supabase = await createSupabaseServerClient();
  const tokenHash = hashToken(parsed.data.visitor_token);

  // Resolve or create visitor
  let { data: visitor } = await supabase
    .from("chat_visitors")
    .select("id")
    .eq("anonymous_token_hash", tokenHash)
    .single();

  if (!visitor) {
    const { data: created } = await supabase
      .from("chat_visitors")
      .insert({
        anonymous_token_hash: tokenHash,
        preferred_locale: parsed.data.locale,
      })
      .select("id")
      .single();
    visitor = created;
  }

  if (!visitor) {
    return { success: false, error: "Could not create a chat session." };
  }

  // Resolve or create conversation
  let { data: conversation } = await supabase
    .from("chat_conversations")
    .select("id, mode, status")
    .eq("visitor_id", visitor.id)
    .in("status", ["open", "waiting_for_admin", "waiting_for_visitor"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!conversation) {
    const { data: created } = await supabase
      .from("chat_conversations")
      .insert({
        visitor_id: visitor.id,
        status: "open",
        mode: "ai",
        source_page: parsed.data.source_page,
      })
      .select("id, mode, status")
      .single();
    conversation = created;
    if (!conversation) {
      return { success: false, error: "Could not create a conversation." };
    }
    await supabase.from("conversation_events").insert({
      conversation_id: conversation.id,
      event_type: "created",
      metadata: { source: "chat_widget" },
    });
  }

  // Rate limit: count visitor messages in window
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversation.id)
    .eq("sender_type", "visitor")
    .gte("created_at", since);
  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return { success: false, error: "Too many messages. Please wait a moment." };
  }

  // Store visitor message
  await supabase.from("chat_messages").insert({
    conversation_id: conversation.id,
    sender_type: "visitor",
    content: parsed.data.message,
    content_format: "text",
  });

  // If human mode, do not auto-reply
  if (conversation.mode !== "ai") {
    await supabase
      .from("chat_conversations")
      .update({ status: "waiting_for_admin", last_message_at: new Date().toISOString() })
      .eq("id", conversation.id);
    return {
      success: true,
      data: {
        conversation_id: conversation.id,
        escalated: false,
        mode: conversation.mode,
      },
    };
  }

  // Generate AI reply from approved knowledge
  const knowledge = await getApprovedKnowledge();
  const provider = await getChatProvider();
  const ai = await provider.generateResponse({
    message: parsed.data.message,
    locale: parsed.data.locale,
    knowledge,
  });

  const escalated = ai.escalated;

  if (ai.content) {
    await supabase.from("chat_messages").insert({
      conversation_id: conversation.id,
      sender_type: "ai",
      content: ai.content,
      content_format: "text",
    });
  }

  // Escalate if AI cannot answer safely
  if (escalated) {
    const escalationMessage =
      settings.escalation_message_translations?.[parsed.data.locale] ??
      settings.escalation_message_translations?.en ??
      "Let me connect you with a team member.";
    await supabase.from("chat_messages").insert({
      conversation_id: conversation.id,
      sender_type: "ai",
      content: escalationMessage,
      content_format: "text",
    });
    await supabase
      .from("chat_conversations")
      .update({ status: "waiting_for_admin", last_message_at: new Date().toISOString() })
      .eq("id", conversation.id);
    await supabase.from("conversation_events").insert({
      conversation_id: conversation.id,
      event_type: "escalated",
      metadata: { reason: "ai_uncertain" },
    });
  } else {
    await supabase
      .from("chat_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversation.id);
  }

  return {
    success: true,
    data: {
      conversation_id: conversation.id,
      ai_reply: ai.content || undefined,
      escalated,
      mode: conversation.mode,
    },
  };
}

export async function getVisitorMessages(
  conversationId: string
): Promise<{ id: string; sender_type: string; content: string; created_at: string }[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("chat_messages")
    .select("id, sender_type, content, created_at")
    .eq("conversation_id", conversationId)
    .eq("is_internal", false)
    .order("created_at", { ascending: true });
  return (data ?? []) as never[];
}
