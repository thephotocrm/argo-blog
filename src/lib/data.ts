// Static JSON imports from synced data (works on Vercel for public pages)
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
import indexingStatusData from '../data/synced/seo/indexing-status-latest.json';
import gscHistoryData from '../data/synced/seo/gsc-history-summary.json';
import directorySubmissionsData from '../data/synced/seo/directory-submissions.json';
import linkBuildingData from '../data/synced/seo/link-building.json';
import growthTasksData from '../data/synced/seo/growth-tasks.json';
import distributionStatusData from '../data/synced/seo/distribution-status.json';
import eeatScorecardData from '../data/synced/seo/eeat-scorecard.json';
import reviewSolicitationData from '../data/synced/seo/review-solicitation.json';

import { readGitHubJSON } from './github-data';

// --- Live GitHub readers for admin SSR pages (read fresh data on every request) ---
// These bypass the static import so admin pages always see the latest committed state.

async function readLiveOrFallback(repoPath: string, fallback: any): Promise<any> {
  try {
    const { data } = await readGitHubJSON(repoPath);
    return data;
  } catch {
    return fallback;
  }
}

export async function getContentQueueLive() {
  return readLiveOrFallback('src/data/synced/seo/content-queue.json', contentQueueData || { items: [] });
}

export async function getAuthorityOutboxLive() {
  return readLiveOrFallback('src/data/synced/seo/authority-outbox.json', authorityOutboxData || { items: [] });
}

export async function getCreatorsLive() {
  return readLiveOrFallback('src/data/synced/creators.json', creatorsData || { creators: [] });
}

export async function getKeywordCandidatesLive() {
  return readLiveOrFallback('src/data/synced/seo/keyword-candidates.json', keywordCandidatesData || { candidates: [] });
}

export async function getTechSeoTasksLive() {
  return readLiveOrFallback('src/data/synced/seo/tech-seo-tasks.json', techSeoTasksData || { tasks: [] });
}

// --- Static data accessors (for public pages & non-writable admin data) ---

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

export function getIndexingStatus() {
  return indexingStatusData || { date: '', total: 0, indexed: 0, crawled_not_indexed: 0, discovered_not_indexed: 0, pages: [] };
}

export function getGscHistory() {
  return gscHistoryData || { lastUpdated: '', dailyTotals: [], topQueriesWithTrends: [] };
}

export function getDirectorySubmissions() {
  return directorySubmissionsData || { items: [] };
}

export function getLinkBuilding() {
  return linkBuildingData || { items: [] };
}

export function getGrowthTasks() {
  return growthTasksData || { tasks: [] };
}

export function getDistributionStatus() {
  return distributionStatusData || { posts: [] };
}

export function getEeatScorecard() {
  return eeatScorecardData || { overallScore: 0, maxScore: 10, checks: [] };
}

export function getReviewSolicitation() {
  return reviewSolicitationData || { targets: [], contacts: [] };
}
