import { ServiceForm } from "@/components/admin/services/service-form";
import { emptyServiceForm } from "@/features/services/schemas";

export default function NewServicePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          New Service
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Create a new service offering.
        </p>
      </div>
      <div className="rounded-radius-md border border-border bg-surface p-6">
        <ServiceForm initial={emptyServiceForm()} />
      </div>
    </div>
  );
}
