"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireAdminUserId(): Promise<{ supabase: ReturnType<typeof createSupabaseServerClient> extends Promise<infer T> ? T : never; userId: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) {
    redirect("/admin/login");
  }
  const { data: admin } = await supabase
    .from("admin_users")
    .select("role, status")
    .eq("user_id", user.id)
    .single();
  if (!admin || admin.status !== "active") {
    redirect("/admin/login");
  }
  return { supabase, userId: user.id };
}

const replySchema = z.object({
  content: z.string().min(1).max(2000),
  is_internal: z.boolean().default(false),
});

async function logEvent(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  conversationId: string,
  eventType: string,
  actorUserId: string
) {
  await supabase.from("conversation_events").insert({
    conversation_id: conversationId,
    event_type: eventType,
    actor_user_id: actorUserId,
  });
}

export async function adminReply(
  conversationId: string,
  input: z.infer<typeof replySchema>
): Promise<{ success: boolean; error?: string }> {
  const { supabase, userId } = await requireAdminUserId();
  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid message." };

  const { error } = await supabase.from("chat_messages").insert({
    conversation_id: conversationId,
    sender_type: parsed.data.is_internal ? "system" : "admin",
    sender_user_id: userId,
    content: parsed.data.content,
    content_format: "text",
    is_internal: parsed.data.is_internal,
  });
  if (error) return { success: false, error: "Failed to send." };

  if (!parsed.data.is_internal) {
    await supabase
      .from("chat_conversations")
      .update({ status: "waiting_for_visitor", mode: "human", last_message_at: new Date().toISOString() })
      .eq("id", conversationId);
  }

  revalidatePath(`/admin/conversations/${conversationId}`);
  return { success: true };
}

export async function takeOverConversation(
  conversationId: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase, userId } = await requireAdminUserId();
  const { error } = await supabase
    .from("chat_conversations")
    .update({ mode: "human", status: "waiting_for_visitor", assigned_to: userId })
    .eq("id", conversationId);
  if (error) return { success: false, error: "Failed to take over." };
  await logEvent(supabase, conversationId, "human_takeover", userId);
  revalidatePath(`/admin/conversations/${conversationId}`);
  return { success: true };
}

export async function returnToAi(conversationId: string): Promise<{ success: boolean; error?: string }> {
  const { supabase, userId } = await requireAdminUserId();
  const { error } = await supabase
    .from("chat_conversations")
    .update({ mode: "ai", status: "open" })
    .eq("id", conversationId);
  if (error) return { success: false, error: "Failed to return to AI." };
  await logEvent(supabase, conversationId, "returned_to_ai", userId);
  revalidatePath(`/admin/conversations/${conversationId}`);
  return { success: true };
}

export async function resolveConversation(conversationId: string): Promise<{ success: boolean; error?: string }> {
  const { supabase, userId } = await requireAdminUserId();
  const { error } = await supabase
    .from("chat_conversations")
    .update({ status: "resolved", mode: "closed", resolved_at: new Date().toISOString() })
    .eq("id", conversationId);
  if (error) return { success: false, error: "Failed to resolve." };
  await logEvent(supabase, conversationId, "resolved", userId);
  revalidatePath("/admin/conversations");
  return { success: true };
}

export async function archiveConversation(conversationId: string): Promise<{ success: boolean; error?: string }> {
  const { supabase, userId } = await requireAdminUserId();
  const { error } = await supabase
    .from("chat_conversations")
    .update({ status: "archived", archived_at: new Date().toISOString() })
    .eq("id", conversationId);
  if (error) return { success: false, error: "Failed to archive." };
  await logEvent(supabase, conversationId, "archived", userId);
  revalidatePath("/admin/conversations");
  return { success: true };
}
