import { notFound } from "next/navigation";
import { getLocale } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";
import { getPublicPortfolioDetail } from "@/features/portfolio/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { articleJsonLd, canonical, pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const project = await getPublicPortfolioDetail(slug);
  if (!project) return {};
  const title = `${resolveTranslation(project.title_translations, locale)} — Stratifit`;
  const description = resolveTranslation(project.summary_translations, locale);
  return {
    ...pageMetadata({ title, description, path: `/work/${slug}` }),
    openGraph: {
      title,
      description,
      url: canonical(`/work/${slug}`),
      type: "article",
      siteName: "Stratifit",
    },
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
  const locale = await getLocale();
  const project = await getPublicPortfolioDetail(slug);

  if (!project) {
    notFound();
  }

  const deliverables = (
    (project.deliverables_translations as Record<string, unknown> | null)?.[
      "en"
    ] ?? []
  ) as string[];

  const projectTitle = resolveTranslation(project.title_translations, locale);
  const projectSummary = resolveTranslation(project.summary_translations, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: projectTitle,
              description: projectSummary,
              url: canonical(`/work/${slug}`),
              publishedAt: project.published_at,
            })
          ),
        }}
      />
      <section className="border-b border-border bg-background-deep">
        <Container className="py-20 md:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            {project.client_name}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            {projectTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            {projectSummary}
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="space-y-8">
            {block("Challenge", resolveTranslation(project.challenge_translations, locale))}
            {block("Approach", resolveTranslation(project.approach_translations, locale))}
            {block("Solution", resolveTranslation(project.solution_translations, locale))}
            {block("Results", resolveTranslation(project.results_translations, locale))}

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
                <LinkButton href="/contact">
                  Start a Conversation
                </LinkButton>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}

