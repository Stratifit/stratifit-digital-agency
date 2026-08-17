"use server";
import type { ActionResult } from "@/types/action-result";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/seo";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
} from "@/features/auth/schemas";

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

/**
 * Starts the Google OAuth flow for admin sign-in. On success the user is
 * redirected to Google, then back through /auth/callback which exchanges the
 * code and sends them to the dashboard. Google accounts must map to an active
 * `admin_users` row to pass `getCurrentAdmin`.
 */
export async function signInWithGoogle(): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/admin/dashboard`,
    },
  });

  if (error) {
    return {
      success: false,
      error: "Unable to start Google sign-in. Please try again.",
    };
  }

  if (!data.url) {
    return {
      success: false,
      error: "Unable to start Google sign-in. Please try again.",
    };
  }

  redirect(data.url);
}

/** Sends a password-reset email for the given address (no account enumeration). */
export async function requestPasswordReset(input: {
  email: string;
}): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please enter a valid email address.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/admin/reset-password`,
  });

  if (error) {
    return { success: false, error: "Unable to send the reset email. Please try again." };
  }

  return { success: true };
}

/** Sets a new password from the recovery session established via the reset link. */
export async function resetPassword(input: {
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check your new password.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: "Unable to reset your password. Please try again." };
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
