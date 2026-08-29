"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { hasAnalyticsConsent } from "@/lib/analytics/consent";

/**
 * Sends a GA4 event, but only when the visitor has granted the analytics
 * cookie category. Safe to call from any client component — events are
 * silently dropped before consent or while the tag is not loaded.
 *
 * Never pass personal data (names, emails, phone numbers, form contents,
 * query parameters) in the parameters.
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (params) {
    sendGAEvent("event", name, params);
  } else {
    sendGAEvent("event", name);
  }
}
