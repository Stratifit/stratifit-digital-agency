"use client";

import * as React from "react";
import {
  sendVisitorMessage,
  getVisitorChatState,
  submitVisitorName,
  updateVisitorName,
  submitVisitorEmailChoice,
  type ChatStoredMessage,
  type ChatVisitorState,
} from "@/features/chat/mutations";
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

function getLocale(): string {
  return typeof document !== "undefined"
    ? document.documentElement.lang || "en"
    : "en";
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
  }));
}

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<WidgetMessage[]>([]);
  const [input, setInput] = React.useState("");
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

  // Load persisted conversation state whenever the widget opens
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const result = await getVisitorChatState({
        visitor_token: getToken(),
        locale: getLocale(),
        source_page:
          typeof window !== "undefined" ? window.location.pathname : "/",
      });
      if (cancelled || !result.success || !result.data) return;
      const data = result.data;
      setVisitor(data.visitor);
      setMessages(toWidgetMessages(data.messages));
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
  }, [open]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading, stage]);

  if (!mounted) return null;

  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return null;
  }

  async function sendChatMessage(content: string) {
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

  async function handleNameSubmit() {
    const name = input.trim();
    if (!name || loading) return;
    setError(null);
    setLoading(true);
    const result = await submitVisitorName({
      visitor_token: getToken(),
      name,
      locale: getLocale(),
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? t(getLocale(), "chatError"));
      return;
    }
    if (!result.data) {
      setError(t(getLocale(), "chatError"));
      return;
    }
    setVisitor((v) => ({ ...v, name }));
    setMessages(toWidgetMessages(result.data.messages));
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
      locale: getLocale(),
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? t(getLocale(), "chatError"));
      return;
    }
    if (!result.data) {
      setError(t(getLocale(), "chatError"));
      return;
    }
    setVisitor((v) => ({ ...v, email, email_choice: "yes", onboarding_complete: true }));
    setMessages(toWidgetMessages(result.data.messages));
    setInput("");
    setStage("chat");
  }

  async function handleChoice(choice: "yes" | "later") {
    if (loading) return;
    setError(null);
    setLoading(true);
    const result = await submitVisitorEmailChoice({
      visitor_token: getToken(),
      choice,
      locale: getLocale(),
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? t(getLocale(), "chatError"));
      return;
    }
    if (!result.data) {
      setError(t(getLocale(), "chatError"));
      return;
    }
    setVisitor((v) => ({ ...v, email_choice: choice, onboarding_complete: true }));
    setMessages(toWidgetMessages(result.data.messages));
    setStage(choice === "yes" ? "emailInput" : "chat");
  }

  async function handleEditName() {
    const current = visitor.name || "";
    const next = window.prompt(t(getLocale(), "chatEditName"), current);
    if (!next || !next.trim() || next.trim() === current) return;
    const result = await updateVisitorName({
      visitor_token: getToken(),
      name: next.trim(),
    });
    if (result.success) {
      setVisitor((v) => ({ ...v, name: next.trim() }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (stage === "name") {
      handleNameSubmit();
    } else if (stage === "emailInput") {
      handleEmailSubmit();
    } else if (stage === "chat") {
      sendChatMessage(input);
    }
  }

  const locale = getLocale();
  const welcomeParts = t(locale, "chatWelcome").split(" — ");
  const emailQuestion = t(locale, "chatEmailQuestion").replace(
    "{name}",
    visitor.name
  );

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

          {/* Topic chips — only after onboarding */}
          {stage === "chat" ? (
            <div className="flex flex-none border-b border-border-subtle bg-background px-4 py-3">
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {TOPIC_CHIPS.map((chip, index) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => sendChatMessage(t(locale, chip.key))}
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
          ) : null}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <div className="space-y-4">
              {/* Welcome bubble */}
              {stage === "name" ? (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl border border-card-border bg-card-dark px-4 py-3">
                    <div className="mb-2 flex items-center gap-1.5 border-b border-border pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-primary/80">
                        {t(locale, "chatName")}
                      </span>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                      <strong className="font-semibold text-text-primary">
                        {welcomeParts[0]}
                      </strong>
                      {welcomeParts[1] ? ` — ${welcomeParts[1]}` : ""}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2">
                      <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wide text-primary/75">
                        <LockIcon className="size-2.5" />
                        {t(locale, "chatDataSafe")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPrivacyNote((v) => !v)}
                        className="text-[9px] font-medium uppercase tracking-wide text-primary/75 underline underline-offset-2 transition-opacity hover:opacity-100"
                      >
                        {t(locale, "chatReadMore")}
                      </button>
                    </div>
                    {showPrivacyNote ? (
                      <p className="mt-2 text-[10px] leading-relaxed text-text-muted">
                        {t(locale, "chatPrivacyNote")}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Stored messages */}
              {(() => {
                let userCount = 0;
                return messages.map((m) => {
                  if (m.sender === "visitor") {
                    userCount += 1;
                    return (
                      <div key={m.id} className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl bg-surface px-4 py-3">
                          <div className="mb-1.5 flex items-center justify-end gap-1.5 border-b border-border pb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-primary/70">
                              {String(userCount).padStart(3, "0")} {visitor.name}
                            </span>
                            <button
                              type="button"
                              aria-label={t(locale, "chatEditName")}
                              onClick={handleEditName}
                              className="text-text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              <PencilIcon className="size-3" />
                            </button>
                          </div>
                          <p className="text-sm leading-relaxed text-text-primary">
                            {m.content}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  if (m.sender === "system") {
                    return (
                      <div key={m.id} className="flex justify-start">
                        <div className="max-w-[85%] rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-text-muted">
                          {m.content}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-[85%] whitespace-pre-line rounded-2xl border border-card-border bg-card-dark px-4 py-3 text-sm leading-relaxed text-text-primary">
                        {m.content}
                      </div>
                    </div>
                  );
                });
              })()}

              {/* Email question bubble */}
              {stage === "emailQuestion" ? (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl border border-card-border bg-card-dark px-4 py-3">
                    <div className="mb-2 flex items-center gap-1.5 border-b border-border pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-primary/80">
                        {t(locale, "chatName")}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {emailQuestion}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1 border-t border-border pt-2">
                      <LockIcon className="size-2.5 text-primary/75" />
                      <span className="text-[9px] font-medium uppercase tracking-wide text-primary/75">
                        {t(locale, "chatDataSafe")}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleChoice("yes")}
                        className="flex-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20 disabled:opacity-50"
                      >
                        {t(locale, "chatYes")}
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleChoice("later")}
                        className="flex-1 rounded-full border border-border bg-white/10 px-3 py-1.5 text-xs font-semibold text-text-primary transition-all hover:border-primary/30 hover:bg-primary/20 disabled:opacity-50"
                      >
                        {t(locale, "chatMaybeLater")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

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

          {/* Input / actions */}
          {stage === "emailQuestion" ? null : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-none items-center gap-2 border-t border-border bg-background px-4 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type={stage === "emailInput" ? "email" : "text"}
                disabled={loading || stage === "loading"}
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
                className="flex-1 rounded-xl border border-card-border bg-card-dark px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-primary/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || stage === "loading"}
                aria-label={t(locale, "chatSend")}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-text-inverse transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-30"
              >
                <SendIcon />
              </button>
            </form>
          )}
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
