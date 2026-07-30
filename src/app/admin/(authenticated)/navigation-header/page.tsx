// ============================================================================
// Stratifit — Admin Navigation Header Page
// ============================================================================

import { NavigationHeaderAdmin } from "@/components/cms/admin/NavigationHeaderAdmin";

export default function AdminNavigationHeaderPage() {
  return (
    <div className="p-6 max-w-6xl">
      <h1 className="font-display text-heading-xl text-white mb-2">
        Navigation Header
      </h1>
      <p className="font-body text-body-md text-neutral-400 mb-8">
        Manage the global navigation header, mobile menu, and chat overlay with
        multilingual support.
      </p>

      <NavigationHeaderAdmin />
    </div>
  );
}
