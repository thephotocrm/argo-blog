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
src/lib/data.ts           → Centralized data reader (static JSON imports from synced/)
src/lib/github-data.ts    → GitHub Contents API helper for write operations
src/data/synced/          → Dashboard data synced from VPS via git (SEO, creators, cron, reports)
src/data/seo/             → Legacy static JSON snapshots
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
- **Read path:** `src/lib/data.ts` imports static JSON from `src/data/synced/` (bundled at build time, works on Vercel)
- **Write path:** API PATCH routes use `src/lib/github-data.ts` to commit updates via GitHub Contents API (triggers Vercel redeploy)
- **Sync:** VPS cron (`~/bin/sync-argo-data.sh`) copies `~/.openclaw/workspace/argo-data/` → `src/data/synced/`, commits & pushes every 15 min
- **Write routes:** `PATCH /api/content-queue/[slug]`, `/api/authority-outbox/[id]`, `/api/creators/[id]`, `/api/keyword-candidates`, `/api/tech-seo-tasks/[id]`

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
GITHUB_PAT=...                   # GitHub PAT for write operations (commits via API)
```

## Running
```bash
npm run dev    # local dev server
npm run build  # production build
```
