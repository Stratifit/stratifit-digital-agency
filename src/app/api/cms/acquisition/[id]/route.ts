// ============================================================================
// Stratifit — Acquisition Section Single-Item API
// PUT / DELETE for a specific acquisition section.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { acquisitionSectionSchema } from "@/lib/cms/validation-acquisition";
import {
  mapAcquisitionSection,
  mapAcquisitionCard,
  type AcquisitionSectionRow,
  type AcquisitionCardRow,
} from "@/lib/types/acquisition";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================================================
// PUT /api/cms/acquisition/[id]
// Updates the acquisition section and replaces its cards.
// ============================================================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    const { error: sectionError } = await supabase
      .from("acquisition_section")
      .update({
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
      .eq("id", id);

    if (sectionError) {
      return NextResponse.json({ error: sectionError.message }, { status: 500 });
    }

    // Replace cards: delete existing then insert new
    const { error: deleteError } = await supabase
      .from("acquisition_cards")
      .delete()
      .eq("parent_section", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (items.length > 0) {
      const { error: cardsError } = await supabase.from("acquisition_cards").insert(
        items.map((item, index) => ({
          parent_section: id,
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

    const result = await fetchSectionWithItems(id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/cms/acquisition/[id]
// Deletes the acquisition section and its cards.
// ============================================================================
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getAdminClient();

    const { error } = await supabase
      .from("acquisition_section")
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

/** Fetch a single acquisition section with its cards. */
async function fetchSectionWithItems(sectionId: string) {
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
