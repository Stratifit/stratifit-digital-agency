"use client";

import * as React from "react";
import { sendVisitorMessage } from "@/features/chat/mutations";
import { t, type UiStringKey } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";

interface WidgetMessage {
  id: string;
  sender: "visitor" | "ai" | "system";
  content: string;
}

const TOKEN_KEY = "stratifit-chat-token";

function getToken(): string {
  if (typeof window === "undefined") return "";
  let token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

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

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
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

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
  );
}

// ============================================================================
// Chat widget
// ============================================================================

const TOPIC_CHIPS: {
  key: UiStringKey;
  icon: (props: { className?: string }) => React.ReactNode;
}[] = [
  { key: "chatChat", icon: ChatIcon },
  { key: "chatFaq", icon: InfoIcon },
  { key: "chatServices", icon: BriefcaseIcon },
  { key: "chatPricing", icon: DollarIcon },
  { key: "chatSupport", icon: CogIcon },
  { key: "chatAbout", icon: BuildingIcon },
];

const QUICK_REPLIES: UiStringKey[] = [
  "chatFaq",
  "chatServices",
  "chatPricing",
  "chatSupport",
  "chatHelp",
  "chatContact",
];

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<WidgetMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  if (!mounted) return null;

  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return null;
  }

  function getLocale(): string {
    return typeof document !== "undefined"
      ? document.documentElement.lang || "en"
      : "en";
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    setMessages((m) => [...m, { id: crypto.randomUUID(), sender: "visitor", content: trimmed }]);
    setInput("");
    setError(null);
    setLoading(true);

    const result = await sendVisitorMessage({
      visitor_token: getToken(),
      message: trimmed,
      locale: getLocale(),
      source_page: typeof window !== "undefined" ? window.location.pathname : "/",
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? t(getLocale(), "chatError"));
      return;
    }

    if (result.data?.ai_reply) {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), sender: "ai", content: result.data!.ai_reply! },
      ]);
    }
    if (result.data?.escalated) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          sender: "system",
          content: t(getLocale(), "chatEscalated"),
        },
      ]);
    }
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function sendTopic(key: UiStringKey) {
    sendMessage(t(getLocale(), key));
  }

  const locale = getLocale();

  return (
    <>
      {open ? (
        <div className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[92dvh] flex-col overflow-hidden rounded-t-2xl border-t border-border bg-background shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] lg:inset-x-auto lg:bottom-6 lg:right-6 lg:max-h-[80vh] lg:w-[400px] lg:rounded-2xl lg:border lg:border-border xl:w-[440px]">
          {/* Header */}
          <div className="flex flex-none items-center justify-between rounded-t-2xl border-b border-border bg-background/95 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-text-inverse">
                <ChatIcon className="size-5" />
              </span>
              <div>
                <p className="font-display text-sm font-black text-text-primary">
                  {t(locale, "chatName")}
                </p>
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-success" />
                  <span className="text-[9px] font-medium text-text-muted">
                    {t(locale, "chatOnline")}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label={t(locale, "chatClose")}
              onClick={() => setOpen(false)}
              className="-mr-2 p-2 text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Topic chips */}
          <div className="flex flex-none border-b border-border-subtle bg-background px-4 py-3">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TOPIC_CHIPS.map((chip, index) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => sendTopic(chip.key)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all",
                    index === 0
                      ? "border-primary bg-primary text-text-inverse"
                      : "border-border bg-white/5 text-text-primary hover:border-primary/30 hover:bg-white/10"
                  )}
                >
                  <chip.icon
                    className={cn(
                      "size-3.5",
                      index === 0 ? "text-text-inverse" : "text-primary"
                    )}
                  />
                  {t(locale, chip.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="menu-scroll flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl border border-card-border bg-card-dark px-4 py-3">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                    {t(locale, "chatGreeting")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {QUICK_REPLIES.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => sendTopic(key)}
                        className="rounded-full border border-border bg-white/10 px-3 py-1.5 text-[11px] font-medium text-text-primary transition-all hover:border-primary/30 hover:bg-primary/20"
                      >
                        {t(locale, key)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) =>
                  m.sender === "visitor" ? (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm leading-relaxed text-text-inverse">
                        {m.content}
                      </div>
                    </div>
                  ) : m.sender === "system" ? (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-text-muted">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-[85%] whitespace-pre-line rounded-2xl border border-card-border bg-card-dark px-4 py-3 text-sm leading-relaxed text-text-primary">
                        {m.content}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
            {loading ? (
              <div className="mt-4 flex justify-start">
                <div className="rounded-2xl bg-surface px-4 py-3 text-sm text-text-muted">
                  …
                </div>
              </div>
            ) : null}
            {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex flex-none items-center gap-2 border-t border-border bg-background px-4 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t(locale, "chatPlaceholder")}
              aria-label={t(locale, "chatPlaceholder")}
              className="flex-1 rounded-xl border border-card-border bg-card-dark px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-primary/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label={t(locale, "chatSend")}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-text-inverse transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-30"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      ) : null}

      {/* Toggle button (hidden while open) */}
      {!open ? (
        <button
          type="button"
          aria-label={t(locale, "chatOpen")}
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-text-inverse shadow-shadow-amber transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:bottom-6 lg:right-6"
        >
          <ChatIcon className="size-6" />
        </button>
      ) : null}
    </>
  );
}
