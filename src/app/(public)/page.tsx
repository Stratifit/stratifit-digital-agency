import { HOMEPAGE_SECTION_KEYS, sectionRegistry } from "@/registry/sections";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Stratifit — Digital Agency",
  description:
    "Stratifit is a premium multilingual digital agency delivering websites, web applications, e-commerce, and AI solutions.",
  path: "/",
});

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
