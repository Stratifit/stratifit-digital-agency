// ============================================================================
// Stratifit — How We Work Section API
// CRUD for managing the CMS-driven How We Work section and its steps.
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

// ============================================================================
// GET /api/cms/how-we-work
// Returns all how we work sections with their steps, ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: sections, error: sectionsError } = await supabase
      .from("how_we_work_section")
      .select("*")
      .order("display_order", { ascending: true });

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 });
    }

    const sectionIds = (sections ?? []).map((s) => (s as HowWeWorkSectionRow).id);
    let steps: HowWeWorkStepRow[] = [];

    if (sectionIds.length > 0) {
      const { data: stepsData, error: stepsError } = await supabase
        .from("how_we_work_steps")
        .select("*")
        .in("parent_section", sectionIds)
        .order("display_order", { ascending: true });

      if (stepsError) {
        return NextResponse.json({ error: stepsError.message }, { status: 500 });
      }

      steps = (stepsData ?? []) as HowWeWorkStepRow[];
    }

    const stepsBySection = new Map<string, HowWeWorkStepRow[]>();
    for (const step of steps) {
      const existing = stepsBySection.get(step.parent_section) ?? [];
      existing.push(step);
      stepsBySection.set(step.parent_section, existing);
    }

    const result: CmsHowWeWorkSection[] = (sections ?? []).map((row) => {
      const section = mapHowWeWorkSection(row as unknown as HowWeWorkSectionRow);
      section.steps = (stepsBySection.get(section.id) ?? []).map((step) =>
        mapHowWeWorkStep(step)
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
// POST /api/cms/how-we-work
// Creates a new how we work section with its steps.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
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
        { error: sectionError?.message ?? "Failed to create how we work section" },
        { status: 500 }
      );
    }

    const sectionId = (section as HowWeWorkSectionRow).id;

    if (steps.length > 0) {
      const { error: stepsError } = await supabase.from("how_we_work_steps").insert(
        steps.map((step, index) => ({
          parent_section: sectionId,
          step_number: step.stepNumber,
          icon: step.icon,
          title_translations: step.titleTranslations,
          description_translations: step.descriptionTranslations,
          display_order: step.displayOrder ?? index,
        }))
      );

      if (stepsError) {
        return NextResponse.json({ error: stepsError.message }, { status: 500 });
      }
    }

    const result = await fetchSectionWithSteps(sectionId);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
