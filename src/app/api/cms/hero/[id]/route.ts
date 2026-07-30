// ============================================================================
// Stratifit — Single Hero Section API
// GET / PUT / DELETE for a specific hero section row.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { heroSectionSchema } from "@/lib/cms/validation-hero";
import { mapHeroSection } from "@/lib/types/hero";
import type { HeroSectionRow } from "@/lib/types/hero";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================================================
// GET /api/cms/hero/[id]
// Returns a single hero section row by ID.
// ============================================================================
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("hero_section")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Hero section not found" }, { status: 404 });
    }

    return NextResponse.json(mapHeroSection(data as unknown as HeroSectionRow));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// PUT /api/cms/hero/[id]
// Updates an existing hero section row.
// ============================================================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = heroSectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    const {
      displayOrder,
      sticky,
      subtitleTranslations,
      titleTranslations,
      titleHighlightTranslations,
      descriptionTranslations,
      ctas,
      trustBadges,
      techStack,
      url,
    } = parsed.data;

    const { data, error } = await supabase
      .from("hero_section")
      .update({
        display_order: displayOrder,
        sticky,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        title_highlight_translations: titleHighlightTranslations,
        description_translations: descriptionTranslations,
        ctas,
        trust_badges: trustBadges,
        tech_stack: techStack,
        url,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapHeroSection(data as unknown as HeroSectionRow));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/cms/hero/[id]
// Deletes a hero section row.
// ============================================================================
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.from("hero_section").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
