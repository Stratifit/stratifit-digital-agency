// ============================================================================
// Stratifit — FAQ Section API
// CRUD for managing the CMS-driven FAQ section and its items.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { faqSectionSchema } from "@/lib/cms/validation-faq";
import {
  mapFaqSection,
  mapFaqItem,
  type CmsFaqSection,
  type FaqSectionRow,
  type FaqItemRow,
} from "@/lib/types/faq";

// ============================================================================
// GET /api/cms/faq
// Returns all FAQ sections with their items, ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: sections, error: sectionsError } = await supabase
      .from("faq_section")
      .select("*")
      .order("display_order", { ascending: true });

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 });
    }

    const sectionIds = (sections ?? []).map((s) => (s as FaqSectionRow).id);
    let items: FaqItemRow[] = [];

    if (sectionIds.length > 0) {
      const { data: itemsData, error: itemsError } = await supabase
        .from("faq_items")
        .select("*")
        .in("parent_section", sectionIds)
        .order("display_order", { ascending: true });

      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 });
      }

      items = (itemsData ?? []) as FaqItemRow[];
    }

    const itemsBySection = new Map<string, FaqItemRow[]>();
    for (const item of items) {
      const existing = itemsBySection.get(item.parent_section) ?? [];
      existing.push(item);
      itemsBySection.set(item.parent_section, existing);
    }

    const result: CmsFaqSection[] = (sections ?? []).map((row) => {
      const section = mapFaqSection(row as unknown as FaqSectionRow);
      section.items = (itemsBySection.get(section.id) ?? []).map((item) =>
        mapFaqItem(item)
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
// POST /api/cms/faq
// Creates a new FAQ section with its items.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = faqSectionSchema.safeParse(body);

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
      items,
    } = parsed.data;

    const { data: section, error: sectionError } = await supabase
      .from("faq_section")
      .insert({
        display_order: displayOrder,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        description_translations: descriptionTranslations,
      })
      .select()
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: sectionError?.message ?? "Failed to create FAQ section" },
        { status: 500 }
      );
    }

    const sectionId = (section as FaqSectionRow).id;

    if (items.length > 0) {
      const { error: itemsError } = await supabase.from("faq_items").insert(
        items.map((item, index) => ({
          parent_section: sectionId,
          question_translations: item.questionTranslations,
          answer_translations: item.answerTranslations,
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

/** Fetch a single FAQ section with its items. */
async function fetchSectionWithItems(sectionId: string): Promise<CmsFaqSection | null> {
  const supabase = getAdminClient();

  const { data: section, error: sectionError } = await supabase
    .from("faq_section")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from("faq_items")
    .select("*")
    .eq("parent_section", sectionId)
    .order("display_order", { ascending: true });

  if (itemsError) {
    return null;
  }

  return {
    ...mapFaqSection(section as unknown as FaqSectionRow),
    items: (items ?? []).map((item) => mapFaqItem(item as unknown as FaqItemRow)),
  };
}
