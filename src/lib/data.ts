// Static JSON imports from synced data (works on Vercel)
import contentQueueData from '../data/synced/seo/content-queue.json';
import authorityOutboxData from '../data/synced/seo/authority-outbox.json';
import creatorsData from '../data/synced/creators.json';
import contentLogData from '../data/synced/seo/content-log.json';
import keywordResearchData from '../data/synced/seo/keyword-research.json';
import keywordCandidatesData from '../data/synced/seo/keyword-candidates.json';
import competitorChangelogData from '../data/synced/seo/competitor-changelog.json';
import discoveryStateData from '../data/synced/discovery-state.json';
import outreachLogData from '../data/synced/outreach-log.json';
import cronJobsData from '../data/synced/cron-jobs.json';
import serpSnapshotData from '../data/synced/seo/serp-snapshot-latest.json';
import contentGapsData from '../data/synced/seo/content-gaps-latest.json';
import techSeoTasksData from '../data/synced/seo/tech-seo-tasks.json';

// Data accessors — read from static imports (deployed via git sync)
export function getContentQueue() {
  return contentQueueData || { items: [] };
}

export function getAuthorityOutbox() {
  return authorityOutboxData || { items: [] };
}

export function getCreators() {
  return creatorsData || { creators: [] };
}

export function getContentLog() {
  return contentLogData || { entries: [] };
}

export function getKeywordResearch() {
  return keywordResearchData || { keywords: [] };
}

export function getKeywordCandidates() {
  return keywordCandidatesData || { candidates: [] };
}

export function getCompetitorChangelog() {
  return competitorChangelogData || { entries: [] };
}

export function getDiscoveryState() {
  return discoveryStateData || {};
}

export function getOutreachLog() {
  return outreachLogData || { entries: [] };
}

export function getCronJobs() {
  return cronJobsData || { jobs: [] };
}

export function getLatestSerpSnapshot() {
  return serpSnapshotData || { keywords: [] };
}

export function getLatestContentGaps() {
  return contentGapsData || { gaps: [] };
}

export function getTechSeoTasks() {
  return techSeoTasksData || { tasks: [] };
}
