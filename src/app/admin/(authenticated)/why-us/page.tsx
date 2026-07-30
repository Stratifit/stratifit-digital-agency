// ============================================================================
// Stratifit — Admin: Why Us Section
// ============================================================================

import { WhyUsSectionAdmin } from "@/components/cms/admin/WhyUsSectionAdmin";

export default function WhyUsAdminPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-white">Why Us Section</h1>
        <p className="font-body text-body-md text-neutral-400 mt-2">
          Manage the CMS-driven, multilingual Why Us feature cards.
        </p>
      </div>
      <WhyUsSectionAdmin />
    </div>
  );
}
