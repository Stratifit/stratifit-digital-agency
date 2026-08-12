"use client";

import { Container } from "@/components/ui/container";
import {
  DetailPageContent,
  resolveDetailBlocks,
} from "@/components/detail-pages/detail-block";
import type { DetailPageBlockValue } from "@/features/detail-pages/schemas";

export interface DetailPagePreviewProps {
  eyebrow: string;
  title: string;
  description: string;
  subtitle: string;
  blocks: DetailPageBlockValue[];
  locale: string;
}

/**
 * Static, animation-free rendering of a detail page from draft form values.
 * Mirrors the public `DetailPageView` (hero + icon cards) but stays calm for
 * the CMS preview pane and renders whatever the admin types.
 */
export function DetailPagePreview({
  eyebrow,
  title,
  description,
  subtitle,
  blocks,
  locale,
}: DetailPagePreviewProps) {
  const renderBlocks = resolveDetailBlocks(blocks, locale);
  const hasContent = renderBlocks.length > 0;

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-background-deep pt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[480px] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]"
        />
        <Container className="relative z-10">
          {eyebrow ? (
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary md:text-4xl">
            {title || "Untitled page"}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-text-muted sm:pl-6 sm:text-base">
              {description}
            </p>
          ) : null}
          {subtitle ? (
            <p className="ml-4 mt-3 text-xs text-text-subtle sm:ml-6">
              {subtitle}
            </p>
          ) : null}
        </Container>
      </div>

      {/* Content */}
      <div className="bg-background">
        <Container className="max-w-3xl">
          {hasContent ? (
            <div className="pt-6 pb-10">
              <DetailPageContent blocks={renderBlocks} />
            </div>
          ) : (
            <p className="pt-6 pb-10 text-sm text-text-muted">
              Nothing to preview yet — add a heading, subheading, paragraph,
              list, panel, or note box.
            </p>
          )}
        </Container>
      </div>
    </div>
  );
}
