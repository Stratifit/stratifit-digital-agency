import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work — Stratifit",
};

import { getPublicPortfolioProjects } from "@/features/portfolio/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function WorkPage() {
  const projects = await getPublicPortfolioProjects(100);

  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-20 md:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Our Work
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Selected projects
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            A look at how we turn strategy into working digital products.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          {projects.length === 0 ? (
            <p className="text-text-secondary">Projects will appear here soon.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.slug} className="flex flex-col">
                  <p className="text-sm font-medium text-primary">
                    {project.client_name}
                  </p>
                  <h2 className="mt-3 font-display text-xl font-semibold text-text-primary">
                    {resolveTranslation(project.title_translations, "en")}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">
                    {resolveTranslation(project.summary_translations, "en")}
                  </p>
                  <Button variant="tertiary" size="small" className="mt-4 self-start">
                    <Link href={`/work/${project.slug}`}>View case study</Link>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

