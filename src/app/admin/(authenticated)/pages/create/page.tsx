// ============================================================================
// Stratifit — Admin Create Page
// ============================================================================

import { createPage } from "@/app/admin/(authenticated)/pages/actions";
import { PageForm } from "@/components/admin/PageForm";

export default function AdminCreatePagePage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="font-display text-heading-xl text-white mb-1">
        Create Page
      </h1>
      <p className="font-body text-body-md text-neutral-400 mb-8">
        Add a new page to the CMS.
      </p>

      <PageForm mode="create" onSubmit={createPage} />
    </div>
  );
}
