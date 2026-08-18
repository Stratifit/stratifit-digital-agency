import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { processInboundEmail } from "./inbound";
import type { ReceivedEmail } from "./schemas";

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

// The outbound send is the boundary we record (the SMTP send itself is
// exercised inside the engine's sender otherwise).
vi.mock("@/features/communication/send-template", () => ({
  sendTemplateEmail: mocks.sendTemplateEmail,
  recordOutboundMessage: vi.fn(),
  recordEmailLog: vi.fn(),
}));

vi.mock("@/features/communication/sender", () => ({
  getDefaultFrom: () => mocks.getDefaultFrom() as string,
  getReplyAsAddresses: () => ["contact@stratifit.com"],
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

const RECEIVED_EMAIL: ReceivedEmail = {
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

function callsFor(table: string): Record<string, unknown>[] {
  return mocks.supabaseCalls
    .filter((call) => call.table === table && call.payload)
    .map((call) => call.payload as Record<string, unknown>);
}

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

describe("processInboundEmail", () => {
  it("routes a German email to the matching-language section and auto-replies in German", async () => {
    mocks.supabaseQueues = {
      email_messages: [
        { data: null, error: null }, // idempotency lookup
        { error: null }, // inbound message insert
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
      ],
    };

    const result = await processInboundEmail(RECEIVED_EMAIL);

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

    // The inbound message is persisted with the provider id.
    const messageInserts = callsFor("email_messages");
    expect(messageInserts[0]).toMatchObject({
      direction: "inbound",
      provider_message_id: "email-123",
      from_email: "kunde@example.com",
      to_email: "support@stratifit.com",
    });
    expect(messageInserts[0].text_content).toContain("Hallo");

    // The auto-reply went out in German through the engine.
    expect(mocks.sendTemplateEmail).toHaveBeenCalledTimes(1);
    const sendInput = mocks.sendTemplateEmail.mock.calls[0][0] as {
      template: {
        subject_translations: Record<string, string>;
        body_translations: Record<string, string>;
      };
      language: string;
      toEmail: string;
      fromAddress?: string;
      threadId?: string;
      inReplyTo?: string;
      references?: string;
      idempotencyKey?: string;
    };
    expect(sendInput).toMatchObject({
      language: "de",
      toEmail: "kunde@example.com",
      fromAddress: "support@stratifit.com",
      threadId: "thread-1",
      idempotencyKey: "email_inbox_template:thread-1:email-123",
    });
    expect(sendInput.template.subject_translations.de).toBe("Vielen Dank {{name}}");
    expect(sendInput.template.body_translations.de).toBe(
      "Hallo {{name}}, wir haben Ihre Anfrage erhalten."
    );
    expect(sendInput.inReplyTo).toBe("abc@example.com");
    expect(sendInput.references).toBe("<abc@example.com>");
  });

  it("returns duplicate=true and does nothing when the email was already processed", async () => {
    mocks.supabaseQueues = {
      email_messages: [{ data: { id: "existing" }, error: null }],
    };

    const result = await processInboundEmail(RECEIVED_EMAIL);

    expect(result).toEqual({ ok: true, duplicate: true });
    expect(mocks.sendTemplateEmail).not.toHaveBeenCalled();
    expect(callsFor("email_threads")).toHaveLength(0);
  });
});
