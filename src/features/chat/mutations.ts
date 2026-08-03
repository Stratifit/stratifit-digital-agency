"use server";
import type { ActionResult } from "@/types/action-result";

import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { t } from "@/lib/i18n/ui-strings";
import { isValidDisplayName } from "@/lib/validate-display-name";
import type { Json } from "@/types/database.types";
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

  // Anonymous chat has no user session. The server action is the trusted
  // mediator, so chat-table writes use the service-role client (server-only,
  // never exposed to the browser). Public chatbot settings are read via the
  // anon client + RLS (see migration 00024_anon_chat_access).
  const supabase = createSupabaseServiceRoleClient();
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
  const knowledge = await getApprovedKnowledge(parsed.data.locale);

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

// ============================================================================
// Chat onboarding — visitor identity capture for dashboard follow-up
// ============================================================================

export interface ChatStoredMessage {
  id: string;
  sender_type: string;
  content: string;
  content_format: string;
  created_at: string;
}

export interface ChatVisitorState {
  name: string;
  email: string;
  email_choice: "yes" | "later" | null;
  onboarding_complete: boolean;
}

const identitySchema = z.object({
  visitor_token: z.string().min(16),
  name: z.string().min(1).max(80),
  locale: z.string().default("en"),
  source_page: z.string().max(300).optional(),
});

const emailChoiceSchema = z.object({
  visitor_token: z.string().min(16),
  choice: z.enum(["yes", "later"]),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  locale: z.string().default("en"),
});

interface ChatVisitorRow {
  id: string;
  metadata: Json;
  preferred_locale: string;
}

interface ChatConversationRow {
  id: string;
  mode: string;
  status: string;
}

async function resolveChatContext(
  supabase: ReturnType<typeof createSupabaseServiceRoleClient>,
  tokenHash: string,
  locale: string,
  sourcePage?: string
): Promise<{ visitor: ChatVisitorRow; conversation: ChatConversationRow }> {
  let { data: visitor } = await supabase
    .from("chat_visitors")
    .select("id, metadata, preferred_locale")
    .eq("anonymous_token_hash", tokenHash)
    .single();

  if (!visitor) {
    const { data: created } = await supabase
      .from("chat_visitors")
      .insert({
        anonymous_token_hash: tokenHash,
        preferred_locale: locale,
      })
      .select("id, metadata, preferred_locale")
      .single();
    visitor = created;
  }

  if (!visitor) {
    throw new Error("Could not start a chat session.");
  }

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
        source_page: sourcePage,
      })
      .select("id, mode, status")
      .single();
    conversation = created;
    if (conversation) {
      await supabase.from("conversation_events").insert({
        conversation_id: conversation.id,
        event_type: "created",
        metadata: { source: "chat_widget" },
      });
    }
  }

  if (!visitor || !conversation) {
    throw new Error("Could not start a chat session.");
  }

  if (visitor.preferred_locale !== locale) {
    await supabase
      .from("chat_visitors")
      .update({ preferred_locale: locale })
      .eq("id", visitor.id);
  }

  return { visitor: visitor as ChatVisitorRow, conversation: conversation as ChatConversationRow };
}

async function loadStoredMessages(
  supabase: ReturnType<typeof createSupabaseServiceRoleClient>,
  conversationId: string
): Promise<ChatStoredMessage[]> {
  const { data } = await supabase
    .from("chat_messages")
    .select("id, sender_type, content, content_format, created_at")
    .eq("conversation_id", conversationId)
    .eq("is_internal", false)
    .order("created_at", { ascending: true });
  return (data ?? []) as ChatStoredMessage[];
}

function visitorStateFromMeta(metadata: Record<string, unknown>): ChatVisitorState {
  return {
    name: typeof metadata.name === "string" ? metadata.name : "",
    email: typeof metadata.email === "string" ? metadata.email : "",
    email_choice:
      metadata.email_choice === "yes" || metadata.email_choice === "later"
        ? (metadata.email_choice as "yes" | "later")
        : null,
    onboarding_complete: metadata.onboarding_complete === true,
  };
}

