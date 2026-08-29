"use client";

import * as React from "react";
import { trackEvent } from "@/lib/analytics/events";

/**
 * Opens the global contact popup instead of navigating to /contact.
 * Listens for "stratifit:open-contact" on the ContactPopup side.
 *
 * This is the single funnel for every quote/contact CTA (header, hero,
 * service cards, pricing, business cards, not-found), so firing
 * `get_quote_click` here captures them all without duplicate handlers.
 */
export function ContactTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  function openContact() {
    window.dispatchEvent(new CustomEvent("stratifit:open-contact"));
    trackEvent("get_quote_click");
  }

  return (
    <button type="button" onClick={openContact} className={className} {...props}>
      {children}
    </button>
  );
}
