// ============================================================================
// Stratifit — Admin: Acquisition / Buy a Business Section
// ============================================================================

import { AcquisitionSectionAdmin } from "@/components/cms/admin/AcquisitionSectionAdmin";

export default function AcquisitionAdminPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-white">Acquisition Section</h1>
        <p className="font-body text-body-md text-neutral-400 mt-2">
          Manage the CMS-driven, multilingual Buy a Business / acquisition section.
        </p>
      </div>
      <AcquisitionSectionAdmin />
    </div>
  );
}
