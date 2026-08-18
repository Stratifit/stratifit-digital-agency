"use server";
import type { ActionResult } from "@/types/action-result";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  whyChooseUsItemsSchema,
  type WhyChooseUsItemFormValues,
} from "./schemas";


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

export async function updateWhyChooseUsItems(
  items: WhyChooseUsItemFormValues[]
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = whyChooseUsItemsSchema.safeParse(items);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
    };
  }

  const { error } = await supabase
    .from("why_choose_us")
    .upsert(
      { singleton_key: true, items: parsed.data },
      { onConflict: "singleton_key" }
    );

  if (error) {
    return { success: false, error: "Failed to save the features." };
  }

  revalidatePath("/");
  revalidatePath("/admin/content/why-choose-us");
  return { success: true };
}
