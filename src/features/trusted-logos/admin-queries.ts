import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminTrustedLogo {
  id: string;
  name: string;
  media_id: string | null;
  image_url: string | null;
  href: string | null;
  display_order: number;
  is_visible: boolean;
  is_verified: boolean;
  created_at: string;
}

export async function getAdminTrustedLogos(): Promise<AdminTrustedLogo[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("trusted_logos")
    .select("id, name, media_id, image_url, href, display_order, is_visible, is_verified, created_at")
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as AdminTrustedLogo[];
}
