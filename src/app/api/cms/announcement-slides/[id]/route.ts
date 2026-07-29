// ============================================================================
// Stratifit — Announcement Slides API (Single Slide)
// GET, PUT, DELETE by id.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { announcementSlideSchema } from "@/lib/cms/validation-announcement";
import { mapAnnouncementSlide } from "@/lib/types/announcement";
import type { AnnouncementSlideRow } from "@/lib/types/announcement";

// ============================================================================
// GET /api/cms/announcement-slides/[id]
// ============================================================================
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("announcement_slides")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      mapAnnouncementSlide(data as unknown as AnnouncementSlideRow)
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// PUT /api/cms/announcement-slides/[id]
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = announcementSlideSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();
    const { displayOrder, sticky, url, messageTranslations } = parsed.data;

    const { data, error } = await supabase
      .from("announcement_slides")
      .update({
        display_order: displayOrder,
        sticky,
        url,
        message_translations: messageTranslations,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      mapAnnouncementSlide(data as unknown as AnnouncementSlideRow)
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/cms/announcement-slides/[id]
// ============================================================================
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("announcement_slides")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
