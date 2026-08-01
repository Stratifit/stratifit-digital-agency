import { ContentForm } from "@/components/admin/content/content-form";

export default function NewPricingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">New Pricing Plan</h1>
        <p className="mt-1 text-sm text-text-secondary">Create a new pricing package or tier.</p>
      </div>
      <div className="rounded-radius-md border border-border bg-surface p-6">
        <ContentForm type="pricing" />
      </div>
    </div>
  );
}
