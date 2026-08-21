import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getReplyAsAddresses } from "./sender";
import {
  DEFAULT_SENDER_ADDRESSES,
  normalizeAddressList,
  resolveSenderAddresses,
} from "./sender-addresses-utils";

export {
  DEFAULT_SENDER_ADDRESSES,
  normalizeAddressList,
  resolveSenderAddresses,
};

export interface SenderAddressRecord {
  id: string;
  email: string;
  label: string | null;
  is_enabled: boolean;
  is_default: boolean;
}

/** All sender-address rows for the admin management page. */
export async function getSenderAddressRecords(): Promise<
  SenderAddressRecord[]
> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("email_sender_addresses")
    .select("id, email, label, is_enabled, is_default")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    label: row.label ?? null,
    is_enabled: row.is_enabled,
    is_default: row.is_default,
  }));
}

/**
 * Enabled sender addresses for the "Reply as" pickers (Send Email page and
 * inbox reply composer). DB rows win, then env, then defaults.
 */
export async function getSenderAddresses(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("email_sender_addresses")
    .select("email")
    .eq("is_enabled", true)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  return resolveSenderAddresses(
    (data ?? []).map((row) => row.email),
    getReplyAsAddresses()
  );
}
