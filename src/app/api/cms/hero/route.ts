// ============================================================================
// Stratifit — Hero Section API
// CRUD for managing the CMS-driven hero section.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { heroSectionSchema } from "@/lib/cms/validation-hero";
import { mapHeroSection } from "@/lib/types/hero";
import type { HeroSectionRow } from "@/lib/types/hero";

// ============================================================================
// GET /api/cms/hero
// Returns all hero section rows ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("hero_section")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = (data ?? []).map((row) =>
      mapHeroSection(row as unknown as HeroSectionRow)
    );
    return NextResponse.json(mapped);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// POST /api/cms/hero
// Creates a new hero section row.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
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
      .insert({
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
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      mapHeroSection(data as unknown as HeroSectionRow),
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
