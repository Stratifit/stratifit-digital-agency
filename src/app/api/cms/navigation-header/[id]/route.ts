// ============================================================================
// Stratifit — Navigation Header Single Resource API
// GET, PUT, DELETE by id.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { navigationHeaderSchema } from "@/lib/cms/validation-navigation-header";
import { mapNavigationHeader } from "@/lib/types/navigationHeader";
import type { NavigationHeaderRow } from "@/lib/types/navigationHeader";

// ============================================================================
// GET /api/cms/navigation-header/[id]
// ============================================================================
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("section_navigation_header")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      mapNavigationHeader(data as unknown as NavigationHeaderRow)
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// PUT /api/cms/navigation-header/[id]
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = navigationHeaderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();
    const { displayOrder, sticky, content, translations, url } = parsed.data;

    const { data, error } = await supabase
      .from("section_navigation_header")
      .update({
        display_order: displayOrder,
        sticky,
        content,
        translations,
        url,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      mapNavigationHeader(data as unknown as NavigationHeaderRow)
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/cms/navigation-header/[id]
// ============================================================================
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("section_navigation_header")
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
