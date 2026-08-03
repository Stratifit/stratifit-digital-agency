"use client";

import * as React from "react";
import type { PublicServiceDetail } from "@/features/services/queries";
import { ContactPanel } from "./contact-panel";
import { t } from "@/lib/i18n/ui-strings";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/**
 * Global contact popup. Opens on the "stratifit:open-contact" window event
 * (dispatched by ContactTrigger) and closes on Escape, backdrop click, or the
 * close button. Animated in, focus managed, body scroll locked while open.
 */
export function ContactPopup({
  services,
  locale,
}: {
  services: PublicServiceDetail[];
  locale: string;
}) {
  const [open, setOpen] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const lastFocusedRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    function handleOpen() {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }
    function handleClose() {
      setOpen(false);
    }
    window.addEventListener("stratifit:open-contact", handleOpen);
    window.addEventListener("stratifit:close-contact", handleClose);
    return () => {
      window.removeEventListener("stratifit:open-contact", handleOpen);
      window.removeEventListener("stratifit:close-contact", handleClose);
    };
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t(locale, "contactEyebrow")}
      className="fixed inset-0 z-[70] sm:flex sm:items-center sm:justify-center sm:p-6"
    >
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className="contact-popup-backdrop fixed inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="contact-popup-panel relative mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col overflow-y-auto bg-card-dark px-4 py-4 sm:min-h-0 sm:rounded-[24px] sm:border sm:border-card-border sm:px-8 sm:py-8 lg:p-10">
        {/* Ambient amber glow (top-right) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[rgba(245,158,11,0.05)] blur-3xl"
        />

        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          aria-label={t(locale, "closePopup")}
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full border border-card-border text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/30 hover:text-text-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 sm:right-8 sm:top-8 sm:size-11"
        >
          <CloseIcon />
        </button>

        <ContactPanel
          services={services}
          locale={locale}
          headerClassName="pr-12 sm:pr-16"
        />
      </div>
    </div>
  );
}
