import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import type { ThreadStatus } from "./schemas";

export interface EmailInboxSectionRecord {
  id: string;
  slug: string;
  name_translations: Record<string, string> | null;
  enabled: boolean;
  routing_addresses: string[] | null;
  form_source_key: string | null;
  from_address: string | null;
  language: string | null;
  auto_reply_enabled: boolean;
  auto_reply_subject_translations: Record<string, string> | null;
  auto_reply_body_translations: Record<string, string> | null;
  auto_reply_template_id: string | null;
  resolved_template_id: string | null;
  resolved_email_enabled: boolean;
  display_order: number;
}

/** Full section rows for the admin sections editor. */
export async function getEmailSectionsForAdmin(): Promise<
  EmailInboxSectionRecord[]
> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("email_inbox_sections")
    .select(
      "id, slug, name_translations, enabled, routing_addresses, form_source_key, from_address, language, auto_reply_enabled, auto_reply_subject_translations, auto_reply_body_translations, auto_reply_template_id, resolved_template_id, resolved_email_enabled, display_order"
    )
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name_translations: row.name_translations as Record<string, string> | null,
    enabled: row.enabled,
    routing_addresses: row.routing_addresses ?? [],
    form_source_key: row.form_source_key ?? null,
    from_address: row.from_address ?? null,
    language: row.language ?? null,
    auto_reply_enabled: row.auto_reply_enabled,
    auto_reply_subject_translations:
      row.auto_reply_subject_translations as Record<string, string> | null,
    auto_reply_body_translations:
      row.auto_reply_body_translations as Record<string, string> | null,
    auto_reply_template_id: row.auto_reply_template_id ?? null,
    resolved_template_id: row.resolved_template_id ?? null,
    resolved_email_enabled: row.resolved_email_enabled,
    display_order: row.display_order,
  }));
}

export interface EmailInboxSectionSummary {
  id: string;
  slug: string;
  name: string;
  enabled: boolean;
  routing_addresses: string[];
  form_source_key: string | null;
  from_address: string | null;
  language: string | null;
  auto_reply_enabled: boolean;
  display_order: number;
  counts: {
    needs_reply: number;
    waiting_on_customer: number;
    resolved: number;
    archived: number;
    total: number;
  };
}

export interface EmailThreadSummary {
  id: string;
  section_id: string;
  customer_email: string;
  customer_name: string | null;
  subject: string;
  status: ThreadStatus;
  source: string;
  lead_id: string | null;
  assigned_to: string | null;
  last_inbound_at: string | null;
  last_outbound_at: string | null;
  last_message_at: string | null;
  snippet: string | null;
}

export interface EmailThreadDetail extends EmailThreadSummary {
  section_slug: string;
  section_name: string;
  messages: EmailMessageRecord[];
}

export interface EmailMessageRecord {
  id: string;
  direction: "inbound" | "outbound";
  from_email: string;
  to_email: string;
  subject: string;
  text_content: string;
  html_content: string | null;
  provider_message_id: string | null;
  in_reply_to: string | null;
  status: string;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
}

const SECTION_SELECT =
  "id, slug, name_translations, enabled, routing_addresses, form_source_key, from_address, language, auto_reply_enabled, display_order";

const THREAD_SELECT =
  "id, section_id, customer_email, customer_name, subject, status, source, lead_id, assigned_to, last_inbound_at, last_outbound_at, last_message_at";

/**
 * All inbox sections with per-status thread counts, ordered by display_order.
 * Admin-only (RLS); non-admins receive an empty list.
 */
export async function getEmailSectionsWithCounts(): Promise<
  EmailInboxSectionSummary[]
