import Link from "next/link";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPublicPortfolioProjects } from "@/features/portfolio/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

export async function PortfolioSection() {
  const locale = await getLocale();
  const [projects, settings] = await Promise.all([
    getPublicPortfolioProjects(3),
    getPublicSectionSetting("portfolio"),
  ]);

  if (projects.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.slug} className="flex flex-col">
              <p className="text-sm font-medium text-primary">
                {project.client_name}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-text-primary">
                {resolveTranslation(project.title_translations, locale)}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">
                {resolveTranslation(project.summary_translations, locale)}
              </p>
              <Button variant="tertiary" size="small" className="mt-4 self-start">
                <Link href={`/work/${project.slug}`}>View case study</Link>
              </Button>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button variant="tertiary" size="small">
            <Link href="/work">View all</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}


