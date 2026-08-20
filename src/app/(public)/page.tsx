import type { Metadata } from "next";
import { HOMEPAGE_SECTION_KEYS, sectionRegistry } from "@/registry/sections";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const settings = await getPublicSiteSettings();
  const seo = settings?.default_seo?.[locale] ?? settings?.default_seo?.en ?? null;
  return pageMetadata({
    title: seo?.title || "Stratifit Digital Agency",
    description:
      seo?.description ||
      "Stratifit is a premium multilingual digital agency delivering websites, web applications, e-commerce, and AI solutions.",
    path: "/",
  });
}

export default function HomePage() {
  return (
    <>
      {HOMEPAGE_SECTION_KEYS.map((key) => {
        const section = sectionRegistry[key];
        const Component = section.component;
        return <Component key={section.key} />;
      })}
    </>
  );
}
