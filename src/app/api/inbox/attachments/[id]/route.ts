import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/features/email-imap/route-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * GET /api/inbox/attachments/[id] — download one attachment from the private
 * `email-attachments` bucket. Admin session required; the file is streamed
 * with its stored MIME type and an attachment disposition.
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
  const { data: attachment } = await supabase
    .from("email_attachments")
    .select("id, name, mime_type, storage_bucket, storage_path")
    .eq("id", id)
    .maybeSingle();

  if (!attachment) {
    return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from(attachment.storage_bucket)
    .download(attachment.storage_path);

  if (error || !data) {
    return NextResponse.json(
      { error: "Attachment could not be read" },
      { status: 500 }
    );
  }

  const bytes = Buffer.from(await data.arrayBuffer());
  const safeName = attachment.name.replace(/["\\\r\n]/g, "");

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": attachment.mime_type ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "private, max-age=300",
    },
  });
}
