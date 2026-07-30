// ============================================================================
// Stratifit — Why Us Section API
// CRUD for managing the CMS-driven Why Us section and its feature cards.
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

// ============================================================================
// GET /api/cms/why-us
// Returns all Why Us sections with their feature cards, ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: sections, error: sectionsError } = await supabase
      .from("why_us_section")
      .select("*")
      .order("display_order", { ascending: true });

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 });
    }

    const sectionIds = (sections ?? []).map((s) => (s as WhyUsSectionRow).id);
    let features: WhyUsFeatureRow[] = [];

    if (sectionIds.length > 0) {
      const { data: featuresData, error: featuresError } = await supabase
        .from("why_us_features")
        .select("*")
        .in("parent_section", sectionIds)
        .order("display_order", { ascending: true });

      if (featuresError) {
        return NextResponse.json({ error: featuresError.message }, { status: 500 });
      }

      features = (featuresData ?? []) as WhyUsFeatureRow[];
    }

    const featuresBySection = new Map<string, WhyUsFeatureRow[]>();
    for (const feature of features) {
      const existing = featuresBySection.get(feature.parent_section) ?? [];
      existing.push(feature);
      featuresBySection.set(feature.parent_section, existing);
    }

    const result: CmsWhyUsSection[] = (sections ?? []).map((row) => {
      const section = mapWhyUsSection(row as unknown as WhyUsSectionRow);
      section.features = (featuresBySection.get(section.id) ?? []).map((feature) =>
        mapWhyUsFeature(feature)
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
// POST /api/cms/why-us
// Creates a new Why Us section with its feature cards.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
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
        { error: sectionError?.message ?? "Failed to create Why Us section" },
        { status: 500 }
      );
    }

    const sectionId = (section as WhyUsSectionRow).id;

    if (features.length > 0) {
      const { error: featuresError } = await supabase.from("why_us_features").insert(
        features.map((feature, index) => ({
          parent_section: sectionId,
          icon: feature.icon,
          title_translations: feature.titleTranslations,
          description_translations: feature.descriptionTranslations,
          stat: feature.stat,
          stat_label_translations: feature.statLabelTranslations,
          display_order: feature.displayOrder ?? index,
          active: feature.active,
        }))
      );

      if (featuresError) {
        return NextResponse.json({ error: featuresError.message }, { status: 500 });
      }
    }

    const result = await fetchSectionWithFeatures(sectionId);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
