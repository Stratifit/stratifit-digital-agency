import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * After a successful website form submission, create-or-join a thread in the
 * inbox section mapped to the form's source key. Form threads never trigger
 * the section's auto-reply (forms already show an acknowledgement).
 *
 * Runs through the service-role client (trusted server operation — the lead
 * action is a server action with its own validation/rate limiting, and the
 * inbox tables have no anon policies). Never throws: a thread failure must
 * not fail the lead submission.
 */
export async function syncLeadToEmailThread(input: {
  leadId: string;
  name: string | null;
  email: string;
  message: string;
  source: string;
}): Promise<void> {
  try {
    const supabase = createSupabaseServiceRoleClient();

    const { data: section } = await supabase
      .from("email_inbox_sections")
      .select("id, slug, from_address, routing_addresses")
      .eq("form_source_key", input.source)
      .maybeSingle();

    if (!section) {
      return;
    }

    const customerEmail = input.email.trim().toLowerCase();
    const subject =
      input.source === "acquisition_form"
        ? "Business acquisition enquiry"
        : "Website contact enquiry";

    // Join an existing open thread for this customer + section when present,
    // otherwise create a new one.
    const { data: existing } = await supabase
      .from("email_threads")
      .select("id")
      .eq("section_id", section.id)
      .eq("customer_email", customerEmail)
      .in("status", ["needs_reply", "waiting_on_customer"])
      .order("last_message_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let threadId: string;
    if (existing) {
      threadId = existing.id;
      await supabase
        .from("email_threads")
        .update({ lead_id: input.leadId })
        .eq("id", threadId);
    } else {
      const { data: inserted, error } = await supabase
        .from("email_threads")
        .insert({
          section_id: section.id,
          customer_email: customerEmail,
          customer_name: input.name,
          subject,
          status: "needs_reply",
          source: input.source,
          lead_id: input.leadId,
          last_inbound_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (error || !inserted) {
        console.error("Email thread create error:", error?.message);
        return;
      }
      threadId = inserted.id;
    }

    const toEmail =
      section.from_address ??
      (section.routing_addresses?.[0] ?? "hello@stratifit.com");

    await supabase.from("email_messages").insert({
      thread_id: threadId,
      direction: "inbound",
      from_email: customerEmail,
      to_email: toEmail,
      subject,
      text_content: input.message || "(no message)",
      status: "received",
      headers: { source: input.source, lead_id: input.leadId },
    });

    const now = new Date().toISOString();
    await supabase
      .from("email_threads")
      .update({
        last_inbound_at: now,
        last_message_at: now,
        customer_name: input.name ?? undefined,
      })
      .eq("id", threadId);
  } catch (error) {
    console.error(
      "Email thread sync error:",
      error instanceof Error ? error.message : error
    );
  }
}
