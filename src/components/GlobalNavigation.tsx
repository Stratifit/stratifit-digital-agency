// ============================================================================
// Stratifit — Global Navigation Header
// Server component that fetches the global navigation header from Supabase
// and renders the client-side NavigationHeaderSection.
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";
import { getNavigationHeader } from "@/lib/cms/navigation-header";
import { NavigationHeaderSection } from "@/components/cms/sections/NavigationHeaderSection";

interface GlobalNavigationProps {
  locale: CmsLanguage;
}

export async function GlobalNavigation({ locale }: GlobalNavigationProps) {
  try {
    const initialData = await getNavigationHeader();

    if (!initialData) {
      return null;
    }

    return (
      <NavigationHeaderSection
        payload={{}}
        blocks={[]}
        locale={locale}
        initialData={initialData}
      />
    );
  } catch (err) {
    console.error("[GlobalNavigation] Failed to load navigation header:", err);
    return null;
  }
}
