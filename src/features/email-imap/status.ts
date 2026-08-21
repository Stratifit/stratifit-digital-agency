import "server-only";
import * as tls from "node:tls";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { resolveImapConfig } from "./config";
import { getSenderAddresses } from "@/features/communication/sender-addresses";

export interface ImapStatus {
  configured: boolean;
  missing: string[];
  placeholders: string[];
  host: string | null;
  port: number | null;
  reachable: boolean;
  banner?: string;
  reachabilityError?: string;
  imapThreads: number;
  lastImapMessageAt: string | null;
  /** Mailboxes swept per run (INBOX plus any extras like Junk). */
  mailboxes: string[];
  /** Enabled reply-as addresses that must exist in Zoho to receive replies. */
  senderAddresses: string[];
}

/**
 * Live TLS reachability probe: connect to the IMAP host:port with TLS and
 * read the server greeting banner (e.g. `* OK ... Zoho Mail IMAP4rev1`).
 * Never throws — returns a classified result.
 */
function checkTlsReachability(
  host: string,
  port: number
): Promise<{ ok: boolean; banner?: string; error?: string }> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: {
      ok: boolean;
      banner?: string;
      error?: string;
    }) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      socket.destroy();
      resolve(result);
    };

    const socket = tls.connect(
      { host, port, servername: host, rejectUnauthorized: false },
      () => {
        // TLS handshake done; the greeting banner follows from the server.
      }
    );
    const timeout = setTimeout(
      () => finish({ ok: false, error: "Connection timed out" }),
      10_000
    );

    socket.once("data", (chunk) => {
      const banner =
        chunk.toString("utf8").split(/\r?\n/)[0]?.trim() ?? "";
      finish({ ok: banner.length > 0, banner: banner || undefined });
    });
    socket.once("error", (error) =>
      finish({ ok: false, error: error.message })
    );
    socket.once("close", () =>
      finish({ ok: false, error: "Connection closed before greeting" })
    );
  });
}

/**
 * Aggregate status shown on the admin inbox page: is IMAP configured, is the
 * server reachable right now, and how much has been synced into the database.
 */
export async function getImapStatus(): Promise<ImapStatus> {
  const { config, missing, placeholders } = resolveImapConfig(process.env);

  let reachability: {
    ok: boolean;
    banner?: string;
    error?: string;
  } = { ok: false, error: "Not configured" };
  if (config) {
    reachability = await checkTlsReachability(config.host, config.port);
  }

  const supabase = createSupabaseServiceRoleClient();
  const senderAddresses = await getSenderAddresses();
  const { count: imapThreads } = await supabase
    .from("email_threads")
    .select("id", { count: "exact", head: true })
    .eq("source", "imap");

  const { data: lastMessage } = await supabase
    .from("email_messages")
    .select("sent_at")
    .eq("direction", "inbound")
    .order("sent_at", { ascending: false })
    .limit(1)
    .single();

  return {
    configured: !!config,
    missing,
    placeholders,
    host: config?.host ?? null,
    port: config?.port ?? null,
    reachable: config ? reachability.ok : false,
    banner: config ? reachability.banner : undefined,
    reachabilityError: config ? reachability.error : undefined,
    imapThreads: imapThreads ?? 0,
    lastImapMessageAt: lastMessage?.sent_at ?? null,
    mailboxes: config?.mailboxes ?? ["INBOX"],
    senderAddresses,
  };
}
