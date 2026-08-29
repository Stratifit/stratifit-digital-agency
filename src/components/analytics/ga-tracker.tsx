"use client";

import * as React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  CONSENT_CHANGED_EVENT,
  readConsentRecord,
  type ConsentRecord,
} from "@/lib/analytics/consent";

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type Gtag = (command: "consent", mode: "update", params: object) => void;

function getGtag(): Gtag | undefined {
  return (window as unknown as { gtag?: Gtag }).gtag;
}

/**
 * Pushes Google Consent Mode v2 state. Analytics storage is only ever
 * "granted" after explicit analytics consent; ad features stay denied.
 */
function applyGtagConsent(record: ConsentRecord | null) {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("consent", "update", {
    analytics_storage: record?.analytics === true ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

/**
 * Loads GA4 (gtag.js) only when the visitor has granted the analytics
 * cookie category, and only on the public site. Mounted once in the public
 * layout; the GoogleAnalytics component tracks client-side navigations via
 * gtag's history-based pageview measurement, so no manual pageviews are
 * sent (avoids duplicates).
 *
 * When consent is revoked, the tag is removed and gtag consent is updated
 * to "denied" so a cached tag from a previous granted visit stops.
 */
export function GATracker() {
  // Hydration-safe mounted flag: renders nothing during SSR/hydration so the
  // client HTML matches the server before analytics state is known.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [consent, setConsent] = React.useState<ConsentRecord | null>(() =>
    readConsentRecord()
  );

  React.useEffect(() => {
    const handleChange = () => setConsent(readConsentRecord());
    window.addEventListener(CONSENT_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handleChange);
  }, []);

  const granted = consent?.analytics === true;

  React.useEffect(() => {
    if (!mounted) return;

    applyGtagConsent(consent);
    if (granted) return;

    // Not granted (or revoked): keep pushing the denial until gtag is
    // available, in case a tag from a previously granted session is cached.
    let attempts = 0;
    const timer = window.setInterval(() => {
      applyGtagConsent(consent);
      attempts += 1;
      if (getGtag() || attempts >= 20) window.clearInterval(timer);
    }, 250);
    return () => window.clearInterval(timer);
  }, [mounted, consent, granted]);

  // Never load GA without consent or before hydration.
  if (!mounted || !MEASUREMENT_ID || !granted) return null;

  return <GoogleAnalytics gaId={MEASUREMENT_ID} />;
}
