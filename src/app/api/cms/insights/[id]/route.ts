// ============================================================================
// Stratifit — Single Insights Section API
// GET / PUT / DELETE for a specific insights section and its insight cards.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { insightsSectionSchema } from "@/lib/cms/validation-insights";
import {
  mapInsightsSection,
  mapInsightCard,
  type CmsInsightsSection,
  type InsightsSectionRow,
  type InsightCardRow,
} from "@/lib/types/insights";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Fetch a single insights section with its cards. */
async function fetchSectionWithCards(sectionId: string): Promise<CmsInsightsSection | null> {
  const supabase = getAdminClient();

  const { data: section, error: sectionError } = await supabase
    .from("insights_section")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    return null;
  }

  const { data: cards, error: cardsError } = await supabase
    .from("insight_cards")
    .select("*")
    .eq("parent_section", sectionId)
    .order("display_order", { ascending: true });

  if (cardsError) {
    return null;
  }

  return {
    ...mapInsightsSection(section as unknown as InsightsSectionRow),
    cards: (cards ?? []).map((card) =>
      mapInsightCard(card as unknown as InsightCardRow)
    ),
  };
}

// ============================================================================
// GET /api/cms/insights/[id]
// ============================================================================
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await fetchSectionWithCards(id);

    if (!result) {
      return NextResponse.json(
        { error: "Insights section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// PUT /api/cms/insights/[id]
// Updates the insights section and syncs its cards.
// ============================================================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = insightsSectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    const {
      displayOrder,
      subtitleTranslations,
      titleTranslations,
      descriptionTranslations,
      viewAllUrl,
      viewAllLabelTranslations,
      readMoreLabelTranslations,
      cards,
    } = parsed.data;

    const { data: section, error: sectionError } = await supabase
      .from("insights_section")
      .update({
        display_order: displayOrder,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        description_translations: descriptionTranslations,
        view_all_url: viewAllUrl,
        view_all_label_translations: viewAllLabelTranslations,
        read_more_label_translations: readMoreLabelTranslations,
      })
      .eq("id", id)
      .select()
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: sectionError?.message ?? "Failed to update insights section" },
        { status: 500 }
      );
    }

    // Sync cards: delete existing, then insert new ones.
    const { error: deleteError } = await supabase
      .from("insight_cards")
      .delete()
      .eq("parent_section", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (cards.length > 0) {
      const { error: insertError } = await supabase.from("insight_cards").insert(
        cards.map((card, index) => ({
          parent_section: id,
          image_url: card.imageUrl,
          category: card.category,
          title_translations: card.titleTranslations,
          description_translations: card.descriptionTranslations,
          link_url: card.linkUrl,
          display_order: card.displayOrder ?? index,
          active: card.active,
        }))
      );

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    const result = await fetchSectionWithCards(id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/cms/insights/[id]
// ============================================================================
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase
      .from("insights_section")
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
