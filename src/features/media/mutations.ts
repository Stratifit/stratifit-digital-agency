"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMediaPublicUrl } from "@/lib/media";

export type MediaActionResult =
  | { success: true; data: { id: string; url: string } }
  | { success: false; error: string };

export type MediaUpdateResult =
  | { success: true }
  | { success: false; error: string };

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const BUCKET_CATEGORIES: Record<string, string> = {
  logos: "logo",
  "portfolio-images": "portfolio",
  "insights-images": "insight",
  "general-media": "general",
};

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uploadMediaAsset(
  formData: FormData
): Promise<MediaActionResult> {
  const file = formData.get("file") as File | null;
  const bucket = String(formData.get("bucket") ?? "general-media");
  const altText = String(formData.get("alt_text") ?? "").trim();

  if (!file) {
    return { success: false, error: "No file provided." };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();

    // Generate a unique storage path
    const timestamp = Date.now();
    const safeName = sanitizeFilename(file.name);
    const extension = safeName.includes(".") ? safeName.split(".").pop() : "bin";
    const baseName = safeName.includes(".")
      ? safeName.slice(0, safeName.lastIndexOf("."))
      : safeName;
    const storagePath = `${baseName}-${timestamp}.${extension}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return {
        success: false,
        error: "Failed to upload file to storage. Please try again.",
      };
    }

    // Insert metadata record
    const { data, error: dbError } = await supabase
      .from("media_assets")
      .insert({
        bucket_name: bucket,
        storage_path: storagePath,
        original_filename: file.name,
        mime_type: file.type,
        file_size_bytes: file.size,
        alt_text_translations: altText ? { en: altText } : {},
        category: BUCKET_CATEGORIES[bucket] ?? "general",
        is_public: true,
      })
      .select("id")
      .single();

    if (dbError || !data) {
      // Attempt to clean up the uploaded file if metadata insert fails
      await supabase.storage.from(bucket).remove([storagePath]);
      return {
        success: false,
        error: "Failed to save media metadata. Please try again.",
      };
    }

    revalidatePath("/admin/media");

    const url = getMediaPublicUrl(bucket, storagePath) ?? "";
    return { success: true, data: { id: data.id, url } };
  } catch {
    // Never let a thrown error escape a server action: the caller must always
    // receive a result it can render (e.g. request body limits, network
    // failures, unexpected storage errors).
    return {
      success: false,
      error: "Upload failed unexpectedly. Please try again.",
    };
  }
}

export async function deleteMediaAsset(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();

  // Get the asset record to know bucket and path
  const { data: asset } = await supabase
    .from("media_assets")
    .select("bucket_name, storage_path")
    .eq("id", id)
    .single();

  if (!asset) {
    return;
  }

  // Delete from storage (continue with metadata deletion even if this fails;
  // orphaned files can be cleaned up later)
  await supabase.storage.from(asset.bucket_name).remove([asset.storage_path]);

  // Delete metadata record
  await supabase.from("media_assets").delete().eq("id", id);

  revalidatePath("/admin/media");
}

export async function updateMediaAltText(
  id: string,
  altText: string
): Promise<MediaUpdateResult> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("media_assets")
    .update({
      alt_text_translations: { en: altText.trim() },
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: "Failed to update alt text." };
  }

  revalidatePath("/admin/media");
  return { success: true };
}