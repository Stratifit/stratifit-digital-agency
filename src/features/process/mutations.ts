"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { processStepSchema, type ProcessStepFormValues } from "./schemas";

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

async function requireAdmin() {
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
  return supabase;
}

function parse(input: ProcessStepFormValues) {
  return processStepSchema.safeParse(input);
}

function formatError(error: { code?: string }) {
  if (error.code === "23505") {
    return "A step with this key already exists.";
  }
  return "Failed to save the step. Please try again.";
}

export async function createProcessStep(
  input: ProcessStepFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = parse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("process_steps").insert({
    step_key: parsed.data.step_key,
    number: parsed.data.number,
    title_translations: parsed.data.title_translations,
    description_translations: parsed.data.description_translations,
    icon_name: parsed.data.icon_name,
    display_order: parsed.data.display_order,
    is_visible: parsed.data.is_visible,
  });

  if (error) {
    return { success: false, error: formatError(error) };
  }

  revalidatePath("/");
  revalidatePath("/admin/content/process");
  return { success: true };
}

export async function updateProcessStep(
  stepKey: string,
  input: ProcessStepFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = parse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("process_steps")
    .update({
      number: parsed.data.number,
      title_translations: parsed.data.title_translations,
      description_translations: parsed.data.description_translations,
      icon_name: parsed.data.icon_name,
      display_order: parsed.data.display_order,
      is_visible: parsed.data.is_visible,
    })
    .eq("step_key", stepKey);

  if (error) {
    return { success: false, error: formatError(error) };
  }

  revalidatePath("/");
  revalidatePath("/admin/content/process");
  return { success: true };
}

export async function deleteProcessStep(stepKey: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("process_steps").delete().eq("step_key", stepKey);
  revalidatePath("/");
  revalidatePath("/admin/content/process");
}
