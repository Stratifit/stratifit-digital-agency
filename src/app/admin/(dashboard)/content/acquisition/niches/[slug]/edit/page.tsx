import { notFound } from "next/navigation";
import {
  getAdminAcquisitionNiche,
  type AdminAcquisitionNiche,
} from "@/features/acquisition/niche-queries";
import { NicheForm } from "@/components/admin/niche-form";
import type { AcquisitionNicheFormValues } from "@/features/acquisition/niche-schemas";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

function translations(
  v: Record<string, string> | null | undefined
): { en: string; de: string; fr: string; es: string } {
  const record = v ?? {};
  return {
    en: record.en ?? "",
    de: record.de ?? "",
    fr: record.fr ?? "",
    es: record.es ?? "",
  };
}

function toFormValues(niche: AdminAcquisitionNiche): AcquisitionNicheFormValues {
  return {
    slug: niche.slug,
    emoji: niche.emoji,
    accent: niche.accent,
    label_translations: translations(niche.label_translations),
    description_translations: translations(niche.description_translations),
    why_title_translations: translations(niche.why_title_translations),
    why_description_translations: translations(
      niche.why_description_translations
    ),
    stats: (niche.stats ?? []).map((stat) => ({
      value: stat.value,
      label_translations: translations(stat.label_translations),
      hint_translations: translations(stat.hint_translations),
    })),
    is_visible: niche.is_visible,
    display_order: niche.display_order,
  };
}

export default async function EditAcquisitionNichePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const niche = await getAdminAcquisitionNiche(slug);

  if (!niche) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="Edit Niche" description={slug} />
      <FormCard>
        <NicheForm slug={slug} initial={toFormValues(niche)} />
      </FormCard>
    </div>
  );
}
