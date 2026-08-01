import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content/content-form";
import { getContentItem } from "@/features/content/get-admin-item";

export default async function EditPricingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getContentItem("pricing", slug);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Edit Pricing Plan</h1>
        <p className="mt-1 text-sm text-text-secondary">{slug}</p>
      </div>
      <div className="rounded-radius-md border border-border bg-surface p-6">
        <ContentForm type="pricing" id={slug} initial={item} />
      </div>
    </div>
  );
}
