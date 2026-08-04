import { ContentForm } from "@/components/admin/content/content-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default function NewPortfolioPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="New Portfolio Project"
        description="Create a new case study or project showcase."
      />
      <FormCard>
        <ContentForm type="portfolio" />
      </FormCard>
    </div>
  );
}
