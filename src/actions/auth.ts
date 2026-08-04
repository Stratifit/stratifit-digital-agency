"use server";
import type { ActionResult } from "@/types/action-result";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signInSchema } from "@/features/auth/schemas";

export interface CurrentAdmin {
  user_id: string;
  email: string;
  role: string;
  display_name: string | null;
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check your input.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: "Invalid email or password." };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("user_id, role, display_name, status")
    .eq("user_id", user.id)
    .single();

  if (error || !admin || admin.status !== "active") {
    return null;
  }

  return {
    user_id: admin.user_id,
    email: user.email ?? "",
    role: admin.role,
    display_name: admin.display_name,
  };
}
