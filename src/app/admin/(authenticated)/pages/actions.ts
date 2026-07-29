"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pageSchema } from "@/lib/cms/validation";

type ActionResult = { error: string } | { success: true };

export async function createPage(formData: FormData): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const raw = {
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    language: formData.get("language") as string,
    metaTitle: formData.get("metaTitle") as string || null,
    metaDescription: formData.get("metaDescription") as string || null,
    published: formData.get("published") === "true",
  };

  const parsed = pageSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return { error: Object.values(fieldErrors).flat().join(", ") || "Invalid form data" };
  }

  const { error } = await supabase.from("pages").insert({
    slug: parsed.data.slug,
    title: parsed.data.title,
    language: parsed.data.language,
    meta_title: parsed.data.metaTitle ?? null,
    meta_description: parsed.data.metaDescription ?? null,
    published: parsed.data.published,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/pages");
  return { success: true };
}

export async function updatePage(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const raw = {
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    language: formData.get("language") as string,
    metaTitle: formData.get("metaTitle") as string || null,
    metaDescription: formData.get("metaDescription") as string || null,
    published: formData.get("published") === "true",
  };

  const parsed = pageSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return { error: Object.values(fieldErrors).flat().join(", ") || "Invalid form data" };
  }

  const { error } = await supabase
    .from("pages")
    .update({
      slug: parsed.data.slug,
      title: parsed.data.title,
      language: parsed.data.language,
      meta_title: parsed.data.metaTitle ?? null,
      meta_description: parsed.data.metaDescription ?? null,
      published: parsed.data.published,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${id}`);
  return { success: true };
}

export async function deletePage(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/pages");
  return { success: true };
}
