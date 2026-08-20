"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  adminReply,
  setAdminTyping,
  takeOverConversation,
  returnToAi,
  resolveConversation,
  archiveConversation,
} from "@/features/chat/admin-mutations";
import { paddedVisitorNumber, type AdminVisitorSummary } from "@/features/chat/admin-shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DetailData {
  id: string;
  status: string;
  mode: string;
  bot_type: string;
  visitor: AdminVisitorSummary;
  messages: {
    id: string;
    sender_type: string;
    content: string;
    is_internal: boolean;
    created_at: string;
  }[];
}

const STATUS_LABEL: Record<string, string> = {
  open: "Online",
  waiting_for_admin: "Waiting",
  waiting_for_visitor: "Human takeover",
  resolved: "Resolved",
  archived: "Archived",
};

export function ConversationDetail({ conversation }: { conversation: DetailData }) {
  const router = useRouter();
  const [reply, setReply] = React.useState("");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [isInternal, setIsInternal] = React.useState(false);

  async function run(action: string, fn: () => Promise<unknown>) {
    setBusy(action);
    await fn();
    setBusy(null);
  }

  // Live typing indicator for the visitor widget: throttled "typing" signal
  // while the admin types a non-internal reply, auto-cleared a few seconds
  // after they stop, and cleared on blur/send so the visitor never sees a
  // stale indicator.
  const typingTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const lastTypingSentRef = React.useRef(0);

  function signalTyping() {
    if (isInternal) return;
    const now = Date.now();
    if (now - lastTypingSentRef.current > 1500) {
      lastTypingSentRef.current = now;
      void setAdminTyping(conversation.id, true);
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      lastTypingSentRef.current = 0;
      void setAdminTyping(conversation.id, false);
    }, 3000);
  }

  function clearTyping() {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    lastTypingSentRef.current = 0;
    void setAdminTyping(conversation.id, false);
  }

  React.useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      void setAdminTyping(conversation.id, false);
    };
  }, [conversation.id]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    const content = reply.trim();
    if (!content) return;
    clearTyping();
    setBusy("reply");
    await adminReply(conversation.id, { content, is_internal: isInternal });
    setReply("");
    setIsInternal(false);
    setBusy(null);
    router.refresh();
  }

  const number = paddedVisitorNumber(conversation.visitor.visitor_number);

  return (
    <div className="space-y-6">
      {/* Visitor header */}
      <div className="rounded-card border border-card-border bg-card-dark p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm font-bold text-primary">
            {number}
          </span>
          <h2 className="font-display text-lg font-bold tracking-tight text-text-primary">
            {number} — {conversation.visitor.name}
          </h2>
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          <div>
            <dt className="inline text-text-muted">Status · </dt>
            <dd className="inline font-medium text-text-primary">
              {STATUS_LABEL[conversation.status] ?? conversation.status}
            </dd>
          </div>
          <div>
            <dt className="inline text-text-muted">Email · </dt>
            <dd className="inline text-text-primary">
              {conversation.visitor.email || "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="inline text-text-muted">Language · </dt>
            <dd className="inline uppercase text-text-primary">
              {conversation.visitor.preferred_locale}
            </dd>
          </div>
          <div>
            <dt className="inline text-text-muted">Started · </dt>
            <dd className="inline text-text-primary">
              {new Date(conversation.visitor.first_seen_at).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="inline text-text-muted">Last activity · </dt>
            <dd className="inline text-text-primary">
              {new Date(conversation.visitor.last_seen_at).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <BadgeLabel label={conversation.status} />
          <BadgeLabel label={`mode: ${conversation.mode}`} />
          {conversation.bot_type === "faq" ? (
            <span className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary-light">
              FAQ bot
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {conversation.mode !== "human" ? (
            <Button
              size="small"
              variant="secondary"
              loading={busy === "takeover"}
              onClick={() => run("takeover", () => takeOverConversation(conversation.id).then(() => router.refresh()))}
            >
              Take Over
            </Button>
          ) : (
            <Button
              size="small"
              variant="secondary"
              loading={busy === "return"}
              onClick={() => run("return", () => returnToAi(conversation.id).then(() => router.refresh()))}
            >
              Return to AI
            </Button>
          )}
          {conversation.status !== "resolved" ? (
            <Button
              size="small"
              loading={busy === "resolve"}
              onClick={() => run("resolve", () => resolveConversation(conversation.id).then(() => router.refresh()))}
            >
              Resolve
            </Button>
          ) : null}
          {conversation.status !== "archived" ? (
            <Button
              size="small"
              variant="destructive"
              loading={busy === "archive"}
              onClick={() => run("archive", () => archiveConversation(conversation.id).then(() => router.refresh()))}
            >
              Archive
            </Button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-card border border-card-border bg-card-dark p-4 shadow-sm">
        {conversation.messages.length === 0 ? (
          <p className="text-sm text-text-muted">No messages yet.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {conversation.messages.map((m) => {
              const fromVisitor = m.sender_type === "visitor";
              const isInternal = m.is_internal;
              return (
                <div
                  key={m.id}
                  className={`flex w-full ${fromVisitor ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      fromVisitor
                        ? "rounded-br-md bg-primary text-text-inverse"
                        : isInternal
                          ? "rounded-bl-md border border-dashed border-border bg-surface-hover italic text-text-muted"
                          : m.sender_type === "admin"
                            ? "rounded-bl-md bg-secondary text-white"
                            : "rounded-bl-md bg-surface text-text-primary"
                    }`}
                  >
                    <p
                      className={`mb-1 text-[10px] font-medium uppercase tracking-wider ${
                        fromVisitor
                          ? "text-text-inverse/60"
                          : "text-text-muted"
                      }`}
                    >
                      {m.sender_type} · {new Date(m.created_at).toLocaleTimeString()}
                    </p>
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleReply} className="space-y-3">
        <Textarea
          value={reply}
          onChange={(e) => {
            setReply(e.target.value);
            signalTyping();
          }}
          onBlur={clearTyping}
          placeholder="Reply as the Stratifit team…"
          className="min-h-[100px]"
        />
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={isInternal}
            onChange={(e) => setIsInternal(e.target.checked)}
            className="size-4"
          />
          Internal note (only visible to admins)
        </label>
        <Button type="submit" loading={busy === "reply"} disabled={!reply.trim()}>
          {isInternal ? "Add Note" : "Send Reply"}
        </Button>
      </form>
    </div>
  );
}

function BadgeLabel({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
      {label}
    </span>
  );
}
