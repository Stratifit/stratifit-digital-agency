import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/admin/services/service-form";
import type { ServiceFormValues } from "@/features/services/schemas";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";
import { getAdminServicePage } from "@/features/service-pages/queries";
import { toServicePageFormValues } from "@/features/service-pages/form-values";
import { ServicePageForm } from "@/components/admin/service-page-form";

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

  const page = await getAdminServicePage(slug);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader title="Edit Service" description={slug} />
      <FormCard>
        <ServiceForm slug={slug} initial={toFormValues(data)} />
      </FormCard>

      <div className="border-t border-border pt-6">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-text-primary">
            Service Page (frontend sections)
          </h2>
          <a
            href={`/services/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-button border border-border bg-card-dark px-3.5 py-2 text-sm text-text-secondary transition-colors hover:border-primary/30 hover:text-text-primary"
          >
            View page ↗
          </a>
        </div>
        <p className="mb-4 text-sm text-text-secondary">
          Edit the hero stats, Why It Matters numbers, and every other section
          of the public service page.
        </p>
        {page ? (
          <FormCard>
            <ServicePageForm slug={slug} initial={toServicePageFormValues(page)} />
          </FormCard>
        ) : (
          <FormCard>
            <p className="text-sm text-text-secondary">
              This service does not have a dedicated service page yet. Service
              pages are managed separately.
            </p>
            <Link
              href="/admin/content/service-pages"
              className="mt-3 inline-flex rounded-sm bg-primary px-3 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-bright"
            >
              Manage Service Pages
            </Link>
          </FormCard>
        )}
      </div>
    </div>
  );
}
