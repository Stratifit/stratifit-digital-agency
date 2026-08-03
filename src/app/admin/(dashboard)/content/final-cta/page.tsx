import { getAdminFinalCta } from "@/features/final-cta/queries";
import { FinalCtaForm } from "@/components/admin/final-cta-form";

export default async function AdminFinalCtaPage() {
  const finalCta = await getAdminFinalCta();

  if (!finalCta) {
    return (
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Final CTA
        </h1>
        <p className="text-sm text-text-secondary">
          No final CTA record found. Run the database seed to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Final CTA
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          The closing call-to-action shown at the end of key pages.
        </p>
      </div>
      <FinalCtaForm initial={finalCta} />
    </div>
  );
}
