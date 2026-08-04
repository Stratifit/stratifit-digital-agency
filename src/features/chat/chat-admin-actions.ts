"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";
import {
  knowledgeEntrySchema,
  chatbotSettingsSchema,
  aiFaqSettingsSchema,
  type KnowledgeEntryFormValues,
  type ChatbotSettingsFormValues,
  type AiFaqSettingsFormValues,
} from "./chat-admin-schemas";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
  return supabase;
}

export async function createKnowledgeEntry(
  input: KnowledgeEntryFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = knowledgeEntrySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase
    .from("chatbot_knowledge")
    .insert({
      slug: parsed.data.slug,
      title_translations: parsed.data.title_translations,
      content_translations: parsed.data.content_translations,
      category: parsed.data.category,
      source_type: parsed.data.source_type,
      priority: parsed.data.priority,
      is_enabled: parsed.data.is_enabled,
      is_ai_eligible: parsed.data.is_ai_eligible,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A knowledge entry with this slug already exists." };
    }
    return { success: false, error: "Failed to create knowledge entry." };
  }

  await recordAuditLog({
    action: "create",
    target_table: "chatbot_knowledge",
    target_id: data.id,
  });
  revalidatePath("/admin/content/chatbot/knowledge");
  return { success: true };
}

export async function updateKnowledgeEntry(
  id: string,
  input: KnowledgeEntryFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = knowledgeEntrySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("chatbot_knowledge")
    .update({
      slug: parsed.data.slug,
      title_translations: parsed.data.title_translations,
      content_translations: parsed.data.content_translations,
      category: parsed.data.category,
      source_type: parsed.data.source_type,
      priority: parsed.data.priority,
      is_enabled: parsed.data.is_enabled,
      is_ai_eligible: parsed.data.is_ai_eligible,
      last_reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A knowledge entry with this slug already exists." };
    }
    return { success: false, error: "Failed to update knowledge entry." };
  }

  await recordAuditLog({
    action: "update",
    target_table: "chatbot_knowledge",
    target_id: id,
  });
  revalidatePath("/admin/content/chatbot/knowledge");
  revalidatePath(`/admin/content/chatbot/knowledge/${id}/edit`);
  return { success: true };
}

export async function deleteKnowledgeEntry(id: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("chatbot_knowledge").delete().eq("id", id);
  await recordAuditLog({
    action: "delete",
    target_table: "chatbot_knowledge",
    target_id: id,
  });
  revalidatePath("/admin/content/chatbot/knowledge");
}

export async function updateChatbotSettings(
  input: ChatbotSettingsFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = chatbotSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("chatbot_settings").upsert(
    {
      singleton_key: true,
      is_enabled: parsed.data.is_enabled,
      response_style: parsed.data.response_style,
      lead_capture_mode: parsed.data.lead_capture_mode,
      human_support_enabled: parsed.data.human_support_enabled,
      allowed_categories: parsed.data.allowed_categories,
      welcome_message_translations: parsed.data.welcome_message_translations,
      offline_message_translations: parsed.data.offline_message_translations,
      escalation_message_translations: parsed.data.escalation_message_translations,
      fallback_message_translations: parsed.data.fallback_message_translations,
    },
    { onConflict: "singleton_key" }
  );

  if (error) {
    return { success: false, error: "Failed to save chatbot settings." };
  }

  await recordAuditLog({
    action: "update",
    target_table: "chatbot_settings",
    target_id: "singleton",
  });
  revalidatePath("/admin/content/chatbot/settings");
  revalidatePath("/");
  return { success: true };
}

export async function updateAiFaqSettings(
  input: AiFaqSettingsFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = aiFaqSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("ai_faq_settings").upsert(
    {
      singleton_key: true,
      is_enabled: parsed.data.is_enabled,
      intro_translations: parsed.data.intro_translations,
      fallback_translations: parsed.data.fallback_translations,
      cta_label_translations: parsed.data.cta_label_translations,
      cta_url: parsed.data.cta_url || null,
      suggested_questions: parsed.data.suggested_questions,
      allowed_categories: parsed.data.allowed_categories,
    },
    { onConflict: "singleton_key" }
  );

  if (error) {
    return { success: false, error: "Failed to save AI FAQ settings." };
  }

  await recordAuditLog({
    action: "update",
    target_table: "ai_faq_settings",
    target_id: "singleton",
  });
  revalidatePath("/admin/content/chatbot/ai-faq");
  revalidatePath("/");
  return { success: true };
}
