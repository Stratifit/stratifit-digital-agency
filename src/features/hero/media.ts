import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { getMediaPublicUrl } from "@/lib/media";

/** A trusted-by logo item as stored in `hero.trusted_by` (JSONB). */
export interface TrustedByMediaItem {
  name: string;
  icon: string;
  /** Media-library id of an uploaded logo image (overrides the icon). */
  media_id?: string | null;
  /** Resolved public URL for the uploaded logo (display convenience). */
  image_url?: string | null;
}

/**
 * Resolves each item's `media_id` to a public storage URL (bucket + path),
 * so the CMS editor and the public hero can render uploaded logo images.
 * Items without a media reference keep `image_url` as null.
 */
export async function resolveTrustedByImages<T extends TrustedByMediaItem>(
  supabase: SupabaseClient<Database>,
  items: T[]
): Promise<T[]> {
  const mediaIds = [
    ...new Set(items.map((item) => item.media_id).filter(Boolean)),
  ] as string[];

  if (mediaIds.length === 0) {
    return items.map((item) => ({ ...item, image_url: null }));
  }

  const { data } = await supabase
    .from("media_assets")
    .select("id, bucket_name, storage_path")
    .in("id", mediaIds);

  const urlById = new Map(
    (data ?? []).map((media) => [
      media.id,
      getMediaPublicUrl(media.bucket_name, media.storage_path),
    ])
  );

  return items.map((item) =>
    item.media_id
      ? { ...item, image_url: urlById.get(item.media_id) ?? null }
      : { ...item, image_url: null }
  );
}
