# Stratifit Digital Agency

## Environment Variables

Copy this file to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Getting Started

```bash
npm install
npm run dev
```

## Tech Stack

- Next.js 14 (App Router, Server Components)
- TypeScript (strict mode)
- Tailwind CSS (dark-mode first)
- Supabase (PostgreSQL, RLS, Storage)
- Zod (runtime validation)
- GSAP (animations)

## Architecture

All content is CMS-driven — no hardcoded text, images, CTAs, or section order.
See `src/app/[...slug]/page.tsx` for the entry point.
