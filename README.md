# Stratifit Digital Agency Platform

Premium multilingual digital agency platform — public marketing website, custom visual CMS, Supabase backend, AI chatbot, leads, and transactional email.

## Stack

- **Next.js 16** (App Router, React Server Components, Server Actions, Route Handlers)
- **React 19** + TypeScript (strict)
- **Tailwind CSS v4** with a token-based design system (dark-first, amber primary)
- **GSAP** for hero / scroll storytelling
- **Supabase** (PostgreSQL, Auth, Storage, RLS) with local CLI + migrations
- **Zod** + **React Hook Form**
- **Nodemailer + AWS SES SMTP** for the multilingual Communication Engine
- **OpenSpec** for feature planning

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open http://localhost:3000.

## Environment Variables

See `.env.example`. Key groups:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — server-only
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `COMMUNICATION_FROM_EMAIL` — Communication Engine (AWS SES SMTP)
- `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` — AI chatbot provider (OpenAI-compatible)
- `NEXT_PUBLIC_SITE_URL` — canonical site URL for SEO
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 measurement ID (e.g. `G-XXXXXXXXXX`); GA4 loads only after the visitor grants the analytics cookie category

Never commit `.env.local`.

## Database

All changes go through migrations in `supabase/migrations/`.

```bash
npx supabase start        # local stack (Docker)
npx supabase db push      # apply pending migrations to linked project
npx supabase gen types typescript --linked > src/types/database.types.ts
npx supabase migration list
npm run check:migrations -- --local-only
```

CI compares the local migration versions with the linked Supabase project on pushes to `main` when the repository secrets `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF` are configured. Pull requests still run the local filename/version check without requiring remote credentials.

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
npm run validate:seed       # static-check supabase/seed.sql
npm run check:seed-rerun    # verify seed writes are safe to rerun
npm run check:migrations    # compare local and linked migration history
```

## Project Structure

```text
src/
├── app/               # routes (public + /admin CMS)
├── components/
│   ├── ui/            # design-system primitives
│   ├── sections/      # public homepage sections
│   ├── forms/         # public forms
│   ├── layout/        # header / footer / navigation
│   ├── chat/          # chat widget
│   └── admin/         # CMS components
├── features/          # feature modules (queries, mutations, schemas)
├── lib/               # shared infrastructure
├── registry/          # section registry
└── types/             # generated Supabase types
supabase/migrations/   # database migrations
docs/                  # architecture, design system, roadmap
openspec/              # feature specs
```

## Documentation

- `docs/PROJECT.md` — product scope and version 1
- `docs/ARCHITECTURE.md` — technical architecture
- `docs/DESIGN_SYSTEM.md` — tokens, typography, components
- `docs/ROADMAP.md` — delivery phases
- `AGENTS.md` — operating rules for AI agents

## Contact

Stratifit Digital Agency
