"use client";

import { ContactTrigger } from "@/components/contact/contact-trigger";

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
      <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * "Still have more questions?" card shown beneath the FAQ section.
 * The top row deep-links into the chat widget's FAQ panel; the amber CTA
 * opens the global contact popup.
 */
export function FaqHelpCard() {
  function openFaqChat() {
    window.dispatchEvent(
      new CustomEvent("stratifit:open-chat", { detail: { view: "faq" } })
    );
  }

  return (
    <div className="group flex flex-col gap-3 rounded-card border border-white/10 bg-card-dark p-4 transition-all duration-300 ease-[var(--ease-standard)] hover:border-primary/30 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)] sm:gap-4 sm:p-5">
      <button
        type="button"
        onClick={openFaqChat}
        aria-label="Open FAQ AI chat"
        className="flex w-full items-start gap-3 rounded-button text-left focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:bg-primary/25 sm:size-10">
          <ChatIcon className="size-4 text-primary sm:size-[18px]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm font-black tracking-tight text-text-primary sm:text-lg md:text-xl">
            Still have more{" "}
            <span className="text-primary">questions?</span>
          </span>
          <span className="mt-0.5 block truncate text-[10px] text-text-muted sm:text-xs">
            Chat with our FAQ AI bot — instant answers, 24/7.
          </span>
        </span>
      </button>

      <ContactTrigger className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary h-11 px-[18px] text-sm font-bold text-black shadow-[0_0_18px_rgba(245,158,11,0.25)] transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary-light active:scale-95 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 group-hover:gap-3">
        Contact our team
        <ArrowRightIcon className="size-4 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5" />
      </ContactTrigger>
    </div>
  );
}
