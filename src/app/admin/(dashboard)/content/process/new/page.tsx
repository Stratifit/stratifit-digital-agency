import { ProcessStepForm } from "@/components/admin/process-step-form";

export default function NewProcessStepPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          New Process Step
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Add a step to the How We Work section.
        </p>
      </div>
      <div className="rounded-md border border-border bg-surface p-6">
        <ProcessStepForm step={null} isNew />
      </div>
    </div>
  );
}
