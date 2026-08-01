"use client";

import * as React from "react";
import {
  adminReply,
  takeOverConversation,
  returnToAi,
  resolveConversation,
  archiveConversation,
} from "@/features/chat/admin-mutations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DetailData {
  id: string;
  status: string;
  mode: string;
  messages: {
    id: string;
    sender_type: string;
    content: string;
    is_internal: boolean;
    created_at: string;
  }[];
}

export function ConversationDetail({ conversation }: { conversation: DetailData }) {
  const [reply, setReply] = React.useState("");
  const [busy, setBusy] = React.useState<string | null>(null);

  async function run(action: string, fn: () => Promise<unknown>) {
    setBusy(action);
    await fn();
    setBusy(null);
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    const content = reply.trim();
    if (!content) return;
    setBusy("reply");
    await adminReply(conversation.id, { content, is_internal: false });
    setReply("");
    setBusy(null);
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <BadgeLabel label={conversation.status} />
          <BadgeLabel label={`mode: ${conversation.mode}`} />
        </div>
        <div className="flex flex-wrap gap-2">
          {conversation.mode !== "human" ? (
            <Button
              size="small"
              variant="secondary"
              loading={busy === "takeover"}
              onClick={() => run("takeover", () => takeOverConversation(conversation.id).then(() => window.location.reload()))}
            >
              Take Over
            </Button>
          ) : (
            <Button
              size="small"
              variant="secondary"
              loading={busy === "return"}
              onClick={() => run("return", () => returnToAi(conversation.id).then(() => window.location.reload()))}
            >
              Return to AI
            </Button>
          )}
          {conversation.status !== "resolved" ? (
            <Button
              size="small"
              loading={busy === "resolve"}
              onClick={() => run("resolve", () => resolveConversation(conversation.id).then(() => window.location.reload()))}
            >
              Resolve
            </Button>
          ) : null}
          {conversation.status !== "archived" ? (
            <Button
              size="small"
              variant="destructive"
              loading={busy === "archive"}
              onClick={() => run("archive", () => archiveConversation(conversation.id).then(() => window.location.reload()))}
            >
              Archive
            </Button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-radius-md border border-border bg-surface p-4">
        {conversation.messages.length === 0 ? (
          <p className="text-sm text-text-muted">No messages yet.</p>
        ) : (
          conversation.messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-radius-md px-3 py-2 text-sm ${
                m.sender_type === "visitor"
                  ? "bg-primary text-text-inverse"
                  : m.is_internal
                    ? "bg-surface-hover text-text-muted italic"
                    : m.sender_type === "admin"
                      ? "bg-secondary text-white"
                      : "bg-surface text-text-primary"
              }`}
            >
              <p className="mb-1 text-xs text-text-muted">
                {m.sender_type} · {new Date(m.created_at).toLocaleTimeString()}
              </p>
              {m.content}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleReply} className="space-y-3">
        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply as the Stratifit team…"
          className="min-h-[100px]"
        />
        <Button type="submit" loading={busy === "reply"} disabled={!reply.trim()}>
          Send Reply
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
