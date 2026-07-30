// ============================================================================
// Stratifit — FAQ Section Single-Item API
// PUT / DELETE for a specific FAQ section.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { faqSectionSchema } from "@/lib/cms/validation-faq";
import {
  mapFaqSection,
  mapFaqItem,
  type FaqSectionRow,
  type FaqItemRow,
} from "@/lib/types/faq";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================================================
// PUT /api/cms/faq/[id]
// Updates the FAQ section and replaces its items.
// ============================================================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    const { error: sectionError } = await supabase
      .from("faq_section")
      .update({
        display_order: displayOrder,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        description_translations: descriptionTranslations,
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
      .from("faq_items")
      .delete()
      .eq("parent_section", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (items.length > 0) {
      const { error: itemsError } = await supabase.from("faq_items").insert(
        items.map((item, index) => ({
          parent_section: id,
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

    const result = await fetchSectionWithItems(id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/cms/faq/[id]
// Deletes the FAQ section and its items.
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
      .from("faq_section")
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

/** Fetch a single FAQ section with its items. */
async function fetchSectionWithItems(sectionId: string) {
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
