// ============================================================================
// Stratifit — Services Section API
// CRUD for managing the CMS-driven services section and its cards.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { servicesSectionSchema } from "@/lib/cms/validation-services";
import {
  mapServicesSection,
  mapServiceCard,
  type CmsServicesSection,
  type ServicesSectionRow,
  type ServiceCardRow,
} from "@/lib/types/services";

// ============================================================================
// GET /api/cms/services
// Returns all services sections with their cards, ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: sections, error: sectionsError } = await supabase
      .from("services_section")
      .select("*")
      .order("display_order", { ascending: true });

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 });
    }

    const sectionIds = (sections ?? []).map((s) => (s as ServicesSectionRow).id);
    let cards: ServiceCardRow[] = [];

    if (sectionIds.length > 0) {
      const { data: cardsData, error: cardsError } = await supabase
        .from("service_cards")
        .select("*")
        .in("parent_section", sectionIds)
        .order("display_order", { ascending: true });

      if (cardsError) {
        return NextResponse.json({ error: cardsError.message }, { status: 500 });
      }

      cards = (cardsData ?? []) as ServiceCardRow[];
    }

    const cardsBySection = new Map<string, ServiceCardRow[]>();
    for (const card of cards) {
      const existing = cardsBySection.get(card.parent_section) ?? [];
      existing.push(card);
      cardsBySection.set(card.parent_section, existing);
    }

    const result: CmsServicesSection[] = (sections ?? []).map((row) => {
      const section = mapServicesSection(row as unknown as ServicesSectionRow);
      section.services = (cardsBySection.get(section.id) ?? []).map((card) =>
        mapServiceCard(card)
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
// POST /api/cms/services
// Creates a new services section with its cards.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = servicesSectionSchema.safeParse(body);

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
      services,
    } = parsed.data;

    const { data: section, error: sectionError } = await supabase
      .from("services_section")
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
        { error: sectionError?.message ?? "Failed to create services section" },
        { status: 500 }
      );
    }

    const sectionId = (section as ServicesSectionRow).id;

    if (services.length > 0) {
      const { error: cardsError } = await supabase.from("service_cards").insert(
        services.map((card, index) => ({
          parent_section: sectionId,
          icon: card.icon,
          title_translations: card.titleTranslations,
          description_translations: card.descriptionTranslations,
          deliverables: card.deliverables,
          url: card.url,
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

/** Fetch a single services section with its cards. */
async function fetchSectionWithCards(sectionId: string): Promise<CmsServicesSection | null> {
  const supabase = getAdminClient();

  const { data: section, error: sectionError } = await supabase
    .from("services_section")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    return null;
  }

  const { data: cards, error: cardsError } = await supabase
    .from("service_cards")
    .select("*")
    .eq("parent_section", sectionId)
    .order("display_order", { ascending: true });

  if (cardsError) {
    return null;
  }

  return {
    ...mapServicesSection(section as unknown as ServicesSectionRow),
    services: (cards ?? []).map((card) =>
      mapServiceCard(card as unknown as ServiceCardRow)
    ),
  };
}
