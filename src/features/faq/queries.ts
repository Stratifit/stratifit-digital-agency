import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicFaq {
  id: string;
  question_translations: Record<string, string> | null;
  answer_translations: Record<string, string> | null;
  category: string;
}

export async function getPublicFaqs(): Promise<PublicFaq[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("faqs")
    .select("id, question_translations, answer_translations, category")
    .eq("status", "published")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as PublicFaq[];
}
