// ============================================================================
// Stratifit — Acquisition Section API
// CRUD for managing the CMS-driven acquisition / Buy a Business section.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { acquisitionSectionSchema } from "@/lib/cms/validation-acquisition";
import {
  mapAcquisitionSection,
  mapAcquisitionCard,
  type CmsAcquisitionSection,
  type AcquisitionSectionRow,
  type AcquisitionCardRow,
} from "@/lib/types/acquisition";

// ============================================================================
// GET /api/cms/acquisition
// Returns all acquisition sections with their cards, ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: sections, error: sectionsError } = await supabase
      .from("acquisition_section")
      .select("*")
      .order("display_order", { ascending: true });

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 });
    }

    const sectionIds = (sections ?? []).map((s) => (s as AcquisitionSectionRow).id);
    let cards: AcquisitionCardRow[] = [];

    if (sectionIds.length > 0) {
      const { data: cardsData, error: cardsError } = await supabase
        .from("acquisition_cards")
        .select("*")
        .in("parent_section", sectionIds)
        .order("display_order", { ascending: true });

      if (cardsError) {
        return NextResponse.json({ error: cardsError.message }, { status: 500 });
      }

      cards = (cardsData ?? []) as AcquisitionCardRow[];
    }

    const cardsBySection = new Map<string, AcquisitionCardRow[]>();
    for (const card of cards) {
      const existing = cardsBySection.get(card.parent_section) ?? [];
      existing.push(card);
      cardsBySection.set(card.parent_section, existing);
    }

    const result: CmsAcquisitionSection[] = (sections ?? []).map((row) => {
      const section = mapAcquisitionSection(row as unknown as AcquisitionSectionRow);
      section.items = (cardsBySection.get(section.id) ?? []).map((card) =>
        mapAcquisitionCard(card)
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
// POST /api/cms/acquisition
// Creates a new acquisition section with its cards.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = acquisitionSectionSchema.safeParse(body);

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
      viewDetailLabelTranslations,
      visitSiteLabelTranslations,
      buyBusinessLabelTranslations,
      filters,
      items,
    } = parsed.data;

    const { data: section, error: sectionError } = await supabase
      .from("acquisition_section")
      .insert({
        display_order: displayOrder,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        description_translations: descriptionTranslations,
        view_all_url: viewAllUrl,
        view_all_label_translations: viewAllLabelTranslations,
        view_detail_label_translations: viewDetailLabelTranslations,
        visit_site_label_translations: visitSiteLabelTranslations,
        buy_business_label_translations: buyBusinessLabelTranslations,
        filters,
      })
      .select()
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: sectionError?.message ?? "Failed to create acquisition section" },
        { status: 500 }
      );
    }

    const sectionId = (section as AcquisitionSectionRow).id;

    if (items.length > 0) {
      const { error: cardsError } = await supabase.from("acquisition_cards").insert(
        items.map((item, index) => ({
          parent_section: sectionId,
          url: item.url,
          category: item.category,
          category_color: item.categoryColor,
          category_border_radius: item.categoryBorderRadius,
          nav_emoji: item.navEmoji,
          nav_title: item.navTitle,
          bg_image_url: item.bgImageUrl,
          overlay_color: item.overlayColor,
          icon_radius: item.iconRadius,
          icon_border: item.iconBorder,
          icon_shadow: item.iconShadow,
          main_emoji: item.mainEmoji,
          title_translations: item.titleTranslations,
          description_translations: item.descriptionTranslations,
          tags: item.tags,
          grid_emojis: item.gridEmojis,
          button_text_translations: item.buttonTextTranslations,
          trust_badges: item.trustBadges,
          price: item.price,
          link_url: item.linkUrl,
          visit_link_url: item.visitLinkUrl,
          display_order: item.displayOrder ?? index,
          active: item.active,
        }))
      );

      if (cardsError) {
        return NextResponse.json({ error: cardsError.message }, { status: 500 });
      }
    }

    const result = await fetchSectionWithItems(sectionId);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Fetch a single acquisition section with its cards. */
async function fetchSectionWithItems(sectionId: string): Promise<CmsAcquisitionSection | null> {
  const supabase = getAdminClient();

  const { data: section, error: sectionError } = await supabase
    .from("acquisition_section")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    return null;
  }

  const { data: cards, error: cardsError } = await supabase
    .from("acquisition_cards")
    .select("*")
    .eq("parent_section", sectionId)
    .order("display_order", { ascending: true });

  if (cardsError) {
    return null;
  }

  return {
    ...mapAcquisitionSection(section as unknown as AcquisitionSectionRow),
    items: (cards ?? []).map((card) =>
      mapAcquisitionCard(card as unknown as AcquisitionCardRow)
    ),
  };
}
