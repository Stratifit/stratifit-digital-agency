// ============================================================================
// Stratifit — Admin: Pricing Section
// ============================================================================

import { PricingSectionAdmin } from "@/components/cms/admin/PricingSectionAdmin";

export default function PricingAdminPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-white">Pricing Section</h1>
        <p className="font-body text-body-md text-neutral-400 mt-2">
          Manage the CMS-driven, multilingual Service Packages section.
        </p>
      </div>
      <PricingSectionAdmin />
    </div>
  );
}
