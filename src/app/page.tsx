import type { Metadata } from "next";
import { HOMEPAGE_SECTION_KEYS, sectionRegistry } from "@/registry/sections";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Stratifit — Digital Agency",
  description:
    "Stratifit is a premium multilingual digital agency delivering websites, web applications, e-commerce, and AI solutions.",
  openGraph: {
    title: "Stratifit — Digital Agency",
    description:
      "Premium digital agency for websites, web applications, e-commerce, and AI solutions.",
    type: "website",
  },
};

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