> {
  const supabase = await createSupabaseServerClient();

  const { data: sections, error } = await supabase
    .from("email_inbox_sections")
    .select(SECTION_SELECT)
    .order("display_order", { ascending: true });

  if (error || !sections) {
    return [];
  }

  const { data: threads, error: threadsError } = await supabase
    .from("email_threads")
    .select("section_id, status");

  if (threadsError || !threads) {
    return sections.map((section) => ({
      id: section.id,
      slug: section.slug,
      name: resolveTranslation(
        section.name_translations as Record<string, unknown> | null,
        "en"
      ),
      enabled: section.enabled,
      routing_addresses: section.routing_addresses ?? [],
      form_source_key: section.form_source_key ?? null,
      from_address: section.from_address ?? null,
      language: section.language ?? null,
      auto_reply_enabled: section.auto_reply_enabled,
      display_order: section.display_order,
      counts: {
        needs_reply: 0,
        waiting_on_customer: 0,
        resolved: 0,
        archived: 0,
        total: 0,
      },
    }));
  }

  const countBySection = new Map<
    string,
    Record<ThreadStatus, number>
  >();
  for (const thread of threads) {
    const status = thread.status as ThreadStatus;
    const entry = countBySection.get(thread.section_id) ?? {
      needs_reply: 0,
      waiting_on_customer: 0,
      resolved: 0,
      archived: 0,
    };
    if (status in entry) {
      entry[status] += 1;
    }
    countBySection.set(thread.section_id, entry);
  }

  return sections.map((section) => {
    const counts = countBySection.get(section.id) ?? {
      needs_reply: 0,
      waiting_on_customer: 0,
      resolved: 0,
      archived: 0,
    };
    const total =
      counts.needs_reply +
      counts.waiting_on_customer +
      counts.resolved +
      counts.archived;
    return {
      id: section.id,
      slug: section.slug,
      name: resolveTranslation(
        section.name_translations as Record<string, unknown> | null,
        "en"
      ),
      enabled: section.enabled,
      routing_addresses: section.routing_addresses ?? [],
      form_source_key: section.form_source_key ?? null,
      from_address: section.from_address ?? null,
      language: section.language ?? null,
      auto_reply_enabled: section.auto_reply_enabled,
      display_order: section.display_order,
      counts: { ...counts, total },
    };
  });
}

/**
 * Threads for a section, newest first. When `status` is omitted, all
 * non-archived threads are returned.
 */
export async function getEmailThreads(
  sectionId: string,
  status?: ThreadStatus
): Promise<EmailThreadSummary[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("email_threads")
    .select(THREAD_SELECT)
    .eq("section_id", sectionId)
    .order("last_message_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  } else {
    query = query.neq("status", "archived");
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data as unknown as EmailThreadSummary[];
}

/** A single thread with its full message history (newest last). */
export async function getEmailThreadDetail(
  threadId: string
): Promise<EmailThreadDetail | null> {
  const supabase = await createSupabaseServerClient();

  const { data: thread, error } = await supabase
    .from("email_threads")
    .select(
      `${THREAD_SELECT}, email_inbox_sections(slug, name_translations)`
    )
    .eq("id", threadId)
    .single();

  if (error || !thread) {
    return null;
  }

  const { data: messages, error: messagesError } = await supabase
    .from("email_messages")
    .select(
      "id, direction, from_email, to_email, subject, text_content, html_content, provider_message_id, in_reply_to, status, error_message, sent_at, created_at"
    )
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (messagesError || !messages) {
    return null;
  }

  const raw = thread as unknown as Record<string, unknown> & {
    email_inbox_sections: unknown;
  };
  const section = raw.email_inbox_sections as {
    slug: string;
    name_translations: Record<string, string> | null;
  } | null;

  return {
    id: raw.id as string,
    section_id: raw.section_id as string,
    customer_email: raw.customer_email as string,
    customer_name: (raw.customer_name as string | null) ?? null,
    subject: raw.subject as string,
    status: raw.status as ThreadStatus,
    source: raw.source as string,
    lead_id: (raw.lead_id as string | null) ?? null,
    assigned_to: (raw.assigned_to as string | null) ?? null,
    last_inbound_at: (raw.last_inbound_at as string | null) ?? null,
    last_outbound_at: (raw.last_outbound_at as string | null) ?? null,
    last_message_at: (raw.last_message_at as string | null) ?? null,
    snippet: null,
    section_slug: section?.slug ?? "other",
    section_name: section
      ? resolveTranslation(section.name_translations, "en")
      : "Other",
    messages: messages as unknown as EmailMessageRecord[],
  };
}
