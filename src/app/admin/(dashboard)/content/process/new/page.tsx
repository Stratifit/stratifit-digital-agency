import { ProcessStepForm } from "@/components/admin/process-step-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default function NewProcessStepPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="New Process Step"
        description="Add a step to the How We Work section."
      />
      <FormCard>
        <ProcessStepForm step={null} isNew />
      </FormCard>
    </div>
  );
}
