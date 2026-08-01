"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serviceSchema, type ServiceFormValues } from "./schemas";

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

export async function createService(
  input: ServiceFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = serviceSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("services").insert(parsed.data);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A service with this slug already exists." };
    }
    return { success: false, error: "Failed to create the service." };
  }

  revalidatePath("/");
  revalidatePath("/admin/content/services");
  return { success: true };
}

export async function updateService(
  slug: string,
  input: ServiceFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = serviceSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("services")
    .update(parsed.data)
    .eq("slug", slug);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A service with this slug already exists." };
    }
    return { success: false, error: "Failed to update the service." };
  }

  revalidatePath("/");
  revalidatePath("/admin/content/services");
  return { success: true };
}

export async function deleteService(slug: string): Promise<void> {
  const supabase = await requireAdmin();

  await supabase.from("services").delete().eq("slug", slug);

  revalidatePath("/");
  revalidatePath("/admin/content/services");
}
