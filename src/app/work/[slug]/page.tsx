import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublicPortfolioDetail } from "@/features/portfolio/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicPortfolioDetail(slug);
  if (!project) return {};
  return {
    title: `${resolveTranslation(project.title_translations, "en")} — Stratifit`,
    description: resolveTranslation(project.summary_translations, "en"),
  };
}

function block(
  heading: string,
  value: string
): React.ReactNode {
  if (!value) return null;
  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary">{heading}</h2>
      <p className="mt-2 text-base leading-7 text-text-secondary">{value}</p>
    </div>
  );
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublicPortfolioDetail(slug);

  if (!project) {
    notFound();
  }

  const deliverables = (
    (project.deliverables_translations as Record<string, unknown> | null)?.[
      "en"
    ] ?? []
  ) as string[];

  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-20 md:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            {project.client_name}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            {resolveTranslation(project.title_translations, "en")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            {resolveTranslation(project.summary_translations, "en")}
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="space-y-8">
            {block("Challenge", resolveTranslation(project.challenge_translations, "en"))}
            {block("Approach", resolveTranslation(project.approach_translations, "en"))}
            {block("Solution", resolveTranslation(project.solution_translations, "en"))}
            {block("Results", resolveTranslation(project.results_translations, "en"))}

            {deliverables.length > 0 ? (
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Deliverables</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {deliverables.map((item, index) => (
                    <li
                      key={index}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mt-12">
            <Card className="p-6">
              <p className="font-display text-lg font-semibold text-text-primary">
                Interested in a similar project?
              </p>
              <div className="mt-4">
                <Button>
                  <Link href="/contact">Start a Conversation</Link>
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
