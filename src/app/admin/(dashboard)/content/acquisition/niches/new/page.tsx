import { NicheForm } from "@/components/admin/niche-form";
import { emptyAcquisitionNicheForm } from "@/features/acquisition/niche-schemas";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default function NewAcquisitionNichePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="New Niche"
        description="Create a new acquisition niche."
      />
      <FormCard>
        <NicheForm initial={emptyAcquisitionNicheForm()} />
      </FormCard>
    </div>
  );
}
