import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmailReply } from "./mutations";
import type { EmailReplyInput } from "./schemas";

// ---------------------------------------------------------------------------
// Shared mock state (vi.hoisted so the hoisted vi.mock factories can read it).
// ---------------------------------------------------------------------------
const mocks = vi.hoisted(() => ({
  sendTemplateEmail: vi.fn(),
  getDefaultFrom: vi.fn(),
  supabaseCalls: [] as { table: string; payload?: unknown }[],
  supabaseQueues: {} as Record<
    string,
    { data?: unknown; error?: { message: string } | null }[]
  >,
}));

vi.mock("server-only", () => ({}));

vi.mock("next/cache", () => ({
  revalidatePath: () => {},
}));

vi.mock("next/navigation", () => ({
  redirect: () => {
    throw new Error("redirect called");
  },
}));

// The engine's send orchestration is the boundary we record.
vi.mock("@/features/communication/send-template", () => ({
  sendTemplateEmail: mocks.sendTemplateEmail,
  recordOutboundMessage: vi.fn(),
  recordEmailLog: vi.fn(),
}));

vi.mock("@/features/communication/sender", () => ({
  getDefaultFrom: () => mocks.getDefaultFrom() as string,
  getReplyAsAddresses: () => ["contact@stratifit.com"],
}));

vi.mock("@/lib/audit", () => ({
  recordAuditLog: () => Promise.resolve(),
}));

// Service-role Supabase client — queue-backed chainable fake.
vi.mock("@/lib/supabase/service-role", () => {
  const createBuilder = (table: string) => {
    const queue = mocks.supabaseQueues[table] ?? [];
    let payload: unknown;

    const consume = () => {
      mocks.supabaseCalls.push({ table, payload });
      return queue.shift() ?? { data: null, error: null };
    };

    const builder: Record<string, unknown> = {
      select: () => builder,
      eq: () => builder,
      neq: () => builder,
      in: () => builder,
      limit: () => builder,
      order: () => builder,
      insert: (value: unknown) => {
        payload = value;
        return builder;
      },
      update: (value: unknown) => {
        payload = value;
        return builder;
      },
      upsert: (value: unknown) => {
        payload = value;
        return builder;
      },
      single: () => Promise.resolve(consume()),
      maybeSingle: () => Promise.resolve(consume()),
      then: (onFulfilled: (value: unknown) => unknown) =>
        Promise.resolve(consume()).then(onFulfilled),
    };

    return builder;
  };

  return {
    createSupabaseServiceRoleClient: () => ({
      from: (table: string) => createBuilder(table),
    }),
  };
});

// User-session Supabase client — used by requireAdmin + getThreadingContext.
vi.mock("@/lib/supabase/server", () => {
  const createBuilder = (table: string) => {
    const queue = mocks.supabaseQueues[table] ?? [];
    let payload: unknown;

    const consume = () => {
      mocks.supabaseCalls.push({ table, payload });
      return queue.shift() ?? { data: null, error: null };
    };

    const builder: Record<string, unknown> = {
      select: () => builder,
      eq: () => builder,
      neq: () => builder,
      in: () => builder,
      limit: () => builder,
      order: () => builder,
      insert: (value: unknown) => {
        payload = value;
        return builder;
      },
      update: (value: unknown) => {
        payload = value;
        return builder;
      },
      upsert: (value: unknown) => {
        payload = value;
        return builder;
      },
      single: () => Promise.resolve(consume()),
      maybeSingle: () => Promise.resolve(consume()),
      then: (onFulfilled: (value: unknown) => unknown) =>
        Promise.resolve(consume()).then(onFulfilled),
    };

    return builder;
  };

  return {
    createSupabaseServerClient: async () => ({
      auth: {
        getUser: () =>
          Promise.resolve({
            data: { user: { id: "admin-user-1" } },
            error: null,
          }),
      },
      from: (table: string) => createBuilder(table),
    }),
  };
});

const THREAD = {
  id: "11111111-1111-4111-8111-111111111111",
  section_id: "22222222-2222-4222-8222-222222222222",
  customer_email: "kunde@example.com",
  subject: "Anfrage",
  status: "needs_reply",
};

const SECTION = { from_address: "hello@stratifit.com" };

const LAST_INBOUND = {
  headers: { message_id: "abc@example.com", received_at: "2026-08-18T10:00:00Z" },
  references: "<prev@example.com>",
};

