import { getAdminSectionSettings } from "@/features/section-settings/queries";
import { getAdminHero } from "@/features/hero/admin-queries";
import { getAdminFinalCta } from "@/features/final-cta/queries";
import {
  SectionsManager,
  type SectionManagerRow,
} from "@/components/admin/sections-manager";
import { AdminPageHeader } from "@/components/admin/page-header";

function tr(v: Record<string, string> | null | undefined): Record<string, string> {
  return v ?? {};
}

export default async function AdminSectionsPage() {
  const settingsRows = await getAdminSectionSettings();
  const hero = await getAdminHero();
  const finalCta = await getAdminFinalCta();

  const settingsByKey = new Map(
    settingsRows.map((r) => [r.section_key, r])
  );

  const rows: SectionManagerRow[] = [];

  // Hero — own table
  if (hero) {
    const title = tr(hero.title_translations);
    const highlight = tr(hero.highlight_translations);
    const eyebrow = tr(hero.eyebrow_translations);
    const description = tr(hero.description_translations);
    rows.push({
      key: "hero",
      label: "Hero",
      description: "Headline, CTAs, metrics, tech stack",
      status: "live",
      isVisible: hero.is_visible,
      editHref: "/admin/content/hero",
      preview: {
        en: { eyebrow: eyebrow.en ?? "", title: title.en ?? "", highlight: highlight.en ?? "", description: description.en ?? "" },
        de: { eyebrow: eyebrow.de ?? "", title: title.de ?? "", highlight: highlight.de ?? "", description: description.de ?? "" },
        fr: { eyebrow: eyebrow.fr ?? "", title: title.fr ?? "", highlight: highlight.fr ?? "", description: description.fr ?? "" },
        es: { eyebrow: eyebrow.es ?? "", title: title.es ?? "", highlight: highlight.es ?? "", description: description.es ?? "" },
      },
    });
  }

  // Trusted By — content-driven
  rows.push({
    key: "trustedBy",
    label: "Trusted By",
    description: "Client and partner logos under the hero",
    status: "auto",
    isVisible: true,
    editHref: "/admin/content/trusted-logos",
    countLabel: "Shown automatically when logos are added",
    preview: {
      en: { eyebrow: "", title: "Trusted By", highlight: "", description: "Logos row — managed in Trusted Logos." },
      de: { eyebrow: "", title: "Trusted By", highlight: "", description: "Logos row — managed in Trusted Logos." },
      fr: { eyebrow: "", title: "Trusted By", highlight: "", description: "Logos row — managed in Trusted Logos." },
      es: { eyebrow: "", title: "Trusted By", highlight: "", description: "Logos row — managed in Trusted Logos." },
    },
  });

  // Section-settings-backed sections
  const settingsSections: {
    key: string;
    label: string;
    description: string;
    editHref: string;
  }[] = [
    { key: "services", label: "Services", description: "Core service cards", editHref: "/admin/content/services" },
    { key: "process", label: "Process", description: "How we work steps", editHref: "/admin/content/process" },
    { key: "why-choose-us", label: "Why Choose Us", description: "Differentiators", editHref: "/admin/content/why-choose-us" },
    { key: "insights", label: "Insights & Expertise", description: "Latest articles", editHref: "/admin/content/insights" },
    { key: "portfolio", label: "Portfolio", description: "Selected work", editHref: "/admin/content/portfolio" },
    { key: "testimonials", label: "Testimonials", description: "Client quotes", editHref: "/admin/content/testimonials" },
    { key: "pricing", label: "Pricing", description: "Package plans", editHref: "/admin/content/pricing" },
    { key: "faq", label: "FAQ", description: "Frequently asked questions", editHref: "/admin/content/faq" },
    { key: "contact", label: "Contact", description: "Enquiry form section", editHref: "/admin/content/sections/contact/edit" },
  ];

  for (const s of settingsSections) {
    const setting = settingsByKey.get(s.key);
    const eyebrow = tr(setting?.eyebrow_translations);
    const title = tr(setting?.title_translations);
    const highlight = tr(setting?.highlight_translations);
    const description = tr(setting?.description_translations);
    rows.push({
      key: s.key,
      label: s.label,
      description: s.description,
      status: "live",
      isVisible: setting?.is_visible ?? true,
      editHref: s.editHref,
      preview: {
        en: { eyebrow: eyebrow.en ?? "", title: title.en ?? "", highlight: highlight.en ?? "", description: description.en ?? "" },
        de: { eyebrow: eyebrow.de ?? "", title: title.de ?? "", highlight: highlight.de ?? "", description: description.de ?? "" },
        fr: { eyebrow: eyebrow.fr ?? "", title: title.fr ?? "", highlight: highlight.fr ?? "", description: description.fr ?? "" },
        es: { eyebrow: eyebrow.es ?? "", title: title.es ?? "", highlight: highlight.es ?? "", description: description.es ?? "" },
      },
    });
  }

  // Acquisition — content-driven
  rows.push({
    key: "acquisition",
    label: "Acquisition",
    description: "Buy-a-business marketplace",
    status: "auto",
    isVisible: true,
    editHref: null,
    countLabel: "Managed under Buy-a-Business",
    preview: {
      en: { eyebrow: "", title: "Buy a Business", highlight: "", description: "Marketplace preview — managed under Buy-a-Business." },
      de: { eyebrow: "", title: "Buy a Business", highlight: "", description: "Marketplace preview — managed under Buy-a-Business." },
      fr: { eyebrow: "", title: "Buy a Business", highlight: "", description: "Marketplace preview — managed under Buy-a-Business." },
      es: { eyebrow: "", title: "Buy a Business", highlight: "", description: "Marketplace preview — managed under Buy-a-Business." },
    },
  });

  // Final CTA — own table
  if (finalCta) {
    const title = tr(finalCta.title_translations);
    const description = tr(finalCta.description_translations);
    rows.push({
      key: "finalCta",
      label: "Final CTA",
      description: "Closing call-to-action",
      status: "live",
      isVisible: finalCta.is_visible,
      editHref: "/admin/content/final-cta",
      preview: {
        en: { eyebrow: "", title: title.en ?? "", highlight: "", description: description.en ?? "" },
        de: { eyebrow: "", title: title.de ?? "", highlight: "", description: description.de ?? "" },
        fr: { eyebrow: "", title: title.fr ?? "", highlight: "", description: description.fr ?? "" },
        es: { eyebrow: "", title: title.es ?? "", highlight: "", description: description.es ?? "" },
      },
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Website Sections"
        description="Every frontend section — preview it in all four languages, pause it, or edit its content."
      />
      <SectionsManager rows={rows} />
    </div>
  );
}
