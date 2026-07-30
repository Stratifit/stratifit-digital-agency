// ============================================================================
// Stratifit — Admin: Testimonials Section
// ============================================================================

import { TestimonialsSectionAdmin } from "@/components/cms/admin/TestimonialsSectionAdmin";

export default function TestimonialsAdminPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-white">Testimonials Section</h1>
        <p className="font-body text-body-md text-neutral-400 mt-2">
          Manage the CMS-driven, multilingual What Our Clients Say section.
        </p>
      </div>
      <TestimonialsSectionAdmin />
    </div>
  );
}
