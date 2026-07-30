// ============================================================================
// Stratifit — Single Services Section API
// GET / PUT / DELETE for a specific services section and its cards.
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

interface RouteParams {
  params: Promise<{ id: string }>;
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

// ============================================================================
// GET /api/cms/services/[id]
// ============================================================================
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await fetchSectionWithCards(id);

    if (!result) {
      return NextResponse.json(
        { error: "Services section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// PUT /api/cms/services/[id]
// Updates the services section and syncs its cards.
// ============================================================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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
      .update({
        display_order: displayOrder,
        subtitle_translations: subtitleTranslations,
        title_translations: titleTranslations,
        description_translations: descriptionTranslations,
      })
      .eq("id", id)
      .select()
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: sectionError?.message ?? "Failed to update services section" },
        { status: 500 }
      );
    }

    // Sync cards: delete existing, then insert new ones.
    const { error: deleteError } = await supabase
      .from("service_cards")
      .delete()
      .eq("parent_section", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (services.length > 0) {
      const { error: insertError } = await supabase.from("service_cards").insert(
        services.map((card, index) => ({
          parent_section: id,
          icon: card.icon,
          title_translations: card.titleTranslations,
          description_translations: card.descriptionTranslations,
          deliverables: card.deliverables,
          url: card.url,
          display_order: card.displayOrder ?? index,
          active: card.active,
        }))
      );

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
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
// DELETE /api/cms/services/[id]
// ============================================================================
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase
      .from("services_section")
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
