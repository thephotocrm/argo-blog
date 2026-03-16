import type { APIRoute } from 'astro';
import keywordData from '../../data/synced/seo/keyword-research.json';
import contentQueue from '../../data/synced/seo/content-queue.json';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get('type') || 'all';

  const data: Record<string, unknown> = {};

  if (type === 'all' || type === 'keywords') {
    data.keywords = keywordData;
  }

  if (type === 'all' || type === 'content') {
    data.contentQueue = contentQueue;
  }

  if (type === 'all' || type === 'summary') {
    const keywords = keywordData.keywords;
    const statusCounts = {
      not_started: keywords.filter(k => k.status === 'not_started').length,
      in_progress: keywords.filter(k => k.status === 'in_progress').length,
      published: keywords.filter(k => k.status === 'published').length,
    };
    const priorityCounts = {
      high: keywords.filter(k => k.priority === 'high').length,
      medium: keywords.filter(k => k.priority === 'medium').length,
      low: keywords.filter(k => k.priority === 'low').length,
    };
    const totalVolume = keywords.reduce((sum, k) => sum + k.volume, 0);

    data.summary = {
      totalKeywords: keywords.length,
      statusCounts,
      priorityCounts,
      totalSearchVolume: totalVolume,
      contentItems: contentQueue.items.length,
      contentStatuses: {
        pending_review: contentQueue.items.filter(i => i.status === 'pending_review').length,
        published: contentQueue.items.filter(i => i.status === 'published').length,
        draft: contentQueue.items.filter(i => i.status === 'draft').length,
      },
      lastUpdated: keywordData.lastUpdated,
    };
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
