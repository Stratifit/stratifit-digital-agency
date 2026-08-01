import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminProcessStep {
  step_key: string;
  number: number;
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  icon_name: string | null;
  display_order: number;
  is_visible: boolean;
}

export async function getAdminProcessSteps(): Promise<AdminProcessStep[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("process_steps")
    .select(
      "step_key, number, title_translations, description_translations, icon_name, display_order, is_visible"
    )
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as AdminProcessStep[];
}

export async function getAdminProcessStep(
  stepKey: string
): Promise<AdminProcessStep | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("process_steps")
    .select(
      "step_key, number, title_translations, description_translations, icon_name, display_order, is_visible"
    )
    .eq("step_key", stepKey)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as AdminProcessStep;
}
