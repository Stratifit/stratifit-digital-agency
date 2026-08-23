import { ContentForm } from "@/components/admin/content/content-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";
import {
  getAdminServices,
  getAdminTestimonials,
} from "@/features/content/admin-queries";

export default async function NewPortfolioPage() {
  const services = await getAdminServices();
  const testimonials = (await getAdminTestimonials()).map((t) => ({
    id: t.id,
    label: t.person_name,
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="New Portfolio Project"
        description="Create a new case study or project showcase."
      />
      <FormCard>
        <ContentForm type="portfolio" services={services} testimonials={testimonials} />
      </FormCard>
    </div>
  );
}
