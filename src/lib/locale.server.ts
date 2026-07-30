// ============================================================================
// Stratifit — Server-Side Locale Helper
// Reads the user's locale preference from cookies for use in Server Components.
// ============================================================================

import { cookies } from "next/headers";
import type { CmsLanguage } from "@/lib/types/cms";
import { DEFAULT_LOCALE, isValidLocale, LOCALE_COOKIE_NAME } from "@/lib/locale";

/** Read the locale cookie and return a validated CmsLanguage. */
export async function getServerLocale(): Promise<CmsLanguage> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  if (value && isValidLocale(value)) {
    return value;
  }

  return DEFAULT_LOCALE;
}
