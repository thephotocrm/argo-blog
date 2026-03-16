# Argo Blog

## Project
Astro 6 marketing blog for Argo Studio (photography CRM). Deployed to **Vercel** at `blog.argostudio.co`.

## Stack
- **Framework:** Astro 6 (SSR + static hybrid)
- **Adapter:** `@astrojs/vercel`
- **Dependencies:** `marked` (markdown rendering), `googleapis` (GSC/GA4)
- **Node:** >=22.12.0

## Key Directories
```
src/pages/admin/          → Admin dashboard pages (SSR, prerender=false)
src/components/admin/     → Admin layout + components
src/pages/api/            → API routes (auth, GSC, GA4, data writes)
src/lib/data.ts           → Centralized data reader for ~/.openclaw files
src/data/seo/             → Static JSON imports (keyword-research, content-queue snapshots)
src/content/blog/         → Blog post markdown files
src/layouts/              → Base.astro (public), Blog.astro (posts)
```

## Admin Dashboard (`/admin`)
Password-protected (cookie auth via `ADMIN_PASSWORD` env var). Pages:
- `/admin` — Command Center (action items, cron status, creator funnel, GSC/GA4 stats)
- `/admin/content` — Content review queue (approve/reject/publish blog posts)
- `/admin/authority` — Reddit answers + HARO pitches (copy, mark posted/sent)
- `/admin/creators` — Creator pipeline with scores, funnel, outreach
- `/admin/seo` — SERP positions, content gaps, competitors, keyword candidates
- `/admin/reports` — Rendered reports + tech SEO checklist

## Data
- **Live data** read from `~/.openclaw/workspace/argo-data/` via `src/lib/data.ts`
- **Write operations** via API routes: `PATCH /api/content-queue/[slug]`, `PATCH /api/authority-outbox/[id]`, `PATCH /api/creators/[id]`, `PATCH /api/keyword-candidates`, `PATCH /api/tech-seo-tasks/[id]`
- **13 cron jobs** tracked from `~/.openclaw/cron/jobs.json`

## Design System
- Dark admin: `--color-night` (#0b0f1a), `--color-deep-water` (#141829), `--color-fleece-gold` (#c9a227)
- Fonts: Instrument Serif (display), DM Sans (body), Space Mono (mono)
- All admin components use `Dashboard.astro` layout wrapper with subnav

## Auth
- Middleware at `src/middleware.ts` checks `admin_session` cookie for `/admin/*`
- Login at `/admin/login` posts to `/api/auth`
- API write routes also check cookie

## Environment Variables
```
ADMIN_PASSWORD=...
GOOGLE_SERVICE_ACCOUNT_KEY=...   # base64 JSON
GA4_PROPERTY_ID=properties/...
ARGO_DATA_PATH=...               # optional, defaults to ~/.openclaw/workspace/argo-data
```

## Running
```bash
npm run dev    # local dev server
npm run build  # production build
```
