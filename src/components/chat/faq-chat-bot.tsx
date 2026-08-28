"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  sendFaqBotMessage,
  getFaqBotChatState,
  resetFaqBotChat,
} from "@/features/faq-bot/mutations";
import type { ChatStoredMessage } from "@/features/chat/mutations";
import type { PublicFaqBotSettings } from "@/features/faq-bot/queries";
import { t } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";
import { setLocale } from "@/actions/locale";
import { resolvePublicTranslation as resolveTranslation } from "@/lib/i18n/public-translation";

interface FaqBotMessage {
  id: string;
  sender: "visitor" | "ai" | "system";
  content: string;
  created_at: string;
  /** True for a locally-appended copy that the server has not confirmed yet. */
  optimistic?: boolean;
}

const TOKEN_KEY = "stratifit-chat-token";
const LANG_KEY = "stratifit-chat-lang";
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

function getDefaultLang(fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(LANG_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const doc = document.documentElement.lang;
  return doc && SUPPORTED_LANGS.includes(doc) ? doc : fallback;
}

// ============================================================================
// Icons (same style as the main chat widget)
// ============================================================================

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
      <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 0 1 15.9-5.4" />
      <path d="M21 12a9 9 0 0 1-15.9 5.4" />
      <path d="M21 3v6h-6" />
      <path d="M3 21v-6h6" />
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

function toBotMessages(rows: ChatStoredMessage[]): FaqBotMessage[] {
  return rows.map((row) => ({
    id: row.id,
    sender: row.sender_type === "visitor" ? "visitor" : row.sender_type === "system" ? "system" : "ai",
    content: row.content,
    created_at: row.created_at,
  }));
}

/**
 * Merges freshly-stored server messages into the live FAQ-bot list while it is
 * open. Anything already shown (by id) is skipped; a stored row that matches an
 * optimistic local copy (same sender + content) replaces it in place, so the
 * visitor's own send, the AI reply, or the escalation bubble never duplicate —
 * regardless of clock skew. Rows with no matching copy (admin replies, system
 * messages) are appended.
 */
function mergeBotMessages(
  current: FaqBotMessage[],
  incoming: ChatStoredMessage[]
): FaqBotMessage[] {
  if (incoming.length === 0) return current;
  const byId = new Set(current.map((m) => m.id));
  const next = [...current];
  for (const row of incoming) {
    if (byId.has(row.id)) continue;
    const sender =
      row.sender_type === "visitor"
        ? "visitor"
        : row.sender_type === "system"
          ? "system"
          : "ai";
    // The escalation is stored as an `ai` message but shown as a `system`
    // bubble in the widget — match the optimistic copy on content only.
    const optimisticIdx = next.findIndex(
      (m) =>
        m.optimistic &&
        m.content === row.content &&
        (m.sender === sender || (m.sender === "system" && sender === "ai"))
    );
    if (optimisticIdx >= 0) {
      next[optimisticIdx] = {
        id: row.id,
        sender: next[optimisticIdx].sender,
        content: row.content,
        created_at: row.created_at,
        optimistic: false,
      };
      byId.add(row.id);
      continue;
    }
    next.push({
      id: row.id,
      sender,
      content: row.content,
      created_at: row.created_at,
    });
    byId.add(row.id);
  }
  return next;
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

export function FaqChatBot({
  locale: serverLocale,
  settings,
}: {
  locale: string;
  settings: PublicFaqBotSettings | null;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const closingRef = React.useRef(false);
  const [messages, setMessages] = React.useState<FaqBotMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  /** True while an admin is typing a reply in the conversation inbox. */
  const [adminTyping, setAdminTyping] = React.useState(false);
  const [lang, setLang] = React.useState<string>(() => getDefaultLang(serverLocale));
  const [langOpen, setLangOpen] = React.useState(false);
  const langRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const messagesScrollRef = React.useRef<HTMLDivElement>(null);

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Open from the FAQ section's "Ask More Questions" card.
  React.useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener("stratifit:open-faq-bot", handleOpen);
    return () => window.removeEventListener("stratifit:open-faq-bot", handleOpen);
  }, []);

  // Keep the bot language in sync with the website locale switcher.
  React.useEffect(() => {
    function onLocaleChange(event: Event) {
      const next = (event as CustomEvent<{ locale: string }>).detail?.locale;
      if (next && SUPPORTED_LANGS.includes(next)) {
        setLang(next);
        setLangOpen(false);
        try {
          window.localStorage.setItem(LANG_KEY, next);
        } catch {
          // Storage unavailable — ignore.
        }
      }
    }
    window.addEventListener("stratifit:locale-change", onLocaleChange);
    return () => window.removeEventListener("stratifit:locale-change", onLocaleChange);
  }, []);

  // Close the language menu on outside click.
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

  // While open: lock body scroll and close on Escape (from inside the dialog).
  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const target = event.target as HTMLElement | null;
      if (!target || !panelRef.current?.contains(target)) return;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      closeChat();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Move focus into the dialog when it opens.
  React.useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  // Load the persisted FAQ-bot conversation when the bot opens.
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const result = await getFaqBotChatState({
        visitor_token: getToken(),
        locale: lang,
        source_page: typeof window !== "undefined" ? window.location.pathname : "/",
      });
      if (cancelled || !result.success || !result.data) return;
      setMessages(toBotMessages(result.data.messages));
      setError(null);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Live updates while the bot is open: admin replies (and typing) live in
  // admin-only RLS tables, so an anonymous visitor cannot subscribe to
  // realtime. Poll the trusted server action every 2.5s while open and merge
  // any newly stored admin/system messages so a human reply shows at once.
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const timer: ReturnType<typeof setInterval> | undefined = setInterval(
      poll,
      2500
    );

    async function poll() {
      const result = await getFaqBotChatState({
        visitor_token: getToken(),
        locale: lang,
        source_page:
          typeof window !== "undefined" ? window.location.pathname : "/",
      });
      if (cancelled || !result.success || !result.data) return;
      const data = result.data;
      const typingAt = data.admin_typing_at
        ? new Date(data.admin_typing_at).getTime()
        : 0;
      // Fresh typing signal (admin set it within the last ~4s).
      setAdminTyping(Boolean(typingAt) && Date.now() - typingAt < 4000);
      setMessages((prev) => mergeBotMessages(prev, data.messages));
    }

    poll();
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [open, lang]);

  // Pin the message tail to the bottom when messages change.
  React.useLayoutEffect(() => {
    if (!open) return;
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  }, [open, messages, loading]);

  if (!mounted) return null;

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

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        sender: "visitor",
        content: trimmed,
        created_at: new Date().toISOString(),
        optimistic: true,
      },
    ]);
    setInput("");
    setError(null);
    setLoading(true);

    const result = await sendFaqBotMessage({
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
      const aiReply = result.data.ai_reply;
      setMessages((m) =>
        m.some((x) => x.sender === "ai" && x.content === aiReply)
          ? m // a poll already delivered the stored copy — do not append a second one
          : [
              ...m,
              {
                id: crypto.randomUUID(),
                sender: "ai",
                content: aiReply,
                created_at: new Date().toISOString(),
                optimistic: true,
              },
            ]
      );
    }
    if (result.data?.escalated) {
      // Use the exact text the server stored so the optimistic bubble matches
      // the stored row and the poll replaces it instead of adding a second one.
      const escalationMessage =
        result.data.escalation_message ?? t(lang, "chatEscalated");
      setMessages((m) =>
        m.some((x) => x.content === escalationMessage)
          ? m
          : [
              ...m,
              {
                id: crypto.randomUUID(),
                sender: "system",
                content: escalationMessage,
                created_at: new Date().toISOString(),
                optimistic: true,
              },
            ]
      );
    }
  }

  async function handleRestart() {
    if (loading) return;
    setError(null);
    setLoading(true);
    const result = await resetFaqBotChat({
      visitor_token: getToken(),
      locale: lang,
    });
    setLoading(false);
    if (result.success && result.data) {
      setMessages(toBotMessages(result.data.messages));
      setInput("");
    }
  }

  async function selectLang(code: string) {
    setLang(code);
    setLangOpen(false);
    try {
      window.localStorage.setItem(LANG_KEY, code);
    } catch {
      // Storage unavailable — ignore.
    }
    document.documentElement.lang = code;
    await setLocale(code);
    router.refresh();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  // Trap Tab focus inside the dialog, mirroring the main chat widget.
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

  const locale = lang;
  const welcome =
    resolveTranslation(settings?.welcome_message_translations ?? null, locale) ||
    t(locale, "faqBotWelcomeFallback");

  const suggestions = (settings?.suggested_question_translations ?? [])
    .map((item) => resolveTranslation(item ?? null, locale))
    .filter(Boolean);

  // The welcome bubble + suggestion chips stay visible until the visitor asks.
  const hasConversation = messages.some((m) => m.sender === "visitor");

  return (
    <>
      {open ? (
        <>
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
            {/* Header — same design language as the main chat widget */}
            <div className="relative flex flex-none items-center justify-between rounded-t-lg border-b border-border bg-background/95 px-4 py-3">
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
                      {loading ? t(locale, "chatTypingStatus") : t(locale, "chatOnline")}
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
                    <div className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[120px] overflow-hidden rounded-md border border-border bg-field-bg shadow-2xl">
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
                  <RefreshIcon className="size-[18px]" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  aria-label={t(locale, "chatClose")}
                  onClick={closeChat}
                  className="-mr-2 p-2 text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="size-[22px]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesScrollRef}
              aria-live="polite"
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {/* Welcome bubble */}
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/25 to-primary/10 text-primary ring-1 ring-primary/20">
                  <ChatIcon className="size-3.5" />
                </span>
                <div className="max-w-[85%]">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-primary/70">
                    {t(locale, "chatName")}
                  </span>
                  <div className="chat-msg-in rounded-2xl rounded-tl-sm border border-border bg-card-dark px-3.5 py-2.5 text-sm leading-relaxed text-text-secondary">
                    {welcome}
                  </div>
                </div>
              </div>

              {messages.map((message) =>
                message.sender === "visitor" ? (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-[85%]">
                      <div className="chat-msg-in rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-text-inverse">
                        {message.content}
                      </div>
                      <time
                        dateTime={message.created_at}
                        className="mt-1 block pr-1 text-right text-[11px] font-medium text-text-subtle"
                      >
                        {formatMessageTime(message.created_at, locale)}
                      </time>
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/25 to-primary/10 text-primary ring-1 ring-primary/20">
                      <ChatIcon className="size-3.5" />
                    </span>
                    <div className="max-w-[85%]">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-primary/70">
                        {t(locale, "chatName")}
                      </span>
                      <div
                        className={cn(
                          "chat-msg-in rounded-2xl rounded-tl-sm border px-3.5 py-2.5 text-sm leading-relaxed",
                          message.sender === "system"
                            ? "border-secondary/20 bg-secondary/10 text-text-secondary"
                            : "border-border bg-card-dark text-text-secondary"
                        )}
                      >
                        {message.content}
                      </div>
                      <time
                        dateTime={message.created_at}
                        className="mt-1 block pl-1 text-[11px] font-medium text-text-subtle"
                      >
                        {formatMessageTime(message.created_at, locale)}
                      </time>
                    </div>
                  </div>
                )
              )}

              {/* Typing indicator */}
              {loading ? (
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/25 to-primary/10 text-primary ring-1 ring-primary/20">
                    <ChatIcon className="size-3.5" />
                  </span>
                  <div className="rounded-2xl rounded-tl-sm border border-border bg-card-dark px-3.5 py-3">
                    <span className="sr-only">{t(locale, "chatTypingStatus")}</span>
                    <span className="flex items-center gap-1">
                      <span className="size-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.3s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.15s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-text-muted" />
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Admin typing indicator — live from the conversation inbox */}
              {!loading && adminTyping ? (
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/25 to-primary/10 text-primary ring-1 ring-primary/20">
                    <ChatIcon className="size-3.5" />
                  </span>
                  <div
                    role="status"
                    aria-label={t(locale, "chatAdminTyping")}
                    className="rounded-2xl rounded-tl-sm border border-primary/25 bg-primary/10 px-3.5 py-3"
                  >
                    <span className="sr-only">{t(locale, "chatAdminTyping")}</span>
                    <span className="flex items-center gap-1">
                      <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-primary" />
                    </span>
                  </div>
                </div>
              ) : null}

              {error ? (
                <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
                  {error}
                </p>
              ) : null}

              {/* Default question chips — shown until the visitor asks */}
              {!hasConversation && suggestions.length > 0 ? (
                <div className="pt-1">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    {t(locale, "faqBotSuggestionsTitle")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((question, index) => (
                      <button
                        key={`${question}-${index}`}
                        type="button"
                        onClick={() => sendMessage(question)}
                        disabled={loading}
                        className="chat-msg-in rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-left text-xs font-medium text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Input */}
            <footer className="flex-none border-t border-border">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2.5">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-field-bg px-2 transition-colors focus-within:border-primary/40 focus-within:outline focus-within:outline-2 focus-within:outline-primary/60 focus-within:outline-offset-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t(locale, "chatPlaceholder")}
                    aria-label={t(locale, "chatPlaceholder")}
                    className="w-full bg-transparent py-2 pl-2.5 pr-2 text-sm text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label={t(locale, "chatSend")}
                  className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-text-inverse transition-all hover:bg-primary-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <SendIcon className="size-5" />
                </button>
              </form>

              {/* Status line */}
              <div className="flex items-center justify-center border-t border-border px-4 pb-2 pt-2">
                <p className="text-[9px] font-normal tracking-wide text-text-subtle">
                  {t(locale, "chatStatusLine")}
                </p>
              </div>

              {/* Brand line */}
              <div className="flex items-center justify-center gap-1.5 border-t border-border-subtle px-4 pb-[calc(0.625rem+env(safe-area-inset-bottom))] pt-2.5">
                <HeartIcon className="size-3 text-primary/70" />
                <span className="text-[11px] font-medium text-text-muted">
                  {t(locale, "chatBuiltBy")}
                </span>
              </div>
            </footer>
          </div>
        </>
      ) : null}
    </>
  );
}
