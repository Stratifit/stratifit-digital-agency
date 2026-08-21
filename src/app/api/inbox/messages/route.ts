import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/features/email-imap/route-auth";
import {
  getEmailSectionsWithCounts,
  getEmailThreadsPage,
} from "@/features/email-inbox/queries";
import { THREAD_STATUSES, type ThreadStatus } from "@/features/email-inbox/schemas";
import {
  SUPPORTED_EMAIL_LANGUAGES,
  type EmailLanguage,
} from "@/features/email-inbox/language";

export const runtime = "nodejs";

/**
 * GET /api/inbox/messages — paginated conversation list for a section.
 * Admin session required. Query params: section (slug), status, language,
 * page (1-based), pageSize (max 100, default 25).
 */
export async function GET(request: NextRequest) {
  const supabase = await getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const slug = params.get("section") ?? "other";
  const rawStatus = params.get("status") ?? undefined;
  const rawLanguage = params.get("language") ?? undefined;
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number(params.get("pageSize") ?? "25") || 25)
  );

  const status = rawStatus && (THREAD_STATUSES as readonly string[]).includes(rawStatus)
    ? (rawStatus as ThreadStatus)
    : undefined;
  const language =
    rawLanguage && (SUPPORTED_EMAIL_LANGUAGES as readonly string[]).includes(rawLanguage)
      ? (rawLanguage as EmailLanguage)
      : undefined;

  const sections = await getEmailSectionsWithCounts();
  const section = sections.find((s) => s.slug === slug);
  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  const { threads, total } = await getEmailThreadsPage(
    section.id,
    status,
    language,
    { page, pageSize }
  );

  return NextResponse.json({
    threads,
    total,
    page,
    pageSize,
    section: slug,
    sections: sections.map((s) => ({ slug: s.slug, name: s.name, total: s.counts.total })),
  });
}
