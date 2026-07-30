// ============================================================================
// Stratifit — Insights Section API
// CRUD for managing the CMS-driven insights section and its insight cards.
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

// ============================================================================
// GET /api/cms/insights
// Returns all insights sections with their cards, ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: sections, error: sectionsError } = await supabase
      .from("insights_section")
      .select("*")
      .order("display_order", { ascending: true });

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 });
    }

    const sectionIds = (sections ?? []).map((s) => (s as InsightsSectionRow).id);
    let cards: InsightCardRow[] = [];

    if (sectionIds.length > 0) {
      const { data: cardsData, error: cardsError } = await supabase
        .from("insight_cards")
        .select("*")
        .in("parent_section", sectionIds)
        .order("display_order", { ascending: true });

      if (cardsError) {
        return NextResponse.json({ error: cardsError.message }, { status: 500 });
      }

      cards = (cardsData ?? []) as InsightCardRow[];
    }

    const cardsBySection = new Map<string, InsightCardRow[]>();
    for (const card of cards) {
      const existing = cardsBySection.get(card.parent_section) ?? [];
      existing.push(card);
      cardsBySection.set(card.parent_section, existing);
    }

    const result: CmsInsightsSection[] = (sections ?? []).map((row) => {
      const section = mapInsightsSection(row as unknown as InsightsSectionRow);
      section.cards = (cardsBySection.get(section.id) ?? []).map((card) =>
        mapInsightCard(card)
      );
      return section;
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// POST /api/cms/insights
// Creates a new insights section with its cards.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
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
      .insert({
        display_order: displayOrder,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        description_translations: descriptionTranslations,
        view_all_url: viewAllUrl,
        view_all_label_translations: viewAllLabelTranslations,
        read_more_label_translations: readMoreLabelTranslations,
      })
      .select()
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: sectionError?.message ?? "Failed to create insights section" },
        { status: 500 }
      );
    }

    const sectionId = (section as InsightsSectionRow).id;

    if (cards.length > 0) {
      const { error: cardsError } = await supabase.from("insight_cards").insert(
        cards.map((card, index) => ({
          parent_section: sectionId,
          image_url: card.imageUrl,
          category: card.category,
          title_translations: card.titleTranslations,
          description_translations: card.descriptionTranslations,
          link_url: card.linkUrl,
          display_order: card.displayOrder ?? index,
          active: card.active,
        }))
      );

      if (cardsError) {
        return NextResponse.json({ error: cardsError.message }, { status: 500 });
      }
    }

    const result = await fetchSectionWithCards(sectionId);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
