// ============================================================================
// Stratifit — Portfolio Section API
// CRUD for managing the CMS-driven portfolio section and its items.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { portfolioSectionSchema } from "@/lib/cms/validation-portfolio";
import {
  mapPortfolioSection,
  mapPortfolioItem,
  type CmsPortfolioSection,
  type PortfolioSectionRow,
  type PortfolioItemRow,
} from "@/lib/types/portfolio";

// ============================================================================
// GET /api/cms/portfolio
// Returns all portfolio sections with their items, ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: sections, error: sectionsError } = await supabase
      .from("portfolio_section")
      .select("*")
      .order("display_order", { ascending: true });

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 });
    }

    const sectionIds = (sections ?? []).map((s) => (s as PortfolioSectionRow).id);
    let items: PortfolioItemRow[] = [];

    if (sectionIds.length > 0) {
      const { data: itemsData, error: itemsError } = await supabase
        .from("portfolio_items")
        .select("*")
        .in("parent_section", sectionIds)
        .order("display_order", { ascending: true });

      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 });
      }

      items = (itemsData ?? []) as PortfolioItemRow[];
    }

    const itemsBySection = new Map<string, PortfolioItemRow[]>();
    for (const item of items) {
      const existing = itemsBySection.get(item.parent_section) ?? [];
      existing.push(item);
      itemsBySection.set(item.parent_section, existing);
    }

    const result: CmsPortfolioSection[] = (sections ?? []).map((row) => {
      const section = mapPortfolioSection(row as unknown as PortfolioSectionRow);
      section.items = (itemsBySection.get(section.id) ?? []).map((item) =>
        mapPortfolioItem(item)
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
// POST /api/cms/portfolio
// Creates a new portfolio section with its items.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const { data: section, error: sectionError } = await supabase
      .from("portfolio_section")
      .insert({
        display_order: displayOrder,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        description_translations: descriptionTranslations,
        view_all_url: viewAllUrl,
        view_all_label_translations: viewAllLabelTranslations,
        view_case_study_label_translations: viewCaseStudyLabelTranslations,
        filters,
      })
      .select()
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: sectionError?.message ?? "Failed to create portfolio section" },
        { status: 500 }
      );
    }

    const sectionId = (section as PortfolioSectionRow).id;

    if (items.length > 0) {
      const { error: itemsError } = await supabase.from("portfolio_items").insert(
        items.map((item, index) => ({
          parent_section: sectionId,
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

    const result = await fetchSectionWithItems(sectionId);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Fetch a single portfolio section with its items. */
async function fetchSectionWithItems(sectionId: string): Promise<CmsPortfolioSection | null> {
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
