"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";
import { announcementSchema, type AnnouncementFormValues } from "./schemas";

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

export async function updateAnnouncement(
  input: AnnouncementFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = announcementSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("announcement_bar").upsert(
    {
      singleton_key: true,
      slides: parsed.data.slides,
      message_translations: parsed.data.slides[0],
      link_label_translations: parsed.data.link_label_translations,
      link_url: parsed.data.link_url || null,
      is_enabled: parsed.data.is_enabled,
      starts_at: parsed.data.starts_at || null,
      ends_at: parsed.data.ends_at || null,
      variant: parsed.data.variant,
    },
    { onConflict: "singleton_key" }
  );

  if (error) {
    return { success: false, error: "Failed to save announcement." };
  }

  await recordAuditLog({
    action: "update",
    target_table: "announcement_bar",
    target_id: "singleton",
  });
  revalidatePath("/");
  revalidatePath("/admin/content/announcement");
  return { success: true };
}
