"use client";

import { ContactTrigger } from "@/components/contact/contact-trigger";
import { buttonClasses } from "@/components/ui/button";
import { t } from "@/lib/i18n/ui-strings";

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
 * The primary CTA opens the FAQ chat; the outline CTA opens the contact popup.
 */
export function FaqHelpCard({ locale }: { locale: string }) {
  function openFaqChat() {
    window.dispatchEvent(
      new CustomEvent("stratifit:open-chat", { detail: { view: "faq" } })
    );
  }

  const title = t(locale, "faqHelpCardTitle");
  const questionMarkIndex = title.lastIndexOf("?");
  const titleBefore = questionMarkIndex >= 0 ? title.slice(0, questionMarkIndex) : title;

  return (
    <div className="group flex flex-col gap-3 rounded-card border border-white/10 bg-card-dark p-4 transition-all duration-300 ease-[var(--ease-standard)] hover:border-primary/30 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)] sm:gap-4 sm:p-5">
      <span className="text-center font-display text-sm font-black tracking-tight text-text-primary sm:text-lg md:text-xl">
        {titleBefore}
        {questionMarkIndex >= 0 ? <span className="text-primary">?</span> : null}
      </span>
      <span className="text-center text-[10px] text-text-muted sm:text-xs">
        {t(locale, "faqHelpCardSubtitle")}
      </span>

      <button
        type="button"
        onClick={openFaqChat}
        className={buttonClasses({ variant: "primary", size: "medium", className: "w-full" })}
      >
        <ChatIcon className="size-4 shrink-0" />
        {t(locale, "faqAskMoreQuestions")}
        <ArrowRightIcon className="size-4 shrink-0 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5" />
      </button>

      <ContactTrigger
        className={buttonClasses({ variant: "tertiary", size: "medium", className: "w-full" })}
      >
        {t(locale, "faqContactTeam")}
        <ArrowRightIcon className="size-4 shrink-0 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5" />
      </ContactTrigger>
    </div>
  );
}
