// ============================================================================
// Stratifit — Locale Constants and Validation
// Shared between client, server, and middleware.
// ============================================================================

import type { CmsLanguage } from "@/lib/types/cms";

/** Supported content languages */
export const SUPPORTED_LOCALES: CmsLanguage[] = ["en", "fr", "de", "es"];

/** Default locale when none is specified or stored */
export const DEFAULT_LOCALE: CmsLanguage = "en";

/** Cookie name used to persist the user's locale preference */
export const LOCALE_COOKIE_NAME = "stratifit-locale";

/** Validate an arbitrary string against supported locales */
export function isValidLocale(value: string): value is CmsLanguage {
  return (SUPPORTED_LOCALES as string[]).includes(value);
}
