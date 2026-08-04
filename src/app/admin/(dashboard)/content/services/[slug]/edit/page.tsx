import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/admin/services/service-form";
import type { ServiceFormValues } from "@/features/services/schemas";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

function toFormValues(data: Record<string, unknown>): ServiceFormValues {
  return {
    slug: String(data.slug ?? ""),
    title_translations: (data.title_translations as Record<string, string>) ?? { en: "" },
    short_description_translations:
      (data.short_description_translations as Record<string, string>) ?? { en: "" },
    icon_name: (data.icon_name as string | null) ?? "",
    cta_label_translations:
      (data.cta_label_translations as Record<string, string>) ?? { en: "" },
    cta_url: (data.cta_url as string | null) ?? "",
    display_order: Number(data.display_order ?? 0),
    is_featured: Boolean(data.is_featured),
    is_visible: Boolean(data.is_visible),
    status: (data.status as "draft" | "published" | "archived") ?? "draft",
  };
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="Edit Service" description={slug} />
      <FormCard>
        <ServiceForm slug={slug} initial={toFormValues(data)} />
      </FormCard>
    </div>
  );
}
