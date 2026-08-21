"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";

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

const senderAddressSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address."),
  label: z.string().trim().max(60, "Label is too long.").optional(),
});

const REVALIDATE_PATHS = [
  "/admin/communication/addresses",
  "/admin/communication/send",
  "/admin/email/inbox",
];

export async function createSenderAddress(input: {
  email: string;
  label?: string;
}): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = senderAddressSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("email_sender_addresses").insert({
    email: parsed.data.email,
    label: parsed.data.label?.trim() || null,
    is_enabled: true,
    is_default: false,
  });

  if (error) {
    return {
      success: false,
      error:
        error.code === "23505"
          ? "This address is already in the list."
          : "Failed to add the address.",
    };
  }

  await recordAuditLog({
    action: "create",
    target_table: "email_sender_addresses",
    target_id: parsed.data.email,
  });
  for (const path of REVALIDATE_PATHS) revalidatePath(path);
  return { success: true };
}

export async function toggleSenderAddress(input: {
  id: string;
  enabled: boolean;
}): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("email_sender_addresses")
    .update({ is_enabled: input.enabled })
    .eq("id", input.id);

  if (error) {
    return { success: false, error: "Could not update the address." };
  }
  for (const path of REVALIDATE_PATHS) revalidatePath(path);
  return { success: true };
}

export async function setDefaultSenderAddress(input: {
  id: string;
}): Promise<ActionResult> {
  const supabase = await requireAdmin();

  // Clear the current default, then set the new one (partial unique index
  // guarantees only one default at a time; do it in a transaction-safe order).
  const { error: clearError } = await supabase
    .from("email_sender_addresses")
    .update({ is_default: false })
    .eq("is_default", true);
  if (clearError) {
    return { success: false, error: "Could not update the default address." };
  }

  const { error } = await supabase
    .from("email_sender_addresses")
    .update({ is_default: true })
    .eq("id", input.id);
  if (error) {
    return { success: false, error: "Could not set the default address." };
  }

  await recordAuditLog({
    action: "set_default",
    target_table: "email_sender_addresses",
    target_id: input.id,
  });
  for (const path of REVALIDATE_PATHS) revalidatePath(path);
  return { success: true };
}

export async function deleteSenderAddress(input: {
  id: string;
}): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("email_sender_addresses")
    .delete()
    .eq("id", input.id);

  if (error) {
    return { success: false, error: "Failed to delete the address." };
  }
  for (const path of REVALIDATE_PATHS) revalidatePath(path);
  return { success: true };
}
