import { ContentForm } from "@/components/admin/content/content-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default function NewFaqPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="New FAQ"
        description="Create a new frequently asked question."
      />
      <FormCard>
        <ContentForm type="faq" />
      </FormCard>
    </div>
  );
}
