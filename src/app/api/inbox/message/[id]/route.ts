import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/features/email-imap/route-auth";
import { getEmailThreadDetail } from "@/features/email-inbox/queries";

export const runtime = "nodejs";

/**
 * GET /api/inbox/message/[id] — one conversation thread with its full
 * message history and attachment metadata. Admin session required.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const thread = await getEmailThreadDetail(id);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json(thread);
}
