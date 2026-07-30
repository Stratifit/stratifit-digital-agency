// ============================================================================
// Stratifit — Admin: Insights Section
// ============================================================================

import { InsightsSectionAdmin } from "@/components/cms/admin/InsightsSectionAdmin";

export default function InsightsAdminPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-white">Insights Section</h1>
        <p className="font-body text-body-md text-neutral-400 mt-2">
          Manage the CMS-driven, multilingual Insights &amp; Expertise cards.
        </p>
      </div>
      <InsightsSectionAdmin />
    </div>
  );
}
