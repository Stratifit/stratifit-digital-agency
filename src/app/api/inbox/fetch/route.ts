import { NextRequest, NextResponse } from "next/server";
import { runImapFetch } from "@/features/email-imap/fetch";
import { getAdminSupabase } from "@/features/email-imap/route-auth";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * POST /api/inbox/fetch — run one IMAP inbox sweep.
 *
 * Authorization (any of):
 *   1. Vercel Cron invocation (x-vercel-cron-schedule header)
 *   2. IMAP_SYNC_SECRET in the `x-imap-sync-secret` header or `?secret=`
 *   3. An active admin session (dashboard "Sync IMAP" button)
 */
export async function POST(request: NextRequest) {
  const isCron = request.headers.get("x-vercel-cron-schedule") !== null;
  const configuredSecret = process.env.IMAP_SYNC_SECRET;
  const providedSecret =
    request.headers.get("x-imap-sync-secret") ??
    request.nextUrl.searchParams.get("secret");
  const admin = await getAdminSupabase();

  const authorized =
    isCron ||
    (!!configuredSecret && providedSecret === configuredSecret) ||
    !!admin;

  if (!authorized) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const summary = await runImapFetch();
  return NextResponse.json(summary, {
    status: summary.ok ? 200 : 500,
  });
}
