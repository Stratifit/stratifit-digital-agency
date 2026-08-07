import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseJsonArray } from "@/lib/json";
import type { WhyChooseUsItem } from "@/features/why-choose-us/queries";
import { WhyChooseUsForm } from "@/components/admin/why-choose-us-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

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
  return parseJsonArray<WhyChooseUsItem>(data.items) ?? [];
}

export default async function AdminWhyChooseUsPage() {
  const items = await getItems();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title="Why Choose Us — Features"
        description={
          <>
            Edit the feature cards (icon, title, description, and stat) shown in
            the Why Choose Us section. The section heading is managed under{" "}
            <span className="text-text-primary">Sections</span>.
          </>
        }
      />
      <FormCard>
        <WhyChooseUsForm items={items} />
      </FormCard>
    </div>
  );
}
