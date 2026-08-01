import { HOMEPAGE_SECTION_KEYS, sectionRegistry } from "@/registry/sections";

export const revalidate = 300;

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
