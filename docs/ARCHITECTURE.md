# ARCHITECTURE.md

## 1. Purpose

This document defines the system architecture of the Stratifit Digital Agency platform and CMS.
It outlines how the application is structured, how data flows between Next.js and Supabase, how the CMS dynamically renders pages, how GSAP handles animations, and how AI agents collaborate via OpenSpec and OpenCode.

This architecture serves as the binding blueprint for all OpenSpec changes, database migrations, AI task execution, and pull request reviews.

---

## 2. High-Level System Overview

Stratifit relies on a CMS-driven, AI-augmented, multi-layer architecture designed for modularity, performance, and scalability.

```text
               +----------------------------------+
               |      Client / Browser            |
               +----------------------------------+
                                |
                                v
               +----------------------------------+
               |     Next.js App Router           |
               | (Server & Client Components)     |
               +----------------------------------+
                   |                          |
                   v                          v
  +---------------------------------+   +---------------------------------+
  |      CMS Dynamic Mapper         |   |    GSAP Motion Engine          |
  |  (App Router Component Tree)    |   |    (@gsap/react + Context)    |
  +---------------------------------+   +---------------------------------+
                   |
                   v
  +-----------------------------------------------------------------------+
  |                        Supabase Backend                               |
  |  +----------------+   +-------------------+   +--------------------+  |
  |  | Postgres SQL   |   | Row Level Security|   | Supabase Storage   |  |
  |  | & Migrations   |   | (RLS Policies)    |   | & CDN Assets       |  |
  |  +----------------+   +-------------------+   +--------------------+  |
  |  +-----------------------------------------------------------------+  |
  |  | Edge Functions & Auth (@supabase/ssr)                           |  |
  |  +-----------------------------------------------------------------+  |
  +-----------------------------------------------------------------------+
                                ^
                                |
               +----------------------------------+
               |    OpenCode AI Agent Layer       |
               | (Multi-Bot Orchestration & Specs) |
               +----------------------------------+

```

### Core Architecture Pillars

* **Frontend:** Next.js (App Router, TypeScript)
* **Styling & Motion:** Tailwind CSS, GSAP (`@gsap/react`)
* **Backend & Auth:** Supabase (`@supabase/ssr`, Postgres, Auth, Storage, Edge Functions)
* **CMS Layer:** Custom headless, table-driven CMS stored in Supabase with ISR / Tag Revalidation
* **Agent System:** Multi-bot execution guided by OpenSpec (`openspec/`) and reviewed by OpenCode (`.opencode/`)

---

## 3. Application Structure (Next.js App Router)

```text
src/
├── app/                  → App Router entrypoints, layouts, routes, and API handlers
│   ├── (public)/         → Public CMS-rendered site routes
│   ├── (auth)/           → Authentication routes
│   ├── api/              → Next.js Route Handlers (route.ts)
│   ├── global-error.tsx  → Top-level error recovery
│   ├── layout.tsx        → Root HTML wrapper & global providers
│   └── page.tsx          → Dynamic homepage entry point
├── components/
│   ├── ui/               → Atomic visual UI components (buttons, badges, inputs)
│   ├── layout/           → Layout structures (header, footer, containers, grids)
│   └── cms/              → Dynamic CMS section controllers and block renderers
├── hooks/                → Shared React hooks (e.g., use-media-query.ts)
├── lib/
│   ├── supabase/         → SSR-compatible Supabase clients (server.ts, client.ts)
│   ├── cms/              → CMS query wrappers, cache tags, schema decoders
│   ├── utils/            → Helper utilities (clsx, tailwind-merge)
│   └── types/            → Shared domain models, DB definitions, component props
└── styles/               → Global styling setups and custom keyframes

```

### Core Architectural Rules

1. **App Router Only:** No legacy `pages/` directory allowed.
2. **Server Components First:** Default all components to React Server Components (RSC). Use `'use client'` only when attaching GSAP timelines, browser state, or event listeners.
3. **Strict Boundary Cleanliness:**
* Layout components manage layout structure and grids.
* UI components manage visual styles and micro-states.
* CMS components map data models to corresponding presentation views.



---

## 4. CMS Architecture & Rendering Engine

The CMS stores page hierarchies, sections, content blocks, navigation menus, SEO data, and translation keys directly inside Supabase.

### CMS Rendering Pipeline

```text
URL Request ──> Route Resolver ──> Fetch Page Model (Supabase) ──> Query Active Sections
                                                                        │
Render Page <── Dynamic Component Registry <── Section Models <─────────┘

```

1. **Route Resolution:** Next.js resolves dynamic slug parameters via `app/[...slug]/page.tsx`.
2. **Data Fetching:** Server-side fetching pulls published page metadata, sections, and block contents from Supabase using tag-based caching (`tags: ['cms-page-[slug]']`).
3. **Section Registry Mapping:** Section components are dynamically resolved via an explicit Section Registry:
```typescript
// src/components/cms/section-registry.ts
import dynamic from 'next/dynamic';

export const sectionRegistry = {
  'hero-primary': dynamic(() => import('@/components/cms/sections/hero-primary')),
  'feature-grid': dynamic(() => import('@/components/cms/sections/feature-grid')),
  'contact-form': dynamic(() => import('@/components/cms/sections/contact-form')),
};

```


