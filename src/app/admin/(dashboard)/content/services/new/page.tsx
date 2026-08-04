import { ServiceForm } from "@/components/admin/services/service-form";
import { emptyServiceForm } from "@/features/services/schemas";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default function NewServicePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="New Service"
        description="Create a new service offering."
      />
      <FormCard>
        <ServiceForm initial={emptyServiceForm()} />
      </FormCard>
    </div>
  );
}
