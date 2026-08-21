import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/admin/services/service-form";
import type { ServiceFormValues } from "@/features/services/schemas";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

function translations(
  v: unknown
): { en: string; de: string; fr: string; es: string } {
  const record = (v as Record<string, string> | null | undefined) ?? {};
  return {
    en: record.en ?? "",
    de: record.de ?? "",
    fr: record.fr ?? "",
    es: record.es ?? "",
  };
}

function stringList(v: unknown): string[] {
  return Array.isArray(v) ? v.map((item) => String(item)) : [];
}

function stringLists(v: unknown): {
  en: string[];
  de: string[];
  fr: string[];
  es: string[];
} {
  const record = (v as Record<string, unknown> | null | undefined) ?? {};
  return {
    en: stringList(record.en),
    de: stringList(record.de),
    fr: stringList(record.fr),
    es: stringList(record.es),
  };
}

function toFormValues(data: Record<string, unknown>): ServiceFormValues {
  return {
    slug: String(data.slug ?? ""),
    title_translations: translations(data.title_translations),
    short_description_translations: translations(
      data.short_description_translations
    ),
    icon_name: (data.icon_name as string | null) ?? "",
    deliverables_translations: stringLists(data.deliverables_translations),
    cta_label_translations: translations(data.cta_label_translations),
    cta_url: (data.cta_url as string | null) ?? "",
    cta_style: (data.cta_style as "full" | "compact" | null) ?? "full",
    seo_title_translations: translations(data.seo_title_translations),
    seo_description_translations: translations(data.seo_description_translations),
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
