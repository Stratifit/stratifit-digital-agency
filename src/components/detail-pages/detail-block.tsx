import * as React from "react";
import { DETAIL_PAGE_ICONS } from "@/features/detail-pages/icons";
import type {
  DetailPageBlockType,
  DetailPageListItem,
} from "@/features/detail-pages/queries";
import { resolvePublicTranslation as resolveTranslation } from "@/lib/i18n/public-translation";
import { cn } from "@/lib/cn";

/** Minimal translation-carrying block shape accepted by `resolveDetailBlocks`. */
interface TranslationBlock {
  type: string;
  icon?: string;
  divider?: boolean;
  text_translations?: Record<string, string> | null;
  items?: { text_translations?: Record<string, string> | null }[];
  title_translations?: Record<string, string> | null;
  tag_translations?: Record<string, string> | null;
  body_translations?: Record<string, string> | null;
}

const resolve = (
  v: Record<string, string> | null | undefined,
  locale: string
) => resolveTranslation(v ?? null, locale);

/**
 * Resolves raw blocks (DB rows or live CMS form values) into locale-specific
 * render blocks. Shared by the public `DetailPageView` and the CMS preview so
 * the two always render identically.
 */
export function resolveDetailBlocks(
  blocks: TranslationBlock[],
  locale: string
): DetailPageRenderBlock[] {
  const out: DetailPageRenderBlock[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "heading":
        out.push({
          type: "heading",
          icon: block.icon,
          text: resolve(block.text_translations, locale),
        });
        break;
      case "subheading":
        out.push({
          type: "subheading",
          divider: block.divider === true,
          text: resolve(block.text_translations, locale),
        });
        break;
      case "paragraph":
        out.push({
          type: "paragraph",
          text: resolve(block.text_translations, locale),
        });
        break;
      case "list":
        out.push({
          type: "list",
          items: (block.items ?? [])
            .map((item) =>
              resolve(
                (item as DetailPageListItem).text_translations,
                locale
              )
            )
            .filter((text) => text.length > 0),
        });
        break;
      case "panel":
        out.push({
          type: "panel",
          panelTitle: resolve(block.title_translations, locale),
          panelTag: resolve(block.tag_translations, locale),
          panelBody: resolve(block.body_translations, locale),
        });
        break;
      case "note":
        out.push({
          type: "note",
          text: resolve(block.text_translations, locale),
        });
        break;
      default:
        break;
    }
  }

  return out;
}

/**
 * Resolved block shape — translations already resolved for one locale so the
 * same renderer works for the public server view and the CMS live preview.
 */
export interface DetailPageRenderBlock {
  type: DetailPageBlockType;
  icon?: string;
  divider?: boolean;
  text?: string;
  items?: string[];
  panelTitle?: string;
  panelTag?: string;
  panelBody?: string;
}

/**
 * Tiny inline-link markup: `[label](url)` inside paragraph/panel text becomes
 * an <a> element. Only http(s), mailto, tel, and internal (/) targets render
 * as links; anything else is kept literal so the CMS stays safe from raw HTML.
 */
export function renderInlineText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const href = match[2];
    const isSafe =
      /^https?:\/\//i.test(href) ||
      /^mailto:/i.test(href) ||
      /^tel:/i.test(href) ||
      (href.startsWith("/") && !href.startsWith("//"));
    if (isSafe) {
      parts.push(
        <a
          key={key++}
          href={href}
          className="text-primary underline underline-offset-2 transition-colors hover:text-primary-light"
        >
          {label}
        </a>
      );
    } else {
      parts.push(match[0]);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function ParagraphText({ text }: { text: string }) {
  return (
    <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
      {renderInlineText(text)}
    </p>
  );
}

/**
 * Renders a single resolved detail-page block. Heading blocks are the card
 * header (icon + title) and are rendered by `DetailPageContent` instead.
 */
export function DetailBlock({ block }: { block: DetailPageRenderBlock }) {
  switch (block.type) {
    case "subheading":
      return (
        <div className={cn(block.divider && "border-t border-white/10 pt-6")}>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
            {block.text}
          </h3>
        </div>
      );
    case "list":
      return (
        <ul className="space-y-3">
          {(block.items ?? []).map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary sm:text-base"
            >
              <span aria-hidden="true" className="mt-1 shrink-0 text-primary">
                ▸
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "panel":
      return (
        <div className="rounded-card border border-white/5 p-5">
          <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-primary">
            {block.panelTitle}
          </h4>
          {block.panelTag ? (
            <p className="mb-2 text-xs font-medium text-text-subtle">
              {block.panelTag}
            </p>
          ) : null}
          <div className="text-sm leading-relaxed text-text-secondary">
            {renderInlineText(block.panelBody ?? "")}
          </div>
        </div>
      );
    case "note":
      return (
        <p className="rounded-sm border border-border bg-surface p-4 text-sm text-text-muted">
          {block.text}
        </p>
      );
    default:
      return <ParagraphText text={block.text ?? ""} />;
  }
}

/** A heading block is the card header — with an icon when one is chosen. */
function CardHeader({ block }: { block: DetailPageRenderBlock }) {
  const Icon = block.icon ? DETAIL_PAGE_ICONS[block.icon as keyof typeof DETAIL_PAGE_ICONS] : null;
  return (
    <div className="mb-4 flex items-center gap-3">
      {Icon ? (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-card border border-primary/20 bg-primary/10">
          <Icon className="size-5 text-primary" aria-hidden="true" />
        </span>
      ) : null}
      <h2 className="font-display text-xl font-bold text-text-primary md:text-2xl">
        {block.text}
      </h2>
    </div>
  );
}

/**
 * Groups blocks into cards: a `heading` starts a new card and the blocks that
 * follow belong to it until the next heading. Blocks before the first heading
 * render as plain content above the cards (safe for lead paragraphs).
 */
export function DetailPageContent({
  blocks,
}: {
  blocks: DetailPageRenderBlock[];
}) {
  const cards: DetailPageRenderBlock[][] = [];
  const lead: DetailPageRenderBlock[] = [];
  let current: DetailPageRenderBlock[] | null = null;

  for (const block of blocks) {
    if (block.type === "heading") {
      if (current && current.length > 0) {
        cards.push(current);
      }
      current = [block];
    } else if (current) {
      current.push(block);
    } else {
      lead.push(block);
    }
  }
  if (current && current.length > 0) {
    cards.push(current);
  }

  return (
    <div className="space-y-12">
      {lead.length > 0 ? (
        <div className="space-y-6">
          {lead.map((block, index) => (
            <DetailBlock key={`lead-${index}`} block={block} />
          ))}
        </div>
      ) : null}

      {cards.map((card, cardIndex) => {
        const [heading, ...body] = card;
        return (
          <div
            key={`card-${cardIndex}`}
            className="rounded-card-lg border border-white/5 bg-card-dark p-6 sm:p-8"
          >
            <CardHeader block={heading} />
            {body.length > 0 ? (
              <div className="space-y-6">
                {body.map((block, index) => (
                  <DetailBlock key={`block-${index}`} block={block} />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
