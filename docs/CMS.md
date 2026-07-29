# CMS.md

## 1. Purpose

This document defines the CMS architecture for the Stratifit Digital Agency platform.
It details content models, component mappings, rendering pipelines, multilingual fallback behavior, media management, and admin/AI interactions.

The CMS acts as the central content engine of Stratifit — all dynamic routes, visual layout sections, atomic content blocks, navigation menus, and global configurations are managed through Supabase and rendered by Next.js.

---

## 2. Core CMS Principles

* **Database-Driven Execution:** Pages, layout sections, and content blocks are defined relationally in Supabase rather than hardcoded in template files.
* **Composable Architecture:** Content is organized in a strict 3-tier hierarchy: `Pages → Sections → Content Blocks`.
* **Multilingual-First:** Full support for English (`en`) and German (`de`) with automatic fallbacks for missing translation keys.
* **Strict Type Safety & Schemas:** Every content block payload is validated against a typed JSON schema before rendering.
* **Design System Integration:** CMS models map directly to presentation components adhering to `DESIGN_SYSTEM.md` and `COMPONENT_STANDARDS.md`.
* **AI & Agent Compatibility:** Content generation, localization, and section creation via AI bots execute strictly through validated API layer functions and log operations to `ai_logs`.

---

## 3. CMS Content Model Architecture

```text
+-------------------------------------------------------------------------+
|                               Page Model                                |
|  slug: "/services/web-development" | locale: "en" | status: "published" |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                             Section Model                               |
|  component_type: "hero-primary" | display_order: 0 | visibility: "all"  |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                          Content Block Model                            |
|  block_type: "card" | display_order: 0 | data: { "title": "..." }       |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                           Translation Model                             |
|  entity_type: "content_blocks" | locale: "de" | fields: { ... }         |
+-------------------------------------------------------------------------+

```

### Primary Models & Schema References

All database entity structures are defined in detail in `DATABASE.md`:

* **`pages`:** Top-level page routes and SEO metadata.
* **`sections`:** Structural section layout wrappers.
* **`content_blocks`:** Atomic UI components and content payloads.
* **`media`:** Managed asset references and Storage CDN paths.
* **`navigation`:** Header/footer menu structures.
* **`settings`:** Global system parameters and site configs.
* **`translations`:** Localization overrides for `en` and `de`.

---

## 4. Page Model & Routing

Pages represent top-level public routes handled by Next.js App Router dynamic path segment catching.

### Fields Summary

* `id` (`uuid`): Unique identifier.
* `slug` (`text`): Canonical path (e.g., `/`, `about`, `services/web-development`).
* `title` (`text`): Page title string.
* `status` (`text`): Lifecycle status (`draft`, `published`, `archived`).
* `meta_data` (`jsonb`): OpenGraph image URLs, canonical URL overrides, meta titles, and descriptions.

### Routing Rules

1. Slugs must be unique within a given target locale.
2. Un-published pages (`status != 'published'`) are inaccessible to anon users and return a `444 / 404` error response.
3. Every page must contain at least 1 section.

### Page Resolution Entrypoint

Dynamic pages resolve via `src/app/[...slug]/page.tsx`:

```typescript
// Fetching sequence in page loader
const pageData = await getCmsPageBySlug(slug, currentLocale);
if (!pageData || pageData.status !== 'published') {
  notFound();
}

```

---

## 5. Section Model & Component Registry

Sections define structural layout zones across a page (e.g., hero banners, grid layouts, call-to-actions, pricing tables).

### Fields Summary

* `id` (`uuid`): Unique section identifier.
* `page_id` (`uuid`): Foreign key referencing parent `pages.id`.
* `component_type` (`text`): Registered component key (e.g., `hero-primary`, `feature-grid`).
* `display_order` (`integer`): Vertical render sequence (0-indexed).
* `visibility` (`jsonb`): Device and contextual visibility rules (e.g., `{"mobile": true, "desktop": true}`).

### Section Component Registry

Sections map dynamically to React components declared in `src/components/cms/sections/section-registry.ts`:

```typescript
import dynamic from 'next/dynamic';

export const sectionRegistry: Record<string, React.ComponentType<any>> = {
  'hero-primary': dynamic(() => import('@/components/cms/sections/hero-primary')),
  'feature-grid': dynamic(() => import('@/components/cms/sections/feature-grid')),
  'cta-banner': dynamic(() => import('@/components/cms/sections/cta-banner')),
  'pricing-table': dynamic(() => import('@/components/cms/sections/pricing-table')),
};

```

---

## 6. Content Block Model & Schemas

Content blocks are the atomic elements rendered inside sections (headings, paragraphs, media cards, CTA buttons).

### Fields Summary

