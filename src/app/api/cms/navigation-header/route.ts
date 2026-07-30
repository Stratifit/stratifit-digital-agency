// ============================================================================
// Stratifit — Navigation Header API
// CRUD for managing the CMS-driven navigation header.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { navigationHeaderSchema } from "@/lib/cms/validation-navigation-header";
import { getNavigationHeaderRows } from "@/lib/cms/navigation-header";
import { mapNavigationHeader } from "@/lib/types/navigationHeader";
import type { NavigationHeaderRow } from "@/lib/types/navigationHeader";

// ============================================================================
// GET /api/cms/navigation-header
// Returns all navigation header rows ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const rows = await getNavigationHeaderRows();
    return NextResponse.json(rows);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// POST /api/cms/navigation-header
// Creates a new navigation header row.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      .insert({
        display_order: displayOrder,
        sticky,
        content,
        translations,
        url,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      mapNavigationHeader(data as unknown as NavigationHeaderRow),
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
