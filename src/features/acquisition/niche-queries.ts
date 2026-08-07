import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseJsonArray } from "@/lib/json";

export interface AcquisitionNicheStat {
  value: string;
  label_translations: Record<string, string> | null;
  hint_translations?: Record<string, string> | null;
}

export interface PublicAcquisitionNiche {
  id: string;
  slug: string;
  emoji: string;
  accent: string;
  label_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  why_title_translations: Record<string, string> | null;
  why_description_translations: Record<string, string> | null;
  stats: AcquisitionNicheStat[];
  is_visible: boolean;
  display_order: number;
}

const NICHES_SELECT =
  "id, slug, emoji, accent, label_translations, description_translations, why_title_translations, why_description_translations, stats, is_visible, display_order";

/** Guarded read of a JSONB object column into a string record. */
function translations(
  value: unknown
): Record<string, string> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  const record = value as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(record)) {
    if (typeof val === "string") {
      out[key] = val;
    }
  }
  return out;
}

type NicheRow = {
  id: string;
  slug: string;
  emoji: string;
  accent: string;
  label_translations: unknown;
  description_translations: unknown;
  why_title_translations: unknown;
  why_description_translations: unknown;
  stats: unknown;
  is_visible: boolean;
  display_order: number;
};

function toPublicNiche(row: NicheRow): PublicAcquisitionNiche {
  return {
    id: row.id,
    slug: row.slug,
    emoji: row.emoji,
    accent: row.accent,
    label_translations: translations(row.label_translations),
    description_translations: translations(row.description_translations),
    why_title_translations: translations(row.why_title_translations),
    why_description_translations: translations(row.why_description_translations),
    stats: parseJsonArray<AcquisitionNicheStat>(row.stats) ?? [],
    is_visible: row.is_visible,
    display_order: row.display_order,
  };
}

export async function getPublicAcquisitionNiches(): Promise<
  PublicAcquisitionNiche[]
> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("acquisition_niches")
    .select(NICHES_SELECT)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []).map((row) => toPublicNiche(row as unknown as NicheRow));
}

export async function getPublicAcquisitionNiche(
  slug: string
): Promise<PublicAcquisitionNiche | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("acquisition_niches")
    .select(NICHES_SELECT)
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return toPublicNiche(data as unknown as NicheRow);
}

export interface AdminAcquisitionNiche extends PublicAcquisitionNiche {
  created_at: string;
  updated_at: string;
}

export async function getAdminAcquisitionNiches(): Promise<
  AdminAcquisitionNiche[]
> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("acquisition_niches")
    .select(`${NICHES_SELECT}, created_at, updated_at`)
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []).map((row) => ({
    ...toPublicNiche(row as unknown as NicheRow),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export async function getAdminAcquisitionNiche(
  slug: string
): Promise<AdminAcquisitionNiche | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("acquisition_niches")
    .select(`${NICHES_SELECT}, created_at, updated_at`)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    ...toPublicNiche(data as unknown as NicheRow),
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}
