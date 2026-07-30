// ============================================================================
// Stratifit — Pricing Section API
// CRUD for managing the CMS-driven pricing section and its packages.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/supabase/server";
import { pricingSectionSchema } from "@/lib/cms/validation-pricing";
import {
  mapPricingSection,
  mapPricingPackage,
  type CmsPricingSection,
  type PricingSectionRow,
  type PricingPackageRow,
} from "@/lib/types/pricing";

// ============================================================================
// GET /api/cms/pricing
// Returns all pricing sections with their packages, ordered by display_order.
// ============================================================================
export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: sections, error: sectionsError } = await supabase
      .from("pricing_section")
      .select("*")
      .order("display_order", { ascending: true });

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 });
    }

    const sectionIds = (sections ?? []).map((s) => (s as PricingSectionRow).id);
    let packages: PricingPackageRow[] = [];

    if (sectionIds.length > 0) {
      const { data: packagesData, error: packagesError } = await supabase
        .from("pricing_packages")
        .select("*")
        .in("parent_section", sectionIds)
        .order("display_order", { ascending: true });

      if (packagesError) {
        return NextResponse.json({ error: packagesError.message }, { status: 500 });
      }

      packages = (packagesData ?? []) as PricingPackageRow[];
    }

    const packagesBySection = new Map<string, PricingPackageRow[]>();
    for (const pkg of packages) {
      const existing = packagesBySection.get(pkg.parent_section) ?? [];
      existing.push(pkg);
      packagesBySection.set(pkg.parent_section, existing);
    }

    const result: CmsPricingSection[] = (sections ?? []).map((row) => {
      const section = mapPricingSection(row as unknown as PricingSectionRow);
      section.packages = (packagesBySection.get(section.id) ?? []).map((pkg) =>
        mapPricingPackage(pkg)
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
// POST /api/cms/pricing
// Creates a new pricing section with its packages.
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const { data: section, error: sectionError } = await supabase
      .from("pricing_section")
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
        { error: sectionError?.message ?? "Failed to create pricing section" },
        { status: 500 }
      );
    }

    const sectionId = (section as PricingSectionRow).id;

    if (packages.length > 0) {
      const { error: packagesError } = await supabase.from("pricing_packages").insert(
        packages.map((pkg, index) => ({
          parent_section: sectionId,
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

    const result = await fetchSectionWithPackages(sectionId);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Fetch a single pricing section with its packages. */
async function fetchSectionWithPackages(sectionId: string): Promise<CmsPricingSection | null> {
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
