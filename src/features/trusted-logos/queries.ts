import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicTrustedLogo {
  id: string;
  name: string;
  media_id: string;
  href: string | null;
}

export async function getPublicTrustedLogos(): Promise<PublicTrustedLogo[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("trusted_logos")
    .select("id, name, media_id, href")
    .eq("is_visible", true)
    .eq("is_verified", true)
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as PublicTrustedLogo[];
}
