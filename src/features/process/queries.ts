import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicProcessStep {
  step_key: string;
  number: number;
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  icon_name: string | null;
}

export async function getPublicProcessSteps(): Promise<PublicProcessStep[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("process_steps")
    .select("step_key, number, title_translations, description_translations, icon_name")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as PublicProcessStep[];
}
