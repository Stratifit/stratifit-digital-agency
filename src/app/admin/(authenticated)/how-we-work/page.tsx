// ============================================================================
// Stratifit — Admin: How We Work Section
// ============================================================================

import { HowWeWorkSectionAdmin } from "@/components/cms/admin/HowWeWorkSectionAdmin";

export default function HowWeWorkAdminPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-white">How We Work Section</h1>
        <p className="font-body text-body-md text-neutral-400 mt-2">
          Manage the CMS-driven, multilingual How We Work process steps.
        </p>
      </div>
      <HowWeWorkSectionAdmin />
    </div>
  );
}
