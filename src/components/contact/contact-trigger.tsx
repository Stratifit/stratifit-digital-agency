"use client";

import * as React from "react";

/**
 * Opens the global contact popup instead of navigating to /contact.
 * Listens for "stratifit:open-contact" on the ContactPopup side.
 */
export function ContactTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  function openContact() {
    window.dispatchEvent(new CustomEvent("stratifit:open-contact"));
  }

  return (
    <button type="button" onClick={openContact} className={className} {...props}>
      {children}
    </button>
  );
}