beforeEach(() => {
  mocks.supabaseCalls.length = 0;
  mocks.supabaseQueues = {};
  mocks.sendTemplateEmail
    .mockReset()
    .mockResolvedValue({ sent: true, messageId: "msg-1" });
  mocks.getDefaultFrom.mockReset().mockReturnValue("hello@stratifit.com");
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("sendEmailReply", () => {
  it("sends a reply to the customer through the communication engine", async () => {
    mocks.supabaseQueues = {
      admin_users: [{ data: { role: "admin", status: "active" }, error: null }],
      email_threads: [{ data: THREAD, error: null }],
      email_inbox_sections: [{ data: SECTION, error: null }],
      email_messages: [{ data: LAST_INBOUND, error: null }], // threading context
    };

    const result = await sendEmailReply({
      thread_id: THREAD.id,
      body: "Hallo Anna, wir kümmern uns darum.",
    } satisfies EmailReplyInput);

    expect(result.success).toBe(true);

    // Engine send called with the right payload.
    expect(mocks.sendTemplateEmail).toHaveBeenCalledTimes(1);
    const sendInput = mocks.sendTemplateEmail.mock.calls[0][0] as {
      template: { subject_translations: Record<string, string>; body_translations: Record<string, string> };
      language: string;
      toEmail: string;
      fromAddress?: string;
      headers?: Record<string, string>;
      threadId?: string;
      inReplyTo?: string;
      references?: string;
      relatedType?: string;
      relatedId?: string;
    };
    expect(sendInput).toMatchObject({
      language: "en",
      toEmail: "kunde@example.com",
      fromAddress: "hello@stratifit.com",
      threadId: THREAD.id,
      relatedType: "email_thread",
      relatedId: THREAD.id,
    });
    expect(sendInput.template.subject_translations.en).toBe("Re: Anfrage");
    expect(sendInput.template.body_translations.en).toBe(
      "Hallo Anna, wir kümmern uns darum."
    );
    expect(sendInput.headers).toEqual({
      "In-Reply-To": "<abc@example.com>",
      References: "<prev@example.com> <abc@example.com>",
    });
  });

  it("derives the subject from the thread when none is provided and thread already has Re:", async () => {
    mocks.supabaseQueues = {
      admin_users: [{ data: { role: "admin", status: "active" }, error: null }],
      email_threads: [
        { data: { ...THREAD, subject: "Re: Anfrage" }, error: null },
      ],
      email_inbox_sections: [{ data: SECTION, error: null }],
      email_messages: [{ data: LAST_INBOUND, error: null }],
    };

    const result = await sendEmailReply({
      thread_id: THREAD.id,
      body: "Hi",
    });

    expect(result.success).toBe(true);
    const sendInput = mocks.sendTemplateEmail.mock.calls[0][0] as {
      template: { subject_translations: Record<string, string> };
    };
    expect(sendInput.template.subject_translations.en).toBe("Re: Anfrage");
  });

  it("rejects an empty reply body", async () => {
    mocks.supabaseQueues = {
      admin_users: [{ data: { role: "admin", status: "active" }, error: null }],
    };

    const result = await sendEmailReply({
      thread_id: THREAD.id,
      body: "   ",
    });

    expect(result.success).toBe(false);
    expect(mocks.sendTemplateEmail).not.toHaveBeenCalled();
  });

  it("returns an error when the thread is archived", async () => {
    mocks.supabaseQueues = {
      admin_users: [{ data: { role: "admin", status: "active" }, error: null }],
      email_threads: [
        { data: { ...THREAD, status: "archived" }, error: null },
      ],
    };

    const result = await sendEmailReply({
      thread_id: THREAD.id,
      body: "Hi",
    });

    expect(result.success).toBe(false);
    if (result.success) throw new Error("expected failure");
    expect(result.error).toBe("Archived threads cannot receive replies.");
    expect(mocks.sendTemplateEmail).not.toHaveBeenCalled();
  });

  it("propagates a send failure to the caller", async () => {
    mocks.sendTemplateEmail.mockResolvedValue({
      sent: false,
      error: "SMTP connection failed",
    });

    mocks.supabaseQueues = {
      admin_users: [{ data: { role: "admin", status: "active" }, error: null }],
      email_threads: [{ data: THREAD, error: null }],
      email_inbox_sections: [{ data: SECTION, error: null }],
      email_messages: [{ data: LAST_INBOUND, error: null }],
    };

    const result = await sendEmailReply({
      thread_id: THREAD.id,
      body: "Hi",
    });

    expect(result.success).toBe(false);
    if (result.success) throw new Error("expected failure");
    expect(result.error).toBe("Reply could not be sent.");
  });

  it("lets the admin choose the reply-as address", async () => {
    mocks.supabaseQueues = {
      admin_users: [{ data: { role: "admin", status: "active" }, error: null }],
      email_threads: [{ data: THREAD, error: null }],
      email_inbox_sections: [{ data: SECTION, error: null }],
      email_messages: [{ data: LAST_INBOUND, error: null }],
    };

    const result = await sendEmailReply({
      thread_id: THREAD.id,
      body: "Hi",
      from_address: "sales@stratifit.com",
    });

    expect(result.success).toBe(true);
    const sendInput = mocks.sendTemplateEmail.mock.calls[0][0] as {
      fromAddress?: string;
    };
    expect(sendInput.fromAddress).toBe("sales@stratifit.com");
  });
});