4. **Multilingual Fallbacks:** Content queries request locale-specific values first. If a translation is missing, the query cleanly falls back to default language strings (`en`).
5. **Cache Invalidation:** Route Handlers or Webhooks trigger `revalidateTag()` upon CMS updates in Supabase.

---

## 5. Supabase Architecture & Data Layer

### Supabase Client Setup (`@supabase/ssr`)

To ensure seamless authentication cookie handling across Next.js Server Components, Server Actions, and Client Components:

* `src/lib/supabase/server.ts`: Handles server-side queries, actions, and API routes.
* `src/lib/supabase/client.ts`: Handles browser-side interactive subscriptions.

### Schema Relationships & Entities

* **`pages`:** Holds routes, titles, status (`draft` | `published`), and SEO metadata.
* **`sections`:** Belongs to `pages`. Defines layout type, position index, and visibility rules.
* **`content_blocks`:** Belongs to `sections`. Stores JSON payload structures, rich text, and assets.
* **`media`:** Stores image/video URLs, alt attributes, dimensions, and Supabase Storage keys.
* **`translations`:** Key-value content pairs tied to specific locale codes.
* **`ai_logs` / `audit_logs`:** Internal system logs tracking changes, spec runs, and bot outputs.

### Security & Row Level Security (RLS)

* **Public Access:** Read-only access to published rows (`status = 'published'`).
* **Admin Access:** Full read/write access granted strictly to authenticated system administrators via JWT roles.
* **Service Role Access:** Reserved strictly for secure backend Edge Functions, OpenCode automated tasks, or Server Actions. Secrets are never exposed to the client.

---

## 6. AI Multi-Bot Architecture

Stratifit uses a modular AI agent architecture where specific models specialize in target domains within the OpenSpec / OpenCode workflow.

| Bot Role | Core Responsibility | Primary Target Output |
| --- | --- | --- |
| **Architecture Bot** | System design, spec creation, schema planning | `openspec/`, `ARCHITECTURE.md` |
| **CMS Bot** | Content models, internationalization, query structures | `src/lib/cms/`, schema SQL |
| **Frontend Bot** | Next.js code, Tailwind execution, GSAP integrations | `src/components/`, `src/app/` |
| **Backend Bot** | Database migrations, RLS policies, Edge Functions | `supabase/` |
| **Content & SEO Bot** | Copywriting, meta tags, multilingual string generation | Content payloads |
| **Review Bot** | Code sanity, lint checking, constraint enforcement | OpenCode PR reviews |

### AI Multi-Agent Workflow Cycle

1. **Spec Creation:** Architecture Bot proposes change specifications in `openspec/changes/`.
2. **Task Distribution:** Task breakdowns are assigned to Frontend, Backend, or CMS Bots.
3. **Execution & Validation:** Agent code generation executes against `PROJECT_RULES.md` and `DESIGN_SYSTEM.md`.
4. **Review & Merge:** Review Bot validates code against OpenCode rules before human merge approval.

---

## 7. Motion & GSAP Architecture

Motion in Stratifit is unified and deterministic, avoiding hydration errors and memory leaks in React Strict Mode.

### Motion Execution Standards

* **Lifecycle Context:** All client-side animations must be scoped inside the `@gsap/react` `useGSAP()` hook or managed explicitly via `gsap.context()`.
* **Zero Layout Shift:** Animate transforms (`x`, `y`, `scale`, `rotation`) and `opacity` exclusively. Never animate layout-triggering properties (`height`, `width`, `top`, `margin`).
* **Accessibility First:** All dynamic GSAP animations must check `window.matchMedia('(prefers-reduced-motion: reduce)')` or standard CSS media queries to ensure comfortable experiences for all users.

---

## 8. API & Data Flow Principles

1. **Server Actions First:** Use Next.js Server Actions for forms, state mutations, and transactional CMS tasks.
2. **Route Handlers (`route.ts`):** Used for external webhooks, automated cron revalidations, and public integrations.
3. **Edge Functions:** Deployed to Supabase Edge Functions for long-running AI processes or background workflows requiring direct service-role privileges.
4. **Data Sanitization & Validation:** All incoming mutation payloads must be strictly validated using Zod schemas before hitting the database layer.

---

## 9. Environment & Deployment Lifecycle

### Environments

* **Development:** Local runtime running against local/staging Supabase instance and Next.js dev server.
* **Staging / Preview:** Automatic Vercel preview builds triggered on branch PRs with isolated test databases.
* **Production:** Production Vercel deployment synced with production Supabase project.

### CI/CD Deployment Flow

```text
Pull Request Created ──> OpenCode Automated Check ──> Human Merge Approval
                                                               │
Deployment Sync <── Automatic Supabase Migrations <── Vercel Production Build

```

---

## 10. Architecture Governance & Change Management

Any modification to system architecture must strictly adhere to the following governance loop:

1. Propose the modification via an OpenSpec change in `openspec/changes/`.
2. Update corresponding documentation files (`ARCHITECTURE.md`, `PROJECT_RULES.md`, `CMS.md`, `DATABASE.md`).
3. Pass Open Code Review automated compliance validation before merging into `main`.
