"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

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
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

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
