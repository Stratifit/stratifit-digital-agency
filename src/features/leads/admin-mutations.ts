"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import { LEAD_STATUSES } from "./admin-queries";

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

const statusSchema = z.enum(LEAD_STATUSES);

export async function updateLeadStatus(
  id: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await requireAdmin();
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) {
    return { success: false, error: "Invalid status." };
  }
  const { error } = await supabase.from("leads").update({ status: parsed.data }).eq("id", id);
  if (error) return { success: false, error: "Failed to update lead." };
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return { success: true };
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("leads").delete().eq("id", id);
  await recordAuditLog({ action: "delete", target_table: "leads", target_id: id });
  revalidatePath("/admin/leads");
}
