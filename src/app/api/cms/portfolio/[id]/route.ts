// ============================================================================
// Stratifit — Portfolio Section Single-Item API
// PUT / DELETE for a specific portfolio section.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { portfolioSectionSchema } from "@/lib/cms/validation-portfolio";
import {
  mapPortfolioSection,
  mapPortfolioItem,
  type PortfolioSectionRow,
  type PortfolioItemRow,
} from "@/lib/types/portfolio";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================================================
// PUT /api/cms/portfolio/[id]
// Updates the portfolio section and replaces its items.
// ============================================================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = portfolioSectionSchema.safeParse(body);

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
      viewCaseStudyLabelTranslations,
      filters,
      items,
    } = parsed.data;

    const { error: sectionError } = await supabase
      .from("portfolio_section")
      .update({
        display_order: displayOrder,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        description_translations: descriptionTranslations,
        view_all_url: viewAllUrl,
        view_all_label_translations: viewAllLabelTranslations,
        view_case_study_label_translations: viewCaseStudyLabelTranslations,
        filters,
      })
      .eq("id", id);

    if (sectionError) {
      return NextResponse.json(
        { error: sectionError.message },
        { status: 500 }
      );
    }

    // Replace items: delete existing then insert new
    const { error: deleteError } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("parent_section", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (items.length > 0) {
      const { error: itemsError } = await supabase.from("portfolio_items").insert(
        items.map((item, index) => ({
          parent_section: id,
          image_url: item.imageUrl,
          category: item.category,
          title_translations: item.titleTranslations,
          description_translations: item.descriptionTranslations,
          link_url: item.linkUrl,
          display_order: item.displayOrder ?? index,
          active: item.active,
        }))
      );

      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 });
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
// DELETE /api/cms/portfolio/[id]
// Deletes the portfolio section and its items.
// ============================================================================
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getAdminClient();

    // Cascade delete handles items via FK
    const { error } = await supabase
      .from("portfolio_section")
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

/** Fetch a single portfolio section with its items. */
async function fetchSectionWithItems(sectionId: string) {
  const supabase = getAdminClient();

  const { data: section, error: sectionError } = await supabase
    .from("portfolio_section")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("parent_section", sectionId)
    .order("display_order", { ascending: true });

  if (itemsError) {
    return null;
  }

  return {
    ...mapPortfolioSection(section as unknown as PortfolioSectionRow),
    items: (items ?? []).map((item) =>
      mapPortfolioItem(item as unknown as PortfolioItemRow)
    ),
  };
}
