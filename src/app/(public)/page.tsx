import type { Metadata } from "next";
import { HOMEPAGE_SECTION_KEYS, sectionRegistry } from "@/registry/sections";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { pageMetadata } from "@/lib/seo";
import { getPublicSectionSetting } from "@/features/section-settings/queries";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const settings = await getPublicSiteSettings();
  const seo = settings?.default_seo?.[locale] ?? settings?.default_seo?.en ?? null;
  return pageMetadata({
    title: seo?.title || settings?.site_name || "Stratifit",
    description: seo?.description || settings?.site_description_translations?.[locale] || settings?.site_description_translations?.en || "",
    path: "/",
  });
}

export default async function HomePage() {
  const sectionKeys = HOMEPAGE_SECTION_KEYS.map((key) =>
    key === "techStack"
      ? "tech-stack"
      : key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  );
  const sectionSettings = await Promise.all(
    sectionKeys.map((sectionKey) => getPublicSectionSetting(sectionKey))
  );

  return (
    <>
      {HOMEPAGE_SECTION_KEYS.map((key, index) => {
        if (key !== "hero" && !sectionSettings[index]) {
          return null;
        }
        const section = sectionRegistry[key];
        const Component = section.component;
        return <Component key={section.key} />;
      })}
    </>
  );
}
