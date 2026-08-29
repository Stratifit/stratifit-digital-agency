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

/**
 * Classifies an outbound href as a WhatsApp, email, or phone contact link.
 * Returns `null` for anything else (e.g. social networks or internal links).
 */
export function getContactLinkType(
  href: string
): "whatsapp" | "email" | "phone" | null {
  if (/^(https?:)?\/\/wa\.me\//i.test(href) || /whatsapp/i.test(href)) {
    return "whatsapp";
  }
  if (/^mailto:/i.test(href)) return "email";
  if (/^tel:/i.test(href)) return "phone";
  return null;
}

/**
 * Sends the appropriate GA4 event for a contact link click:
 * `whatsapp_click`, `email_click`, or `phone_click`. For non-contact
 * outbound links (e.g. social networks), falls back to `social_click` with
 * the network name. All events are dropped unless analytics consent is set.
 */
export function trackContactLink(href: string, network?: string) {
  const type = getContactLinkType(href);
  if (type) {
    trackEvent(`${type}_click`, { method: network ?? type });
    return;
  }
  if (network) {
    trackEvent("social_click", { network });
  }
}
