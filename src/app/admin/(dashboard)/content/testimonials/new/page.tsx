import { ContentForm } from "@/components/admin/content/content-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default function NewTestimonialPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="New Testimonial"
        description="Create a new customer testimonial."
      />
      <FormCard>
        <ContentForm type="testimonials" />
      </FormCard>
    </div>
  );
}
