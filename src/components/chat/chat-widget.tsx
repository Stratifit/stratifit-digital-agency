"use client";

import * as React from "react";
import { sendVisitorMessage } from "@/features/chat/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!mounted) return null;

  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return null;
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((m) => [...m, { id: crypto.randomUUID(), sender: "visitor", content: trimmed }]);
    setInput("");
    setLoading(true);
    setError(null);

    const result = await sendVisitorMessage({
      visitor_token: getToken(),
      message: trimmed,
      locale: "en",
      source_page: typeof window !== "undefined" ? window.location.pathname : "/",
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
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
          content: "A team member has been notified and will help shortly.",
        },
      ]);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="flex h-[480px] w-[min(92vw,360px)] flex-col overflow-hidden rounded-radius-lg border border-border bg-surface-elevated shadow-shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-medium text-text-primary">Stratifit Chat</p>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-radius-xs p-1 text-text-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-sm text-text-secondary">
                Hi! Ask us anything about Stratifit — services, pricing, or process.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-radius-md px-3 py-2 text-sm ${
                    m.sender === "visitor"
                      ? "ml-auto bg-primary text-text-inverse"
                      : m.sender === "system"
                        ? "bg-surface text-text-muted"
                        : "bg-surface text-text-primary"
                  }`}
                >
                  {m.content}
                </div>
              ))
            )}
            {loading ? (
              <div className="w-fit rounded-radius-md bg-surface px-3 py-2 text-sm text-text-muted">
                …
              </div>
            ) : null}
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              aria-label="Chat message"
              className="h-9"
            />
            <Button type="submit" size="small" loading={loading}>
              Send
            </Button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-text-inverse shadow-shadow-amber transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

