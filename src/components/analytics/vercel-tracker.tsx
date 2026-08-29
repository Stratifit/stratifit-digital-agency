"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/**
 * Internal routes that are never part of the public marketing site and must
 * not be reported to Vercel Web Analytics. The public site lives under the
 * `(public)` route group; everything else is admin/CMS, API, or auth.
 */
const INTERNAL_PREFIXES = ["/admin", "/api", "/auth"] as const;

function getPathname(url: string): string {
  try {
    // `url` is normally an absolute URL; fall back to raw text when it cannot
    // be parsed so admin events are never accidentally sent.
    return new URL(url, window.location.href).pathname;
  } catch {
    return url;
  }
}

function isInternalRoute(pathname: string): boolean {
  const normalized = pathname.split("?")[0];
  return INTERNAL_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
}

function shouldSend(event: BeforeSendEvent): BeforeSendEvent | null {
  const pathname = getPathname(event.url);
  return isInternalRoute(pathname) ? null : event;
}

/**
 * Single Vercel Web Analytics instance. Wraps the official <Analytics />
 * component so its `beforeSend` filter can live in a client component
 * (functions cannot cross the server/client boundary). Only the public site
 * is reported; admin/CMS, API, and auth paths are dropped.
 */
export function VercelAnalytics() {
  return <Analytics beforeSend={shouldSend} />;
}