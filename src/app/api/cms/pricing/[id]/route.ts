// ============================================================================
// Stratifit — Pricing Section Single-Item API
// PUT / DELETE for a specific pricing section.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { pricingSectionSchema } from "@/lib/cms/validation-pricing";
import {
  mapPricingSection,
  mapPricingPackage,
  type PricingSectionRow,
  type PricingPackageRow,
} from "@/lib/types/pricing";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================================================
// PUT /api/cms/pricing/[id]
// Updates the pricing section and replaces its packages.
// ============================================================================
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = pricingSectionSchema.safeParse(body);

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
      packages,
    } = parsed.data;

    const { error: sectionError } = await supabase
      .from("pricing_section")
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

    // Replace packages: delete existing then insert new
    const { error: deleteError } = await supabase
      .from("pricing_packages")
      .delete()
      .eq("parent_section", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (packages.length > 0) {
      const { error: packagesError } = await supabase.from("pricing_packages").insert(
        packages.map((pkg, index) => ({
          parent_section: id,
          name_translations: pkg.nameTranslations,
          description_translations: pkg.descriptionTranslations,
          price: pkg.price,
          price_label_translations: pkg.priceLabelTranslations,
          is_popular: pkg.isPopular,
          button_label_translations: pkg.buttonLabelTranslations,
          button_action: pkg.buttonAction,
          features: pkg.features,
          display_order: pkg.displayOrder ?? index,
          active: pkg.active,
        }))
      );

      if (packagesError) {
        return NextResponse.json({ error: packagesError.message }, { status: 500 });
      }
    }

    const result = await fetchSectionWithPackages(id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/cms/pricing/[id]
// Deletes the pricing section and its packages.
// ============================================================================
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getAdminClient();

    // Cascade delete handles packages via FK
    const { error } = await supabase
      .from("pricing_section")
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

/** Fetch a single pricing section with its packages. */
async function fetchSectionWithPackages(sectionId: string) {
  const supabase = getAdminClient();

  const { data: section, error: sectionError } = await supabase
    .from("pricing_section")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (sectionError || !section) {
    return null;
  }

  const { data: packages, error: packagesError } = await supabase
    .from("pricing_packages")
    .select("*")
    .eq("parent_section", sectionId)
    .order("display_order", { ascending: true });

  if (packagesError) {
    return null;
  }

  return {
    ...mapPricingSection(section as unknown as PricingSectionRow),
    packages: (packages ?? []).map((pkg) =>
      mapPricingPackage(pkg as unknown as PricingPackageRow)
    ),
  };
}
