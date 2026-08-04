import { getAdminFinalCta } from "@/features/final-cta/queries";
import { FinalCtaForm } from "@/components/admin/final-cta-form";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminFinalCtaPage() {
  const finalCta = await getAdminFinalCta();

  if (!finalCta) {
    return (
      <AdminPageHeader
        title="Final CTA"
        description="No final CTA record found. Run the database seed to create one."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Final CTA"
        description="The closing call-to-action shown at the end of key pages."
      />
      <FinalCtaForm initial={finalCta} />
    </div>
  );
}
