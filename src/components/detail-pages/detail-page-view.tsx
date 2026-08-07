import * as React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import type { DetailPageBlock } from "@/features/detail-pages/queries";

function DetailBlock({
  block,
  locale,
}: {
  block: DetailPageBlock;
  locale: string;
}) {
  const text = resolveTranslation(block.text_translations, locale);

  switch (block.type) {
    case "heading":
      return (
        <h2 className="text-lg font-semibold text-text-primary">{text}</h2>
      );
    case "note":
      return (
        <p className="rounded-sm border border-border bg-surface p-4 text-text-muted">
          {text}
        </p>
      );
    default:
      return <p>{text}</p>;
  }
}

export function DetailPageView({
  title,
  subtitle,
  blocks,
  locale,
  fallback,
}: {
  title: string;
  subtitle: string;
  blocks: DetailPageBlock[];
  locale: string;
  fallback?: React.ReactNode;
}) {
  const hasContent = blocks.length > 0;

  return (
    <>
      <section className="border-b border-border bg-background-deep">
        <Container className="py-16 md:py-20">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 text-sm text-text-muted">{subtitle}</p>
          ) : null}
        </Container>
      </section>
      <Section>
        <Container className="max-w-3xl">
          <Reveal variant="fade">
            {hasContent ? (
              <div className="space-y-6 text-sm leading-7 text-text-secondary">
                {blocks.map((block, index) => (
                  <DetailBlock key={index} block={block} locale={locale} />
                ))}
              </div>
            ) : fallback ? (
              fallback
            ) : null}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