export async function getVisitorChatState(input: {
  visitor_token: string;
  locale?: string;
  source_page?: string;
}): Promise<
  ActionResult<{
    conversation_id: string;
    mode: string;
    visitor: ChatVisitorState;
    messages: ChatStoredMessage[];
  }>
> {
  const supabase = createSupabaseServiceRoleClient();
  const { visitor, conversation } = await resolveChatContext(
    supabase,
    hashToken(input.visitor_token),
    input.locale ?? "en",
    input.source_page
  );
  const messages = await loadStoredMessages(supabase, conversation.id);
  return {
    success: true,
    data: {
      conversation_id: conversation.id,
      mode: conversation.mode,
      visitor: visitorStateFromMeta(
        (visitor.metadata as Record<string, unknown>) ?? {}
      ),
      messages,
    },
  };
}

export async function resetVisitorChat(input: {
  visitor_token: string;
  locale?: string;
}): Promise<
  ActionResult<{
    conversation_id: string;
    visitor: ChatVisitorState;
    messages: ChatStoredMessage[];
  }>
> {
  const supabase = createSupabaseServiceRoleClient();
  const { visitor, conversation } = await resolveChatContext(
    supabase,
    hashToken(input.visitor_token),
    input.locale ?? "en"
  );

  // Clear onboarding identity so the welcome flow starts afresh.
  const meta: Record<string, unknown> = {
    ...((visitor.metadata as Record<string, unknown>) ?? {}),
  };
  delete meta.name;
  delete meta.email;
  delete meta.email_choice;
  delete meta.onboarding_complete;
  await supabase
    .from("chat_visitors")
    .update({ metadata: meta as unknown as Json })
    .eq("id", visitor.id);

  // Start the conversation over — remove the visitor's own messages and
  // reset to AI mode.
  await supabase
    .from("chat_messages")
    .delete()
    .eq("conversation_id", conversation.id);
  await supabase
    .from("chat_conversations")
    .update({ status: "open", mode: "ai", lead_id: null })
    .eq("id", conversation.id);

  const messages = await loadStoredMessages(supabase, conversation.id);
  return {
    success: true,
    data: {
      conversation_id: conversation.id,
      visitor: visitorStateFromMeta(meta),
      messages,
    },
  };
}

export async function submitVisitorName(
  input: z.infer<typeof identitySchema>
): Promise<ActionResult<{ conversation_id: string; name: string; messages: ChatStoredMessage[] }>> {
  const parsed = identitySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid name." };

  const supabase = createSupabaseServiceRoleClient();
  const { visitor, conversation } = await resolveChatContext(
    supabase,
    hashToken(parsed.data.visitor_token),
    parsed.data.locale,
    parsed.data.source_page
  );
  const name = parsed.data.name.trim();
  // Low-quality input never becomes the display name — the visitor stays
  // anonymous ("Visitor") but the conversation continues normally.
  const storedName = isValidDisplayName(name) ? name : "";
  const meta: Record<string, unknown> = {
    ...((visitor.metadata as Record<string, unknown>) ?? {}),
  };
  if (storedName) {
    meta.name = storedName;
  } else {
    delete meta.name;
  }
  await supabase
    .from("chat_visitors")
    .update({ metadata: meta as unknown as Json, preferred_locale: parsed.data.locale })
    .eq("id", visitor.id);
  await supabase.from("chat_messages").insert({
    conversation_id: conversation.id,
    sender_type: "visitor",
    content: name,
    content_format: "text",
  });
  const messages = await loadStoredMessages(supabase, conversation.id);
  revalidatePath("/admin/conversations");
  return { success: true, data: { conversation_id: conversation.id, name: storedName, messages } };
}

