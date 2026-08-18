import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { processInboundEmail } from "./inbound";
import type { InboundWebhookPayload } from "./schemas";

// ---------------------------------------------------------------------------
// Shared mock state (vi.hoisted so the hoisted vi.mock factories can read it).
// ---------------------------------------------------------------------------
const mocks = vi.hoisted(() => ({
  resendReceivingGet: vi.fn(),
  resendEmailsGet: vi.fn(),
  getEmailFrom: vi.fn(),
  sendEmail: vi.fn(),
  supabaseCalls: [] as { table: string; payload?: unknown }[],
  supabaseQueues: {} as Record<
    string,
    { data?: unknown; error?: { message: string } | null }[]
  >,
}));

vi.mock("server-only", () => ({}));

// Resend client — the external HTTP dependency under test.
vi.mock("@/features/email/client", () => ({
  getResendClient: () => ({
    emails: {
      receiving: { get: mocks.resendReceivingGet },
      get: mocks.resendEmailsGet,
    },
  }),
  getEmailFrom: () => mocks.getEmailFrom() as string,
}));

// The actual outbound send is the boundary we record (Resend HTTP would be
// exercised through client.emails.send otherwise).
vi.mock("@/features/email/send", () => ({
  sendEmail: mocks.sendEmail,
}));

// Service-role Supabase client — a queue-backed chainable fake that records
// every terminal query (insert/update payloads + resolved rows) in order.
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
      gte: () => builder,
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

const RECEIVED_EMAIL = {
  id: "email-123",
  message_id: "abc@example.com",
  from: "Anna <kunde@example.com>",
  to: ["support@stratifit.com"],
  received_for: ["support@stratifit.com"],
  subject: "Anfrage",
  text: "Hallo, ich habe eine Anfrage zu einem Projekt. Vielen Dank.",
  html: "<p>Hallo, ich habe eine Anfrage zu einem Projekt.</p>",
  created_at: "2026-08-18T10:00:00Z",
  headers: {},
  attachments: [],
};

const SECTIONS = [
  {
    id: "sec-support-de",
    slug: "support-de",
    language: "de",
    routing_addresses: ["support@stratifit.com"],
    enabled: true,
  },
  {
    id: "sec-support",
    slug: "support",
    language: null,
    routing_addresses: ["support@stratifit.com"],
    enabled: true,
  },
  {
    id: "sec-other",
    slug: "other",
    language: null,
    routing_addresses: [],
    enabled: true,
  },
];

const SECTION_FULL = {
  name_translations: { en: "Support", de: "Support" },
  from_address: "support@stratifit.com",
  auto_reply_enabled: true,
  auto_reply_template_id: "tmpl-1",
  auto_reply_subject_translations: { en: "", de: "" },
  auto_reply_body_translations: { en: "", de: "" },
  email_templates: {
    subject_translations: {
      en: "Thanks {{name}}",
      de: "Vielen Dank {{name}}",
    },
    body_translations: {
      en: "Hi {{name}}",
      de: "Hallo {{name}}, wir haben Ihre Anfrage erhalten.",
    },
  },
};

const THREAD = {
  id: "thread-1",
  customer_email: "kunde@example.com",
  customer_name: "Anna",
  source: "inbound_email",
  language: "de",
};

function payload(): InboundWebhookPayload {
  return {
    type: "email.received",
    data: {
      email_id: "email-123",
      from: "Anna <kunde@example.com>",
      to: ["support@stratifit.com"],
      subject: "Anfrage",
      received_for: ["support@stratifit.com"],
      created_at: "2026-08-18T10:00:00Z",
    },
  };
}

function callsFor(table: string): Record<string, unknown>[] {
  return mocks.supabaseCalls
    .filter((call) => call.table === table && call.payload)
    .map((call) => call.payload as Record<string, unknown>);
}

beforeEach(() => {
  mocks.supabaseCalls.length = 0;
  mocks.supabaseQueues = {};
  mocks.sendEmail.mockReset().mockResolvedValue({ ok: true, messageId: "msg-1" });
  mocks.getEmailFrom.mockReset().mockReturnValue("hello@stratifit.com");
  mocks.resendReceivingGet.mockReset().mockResolvedValue({
    data: RECEIVED_EMAIL,
    error: null,
  });
  mocks.resendEmailsGet.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("processInboundEmail", () => {
  it("routes a German email to the matching-language section and auto-replies in German", async () => {
    mocks.supabaseQueues = {
      email_messages: [
        { data: null, error: null }, // idempotency lookup
        { error: null }, // inbound message insert
        { error: null }, // outbound auto-reply insert
      ],
      email_inbox_sections: [
        { data: SECTIONS, error: null }, // routing lookup
        { data: SECTION_FULL, error: null }, // auto-reply section fetch
      ],
      email_threads: [
        { data: [], error: null }, // existing-thread lookup
        { data: { id: "thread-1" }, error: null }, // thread insert
        { error: null }, // thread update after message insert
        { data: { status: "needs_reply" }, error: null }, // reopen check
        { data: THREAD, error: null }, // auto-reply thread fetch
        { error: null }, // thread update after outbound message
      ],
    };

    const result = await processInboundEmail(payload());

    expect(result).toEqual({ ok: true });

    // Language-aware routing: the thread lands in the German section.
    const threadInsert = callsFor("email_threads").find((call) =>
      Object.prototype.hasOwnProperty.call(call, "customer_email")
    );
    expect(threadInsert).toMatchObject({
      section_id: "sec-support-de",
      language: "de",
      source: "inbound_email",
      customer_email: "kunde@example.com",
      customer_name: "Anna",
    });

    // The inbound message is persisted with the Resend provider id.
    const messageInserts = callsFor("email_messages");
    expect(messageInserts[0]).toMatchObject({
      direction: "inbound",
      provider_message_id: "email-123",
      from_email: "kunde@example.com",
      to_email: "support@stratifit.com",
    });
    expect(messageInserts[0].text_content).toContain("Hallo");

    // The auto-reply went out in German through the real template renderer.
    expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
    const sendInput = mocks.sendEmail.mock.calls[0][0] as {
      templateKey: string;
      to: string;
      from?: string;
      data: { subject: string; body: string };
      headers?: Record<string, string>;
      idempotencyKey?: string;
    };
    expect(sendInput).toMatchObject({
      templateKey: "email_inbox_template",
      to: "kunde@example.com",
      from: "support@stratifit.com",
      data: {
        subject: "Vielen Dank Anna",
        body: "Hallo Anna, wir haben Ihre Anfrage erhalten.",
      },
      idempotencyKey: "email_inbox_template:thread-1:email-123",
    });
    expect(sendInput.headers).toEqual({
      "In-Reply-To": "<abc@example.com>",
      References: "<abc@example.com>",
    });

    // The outbound auto-reply is recorded on the thread.
    expect(messageInserts[1]).toMatchObject({
      direction: "outbound",
      status: "sent",
      provider_message_id: "msg-1",
      from_email: "support@stratifit.com",
      to_email: "kunde@example.com",
    });
  });

  it("returns duplicate=true and does nothing when the email was already processed", async () => {
    mocks.supabaseQueues = {
      email_messages: [{ data: { id: "existing" }, error: null }],
    };

    const result = await processInboundEmail(payload());

    expect(result).toEqual({ ok: true, duplicate: true });
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(callsFor("email_threads")).toHaveLength(0);
  });
});
