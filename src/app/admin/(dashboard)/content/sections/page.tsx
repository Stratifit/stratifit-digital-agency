import { getAdminSectionSettings } from "@/features/section-settings/queries";
import { SECTION_HEADER_FALLBACKS } from "@/lib/i18n/section-fallbacks";
import { getAdminHero } from "@/features/hero/admin-queries";
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
      description: "Headline, CTAs, metrics, trusted-by strip",
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

  // Section-settings-backed sections
  const settingsSections: {
    key: string;
    label: string;
    description: string;
    editHref: string | null;
  }[] = [
    { key: "tech-stack", label: "Tech Stack", description: "Scrolling technology marquee", editHref: "/admin/content/sections/tech-stack/edit" },
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
    // Fall back to the canonical section copy when the DB row is missing (for
    // example before migration 00057 has been applied) so the card previews
    // the content the public site renders instead of a blank "—".
    const fallback = SECTION_HEADER_FALLBACKS[s.key];
    const eyebrow = tr(setting?.eyebrow_translations ?? fallback?.eyebrow);
    const title = tr(setting?.title_translations ?? fallback?.title);
    const highlight = tr(setting?.highlight_translations ?? fallback?.highlight);
    const description = tr(
      setting?.description_translations ?? fallback?.description
    );
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

  // Acquisition — content-driven but pausable via section_settings, with a
  // dedicated editor for its content.
  rows.push({
    key: "acquisition",
    label: "Acquisition",
    description: "Buy-a-business marketplace",
    status: "live",
    isVisible: settingsByKey.get("acquisition")?.is_visible ?? true,
    editHref: "/admin/content/acquisition",
    countLabel: "Listings managed in Buy a Business",
    preview: {
      en: { eyebrow: "", title: "Buy a Business", highlight: "", description: "Marketplace preview — managed in the Buy a Business editor." },
      de: { eyebrow: "", title: "Buy a Business", highlight: "", description: "Marketplace preview — managed in the Buy a Business editor." },
      fr: { eyebrow: "", title: "Buy a Business", highlight: "", description: "Marketplace preview — managed in the Buy a Business editor." },
      es: { eyebrow: "", title: "Buy a Business", highlight: "", description: "Marketplace preview — managed in the Buy a Business editor." },
    },
  });

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