* `id` (`uuid`): Unique block identifier.
* `section_id` (`uuid`): Foreign key referencing parent `sections.id`.
* `block_type` (`text`): Block type name (`heading`, `rich_text`, `card`, `button`, `media_embed`).
* `data` (`jsonb`): Content payload JSON validated against a type-safe Zod schema.
* `display_order` (`integer`): Block render sequence within its parent section.

### Standardized Block Schemas (`data` JSON Payload)

| Block Type | Payload Structure (`data`) | Associated React Component |
| --- | --- | --- |
| `heading` | `{ "text": string, "level": "h1" | "h2" | "h3", "align": "left" | "center" }` | `src/components/cms/blocks/heading-block.tsx` |
| `rich_text` | `{ "html_content": string, "formatted": boolean }` | `src/components/cms/blocks/rich-text-block.tsx` |
| `card` | `{ "title": string, "description": string, "icon_name": string, "media_id"?: string }` | `src/components/cms/blocks/card-block.tsx` |
| `button` | `{ "label": string, "href": string, "variant": "primary" | "secondary" | "outline" }` | `src/components/cms/blocks/button-block.tsx` |
| `media_embed` | `{ "media_id": string, "caption"?: string, "aspect_ratio": string }` | `src/components/cms/blocks/media-block.tsx` |

---

## 7. Media Asset System

All images, icons, and video assets are stored in Supabase Storage and referenced relationally in the `media` database table.

### Rules & Workflow

1. **No External Host Sourcing:** All assets must be uploaded to managed Supabase Storage buckets.
2. **Mandatory Metadata:** Media records must include explicit `alt_text` and dimensions (`width`, `height`).
3. **Relation Handling:** CMS blocks reference media items via `media_id` string UUIDs inside their `data` JSON payload rather than hardcoding static URLs.

---

## 8. Navigation & Settings Models

### Navigation Model

Manages site header menus, mobile drawers, and footer link hierarchies.

* Managed in the `navigation` table.
* Automatically synchronized with published page routes.
* Supports nested children menu links.

### Global Settings Model

Key-value configuration store for site-wide defaults managed in the `settings` table:

* `site_identity`: Site name, default meta tags, favicon URLs.
* `theme_tokens`: Tailwind design token overrides.
* `social_links`: Official social media channel URLs.

---

## 9. Multilingual Execution & Localization Flow

Stratifit natively supports English (`en`, default) and German (`de`).

```text
User Request (Locale: 'de')
       │
       v
Query Base Entity (en) ──> Query 'translations' table WHERE locale = 'de'
                                     │
                                     ├──> Translation Found? Merge fields over base.
                                     └──> Missing Key? Retain default 'en' string fallback.

```

### Localization Guidelines

1. The base tables (`pages`, `sections`, `content_blocks`) store default English content.
2. German translations are retrieved from `translations` where `locale = 'de'` and merged at runtime before rendering.
3. If a specific German translation key is omitted, the renderer falls back gracefully to the primary English value without breaking or showing empty strings.

---

## 10. End-to-End CMS Rendering Pipeline

```text
1. Client requests URL path (e.g. /services/web-development)
2. App Router resolves route via src/app/[...slug]/page.tsx
3. Fetch page row from Supabase where slug = path AND status = 'published'
4. Fetch active sections ordered by display_order
5. Fetch content blocks for each section ordered by display_order
6. Fetch localization overrides from 'translations' table matching active locale
7. Merge translated fields over default block payloads
8. Map section types to React components via sectionRegistry
9. Map content block types to atomic components
10. Pass motion props to GSAP hooks and render final Server Component tree

```

---

## 11. AI Integration & Automation Rules

AI agents (Content Bot, CMS Bot, Architecture Bot) interact with the CMS under strict operational constraints:

1. **No Direct Production Schema Mutation:** AI agents cannot invent new `block_type` or `component_type` strings without a corresponding OpenSpec proposal and component implementation in `src/components/cms/`.
2. **Schema Validation:** All AI-generated block payloads must pass Zod schema verification in `src/lib/cms/validation.ts` prior to database insertion.
3. **Execution Tracking:** All AI generation tasks (page drafting, copy writing, localization) must write a log record to the `ai_logs` table detailing model inputs, prompt metadata, and resulting output structures.

---

## 12. CMS Governance & Change Management

Any modification to CMS structure, models, or block specs requires:

1. An OpenSpec proposal in `openspec/changes/`.
2. Updates synchronized across `CMS.md`, `DATABASE.md`, and `ARCHITECTURE.md`.
3. An explicit database migration file in `supabase/migrations/` if table columns or constraints change.
4. Passage of Open Code Review checks prior to merging PRs into `main`.
