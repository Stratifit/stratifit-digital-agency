"use server";

import type { ActionResult } from "@/types/action-result";
import { z } from "zod";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { t } from "@/lib/i18n/ui-strings";
import { hashToken } from "@/features/chat/token";
import {
  resolveChatContext,
  loadStoredMessages,
  type ChatStoredMessage,
} from "@/features/chat/mutations";
import { getChatProvider } from "@/features/chat/ai";
import { getApprovedKnowledge } from "@/features/chat/knowledge";
import { getPublicFaqBotSettings } from "./queries";

const faqBotMessageSchema = z.object({
  visitor_token: z.string().min(16),
  message: z.string().min(1).max(1000),
  locale: z.string().default("en"),
  source_page: z.string().max(300).optional(),
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

/**
 * Sends a visitor message to the FAQ section bot. Uses its own conversation
 * scope (bot_type = 'faq') so FAQ-bot messages never mix with the main chat,
 * and answers only from knowledge in the configured allowed categories.
 * Anonymous writes are mediated by the service-role client (server-only),
 * mirroring the main chat flow.
 */
export async function sendFaqBotMessage(
  input: z.infer<typeof faqBotMessageSchema>
): Promise<
  ActionResult<{ conversation_id: string; ai_reply?: string; escalated: boolean; mode: string }>
> {
  const parsed = faqBotMessageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid message." };
  }

  const settings = await getPublicFaqBotSettings();
  if (!settings?.faq_bot_enabled) {
    return { success: false, error: "Chat is currently offline." };
  }

  const supabase = createSupabaseServiceRoleClient();
  const tokenHash = hashToken(parsed.data.visitor_token);

  const { conversation } = await resolveChatContext(
    supabase,
    tokenHash,
    parsed.data.locale,
    parsed.data.source_page,
    "faq",
    "faq_bot"
  );

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

  // FAQ-scoped knowledge, restricted to the configured allowed categories
  const allowed = new Set(
    settings.faq_bot_allowed_categories?.length
      ? settings.faq_bot_allowed_categories
      : ["general"]
  );
  const knowledge = (await getApprovedKnowledge(parsed.data.locale)).filter((entry) =>
    allowed.has(entry.category)
  );

  const { data: recentMessages } = await supabase
    .from("chat_messages")
    .select("sender_type, content")
    .eq("conversation_id", conversation.id)
    .eq("is_internal", false)
    .in("sender_type", ["visitor", "ai"])
    .order("created_at", { ascending: true })
    .limit(20);

  const history = (recentMessages ?? [])
    .filter((m) => m.content?.trim())
    .map((m) => ({
      role: m.sender_type === "visitor" ? ("user" as const) : ("assistant" as const),
      content: m.content as string,
    }));

  const provider = await getChatProvider();
  const ai = await provider.generateResponse({
    message: parsed.data.message,
    locale: parsed.data.locale,
    knowledge,
    history,
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

  // Escalate when the AI cannot answer safely — the admin inbox picks it up
  if (escalated) {
    const fallback =
      settings.faq_bot_fallback_translations?.[parsed.data.locale] ??
      settings.faq_bot_fallback_translations?.en ??
      t(parsed.data.locale, "faqBotFallbackFallback");
    await supabase.from("chat_messages").insert({
      conversation_id: conversation.id,
      sender_type: "ai",
      content: fallback,
      content_format: "text",
    });
    await supabase
      .from("chat_conversations")
      .update({ status: "waiting_for_admin", last_message_at: new Date().toISOString() })
      .eq("id", conversation.id);
    await supabase.from("conversation_events").insert({
      conversation_id: conversation.id,
      event_type: "escalated",
      metadata: { reason: "faq_bot_ai_uncertain" },
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

/** Loads the persisted FAQ-bot conversation for the visitor. */
export async function getFaqBotChatState(input: {
  visitor_token: string;
  locale?: string;
  source_page?: string;
}): Promise<
  ActionResult<{
    conversation_id: string;
    mode: string;
    messages: ChatStoredMessage[];
  }>
> {
  const supabase = createSupabaseServiceRoleClient();
  const { conversation } = await resolveChatContext(
    supabase,
    hashToken(input.visitor_token),
    input.locale ?? "en",
    input.source_page,
    "faq",
    "faq_bot"
  );
  const messages = await loadStoredMessages(supabase, conversation.id);
  return {
    success: true,
    data: {
      conversation_id: conversation.id,
      mode: conversation.mode,
      messages,
    },
  };
}

/** Starts the FAQ-bot conversation over (clears its messages, back to AI). */
export async function resetFaqBotChat(input: {
  visitor_token: string;
  locale?: string;
}): Promise<
  ActionResult<{
    conversation_id: string;
    messages: ChatStoredMessage[];
  }>
> {
  const supabase = createSupabaseServiceRoleClient();
  const { conversation } = await resolveChatContext(
    supabase,
    hashToken(input.visitor_token),
    input.locale ?? "en",
    undefined,
    "faq",
    "faq_bot"
  );
  await supabase.from("chat_messages").delete().eq("conversation_id", conversation.id);
  await supabase
    .from("chat_conversations")
    .update({ status: "open", mode: "ai", lead_id: null })
    .eq("id", conversation.id);
  const messages = await loadStoredMessages(supabase, conversation.id);
  return {
    success: true,
    data: { conversation_id: conversation.id, messages },
  };
}
