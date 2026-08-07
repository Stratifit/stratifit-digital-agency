import * as React from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import {
  DetailPageContent,
  resolveDetailBlocks,
} from "@/components/detail-pages/detail-block";
import type { DetailPageBlock } from "@/features/detail-pages/queries";

export function DetailPageView({
  eyebrow,
  title,
  description,
  subtitle,
  blocks,
  locale,
  fallback,
}: {
  eyebrow: string;
  title: string;
  description: string;
  subtitle: string;
  blocks: DetailPageBlock[];
  locale: string;
  fallback?: React.ReactNode;
}) {
  const renderBlocks = resolveDetailBlocks(blocks, locale);
  const hasContent = renderBlocks.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 opacity-30 blur-[120px]"
        />
        <Container className="relative z-10">
          <Reveal immediate variant="revealUp">
            {eyebrow ? (
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mb-4 font-display text-4xl font-black leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-none lg:text-7xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-base leading-relaxed text-text-muted sm:pl-6 sm:text-lg md:text-xl">
                {description}
              </p>
            ) : null}
            {subtitle ? (
              <p className="ml-4 mt-4 text-xs text-text-subtle sm:ml-6">
                {subtitle}
              </p>
            ) : null}
          </Reveal>
        </Container>

        <div aria-hidden="true" className="h-px w-full bg-white/5" />
      </section>

      {/* Content */}
      <section className="pb-20 md:pb-24">
        <Container className="max-w-3xl">
          <Reveal variant="fade">
            {hasContent ? (
              <DetailPageContent blocks={renderBlocks} />
            ) : fallback ? (
              fallback
            ) : null}
          </Reveal>
        </Container>
      </section>
    </>
  );
}
