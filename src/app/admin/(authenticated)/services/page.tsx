// ============================================================================
// Stratifit — Admin: Services Section
// ============================================================================

import { ServicesSectionAdmin } from "@/components/cms/admin/ServicesSectionAdmin";

export default function ServicesAdminPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-white">Services Section</h1>
        <p className="font-body text-body-md text-neutral-400 mt-2">
          Manage the CMS-driven, multilingual services section and service cards.
        </p>
      </div>
      <ServicesSectionAdmin />
    </div>
  );
}
