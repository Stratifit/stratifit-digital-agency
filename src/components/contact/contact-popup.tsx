"use client";

import * as React from "react";
import type { PublicServiceDetail } from "@/features/services/queries";
import { ContactForm } from "@/components/forms/contact-form";
import { t } from "@/lib/i18n/ui-strings";

function SparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

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
 * Trust badges rendered at the bottom of the contact popup.
 */
function TrustBadges({ locale }: { locale: string }) {
  const badges = [
    {
      icon: <ShieldCheckIcon />,
      title: t(locale, "trustNoSpam"),
      desc: t(locale, "trustNoSpamDesc"),
    },
    {
      icon: <LockIcon />,
      title: t(locale, "trustPrivate"),
      desc: t(locale, "trustPrivateDesc"),
    },
    {
      icon: <ZapIcon />,
      title: t(locale, "trustQuickResponse"),
      desc: t(locale, "trustQuickResponseDesc"),
    },
  ];

  return (
    <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border px-2 py-3 sm:py-4">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className="flex items-start justify-center gap-2 px-2 text-center sm:gap-2.5"
        >
          <span className="mt-0.5 shrink-0 text-primary">{badge.icon}</span>
          <div className="min-w-0 text-left leading-snug">
            <p className="whitespace-nowrap text-[9px] font-semibold text-text-primary sm:text-[11px]">
              {badge.title}
            </p>
            <p className="mt-0.5 text-[8px] leading-[1.4] text-text-muted sm:text-[10px]">
              {badge.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
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

        {/* Header */}
        <header className="relative pr-12 sm:pr-16">
          <div className="mb-3 mt-2 flex items-center gap-2 sm:mb-4 sm:mt-0">
            <span className="flex size-7 items-center justify-center rounded-lg border border-primary/30 bg-surface-soft text-primary sm:size-9">
              <SparklesIcon />
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
              {t(locale, "getInTouch")}
            </span>
          </div>

          <h2 className="font-display text-[25px] font-bold leading-[1.06] tracking-[-0.03em] text-text-primary sm:text-4xl lg:text-5xl">
            {t(locale, "popupHeadingA")}{" "}
            <span className="text-primary">{t(locale, "popupHeadingB")}</span>
          </h2>

          <p className="mt-2.5 max-w-xl text-[11px] leading-4 text-text-secondary sm:mt-3 sm:text-sm sm:leading-6">
            {t(locale, "popupSubheading")}
          </p>
        </header>

        {/* Form */}
        <div className="relative mt-6 sm:mt-10">
          <ContactForm services={services} locale={locale} compact />
        </div>

        {/* Trust badges */}
        <div className="relative pt-4 sm:pt-8 lg:pt-10">
          <TrustBadges locale={locale} />
        </div>
      </div>
    </div>
  );
}