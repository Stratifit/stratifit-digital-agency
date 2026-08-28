import { getAdminHero } from "@/features/hero/admin-queries";
import { HeroForm } from "@/components/admin/hero-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function AdminHeroPage() {
  const hero = await getAdminHero();

  if (!hero) {
    return (
      <AdminPageHeader
        title="Hero"
        description="No hero record found. Run the database seed to create one."
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        backHref="/admin/content/sections"
        title="Hero"
        description="Headline, call-to-action buttons, stat metrics, and trusted-by logos shown at the top of the homepage."
      />
      <FormCard>
        <HeroForm hero={hero} />
      </FormCard>
    </div>
  );
}
