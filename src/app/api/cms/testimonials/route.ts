// ============================================================================
// Stratifit — Testimonials Section API
// CRUD for managing the CMS-driven testimonials section and its cards.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { testimonialsSectionSchema } from "@/lib/cms/validation-testimonials";
import {
  mapTestimonialsSection,
  mapTestimonialCard,
  type CmsTestimonialsSection,
  type TestimonialsSectionRow,
  type TestimonialCardRow,
} from "@/lib/types/testimonials";

// ============================================================================
// GET /api/cms/testimonials
// Returns all testimonials sections with their cards, ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: sections, error: sectionsError } = await supabase
      .from("testimonials_section")
      .select("*")
      .order("display_order", { ascending: true });

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 });
    }

    const sectionIds = (sections ?? []).map((s) => (s as TestimonialsSectionRow).id);
    let cards: TestimonialCardRow[] = [];

    if (sectionIds.length > 0) {
      const { data: cardsData, error: cardsError } = await supabase
        .from("testimonial_cards")
        .select("*")
        .in("parent_section", sectionIds)
        .order("display_order", { ascending: true });

      if (cardsError) {
        return NextResponse.json({ error: cardsError.message }, { status: 500 });
      }

      cards = (cardsData ?? []) as TestimonialCardRow[];
    }

    const cardsBySection = new Map<string, TestimonialCardRow[]>();
    for (const card of cards) {
      const existing = cardsBySection.get(card.parent_section) ?? [];
      existing.push(card);
      cardsBySection.set(card.parent_section, existing);
    }

    const result: CmsTestimonialsSection[] = (sections ?? []).map((row) => {
      const section = mapTestimonialsSection(row as unknown as TestimonialsSectionRow);
      section.cards = (cardsBySection.get(section.id) ?? []).map((card) =>
        mapTestimonialCard(card)
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
// POST /api/cms/testimonials
// Creates a new testimonials section with its cards.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const { data: section, error: sectionError } = await supabase
      .from("testimonials_section")
      .insert({
        display_order: displayOrder,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        description_translations: descriptionTranslations,
        view_all_url: viewAllUrl,
        view_all_label_translations: viewAllLabelTranslations,
      })
      .select()
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: sectionError?.message ?? "Failed to create testimonials section" },
        { status: 500 }
      );
    }

    const sectionId = (section as TestimonialsSectionRow).id;

    if (cards.length > 0) {
      const { error: cardsError } = await supabase.from("testimonial_cards").insert(
        cards.map((card, index) => ({
          parent_section: sectionId,
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

    const result = await fetchSectionWithCards(sectionId);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Fetch a single testimonials section with its cards. */
async function fetchSectionWithCards(sectionId: string): Promise<CmsTestimonialsSection | null> {
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
