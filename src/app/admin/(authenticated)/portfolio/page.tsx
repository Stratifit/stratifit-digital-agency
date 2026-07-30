// ============================================================================
// Stratifit — Admin: Portfolio Section
// ============================================================================

import { PortfolioSectionAdmin } from "@/components/cms/admin/PortfolioSectionAdmin";

export default function PortfolioAdminPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-white">Portfolio Section</h1>
        <p className="font-body text-body-md text-neutral-400 mt-2">
          Manage the CMS-driven, multilingual portfolio / Our Work section.
        </p>
      </div>
      <PortfolioSectionAdmin />
    </div>
  );
}
