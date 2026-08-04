import { ContentForm } from "@/components/admin/content/content-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default function NewPricingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="New Pricing Plan"
        description="Create a new pricing package or tier."
      />
      <FormCard>
        <ContentForm type="pricing" />
      </FormCard>
    </div>
  );
}
