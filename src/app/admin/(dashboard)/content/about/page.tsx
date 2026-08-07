import { getAdminAboutPage } from "@/features/about/queries";
import { AboutPageForm } from "@/components/admin/about-page-form";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminAboutPage() {
  const about = await getAdminAboutPage();

  if (!about) {
    return (
      <AdminPageHeader
        title="About Page"
        description="No About page record found. Run the database seed to create one."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="About Page"
        description="Hero intro, stats band, mission, story, values, team, and CTA for the public About page."
      />
      <AboutPageForm initial={about} />
    </div>
  );
}
