// ============================================================================
// Stratifit — Announcement Slides API
// CRUD for managing announcement bar slides.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { announcementSlideSchema } from "@/lib/cms/validation-announcement";
import { mapAnnouncementSlide } from "@/lib/types/announcement";
import type { AnnouncementSlideRow } from "@/lib/types/announcement";

// ============================================================================
// GET /api/cms/announcement-slides
// Returns all slides ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("announcement_slides")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = (data ?? []).map((row) =>
      mapAnnouncementSlide(row as unknown as AnnouncementSlideRow)
    );
    return NextResponse.json(mapped);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// POST /api/cms/announcement-slides
// Creates a new slide with reordering logic:
// - All slides at displayOrder (or higher) are shifted +1
// - The new slide is inserted at displayOrder
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient();

    const body = await request.json();
    const parsed = announcementSlideSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { displayOrder, sticky, url, messageTranslations } = parsed.data;

    // 1. Shift existing slides at displayOrder and above
    const { data: existing } = await supabase
      .from("announcement_slides")
      .select("id, display_order")
      .order("display_order", { ascending: true });

    if (existing) {
      const toShift = existing.filter((s) => s.display_order >= displayOrder);
      // Sort descending so we don't collide on unique constraint (if any)
      toShift.sort((a, b) => b.display_order - a.display_order);

      for (const slide of toShift) {
        await supabase
          .from("announcement_slides")
          .update({ display_order: slide.display_order + 1 })
          .eq("id", slide.id);
      }
    }

    // 2. Insert the new slide
    const { data, error } = await supabase
      .from("announcement_slides")
      .insert({
        display_order: displayOrder,
        sticky,
        url,
        message_translations: messageTranslations,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = data
      ? mapAnnouncementSlide(data as unknown as AnnouncementSlideRow)
      : null;
    return NextResponse.json(mapped, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
