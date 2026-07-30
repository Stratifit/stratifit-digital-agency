// ============================================================================
// Stratifit — Admin: FAQ Section
// ============================================================================

import { FaqSectionAdmin } from "@/components/cms/admin/FaqSectionAdmin";

export default function FaqAdminPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-white">FAQ Section</h1>
        <p className="font-body text-body-md text-neutral-400 mt-2">
          Manage the CMS-driven, multilingual Frequently Asked Questions section.
        </p>
      </div>
      <FaqSectionAdmin />
    </div>
  );
}
