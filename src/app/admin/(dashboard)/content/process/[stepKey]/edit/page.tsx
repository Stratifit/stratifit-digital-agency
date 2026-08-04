import { notFound } from "next/navigation";
import { getAdminProcessStep } from "@/features/process/admin-queries";
import { ProcessStepForm } from "@/components/admin/process-step-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function EditProcessStepPage({
  params,
}: {
  params: Promise<{ stepKey: string }>;
}) {
  const { stepKey } = await params;
  const step = await getAdminProcessStep(stepKey);
  if (!step) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Edit Process Step"
        description={`${step.step_key} · step ${step.number}`}
      />
      <FormCard>
        <ProcessStepForm step={step} isNew={false} />
      </FormCard>
    </div>
  );
}
