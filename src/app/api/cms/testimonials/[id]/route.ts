// ============================================================================
// Stratifit — Testimonials Section Single-Item API
// PUT / DELETE for a specific testimonials section.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { testimonialsSectionSchema } from "@/lib/cms/validation-testimonials";
import {
  mapTestimonialsSection,
  mapTestimonialCard,
  type TestimonialsSectionRow,
  type TestimonialCardRow,
} from "@/lib/types/testimonials";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================================================
// PUT /api/cms/testimonials/[id]
// Updates the testimonials section and replaces its cards.
// ============================================================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = testimonialsSectionSchema.safeParse(body);

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
      cards,
    } = parsed.data;

    const { error: sectionError } = await supabase
      .from("testimonials_section")
      .update({
        display_order: displayOrder,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        description_translations: descriptionTranslations,
        view_all_url: viewAllUrl,
        view_all_label_translations: viewAllLabelTranslations,
      })
      .eq("id", id);

    if (sectionError) {
      return NextResponse.json(
        { error: sectionError.message },
        { status: 500 }
      );
    }

    // Replace cards: delete existing then insert new
    const { error: deleteError } = await supabase
      .from("testimonial_cards")
      .delete()
      .eq("parent_section", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (cards.length > 0) {
      const { error: cardsError } = await supabase.from("testimonial_cards").insert(
        cards.map((card, index) => ({
          parent_section: id,
          initials: card.initials,
          name_translations: card.nameTranslations,
          role_translations: card.roleTranslations,
          quote_translations: card.quoteTranslations,
          rating: card.rating,
          display_order: card.displayOrder ?? index,
          active: card.active,
        }))
      );

      if (cardsError) {
        return NextResponse.json({ error: cardsError.message }, { status: 500 });
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
// DELETE /api/cms/testimonials/[id]
// Deletes the testimonials section and its cards.
// ============================================================================
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getAdminClient();

    // Cascade delete handles cards via FK
    const { error } = await supabase
      .from("testimonials_section")
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

/** Fetch a single testimonials section with its cards. */
async function fetchSectionWithCards(sectionId: string) {
  const supabase = getAdminClient();

  const { data: section, error: sectionError } = await supabase
    .from("testimonials_section")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    return null;
  }

  const { data: cards, error: cardsError } = await supabase
    .from("testimonial_cards")
    .select("*")
    .eq("parent_section", sectionId)
    .order("display_order", { ascending: true });

  if (cardsError) {
    return null;
  }

  return {
    ...mapTestimonialsSection(section as unknown as TestimonialsSectionRow),
    cards: (cards ?? []).map((card) =>
      mapTestimonialCard(card as unknown as TestimonialCardRow)
    ),
  };
}