export async function updateVisitorName(input: {
  visitor_token: string;
  name: string;
}): Promise<ActionResult<{ name: string }>> {
  const parsed = z
    .object({ visitor_token: z.string().min(16), name: z.string().min(1).max(80) })
    .safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid name." };

  const supabase = createSupabaseServiceRoleClient();
  const { visitor } = await resolveChatContext(
    supabase,
    hashToken(parsed.data.visitor_token),
    "en"
  );
  const meta: Record<string, unknown> = {
    ...((visitor.metadata as Record<string, unknown>) ?? {}),
  };
  const storedName = isValidDisplayName(parsed.data.name.trim())
    ? parsed.data.name.trim()
    : (typeof meta.name === "string" ? meta.name : "");
  if (storedName) {
    meta.name = storedName;
  } else {
    delete meta.name;
  }
  await supabase
    .from("chat_visitors")
    .update({ metadata: meta as unknown as Json })
    .eq("id", visitor.id);
  revalidatePath("/admin/conversations");
  return { success: true, data: { name: storedName } };
}

export async function submitVisitorEmailChoice(
  input: z.infer<typeof emailChoiceSchema>
): Promise<ActionResult<{ conversation_id: string; messages: ChatStoredMessage[] }>> {
  const parsed = emailChoiceSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input." };
  if (parsed.data.choice === "yes" && !parsed.data.email) {
    return { success: false, error: "Please provide an email address." };
  }

  const supabase = createSupabaseServiceRoleClient();
  const { visitor, conversation } = await resolveChatContext(
    supabase,
    hashToken(parsed.data.visitor_token),
    parsed.data.locale
  );

  const meta: Record<string, unknown> = {
    ...((visitor.metadata as Record<string, unknown>) ?? {}),
  };
  const previousChoice = meta.email_choice;
  if (previousChoice === "yes" || previousChoice === "later") {
    // Already answered — never duplicate the bot reply or the lead.
    const messages = await loadStoredMessages(supabase, conversation.id);
    return { success: true, data: { conversation_id: conversation.id, messages } };
  }

  const email = parsed.data.choice === "yes" ? (parsed.data.email ?? "").trim() : "";
  meta.email_choice = parsed.data.choice;
  meta.onboarding_complete = true;
  if (email) meta.email = email;
  await supabase
    .from("chat_visitors")
    .update({ metadata: meta as unknown as Json })
    .eq("id", visitor.id);

  const visitorContent = parsed.data.choice === "yes" ? email || "Yes" : "Maybe later";
  await supabase.from("chat_messages").insert({
    conversation_id: conversation.id,
    sender_type: "visitor",
    content: visitorContent,
    content_format: "text",
  });
  // Different closing reply per choice: "yes" gets the email follow-up note
  // (with a client-side Read more), "later" gets the welcome-style invitation.
  await supabase.from("chat_messages").insert({
    conversation_id: conversation.id,
    sender_type: "ai",
    content: t(
      parsed.data.locale,
      parsed.data.choice === "yes" ? "chatYesReply" : "chatLaterReply"
    ),
    content_format: "text",
  });

  // Create a follow-up lead for the dashboard
  const name = typeof meta.name === "string" ? meta.name : "";
  const { data: lead } = await supabase
    .from("leads")
    .insert({
      name: name || null,
      email: email || null,
      preferred_locale: parsed.data.locale,
      source: "chat",
      message: email
        ? `Chat visitor ${name || "Anonymous"} provided contact details for follow-up.`
        : `Chat visitor ${name || "Anonymous"} declined to share an email.`,
      consent_data: { via: "chat", email_choice: parsed.data.choice },
    })
    .select("id")
    .single();
  if (lead) {
    await supabase
      .from("chat_conversations")
      .update({ lead_id: lead.id })
      .eq("id", conversation.id);
  }

  const messages = await loadStoredMessages(supabase, conversation.id);
  return { success: true, data: { conversation_id: conversation.id, messages } };
}

