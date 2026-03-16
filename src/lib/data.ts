import fs from 'fs';
import path from 'path';

const HOME = process.env.HOME || '/root';
const DATA_ROOT = process.env.ARGO_DATA_PATH || path.join(HOME, '.openclaw/workspace/argo-data');
const SEO_DIR = path.join(DATA_ROOT, 'seo');
const CRON_FILE = path.join(HOME, '.openclaw/cron/jobs.json');
const BLOG_DIR = process.env.ARGO_BLOG_DIR || path.join(HOME, 'argo-blog/src/content/blog');

export function readJSON(filepath: string): any {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch {
    return null;
  }
}

export function writeJSON(filepath: string, data: any): void {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

export function seoPath(filename: string): string {
  return path.join(SEO_DIR, filename);
}

export function dataPath(filename: string): string {
  return path.join(DATA_ROOT, filename);
}

export function getContentQueue() {
  return readJSON(seoPath('content-queue.json')) || { items: [] };
}

export function getAuthorityOutbox() {
  return readJSON(seoPath('authority-outbox.json')) || { items: [] };
}

export function getCreators() {
  return readJSON(dataPath('creators.json')) || { creators: [] };
}

export function getContentLog() {
  return readJSON(seoPath('content-log.json')) || { entries: [] };
}

export function getKeywordResearch() {
  return readJSON(seoPath('keyword-research.json')) || { keywords: [] };
}

export function getKeywordCandidates() {
  return readJSON(seoPath('keyword-candidates.json')) || { candidates: [] };
}

export function getCompetitorChangelog() {
  return readJSON(seoPath('competitor-changelog.json')) || { entries: [] };
}

export function getDiscoveryState() {
  return readJSON(dataPath('discovery-state.json')) || {};
}

export function getOutreachLog() {
  return readJSON(dataPath('outreach-log.json')) || { entries: [] };
}

export function getCronJobs() {
  return readJSON(CRON_FILE) || { jobs: [] };
}

export function getLatestSerpSnapshot() {
  try {
    const dir = path.join(SEO_DIR, 'serp-snapshots');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().reverse();
    if (files.length === 0) return { keywords: [] };
    return readJSON(path.join(dir, files[0])) || { keywords: [] };
  } catch {
    return { keywords: [] };
  }
}

export function getLatestContentGaps() {
  try {
    const files = fs.readdirSync(SEO_DIR)
      .filter(f => f.startsWith('content-gaps-') && f.endsWith('.json'))
      .sort().reverse();
    if (files.length === 0) return { gaps: [] };
    return readJSON(path.join(SEO_DIR, files[0])) || { gaps: [] };
  } catch {
    return { gaps: [] };
  }
}

export function getReportsList() {
  try {
    const dir = path.join(SEO_DIR, 'reports');
    return fs.readdirSync(dir).sort().reverse();
  } catch {
    return [];
  }
}

export function getReport(name: string) {
  const filePath = path.join(SEO_DIR, 'reports', name);
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

export function getBlogPost(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

export function getTechSeoTasks() {
  const filepath = seoPath('tech-seo-tasks.json');
  let data = readJSON(filepath);
  if (!data) {
    data = {
      tasks: [
        { id: 1, issue: 'OG image returns 404', status: 'open', category: 'meta' },
        { id: 2, issue: 'Missing /blog listing page', status: 'open', category: 'structure' },
        { id: 3, issue: 'Admin/config pages in sitemap', status: 'open', category: 'sitemap' },
        { id: 4, issue: 'Placeholder social media links', status: 'open', category: 'meta' },
      ]
    };
    writeJSON(filepath, data);
  }
  return data;
}
