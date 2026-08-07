import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicPortfolioProjects } from "@/features/portfolio/queries";
import { getPublicServices } from "@/features/services/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { PortfolioGallery } from "./portfolio-gallery";

export async function PortfolioSection() {
  const locale = await getLocale();
  const [projects, services, settings] = await Promise.all([
    getPublicPortfolioProjects(8),
    getPublicServices(),
    getPublicSectionSetting("portfolio"),
  ]);

  if (projects.length === 0) {
    return null;
  }

  return (
    <>
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <Reveal variant="card" className="mt-12" cardSelector="[data-project-card]">
          <PortfolioGallery
            projects={projects}
            services={services}
            locale={locale}
          />
        </Reveal>
      </Container>
    </Section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
