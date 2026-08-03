"use client";

import * as React from "react";
import type { PublicServiceDetail } from "@/features/services/queries";
import { ContactForm } from "@/components/forms/contact-form";
import { t } from "@/lib/i18n/ui-strings";

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
      className="fixed inset-0 z-[70] overflow-y-auto p-4 sm:p-6"
    >
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className="contact-popup-backdrop fixed inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="contact-popup-panel relative mx-auto my-8 w-full max-w-3xl rounded-card-lg border border-card-border bg-card-dark p-6 shadow-shadow-lg sm:p-10">
        <button
          ref={closeButtonRef}
          type="button"
          aria-label={t(locale, "closePopup")}
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full border border-card-border text-text-muted transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/40 hover:text-text-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-4"
          >
            <path d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {t(locale, "contactEyebrow")}
          </p>
          <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl">
            {t(locale, "letsTalk")}
          </h2>
          <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-text-muted sm:pl-6 sm:text-base md:text-lg">
            {t(locale, "contactPopupDescription")}
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <ContactForm services={services} locale={locale} />
        </div>
      </div>
    </div>
  );
}
