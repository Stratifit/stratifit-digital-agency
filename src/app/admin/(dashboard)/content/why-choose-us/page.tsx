import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WhyChooseUsItem } from "@/features/why-choose-us/queries";
import { WhyChooseUsForm } from "@/components/admin/why-choose-us-form";

async function getItems(): Promise<WhyChooseUsItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("why_choose_us")
    .select("items")
    .eq("singleton_key", true)
    .single();
  if (error || !data) {
    return [];
  }
  return (data.items as unknown as WhyChooseUsItem[]) ?? [];
}

export default async function AdminWhyChooseUsPage() {
  const items = await getItems();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Why Choose Us — Features
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Edit the feature cards (icon, title, description, and stat) shown in
          the Why Choose Us section. The section heading is managed under{" "}
          <span className="text-text-primary">Sections</span>.
        </p>
      </div>
      <div className="rounded-md border border-border bg-surface p-6">
        <WhyChooseUsForm items={items} />
      </div>
    </div>
  );
}
