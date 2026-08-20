import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { processDueSchedules } from "./process-schedules";

// Shared mock state (vi.hoisted so the hoisted vi.mock factories can read it).
const mocks = vi.hoisted(() => ({
  sendTemplateEmail: vi.fn(),
  supabaseCalls: [] as { table: string; payload?: unknown }[],
  supabaseQueues: {} as Record<
    string,
    { data?: unknown; error?: { message: string } | null }[]
  >,
}));

vi.mock("server-only", () => ({}));

vi.mock("./send-template", () => ({
  sendTemplateEmail: mocks.sendTemplateEmail,
}));

// Service-role Supabase client — a queue-backed chainable fake.
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
      lte: () => builder,
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

const DUE_SCHEDULES = [
  {
    id: "sched-1",
    template_key: "form_submission",
    recipient_email: "anna@example.com",
    recipient_name: "Anna",
    language: "en",
    data: { project_name: "Website" },
  },
  {
    id: "sched-2",
    template_key: "payment_reminder",
    recipient_email: "leo@example.com",
    recipient_name: null,
    language: "de",
    data: { amount: "1500 EUR" },
  },
];

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
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("processDueSchedules", () => {
  it("returns empty when no schedules are due", async () => {
    mocks.supabaseQueues = {
      email_schedules: [{ data: [], error: null }],
    };

    const result = await processDueSchedules();

    expect(result).toEqual({ processed: 0, sent: 0, failed: 0, errors: [] });
    expect(mocks.sendTemplateEmail).not.toHaveBeenCalled();
  });

  it("sends each due schedule through the engine and marks it sent", async () => {
    mocks.supabaseQueues = {
      email_schedules: [{ data: DUE_SCHEDULES, error: null }],
    };

    const result = await processDueSchedules();

    expect(result.processed).toBe(2);
    expect(result.sent).toBe(2);
    expect(result.failed).toBe(0);

    // Both schedules were sent with the stored template + language.
    expect(mocks.sendTemplateEmail).toHaveBeenCalledTimes(2);
    const first = mocks.sendTemplateEmail.mock.calls[0][0] as {
      templateKey: string;
      language: string;
      toEmail: string;
      idempotencyKey: string;
      context: Record<string, unknown>;
    };
    expect(first).toMatchObject({
      templateKey: "form_submission",
      language: "en",
      toEmail: "anna@example.com",
      idempotencyKey: "schedule:sched-1",
    });
    // Recipient name merges into the auto-fill context; date defaults to today.
    expect(first.context.name).toBe("Anna");
    expect(first.context.project_name).toBe("Website");
    expect(first.context.date).toBe(
      new Date().toISOString().slice(0, 10)
    );

    // Both schedules are flipped to sent (with sent_at).
    const updates = callsFor("email_schedules");
    expect(updates).toHaveLength(2);
    expect(updates[0]).toMatchObject({ status: "sent" });
    expect(updates[0].sent_at).toBeTruthy();
    expect(updates[1]).toMatchObject({ status: "sent" });
  });

  it("marks a failed send as failed and records the error", async () => {
    mocks.supabaseQueues = {
      email_schedules: [{ data: [DUE_SCHEDULES[0]], error: null }],
    };
    mocks.sendTemplateEmail.mockResolvedValue({
      sent: false,
      error: "SMTP rejected",
    });

    const result = await processDueSchedules();

    expect(result.processed).toBe(1);
    expect(result.sent).toBe(0);
    expect(result.failed).toBe(1);
    expect(result.errors[0]).toContain("SMTP rejected");

    const updates = callsFor("email_schedules");
    expect(updates[0]).toMatchObject({
      status: "failed",
      error_message: "SMTP rejected",
    });
  });

  it("uses the recipient email as the customer_email when not provided", async () => {
    mocks.supabaseQueues = {
      email_schedules: [{ data: [DUE_SCHEDULES[1]], error: null }],
    };

    await processDueSchedules();

    const first = mocks.sendTemplateEmail.mock.calls[0][0] as {
      context: Record<string, unknown>;
    };
    expect(first.context.customer_email).toBe("leo@example.com");
  });
});
