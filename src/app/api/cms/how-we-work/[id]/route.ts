// ============================================================================
// Stratifit — Single How We Work Section API
// GET / PUT / DELETE for a specific how we work section and its steps.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { howWeWorkSectionSchema } from "@/lib/cms/validation-how-we-work";
import {
  mapHowWeWorkSection,
  mapHowWeWorkStep,
  type CmsHowWeWorkSection,
  type HowWeWorkSectionRow,
  type HowWeWorkStepRow,
} from "@/lib/types/how-we-work";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Fetch a single how we work section with its steps. */
async function fetchSectionWithSteps(sectionId: string): Promise<CmsHowWeWorkSection | null> {
  const supabase = getAdminClient();

  const { data: section, error: sectionError } = await supabase
    .from("how_we_work_section")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    return null;
  }

  const { data: steps, error: stepsError } = await supabase
    .from("how_we_work_steps")
    .select("*")
    .eq("parent_section", sectionId)
    .order("display_order", { ascending: true });

  if (stepsError) {
    return null;
  }

  return {
    ...mapHowWeWorkSection(section as unknown as HowWeWorkSectionRow),
    steps: (steps ?? []).map((step) =>
      mapHowWeWorkStep(step as unknown as HowWeWorkStepRow)
    ),
  };
}

// ============================================================================
// GET /api/cms/how-we-work/[id]
// ============================================================================
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await fetchSectionWithSteps(id);

    if (!result) {
      return NextResponse.json(
        { error: "How we work section not found" },
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
// PUT /api/cms/how-we-work/[id]
// Updates the how we work section and syncs its steps.
// ============================================================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = howWeWorkSectionSchema.safeParse(body);

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
      steps,
    } = parsed.data;

    const { data: section, error: sectionError } = await supabase
      .from("how_we_work_section")
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
        { error: sectionError?.message ?? "Failed to update how we work section" },
        { status: 500 }
      );
    }

    // Sync steps: delete existing, then insert new ones.
    const { error: deleteError } = await supabase
      .from("how_we_work_steps")
      .delete()
      .eq("parent_section", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (steps.length > 0) {
      const { error: insertError } = await supabase.from("how_we_work_steps").insert(
        steps.map((step, index) => ({
          parent_section: id,
          step_number: step.stepNumber,
          icon: step.icon,
          title_translations: step.titleTranslations,
          description_translations: step.descriptionTranslations,
          display_order: step.displayOrder ?? index,
        }))
      );

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    const result = await fetchSectionWithSteps(id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/cms/how-we-work/[id]
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
      .from("how_we_work_section")
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
