import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminMediaRow {
  id: string;
  bucket_name: string;
  storage_path: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text_translations: Record<string, string> | null;
  category: string;
  is_public: boolean;
  created_at: string;
}

export async function getAdminMedia(): Promise<AdminMediaRow[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("media_assets")
    .select(
      "id, bucket_name, storage_path, original_filename, mime_type, file_size_bytes, width, height, alt_text_translations, category, is_public, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []) as AdminMediaRow[];
}

export async function getAdminMediaItem(
  id: string
): Promise<AdminMediaRow | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("media_assets")
    .select(
      "id, bucket_name, storage_path, original_filename, mime_type, file_size_bytes, width, height, alt_text_translations, category, is_public, created_at"
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as AdminMediaRow;
}