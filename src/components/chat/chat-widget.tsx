"use client";

import * as React from "react";
import {
  sendVisitorMessage,
  getVisitorChatState,
  submitVisitorName,
  updateVisitorName,
  submitVisitorEmailChoice,
  resetVisitorChat,
  type ChatStoredMessage,
  type ChatVisitorState,
} from "@/features/chat/mutations";
import { t, type UiStringKey } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { ServiceIcon } from "@/components/ui/service-icon";
import type { PublicServiceDetail } from "@/features/services/queries";
import type { PublicPricingPlan } from "@/features/pricing/queries";

interface WidgetMessage {
  id: string;
  sender: "visitor" | "ai" | "system" | "question";
  content: string;
  created_at: string;
  /** Selected choice for onboarding question messages. */
  choice?: "yes" | "later" | null;
  /** Whether the onboarding question has already been answered. */
  answered?: boolean;
  /** Optional expandable text for the Read-more toggle on AI replies. */
  readMore?: string;
}

const TOKEN_KEY = "stratifit-chat-token";
const LANG_KEY = "stratifit-chat-lang";
const OPEN_KEY = "stratifit-chat-open";
const INPUT_KEY = "stratifit-chat-input";
const SUPPORTED_LANGS = ["en", "de", "fr", "es"];
const LANG_FLAGS: Record<string, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸",
};

function getToken(): string {
  if (typeof window === "undefined") return "";
  let token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

function getDefaultLang(): string {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANG_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const doc = document.documentElement.lang;
  return doc && SUPPORTED_LANGS.includes(doc) ? doc : "en";
}

type OnboardingStage = "loading" | "name" | "emailQuestion" | "emailInput" | "chat";

// ============================================================================
// Icons (Heroicons-style solid paths)
// ============================================================================

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
      <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
        clipRule="evenodd"
      />
      <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
    </svg>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M19.449 8.448 16.388 11a4.52 4.52 0 0 1 0 2.002l3.061 2.55a8.275 8.275 0 0 0 0-7.103ZM15.552 19.45 13 16.388a4.52 4.52 0 0 1-2.002 0l-2.55 3.061a8.275 8.275 0 0 0 7.103 0ZM4.55 15.552 7.612 13a4.52 4.52 0 0 1 0-2.002L4.551 8.45a8.275 8.275 0 0 0 0 7.103ZM8.448 4.55 11 7.612a4.52 4.52 0 0 1 2.002 0l2.55-3.061a8.275 8.275 0 0 0-7.103 0Zm8.657-.86a9.776 9.776 0 0 1 1.79 1.415 9.776 9.776 0 0 1 1.414 1.788 9.764 9.764 0 0 1 0 10.211 9.777 9.777 0 0 1-1.415 1.79 9.777 9.777 0 0 1-1.788 1.414 9.764 9.764 0 0 1-10.212 0 9.776 9.776 0 0 1-1.788-1.415 9.776 9.776 0 0 1-1.415-1.788 9.764 9.764 0 0 1 0-10.212 9.774 9.774 0 0 1 1.415-1.788A9.774 9.774 0 0 1 6.894 3.69a9.764 9.764 0 0 1 10.211 0ZM14.121 9.88a2.985 2.985 0 0 0-1.11-.704 3.015 3.015 0 0 0-2.022 0 2.985 2.985 0 0 0-1.11.704c-.326.325-.56.705-.704 1.11a3.015 3.015 0 0 0 0 2.022c.144.405.378.785.704 1.11.325.326.705.56 1.11.704.652.233 1.37.233 2.022 0a2.985 2.985 0 0 0 1.11-.704c.326-.325.56-.705.704-1.11a3.016 3.016 0 0 0 0-2.022 2.985 2.985 0 0 0-.704-1.11Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-[22px]">
      <path
        fillRule="evenodd"
        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-[18px]">
      <path d="M3 12a9 9 0 0 1 15.9-5.4" />
      <path d="M21 12a9 9 0 0 1-15.9 5.4" />
      <path d="M21 3v6h-6" />
      <path d="M3 21v-6h6" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
    </svg>
  );
}

function PaperclipIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  );
}

// ============================================================================
// Shared AI identity row
// ============================================================================

function AiAvatar({ muted = false }: { muted?: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
        muted
          ? "bg-primary/15 text-primary/60"
          : "bg-gradient-to-br from-primary/25 to-primary/10 text-primary ring-1 ring-primary/20"
      )}
    >
      <ChatIcon className="size-3.5" />
    </span>
  );
}

function AiSenderLabel({ locale }: { locale: string }) {
  return (
    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-primary/70">
      {t(locale, "chatName")}
    </span>
  );
}

// ============================================================================
// Chat widget
// ============================================================================

type ChatView = "chat" | "services" | "pricing" | "faq" | "support";

const TOPIC_CHIPS: {
  key: UiStringKey;
  view: ChatView;
  icon: (props: { className?: string }) => React.ReactNode;
}[] = [
  { key: "chatChat", view: "chat", icon: ChatIcon },
  { key: "chatServices", view: "services", icon: BriefcaseIcon },
  { key: "chatPricing", view: "pricing", icon: DollarIcon },
  { key: "chatFaq", view: "faq", icon: InfoIcon },
  { key: "chatSupport", view: "support", icon: CogIcon },
];

/** FAQ accordion items shown in the FAQ panel. */
const FAQ_ITEMS: { q: UiStringKey; a: UiStringKey }[] = [
  { q: "chatFaqQ1", a: "chatFaqA1" },
  { q: "chatFaqQ2", a: "chatFaqA2" },
  { q: "chatFaqQ3", a: "chatFaqA3" },
];

// ============================================================================
// Topic panels — compact overviews shown inside the chat instead of the
// conversation when a topic chip is active. They keep the visitor inside the
// widget and hand off to the AI or the contact form with one tap.
// ============================================================================

/** Shared panel footer button — returns to the conversation. */
function PanelBackButton({
  locale,
  onClick,
}: {
  locale: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-border bg-white/5 px-3 py-2 text-xs font-medium text-text-secondary transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
    >
      <ChatIcon className="size-3.5 text-primary" />
      {t(locale, "chatBackToChat")}
    </button>
  );
}

/** Shared panel heading — small amber icon chip + Satoshi title. */
function PanelHeading({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-[10px] border border-primary/20 bg-primary/10 text-primary">
        {icon}
      </span>
      <p className="font-display text-sm font-black tracking-tight text-text-primary">
        {title}
      </p>
    </div>
  );
}

