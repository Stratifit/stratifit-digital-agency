// ============================================================================
// Stratifit — Admin: Hero Section
// ============================================================================

import { HeroSectionAdmin } from "@/components/cms/admin/HeroSectionAdmin";

export default function HeroAdminPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-white">Hero Section</h1>
        <p className="font-body text-body-md text-neutral-400 mt-2">
          Manage the CMS-driven, multilingual hero section content.
        </p>
      </div>
      <HeroSectionAdmin />
    </div>
  );
}
