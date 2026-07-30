// ============================================================================
// Stratifit — Client-Side Locale Helper
// Persists the user's locale preference in a cookie for server-side reads.
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";
import { LOCALE_COOKIE_NAME } from "@/lib/locale";

/** Store the locale preference in a first-party cookie. */
export function setLocaleCookie(locale: CmsLanguage): void {
  if (typeof document === "undefined") return;

  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