/** Full-width primary action used inside topic panels. */
function PanelPrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-primary px-3 py-2.5 text-xs font-semibold text-text-inverse transition-all hover:bg-primary-hover active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

/** Services panel — the homepage service cards in a compact 2×2 grid so every
    offering is visible at once: icon badge, key deliverables, and two CTAs
    that hand off to the AI ("Ask about this") or the service page
    ("Learn more"). */
function ServicesPanel({
  locale,
  services,
  servicePageSlugs,
  onAsk,
  onBack,
}: {
  locale: string;
  services: PublicServiceDetail[];
  servicePageSlugs: string[];
  onAsk: (serviceTitle: string, mode: "interested" | "more") => void;
  onBack: () => void;
}) {
  return (
    <div>
      <PanelHeading
        title={t(locale, "chatServices")}
        icon={<BriefcaseIcon className="size-3.5" />}
      />
      <div className="grid grid-cols-1 gap-3">
        {services.map((service) => {
          const deliverables = (
            (service.deliverables_translations as Record<string, unknown> | null)?.[
              locale
            ] ??
            (service.deliverables_translations as Record<string, unknown> | null)?.[
              "en"
            ] ??
            []
          ) as string[];
          const title =
            resolveTranslation(service.title_translations, locale) ?? service.slug;
          const description = resolveTranslation(
            service.short_description_translations,
            locale
          );
          const learnMoreHref = servicePageSlugs.includes(service.slug)
            ? `/services/${service.slug}`
            : service.cta_url ?? "/contact";

          return (
            <div
              key={service.slug}
              className="group relative flex flex-col overflow-hidden rounded-card border border-card-border bg-card-dark p-3.5 shadow-shadow-lg transition-[border-color,transform,background-color] duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-card-border-hover"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-20 w-20 rounded-full bg-primary/5 blur-2xl transition-colors duration-[var(--motion-medium)] ease-[var(--ease-standard)] group-hover:bg-primary/10"
              />
              <div className="relative z-10 flex flex-1 flex-col gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <ServiceIcon name={service.icon_name} className="size-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-[13px] font-bold leading-tight tracking-tight text-text-primary">
                    {title}
                  </h3>
                  {description ? (
                    <p className="line-clamp-2 text-[10px] font-medium leading-relaxed text-text-muted">
                      {description}
                    </p>
                  ) : null}
                </div>
                <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                {deliverables.length > 0 ? (
                  <div>
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-primary opacity-90">
                      {t(locale, "keyDeliverables")}
                    </p>
                    <ul className="space-y-1">
                      {deliverables.slice(0, 4).map((item, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <CheckIcon className="mt-px size-3 shrink-0 text-primary" />
                          <span className="text-[10px] font-medium leading-snug text-text-tertiary">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="flex-1" />
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => onAsk(title, "interested")}
                    className="flex flex-1 items-center justify-center rounded-[10px] bg-primary px-1.5 py-1.5 text-[10px] font-semibold text-text-inverse transition-all hover:bg-primary-hover active:scale-[0.98]"
                  >
                    {t(locale, "chatAskAbout")}
                  </button>
                  <Link
                    href={learnMoreHref}
                    className="flex flex-1 items-center justify-center rounded-[10px] border border-primary/25 bg-primary/10 px-1.5 py-1.5 text-[10px] font-semibold text-primary transition-all hover:bg-primary/15 active:scale-[0.98]"
                  >
                    {t(locale, "chatLearnMore")}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <PanelBackButton locale={locale} onClick={onBack} />
    </div>
  );
}

/** Pricing panel — the homepage plan cards in a compact 2×2 grid so every
    package is visible at once (no horizontal scroll), with the plan CTA
    opening the contact popup or linking when a cta_url is set, plus an
    "Ask about pricing" chat handoff. */
function PricingPanel({
  locale,
  plans,
  onAskPricing,
  onContact,
  onBack,
}: {
  locale: string;
  plans: PublicPricingPlan[];
  onAskPricing: () => void;
  onContact: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <PanelHeading
        title={t(locale, "chatPricingTitle")}
        icon={<DollarIcon className="size-3.5" />}
      />
      <p className="mb-3 text-[11px] leading-relaxed text-text-muted">
        {t(locale, "chatPricingBody")}
      </p>

      <div className="grid grid-cols-1 gap-3">
        {plans.map((plan) => {
          const features = (
            (plan.features_translations as Record<string, unknown> | null)?.[
              locale
            ] ??
            (plan.features_translations as Record<string, unknown> | null)?.["en"] ??
            []
          ) as string[];
          const name =
            resolveTranslation(plan.name_translations, locale) ?? plan.slug;
          const price = resolveTranslation(plan.price_label_translations, locale);
          const billing = resolveTranslation(
            plan.billing_label_translations,
            locale
          );
          const description = resolveTranslation(
            plan.description_translations,
            locale
          );
          const ctaLabel =
            resolveTranslation(plan.cta_label_translations, locale) ||
            t(locale, "startAProject");
          const ctaHref =
            plan.cta_url && plan.cta_url !== "/contact" ? plan.cta_url : null;

          return (
            <div
              key={plan.slug}
              className={cn(
                "relative flex flex-col rounded-card border bg-card-dark p-3.5 shadow-shadow-lg transition-[border-color,transform,background-color] duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:-translate-y-0.5",
                plan.is_featured
                  ? "border-primary shadow-[0_0_24px_rgba(245,158,11,0.12)]"
                  : "border-card-border hover:border-primary/30"
              )}
            >
              {plan.is_featured ? (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-black">
                  {t(locale, "mostPopular")}
                </div>
              ) : null}
              <h3 className="mb-1 font-display text-[13px] font-bold text-text-primary">
                {name}
              </h3>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-display text-lg font-black text-primary">
                  {price}
                </span>
                {billing ? (
                  <span className="text-[9px] font-bold uppercase text-text-subtle">
                    {billing}
                  </span>
                ) : null}
              </div>
              {description ? (
                <p className="mb-2 line-clamp-2 text-[10px] leading-relaxed text-text-muted">
                  {description}
                </p>
              ) : null}
              <div className="mb-2 h-px w-full bg-white/5" />
              <ul className="mb-2 flex-1 space-y-1">
                {features.slice(0, 4).map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-1.5 text-[10px] leading-snug text-text-tertiary"
                  >
                    <CheckIcon className="mt-px size-3 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              {ctaHref ? (
                <Link
                  href={ctaHref}
                  className={cn(
                    "block w-full rounded-[10px] py-2 text-center text-[10px] font-bold uppercase tracking-wide transition-all",
                    plan.is_featured
                      ? "bg-primary text-text-inverse shadow-lg shadow-primary/20 hover:bg-primary-hover"
                      : "border border-primary text-primary hover:bg-primary/10"
                  )}
                >
                  {ctaLabel}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onContact}
                  className={cn(
                    "block w-full rounded-[10px] py-2 text-center text-[10px] font-bold uppercase tracking-wide transition-all",
                    plan.is_featured
                      ? "bg-primary text-text-inverse shadow-lg shadow-primary/20 hover:bg-primary-hover active:bg-primary-active"
                      : "border border-primary text-primary hover:bg-primary/10"
                  )}
                >
                  {ctaLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        <PanelPrimaryButton onClick={onAskPricing}>
          <DollarIcon className="size-3.5" />
          {t(locale, "chatAskAboutPricing")}
        </PanelPrimaryButton>
      </div>
      <PanelBackButton locale={locale} onClick={onBack} />
    </div>
  );
}

/** FAQ accordion panel — matches the main homepage FaqAccordion
    design exactly: 2-col grid on md+, Satoshi headings, CSS grid row
    reveal animation, primary/30 highlight border on the open item. */
function FaqAccordionChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FaqPanel({
  locale,
  openFaq,
  onToggleFaq,
  onBack,
}: {
  locale: string;
  openFaq: number | null;
  onToggleFaq: (index: number) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <PanelHeading
        title={t(locale, "chatFaqTitle")}
        icon={<InfoIcon className="size-3.5" />}
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {FAQ_ITEMS.map((item, index) => {
          const open = openFaq === index;
          return (
            <div
              key={item.q}
              className={cn(
                "h-full rounded-card border transition-all duration-300 ease-[var(--ease-standard)]",
                open
                  ? "border-primary/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                  : "border-card-border hover:border-white/10"
              )}
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => onToggleFaq(index)}
                className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span
                  className={cn(
                    "font-display text-sm font-bold transition-colors duration-300 sm:text-base",
                    open
                      ? "text-primary"
                      : "text-text-primary group-hover:text-primary/80"
                  )}
                >
                  {t(locale, item.q)}
                </span>
                <span
                  className={cn(
                    "shrink-0 transition-all duration-300",
                    open
                      ? "rotate-180 text-primary"
                      : "text-text-subtle group-hover:text-primary/70"
                  )}
                >
                  <FaqAccordionChevronIcon />
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-standard)]",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-text-muted">
                    {t(locale, item.a)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <PanelBackButton locale={locale} onClick={onBack} />
    </div>
  );
}

/** Human-support panel — hands off to the contact form. */
function SupportPanel({
  locale,
  onContact,
  onBack,
}: {
  locale: string;
  onContact: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <PanelHeading
        title={t(locale, "chatSupportTitle")}
        icon={<CogIcon className="size-3.5" />}
      />
      <div className="rounded-[14px] border border-border bg-card-dark p-4">
        <p className="text-[11px] leading-relaxed text-text-muted">
          {t(locale, "chatSupportBody")}
        </p>
        <div className="mt-3.5">
          <PanelPrimaryButton onClick={onContact}>
            <MailIcon className="size-3.5" />
            {t(locale, "chatContactUs")}
          </PanelPrimaryButton>
        </div>
      </div>
      <PanelBackButton locale={locale} onClick={onBack} />
    </div>
  );
}

function toWidgetMessages(rows: ChatStoredMessage[]): WidgetMessage[] {
  return rows.map((row) => ({
    id: row.id,
    sender:
      row.sender_type === "visitor"
        ? "visitor"
        : row.sender_type === "system"
          ? "system"
          : "ai",
    content: row.content,
    created_at: row.created_at,
  }));
}

/** Groups consecutive messages from the same sender into clusters. */
function groupMessages(messages: WidgetMessage[]): WidgetMessage[][] {
  const groups: WidgetMessage[][] = [];
  for (const message of messages) {
    const last = groups[groups.length - 1];
    if (last && last[last.length - 1].sender === message.sender) {
      last.push(message);
    } else {
      groups.push([message]);
    }
  }
  return groups;
}

/**
 * Builds the synthetic email-question message so it can live inside the
 * conversation history instead of vanishing once the user answers.
 */
function buildQuestionMessage(
  locale: string,
  name: string,
  choice: "yes" | "later" | null,
  answered: boolean
): WidgetMessage {
  return {
    id: "email-question",
    sender: "question",
    content: t(locale, "chatEmailQuestion").replace(
      "{name}",
      name || t(locale, "chatVisitor")
    ),
    created_at: new Date().toISOString(),
    choice,
    answered,
  };
}

/**
 * Inserts a message right after the first stored message (the visitor's name
 * message, which the onboarding flow always writes first).
 */
function insertQuestion(
  messages: WidgetMessage[],
  question: WidgetMessage
): WidgetMessage[] {
  if (messages.length === 0) return [question];
  return [messages[0], question, ...messages.slice(1)];
}

/**
 * Marks the AI reply that follows an answered "yes" question so the widget can
 * attach the Read-more expansion to it.
 */
function markYesReply(
  messages: WidgetMessage[],
  readMore: string
): WidgetMessage[] {
  const questionIndex = messages.findIndex(
    (m) => m.sender === "question" && m.choice === "yes"
  );
  if (questionIndex === -1) return messages;
  const replyIndex = messages.findIndex(
    (m, i) => i > questionIndex && m.sender === "ai"
  );
  if (replyIndex === -1) return messages;
  return messages.map((m, i) => (i === replyIndex ? { ...m, readMore } : m));
}

/** Locale-aware time label; shows the date too when not today. */
function formatMessageTime(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  if (sameDay) return time;
  const day = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }).format(date);
  return `${day}, ${time}`;
}

/** Timestamp under the last bubble of a group; renders nothing when absent. */
function MessageTime({
  iso,
  locale,
  align = "left",
}: {
  iso: string;
  locale: string;
  align?: "left" | "right";
}) {
  const label = formatMessageTime(iso, locale);
  if (!label) return null;
  return (
    <time
      dateTime={iso}
      className={cn(
        "mt-1 block text-[11px] font-medium text-text-subtle",
        align === "right" ? "pr-1 text-right" : "pl-1"
      )}
    >
      {label}
    </time>
  );
}

export function ChatWidget({
  services,
  plans,
  servicePageSlugs,
}: {
  services: PublicServiceDetail[];
  plans: PublicPricingPlan[];
  servicePageSlugs: string[];
}) {
  const [open, setOpen] = React.useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(OPEN_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [messages, setMessages] = React.useState<WidgetMessage[]>([]);
  const [input, setInput] = React.useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return window.localStorage.getItem(INPUT_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [visitor, setVisitor] = React.useState<ChatVisitorState>({
    name: "",
    email: "",
    email_choice: null,
    onboarding_complete: false,
  });
  const [stage, setStage] = React.useState<OnboardingStage>("loading");
  const [showPrivacyNote, setShowPrivacyNote] = React.useState(false);
  const [lang, setLang] = React.useState<string>(() => getDefaultLang());
  const [langOpen, setLangOpen] = React.useState(false);
  const langRef = React.useRef<HTMLDivElement>(null);
  const messagesScrollRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const editInputRef = React.useRef<HTMLInputElement>(null);
  const closingRef = React.useRef(false);
  const [closing, setClosing] = React.useState(false);
  const [editingName, setEditingName] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState("");
  const [openReadMore, setOpenReadMore] = React.useState<string | null>(null);
  /** Number of trailing message groups rendered — the chat opens showing only
      the last two exchanges and earlier ones are revealed by scrolling up. */
  const [visibleGroupCount, setVisibleGroupCount] = React.useState(2);
  /** Active topic view — the chips switch between the conversation and the
      compact service/pricing/faq/support/about panels. */
  const [view, setView] = React.useState<ChatView>("chat");
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  React.useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener("stratifit:open-chat", handleOpen);
    return () => window.removeEventListener("stratifit:open-chat", handleOpen);
  }, []);

  // Keep the open/closed state in sync with storage.
  React.useEffect(() => {
    try {
      window.localStorage.setItem(OPEN_KEY, open ? "1" : "0");
    } catch {
      // Storage unavailable — ignore.
    }
  }, [open]);

  // Keep the draft text in sync with storage so a refresh restores it.
  React.useEffect(() => {
    try {
      window.localStorage.setItem(INPUT_KEY, input);
    } catch {
      // Storage unavailable — ignore.
    }
  }, [input]);

  // Close the language menu on outside click
  React.useEffect(() => {
    if (!langOpen) return;
    function onMouseDown(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [langOpen]);

  // Focus the inline name editor when it appears
  React.useEffect(() => {
    if (editingName) editInputRef.current?.focus();
  }, [editingName]);

  // While the chat is open: lock body scroll and close on Escape
  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const target = event.target as HTMLElement | null;
      // Only dismiss when focus is inside the chat dialog. Stray Escape
      // presses — Android back button, other modals like the contact popup —
      // must never close the chat underneath.
      if (!target || !panelRef.current?.contains(target)) return;
      // Never dismiss while the visitor is typing in a field.
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      closeChat();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Move focus into the dialog when it opens
  React.useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  // Load persisted conversation state whenever the widget opens
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const result = await getVisitorChatState({
        visitor_token: getToken(),
        locale: lang,
        source_page:
          typeof window !== "undefined" ? window.location.pathname : "/",
      });
      if (cancelled || !result.success || !result.data) return;
      const data = result.data;
      setVisitor(data.visitor);
      const stored = toWidgetMessages(data.messages);
      // Keep the email-question bubble inside the history once it was asked.
      setMessages(
        data.visitor.name
          ? data.visitor.email_choice === "yes"
            ? markYesReply(
                insertQuestion(
                  stored,
                  buildQuestionMessage(lang, data.visitor.name, "yes", true)
                ),
                t(lang, "chatYesReadMore")
              )
            : insertQuestion(
                stored,
                buildQuestionMessage(
                  lang,
                  data.visitor.name,
                  data.visitor.email_choice ?? null,
                  Boolean(data.visitor.email_choice)
                )
              )
          : stored
      );
      // Tail window: pin to the newest exchanges after the load lands.
      setVisibleGroupCount(2);
      // Reopen the widget in the conversation, not in a leftover topic panel.
      setView("chat");
      setStage(
        !data.visitor.name
          ? "name"
          : data.visitor.email_choice
            ? "chat"
            : "emailQuestion"
      );
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the newest send/reply pinned to the bottom of the messages area so
  // the current reply is always visible without scrolling down. Pins before
  // paint (useLayoutEffect) and re-pins after paint (rAF), so late layout
  // changes — panel entrance, async message render, fonts — can never leave
  // the tail mid-panel or below the fold. New messages follow smoothly, but
  // only when the tail is already in view, so reading earlier messages (by
  // scrolling up) is never interrupted.
  React.useLayoutEffect(() => {
    if (!open) return;
    const el = messagesScrollRef.current;
    if (!el) return;
    const pin = (smooth: boolean) => {
      const isChat = view === "chat";
      const tailVisible =
        !isChat || el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      el.scrollTo({
        top: isChat ? el.scrollHeight : 0,
        behavior: smooth && isChat && tailVisible ? "smooth" : "auto",
      });
    };
    pin(true);
    const id = requestAnimationFrame(() => pin(false));
    return () => cancelAnimationFrame(id);
  }, [open, view, messages, loading, stage]);

  function handleMessagesScroll() {
    const el = messagesScrollRef.current;
    if (!el) return;
    // Panel views scroll their own content — only the chat window reveals
    // earlier messages by scrolling to the top.
    if (view !== "chat") return;
    // Reaching the top of the visible window reveals earlier messages.
    if (el.scrollTop <= 32) {
      setVisibleGroupCount((c) =>
        c < messageGroups.length + 1 ? c + 2 : c
      );
    }
  }

  if (!mounted) return null;

  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return null;
  }

  async function sendChatMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        sender: "visitor",
        content: trimmed,
        created_at: new Date().toISOString(),
      },
    ]);
    // Collapse the window back to the newest exchanges.
    setVisibleGroupCount(2);
    setInput("");
    setError(null);
    setLoading(true);

    const result = await sendVisitorMessage({
      visitor_token: getToken(),
      message: trimmed,
      locale: lang,
      source_page: typeof window !== "undefined" ? window.location.pathname : "/",
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? t(lang, "chatError"));
      return;
    }

    if (result.data?.ai_reply) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          content: result.data!.ai_reply!,
          created_at: new Date().toISOString(),
        },
      ]);
    }
    if (result.data?.escalated) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          sender: "system",
          content: t(lang, "chatEscalated"),
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }

  async function handleNameSubmit() {
    const name = input.trim();
    if (!name || loading) return;
    setError(null);
    setLoading(true);
    const result = await submitVisitorName({
      visitor_token: getToken(),
      name,
      locale: lang,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? t(lang, "chatError"));
      return;
    }
    if (!result.data) {
      setError(t(lang, "chatError"));
      return;
    }
    const data = result.data;
    const stored = toWidgetMessages(data.messages);
    setVisitor((v) => ({ ...v, name: data.name }));
    setMessages(insertQuestion(stored, buildQuestionMessage(lang, data.name, null, false)));
    setVisibleGroupCount(2);
    setInput("");
    setStage("emailQuestion");
  }

  async function handleEmailSubmit() {
    const email = input.trim();
    if (!email || loading) return;
    setError(null);
    setLoading(true);
    const result = await submitVisitorEmailChoice({
      visitor_token: getToken(),
      choice: "yes",
      email,
      locale: lang,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? t(lang, "chatError"));
      return;
    }
    if (!result.data) {
      setError(t(lang, "chatError"));
      return;
    }
    const stored = toWidgetMessages(result.data.messages);
    setVisitor((v) => ({ ...v, email, email_choice: "yes", onboarding_complete: true }));
    setMessages(
      markYesReply(
        insertQuestion(stored, buildQuestionMessage(lang, visitor.name, "yes", true)),
        t(lang, "chatYesReadMore")
      )
    );
    setVisibleGroupCount(2);
    setInput("");
    setStage("chat");
  }

  async function handleChoice(choice: "yes" | "later") {
    if (loading) return;
    setError(null);
    if (choice === "yes") {
      // Mark the choice on the persisted question bubble (turns amber), then
      // ask for the email — the question stays unanswered so the visitor can
      // still change their mind and pick "Maybe later".
      setMessages((m) =>
        m.map((msg) =>
          msg.sender === "question" ? { ...msg, choice: "yes" as const } : msg
        )
      );
      setInput("");
      setStage("emailInput");
      return;
    }
    setLoading(true);
    const result = await submitVisitorEmailChoice({
      visitor_token: getToken(),
      choice: "later",
      locale: lang,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? t(lang, "chatError"));
      return;
    }
    if (!result.data) {
      setError(t(lang, "chatError"));
      return;
    }
    const stored = toWidgetMessages(result.data.messages);
    setVisitor((v) => ({ ...v, email_choice: "later", onboarding_complete: true }));
    setMessages(insertQuestion(stored, buildQuestionMessage(lang, visitor.name, "later", true)));
    setVisibleGroupCount(2);
    setInput("");
    setStage("chat");
  }

  function closeChat() {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(() => {
      closingRef.current = false;
      setOpen(false);
      setClosing(false);
    }, 220);
  }

  function handleStartEdit() {
    if (loading || editingName) return;
    setNameDraft(visitor.name);
    setEditingName(true);
  }

  function handleCancelEdit() {
    setEditingName(false);
  }

  async function handleSaveName() {
    const name = nameDraft.trim();
    if (!name || name === visitor.name || loading) {
      setEditingName(false);
      return;
    }
    const result = await updateVisitorName({
      visitor_token: getToken(),
      name,
    });
    if (result.success && result.data) {
      setVisitor((v) => ({ ...v, name: result.data!.name }));
    }
    setEditingName(false);
  }

  function handlePanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const container = panelRef.current;
    if (!container) return;
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey && (active === first || !container.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !container.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  async function handleRestart() {
    if (loading) return;
    setError(null);
    setLoading(true);
    const result = await resetVisitorChat({
      visitor_token: getToken(),
      locale: lang,
    });
    setLoading(false);
    if (result.success && result.data) {
      setVisitor(result.data.visitor);
      setMessages(toWidgetMessages(result.data.messages));
      setVisibleGroupCount(2);
      setView("chat");
      setStage("name");
      setInput("");
      setShowPrivacyNote(false);
    }
  }

  function selectLang(code: string) {
    setLang(code);
    setLangOpen(false);
    window.localStorage.setItem(LANG_KEY, code);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Typing from a panel returns the visitor to the conversation.
    if (view !== "chat") setView("chat");
    if (stage === "name") {
      handleNameSubmit();
    } else if (stage === "emailInput") {
      handleEmailSubmit();
    } else if (stage === "chat") {
      sendChatMessage(input);
    }
  }

  function switchView(next: ChatView) {
    setView(next);
    setOpenFaq(0);
  }

  /** Asks the AI about a service — returns to the chat and sends the prompt. */
  function askAboutService(serviceTitle: string, mode: "interested" | "more") {
    if (loading) return;
    const text = t(
      locale,
      mode === "interested" ? "chatInterestedIn" : "chatTellMeMore"
    ).replace("{service}", serviceTitle);
    setView("chat");
    sendChatMessage(text);
  }

  function askAboutPricing() {
    if (loading) return;
    setView("chat");
    sendChatMessage(t(locale, "chatPricingQuestion"));
  }

  /** Opens the global contact popup (used by the Support panel and the
      Pricing "Start a project" action). */
  function openContactPopup() {
    window.dispatchEvent(new CustomEvent("stratifit:open-contact"));
  }

  const locale = lang;
  const messageGroups = groupMessages(messages);
  // Tail window: only the newest groups are rendered so the chat opens showing
  // the last send + last reply. The email-question group is always included —
  // it stays interactive so visitors can change their mind. The pill remains
  // until the welcome bubble is also revealed.
  const questionGroup = messageGroups.find((g) => g[0].sender === "question");
  const tailGroups = messageGroups.slice(-visibleGroupCount);
  const shownGroups =
    questionGroup && !tailGroups.includes(questionGroup)
      ? [questionGroup, ...tailGroups]
      : tailGroups;
  const fullyRevealed = visibleGroupCount >= messageGroups.length + 1;
  const hasHiddenMessages = !fullyRevealed;
  const firstVisitorGroupId =
    messageGroups.find((group) => group[0].sender === "visitor")?.[0].id ?? null;
  const welcomeParts = t(locale, "chatWelcome").split(" — ");
  const welcomeBody = welcomeParts[1]
    ? welcomeParts[1].charAt(0).toUpperCase() + welcomeParts[1].slice(1)
    : null;

  return (
    <>
      {open ? (
        <>
          {/* Blurred backdrop — the page behind the chat recedes while open */}
          <div
            aria-hidden="true"
            onClick={closeChat}
            className={cn(
              "fixed inset-0 z-[69] bg-black/40 backdrop-blur-sm",
              closing ? "chat-backdrop-out" : "chat-backdrop"
            )}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t(locale, "chatName")}
            tabIndex={-1}
            onKeyDown={handlePanelKeyDown}
            className={cn(
              "fixed inset-x-0 bottom-0 z-[70] flex max-h-[92dvh] flex-col overflow-hidden rounded-t-lg border-t border-border bg-background shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] lg:inset-x-auto lg:bottom-6 lg:right-6 lg:max-h-[80vh] lg:w-[400px] lg:rounded-lg lg:border lg:border-border xl:w-[440px]",
              closing ? "chat-panel-out" : "chat-panel-in"
            )}
          >
          {/* Header — sticky above the scrolling messages; z-30 keeps the
              language dropdown in front of the messages area */}
          <div className="sticky top-0 z-30 flex flex-none items-center justify-between rounded-t-lg border-b border-border bg-background/95 px-4 py-3">
            {/* Ambient amber glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-14 h-32 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,158,11,0.14),transparent_72%)]"
            />
            <div className="relative z-10 flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-active text-text-inverse ring-1 ring-primary/40 shadow-[0_0_14px_rgba(245,158,11,0.25)]">
                <ChatIcon className="size-5" />
              </span>
              <div className="text-left">
                <p className="font-display text-sm font-black text-text-primary">
                  {t(locale, "chatName")}
                </p>
                <span className="flex items-center gap-1">
                  <span
                    className={cn(
                      "size-1 rounded-full bg-success",
                      loading && "chat-status-breathe"
                    )}
                  />
                  <span className="text-[9px] font-medium text-success">
                    {loading
                      ? t(locale, "chatTypingStatus")
                      : t(locale, "chatOnline")}
                  </span>
                </span>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-1">
              {/* Language dropdown */}
              <div ref={langRef} className="relative">
                <button
                  type="button"
                  aria-label={t(locale, "chatLanguage")}
                  onClick={() => setLangOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-full border border-white/5 px-2 py-1 text-[11px] font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span>{LANG_FLAGS[lang] ?? "🇬🇧"}</span>
                  <span className="uppercase">{lang}</span>
                  <ChevronDownIcon className="size-3" />
                </button>
                {langOpen ? (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[120px] overflow-hidden rounded-[10px] border border-border bg-field-bg shadow-2xl">
                    {SUPPORTED_LANGS.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => selectLang(code)}
                        className={cn(
                          "flex w-full items-center gap-2 border-b border-border px-3 py-2 text-xs transition-colors last:border-b-0 hover:bg-white/5",
                          lang === code
                            ? "font-semibold text-primary"
                            : "text-text-secondary hover:text-text-primary"
                        )}
                      >
                        <span>{LANG_FLAGS[code]}</span>
                        <span className="uppercase">{code}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Restart */}
              <button
                type="button"
                aria-label={t(locale, "chatRestart")}
                onClick={handleRestart}
                className="p-2 text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RefreshIcon />
              </button>

              {/* Close */}
              <button
                type="button"
                aria-label={t(locale, "chatClose")}
                onClick={closeChat}
                className="-mr-2 p-2 text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Topic chips — only after onboarding */}
          {stage === "chat" ? (
            <div className="flex flex-none border-b border-border-subtle bg-background px-4 py-3">
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {TOPIC_CHIPS.map((chip) => {
                  const isActive = view === chip.view;
                  return (
                    <button
                      key={chip.key}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => switchView(chip.view)}
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-xs font-medium transition-all active:scale-[0.98]",
                        isActive
                          ? "border-primary bg-primary text-text-inverse"
                          : "border-border bg-white/5 text-text-secondary hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      <chip.icon
                        className={cn(
                          "size-3.5",
                          isActive ? "text-text-inverse" : "text-primary"
                        )}
                      />
                      {t(locale, chip.key)}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Messages — the conversation, or the compact topic panel that
              replaces it while a chip other than Chat is active */}
          <div
            ref={messagesScrollRef}
            onScroll={handleMessagesScroll}
            className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4"
          >
            {/* Conversation — kept mounted and only hidden while a topic panel
                is open, so the message entrance animations never replay when
                switching between the chat and the section panels */}
            <div
              className={cn(
                view === "chat" ? "flex min-h-full flex-col" : "hidden"
              )}
            >
            <div
              aria-hidden="true"
              className="pointer-events-none sticky top-0 z-10 -mx-4 -mt-4 h-5 bg-gradient-to-b from-background to-transparent"
            />
            {hasHiddenMessages ? (
              <button
                type="button"
                onClick={() => setVisibleGroupCount((c) => c + 2)}
                className="mx-auto mb-3 flex items-center gap-1 rounded-[10px] border border-border bg-card-dark px-2.5 py-1 text-[9px] font-medium uppercase tracking-wide text-text-muted transition-colors hover:border-primary/30 hover:text-text-secondary"
              >
                <ChevronDownIcon className="size-2.5 rotate-180" />
                {t(locale, "chatShowEarlier")}
              </button>
            ) : null}
            {/* Bottom-anchored: the newest send/reply always sits at the
                bottom edge of the panel — past messages are revealed by
                scrolling up instead of the tail floating mid-panel */}
            <div className="mt-auto w-full space-y-4">
              {/* Loading skeleton */}
              {stage === "loading" ? (
                <div aria-hidden="true" className="flex justify-start gap-2">
                  <AiAvatar muted />
                  <div className="w-[70%] space-y-2">
                    <div className="h-2 w-16 rounded-full bg-surface" />
                    <div className="rounded-2xl rounded-bl-md border border-card-border bg-card-dark px-4 py-3.5">
                      <div className="shimmer-line h-2.5 w-full rounded-full" />
                      <div className="mt-2.5 h-2.5 w-4/5 rounded-full bg-surface" />
                      <div className="mt-2.5 h-2.5 w-3/5 rounded-full bg-surface" />
                    </div>
                  </div>
                </div>
              ) : null}
              {/* Welcome bubble — part of the scroll history after onboarding so
                  users can scroll up and read the privacy note; hidden while the
                  tail window is active and revealed when scrolling up */}
              {stage !== "loading" && fullyRevealed ? (
                <div className="chat-msg-in flex justify-start gap-2">
                  <AiAvatar />
                  <div className="min-w-0 max-w-[82%]">
                    <AiSenderLabel locale={locale} />
                    <div className="relative overflow-hidden rounded-2xl rounded-bl-md border border-border bg-card-dark px-4 py-3.5">
                      <div className="relative">
                        <p className="text-sm font-semibold leading-snug text-text-primary">
                          {welcomeParts[0]}
                        </p>
                        {welcomeBody ? (
                          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                            {welcomeBody}
                          </p>
                        ) : null}
                      </div>
                      <div className="relative mt-3 flex items-center justify-between gap-2 border-t border-border pt-2.5">
                        <span className="flex items-center gap-1 text-[8px] font-normal uppercase tracking-wide text-text-subtle">
                          <LockIcon className="size-2 text-text-subtle/60" />
                          {t(locale, "chatDataSafe")}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPrivacyNote((v) => !v)}
                          className="text-[8px] font-medium uppercase tracking-wide text-primary/60 underline decoration-primary/25 underline-offset-2 transition-colors hover:text-primary/80"
                        >
                          {t(locale, "chatReadMore")}
                        </button>
                      </div>
                      {showPrivacyNote ? (
                        <div className="chat-msg-in relative mt-2.5 rounded-[10px] border border-border bg-surface-soft/60 px-3 py-2">
                          <p className="text-[11px] leading-relaxed text-text-muted">
                            {t(locale, "chatPrivacyNote")}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Stored messages — grouped by consecutive sender */}
              {shownGroups.map((group) => {
                return (
                  <div key={group[0].id} className="chat-msg-in space-y-1.5">
                    {group.map((m, mi) => {
                      const isFirst = mi === 0;
                      const isLast = mi === group.length - 1;

                      if (m.sender === "visitor") {
                        return (
                          <div key={m.id} className="flex justify-end gap-2">
                            <div className="min-w-0 max-w-[82%]">
                              {isFirst ? (
                                <div className="mb-1 flex items-center justify-end gap-1.5">
                                  {editingName && group[0].id === firstVisitorGroupId ? (
                                    <>
                                      <input
                                        ref={editInputRef}
                                        value={nameDraft}
                                        onChange={(e) => setNameDraft(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSaveName();
                                          } else if (e.key === "Escape") {
                                            handleCancelEdit();
                                          }
                                        }}
                                        aria-label={t(locale, "chatEditName")}
                                        placeholder={
                                          visitor.name ? undefined : t(locale, "chatVisitor")
                                        }
                                        className="w-full min-w-0 rounded-[10px] border border-primary/40 bg-card-dark px-2.5 py-2 text-sm font-medium text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-primary"
                                      />
                                      <button
                                        type="button"
                                        aria-label={t(locale, "chatSave")}
                                        onClick={handleSaveName}
                                        className="shrink-0 p-1 text-success transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                      >
                                        <CheckIcon className="size-4" />
                                      </button>
                                      <button
                                        type="button"
                                        aria-label={t(locale, "chatCancel")}
                                        onClick={handleCancelEdit}
                                        className="shrink-0 p-1 text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                      >
                                        <XIcon className="size-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={handleStartEdit}
                                      aria-label={t(locale, "chatEditName")}
                                      className="group flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    >
                                      <span className="text-[11px] font-semibold uppercase tracking-wide text-primary/70 transition-colors group-hover:text-primary">
                                        {visitor.name || t(locale, "chatVisitor")}
                                      </span>
                                      <PencilIcon className="size-3 text-text-subtle transition-colors group-hover:text-primary" />
                                    </button>
                                  )}
                                </div>
                              ) : null}
                              <div
                                className={cn(
                                  "border border-card-border bg-card-dark px-4 py-3 text-sm leading-relaxed text-text-primary",
                                  isLast
                                    ? "rounded-2xl rounded-br-md"
                                    : "rounded-2xl"
                                )}
                              >
                                {m.content}
                              </div>
                              {isLast ? (
                                <MessageTime
                                  iso={m.created_at}
                                  locale={locale}
                                  align="right"
                                />
                              ) : null}
                            </div>
                          </div>
                        );
                      }

                      if (m.sender === "system") {
                        return (
                          <div key={m.id} className="flex justify-start">
                            <div className="min-w-0 max-w-[80%]">
                              <div
                                className={cn(
                                  "bg-surface px-4 py-3 text-sm leading-relaxed text-text-muted",
                                  isLast
                                    ? "rounded-2xl rounded-bl-md"
                                    : "rounded-2xl"
                                )}
                              >
                                {m.content}
                              </div>
                              {isLast ? (
                                <MessageTime iso={m.created_at} locale={locale} />
                              ) : null}
                            </div>
                          </div>
                        );
                      }

                      if (m.sender === "question") {
                        return (
                          <div key={m.id} className="flex justify-start gap-2">
                            <AiAvatar />
                            <div className="min-w-0 max-w-[82%]">
                              <AiSenderLabel locale={locale} />
                              <div className="relative overflow-hidden rounded-2xl rounded-bl-md border border-card-border bg-card-dark px-4 py-3.5">
                                <div className="relative">
                                  <p className="text-sm leading-relaxed text-text-secondary">
                                    {m.content}
                                  </p>
                                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2.5">
                                    <button
                                      type="button"
                                      disabled={loading}
                                      onClick={() => handleChoice("yes")}
                                      className={cn(
                                        "rounded-md border bg-transparent px-2.5 py-1.5 text-[9px] font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed",
                                        m.choice === "yes"
                                          ? "border-primary/40 bg-primary/10 text-primary disabled:opacity-100"
                                          : "border-border text-text-secondary hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                                      )}
                                    >
                                      {t(locale, "chatYes")}
                                    </button>
                                    <button
                                      type="button"
                                      disabled={loading}
                                      onClick={() => handleChoice("later")}
                                      className={cn(
                                        "rounded-md border bg-transparent px-2.5 py-1.5 text-[9px] font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed",
                                        m.choice === "later"
                                          ? "border-primary/40 bg-primary/10 text-primary disabled:opacity-100"
                                          : "border-border text-text-secondary hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                                      )}
                                    >
                                      {t(locale, "chatMaybeLater")}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // AI message
                      return (
                        <div key={m.id} className="flex justify-start gap-2">
                          {isFirst ? (
                            <AiAvatar />
                          ) : (
                            <span aria-hidden="true" className="size-7 shrink-0" />
                          )}
                          <div className="min-w-0 max-w-[82%]">
                            {isFirst ? <AiSenderLabel locale={locale} /> : null}
                            <div
                              className={cn(
                                "whitespace-pre-line border border-card-border bg-card-dark px-4 py-3 text-sm leading-relaxed text-text-primary",
                                isLast
                                  ? "rounded-2xl rounded-bl-md"
                                  : "rounded-2xl"
                              )}
                            >
                              {m.content}
                              {m.readMore ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenReadMore((v) =>
                                        v === m.id ? null : m.id
                                      )
                                    }
                                    className="mt-2 block text-[8px] font-medium uppercase tracking-wide text-primary/60 underline decoration-primary/25 underline-offset-2 transition-colors hover:text-primary/80"
                                  >
                                    {t(locale, "chatReadMore")}
                                  </button>
                                  {openReadMore === m.id ? (
                                    <div className="mt-2 rounded-lg border border-border bg-surface-soft/60 px-3 py-2">
                                      <p className="text-[11px] leading-relaxed text-text-muted">
                                        {m.readMore}
                                      </p>
                                    </div>
                                  ) : null}
                                </>
                              ) : null}
                            </div>
                            {isLast ? (
                              <MessageTime iso={m.created_at} locale={locale} />
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

            </div>

            {loading ? (
              <div className="chat-msg-in mt-4 flex justify-start">
                <div
                  role="status"
                  aria-label={t(locale, "chatTyping")}
                  className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-surface px-4 py-3.5"
                >
                  <span className="chat-typing-dot size-1.5 rounded-full bg-text-muted" />
                  <span className="chat-typing-dot size-1.5 rounded-full bg-text-muted [animation-delay:150ms]" />
                  <span className="chat-typing-dot size-1.5 rounded-full bg-text-muted [animation-delay:300ms]" />
                </div>
              </div>
            ) : null}
            {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
            </div>
            {/* Topic panels — kept mounted and hidden while the conversation
                is active, so their content never reloads on switch */}
            <div
              className={cn(
                "m-auto w-full",
                view === "chat" && "hidden"
              )}
            >
                {view === "services" ? (
                  <ServicesPanel
                    locale={locale}
                    services={services}
                    servicePageSlugs={servicePageSlugs}
                    onAsk={askAboutService}
                    onBack={() => switchView("chat")}
                  />
                ) : view === "pricing" ? (
                  <PricingPanel
                    locale={locale}
                    plans={plans}
                    onAskPricing={askAboutPricing}
                    onContact={openContactPopup}
                    onBack={() => switchView("chat")}
                  />
                ) : view === "faq" ? (
                  <FaqPanel
                    locale={locale}
                    openFaq={openFaq}
                    onToggleFaq={(index) =>
                      setOpenFaq((v) => (v === index ? null : index))
                    }
                    onBack={() => switchView("chat")}
                  />
                ) : (
                  <SupportPanel
                    locale={locale}
                    onContact={openContactPopup}
                    onBack={() => switchView("chat")}
                  />
                )}
              </div>
          </div>

          {/* Footer — input, quick actions, brand */}
          {stage === "emailQuestion" ? null : (
            <footer className="flex flex-none flex-col border-t border-border bg-background">
              <form
                onSubmit={handleSubmit}
                className="px-4 pb-2 pt-3"
              >
                {/* Single merged box: input + upload + send all inside one container */}
                <div className="flex items-center gap-1 rounded-[10px] border border-card-border bg-card-dark py-1 pl-1.5 pr-1.5 transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/25 focus-within:outline-none has-[:disabled]:opacity-60">
                  <div className="relative min-w-0 flex-1">
                    {stage === "name" ? (
                      <UserIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                    ) : stage === "emailInput" ? (
                      <MailIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                    ) : null}
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      type={stage === "emailInput" ? "email" : "text"}
                      disabled={loading || stage === "loading"}
                      enterKeyHint={
                        stage === "emailInput"
                          ? "go"
                          : stage === "chat"
                            ? "send"
                            : "done"
                      }
                      autoComplete={
                        stage === "emailInput"
                          ? "email"
                          : stage === "name"
                            ? "name"
                            : "off"
                      }
                      placeholder={
                        stage === "name"
                          ? t(locale, "chatYourNamePlaceholder")
                          : stage === "emailInput"
                            ? t(locale, "chatYourEmailPlaceholder")
                            : t(locale, "chatPlaceholder")
                      }
                      aria-label={
                        stage === "name"
                          ? t(locale, "chatYourNamePlaceholder")
                          : stage === "emailInput"
                            ? t(locale, "chatYourEmailPlaceholder")
                            : t(locale, "chatPlaceholder")
                      }
                      className={cn(
                        "w-full bg-transparent py-2 pr-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                        stage === "name" || stage === "emailInput"
                          ? "pl-8"
                          : "pl-2.5"
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={t(locale, "chatUploadFile")}
                    disabled
                    className="flex size-9 shrink-0 items-center justify-center rounded-[10px] text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <PaperclipIcon className="size-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || loading || stage === "loading"}
                    aria-label={t(locale, "chatSend")}
                    className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-text-inverse transition-all hover:bg-primary-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <SendIcon />
                  </button>
                </div>
              </form>

              {/* Status line — replaces the quick actions */}
              {stage === "chat" ? (
                <div className="flex items-center justify-center border-t border-border px-4 pb-2 pt-2">
                  <p className="text-[9px] font-normal tracking-wide text-text-subtle">
                    {t(locale, "chatStatusLine")}
                  </p>
                </div>
              ) : null}

              {/* Brand line */}
              <div className="flex items-center justify-center gap-1.5 border-t border-border-subtle px-4 pb-[calc(0.625rem+env(safe-area-inset-bottom))] pt-2.5">
                <HeartIcon className="size-3 text-primary/70" />
                <span className="text-[11px] font-medium text-text-muted">
                  {t(locale, "chatBuiltBy")}
                </span>
              </div>
            </footer>
          )}
        </div>
        </>
      ) : null}

      {/* Toggle button (hidden while open) */}
      {!open ? (
        <button
          type="button"
          aria-label={t(locale, "chatOpen")}
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 hidden size-14 items-center justify-center rounded-[10px] border border-primary/50 bg-primary/10 text-primary shadow-amber transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/70 hover:bg-primary/15 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:flex lg:bottom-6 lg:right-6"
        >
          <ChatIcon className="size-6" />
        </button>
      ) : null}
    </>
  );
}
