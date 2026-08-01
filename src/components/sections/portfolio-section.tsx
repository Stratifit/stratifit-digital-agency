import Link from "next/link";
import { getPublicPortfolioProjects } from "@/features/portfolio/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function PortfolioSection({ locale = "en" }: { locale?: string }) {
  const projects = await getPublicPortfolioProjects(3);

  if (projects.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Our Work
          </h2>
          <Button variant="tertiary" size="small">
            <Link href="/work">View all</Link>
          </Button>
        </div>
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
      </Container>
    </Section>
  );
}
