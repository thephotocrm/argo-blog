# Technical SEO Audit — blog.argostudio.co
**Date:** 2026-03-16  
**Auditor:** Automated (argo-seo-foundation monthly)

---

## Overall Score: ✅ GOOD (with 4 issues to fix)

The site's technical SEO foundation is solid. All critical infrastructure files are in place, meta tags are comprehensive and well-structured, page load times are excellent, and JSON-LD structured data is thorough. Four issues need attention, two of which are high priority.

---

## 1. Infrastructure Files

| File | Status | Notes |
|------|--------|-------|
| `/robots.txt` | ✅ 200 OK | Well-configured. Includes explicit Allow rules for 10 AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.). Sitemap URL present. |
| `/sitemap-index.xml` | ✅ 200 OK | Valid XML. References `sitemap-0.xml` with 66 URLs. |
| `/sitemap-0.xml` | ✅ 200 OK | Valid XML with proper namespace declarations (news, xhtml, image, video). 66 URLs indexed. |
| `/llms.txt` | ✅ 200 OK | Comprehensive — includes product overview, features, pricing, target audience, key differentiators, and blog info. Well-structured for AI consumption. |

---

## 2. Page Sample Audit (5 pages)

### Load Times (curl TTFB)

| Page | Load Time | Status |
|------|-----------|--------|
| `/` (Homepage) | 0.119s | ✅ Excellent |
| `/blog/honeybook-vs-dubsado-for-photographers/` | 0.155s | ✅ Excellent |
| `/for/wedding-photographers/` | 0.230s | ✅ Excellent |
| `/vs/argo-vs-honeybook/` | 0.141s | ✅ Excellent |
| `/tools/pricing-calculator/` | 0.083s | ✅ Excellent |

**All pages well under 3s target.** Average TTFB: ~0.15s. Astro static site generation delivering outstanding performance.

### Canonical URLs

| Page | Canonical Present | Correct |
|------|-------------------|---------|
| `/` | ✅ | ✅ `https://blog.argostudio.co/` |
| `/blog/honeybook-vs-dubsado-for-photographers/` | ✅ | ✅ |
| `/for/wedding-photographers/` | ✅ | ✅ |
| `/vs/argo-vs-honeybook/` | ✅ | ✅ |
| `/tools/pricing-calculator/` | ✅ | ✅ |

### Open Graph Tags

All 5 pages have complete OG tags:
- ✅ `og:title` — present on all pages
- ✅ `og:description` — present on all pages
- ✅ `og:image` — present on all pages
- ✅ `og:url` — present and matches canonical on all pages
- ✅ `og:type` — `website` for landing pages, `article` for blog posts
- ✅ `og:site_name` — "Argo Studio" on all pages

### Twitter Card Tags

All 5 pages have complete Twitter cards:
- ✅ `twitter:card` — `summary_large_image` on all pages
- ✅ `twitter:title`, `twitter:description`, `twitter:image` — present on all

### JSON-LD Structured Data

All pages include 3 base schemas:
- ✅ `Organization` — name, URL, logo, description
- ✅ `WebSite` — name, URL, publisher
- ✅ `SoftwareApplication` — includes pricing ($17), aggregate rating (4.8/5, 47 reviews), feature list

Additional schemas per page type:
- Blog post (HoneyBook vs Dubsado): ✅ `Article` schema with headline, datePublished, author, publisher
- Tools page (Pricing Calculator): ✅ `FAQPage` schema with 4 Q&A pairs

### Meta Keywords

- Present on blog posts, comparison pages, niche pages, and tool pages ✅
- Good keyword targeting per page type

---

## 3. Issues Found

### 🔴 HIGH: OG Image Returns 404

**URL:** `https://blog.argostudio.co/og-images/default.png`  
**Impact:** All pages using the default OG image (homepage, niche pages, comparison pages, tool pages) will show no preview image when shared on social media, Slack, Discord, etc.  
**Fix:** Upload a branded OG image to `/public/og-images/default.png` (recommended: 1200×630px).  
**Pages affected:** At least 50+ pages (everything except blog posts using Unsplash images).

### 🔴 HIGH: /blog Returns 404

**URL:** `https://blog.argostudio.co/blog` and `/blog/`  
**Impact:** The main blog index/listing page returns 404. Multiple internal navigation links point to `/blog` (the "Business" and "Workflow" category links in the nav). This means visitors clicking those nav items hit a dead end.  
**Fix:** Create a blog listing page at `/blog/` or redirect the nav links to working pages.

### 🟡 MEDIUM: Admin Pages in Sitemap

**URLs:** 8 admin pages (`/admin/`, `/admin/competitors/`, `/admin/content/`, etc.)  
**Impact:** Admin dashboard URLs should not be in the public sitemap. They currently 302 redirect (presumably to login), but exposing them:
- Wastes crawl budget
- Reveals internal tooling structure
- Could confuse search engines  
**Fix:** Exclude `/admin/*` from the sitemap. Add `Disallow: /admin/` to robots.txt.

### 🟡 MEDIUM: Social Links Are Placeholders

**Impact:** All social media links in the header and footer (Twitter, Instagram, YouTube) point to `#` — they're placeholder links. Users who click them go nowhere.  
**Fix:** Either populate with real social URLs or remove the social links until accounts are ready.

### ⚠️ LOW: Duplicate Article JSON-LD on Blog Posts

**Page:** `/blog/honeybook-vs-dubsado-for-photographers/`  
**Impact:** Two nearly identical `Article` JSON-LD blocks exist — one with an `image` field and one without. While not harmful, it's technically redundant and could confuse structured data tools.  
**Fix:** Consolidate into a single Article schema that includes the image.

---

## 4. Broken Internal Links Check

| Link | Status | Location |
|------|--------|----------|
| `/blog` | ❌ 404 | Nav bar (Business, Workflow, Marketing links) |
| All other internal links tested | ✅ 200 | — |

All programmatic pages (/for/, /vs/, /alternative/, /integrations/, /tools/) resolve correctly.

---

## 5. Lighthouse Audit (Manual — browser unavailable)

Browser automation was unavailable for this audit cycle. Based on HTML inspection:

- ✅ Every page has `<title>` tags
- ✅ Every page has `<meta name="description">`
- ✅ Every page has canonical links
- ✅ `lang="en"` set on `<html>`
- ✅ Viewport meta tag present
- ✅ Font preconnect hints present (Google Fonts)
- ✅ Favicon configured (SVG)
- ❌ OG image URLs return 404 for default image (see issue above)

---

## 6. Site Statistics

- **Total indexed URLs:** 66
- **Page types:** Homepage (1), Blog posts (4), Alternative pages (6), Comparison pages (8), Niche/city pages (21), Integration pages (8), Tool pages (2), FAQ (1), Admin (8)
- **Content last published:** March 15, 2026
- **Tech stack:** Astro (static site generation)

---

## 7. Recommendations Summary

| Priority | Issue | Effort |
|----------|-------|--------|
| 🔴 High | Upload default OG image to `/public/og-images/default.png` | 10 min |
| 🔴 High | Create `/blog/` listing page or fix nav links | 30 min |
| 🟡 Medium | Exclude `/admin/*` from sitemap and add robots.txt Disallow | 15 min |
| 🟡 Medium | Populate or remove placeholder social links | 10 min |
| ⚠️ Low | Deduplicate Article JSON-LD on blog posts | 15 min |

---

## Month-over-Month Changes

*First audit — no prior baseline to compare.*

---

*Next audit scheduled: April 2026*
