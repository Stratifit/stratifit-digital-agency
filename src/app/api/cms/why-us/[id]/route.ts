// ============================================================================
// Stratifit — Single Why Us Section API
// GET / PUT / DELETE for a specific Why Us section and its feature cards.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { whyUsSectionSchema } from "@/lib/cms/validation-why-us";
import {
  mapWhyUsSection,
  mapWhyUsFeature,
  type CmsWhyUsSection,
  type WhyUsSectionRow,
  type WhyUsFeatureRow,
} from "@/lib/types/why-us";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Fetch a single Why Us section with its feature cards. */
async function fetchSectionWithFeatures(sectionId: string): Promise<CmsWhyUsSection | null> {
  const supabase = getAdminClient();

  const { data: section, error: sectionError } = await supabase
    .from("why_us_section")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    return null;
  }

  const { data: features, error: featuresError } = await supabase
    .from("why_us_features")
    .select("*")
    .eq("parent_section", sectionId)
    .order("display_order", { ascending: true });

  if (featuresError) {
    return null;
  }

  return {
    ...mapWhyUsSection(section as unknown as WhyUsSectionRow),
    features: (features ?? []).map((feature) =>
      mapWhyUsFeature(feature as unknown as WhyUsFeatureRow)
    ),
  };
}

// ============================================================================
// GET /api/cms/why-us/[id]
// ============================================================================
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await fetchSectionWithFeatures(id);

    if (!result) {
      return NextResponse.json(
        { error: "Why Us section not found" },
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
// PUT /api/cms/why-us/[id]
// Updates the Why Us section and syncs its feature cards.
// ============================================================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = whyUsSectionSchema.safeParse(body);

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
      features,
    } = parsed.data;

    const { data: section, error: sectionError } = await supabase
      .from("why_us_section")
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
        { error: sectionError?.message ?? "Failed to update Why Us section" },
        { status: 500 }
      );
    }

    // Sync features: delete existing, then insert new ones.
    const { error: deleteError } = await supabase
      .from("why_us_features")
      .delete()
      .eq("parent_section", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (features.length > 0) {
      const { error: insertError } = await supabase.from("why_us_features").insert(
        features.map((feature, index) => ({
          parent_section: id,
          icon: feature.icon,
          title_translations: feature.titleTranslations,
          description_translations: feature.descriptionTranslations,
          stat: feature.stat,
          stat_label_translations: feature.statLabelTranslations,
          display_order: feature.displayOrder ?? index,
          active: feature.active,
        }))
      );

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    const result = await fetchSectionWithFeatures(id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/cms/why-us/[id]
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
      .from("why_us_section")
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
