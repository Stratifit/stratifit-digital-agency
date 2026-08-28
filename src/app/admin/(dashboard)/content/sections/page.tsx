import { getAdminSectionSettings } from "@/features/section-settings/queries";
import { SECTION_HEADER_FALLBACKS } from "@/lib/i18n/section-fallbacks";
import { getAdminHero } from "@/features/hero/admin-queries";
import { SectionsManager, type SectionManagerRow } from "@/components/admin/sections-manager";
import { AdminPageHeader } from "@/components/admin/page-header";

function tr(v: Record<string, string> | null | undefined): Record<string, string> {
  return v ?? {};
}

function sectionPreview(
  eyebrow: Record<string, string>,
  title: Record<string, string>,
  highlight: Record<string, string>,
  description: Record<string, string>,
  imageUrl: string | null = null,
  thumbnailUrls: string[] = []
) {
  return {
    en: { eyebrow: eyebrow.en ?? "", title: title.en ?? "", highlight: highlight.en ?? "", description: description.en ?? "", imageUrl, thumbnailUrls },
    de: { eyebrow: eyebrow.de ?? "", title: title.de ?? "", highlight: highlight.de ?? "", description: description.de ?? "", imageUrl, thumbnailUrls },
    fr: { eyebrow: eyebrow.fr ?? "", title: title.fr ?? "", highlight: highlight.fr ?? "", description: description.fr ?? "", imageUrl, thumbnailUrls },
    es: { eyebrow: eyebrow.es ?? "", title: title.es ?? "", highlight: highlight.es ?? "", description: description.es ?? "", imageUrl, thumbnailUrls },
  };
}

export default async function AdminSectionsPage() {
  const [settingsRows, hero] = await Promise.all([
    getAdminSectionSettings(),
    getAdminHero(),
  ]);
  const settingsByKey = new Map(settingsRows.map((row) => [row.section_key, row]));
  const rows: SectionManagerRow[] = [];

  if (hero) {
    const eyebrow = tr(hero.eyebrow_translations);
    const title = tr(hero.title_translations);
    const highlight = tr(hero.highlight_translations);
    const description = tr(hero.description_translations);
    const logos = hero.trusted_by?.map((item) => item.image_url).filter((url): url is string => Boolean(url)) ?? [];
    rows.push({
      key: "hero",
      label: "Hero",
      description: "Headline, CTAs, metrics, trusted-by strip",
      status: "live",
      isVisible: hero.is_visible,
      editHref: "/admin/content/hero",
      preview: sectionPreview(eyebrow, title, highlight, description, null, logos),
    });
  }

  const settingsSections = [
    ["tech-stack", "Tech Stack", "Scrolling technology marquee", "/admin/content/sections/tech-stack/edit"],
    ["services", "Services", "Core service cards", "/admin/content/services"],
    ["process", "Process", "How we work steps", "/admin/content/process"],
    ["why-choose-us", "Why Choose Us", "Differentiators", "/admin/content/why-choose-us"],
    ["insights", "Insights & Expertise", "Latest articles", "/admin/content/insights"],
    ["portfolio", "Portfolio", "Selected work", "/admin/content/portfolio"],
    ["testimonials", "Testimonials", "Client quotes", "/admin/content/testimonials"],
    ["pricing", "Pricing", "Package plans", "/admin/content/pricing"],
    ["faq", "FAQ", "Frequently asked questions", "/admin/content/faq"],
    ["contact", "Contact", "Enquiry form section", "/admin/content/sections/contact/edit"],
  ] as const;

  for (const [key, label, description, editHref] of settingsSections) {
    const setting = settingsByKey.get(key);
    const fallback = SECTION_HEADER_FALLBACKS[key];
    const eyebrow = tr(setting?.eyebrow_translations ?? fallback?.eyebrow);
    const title = tr(setting?.title_translations ?? fallback?.title);
    const highlight = tr(setting?.highlight_translations ?? fallback?.highlight);
    const sectionDescription = tr(setting?.description_translations ?? fallback?.description);
    const thumbnails = (setting?.tech_stack ?? []).map((item) => item.image_url).filter((url): url is string => Boolean(url));
    rows.push({
      key,
      label,
      description,
      status: "live",
      isVisible: setting?.is_visible ?? true,
      editHref,
      preview: sectionPreview(eyebrow, title, highlight, sectionDescription, thumbnails[0] ?? null, thumbnails.slice(1)),
    });
  }

  rows.push({
    key: "acquisition",
    label: "Acquisition",
    description: "Buy-a-business marketplace",
    status: "live",
    isVisible: settingsByKey.get("acquisition")?.is_visible ?? true,
    editHref: "/admin/content/acquisition",
    countLabel: "Listings managed in Buy a Business",
    preview: sectionPreview({}, { en: "Buy a Business", de: "Buy a Business", fr: "Buy a Business", es: "Buy a Business" }, {}, { en: "Marketplace preview — managed in the Buy a Business editor.", de: "Marketplace preview — managed in the Buy a Business editor.", fr: "Marketplace preview — managed in the Buy a Business editor.", es: "Marketplace preview — managed in the Buy a Business editor." }),
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Website Sections" description="Every frontend section — preview it in all four languages, pause it, or edit its content." />
      <SectionsManager rows={rows} />
    </div>
  );
}
