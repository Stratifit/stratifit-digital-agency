import { notFound } from "next/navigation";
import { getAdminProcessStep } from "@/features/process/admin-queries";
import { ProcessStepForm } from "@/components/admin/process-step-form";

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
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Edit Process Step
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {step.step_key} · step {step.number}
        </p>
      </div>
      <div className="rounded-radius-md border border-border bg-surface p-6">
        <ProcessStepForm step={step} isNew={false} />
      </div>
    </div>
  );
}
