/**
 * Shared cookie-consent record handling.
 *
 * Single source of truth for reading the visitor's consent choices. The
 * cookie banner writes the record; analytics (GA4) and any future
 * marketing integrations read it here so every consumer agrees on the
 * same shape and version.
 */

export const CONSENT_STORAGE_KEY = "stratifit_cookie_consent";
export const CONSENT_COOKIE = "stratifit_cookie_consent";
export const CONSENT_MARKER = "stratifit_cookie_consent_saved";
export const CONSENT_VERSION = 1;

/** Fired whenever the visitor saves consent choices (grant, reject, or edit). */
export const CONSENT_CHANGED_EVENT = "stratifit:consent-changed";

export type ConsentRecord = {
  version: number;
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

function reviewedConsent(): ConsentRecord {
  return {
    version: CONSENT_VERSION,
    essential: true,
    analytics: false,
    marketing: false,
    updatedAt: new Date(0).toISOString(),
  };
}

export function parseConsentRecord(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.version !== CONSENT_VERSION || parsed.essential !== true) {
      return null;
    }
    if (
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean"
    ) {
      return null;
    }
    if (typeof parsed.updatedAt !== "string" || !parsed.updatedAt) return null;
    return {
      version: CONSENT_VERSION,
      essential: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

/**
 * Reads the visitor's consent record. Returns `null` when the visitor has
 * not reviewed consent yet (banner still needs to show).
 *
 * Prefers localStorage, falls back to the mirrored cookie, and migrates the
 * legacy "saved" marker to an explicit essential-only record so behavior is
 * deterministic for returning visitors.
 */
export function readConsentRecord(): ConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = parseConsentRecord(
      window.localStorage.getItem(CONSENT_STORAGE_KEY)
    );
    if (stored) return stored;
  } catch {
    // Continue with the cookie fallback.
  }

  try {
    const value = document.cookie
      .split(";")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`));
    if (!value) return null;

    const parsed = parseConsentRecord(
      decodeURIComponent(value.slice(CONSENT_COOKIE.length + 1))
    );
    if (parsed) return parsed;
  } catch {
    // Treat unreadable consent as unreviewed rather than assuming consent.
  }

  // Older releases wrote this marker without a complete consent record.
  // Keep those visitors from seeing the banner again, but treat them as
  // essential-only (no analytics consent assumed).
  try {
    if (window.localStorage.getItem(CONSENT_MARKER) === "1") {
      const migrated = reviewedConsent();
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    // If storage is unavailable, the current session can still continue.
  }

  return null;
}

/** True when the visitor has granted the analytics category. */
export function hasAnalyticsConsent(): boolean {
  return readConsentRecord()?.analytics === true;
}

/** True when the visitor has granted the marketing category. */
export function hasMarketingConsent(): boolean {
  return readConsentRecord()?.marketing === true;
}
